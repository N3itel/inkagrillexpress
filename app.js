/* ===========================================================
   INKA GRILL EXPRESS — app.js
   Inyecta y controla la interfaz compartida (carrito, menú móvil,
   modal de entrega, avisos) y sincroniza el estado en cada página.
   =========================================================== */

const ICONS = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
};
const socialIcons = {
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  tk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3a8.5 8.5 0 0 1-4.5-1.3v6.05A6.25 6.25 0 1 1 10.25 9v3.1a3.15 3.15 0 1 0 2.25 3.02V3h4z"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.2 14.1c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.7-4.4-3.9-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.7.7 1.8.1.1.1.3 0 .4-.4.8-.8.8-.5 1.3.9 1.5 1.8 2 2.4 2.3.3.2.6.1.8-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.1.1.6-.1 1.1z"/></svg>',
};

/* ---------- Inyectar chrome compartido ---------- */
/* Crea una capa de brasas con N chispas aleatorias */
function makeEmbers(n, cls) {
  const d = document.createElement("div");
  d.className = cls;
  d.setAttribute("aria-hidden", "true");
  let s = "";
  for (let i = 0; i < n; i++) {
    const left = (Math.random() * 100).toFixed(2);
    const size = (4 + Math.random() * 6).toFixed(1);
    const dur = (9 + Math.random() * 11).toFixed(1);
    const delay = (Math.random() * 20).toFixed(1);
    const drift = Math.round(Math.random() * 60 - 30);
    s += `<span style="left:${left}%;width:${size}px;height:${size}px;animation-duration:${dur}s;animation-delay:-${delay}s;--drift:${drift}px"></span>`;
  }
  d.innerHTML = s;
  return d;
}

/* Monta brasas dentro de las zonas oscuras (page-hero, footer, cat-strip, bandas marrones) */
function mountBgFx() {
  document.querySelectorAll(".page-hero, .site-footer, .cat-strip, [data-fx-dark]").forEach(el => {
    if (el.classList.contains("fx-done")) return;
    el.classList.add("fx-done", "dark-fx");
    el.insertBefore(makeEmbers(12, "embers-local"), el.firstChild);
  });
}

function injectChrome() {
  if (document.getElementById("ige-chrome")) return;

  // Accesibilidad: enlace "saltar al contenido" + landmark principal
  if (!document.querySelector(".skip-link")) {
    const sk = document.createElement("a");
    sk.className = "skip-link";
    sk.textContent = "Saltar al contenido";
    document.body.insertBefore(sk, document.body.firstChild);
    const mainEl = document.getElementById("appView") ||
      document.querySelector(".site-header ~ section, .site-header ~ .page-hero, .site-header ~ .wrap");
    if (mainEl) {
      if (!mainEl.id) mainEl.id = "contenido";
      mainEl.setAttribute("role", "main");
      mainEl.setAttribute("tabindex", "-1");
      sk.href = "#" + mainEl.id;
    } else { sk.href = "#"; }
  }

  // Fondo animado global: brasas ascendentes (temática al carbón)
  if (!document.querySelector(".embers")) {
    document.body.insertBefore(makeEmbers(18, "embers"), document.body.firstChild);
  }
  mountBgFx();

  const mode = Store.getMode();
  const wrap = document.createElement("div");
  wrap.id = "ige-chrome";
  wrap.innerHTML = `
    <div class="overlay" id="overlay"></div>

    <!-- Menú móvil -->
    <aside class="mobile-nav" id="mobileNav" aria-label="Menú">
      <div class="mn-head">
        <img src="assets/logo.png" alt="Inka Grill Express">
        <button class="icon-btn" id="mnClose" aria-label="Cerrar">${ICONS.close}</button>
      </div>
      <nav>
        <a href="index.html"><span class="e">🏠</span> Inicio</a>
        <a href="menu.html"><span class="e">🍗</span> Menú</a>
        <a href="pedidos.html"><span class="e">📦</span> Mis pedidos</a>
        <a href="locales.html"><span class="e">📍</span> Locales</a>
        <a href="cuenta.html"><span class="e">👤</span> Mi cuenta</a>
      </nav>
      <div class="mn-foot">
        ¿Dudas con tu pedido?<br>Llámanos al <a href="tel:+390551234567">+39 055 123 4567</a>
      </div>
    </aside>

    <!-- Carrito -->
    <aside class="cart-drawer" id="cartDrawer" aria-label="Carrito de compras">
      <div class="cart-head">
        <h3>Tu pedido</h3>
        <button class="icon-btn" id="cartClose" aria-label="Cerrar">${ICONS.close}</button>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-foot" id="cartFoot"></div>
    </aside>

    <!-- Modal modo entrega -->
    <div class="modal" id="modeModal">
      <div class="modal-card">
        <h3>¿Cómo quieres tu pedido?</h3>
        <p class="sub">Elige cómo recibir tu pollito a la brasa.</p>
        <div class="mode-options" id="modeOptions">
          <div class="mode-opt" data-type="delivery">
            <div class="e">🛵</div><h4>Delivery</h4><p>Lo llevamos a tu puerta</p>
          </div>
          <div class="mode-opt" data-type="pickup">
            <div class="e">🏬</div><h4>Recojo en tienda</h4><p>Listo para recoger</p>
          </div>
        </div>
        <div class="field">
          <label for="modeLocal">Local</label>
          <select id="modeLocal"></select>
        </div>
        <button class="btn btn-primary btn-block btn-lg" id="modeSave">Confirmar</button>
      </div>
    </div>

    <div class="modal" id="custModal" onclick="if(event.target===this)closeCustomize()">
      <div class="modal-card cust-card" id="custCard"></div>
    </div>

    <div class="toast-wrap" id="toastWrap"></div>

    <!-- Aviso de cookies -->
    <div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Aviso de cookies">
      <div class="ck-text">
        🍪 Usamos solo <strong>almacenamiento técnico necesario</strong> para que el carrito y tu cuenta funcionen.
        No usamos cookies de seguimiento. <a href="cookies.html" id="ckMore">Más información</a>.
      </div>
      <div class="ck-actions">
        <button class="btn btn-ghost" id="ckEssential">Solo necesarias</button>
        <button class="btn btn-primary" id="ckAccept">Aceptar</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Eventos chrome
  const overlay = document.getElementById("overlay");
  const closeAll = () => {
    document.getElementById("mobileNav").classList.remove("open");
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("modeModal").classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };
  overlay.addEventListener("click", closeAll);
  document.getElementById("mnClose").onclick = closeAll;
  document.getElementById("cartClose").onclick = closeAll;
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });

  // Modal entrega
  fillLocalSelect();
  document.querySelectorAll("#modeOptions .mode-opt").forEach(opt => {
    opt.onclick = () => {
      document.querySelectorAll("#modeOptions .mode-opt").forEach(o => o.classList.remove("sel"));
      opt.classList.add("sel");
    };
  });
  document.getElementById("modeSave").onclick = () => {
    const sel = document.querySelector("#modeOptions .mode-opt.sel");
    const type = sel ? sel.dataset.type : "delivery";
    const localId = document.getElementById("modeLocal").value;
    Store.setMode({ type, localId });
    closeAll();
    toast("Listo · " + (type === "delivery" ? "Delivery" : "Recojo en tienda"), "✅");
  };

  window.IGE_closeAll = closeAll;

  // Aviso de cookies
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    let consent = null;
    try { consent = localStorage.getItem("ige_cookie_consent"); } catch (e) {}
    if (!consent) banner.classList.add("show");
    const setConsent = (val) => {
      try { localStorage.setItem("ige_cookie_consent", val); } catch (e) {}
      banner.classList.remove("show");
    };
    const accept = document.getElementById("ckAccept");
    const essential = document.getElementById("ckEssential");
    const more = document.getElementById("ckMore");
    if (accept) accept.onclick = () => setConsent("all");
    if (essential) essential.onclick = () => setConsent("essential");
    if (more) more.onclick = () => banner.classList.remove("show");
  }
}

function fillLocalSelect() {
  const sel = document.getElementById("modeLocal");
  if (!sel) return;
  sel.innerHTML = LOCALES.map(l => `<option value="${l.id}">${l.name.replace("Inka Grill Express — ", "")}</option>`).join("");
}

/* ---------- Aperturas ---------- */
function openMobileNav() {
  document.getElementById("mobileNav").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function openCart() {
  renderCart();
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function openModeModal() {
  const m = Store.getMode();
  document.querySelectorAll("#modeOptions .mode-opt").forEach(o =>
    o.classList.toggle("sel", o.dataset.type === m.type));
  const sel = document.getElementById("modeLocal");
  if (sel) sel.value = m.localId;
  document.getElementById("modeModal").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

/* ---------- Cabecera dinámica ---------- */
function wireHeader() {
  const ham = document.getElementById("hamburger");
  if (ham) ham.onclick = openMobileNav;
  const cb = document.getElementById("cartBtn");
  if (cb) cb.onclick = openCart;
  const mp = document.getElementById("modePill");
  if (mp) mp.onclick = openModeModal;
  updateModePill();
  updateCartBadge();
  updateAccountLabel();
}

function updateModePill() {
  const m = Store.getMode();
  const local = Store.localOf(m.localId);
  const val = document.getElementById("modeValue");
  const ico = document.getElementById("modeIco");
  const lab = document.getElementById("modeLabel");
  if (val) val.textContent = local.name.replace("Inka Grill Express — ", "");
  if (lab) lab.textContent = m.type === "delivery" ? "Delivery a" : "Recojo en";
  if (ico) ico.textContent = m.type === "delivery" ? "🛵" : "🏬";
}

function updateCartBadge() {
  const n = Store.itemCount();
  document.querySelectorAll(".cart-count").forEach(b => {
    b.textContent = n;
    b.classList.toggle("hidden", n === 0);
  });
}

function updateAccountLabel() {
  const s = Store.getSession();
  const el = document.getElementById("accountLabel");
  if (el) el.textContent = s ? s.name.split(" ")[0] : "Mi cuenta";
}

/* ---------- Render del carrito ---------- */
/* Sugerencias para aumentar el ticket ("Completa tu pedido") */
function upsellHTML() {
  if (typeof PRODUCTS === "undefined") return "";
  const pool = PRODUCTS.filter(p =>
    ["bebidas", "postres", "salsas", "acompanamientos"].includes(p.cat) && !Store.qtyOf(p.id));
  if (!pool.length) return "";
  const seen = {}; const picks = [];
  for (const p of pool) { if (picks.length >= 4) break; if (seen[p.cat]) continue; seen[p.cat] = true; picks.push(p); }
  for (const p of pool) { if (picks.length >= 4) break; if (!picks.includes(p)) picks.push(p); }
  return `
    <div class="upsell">
      <div class="upsell-title">✨ Completa tu pedido</div>
      <div class="upsell-row">
        ${picks.map(p => `
          <button class="upsell-card" onclick="cartStep('${p.id}',1)" title="Añadir ${p.name}">
            ${p.img ? `<img src="${p.img}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ue',textContent:'${p.emoji}'}))">` : `<span class="ue">${p.emoji}</span>`}
            <span class="un">${p.name}</span>
            <span class="up">+ ${formatPrice(p.price)}</span>
          </button>`).join("")}
      </div>
    </div>`;
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const footEl = document.getElementById("cartFoot");
  if (!itemsEl) return;
  const cart = Store.getCart();
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="big">🛒</div>
        <h4>Tu pedido está vacío</h4>
        <p>Agrega tu pollito favorito y arma tu combo.</p>
        <a href="menu.html" class="btn btn-primary" style="margin-top:18px">Ver el menú</a>
      </div>`;
    footEl.innerHTML = "";
    return;
  }

  itemsEl.innerHTML = Object.entries(cart).map(([lineId, line]) => {
    const p = Store.product(line.p); if (!p) return "";
    const q = line.q;
    const unit = Store.lineUnitPrice(line);
    const optsHTML = (line.opts && line.opts.length)
      ? `<div class="cl-opts">${line.opts.join(" · ")}</div>` : "";
    return `
      <div class="cart-line">
        <div class="cl-emoji">${p.emoji}</div>
        <div>
          <div class="cl-name">${p.name}</div>
          ${optsHTML}
          <div class="cl-price">${formatPrice(unit)} c/u</div>
        </div>
        <div class="cl-controls">
          <div class="cl-stepper">
            <button onclick="cartStep('${lineId}',-1)" aria-label="Quitar uno">−</button>
            <span class="q">${q}</span>
            <button onclick="cartStep('${lineId}',1)" aria-label="Agregar uno">+</button>
          </div>
          <button class="cl-remove" onclick="cartRemove('${lineId}')">Eliminar</button>
        </div>
      </div>`;
  }).join("");

  const mode = Store.getMode();
  const sub = Store.subtotal();
  const fee = Store.deliveryFee();
  const disc = Store.discount();
  const coupon = Store.activeCoupon();
  const tot = Store.total();
  const toFree = Store.amountToFreeDelivery();

  let progress = "";
  if (mode.type === "delivery") {
    const pct = Math.min(100, (sub / DELIVERY.freeFrom) * 100);
    progress = toFree > 0
      ? `<div class="cart-progress">Te faltan <strong>${formatPrice(toFree)}</strong> para el delivery gratis
           <div class="bar"><i style="width:${pct}%"></i></div></div>`
      : `<div class="cart-progress free" style="color:var(--green);font-weight:700">🎉 ¡Tienes delivery gratis!
           <div class="bar"><i style="width:100%"></i></div></div>`;
  }

  footEl.innerHTML = `
    ${upsellHTML()}
    ${progress}
    <div class="cart-totals">
      <div class="row"><span>Subtotal</span><span>${formatPrice(sub)}</span></div>
      ${disc > 0 ? `<div class="row disc"><span>Descuento${coupon ? " · " + coupon.code : ""}</span><span>−${formatPrice(disc)}</span></div>` : ""}
      <div class="row"><span>${mode.type === "delivery" ? "Envío" : "Recojo en tienda"}</span>
        <span class="${fee === 0 && mode.type === "delivery" ? "free" : ""}">${mode.type === "delivery" ? (fee === 0 ? "Gratis" : formatPrice(fee)) : "Gratis"}</span></div>
      <div class="row total"><span>Total</span><span>${formatPrice(tot)}</span></div>
    </div>
    <a href="carrito.html" class="btn btn-primary btn-block btn-lg">Finalizar pedido</a>
  `;
}

/* Handlers globales del carrito */
function cartStep(lineId, d) { Store.stepLine(lineId, d); }
function cartRemove(lineId) { Store.removeItem(lineId); }

/* ---------- Toast ---------- */
function toast(msg, emoji = "🔥") {
  const wrap = document.getElementById("toastWrap");
  if (!wrap) return;
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<span class="t-emoji">${emoji}</span> ${msg}`;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 2900);
}

/* ---------- Tarjeta de producto (compartida) ---------- */
function productCardHTML(p) {
  const q = Store.qtyOf(p.id);
  const flags = [];
  if (p.spicy) flags.push('<span class="pc-flag" title="Picante">🌶️</span>');
  if (p.veg) flags.push('<span class="pc-flag" title="Vegetariano">🥬</span>');
  return `
    <article class="product-card" data-id="${p.id}" data-cat="${p.cat}">
      <div class="pc-media">
        ${p.img ? `<img class="pc-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.remove()">` : ""}
        <span class="pc-emoji">${p.emoji}</span>
        ${p.badge ? `<span class="pc-badge">${p.badge}</span>` : ""}
        ${flags.length ? `<div class="pc-flags">${flags.join("")}</div>` : ""}
      </div>
      <div class="pc-body">
        <h3>${p.name}</h3>
        <div class="pc-rating">${starsDisplay(p.id)}</div>
        <p class="pc-desc">${p.desc}</p>
        <div class="pc-foot">
          <span class="pc-price">${formatPrice(p.price)}</span>
          <div class="pc-action" data-action="${p.id}">${addControlHTML(p.id, q)}</div>
        </div>
      </div>
    </article>`;
}

function addControlHTML(id, q) {
  const p = Store.product(id);
  const hasOpts = typeof productOptions === "function" && productOptions(p).length > 0;
  if (hasOpts) {
    return `<button class="add-btn" onclick="openCustomize('${id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Personalizar${q > 0 ? ` · ${q}` : ""}
      </button>`;
  }
  if (q > 0) {
    return `<div class="stepper">
        <button onclick="prodStep('${id}',-1)" aria-label="Quitar uno">−</button>
        <span class="q">${q}</span>
        <button onclick="prodStep('${id}',1)" aria-label="Agregar uno">+</button>
      </div>`;
  }
  return `<button class="add-btn" onclick="prodAdd('${id}')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      Agregar
    </button>`;
}
function prodAdd(id) {
  const p = Store.product(id);
  if (typeof productOptions === "function" && productOptions(p).length) { openCustomize(id); return; }
  Store.addItem(id, 1);
  toast(`${p.name} agregado`, p.emoji);
}
function prodStep(id, d) { Store.stepLine(id, d); }

/* ---------- Modal de personalización ---------- */
let custState = null;
function openCustomize(productId) {
  const p = Store.product(productId);
  if (!p) return;
  const groups = productOptions(p);
  custState = { productId, qty: 1, groups };
  const card = document.getElementById("custCard");
  card.innerHTML = `
    <button class="cust-close" onclick="closeCustomize()" aria-label="Cerrar">✕</button>
    <div class="cust-head">
      ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.remove()">` : `<div class="cust-emoji">${p.emoji}</div>`}
      <div>
        <h3>${p.name}</h3>
        <p>${p.desc || ""}</p>
      </div>
    </div>
    <div class="cust-groups">
      ${groups.map((g, gi) => `
        <div class="cust-group">
          <div class="cust-glabel">${g.label}${g.required ? ' <span class="req">*</span>' : ""}</div>
          <div class="cust-choices">
            ${g.choices.map((ch, ci) => `
              <label class="cust-choice">
                <input type="${g.type === "single" ? "radio" : "checkbox"}" name="g${gi}" value="${gi}-${ci}"
                  ${g.type === "single" && ci === 0 && g.required ? "checked" : ""} onchange="custRecalc()">
                <span class="cc-label">${ch.label}</span>
                ${ch.price ? `<span class="cc-price">+${formatPrice(ch.price)}</span>` : ""}
              </label>`).join("")}
          </div>
        </div>`).join("")}
    </div>
    <div class="cust-foot">
      <div class="cust-qty">
        <button onclick="custQty(-1)" aria-label="Menos">−</button>
        <span id="custQtyN">1</span>
        <button onclick="custQty(1)" aria-label="Más">+</button>
      </div>
      <button class="btn btn-primary btn-lg" id="custAddBtn" onclick="custAdd()">Añadir · ${formatPrice(p.price)}</button>
    </div>`;
  document.getElementById("custModal").classList.add("open");
  document.body.style.overflow = "hidden";
  custRecalc();
}
function closeCustomize() {
  document.getElementById("custModal").classList.remove("open");
  document.body.style.overflow = "";
  custState = null;
}
function custQty(d) {
  if (!custState) return;
  custState.qty = Math.max(1, custState.qty + d);
  document.getElementById("custQtyN").textContent = custState.qty;
  custRecalc();
}
function custCollect() {
  const opts = []; let extra = 0;
  custState.groups.forEach((g, gi) => {
    document.querySelectorAll(`input[name="g${gi}"]:checked`).forEach(inp => {
      const [, ci] = inp.value.split("-").map(Number);
      const ch = g.choices[ci];
      opts.push(ch.label);
      extra += ch.price || 0;
    });
  });
  return { opts, extra };
}
function custRecalc() {
  if (!custState) return;
  const p = Store.product(custState.productId);
  const { extra } = custCollect();
  const unit = p.price + extra;
  const btn = document.getElementById("custAddBtn");
  if (btn) btn.textContent = `Añadir · ${formatPrice(unit * custState.qty)}`;
}
function custAdd() {
  if (!custState) return;
  const p = Store.product(custState.productId);
  const { opts, extra } = custCollect();
  Store.addLine(custState.productId, custState.qty, opts, extra);
  const n = custState.qty;
  closeCustomize();
  toast(`${n}× ${p.name} agregado`, p.emoji);
}
function refreshProductControls() {
  document.querySelectorAll(".pc-action").forEach(el => {
    const id = el.dataset.action;
    el.innerHTML = addControlHTML(id, Store.qtyOf(id));
  });
}

/* ---------- Redes sociales (footer) ---------- */
function renderSocials() {
  const el = document.getElementById("socials");
  if (!el) return;
  el.innerHTML = `
    <a href="#" aria-label="Facebook">${socialIcons.fb}</a>
    <a href="#" aria-label="Instagram">${socialIcons.ig}</a>
    <a href="#" aria-label="TikTok">${socialIcons.tk}</a>
    <a href="#" aria-label="WhatsApp">${socialIcons.wa}</a>`;
}

/* ---------- Inicio ---------- */
/* ---------- Valoraciones (estrellas) ---------- */
function starsDisplay(pid) {
  const r = Store.getRating(pid);
  const pct = Math.round(r.avg / 5 * 100);
  return `<span class="stars-disp" role="img" aria-label="${r.avg} de 5 estrellas">
      <span class="sd-track">★★★★★<span class="sd-fill" style="width:${pct}%">★★★★★</span></span>
    </span><span class="sd-count">${r.avg.toFixed(1)} · ${r.count}</span>`;
}
function starsInput(pid) {
  const mine = Store.getRating(pid).mine;
  return `<span class="stars-input" data-rate="${pid}">${[1, 2, 3, 4, 5].map(n =>
    `<button type="button" class="si-star${n <= mine ? " on" : ""}" data-n="${n}" aria-label="${n} estrella${n > 1 ? "s" : ""}">★</button>`).join("")}</span>`;
}

/* ---------- Estado abierto/cerrado ---------- */
function storeStatus() {
  if (typeof HOURS === "undefined") return { open: false, label: "", detail: "" };
  const now = new Date();
  const d = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const dias = ["el domingo", "el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado"];
  const today = HOURS[d];
  if (today && mins >= toMin(today[0]) && mins < toMin(today[1])) {
    return { open: true, label: "Abierto ahora", detail: "Cierra a las " + today[1] };
  }
  // próxima apertura
  for (let i = 0; i < 8; i++) {
    const dd = (d + i) % 7;
    const h = HOURS[dd];
    if (!h) continue;
    if (i === 0 && mins < toMin(h[0])) return { open: false, label: "Cerrado", detail: "Abre hoy a las " + h[0] };
    if (i >= 1) return { open: false, label: "Cerrado", detail: "Abre " + (i === 1 ? "mañana" : dias[dd]) + " a las " + h[0] };
  }
  return { open: false, label: "Cerrado", detail: "" };
}
function renderStoreStatus() {
  const st = storeStatus();
  if (!st.label) return;
  const html = `<span class="ss-dot ${st.open ? "on" : "off"}"></span><b>${st.label}</b>${st.detail ? ` · <span class="ss-detail">${st.detail}</span>` : ""}`;
  document.querySelectorAll("[data-store-status]").forEach(el => { el.innerHTML = html; el.classList.add("store-status"); });
  // Inyecta también en el footer (persistente en todas las páginas)
  const fb = document.querySelector(".site-footer .footer-brand");
  if (fb) {
    let f = fb.querySelector(".foot-status");
    if (!f) { f = document.createElement("div"); f.className = "foot-status store-status"; fb.appendChild(f); }
    f.innerHTML = html;
  }
}

function initApp() {
  injectChrome();
  wireHeader();
  renderSocials();
  renderStoreStatus();
  setInterval(renderStoreStatus, 60000);

  // Valoraciones: click en estrellas (delegación global)
  if (!window.__ratingWired) {
    window.__ratingWired = true;
    document.addEventListener("click", (e) => {
      const b = e.target.closest(".stars-input .si-star");
      if (!b) return;
      const wrap = b.closest(".stars-input");
      const pid = wrap.dataset.rate, n = +b.dataset.n;
      Store.rate(pid, n);
      wrap.querySelectorAll(".si-star").forEach(s => s.classList.toggle("on", +s.dataset.n <= n));
      if (typeof toast === "function") toast("¡Gracias por tu valoración!", "⭐");
    });
  }

  // Re-montar brasas en zonas oscuras cuando cambia el contenido (navegación SPA)
  let fxScheduled = false;
  const fxObserver = new MutationObserver(() => {
    if (fxScheduled) return;
    fxScheduled = true;
    requestAnimationFrame(() => { fxScheduled = false; mountBgFx(); renderStoreStatus(); });
  });
  fxObserver.observe(document.body, { childList: true, subtree: true });
  // Re-render reactivo
  Store.subscribe(() => {
    updateCartBadge();
    updateModePill();
    updateAccountLabel();
    refreshProductControls();
    if (document.getElementById("cartDrawer").classList.contains("open")) renderCart();
    if (typeof onStoreChange === "function") onStoreChange();
  });
}

/* =========================================================
   PAGOS — logos de marcas (SVG) y validadores de tarjeta
   ========================================================= */
const CARD_BRANDS = {
  visa: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#fff" stroke="#e6e6ee"/><text x="20" y="18" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-style="italic" font-size="11" fill="#1A1F71" letter-spacing=".5">VISA</text></svg>`,
  mastercard: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#fff" stroke="#e6e6ee"/><circle cx="17" cy="13" r="7" fill="#EB001B"/><circle cx="23" cy="13" r="7" fill="#F79E1B"/><path d="M20 8a7 7 0 0 0 0 10 7 7 0 0 0 0-10z" fill="#FF5F00"/></svg>`,
  amex: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#2E77BC"/><text x="20" y="16" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-size="8" fill="#fff" letter-spacing=".3">AMEX</text></svg>`,
  maestro: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#fff" stroke="#e6e6ee"/><circle cx="17" cy="13" r="7" fill="#0099DF"/><circle cx="23" cy="13" r="7" fill="#ED0006"/><path d="M20 8a7 7 0 0 0 0 10 7 7 0 0 0 0-10z" fill="#6C6BBD"/></svg>`,
  paypal: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#fff" stroke="#e6e6ee"/><text x="20" y="17" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="800" font-style="italic" font-size="9"><tspan fill="#003087">Pay</tspan><tspan fill="#009CDE">Pal</tspan></text></svg>`,
  satispay: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#F94B4B"/><text x="20" y="18" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="13" fill="#fff">S</text></svg>`,
  cash: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#2e7d4f"/><text x="20" y="18" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="13" fill="#fff">€</text></svg>`,
  generic: `<svg class="brand-badge" viewBox="0 0 40 26" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="26" rx="4" fill="#fff" stroke="#e6e6ee"/><rect x="5" y="9" width="30" height="3.4" rx="1.7" fill="#c9c9d6"/><rect x="5" y="15" width="14" height="2.6" rx="1.3" fill="#dcdce5"/></svg>`,
};
const BRAND_NAMES = { visa: "Visa", mastercard: "Mastercard", amex: "American Express", maestro: "Maestro", generic: "Tarjeta" };
function cardBrandSVG(b) { return CARD_BRANDS[b] || CARD_BRANDS.generic; }
function brandName(b) { return BRAND_NAMES[b] || "Tarjeta"; }

/* Detecta la marca a partir del número (solo dígitos) */
function detectBrand(num) {
  num = (num || "").replace(/\D/g, "");
  if (/^4/.test(num)) return "visa";
  if (/^3[47]/.test(num)) return "amex";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(num)) return "mastercard";
  if (/^(5018|5020|5038|56|57|58|6304|6759|676[1-3]|50|6)/.test(num)) return "maestro";
  return "generic";
}
/* Algoritmo de Luhn */
function luhnValid(num) {
  num = (num || "").replace(/\D/g, "");
  if (num.length < 12) return false;
  let sum = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = parseInt(num[i], 10);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}
/* Formatea el número con espacios (Amex 4-6-5, resto 4-4-4-4) */
function formatCardNumber(num, brand) {
  num = (num || "").replace(/\D/g, "");
  const max = brand === "amex" ? 15 : 16;
  num = num.slice(0, max);
  const groups = brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
  const out = []; let i = 0;
  for (const g of groups) { if (i >= num.length) break; out.push(num.slice(i, i + g)); i += g; }
  return out.join(" ");
}
/* Vencimiento MM/AA válido y no vencido */
function validExpiry(exp) {
  const m = /^(\d{2})\/(\d{2})$/.exec((exp || "").trim());
  if (!m) return false;
  const mm = +m[1], yy = 2000 + +m[2];
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const end = new Date(yy, mm, 0, 23, 59, 59); // último día del mes
  return end >= now;
}

document.addEventListener("DOMContentLoaded", initApp);
