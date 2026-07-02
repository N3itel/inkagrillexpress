/* ===========================================================
   INKA GRILL EXPRESS — home.js (solo lógica de inicio)
   productCardHTML, addControlHTML, prodAdd, prodStep,
   refreshProductControls y renderSocials viven en app.js.
   =========================================================== */

/* Franja de categorías */
function renderCatStrip() {
  const el = document.getElementById("catStrip");
  if (!el) return;
  const chip = (c, dup) =>
    `<a class="cat-chip" href="menu.html#${c.id}"${dup ? ' aria-hidden="true" tabindex="-1"' : ""}><span class="e">${c.icon}</span>${c.name}</a>`;
  const set1 = CATEGORIES.map(c => chip(c, false)).join("");
  const set2 = CATEGORIES.map(c => chip(c, true)).join("");
  // Dos copias seguidas => bucle continuo sin cortes
  el.innerHTML = `<div class="cat-track">${set1}${set2}</div>`;
}

/* Productos destacados */
function renderFeatured() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  const picks = ["po-entero", "sh-clasico", "sh-peruano", "po-medio", "pz-inka", "en-cesar", "sh-doble", "po-cuarto"];
  const list = picks.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  el.innerHTML = list.map(productCardHTML).join("");
  refreshProductControls();
}

/* FAQ */
const FAQ = [
  { q: "¿Qué tipo de pollo ofrece Inka Grill Express?",
    a: "Preparamos auténtico pollo a la brasa peruano: marinado durante 24 horas y cocido lentamente al carbón hasta quedar jugoso por dentro y dorado por fuera. Lo acompañas con papas, ensaladas, yuca y nuestras cremas de la casa, en combos personales, dúos, familiares o mega familiares." },
  { q: "¿Cómo pido online?",
    a: "Elige tus platos en el menú, ajústalos en el carrito y selecciona delivery o recojo en tienda. Confirmas tu pedido en pocos pasos y recibes un código para seguirlo desde la sección «Mis pedidos»." },
  { q: "¿Hacen delivery?",
    a: "Sí. Tenemos delivery en Firenze, Firenzuola y Prato. El envío es gratis en pedidos desde €25; por debajo de ese monto se aplica una tarifa de €2,90. El pedido mínimo es de €10." },
  { q: "¿Tienen combos en oferta?",
    a: "Siempre. En la sección Promociones encontrarás combos personales, dúos, familiares y el Mega Combo Inka, varios con bebida incluida. También tenemos opciones de fusión peruano-italiana como el Combo Brasa & Pasta." },
  { q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos Visa, Mastercard, PayPal y Satispay, tanto en delivery como en recojo en tienda." },
];

function renderFAQ() {
  const el = document.getElementById("faq");
  if (!el) return;
  el.innerHTML = FAQ.map((f, i) => `
    <div class="faq-item" data-i="${i}">
      <button class="faq-q" onclick="toggleFAQ(${i})">
        ${f.q}
        <span class="chev"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg></span>
      </button>
      <div class="faq-a"><div class="inner">${f.a}</div></div>
    </div>`).join("");
}
function toggleFAQ(i) {
  const item = document.querySelector(`.faq-item[data-i="${i}"]`);
  const ans = item.querySelector(".faq-a");
  const open = item.classList.toggle("open");
  ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0";
}

/* =========================================================
   CÁMARA EN VIVO DEL HORNO
   Si LIVECAM está configurado, reemplaza la animación por la
   transmisión real (YouTube o HLS). Si no, deja la animación.
   ========================================================= */
function liveCamYouTubeSrc() {
  if (typeof LIVECAM === "undefined" || !LIVECAM.enabled || LIVECAM.provider !== "youtube") return null;
  const base = "https://www.youtube.com/embed/";
  const opts = "autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1";
  if (LIVECAM.youtubeId) return base + encodeURIComponent(LIVECAM.youtubeId) + "?" + opts;
  if (LIVECAM.youtubeChannelId) return base + "live_stream?channel=" + encodeURIComponent(LIVECAM.youtubeChannelId) + "&" + opts;
  return null;
}

function setupHls(url) {
  const v = document.getElementById("lcVideo");
  if (!v) return;
  if (v.canPlayType("application/vnd.apple.mpegurl")) { v.src = url; return; } // Safari/iOS nativo
  if (window.Hls) { const h = new Hls(); h.loadSource(url); h.attachMedia(v); return; }
  // cargar hls.js bajo demanda (solo si se usa HLS)
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.13/hls.min.js";
  s.onload = () => { if (window.Hls) { const h = new Hls(); h.loadSource(url); h.attachMedia(v); } };
  document.head.appendChild(s);
}

function mountLiveCam() {
  const host = document.getElementById("liveRoast");
  if (!host || typeof LIVECAM === "undefined" || !LIVECAM.enabled) return; // deja la animación

  const liveBadge = `<span class="lc-live"><span class="live-dot"></span>EN VIVO</span>`;

  if (LIVECAM.provider === "hls" && LIVECAM.hlsUrl) {
    host.innerHTML = `<div class="lc-frame">${liveBadge}<video id="lcVideo" class="lc-video" autoplay muted playsinline controls poster=""></video></div>`;
    setupHls(LIVECAM.hlsUrl);
    return;
  }

  const yt = liveCamYouTubeSrc();
  if (yt) {
    host.innerHTML = `<div class="lc-frame">${liveBadge}<iframe class="lc-iframe" src="${yt}" title="El horno en vivo — Inka Grill Express" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
  }
}

/* =========================================================
   HERO — palabra rotativa (Pollo a la brasa → Pizza → Shawarma)
   ========================================================= */
let heroRotTimer = null;
const HERO_WORDS = ["Pollo a la brasa", "Pizza", "Shawarma"];
function startHeroRotator() {
  if (heroRotTimer) { clearInterval(heroRotTimer); heroRotTimer = null; }
  if (!document.getElementById("heroRotate")) return;
  let i = 0;
  heroRotTimer = setInterval(() => {
    const node = document.getElementById("heroRotate");
    if (!node) { clearInterval(heroRotTimer); heroRotTimer = null; return; }
    i = (i + 1) % HERO_WORDS.length;
    node.classList.add("swap");
    setTimeout(() => {
      node.textContent = HERO_WORDS[i];
      node.classList.remove("swap");
    }, 350);
  }, 2000);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatStrip();
  renderFeatured();
  renderFAQ();
  mountLiveCam();
  startHeroRotator();
});
