/* ===========================================================
   INKA GRILL EXPRESS — carrito.js (checkout)
   =========================================================== */

let coPay = "card"; // card | paypal | satispay | cash

function renderCheckout() {
  const root = document.getElementById("checkoutRoot");
  const cart = Store.getCart();
  const ids = Object.keys(cart);

  if (ids.length === 0) {
    root.innerHTML = `
      <div class="card" style="text-align:center;max-width:560px;margin:0 auto">
        <div style="font-size:64px">🛒</div>
        <h2 class="display" style="color:var(--brown);margin:12px 0 8px">Tu pedido está vacío</h2>
        <p style="color:var(--muted);margin-bottom:22px">Agrega tu pollito favorito y vuelve para confirmar.</p>
        <a href="menu.html" class="btn btn-primary btn-lg">Ir al menú</a>
      </div>`;
    return;
  }

  const mode = Store.getMode();
  const local = Store.localOf(mode.localId);
  const session = Store.getSession();
  const sub = Store.subtotal();
  const fee = Store.deliveryFee();
  const tot = Store.total();
  const belowMin = sub < DELIVERY.minOrder;

  root.innerHTML = `
    <div style="display:grid;gap:28px;grid-template-columns:1fr;align-items:start" class="checkout-grid">
      <!-- Columna izquierda: items + datos -->
      <div style="display:flex;flex-direction:column;gap:24px">
        <div class="card">
          <h3 class="display" style="font-size:22px;color:var(--brown);margin-bottom:18px">Tu selección</h3>
          <div id="checkoutItems" style="display:flex;flex-direction:column;gap:12px"></div>
          <a href="menu.html" class="btn btn-ghost" style="margin-top:18px">+ Agregar más platos</a>
        </div>

        <div class="card">
          <h3 class="display" style="font-size:22px;color:var(--brown);margin-bottom:6px">Modo de entrega</h3>
          <div class="mode-options" style="margin:16px 0">
            <div class="mode-opt ${mode.type === "delivery" ? "sel" : ""}" data-co-mode="delivery">
              <div class="e">🛵</div><h4>Delivery</h4><p>A tu puerta</p>
            </div>
            <div class="mode-opt ${mode.type === "pickup" ? "sel" : ""}" data-co-mode="pickup">
              <div class="e">🏬</div><h4>Recojo en tienda</h4><p>Listo para ti</p>
            </div>
          </div>
          <div class="field">
            <label for="coLocal">Local</label>
            <select id="coLocal">${LOCALES.map(l => `<option value="${l.id}" ${l.id === mode.localId ? "selected" : ""}>${l.name.replace("Inka Grill Express — ", "")}</option>`).join("")}</select>
          </div>
        </div>

        <div class="card">
          <h3 class="display" style="font-size:22px;color:var(--brown);margin-bottom:18px">Tus datos</h3>
          <div class="field"><label for="coName">Nombre y apellido</label><input id="coName" value="${session ? session.name : ""}" autocomplete="name" placeholder="Ej. Mario Rossi"></div>
          <div class="field"><label for="coEmail">Correo (para tu recibo)</label><input id="coEmail" type="email" value="${session ? session.email : ""}" autocomplete="email" placeholder="tucorreo@email.com"></div>
          <div class="field"><label for="coPhone">Teléfono</label><input id="coPhone" type="tel" value="${session && session.phone ? session.phone : ""}" autocomplete="tel" placeholder="+39 ..."></div>
          <div id="coAddressWrap" class="field" style="${mode.type === "delivery" ? "" : "display:none"}">
            <label for="coAddress">Dirección de entrega</label>
            ${Store.getAddresses().length ? `<div class="saved-addr">${Store.getAddresses().map((a, i) => `<button type="button" class="addr-chip" onclick="coPickAddr(${i})">📍 ${a}</button>`).join("")}</div>` : ""}
            <input id="coAddress" autocomplete="street-address" placeholder="Via, número, ciudad" value="${Store.getAddresses()[0] || ""}">
            <label class="save-addr-row"><input type="checkbox" id="coSaveAddr"> Guardar esta dirección para la próxima</label>
          </div>
          <div class="field"><label for="coWhen">¿Cuándo lo quieres?</label>
            <select id="coWhen">
              <option value="">Lo antes posible (25–35 min)</option>
              ${scheduleSlots().map(s => `<option value="${s}">${s}</option>`).join("")}
            </select>
          </div>
          <div class="field" style="margin-bottom:0"><label for="coNotes">Notas (opcional)</label><textarea id="coNotes" rows="2" placeholder="Sin ají, tocar timbre, etc."></textarea></div>
        </div>

        <div class="card" id="payCard">
          <h3 class="display" style="font-size:22px;color:var(--brown);margin-bottom:6px">Método de pago</h3>
          <p class="muted" style="font-size:13px;margin-bottom:16px">Elige cómo quieres pagar tu pedido.</p>
          <div class="pay-methods" id="payMethods">
            ${payTile("card", "Tarjeta", `${cardBrandSVG("visa")}${cardBrandSVG("mastercard")}`)}
            ${payTile("paypal", "PayPal", cardBrandSVG("paypal"))}
            ${payTile("satispay", "Satispay", cardBrandSVG("satispay"))}
            ${payTile("cash", "Efectivo / Contrassegno", cardBrandSVG("cash"))}
          </div>
          <div id="payBody" style="margin-top:18px"></div>
        </div>
      </div>

      <!-- Columna derecha: resumen sticky -->
      <div class="card" style="position:sticky;top:100px">
        <h3 class="display" style="font-size:22px;color:var(--brown);margin-bottom:16px">Resumen</h3>
        <div id="coSummary"></div>
        ${belowMin ? `<div class="alert err" style="margin-top:14px">El pedido mínimo es ${formatPrice(DELIVERY.minOrder)}. Te faltan ${formatPrice(DELIVERY.minOrder - sub)}.</div>` : ""}
        <button class="btn btn-primary btn-block btn-lg" id="placeBtn" style="margin-top:16px" ${belowMin ? "disabled style='opacity:.5;cursor:not-allowed;margin-top:16px'" : ""}>
          Confirmar pedido · ${formatPrice(tot)}
        </button>
        <p class="form-note">Al confirmar aceptas nuestros términos y condiciones.</p>
      </div>
    </div>`;

  renderCheckoutItems();
  renderCheckoutSummary();
  wireCheckout();
}

function renderCheckoutItems() {
  const el = document.getElementById("checkoutItems");
  if (!el) return;
  const cart = Store.getCart();
  el.innerHTML = Object.entries(cart).map(([lineId, line]) => {
    const p = Store.product(line.p); if (!p) return "";
    const q = line.q;
    const unit = Store.lineUnitPrice(line);
    const optsHTML = (line.opts && line.opts.length) ? `<div class="cl-opts">${line.opts.join(" · ")}</div>` : "";
    return `
      <div class="cart-line">
        <div class="cl-emoji">${p.emoji}</div>
        <div>
          <div class="cl-name">${p.name}</div>
          ${optsHTML}
          <div class="cl-price">${formatPrice(unit)} c/u · ${formatPrice(unit * q)}</div>
        </div>
        <div class="cl-controls">
          <div class="cl-stepper">
            <button onclick="coStep('${lineId}',-1)">−</button>
            <span class="q">${q}</span>
            <button onclick="coStep('${lineId}',1)">+</button>
          </div>
          <button class="cl-remove" onclick="coRemove('${lineId}')">Eliminar</button>
        </div>
      </div>`;
  }).join("");
}

function renderCheckoutSummary() {
  const el = document.getElementById("coSummary");
  if (!el) return;
  const mode = Store.getMode();
  const sub = Store.subtotal();
  const fee = Store.deliveryFee();
  const disc = Store.discount();
  const tot = Store.total();
  const n = Store.itemCount();
  const coupon = Store.activeCoupon();

  const couponUI = coupon
    ? `<div class="coupon-applied">
         <span>🏷️ <b>${coupon.code}</b> · ${coupon.label}</span>
         <button type="button" onclick="coRemoveCoupon()" aria-label="Quitar cupón">✕</button>
       </div>`
    : `<div class="coupon-row">
         <input id="coCoupon" placeholder="Código de descuento" onkeydown="if(event.key==='Enter'){event.preventDefault();coApplyCoupon();}">
         <button type="button" class="btn btn-ghost" onclick="coApplyCoupon()">Aplicar</button>
       </div>`;

  el.innerHTML = `
    <div class="cart-totals">
      <div class="row"><span>Productos (${n})</span><span>${formatPrice(sub)}</span></div>
      ${disc > 0 ? `<div class="row disc"><span>Descuento${coupon ? " · " + coupon.code : ""}</span><span>−${formatPrice(disc)}</span></div>` : ""}
      <div class="row"><span>${mode.type === "delivery" ? "Envío" : "Recojo en tienda"}</span>
        <span class="${fee === 0 && mode.type === "delivery" ? "free" : ""}">${mode.type === "delivery" ? (fee === 0 ? "Gratis" : formatPrice(fee)) : "Gratis"}</span></div>
      <div class="row total"><span>Total</span><span>${formatPrice(tot)}</span></div>
    </div>
    <div class="coupon-box">${couponUI}</div>`;
}

function coApplyCoupon() {
  const inp = document.getElementById("coCoupon");
  const r = Store.applyCoupon(inp ? inp.value : "");
  if (!r.ok) { toast(r.msg, "⚠️"); return; }
  toast("Cupón aplicado 🎉 " + r.coupon.label, "🏷️");
}
function coRemoveCoupon() { Store.removeCoupon(); toast("Cupón quitado", "🏷️"); }

function coPickAddr(i) {
  const a = Store.getAddresses()[i];
  const inp = document.getElementById("coAddress");
  if (a && inp) { inp.value = a; inp.closest(".field")?.classList.remove("invalid"); }
}
/* Franjas horarias para programar (hoy, hasta el cierre) */
function scheduleSlots() {
  if (typeof HOURS === "undefined") return [];
  const now = new Date();
  const today = HOURS[now.getDay()];
  if (!today) return [];
  const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  const close = toMin(today[1]);
  let start = Math.max(toMin(today[0]), now.getHours() * 60 + now.getMinutes() + 45);
  start = Math.ceil(start / 30) * 30; // redondear a la próxima media hora
  const slots = [];
  for (let m = start; m <= close - 15 && slots.length < 16; m += 30) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(`Hoy ${hh}:${mm}`);
  }
  return slots;
}

function coStep(id, d) { Store.stepLine(id, d); }
function coRemove(id) { Store.removeItem(id); }

/* ---------- Métodos de pago ---------- */
function payTile(id, label, icons) {
  return `
    <div class="pay-opt ${coPay === id ? "sel" : ""}" data-pay="${id}" onclick="coSelectPay('${id}')">
      <span class="po-radio"></span>
      <span class="po-label">${label}</span>
      <span class="po-icons">${icons}</span>
    </div>`;
}

function coSelectPay(id) {
  coPay = id;
  document.querySelectorAll("[data-pay]").forEach(el =>
    el.classList.toggle("sel", el.dataset.pay === id));
  renderPayBody();
}

function renderPayBody() {
  const el = document.getElementById("payBody");
  if (!el) return;

  if (coPay === "card") {
    el.innerHTML = `
      <div class="cc-preview" id="ccPreview">
        <div class="cc-top">
          <span class="cc-chip"></span>
          <span class="cc-brand" id="ccBrand">${cardBrandSVG("generic")}</span>
        </div>
        <div class="cc-number" id="ccNumDisp">•••• •••• •••• ••••</div>
        <div class="cc-bottom">
          <div><span class="cc-lbl">Titular</span><div id="ccNameDisp">NOMBRE APELLIDO</div></div>
          <div><span class="cc-lbl">Vence</span><div id="ccExpDisp">MM/AA</div></div>
        </div>
      </div>
      <div class="card-form">
        <div class="field span2"><label for="ccNum">Número de tarjeta</label>
          <input id="ccNum" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" maxlength="23" oninput="ccOnNum(this)"></div>
        <div class="field span2"><label for="ccName">Titular de la tarjeta</label>
          <input id="ccName" autocomplete="cc-name" placeholder="Como aparece en la tarjeta" oninput="ccOnName(this)"></div>
        <div class="field"><label for="ccExp">Vencimiento</label>
          <input id="ccExp" inputmode="numeric" autocomplete="cc-exp" placeholder="MM/AA" maxlength="5" oninput="ccOnExp(this)"></div>
        <div class="field"><label for="ccCvv">CVV</label>
          <input id="ccCvv" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" maxlength="4" oninput="ccOnCvv(this)"></div>
      </div>
      <div class="pay-accepted">Aceptamos ${cardBrandSVG("visa")} ${cardBrandSVG("mastercard")} ${cardBrandSVG("amex")} ${cardBrandSVG("maestro")}</div>
      <p class="form-note secure">🔒 Pago cifrado · solo se guardan la marca y los últimos 4 dígitos (demo, sin cargo real)</p>`;
  } else if (coPay === "paypal") {
    el.innerHTML = `<div class="pay-alt">${cardBrandSVG("paypal")}<div>Al confirmar serás redirigido a <b>PayPal</b> para autorizar el pago de forma segura y volver a Inka Grill Express.</div></div>`;
  } else if (coPay === "satispay") {
    el.innerHTML = `<div class="pay-alt">${cardBrandSVG("satispay")}<div>Confirma y paga desde tu app <b>Satispay</b> escaneando el código o aceptando la solicitud de pago.</div></div>`;
  } else {
    el.innerHTML = `<div class="pay-alt">${cardBrandSVG("cash")}<div>Pagas en <b>efectivo (contrassegno)</b> al recibir tu pedido. Disponible para entregas y recojo en la Toscana.</div></div>`;
  }
}

/* Handlers de los campos de tarjeta */
function ccOnNum(el) {
  const digits = el.value.replace(/\D/g, "");
  const brand = detectBrand(digits);
  el.value = formatCardNumber(digits, brand);
  el.maxLength = brand === "amex" ? 17 : 19;
  const disp = document.getElementById("ccNumDisp");
  const bdg = document.getElementById("ccBrand");
  const cvv = document.getElementById("ccCvv");
  if (disp) disp.textContent = el.value || "•••• •••• •••• ••••";
  if (bdg) bdg.innerHTML = cardBrandSVG(digits ? brand : "generic");
  if (cvv) cvv.maxLength = brand === "amex" ? 4 : 3;
  el.closest(".field")?.classList.remove("invalid");
}
function ccOnName(el) {
  const d = document.getElementById("ccNameDisp");
  if (d) d.textContent = el.value.trim().toUpperCase() || "NOMBRE APELLIDO";
  el.closest(".field")?.classList.remove("invalid");
}
function ccOnExp(el) {
  let v = el.value.replace(/\D/g, "").slice(0, 4);
  if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
  el.value = v;
  const d = document.getElementById("ccExpDisp");
  if (d) d.textContent = v || "MM/AA";
  el.closest(".field")?.classList.remove("invalid");
}
function ccOnCvv(el) {
  el.value = el.value.replace(/\D/g, "").slice(0, el.maxLength || 3);
  el.closest(".field")?.classList.remove("invalid");
}

function wireCheckout() {
  // Modo entrega
  document.querySelectorAll("[data-co-mode]").forEach(opt => {
    opt.onclick = () => {
      const type = opt.dataset.coMode;
      const m = Store.getMode();
      Store.setMode({ type, localId: document.getElementById("coLocal").value || m.localId });
    };
  });
  const localSel = document.getElementById("coLocal");
  if (localSel) localSel.onchange = () => {
    const m = Store.getMode();
    Store.setMode({ type: m.type, localId: localSel.value });
  };

  const placeBtn = document.getElementById("placeBtn");
  if (placeBtn) placeBtn.onclick = submitOrder;

  renderPayBody();
}

function ccFail(id, msg) {
  document.getElementById(id)?.closest(".field")?.classList.add("invalid");
  toast(msg, "⚠️");
}

function submitOrder() {
  const name = (document.getElementById("coName").value || "").trim();
  const email = (document.getElementById("coEmail").value || "").trim();
  const phone = (document.getElementById("coPhone").value || "").trim();
  const mode = Store.getMode();
  const address = mode.type === "delivery" ? (document.getElementById("coAddress").value || "").trim() : "";
  const notes = (document.getElementById("coNotes").value || "").trim();
  const when = (document.getElementById("coWhen")?.value || "").trim() || "Lo antes posible";

  if (!name || !phone) { toast("Completa nombre y teléfono", "⚠️"); return; }
  if (email && !Store.isEmail(email)) { toast("Revisa el correo electrónico", "⚠️"); return; }
  if (mode.type === "delivery" && !address) { toast("Indica tu dirección de entrega", "⚠️"); return; }
  if (Store.subtotal() < DELIVERY.minOrder) { toast("No alcanzas el pedido mínimo", "⚠️"); return; }

  // ---- Pago ----
  let payment, payLabel;
  if (coPay === "card") {
    const num = (document.getElementById("ccNum").value || "").replace(/\D/g, "");
    const holder = (document.getElementById("ccName").value || "").trim();
    const exp = (document.getElementById("ccExp").value || "").trim();
    const cvv = (document.getElementById("ccCvv").value || "").replace(/\D/g, "");
    const brand = detectBrand(num);
    const cvvLen = brand === "amex" ? 4 : 3;

    if (!luhnValid(num)) { ccFail("ccNum", "Número de tarjeta no válido"); return; }
    if (!holder) { ccFail("ccName", "Falta el titular de la tarjeta"); return; }
    if (!validExpiry(exp)) { ccFail("ccExp", "Vencimiento no válido o vencido"); return; }
    if (cvv.length < cvvLen) { ccFail("ccCvv", "CVV incompleto"); return; }

    // SOLO marca + últimos 4 (nunca el número completo)
    payment = { method: "card", brand, last4: num.slice(-4), holder };
    payLabel = brandName(brand) + " ···· " + payment.last4;
  } else if (coPay === "paypal") {
    payment = { method: "paypal" }; payLabel = "PayPal";
  } else if (coPay === "satispay") {
    payment = { method: "satispay" }; payLabel = "Satispay";
  } else {
    payment = { method: "cash" }; payLabel = "Efectivo / Contrassegno";
  }

  // Guardar dirección si el usuario lo pidió
  if (mode.type === "delivery" && address && document.getElementById("coSaveAddr")?.checked) {
    Store.addAddress(address);
  }

  const order = Store.placeOrder({ name, email, phone, address, notes, when, payment, pay: payLabel });
  localStorage.setItem("ige_last_order", order.id);
  window.location.href = "pedidos.html?nuevo=" + encodeURIComponent(order.id);
}

/* Re-render reactivo del checkout */
function onStoreChange() {
  // Si cambia el carrito o el modo, re-render completo (mantiene los datos no es crítico en demo)
  const root = document.getElementById("checkoutRoot");
  if (root) renderCheckout();
}

document.addEventListener("DOMContentLoaded", renderCheckout);
