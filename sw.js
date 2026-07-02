/* Inka Grill Express — Service Worker
   Cache del "shell" + runtime cache para el resto (imágenes, mapas). */
const CACHE = "inka-grill-v1";
const CORE = [
  "./",
  "./index.html", "./menu.html", "./carrito.html", "./pedidos.html",
  "./cuenta.html", "./locales.html", "./privacidad.html", "./cookies.html", "./terminos.html",
  "./css/styles.css",
  "./js/data.js", "./js/store.js", "./js/app.js", "./js/home.js", "./js/menu.js",
  "./js/carrito.js", "./js/locales.js", "./js/cuenta.js", "./js/pedidos.js", "./js/legal.js", "./js/pwa.js",
  "./assets/logo.png", "./assets/favicon.png", "./assets/icon-192.png", "./assets/icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(CORE).catch(() => {})) // tolera fallos individuales
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Recursos externos (fuentes, tiles del mapa, CDN): network-first con caché de respaldo
  if (url.origin !== self.location.origin) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Mismo origen: cache-first, y guarda lo nuevo
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
