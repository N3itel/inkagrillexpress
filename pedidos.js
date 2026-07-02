/* =========================================================
   PEDIDOS — Inka Grill Express
   Seguimiento de pedidos: confirmación, estados y historial.
   ========================================================= */

/* Estados según el tiempo transcurrido desde el pedido (demo).
   delivery: recibido → preparando → en camino → entregado
   pickup:   recibido → preparando → listo     → recogido   */
const STEPS = {
  delivery: [
    { key: "recibido",   icon: "📝", title: "Pedido recibido",   desc: "Confirmamos tu pedido." },
    { key: "preparando", icon: "👨‍🍳", title: "En preparación",   desc: "Tu pollo está al carbón." },
    { key: "camino",     icon: "🛵", title: "En camino",          desc: "El repartidor va hacia ti." },
    { key: "entregado",  icon: "🎉", title: "Entregado",          desc: "¡Buen provecho!" },
  ],
  pickup: [
    { key: "recibido",   icon: "📝", title: "Pedido recibido",   desc: "Confirmamos tu pedido." },
    { key: "preparando", icon: "👨‍🍳", title: "En preparación",   desc: "Tu pollo está al carbón." },
    { key: "listo",      icon: "🛍️", title: "Listo para recoger", desc: "Pásalo a buscar al local." },
    { key: "recogido",   icon: "🎉", title: "Recogido",           desc: "¡Buen provecho!" },
  ],
};

/* Índice del paso actual en base a minutos transcurridos */
function currentStep(order) {
  const mins = (Date.now() - order.createdAt) / 60000;
  if (mins < 2)  return 0;
  if (mins < 12) return 1;
  if (mins < 25) return 2;
  return 3;
}

/* =========================================================
   SEGUIMIENTO EN VIVO DEL REPARTIDOR (mapa)
   ========================================================= */
const RIDER_STATE = { map: null, courier: null, order: null };

function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }

/* Destino simulado a partir del código del pedido (determinista, ~1-2 km del local) */
function simulatedDest(order, origin) {
  const h = hashStr(order.id || "x");
  const ang = (h % 360) * Math.PI / 180;
  const dist = 0.010 + (h % 80) / 10000; // ~0.010–0.018°
  return [origin[0] + Math.sin(ang) * dist, origin[1] + Math.cos(ang) * dist * 1.35];
}

/* Progreso del reparto según minutos (alineado con currentStep: prep<12, ruta 12-25) */
function trackProgress(order) {
  const mins = (Date.now() - order.createdAt) / 60000;
  if (mins < 12) return { phase: "prep", p: 0, eta: Math.max(1, Math.ceil(25 - mins)) };
  if (mins < 25) return { phase: "route", p: Math.min(1, (mins - 12) / 13), eta: Math.max(1, Math.ceil(25 - mins)) };
  return { phase: "done", p: 1, eta: 0 };
}

function etaText(order) {
  if (order.mode.type !== "delivery") {
    const mins = (Date.now() - order.createdAt) / 60000;
    return mins < 12 ? "👨‍🍳 Preparando tu pedido…" : "🛍️ ¡Listo para recoger!";
  }
  const t = trackProgress(order);
  if (t.phase === "prep") return "👨‍🍳 Preparando · llega en ~" + t.eta + " min";
  if (t.phase === "route") return "🛵 En camino · llega en ~" + t.eta + " min";
  return "🎉 Entregado · ¡buen provecho!";
}

function stopTracking() {
  if (RIDER_STATE.map) { try { RIDER_STATE.map.remove(); } catch (e) {} }
  RIDER_STATE.map = null; RIDER_STATE.courier = null; RIDER_STATE.order = null;
}

function initDeliveryTracker(order) {
  RIDER_STATE.order = order;
  const el = document.getElementById("deliveryMap");
  if (!el) return;

  const local = Store.localOf(order.mode.localId);
  const origin = (local && local.lat != null) ? [local.lat, local.lng] : [43.7711, 11.2556];

  // limpiar instancia previa
  if (RIDER_STATE.map) { try { RIDER_STATE.map.remove(); } catch (e) {} RIDER_STATE.map = null; }

  if (typeof L === "undefined") {
    el.innerHTML = `<div class="map-fallback">🗺️ El mapa en vivo aparece al abrir la página en un navegador con conexión.<br><span class="muted">${etaText(order)}</span></div>`;
    return;
  }

  const isDelivery = order.mode.type === "delivery";
  const dest = isDelivery ? simulatedDest(order, origin) : origin;

  const map = L.map(el, { zoomControl: true, attributionControl: true, scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: "© OpenStreetMap",
  }).addTo(map);

  const pin = (cls, e) => L.divIcon({ className: "", html: `<div class="map-pin ${cls}">${e}</div>`, iconSize: [36, 36], iconAnchor: [18, 18] });
  L.marker(origin, { icon: pin("shop", "🍗") }).addTo(map).bindPopup(local ? local.name : "Local");

  if (isDelivery) {
    L.marker(dest, { icon: pin("home", "🏠") }).addTo(map).bindPopup(order.address || "Tu dirección");
    L.polyline([origin, dest], { color: "#b01e2e", weight: 4, opacity: .6, dashArray: "8 8" }).addTo(map);
    RIDER_STATE.courier = L.marker(origin, { icon: pin("rider", "🛵") }).addTo(map);
    map.fitBounds([origin, dest], { padding: [42, 42] });
  } else {
    map.setView(origin, 15);
  }

  RIDER_STATE.map = map;
  updateRider();
  setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 220);
}

function updateRider() {
  const order = RIDER_STATE.order;
  if (!order) return;
  const etaEl = document.getElementById("tmEta");
  if (etaEl) etaEl.textContent = etaText(order);
  if (order.mode.type !== "delivery" || !RIDER_STATE.courier) return;
  const local = Store.localOf(order.mode.localId);
  const origin = [local.lat, local.lng];
  const dest = simulatedDest(order, origin);
  const t = trackProgress(order);
  RIDER_STATE.courier.setLatLng([
    origin[0] + (dest[0] - origin[0]) * t.p,
    origin[1] + (dest[1] - origin[1]) * t.p,
  ]);
}

/* Refresco ligero: actualiza pasos + ETA + repartidor SIN reconstruir el DOM (mantiene el mapa) */
function tickTracking() {
  let order = RIDER_STATE.order;
  if (!order) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("nuevo") || params.get("id");
    order = id ? Store.findOrder(id) : null;
  } else {
    order = Store.findOrder(order.id) || order;
  }
  if (!order) return;
  RIDER_STATE.order = order;

  const idx = currentStep(order);
  const flow = STEPS[order.mode.type] || STEPS.delivery;
  document.querySelectorAll(".track-step").forEach((node, i) => {
    node.classList.toggle("done", i < idx);
    node.classList.toggle("active", i === idx);
    const dot = node.querySelector(".dot");
    if (dot) dot.textContent = i < idx ? "✓" : (flow[i] ? flow[i].icon : "");
  });

  // si Leaflet cargó después del primer render, construir el mapa ahora
  if (!RIDER_STATE.map && typeof L !== "undefined" && document.getElementById("deliveryMap")) {
    initDeliveryTracker(order); return;
  }
  updateRider();
}

function fmtDateP(ts) {
  try {
    return new Date(ts).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch { return ""; }
}

function orderItemsList(order) {
  return Object.entries(order.items || {}).map(([lineId, line]) => {
    // Compatibilidad: líneas nuevas {p,q,opts,extra} o formato viejo (número)
    const isLine = line && typeof line === "object";
    const p = Store.product(isLine ? line.p : lineId);
    const q = isLine ? line.q : line;
    const extra = isLine ? (line.extra || 0) : 0;
    const opts = isLine ? (line.opts || []) : [];
    if (!p) return "";
    const unit = p.price + extra;
    const optsHTML = opts.length ? `<br><span class="oi-opts">${opts.join(" · ")}</span>` : "";
    return `<div class="oi-row"><span>${q}× ${p.emoji} ${p.name}${optsHTML}</span><span>${formatPrice(unit * q)}</span></div>
      <div class="oi-rate"><span>¿Qué te pareció?</span>${starsInput(p.id)}</div>`;
  }).join("");
}

/* ---------- Tarjeta de seguimiento de un pedido ---------- */
function trackingCardHTML(order, isNew) {
  const flow = STEPS[order.mode.type] || STEPS.delivery;
  const idx = currentStep(order);
  const local = Store.localOf(order.mode.localId);

  const steps = flow.map((s, i) => {
    const cls = i < idx ? "done" : (i === idx ? "active" : "");
    const dotContent = i < idx ? "✓" : s.icon;
    return `
      <div class="track-step ${cls}">
        <div class="dot-col"><div class="dot">${dotContent}</div><div class="line"></div></div>
        <div class="st-body"><h4>${s.title}</h4><p>${s.desc}</p></div>
      </div>`;
  }).join("");

  const banner = isNew
    ? `<div class="alert ok" style="margin-bottom:22px">✅ <strong>¡Pedido confirmado!</strong> Guarda tu código <strong>${order.id}</strong> para seguirlo.${order.pointsEarned ? ` <br>🔥 Ganaste <strong>${order.pointsEarned} Inka Puntos</strong> con este pedido.` : ""}</div>`
    : "";

  return `
    ${banner}
    <div class="card" style="margin-bottom:24px">
      <div class="track-head">
        <div>
          <span class="eyebrow" style="color:var(--gold)">Pedido</span>
          <h2 style="font-family:var(--font-display); color:var(--brown); font-size:28px">${order.id}</h2>
          <p class="muted" style="font-size:14px">${fmtDateP(order.createdAt)} · ${order.mode.type === "delivery" ? "🛵 Delivery" : "🏠 Recojo en tienda"}${order.when && order.when !== "Lo antes posible" ? ` · ⏰ ${order.when}` : ""}</p>
        </div>
        <div class="track-total">
          <span>Total</span><b>${formatPrice(order.total)}</b>
        </div>
      </div>

      <div class="track-steps" style="margin:26px 0">${steps}</div>

      <div class="track-map-wrap">
        <div class="tm-head">
          <div class="tm-status"><span class="tm-dot"></span><span id="tmEta">${etaText(order)}</span></div>
          <span class="tm-note muted">${order.mode.type === "delivery" ? "Seguimiento en vivo · ubicación simulada" : "Recojo en tienda"}</span>
        </div>
        <div id="deliveryMap" class="delivery-map"></div>
        <div class="tm-legend">
          ${order.mode.type === "delivery"
            ? `<span><i class="lg">🍗</i> Local</span><span><i class="lg">🛵</i> Repartidor</span><span><i class="lg">🏠</i> Tu dirección</span>`
            : `<span><i class="lg">🍗</i> Recoge aquí: ${local.name.replace("Inka Grill Express — ", "")}</span>`}
        </div>
      </div>

      <div class="track-detail">
        <div class="td-col">
          <h5>${order.mode.type === "delivery" ? "Entrega en" : "Recoger en"}</h5>
          <p>${order.mode.type === "delivery"
              ? (order.address || "—") + "<br><span class='muted'>desde " + local.name.replace("Inka Grill Express — ", "") + "</span>"
              : local.name.replace("Inka Grill Express — ", "") + "<br><span class='muted'>" + local.address + "</span>"}</p>
        </div>
        <div class="td-col">
          <h5>Contacto</h5>
          <p>${order.name || "—"}<br><span class="muted">${order.phone || ""}</span></p>
        </div>
      </div>

      <div class="order-items">
        <h5 style="margin:8px 0 10px">Tu pedido</h5>
        ${orderItemsList(order)}
        <div class="oi-row oi-sum"><span>Subtotal</span><span>${formatPrice(order.subtotal)}</span></div>
        ${order.discount > 0 ? `<div class="oi-row oi-sum" style="color:var(--green)"><span>Descuento${order.coupon ? " · " + order.coupon : ""}</span><span>−${formatPrice(order.discount)}</span></div>` : ""}
        <div class="oi-row oi-sum"><span>Envío</span><span>${order.delivery > 0 ? formatPrice(order.delivery) : "Gratis"}</span></div>
        <div class="oi-row oi-total"><span>Total</span><span>${formatPrice(order.total)}</span></div>
      </div>
    </div>`;
}

/* ---------- Buscador de pedido por código ---------- */
function lookupBoxHTML() {
  return `
    <div class="card lookup-card">
      <h3 style="font-family:var(--font-body); font-weight:800; color:var(--brown); margin-bottom:6px">¿Buscas un pedido?</h3>
      <p class="muted" style="font-size:14px; margin-bottom:16px">Ingresa tu código de pedido (ej. IGE-123456).</p>
      <div class="lookup-row">
        <input id="lookupInput" placeholder="IGE-XXXXXX" style="text-transform:uppercase">
        <button class="btn btn-primary" onclick="doLookup()">Buscar</button>
      </div>
      <div id="lookupAlert"></div>
    </div>`;
}

/* ---------- Historial ---------- */
function historyHTML(currentId) {
  const orders = Store.getOrders().filter(o => o.id !== currentId);
  if (!orders.length) return "";
  const rows = orders.map(o => `
    <a href="pedidos.html?id=${encodeURIComponent(o.id)}" class="order-row">
      <div>
        <div class="or-id">${o.id}</div>
        <div class="or-meta">${fmtDateP(o.createdAt)} · ${o.mode.type === "delivery" ? "🛵 Delivery" : "🏠 Recojo"}</div>
      </div>
      <div class="or-total">${formatPrice(o.total)}</div>
    </a>`).join("");
  return `
    <div style="margin-top:30px">
      <h3 style="font-family:var(--font-body); font-weight:800; color:var(--brown); margin-bottom:14px">${currentId ? "Otros pedidos" : "Historial de pedidos"}</h3>
      <div class="order-list">${rows}</div>
    </div>`;
}

/* ---------- Render principal ---------- */
function renderOrders() {
  const root = document.getElementById("ordersRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const newId = params.get("nuevo");
  const lookId = params.get("id");
  const targetId = newId || lookId;

  let html = "";

  if (targetId) {
    const order = Store.findOrder(targetId);
    if (order) {
      html += trackingCardHTML(order, !!newId);
      html += `<a href="pedidos.html" class="btn btn-ghost" style="margin-bottom:8px">← Ver todos mis pedidos</a>`;
      html += historyHTML(order.id);
    } else {
      html += `<div class="alert err" style="margin-bottom:20px">No encontramos el pedido <strong>${targetId}</strong>.</div>`;
      html += lookupBoxHTML();
    }
  } else {
    const orders = Store.getOrders();
    html += lookupBoxHTML();
    if (orders.length) {
      html += historyHTML(null);
    } else {
      html += `
        <div class="empty-orders">
          <div class="eo-emoji">🍗</div>
          <h3>Todavía no has hecho pedidos</h3>
          <p class="muted">Cuando hagas tu primer pedido, podrás seguirlo aquí en tiempo real.</p>
          <a href="menu.html" class="btn btn-primary btn-lg" style="margin-top:12px">Ver el menú</a>
        </div>`;
    }
  }

  root.innerHTML = html;

  // Mapa de seguimiento si se muestra un pedido
  const shown = targetId ? Store.findOrder(targetId) : null;
  if (shown && document.getElementById("deliveryMap")) initDeliveryTracker(shown);
  else stopTracking();
}

function doLookup() {
  const val = (document.getElementById("lookupInput").value || "").trim().toUpperCase();
  const alertBox = document.getElementById("lookupAlert");
  if (!val) { alertBox.innerHTML = `<div class="alert err" style="margin-top:14px">Ingresa un código.</div>`; return; }
  const order = Store.findOrder(val);
  if (!order) { alertBox.innerHTML = `<div class="alert err" style="margin-top:14px">No encontramos ese pedido.</div>`; return; }
  window.location.href = "pedidos.html?id=" + encodeURIComponent(order.id);
}

/* Auto-refresco del seguimiento (anima repartidor + actualiza pasos sin rebuild) */
let trackTimer = null;
function startAutoRefresh() {
  if (trackTimer) clearInterval(trackTimer);
  const params = new URLSearchParams(window.location.search);
  if (params.get("nuevo") || params.get("id")) {
    trackTimer = setInterval(tickTracking, 3000);
  }
}

function onStoreChange() { renderOrders(); }

document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
  startAutoRefresh();
});
