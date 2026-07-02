/* =========================================================
   LOCALES — Inka Grill Express
   ========================================================= */

function renderLocales() {
  const grid = document.getElementById("localGrid");
  if (!grid) return;
  const mode = Store.getMode();

  grid.innerHTML = LOCALES.map(l => {
    const isCurrent = l.id === mode.localId;
    const shortName = l.name.replace("Inka Grill Express — ", "");
    return `
    <div class="local-card">
      <h3>${shortName}</h3>
      <div class="local-row"><span class="ic">${ICONS.pin}</span><span>${l.address}</span></div>
      <div class="local-row"><span class="ic">${ICONS.phone}</span><a href="tel:${l.phone.replace(/\s/g, "")}" style="color:inherit">${l.phone}</a></div>
      <div class="local-row"><span class="ic">${ICONS.clock}</span><span>${l.hours}</span></div>
      <div class="local-tags">
        <span class="tag ${l.delivery ? "yes" : "no"}">${l.delivery ? "🛵 Delivery" : "Sin delivery"}</span>
        <span class="tag ${l.pickup ? "yes" : "no"}">${l.pickup ? "🏠 Recojo" : "Sin recojo"}</span>
      </div>
      <div style="margin-top:18px; display:flex; gap:10px; flex-wrap:wrap">
        <button class="btn ${isCurrent ? "btn-ghost" : "btn-primary"}" onclick="pedirAqui('${l.id}')">
          ${isCurrent ? "✓ Local seleccionado" : "Pedir desde aquí"}
        </button>
      </div>
    </div>`;
  }).join("");
}

function pedirAqui(localId) {
  const local = Store.localOf(localId);
  // Si el local no hace delivery, forzamos modo recojo
  const type = local.delivery ? Store.getMode().type : "pickup";
  Store.setMode({ type, localId });
  toast("Pediendo desde " + local.name.replace("Inka Grill Express — ", ""), "📍");
  setTimeout(() => { window.location.href = "menu.html"; }, 650);
}

/* Hook reactivo: si cambia el modo/local, refrescamos las tarjetas */
function onStoreChange() { renderLocales(); }

document.addEventListener("DOMContentLoaded", renderLocales);
