/* ===========================================================
   INKA GRILL EXPRESS — store.js
   Estado del carrito, modo de entrega, cuenta y pedidos.
   Persistencia con localStorage (demo, sin servidor real).
   =========================================================== */

const Store = (() => {
  const KEYS = {
    cart: "ige_cart",
    mode: "ige_mode",     // { type: "delivery"|"pickup", localId }
    users: "ige_users",
    session: "ige_session",
    orders: "ige_orders",
    coupon: "ige_coupon",
    addresses: "ige_addresses",
    points: "ige_points",
    ratings: "ige_ratings",
  };

  const read = (k, fb) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; }
    catch { return fb; }
  };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  /* ---------------- CARRITO (por líneas) ----------------
     Cada línea: { p: productId, q: qty, opts: [labels], extra: €/u }
     lineId === productId cuando no hay personalización (compatibilidad). */
  const getCart = () => read(KEYS.cart, {});
  const saveCart = (c) => { write(KEYS.cart, c); emit(); };

  const lineKey = (productId, opts) => {
    if (!opts || !opts.length) return productId;
    let h = 0; const s = productId + "|" + opts.join("·");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return productId + "|" + (h >>> 0).toString(36);
  };

  const addLine = (productId, qty = 1, opts = [], extra = 0) => {
    const c = getCart();
    const key = lineKey(productId, opts);
    if (c[key]) c[key].q += qty;
    else c[key] = { p: productId, q: qty, opts: opts || [], extra: extra || 0 };
    if (c[key].q <= 0) delete c[key];
    saveCart(c);
  };
  // Compatibilidad: agregar producto base (sin opciones)
  const addItem = (id, qty = 1) => addLine(id, qty, [], 0);

  const stepLine = (lineId, d) => {
    const c = getCart();
    if (c[lineId]) { c[lineId].q += d; if (c[lineId].q <= 0) delete c[lineId]; saveCart(c); }
    else if (d > 0) addLine(lineId, d, [], 0); // lineId es un productId base
  };
  const setQty = (lineId, qty) => {
    const c = getCart();
    if (!c[lineId]) return;
    if (qty <= 0) delete c[lineId]; else c[lineId].q = qty;
    saveCart(c);
  };
  const removeItem = (lineId) => { const c = getCart(); delete c[lineId]; saveCart(c); };
  const clearCart = () => saveCart({});

  const qtyOf = (productId) => Object.values(getCart()).reduce((a, l) => a + (l.p === productId ? l.q : 0), 0);
  const itemCount = () => Object.values(getCart()).reduce((a, l) => a + l.q, 0);

  const product = (id) => (typeof PRODUCTS !== "undefined") ? PRODUCTS.find(p => p.id === id) : null;
  const lineUnitPrice = (line) => { const p = product(line.p); return p ? p.price + (line.extra || 0) : 0; };

  const subtotal = () => Object.values(getCart()).reduce((sum, l) => sum + lineUnitPrice(l) * l.q, 0);
  const deliveryFee = () => {
    if (getMode().type !== "delivery") return 0;
    const s = subtotal();
    if (s === 0) return 0;
    const c = activeCoupon();
    if (c && c.type === "free_delivery") return 0;
    return s >= DELIVERY.freeFrom ? 0 : DELIVERY.fee;
  };
  const total = () => Math.max(0, subtotal() - discount() + deliveryFee());
  const amountToFreeDelivery = () => Math.max(0, DELIVERY.freeFrom - subtotal());

  /* ---------------- VALORACIONES (estrellas) ---------------- */
  const getRatings = () => read(KEYS.ratings, {});
  const ratingSeed = (pid) => {
    let h = 0; for (const c of String(pid)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return { avg: 4.2 + (h % 8) / 10, count: 12 + (h % 230) };   // 4.2–4.9 · 12–241 opiniones
  };
  const getRating = (pid) => {
    const seed = ratingSeed(pid);
    const mine = getRatings()[pid] || 0;
    const count = seed.count + (mine ? 1 : 0);
    const avg = mine ? (seed.avg * seed.count + mine) / count : seed.avg;
    return { avg: Math.round(avg * 10) / 10, count, mine };
  };
  const rate = (pid, n) => { const r = getRatings(); r[pid] = n; write(KEYS.ratings, r); emit(); };

  /* ---------------- PUNTOS DE FIDELIDAD (Inka Puntos) ---------------- */
  const POINTS_PER_EURO = 5;          // ganas 5 puntos por cada €1
  const REWARD_STEP = 500;            // cada 500 puntos = un premio
  const getPoints = () => read(KEYS.points, 0);
  const addPoints = (n) => { if (n > 0) { write(KEYS.points, getPoints() + Math.round(n)); emit(); } };

  /* ---------------- DIRECCIONES GUARDADAS ---------------- */
  const getAddresses = () => read(KEYS.addresses, []);
  const addAddress = (str) => {
    str = (str || "").trim(); if (!str) return;
    const list = getAddresses();
    if (!list.some(a => a.toLowerCase() === str.toLowerCase())) { list.push(str); write(KEYS.addresses, list); emit(); }
  };
  const removeAddress = (i) => { const list = getAddresses(); list.splice(i, 1); write(KEYS.addresses, list); emit(); };

  /* ---------------- CUPONES ---------------- */
  const COUPONS = {
    INKA10:      { code: "INKA10",      type: "percent",       value: 10, min: 15, label: "10% de descuento" },
    BIENVENIDO:  { code: "BIENVENIDO",  type: "fixed",         value: 5,  min: 20, label: "€5 de descuento" },
    ENVIOGRATIS: { code: "ENVIOGRATIS", type: "free_delivery", value: 0,  min: 15, label: "Envío gratis" },
  };
  const getCouponCode = () => read(KEYS.coupon, null);
  const activeCoupon = () => {
    const code = getCouponCode(); if (!code) return null;
    const c = COUPONS[code]; if (!c) return null;
    return subtotal() >= c.min ? c : null; // deja de aplicar si el carrito baja del mínimo
  };
  const applyCoupon = (code) => {
    code = (code || "").trim().toUpperCase();
    if (!code) return { ok: false, msg: "Escribe un código." };
    const c = COUPONS[code];
    if (!c) return { ok: false, msg: "Código no válido." };
    if (subtotal() < c.min) return { ok: false, msg: `Válido en pedidos desde €${c.min}.` };
    write(KEYS.coupon, code); emit();
    return { ok: true, coupon: c };
  };
  const removeCoupon = () => { localStorage.removeItem(KEYS.coupon); emit(); };
  const discount = () => {
    const c = activeCoupon(); if (!c) return 0;
    const s = subtotal();
    if (c.type === "percent") return Math.round(s * c.value) / 100;
    if (c.type === "fixed") return Math.min(c.value, s);
    return 0;
  };

  /* ---------------- MODO ENTREGA ---------------- */
  const getMode = () => read(KEYS.mode, { type: "delivery", localId: LOCALES[0].id });
  const setMode = (m) => { write(KEYS.mode, m); emit(); };
  const localOf = (id) => LOCALES.find(l => l.id === id) || LOCALES[0];

  /* ---------------- CUENTA ---------------- */
  const getUsers = () => read(KEYS.users, {});
  const getSession = () => read(KEYS.session, null);

  const isEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((e || "").trim());

  const register = ({ name, email, password, phone }) => {
    name = (name || "").trim();
    email = (email || "").trim().toLowerCase();
    phone = (phone || "").trim();
    if (!name || !email || !password) return { ok: false, msg: "Completa los campos obligatorios." };
    if (!isEmail(email)) return { ok: false, msg: "Ingresa un correo electrónico válido." };
    if (password.length < 6) return { ok: false, msg: "La contraseña debe tener al menos 6 caracteres." };
    const users = getUsers();
    if (users[email]) return { ok: false, msg: "Ya existe una cuenta con ese correo." };
    users[email] = { name, email, password, phone };
    write(KEYS.users, users);
    write(KEYS.session, { name, email, phone });
    emit();
    return { ok: true };
  };
  const login = ({ email, password }) => {
    email = (email || "").trim().toLowerCase();
    const users = getUsers();
    const u = users[email];
    if (!u || u.password !== password) return { ok: false, msg: "Correo o contraseña incorrectos." };
    write(KEYS.session, { name: u.name, email, phone: u.phone || "" });
    emit();
    return { ok: true };
  };
  const logout = () => { localStorage.removeItem(KEYS.session); emit(); };

  /* ---------------- PEDIDOS ---------------- */
  const getOrders = () => read(KEYS.orders, []);
  const placeOrder = (info) => {
    const orders = getOrders();
    const id = "IGE-" + Math.floor(100000 + Math.random() * 900000);
    const order = {
      id,
      createdAt: Date.now(),
      items: getCart(),
      mode: getMode(),
      subtotal: subtotal(),
      discount: discount(),
      coupon: activeCoupon() ? activeCoupon().code : null,
      delivery: deliveryFee(),
      total: total(),
      customer: getSession(),
      pointsEarned: Math.round(total() * POINTS_PER_EURO),
      ...info,
    };
    orders.unshift(order);
    write(KEYS.orders, orders);
    addPoints(order.pointsEarned);
    clearCart();
    removeCoupon();
    return order;
  };
  const findOrder = (id) => getOrders().find(o => o.id === (id || "").trim().toUpperCase());

  /* ---------------- EVENTOS ---------------- */
  const listeners = new Set();
  const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
  const emit = () => listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } });

  return {
    getCart, addItem, addLine, stepLine, setQty, removeItem, clearCart, qtyOf, itemCount, product, lineUnitPrice,
    subtotal, deliveryFee, total, amountToFreeDelivery,
    applyCoupon, removeCoupon, activeCoupon, discount, getCouponCode,
    getAddresses, addAddress, removeAddress,
    getPoints, addPoints, POINTS_PER_EURO, REWARD_STEP,
    getRating, rate,
    getMode, setMode, localOf,
    getUsers, getSession, register, login, logout, isEmail,
    getOrders, placeOrder, findOrder,
    subscribe, emit,
  };
})();
