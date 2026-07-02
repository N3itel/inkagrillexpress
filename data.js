/* ===========================================================
   Inka Grill Express — Datos del menú y locales
   Moneda: Euro (€). Negocio peruano-italiano en la Toscana.
   Catálogo actualizado según la carta real (junio 2026).
   =========================================================== */

const CURRENCY = "€";

function formatPrice(value) {
  return CURRENCY + value.toFixed(2).replace(".", ",");
}

/* Helpers de imágenes (fotos de stock libres — Pexels) */
const PX  = (id) => "https://images.pexels.com/photos/" + id + "/pexels-photo-" + id + ".jpeg?auto=compress&cs=tinysrgb&w=600";
const PXP = (id) => "https://images.pexels.com/photos/" + id + "/pexels-photo-" + id + ".png?auto=compress&cs=tinysrgb&w=600";

/* Fotos reutilizadas por tipo de plato */
const IMG = {
  chicken:  PX(13458086),  // pollo a la brasa al carbón
  spit:     PX(25391590),  // pollos al spiedo
  flames:   PX(31748664),  // pollos enteros a la llama
  fries:    PX(1583891),   // papas fritas
  salad:    PX(4198015),   // ensalada fresca
  rice:     PX(343871),    // arroz salteado
  grilled:  PX(604659),    // parrilla / verduras
  soda:     PX(8880742),   // bebida con hielo
  shawarma: PXP(30328049), // shawarma a la parrilla vertical
  falafel:  PX(6631954),   // falafel (veggie)
  pizza:    PX(20115306),  // pizza margherita
  tiramisu: PX(754954),    // tiramisú
  pannacotta: PX(11054249),// panna cotta / crema
  gelato:   PX(5061192),   // gelato artesanal
  cannoli:  PX(7474117),   // cannoli sicilianos
  swissroll: PX(30372662), // pionono / brazo de gitano
  palta:    PX(557659),    // palta / aguacate
  choclo:   PX(6851933),   // choclo / maíz
  aceitunas: PX(4109912),  // aceitunas
  hongos:   PX(13422401),  // hongos salteados
  pesto:    PX(5604816),   // pesto / salsas verdes
  tomatesecos: PX(33984941), // tomates secos
};

/* Categorías del menú (orden y metadatos) */
const CATEGORIES = [
  { id: "pollos",          name: "Pollo a la Brasa",  icon: "🍗", tag: "Al carbón" },
  { id: "combos",          name: "Combos",            icon: "🍱", tag: "Ahorra más" },
  { id: "shawarma",        name: "Shawarma",          icon: "🥙", tag: "Recién hecho" },
  { id: "pizza",           name: "Pizza",             icon: "🍕", tag: "Al horno" },
  { id: "conos",           name: "Conos · ¡Nuevo!",   icon: "🍦", tag: "Lo nuevo" },
  { id: "ensaladas",       name: "Ensaladas",         icon: "🥗", tag: "Fresco" },
  { id: "acompanamientos", name: "Acompañamientos",  icon: "🍟", tag: "El complemento" },
  { id: "salchipapas",     name: "Salchipapas & Broaster", icon: "🌭", tag: "Fritura" },
  { id: "postres",         name: "Postres",           icon: "🍰", tag: "Dulce final" },
  { id: "bebidas",         name: "Bebidas",           icon: "🥤", tag: "Bien frías" },
  { id: "salsas",          name: "Salsas y Toppings", icon: "🥣", tag: "Extras" },
];

/* Productos */
const PRODUCTS = [
  /* ---------------- POLLO A LA BRASA ---------------- */
  { id: "po-cuarto", cat: "pollos", emoji: "🍗", img: "assets/products/po_cuarto.jpg", name: "1/4 de Pollo a la Brasa",
    desc: "Con papas fritas y ensalada.", price: 14.99 },
  { id: "po-medio", cat: "pollos", emoji: "🍗", img: "assets/products/po_medio.jpg", name: "1/2 Pollo a la Brasa",
    desc: "Con papas fritas y ensalada.", price: 24.99, badge: "El favorito" },
  { id: "po-entero", cat: "pollos", emoji: "🍗", img: "assets/products/po_entero.jpg", name: "Pollo Entero a la Brasa",
    desc: "Con papas fritas y ensalada. Ideal para compartir.", price: 49.99, badge: "Para la familia" },

  /* ---------------- SHAWARMA ---------------- */
  { id: "sh-clasico", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_clasico.jpg", name: "Shawarma Clásico",
    desc: "Carne, lechuga, tomate, cebolla, pepinillos, salsa de ajo y salsa de la casa.", price: 7.50, badge: "Bestseller" },
  { id: "sh-peruano", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_peruano.jpg", name: "Shawarma Peruano",
    desc: "Carne, lechuga, tomate, cebolla morada, ají amarillo, salsa huancaína y salsa de ajo.", price: 8.50, badge: "Fusión" },
  { id: "sh-italiano", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_italiano.jpg", name: "Shawarma Italiano",
    desc: "Carne, rúcula, tomates secos, parmesano, salsa pesto y salsa de ajo.", price: 8.50 },
  { id: "sh-mixto", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_mixto.jpg", name: "Shawarma Mixto",
    desc: "Carne mixta de pollo y cordero, lechuga, tomate, cebolla, pepinillos y salsas.", price: 8.00 },
  { id: "sh-pollo", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_pollo.jpg", name: "Shawarma de Pollo",
    desc: "Pollo marinado, lechuga, tomate, cebolla, pepinillos y salsas.", price: 7.50 },
  { id: "sh-cordero", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_cordero.jpg", name: "Shawarma de Cordero",
    desc: "Cordero especiado, lechuga, tomate, cebolla, pepinillos y salsas.", price: 8.50 },
  { id: "sh-veggie", cat: "shawarma", emoji: "🥗", img: "assets/products/sh_veggie.jpg", name: "Shawarma Veggie",
    desc: "Falafel, lechuga, tomate, cebolla, pepinillos, hummus y salsa de ajo.", price: 7.00, veg: true },
  { id: "sh-doble", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_doble.jpg", name: "Shawarma Doble Carne",
    desc: "Doble porción de carne, lechuga, tomate, cebolla, pepinillos y salsas.", price: 10.00, badge: "XL" },
  { id: "sh-picante", cat: "shawarma", emoji: "🥙", img: "assets/products/sh_picante.jpg", name: "Shawarma Picante",
    desc: "Carne, lechuga, tomate, cebolla, jalapeños, salsa picante y salsa de ajo.", price: 8.00, spicy: true },
  { id: "sh-plato", cat: "shawarma", emoji: "🍽️", img: "assets/products/sh_plato.jpg", name: "Shawarma en Plato",
    desc: "Carne, arroz, papas, ensalada, hummus, pan pita y salsas.", price: 11.00, badge: "Completo" },

  /* ---------------- PIZZA (ejemplos · pendiente carta real) ---------------- */
  { id: "pz-margherita", cat: "pizza", emoji: "🍕", img: "assets/products/pz_margherita.jpg", name: "Pizza Margherita",
    desc: "Tomate, mozzarella y albahaca fresca.", price: 7.50 },
  { id: "pz-prosciutto", cat: "pizza", emoji: "🍕", img: "assets/products/pz_prosciutto.jpg", name: "Pizza Prosciutto",
    desc: "Tomate, mozzarella y prosciutto crudo.", price: 9.50 },
  { id: "pz-diavola", cat: "pizza", emoji: "🍕", img: "assets/products/pz_diavola.jpg", name: "Pizza Diavola",
    desc: "Tomate, mozzarella y salami picante.", price: 9.00, spicy: true },
  { id: "pz-formaggi", cat: "pizza", emoji: "🧀", img: "assets/products/pz_formaggi.jpg", name: "Pizza Quattro Formaggi",
    desc: "Mozzarella, gorgonzola, parmesano y provolone.", price: 9.50 },
  { id: "pz-inka", cat: "pizza", emoji: "🍕", img: "assets/products/pz_inka.jpg", name: "Pizza Inka",
    desc: "Mozzarella, pollo a la brasa, ají amarillo y cebolla morada.", price: 10.50, badge: "Fusión" },

  /* ---------------- ENSALADAS ---------------- */
  { id: "en-mixta", cat: "ensaladas", emoji: "🥗", img: "assets/products/en_mixta.jpg", name: "Ensalada Mixta",
    desc: "Lechuga, tomate, cebolla morada, pepino y zanahoria.", price: 6.50, veg: true },
  { id: "en-cesar", cat: "ensaladas", emoji: "🥗", img: "assets/products/en_cesar.jpg", name: "Ensalada César",
    desc: "Lechuga romana, pollo, parmesano, crutones y salsa césar.", price: 7.90 },

  /* ---------------- ACOMPAÑAMIENTOS ---------------- */
  { id: "ac-papas", cat: "acompanamientos", emoji: "🍟", img: "assets/products/ac_papas.jpg", name: "Papas Fritas",
    desc: "Crocantes y doradas.", price: 3.50 },
  { id: "ac-arroz", cat: "acompanamientos", emoji: "🍚", img: "assets/products/ac_arroz.jpg", name: "Arroz Blanco",
    desc: "Arroz graneado al estilo peruano.", price: 3.50 },
  { id: "ac-chaufa", cat: "acompanamientos", emoji: "🍚", img: "assets/products/ac_chaufa.jpg", name: "Arroz Chaufa",
    desc: "Arroz salteado al wok con verduras.", price: 4.50 },
  { id: "ac-verduras", cat: "acompanamientos", emoji: "🥦", img: "assets/products/ac_verduras.jpg", name: "Verduras a la Parrilla",
    desc: "Verduras de temporada a la parrilla.", price: 4.50, veg: true },

  /* ---------------- POSTRES ---------------- */
  { id: "po-suspiro", cat: "postres", emoji: "🍮", img: "assets/products/po_suspiro.jpg", name: "Suspiro a la Limeña",
    desc: "Manjar blanco con merengue al oporto.", price: 4.50 },
  { id: "po-mazamorra", cat: "postres", emoji: "🫐", img: "assets/products/po_mazamorra.jpg", name: "Mazamorra Morada",
    desc: "Postre de maíz morado con frutas.", price: 4.50 },
  { id: "po-arrozleche", cat: "postres", emoji: "🍚", img: "assets/products/po_arrozleche.jpg", name: "Arroz con Leche",
    desc: "Cremoso, con un toque de canela.", price: 4.50 },
  { id: "po-pionono", cat: "postres", emoji: "🍥", img: "assets/products/po_pionono.jpg", name: "Pionono",
    desc: "Bizcocho enrollado relleno de manjar.", price: 4.50 },
  { id: "po-tiramisu", cat: "postres", emoji: "🍰", img: "assets/products/po_tiramisu.jpg", name: "Tiramisú",
    desc: "Clásico italiano con café y mascarpone.", price: 5.50, badge: "Italiano" },
  { id: "po-pannacotta", cat: "postres", emoji: "🍮", img: "assets/products/po_pannacotta.jpg", name: "Panna Cotta",
    desc: "Suave, con coulis de frutos rojos.", price: 5.50 },
  { id: "po-gelato", cat: "postres", emoji: "🍨", img: "assets/products/po_gelato.jpg", name: "Gelato Artesanal",
    desc: "Helado italiano artesanal.", price: 5.50 },
  { id: "po-cannoli", cat: "postres", emoji: "🥐", img: "assets/products/po_cannoli.jpg", name: "Cannoli Sicilianos",
    desc: "Crujientes rellenos de ricotta dulce.", price: 5.50 },

  /* ---------------- BEBIDAS ---------------- */
  { id: "be-chicha", cat: "bebidas", emoji: "🟣", img: "assets/products/be_chicha.jpg", name: "Chicha Morada",
    desc: "Refresco peruano de maíz morado.", price: 3.20 },
  { id: "be-maracuya", cat: "bebidas", emoji: "🥭", img: "assets/products/be_maracuya.jpg", name: "Maracuyá",
    desc: "Jugo natural de maracuyá.", price: 3.20 },
  { id: "be-inka", cat: "bebidas", emoji: "🥤", img: "assets/products/be_inka.jpg", name: "Inka Cola",
    desc: "La gaseosa dorada del Perú.", price: 3.20, badge: "Peruana" },
  { id: "be-coca", cat: "bebidas", emoji: "🥤", img: "assets/products/be_coca.jpg", name: "Coca-Cola",
    desc: "Bien helada.", price: 3.20 },

  /* ---------------- SALSAS Y TOPPINGS ---------------- */
  /* Cremas */
  { id: "sa-mayo", cat: "salsas", emoji: "🥚", img: "assets/products/sa_mayo.jpg", name: "Mayonesa", desc: "Crema de la casa.", price: 1.20 },
  { id: "sa-chimi", cat: "salsas", emoji: "🌿", img: "assets/products/sa_chimi.jpg", name: "Chimichurri", desc: "Hierbas y ajo.", price: 1.20 },
  { id: "sa-aji", cat: "salsas", emoji: "🌶️", img: "assets/products/sa_aji.jpg", name: "Ají de Pollería", desc: "El clásico ají verde.", price: 1.20 },
  { id: "sa-ocopa", cat: "salsas", emoji: "🥜", img: "assets/products/sa_ocopa.jpg", name: "Ocopa", desc: "Salsa arequipeña de huacatay.", price: 1.20 },
  /* Toppings peruanos */
  { id: "sa-huancaina", cat: "salsas", emoji: "🧀", img: "assets/products/sa_huancaina.jpg", name: "Salsa Huancaína", desc: "Crema de ají amarillo y queso.", price: 1.20 },
  { id: "sa-cebolla", cat: "salsas", emoji: "🧅", img: "assets/products/sa_cebolla.jpg", name: "Cebolla Encurtida", desc: "Cebolla morada encurtida.", price: 1.50 },
  { id: "sa-rocoto", cat: "salsas", emoji: "🌶️", img: "assets/products/sa_rocoto.jpg", name: "Rocoto Picante", desc: "Para los valientes.", price: 1.50, spicy: true },
  { id: "sa-criolla", cat: "salsas", emoji: "🧅", img: "assets/products/sa_criolla.jpg", name: "Salsa Criolla", desc: "Cebolla, limón y ají.", price: 1.50 },
  { id: "sa-choclo", cat: "salsas", emoji: "🌽", img: "assets/products/sa_choclo.jpg", name: "Choclo", desc: "Maíz peruano.", price: 1.50 },
  { id: "sa-palta", cat: "salsas", emoji: "🥑", img: "assets/products/sa_palta.jpg", name: "Palta", desc: "Aguacate fresco.", price: 1.50 },
  /* Toppings italianos */
  { id: "sa-parmesano", cat: "salsas", emoji: "🧀", img: "assets/products/sa_parmesano.jpg", name: "Parmesano", desc: "Queso parmesano rallado.", price: 1.50 },
  { id: "sa-pesto", cat: "salsas", emoji: "🌿", img: "assets/products/sa_pesto.jpg", name: "Pesto", desc: "Albahaca, piñones y parmesano.", price: 1.50 },
  { id: "sa-tomatesecos", cat: "salsas", emoji: "🍅", img: "assets/products/sa_tomatesecos.jpg", name: "Tomates Secos", desc: "En aceite de oliva.", price: 1.50 },
  { id: "sa-rucula", cat: "salsas", emoji: "🥬", img: "assets/products/sa_rucula.jpg", name: "Rúcula", desc: "Fresca y aromática.", price: 1.50 },
  { id: "sa-mozzarella", cat: "salsas", emoji: "🧀", img: "assets/products/sa_mozzarella.jpg", name: "Mozzarella de Búfala", desc: "Cremosa y artesanal.", price: 1.80 },
  { id: "sa-prosciutto", cat: "salsas", emoji: "🍖", img: "assets/products/sa_prosciutto.jpg", name: "Prosciutto Crudo", desc: "Jamón curado italiano.", price: 1.80 },
  { id: "sa-bruschetta", cat: "salsas", emoji: "🍅", img: "assets/products/sa_bruschetta.jpg", name: "Bruschetta", desc: "Tomate, ajo y albahaca.", price: 1.50 },
  { id: "sa-aceitunas", cat: "salsas", emoji: "🫒", img: "assets/products/sa_aceitunas.jpg", name: "Aceitunas Negras", desc: "Aceitunas mediterráneas.", price: 1.50 },
  { id: "sa-hongos", cat: "salsas", emoji: "🍄", img: "assets/products/sa_hongos.jpg", name: "Hongos Salteados", desc: "Champiñones al ajillo.", price: 1.50 },
  { id: "sa-pimientos", cat: "salsas", emoji: "🫑", img: "assets/products/sa_pimientos.jpg", name: "Pimientos Asados", desc: "Pimientos a la parrilla.", price: 1.50 },

  /* ---- SALCHIPAPAS & BROASTER ---- */
  { id: "sp-salchipapa", cat: "salchipapas", emoji: "🌭", img: "assets/products/sp_salchipapa.jpg", name: "Salchipapa",
    desc: "Papas fritas crocantes con salchicha en rodajas y nuestras cremas.", price: 5.50, badge: "Clásico" },
  { id: "sp-salchipollo", cat: "salchipapas", emoji: "🍗", img: "assets/products/sp_salchipollo.jpg", name: "Salchipollo",
    desc: "Papas, salchicha y trozos de pollo crocante. Doble proteína.", price: 7.50, badge: "Popular" },
  { id: "sp-salchibrasa", cat: "salchipapas", emoji: "🔥", img: "assets/products/sp_salchibrasa.jpg", name: "Salchibrasa",
    desc: "Papas y salchicha coronadas con jugosos trozos de pollo a la brasa.", price: 8.90, badge: "Favorito" },
  { id: "sp-broaster-pierna", cat: "salchipapas", emoji: "🍗", img: "assets/products/sp_broaster_pierna.jpg", name: "Pollo Broaster · Pierna",
    desc: "Pierna de pollo apanada, súper crocante y jugosa por dentro.", price: 4.50 },
  { id: "sp-broaster-ala", cat: "salchipapas", emoji: "🍗", img: "assets/products/sp_broaster_ala.jpg", name: "Pollo Broaster · Ala",
    desc: "Alitas broaster doradas y crocantes.", price: 4.00 },
  { id: "sp-broaster-pecho", cat: "salchipapas", emoji: "🍗", img: "assets/products/sp_broaster_pecho.jpg", name: "Pollo Broaster · Pecho",
    desc: "Pechuga broaster crocante por fuera y jugosa por dentro.", price: 5.50 },
  { id: "sp-nuggets", cat: "salchipapas", emoji: "🍗", img: "assets/products/sp_nuggets.jpg", name: "Nuggets de Pollo (9u)",
    desc: "Nueve nuggets crocantes con la salsa que elijas.", price: 6.50 },

  /* ---- CONOS · LO NUEVO ---- */
  { id: "co-salchicono", cat: "conos", emoji: "🌭", img: "assets/products/co_salchicono.jpg", name: "Salchicono",
    desc: "Nuestra salchipapa servida en cono para llevar: papas, salchicha y cremas.", price: 5.90, badge: "Nuevo" },
  { id: "co-salchicono-brasa", cat: "conos", emoji: "🔥", img: "assets/products/co_salchicono_brasa.jpg", name: "Salchicono a la Brasa",
    desc: "Cono de papas y salchicha coronado con trozos de pollo a la brasa.", price: 7.90, badge: "Nuevo" },
  { id: "co-mostro-brasa", cat: "conos", emoji: "🔥", img: "assets/products/co_mostro_brasa.jpg", name: "Cono Mostro a la Brasa",
    desc: "El cono más cargado: papas, salchicha, pollo a la brasa, queso y cremas.", price: 9.90, badge: "Nuevo" },
  { id: "co-broaster", cat: "conos", emoji: "🍗", img: "assets/products/co_broaster.jpg", name: "Cono Broaster",
    desc: "Cono de papas con trozos de pollo broaster crocante.", price: 7.50, badge: "Nuevo" },
  { id: "co-nuggets", cat: "conos", emoji: "🍗", img: "assets/products/co_nuggets.jpg", name: "Cono Nuggets",
    desc: "Cono de papas con nuggets crocantes y cremas.", price: 6.90, badge: "Nuevo" },
  { id: "co-mixto", cat: "conos", emoji: "🌭", img: "assets/products/co_mixto.jpg", name: "Cono Mixto",
    desc: "Papas, salchicha, broaster y pollo a la brasa. Para los que quieren todo.", price: 8.90, badge: "Nuevo" },

  /* ---- COMBOS ---- */
  { id: "cb-familiar", cat: "combos", emoji: "🍗", name: "Combo Familiar",
    desc: "Pollo entero + papas familiares + ensalada + gaseosa 1.5L. Para compartir.", price: 26.90, badge: "Ahorra €6" },
  { id: "cb-duo", cat: "combos", emoji: "🔥", name: "Combo Dúo a la Brasa",
    desc: "1/2 pollo a la brasa + papas + ensalada + 2 bebidas.", price: 18.90, badge: "Ahorra €4" },
  { id: "cb-personal", cat: "combos", emoji: "🍗", name: "Combo Personal",
    desc: "1/4 de pollo a la brasa + papas + bebida personal.", price: 9.90, badge: "Popular" },
  { id: "cb-broaster", cat: "combos", emoji: "🍗", name: "Combo Broaster",
    desc: "3 presas de pollo broaster + papas + bebida.", price: 12.90 },
  { id: "cb-shawarma", cat: "combos", emoji: "🥙", name: "Combo Shawarma",
    desc: "Shawarma completo + papas + bebida.", price: 10.90 },
  { id: "cb-salchi", cat: "combos", emoji: "🌭", name: "Combo Salchipapa",
    desc: "Salchipapa grande + bebida.", price: 7.90 },
  { id: "cb-cono", cat: "combos", emoji: "🍦", name: "Combo Conos",
    desc: "2 conos a elección + bebida.", price: 13.90, badge: "Nuevo" },
];

/* Locales (Toscana, Italia) */
const LOCALES = [
  { id: "firenze", name: "Inka Grill Express — Firenze Centro",
    address: "Via dei Calzaiuoli 12, 50122 Firenze (FI)",
    phone: "+39 055 123 4567", hours: "Lun–Dom · 11:00 – 23:00",
    lat: 43.7711, lng: 11.2556,
    delivery: true, pickup: true },
  { id: "firenzuola", name: "Inka Grill Express — Firenzuola",
    address: "Piazza Don Stefano Casini 3, 50033 Firenzuola (FI)",
    phone: "+39 055 765 4321", hours: "Mar–Dom · 12:00 – 22:30",
    lat: 44.1186, lng: 11.3789,
    delivery: true, pickup: true },
  { id: "prato", name: "Inka Grill Express — Prato",
    address: "Via Roma 88, 59100 Prato (PO)",
    phone: "+39 0574 998 877", hours: "Lun–Dom · 11:30 – 23:00",
    lat: 43.8777, lng: 11.0955,
    delivery: true, pickup: true },
  { id: "bologna", name: "Inka Grill Express — Bologna",
    address: "Via dell'Indipendenza 45, 40121 Bologna (BO)",
    phone: "+39 051 246 802", hours: "Lun–Dom · 11:00 – 00:00",
    lat: 44.4969, lng: 11.3426,
    delivery: false, pickup: true },
];

const DELIVERY = {
  freeFrom: 25,      // delivery gratis desde €25
  fee: 2.90,         // costo si no llega al mínimo
  minOrder: 10,      // pedido mínimo
};

/* =========================================================
   CÁMARA EN VIVO DEL HORNO
   Para activar la transmisión real, pon enabled: true y rellena
   UNA de estas opciones. Si queda desactivado, se muestra el
   horno animado de respaldo.
   ========================================================= */
const LIVECAM = {
  enabled: true,             // ← pon true cuando tengas la transmisión
  provider: "youtube",       // "youtube" | "hls"

  // OPCIÓN A — YouTube en vivo (lo más fácil):
  youtubeId: "FmNEEe7pSOE",  // ID del video en directo, ej. "dQw4w9WgXcQ"
  youtubeChannelId: "",      // …o el ID del canal (directo permanente), ej. "UCxxxxxxxx"

  // OPCIÓN B — Cámara IP / OBS por HLS:
  hlsUrl: "",                // URL .m3u8, ej. "https://midominio.com/horno/stream.m3u8"
};

/* =========================================================
   OPCIONES DE PERSONALIZACIÓN (por categoría)
   type: "single" (elige una) | "multi" (varias). price = € extra por unidad.
   ========================================================= */
const OPTION_PRESETS = {
  pollos: [
    { id: "punto", label: "Punto de cocción", type: "single", required: true,
      choices: [{ label: "Normal" }, { label: "Bien dorado" }, { label: "Extra jugoso" }] },
    { id: "extras", label: "Agrega un extra", type: "multi",
      choices: [{ label: "Papas extra", price: 2.5 }, { label: "Ensalada", price: 2 }, { label: "Salsa huancaína", price: 1 }] },
  ],
  shawarma: [
    { id: "quitar", label: "Quitar ingredientes", type: "multi",
      choices: [{ label: "Sin cebolla" }, { label: "Sin picante" }, { label: "Sin salsa de ajo" }] },
    { id: "extras", label: "Agrega un extra", type: "multi",
      choices: [{ label: "Doble carne", price: 2.5 }, { label: "Extra queso", price: 1 }, { label: "Papas dentro", price: 1 }] },
  ],
  pizza: [
    { id: "masa", label: "Tipo de masa", type: "single", required: true,
      choices: [{ label: "Clásica" }, { label: "Fina" }, { label: "Integral" }] },
    { id: "toppings", label: "Toppings extra", type: "multi",
      choices: [{ label: "Extra queso", price: 1.5 }, { label: "Champiñones", price: 1.5 }, { label: "Prosciutto", price: 2 }] },
  ],
  salchipapas: [
    { id: "extras", label: "Agrega un extra", type: "multi",
      choices: [{ label: "Extra salchicha", price: 1.5 }, { label: "Extra queso", price: 1 }, { label: "Doble papas", price: 2 }, { label: "Pollo a la brasa", price: 2.5 }] },
    { id: "cremas", label: "Cremas", type: "multi",
      choices: [{ label: "Mayonesa" }, { label: "Kétchup" }, { label: "Ají" }, { label: "Mostaza" }, { label: "Huancaína", price: 0.5 }] },
  ],
  conos: [
    { id: "tamano", label: "Tamaño", type: "single", required: true,
      choices: [{ label: "Regular" }, { label: "Grande", price: 2 }] },
    { id: "extras", label: "Agrega un extra", type: "multi",
      choices: [{ label: "Extra salchicha", price: 1.5 }, { label: "Extra queso", price: 1 }, { label: "Pollo a la brasa", price: 2.5 }, { label: "Broaster", price: 2 }] },
    { id: "cremas", label: "Cremas", type: "multi",
      choices: [{ label: "Mayonesa" }, { label: "Kétchup" }, { label: "Ají" }, { label: "Huancaína", price: 0.5 }] },
  ],
  combos: [
    { id: "bebida", label: "Elige tu bebida", type: "single", required: true,
      choices: [{ label: "Inca Kola" }, { label: "Coca-Cola" }, { label: "Chicha morada" }, { label: "Maracuyá" }, { label: "Agua" }] },
    { id: "extras", label: "¿Algo extra?", type: "multi",
      choices: [{ label: "Papas extra", price: 2.5 }, { label: "Salsa huancaína", price: 1 }, { label: "Ají de la casa", price: 0.5 }] },
  ],
};

/* =========================================================
   HORARIOS (para el estado "abierto/cerrado")
   Día: 0=Domingo … 6=Sábado. [abrir, cerrar] en 24h. null = cerrado.
   ========================================================= */
const HOURS = {
  0: ["11:30", "23:00"],
  1: ["11:30", "23:00"],
  2: ["11:30", "23:00"],
  3: ["11:30", "23:00"],
  4: ["11:30", "23:00"],
  5: ["11:30", "23:59"],
  6: ["11:30", "23:59"],
};
function productOptions(p) {
  return (p && OPTION_PRESETS[p.cat]) ? OPTION_PRESETS[p.cat] : [];
}
