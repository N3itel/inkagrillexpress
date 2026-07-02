/* =========================================================
   CUENTA — Inka Grill Express
   Login / registro (localStorage) + panel con historial.
   ========================================================= */

let acctTab = "login"; // "login" | "register"

function fmtDate(ts) {
  try {
    return new Date(ts).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch { return ""; }
}

function orderItemsText(order) {
  const entries = Object.entries(order.items || {});
  const n = entries.reduce((a, [, q]) => a + q, 0);
  return n + (n === 1 ? " producto" : " productos");
}

function renderAccount() {
  const root = document.getElementById("acctRoot");
  if (!root) return;
  const session = Store.getSession();

  if (session) {
    renderDashboard(root, session);
  } else {
    renderAuth(root);
  }
}

/* ---------- Sesión iniciada: panel ---------- */
function renderDashboard(root, session) {
  document.getElementById("acctTitle").textContent = "¡Hola, " + session.name.split(" ")[0] + "!";
  document.getElementById("acctSub").textContent = "Este es tu panel de Inka Grill Express.";

  const orders = Store.getOrders();
  const initials = session.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  const ordersHTML = orders.length
    ? orders.map(o => `
        <a href="pedidos.html?id=${encodeURIComponent(o.id)}" class="order-row">
          <div>
            <div class="or-id">${o.id}</div>
            <div class="or-meta">${fmtDate(o.createdAt)} · ${orderItemsText(o)} · ${o.mode.type === "delivery" ? "🛵 Delivery" : "🏠 Recojo"}</div>
          </div>
          <div class="or-total">${formatPrice(o.total)}</div>
        </a>`).join("")
    : `<p class="muted" style="text-align:center; padding:24px 0">Aún no tienes pedidos. <a href="menu.html" style="color:var(--red); font-weight:700">¡Haz el primero!</a></p>`;

  root.innerHTML = `
    <div class="auth-wrap" style="max-width:720px">
      <div class="card">
        <div class="acct-head">
          <div class="acct-avatar">${initials}</div>
          <div>
            <h3 style="font-family:var(--font-body); font-weight:800; color:var(--brown); font-size:20px">${session.name}</h3>
            <p class="muted" style="font-size:14px">${session.email}</p>
          </div>
          <button class="btn btn-ghost" style="margin-left:auto" onclick="doLogout()">Cerrar sesión</button>
        </div>

        <div style="display:flex; gap:14px; margin:24px 0; flex-wrap:wrap">
          <div class="stat-box"><b>${orders.length}</b><span>Pedidos</span></div>
          <div class="stat-box"><b>${formatPrice(orders.reduce((a, o) => a + o.total, 0))}</b><span>Total gastado</span></div>
          <div class="stat-box stat-points"><b>${Store.getPoints()}</b><span>Inka Puntos</span></div>
        </div>

        ${(() => {
          const pts = Store.getPoints(), step = Store.REWARD_STEP;
          const inStep = pts % step, toNext = step - inStep, pct = Math.round(inStep / step * 100);
          const rewards = Math.floor(pts / step);
          return `<div class="loyalty-card">
            <div class="loyalty-top">
              <span>🔥 Inka Puntos</span>
              <span class="muted">${rewards > 0 ? `${rewards} premio${rewards > 1 ? "s" : ""} disponible${rewards > 1 ? "s" : ""} 🎉` : `Te faltan ${toNext} pts para tu premio`}</span>
            </div>
            <div class="loyalty-bar"><span style="width:${pct}%"></span></div>
            <p class="muted" style="font-size:12.5px;margin-top:8px">Ganas ${Store.POINTS_PER_EURO} puntos por cada €1. Cada ${step} puntos = un premio de la casa.</p>
          </div>`;
        })()}

        <h4 style="font-family:var(--font-body); font-weight:800; color:var(--brown); margin-bottom:14px">Mis pedidos</h4>
        <div class="order-list">${ordersHTML}</div>

        <h4 style="font-family:var(--font-body); font-weight:800; color:var(--brown); margin:26px 0 14px">Mis direcciones</h4>
        <div id="addrList">${addressesHTML()}</div>
        <div class="addr-add">
          <input id="newAddr" placeholder="Añade una dirección (Via, número, ciudad)" onkeydown="if(event.key==='Enter'){event.preventDefault();acctAddAddress();}">
          <button class="btn btn-ghost" onclick="acctAddAddress()">Guardar</button>
        </div>

        <a href="menu.html" class="btn btn-primary btn-block" style="margin-top:22px">Pedir de nuevo 🍗</a>
      </div>
    </div>`;
}

/* ---------- Direcciones guardadas (cuenta) ---------- */
function addressesHTML() {
  const list = Store.getAddresses();
  if (!list.length) return `<p class="muted" style="font-size:14px;margin-bottom:12px">Aún no has guardado direcciones.</p>`;
  return `<div class="addr-saved-list">` + list.map((a, i) =>
    `<div class="addr-item"><span>📍 ${a}</span><button onclick="acctRemoveAddress(${i})" aria-label="Eliminar dirección">✕</button></div>`).join("") + `</div>`;
}
function acctAddAddress() {
  const inp = document.getElementById("newAddr");
  const v = (inp ? inp.value : "").trim();
  if (!v) { toast("Escribe una dirección", "⚠️"); return; }
  Store.addAddress(v);
  if (inp) inp.value = "";
  const list = document.getElementById("addrList");
  if (list) list.innerHTML = addressesHTML();
  toast("Dirección guardada", "📍");
}
function acctRemoveAddress(i) {
  Store.removeAddress(i);
  const list = document.getElementById("addrList");
  if (list) list.innerHTML = addressesHTML();
}

/* ---------- Sin sesión: login / registro ---------- */
function renderAuth(root) {
  document.getElementById("acctTitle").textContent = "Mi cuenta";
  document.getElementById("acctSub").textContent = "Accede para guardar tus datos y seguir tus pedidos.";

  const loginForm = `
    <div class="field"><label for="liEmail">Correo electrónico</label><input id="liEmail" type="email" autocomplete="email" placeholder="tucorreo@email.com"></div>
    <div class="field"><label for="liPass">Contraseña</label>
      <div class="pass-wrap"><input id="liPass" type="password" autocomplete="current-password" placeholder="••••••••">
        <button type="button" class="toggle-pass" onclick="togglePass('liPass',this)" aria-label="Mostrar contraseña">👁</button></div>
    </div>
    <button class="btn btn-primary btn-block btn-lg" onclick="doLogin()">Iniciar sesión</button>`;

  const regForm = `
    <div class="field"><label for="rgName">Nombre y apellido *</label><input id="rgName" autocomplete="name" placeholder="Ej. Mario Rossi"></div>
    <div class="field"><label for="rgEmail">Correo electrónico *</label><input id="rgEmail" type="email" autocomplete="email" placeholder="tucorreo@email.com"></div>
    <div class="field"><label for="rgPhone">Teléfono (opcional)</label><input id="rgPhone" type="tel" autocomplete="tel" placeholder="+39 ..."></div>
    <div class="field"><label for="rgPass">Contraseña *</label>
      <div class="pass-wrap"><input id="rgPass" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres" oninput="rgPassInput()">
        <button type="button" class="toggle-pass" onclick="togglePass('rgPass',this)" aria-label="Mostrar contraseña">👁</button></div>
      <div class="pw-meter"><span id="pwBar"></span></div>
      <div class="pw-hint" id="pwHint">Usa 6+ caracteres, con números y mayúsculas para mayor seguridad.</div>
    </div>
    <div class="field"><label for="rgPass2">Repite la contraseña *</label>
      <div class="pass-wrap"><input id="rgPass2" type="password" autocomplete="new-password" placeholder="••••••••">
        <button type="button" class="toggle-pass" onclick="togglePass('rgPass2',this)" aria-label="Mostrar contraseña">👁</button></div>
    </div>
    <button class="btn btn-primary btn-block btn-lg" onclick="doRegister()">Crear mi cuenta</button>`;

  root.innerHTML = `
    <div class="auth-wrap">
      <div class="card">
        <div class="tabs">
          <button class="${acctTab === "login" ? "active" : ""}" onclick="switchTab('login')">Iniciar sesión</button>
          <button class="${acctTab === "register" ? "active" : ""}" onclick="switchTab('register')">Registrarme</button>
        </div>
        <div id="acctAlert"></div>
        <div id="acctForm">${acctTab === "login" ? loginForm : regForm}</div>
        <p class="muted" style="text-align:center; font-size:13px; margin-top:18px">
          🔒 Demo local · tus datos se guardan solo en este navegador.
        </p>
      </div>
    </div>`;
}

function switchTab(tab) { acctTab = tab; renderAuth(document.getElementById("acctRoot")); }

function showAlert(msg, type) {
  const box = document.getElementById("acctAlert");
  if (box) box.innerHTML = `<div class="alert ${type}">${msg}</div>`;
}

function togglePass(id, btn) {
  const i = document.getElementById(id); if (!i) return;
  const show = i.type === "password";
  i.type = show ? "text" : "password";
  btn.textContent = show ? "🙈" : "👁";
}

function pwScore(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}
function rgPassInput() {
  const p = (document.getElementById("rgPass").value) || "";
  const bar = document.getElementById("pwBar");
  const hint = document.getElementById("pwHint");
  if (!bar) return;
  const score = pwScore(p);
  const pct = [0, 25, 50, 75, 100][score];
  const col = ["#d33", "#d33", "#e0a52e", "#3b9", "#2e7d4f"][score];
  const txt = ["Muy débil", "Débil", "Aceptable", "Buena", "Excelente"][score];
  bar.style.width = pct + "%";
  bar.style.background = col;
  if (hint) hint.textContent = p ? ("Seguridad: " + txt) : "Usa 6+ caracteres, con números y mayúsculas para mayor seguridad.";
}

function markField(id, bad) {
  const i = document.getElementById(id); if (!i) return;
  i.closest(".field")?.classList.toggle("invalid", !!bad);
}

function doLogin() {
  const email = document.getElementById("liEmail").value;
  const password = document.getElementById("liPass").value;
  markField("liEmail", false);
  if (!Store.isEmail(email)) { showAlert("Ingresa un correo electrónico válido.", "err"); markField("liEmail", true); return; }
  const r = Store.login({ email, password });
  if (!r.ok) { showAlert(r.msg, "err"); return; }
  toast("¡Bienvenido de vuelta!", "👋");
  renderAccount();
}

function doRegister() {
  const name = document.getElementById("rgName").value.trim();
  const email = document.getElementById("rgEmail").value;
  const phone = document.getElementById("rgPhone").value;
  const password = document.getElementById("rgPass").value;
  const password2 = document.getElementById("rgPass2").value;

  ["rgName", "rgEmail", "rgPass", "rgPass2"].forEach(id => markField(id, false));

  if (!name) { showAlert("Escribe tu nombre y apellido.", "err"); markField("rgName", true); return; }
  if (!Store.isEmail(email)) { showAlert("Ingresa un correo electrónico válido.", "err"); markField("rgEmail", true); return; }
  if (password.length < 6) { showAlert("La contraseña debe tener al menos 6 caracteres.", "err"); markField("rgPass", true); return; }
  if (password !== password2) { showAlert("Las contraseñas no coinciden.", "err"); markField("rgPass2", true); return; }

  const r = Store.register({ name, email, password, phone });
  if (!r.ok) { showAlert(r.msg, "err"); return; }
  toast("¡Cuenta creada! 🎉", "🔥");
  renderAccount();
}

function doLogout() {
  Store.logout();
  acctTab = "login";
  toast("Sesión cerrada", "👋");
  renderAccount();
}

/* El store puede cambiar (login/logout) desde otro punto */
function onStoreChange() { renderAccount(); }

document.addEventListener("DOMContentLoaded", renderAccount);
