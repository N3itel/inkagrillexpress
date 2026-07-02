/* ===========================================================
   INKA GRILL EXPRESS — menu.js
   =========================================================== */

/* ---- Filtros de menú (dieta) ---- */
const MENU_FILTERS = [
  { id: "all", label: "Todos", icon: "🍽️" },
  { id: "veg", label: "Vegetariano", icon: "🥬" },
  { id: "spicy", label: "Picante", icon: "🌶️" },
  { id: "mild", label: "Sin picante", icon: "😊" },
];
let activeMenuFilter = "all";
function renderMenuFilters() {
  const el = document.getElementById("menuFilters");
  if (!el) return;
  el.innerHTML = MENU_FILTERS.map(f =>
    `<button class="mf-chip${f.id === activeMenuFilter ? " active" : ""}" data-f="${f.id}">
       <span>${f.icon}</span> ${f.label}</button>`
  ).join("");
  el.querySelectorAll(".mf-chip").forEach(b => {
    b.addEventListener("click", () => {
      activeMenuFilter = b.dataset.f;
      el.querySelectorAll(".mf-chip").forEach(x => x.classList.toggle("active", x.dataset.f === activeMenuFilter));
      applyMenuFilters();
    });
  });
}
function matchFilter(p) {
  if (activeMenuFilter === "veg") return !!p.veg;
  if (activeMenuFilter === "spicy") return !!p.spicy;
  if (activeMenuFilter === "mild") return !p.spicy;
  return true;
}
function applyMenuFilters() {
  const input = document.getElementById("searchInput");
  const q = input ? input.value.trim().toLowerCase() : "";
  let anyVisible = false;
  document.querySelectorAll(".cat-block").forEach(block => {
    let visibleInBlock = 0;
    block.querySelectorAll(".product-card").forEach(card => {
      const p = Store.product(card.dataset.id);
      const textMatch = !q || (p && (p.name.toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q)));
      const ok = p && textMatch && matchFilter(p);
      card.style.display = ok ? "" : "none";
      if (ok) visibleInBlock++;
    });
    block.style.display = visibleInBlock ? "" : "none";
    if (visibleInBlock) anyVisible = true;
  });
  let empty = document.getElementById("noResults");
  if (!anyVisible) {
    if (!empty) {
      empty = document.createElement("div");
      empty.id = "noResults";
      empty.className = "cart-empty";
      document.getElementById("menuContent").appendChild(empty);
    }
    empty.innerHTML = `<div class="big">🔍</div><h4>Sin resultados</h4><p>Prueba con otra palabra o quita los filtros.</p>`;
    empty.style.display = "";
  } else if (empty) {
    empty.style.display = "none";
  }
}

function renderCatNav() {
  const el = document.getElementById("catNav");
  el.innerHTML = CATEGORIES.map((c, i) =>
    `<li><a href="#${c.id}" data-cat="${c.id}" class="${i === 0 ? "active" : ""}">
       <span class="e">${c.icon}</span> ${c.name}</a></li>`
  ).join("");

  el.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      const id = a.dataset.cat;
      const target = document.getElementById(id);
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function renderMenu() {
  const el = document.getElementById("menuContent");
  el.innerHTML = CATEGORIES.map(c => {
    const items = PRODUCTS.filter(p => p.cat === c.id);
    return `
      <section class="cat-block" id="${c.id}">
        <div class="cb-head">
          <h2>${c.icon} ${c.name}</h2>
          <span>${c.tag}</span>
        </div>
        <div class="products-grid">
          ${items.map(productCardHTML).join("")}
        </div>
      </section>`;
  }).join("");
  refreshProductControls();
}

/* Buscador en vivo */
function setupSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", applyMenuFilters);

  // Foco automático si viene de ?focus=search
  const params = new URLSearchParams(location.search);
  if (params.get("focus") === "search") {
    setTimeout(() => { input.focus(); window.scrollTo({ top: 0 }); }, 200);
  }
}

/* Scroll-spy para resaltar la categoría activa */
function setupScrollSpy() {
  const links = document.querySelectorAll("#catNav a");
  const blocks = CATEGORIES.map(c => document.getElementById(c.id)).filter(Boolean);
  if (!blocks.length) return;
  const onScroll = () => {
    let current = blocks[0].id;
    blocks.forEach(b => { if (b.getBoundingClientRect().top - 140 <= 0) current = b.id; });
    links.forEach(a => a.classList.toggle("active", a.dataset.cat === current));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* Saltar a la categoría del hash al cargar */
function jumpToHash() {
  const id = location.hash.replace("#", "");
  if (id && document.getElementById(id)) {
    setTimeout(() => {
      const top = document.getElementById(id).getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }, 250);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatNav();
  renderMenu();
  renderMenuFilters();
  setupSearch();
  setupScrollSpy();
  jumpToHash();
});
