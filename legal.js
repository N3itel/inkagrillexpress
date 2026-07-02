/* ===========================================================
   INKA GRILL EXPRESS — legal.js  (bilingüe ES / IT)
   Fuente única de las páginas legales. Plantillas orientativas:
   requieren revisión profesional antes de un uso real.
   =========================================================== */

/* Datos del titular — RELLENAR con la información real del negocio */
const LEGAL_BIZ = {
  nombre: "[Razón social, p. ej. Inka Grill Express S.r.l.]",
  piva: "[P. IVA / Codice Fiscale]",
  sede: "[Domicilio fiscal completo, Toscana, Italia]",
  email: "[correo@inkagrillexpress.it]",
  tel: "[+39 ...]",
};

const LEGAL_UPDATED = { es: "26 de junio de 2026", it: "26 giugno 2026" };

const LEGAL_LABELS = {
  es: {
    privacidad: { t: "Política de Privacidad", s: "Cómo tratamos tus datos personales." },
    cookies:    { t: "Política de Cookies",    s: "Qué almacenamos en tu navegador y por qué." },
    terminos:   { t: "Términos y Condiciones", s: "Las reglas del servicio de pedidos." },
  },
  it: {
    privacidad: { t: "Informativa sulla Privacy", s: "Come trattiamo i tuoi dati personali." },
    cookies:    { t: "Informativa sui Cookie",    s: "Cosa memorizziamo nel tuo browser e perché." },
    terminos:   { t: "Termini e Condizioni",      s: "Le regole del servizio di ordinazione." },
  },
};

const LEGAL = { es: {}, it: {} };

/* ===================== ESPAÑOL ===================== */
LEGAL.es.privacidad = `
  <div class="legal-note">⚠️ Plantilla orientativa conforme al RGPD (Reglamento UE 2016/679). Antes de publicarla en un negocio real, revísala con un profesional.</div>
  <p class="legal-upd">Última actualización: ${LEGAL_UPDATED.es}</p>
  <h2>1. Responsable del tratamiento</h2>
  <p>El responsable es <strong>${LEGAL_BIZ.nombre}</strong>, con domicilio en ${LEGAL_BIZ.sede}, P. IVA ${LEGAL_BIZ.piva}. Contacto: <strong>${LEGAL_BIZ.email}</strong> · ${LEGAL_BIZ.tel}.</p>
  <h2>2. Qué datos tratamos</h2>
  <p>Tratamos únicamente los datos que tú facilitas:</p>
  <ul>
    <li><strong>Datos de pedido:</strong> nombre, teléfono, dirección de entrega (solo delivery) y notas.</li>
    <li><strong>Datos de cuenta:</strong> nombre y correo, si te registras.</li>
    <li><strong>Datos del pedido:</strong> productos, importe y modo de entrega.</li>
  </ul>
  <p>En esta versión, los datos se guardan <strong>localmente en tu navegador</strong> y no se envían a un servidor central.</p>
  <h2>3. Finalidades y base jurídica</h2>
  <ul>
    <li><strong>Gestionar y entregar pedidos</strong> — ejecución de un contrato (art. 6.1.b RGPD).</li>
    <li><strong>Mantener tu cuenta e historial</strong> — consentimiento (art. 6.1.a RGPD).</li>
    <li><strong>Obligaciones legales</strong> (p. ej. fiscales) — art. 6.1.c RGPD.</li>
  </ul>
  <h2>4. Conservación</h2>
  <p>Conservamos los datos el tiempo necesario para el servicio y las obligaciones legales. Puedes eliminarlos cerrando sesión o borrando los datos de navegación.</p>
  <h2>5. Destinatarios y terceros</h2>
  <p>No vendemos ni cedemos tus datos. Las fotos de los platos se sirven desde <strong>Pexels</strong> (images.pexels.com), proveedor externo de imágenes con licencia libre.</p>
  <h2>6. Transferencias internacionales</h2>
  <p>Si algún proveedor aloja contenido fuera del EEE, las transferencias se amparan en el Capítulo V del RGPD.</p>
  <h2>7. Tus derechos</h2>
  <p>Puedes ejercer tus derechos de <strong>acceso, rectificación, supresión, limitación, oposición y portabilidad</strong> (arts. 15-22 RGPD) en ${LEGAL_BIZ.email}. También puedes reclamar ante el <strong>Garante per la protezione dei dati personali</strong> (www.garanteprivacy.it).</p>
  <h2>8. Cookies</h2>
  <p>Usamos solo almacenamiento técnico necesario. Consulta la <a href="cookies.html">Política de Cookies</a>.</p>
  <h2>9. Contacto</h2>
  <p>Para cualquier duda: <strong>${LEGAL_BIZ.email}</strong>.</p>
`;

LEGAL.es.cookies = `
  <div class="legal-note">⚠️ Plantilla orientativa. Adáptala a las herramientas que realmente uses (analítica, mapas, redes, etc.).</div>
  <p class="legal-upd">Última actualización: ${LEGAL_UPDATED.es}</p>
  <h2>1. Qué son</h2>
  <p>Las cookies y tecnologías similares (como el almacenamiento local) son pequeños archivos que un sitio guarda en tu dispositivo para funcionar o recordar tus preferencias.</p>
  <h2>2. Qué usamos</h2>
  <p>Usamos <strong>únicamente almacenamiento técnico necesario</strong> (sin rastreadores), para:</p>
  <ul>
    <li><strong>Tu carrito</strong> — los platos que añades.</li>
    <li><strong>Modo de entrega y local</strong> — delivery o recojo y la tienda.</li>
    <li><strong>Tu sesión y cuenta</strong> — si te registras.</li>
    <li><strong>Tus pedidos</strong> — historial y seguimiento.</li>
    <li><strong>Tu preferencia de cookies</strong> — para no repetir el aviso.</li>
  </ul>
  <p>No usamos cookies de analítica, publicidad ni seguimiento de terceros.</p>
  <h2>3. Terceros</h2>
  <p>Las imágenes se cargan desde <strong>Pexels</strong>. Son peticiones técnicas y no instalan cookies de seguimiento.</p>
  <h2>4. Base legal</h2>
  <p>El almacenamiento estrictamente necesario no requiere consentimiento previo (Directiva ePrivacy y directrices del Garante). Si se añaden cookies no esenciales, se pedirá tu consentimiento.</p>
  <h2>5. Cómo gestionarlas</h2>
  <p>Puedes borrarlas desde la configuración de tu navegador o cerrando sesión.</p>
`;

LEGAL.es.terminos = `
  <div class="legal-note">⚠️ Plantilla orientativa. Ajusta las condiciones a tu operativa real y revísala con un profesional.</div>
  <p class="legal-upd">Última actualización: ${LEGAL_UPDATED.es}</p>
  <h2>1. Titular</h2>
  <p><strong>${LEGAL_BIZ.nombre}</strong>, P. IVA ${LEGAL_BIZ.piva}, domicilio en ${LEGAL_BIZ.sede}. Contacto: ${LEGAL_BIZ.email} · ${LEGAL_BIZ.tel}.</p>
  <h2>2. Objeto</h2>
  <p>Regulan el uso del sitio y los pedidos de comida para entrega a domicilio (delivery) o recogida en tienda (recojo).</p>
  <h2>3. Precios</h2>
  <p>En euros (€), IVA incluido. Pueden actualizarse; se aplica el precio vigente al confirmar el pedido.</p>
  <h2>4. Pedidos y entrega</h2>
  <ul>
    <li>Pedido mínimo: <strong>10&nbsp;€</strong>.</li>
    <li>Envío gratis desde <strong>25&nbsp;€</strong>; por debajo, tarifa de <strong>2,90&nbsp;€</strong>.</li>
    <li>Los tiempos son estimados y pueden variar.</li>
    <li>El delivery solo está disponible en las zonas indicadas en «Locales».</li>
  </ul>
  <h2>5. Pago</h2>
  <p>Aceptamos los métodos indicados al pedir (tarjeta, PayPal, Satispay y, en su caso, efectivo).</p>
  <h2>6. Derecho de desistimiento</h2>
  <p>Según el Código de Consumo italiano (art. 59), los alimentos preparados y perecederos están excluidos del derecho de desistimiento de 14 días. Ante cualquier problema, contáctanos y buscaremos una solución.</p>
  <h2>7. Alérgenos</h2>
  <p>Si tienes alergias o intolerancias, contacta con el local antes de pedir.</p>
  <h2>8. Responsabilidad</h2>
  <p>Procuramos que la información sea correcta, pero pueden existir errores u omisiones.</p>
  <h2>9. Ley aplicable</h2>
  <p>Se rigen por la legislación italiana; será competente el foro del consumidor previsto por la normativa.</p>
  <h2>10. Modificaciones</h2>
  <p>Podemos modificarlas; la versión vigente será la publicada en este sitio.</p>
`;

/* ===================== ITALIANO ===================== */
LEGAL.it.privacidad = `
  <div class="legal-note">⚠️ Modello indicativo conforme al GDPR (Regolamento UE 2016/679). Prima della pubblicazione in un'attività reale, fallo verificare da un professionista.</div>
  <p class="legal-upd">Ultimo aggiornamento: ${LEGAL_UPDATED.it}</p>
  <h2>1. Titolare del trattamento</h2>
  <p>Il titolare è <strong>${LEGAL_BIZ.nombre}</strong>, con sede in ${LEGAL_BIZ.sede}, P. IVA ${LEGAL_BIZ.piva}. Contatti: <strong>${LEGAL_BIZ.email}</strong> · ${LEGAL_BIZ.tel}.</p>
  <h2>2. Quali dati trattiamo</h2>
  <p>Trattiamo esclusivamente i dati che ci fornisci tu:</p>
  <ul>
    <li><strong>Dati dell'ordine:</strong> nome, telefono, indirizzo di consegna (solo delivery) e note.</li>
    <li><strong>Dati dell'account:</strong> nome ed e-mail, se ti registri.</li>
    <li><strong>Dati dell'ordine:</strong> prodotti, importo e modalità di consegna.</li>
  </ul>
  <p>In questa versione, i dati sono salvati <strong>localmente nel tuo browser</strong> e non vengono inviati a un server centrale.</p>
  <h2>3. Finalità e base giuridica</h2>
  <ul>
    <li><strong>Gestire e consegnare gli ordini</strong> — esecuzione di un contratto (art. 6.1.b GDPR).</li>
    <li><strong>Gestire account e cronologia</strong> — consenso (art. 6.1.a GDPR).</li>
    <li><strong>Obblighi di legge</strong> (es. fiscali) — art. 6.1.c GDPR.</li>
  </ul>
  <h2>4. Conservazione</h2>
  <p>Conserviamo i dati per il tempo necessario al servizio e agli obblighi di legge. Puoi eliminarli uscendo dall'account o cancellando i dati di navigazione.</p>
  <h2>5. Destinatari e terzi</h2>
  <p>Non vendiamo né cediamo i tuoi dati. Le foto dei piatti sono servite da <strong>Pexels</strong> (images.pexels.com), fornitore esterno di immagini con licenza libera.</p>
  <h2>6. Trasferimenti internazionali</h2>
  <p>Se un fornitore ospita contenuti fuori dal SEE, i trasferimenti avvengono secondo le garanzie del Capo V del GDPR.</p>
  <h2>7. I tuoi diritti</h2>
  <p>Puoi esercitare i diritti di <strong>accesso, rettifica, cancellazione, limitazione, opposizione e portabilità</strong> (artt. 15-22 GDPR) scrivendo a ${LEGAL_BIZ.email}. Hai inoltre diritto di reclamo al <strong>Garante per la protezione dei dati personali</strong> (www.garanteprivacy.it).</p>
  <h2>8. Cookie</h2>
  <p>Usiamo solo memorizzazione tecnica necessaria. Vedi l'<a href="cookies.html">Informativa sui Cookie</a>.</p>
  <h2>9. Contatti</h2>
  <p>Per qualsiasi domanda: <strong>${LEGAL_BIZ.email}</strong>.</p>
`;

LEGAL.it.cookies = `
  <div class="legal-note">⚠️ Modello indicativo. Adattalo agli strumenti effettivamente utilizzati (analytics, mappe, social, ecc.).</div>
  <p class="legal-upd">Ultimo aggiornamento: ${LEGAL_UPDATED.it}</p>
  <h2>1. Cosa sono</h2>
  <p>I cookie e le tecnologie simili (come la memorizzazione locale) sono piccoli file che un sito salva sul tuo dispositivo per funzionare o ricordare le tue preferenze.</p>
  <h2>2. Cosa usiamo</h2>
  <p>Usiamo <strong>solo memorizzazione tecnica necessaria</strong> (senza tracciamento), per:</p>
  <ul>
    <li><strong>Il carrello</strong> — i piatti che aggiungi.</li>
    <li><strong>Modalità e punto vendita</strong> — delivery o ritiro e il negozio.</li>
    <li><strong>Sessione e account</strong> — se ti registri.</li>
    <li><strong>I tuoi ordini</strong> — cronologia e tracciamento.</li>
    <li><strong>La preferenza sui cookie</strong> — per non ripetere l'avviso.</li>
  </ul>
  <p>Non usiamo cookie di analytics, pubblicità o tracciamento di terze parti.</p>
  <h2>3. Terze parti</h2>
  <p>Le immagini sono caricate da <strong>Pexels</strong>. Sono richieste tecniche e non installano cookie di tracciamento.</p>
  <h2>4. Base giuridica</h2>
  <p>La memorizzazione strettamente necessaria non richiede consenso preventivo (Direttiva ePrivacy e provvedimenti del Garante). Per eventuali cookie non essenziali verrà richiesto il consenso.</p>
  <h2>5. Come gestirli</h2>
  <p>Puoi cancellarli dalle impostazioni del browser o uscendo dall'account.</p>
`;

LEGAL.it.terminos = `
  <div class="legal-note">⚠️ Modello indicativo. Adatta le condizioni alla tua operatività reale e falle verificare da un professionista.</div>
  <p class="legal-upd">Ultimo aggiornamento: ${LEGAL_UPDATED.it}</p>
  <h2>1. Titolare</h2>
  <p><strong>${LEGAL_BIZ.nombre}</strong>, P. IVA ${LEGAL_BIZ.piva}, sede in ${LEGAL_BIZ.sede}. Contatti: ${LEGAL_BIZ.email} · ${LEGAL_BIZ.tel}.</p>
  <h2>2. Oggetto</h2>
  <p>Regolano l'uso del sito e gli ordini di cibo per consegna a domicilio (delivery) o ritiro in negozio.</p>
  <h2>3. Prezzi</h2>
  <p>In euro (€), IVA inclusa. Possono essere aggiornati; si applica il prezzo vigente alla conferma dell'ordine.</p>
  <h2>4. Ordini e consegna</h2>
  <ul>
    <li>Ordine minimo: <strong>10&nbsp;€</strong>.</li>
    <li>Consegna gratuita da <strong>25&nbsp;€</strong>; sotto tale importo, costo di <strong>2,90&nbsp;€</strong>.</li>
    <li>I tempi sono stimati e possono variare.</li>
    <li>Il delivery è disponibile solo nelle zone indicate in «Locales».</li>
  </ul>
  <h2>5. Pagamento</h2>
  <p>Accettiamo i metodi indicati in fase d'ordine (carta, PayPal, Satispay ed eventualmente contanti).</p>
  <h2>6. Diritto di recesso</h2>
  <p>Ai sensi del Codice del Consumo (art. 59), gli alimenti preparati e deperibili sono esclusi dal diritto di recesso di 14 giorni. In caso di problemi, contattaci e troveremo una soluzione.</p>
  <h2>7. Allergeni</h2>
  <p>In caso di allergie o intolleranze, contatta il punto vendita prima di ordinare.</p>
  <h2>8. Responsabilità</h2>
  <p>Ci impegniamo per informazioni corrette, ma possono esserci errori od omissioni.</p>
  <h2>9. Legge applicabile</h2>
  <p>Si applica la legge italiana; competente il foro del consumatore previsto dalla normativa.</p>
  <h2>10. Modifiche</h2>
  <p>Possiamo modificarle; la versione vigente è quella pubblicata su questo sito.</p>
`;

/* ===================== RENDER + TOGGLE ===================== */
let LEGAL_LANG = "es";

function renderLegalPage(key) {
  const root = document.getElementById("legalRoot");
  if (!root) return;
  root.dataset.key = key;
  const lab = LEGAL_LABELS[LEGAL_LANG][key];
  const title = document.getElementById("legalTitle");
  const sub = document.getElementById("legalSub");
  if (title) title.textContent = lab.t;
  if (sub) sub.textContent = lab.s;
  root.innerHTML = `
    <div class="legal-lang">
      <button class="${LEGAL_LANG === "es" ? "active" : ""}" onclick="setLegalLang('es')">🇪🇸 Español</button>
      <button class="${LEGAL_LANG === "it" ? "active" : ""}" onclick="setLegalLang('it')">🇮🇹 Italiano</button>
    </div>
    <div class="legal-body">${LEGAL[LEGAL_LANG][key]}</div>`;
}

function setLegalLang(lang) {
  LEGAL_LANG = lang;
  const root = document.getElementById("legalRoot");
  if (root && root.dataset.key) renderLegalPage(root.dataset.key);
}
