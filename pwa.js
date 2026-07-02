/* =========================================================
   INKA GRILL EXPRESS — pwa.js
   Registro del service worker + botón "Instalar app".
   ========================================================= */
(function () {
  // Registrar el service worker (solo con http/https; en file:// no aplica)
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  let deferredPrompt = null;

  function makeInstallBtn() {
    let b = document.getElementById("pwaInstall");
    if (b) return b;
    b = document.createElement("button");
    b.id = "pwaInstall";
    b.className = "pwa-install";
    b.setAttribute("aria-label", "Instalar la app");
    b.innerHTML = '<span class="pi-ic">⬇️</span><span class="pi-t">Instalar app</span><span class="pi-x" title="Ocultar">✕</span>';
    b.addEventListener("click", async (e) => {
      if (e.target.classList.contains("pi-x")) {
        b.remove();
        try { sessionStorage.setItem("ige_pwa_hide", "1"); } catch (_) {}
        return;
      }
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      try {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") b.remove();
      } catch (_) {}
      deferredPrompt = null;
    });
    document.body.appendChild(b);
    return b;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    try { if (sessionStorage.getItem("ige_pwa_hide")) return; } catch (_) {}
    const b = makeInstallBtn();
    requestAnimationFrame(() => b.classList.add("show"));
  });

  window.addEventListener("appinstalled", () => {
    const b = document.getElementById("pwaInstall");
    if (b) b.remove();
    deferredPrompt = null;
  });
})();
