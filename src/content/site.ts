/**
 * Todo el contenido editable del sitio vive aquí.
 *
 * Regla: nada inventado. Lo que todavía está en definición (fechas, valores,
 * programa, cupos, cursos, biografías, fotos) se marca como pendiente y la UI
 * lo muestra como "Por confirmar" / "En desarrollo" / "Próximamente".
 */

import type { MaterialName } from "../lib/materials";
import type { ImageName } from "./images.gen";

export const brand = {
  name: "Experience Design",
  instagram: { handle: "@experience__design", url: "https://www.instagram.com/experience__design/" },
  website: "experience-design.cl",
  /** Correo verificado. null = no se muestra. */
  email: "info@experience-design.cl" as string | null,
  /** WhatsApp verificado en formato internacional (ej. "56912345678"). null = no se muestra. */
  whatsapp: "56991979117" as string | null,
  whatsappLabel: "+56 9 9197 9117",
  linkedin: {
    label: "Studio Barla Interiorismo",
    url: "https://www.linkedin.com/company/studiobarlainteriorismo/posts/?feedView=all",
  },
  /**
   * Logo oficial, extraído en vector del PDF del manual (LOGO_EXPERIENCEN1.pdf).
   * `logoAsset` es la marca "E." en negro; el componente Logo la usa como máscara,
   * así toma el color del tono activo (negro sobre claro, marfil sobre oscuro).
   */
  logoAsset: "/brand/mark-dark.svg" as string | null,
  logo: {
    mark: { dark: "/brand/mark-dark.svg", light: "/brand/mark-light.svg" },
    wordmark: { dark: "/brand/wordmark-dark.svg", light: "/brand/wordmark-light.svg" },
  },
};

export type ImageSlot = {
  /** Foto real (nombre en images.gen.ts). Si falta, se muestra una placa de material como sustituto. */
  image?: ImageName;
  alt: string;
  material: MaterialName;
  /** Qué foto debería ir aquí (documentación para el equipo). */
  brief: string;
};

/** Rutas del sitio. La jerarquía (5 entradas principales) no cambia. */
export const routes = {
  inicio: "/",
  nosotros: "/nosotros",
  programas: "/programas",
  formacion: "/programas/formacion",
  marcaPersonal: "/programas/marca-personal",
  destinos: "/destinos",
  milan: "/destinos/milan",
  saoPaulo: "/destinos/sao-paulo",
  contacto: "/contacto",
} as const;

/** Rutas antiguas que ya no existen como página: se redirigen sin dejar rastro en el historial. */
export const redirects: Record<string, string> = {
  "/programas/estudiantes": routes.programas,
  "/programas/profesionales": routes.programas,
};

export type NavItem = { label: string; href: string; children?: { label: string; note?: string; href: string }[] };

/** Navegación principal: Inicio, Nosotros, Programas, Destinos (+ Contacto como CTA). */
export const nav: NavItem[] = [
  { label: "Inicio", href: routes.inicio },
  { label: "Nosotros", href: routes.nosotros },
  {
    label: "Programas",
    href: routes.programas,
    children: [
      { label: "Formación", note: "Aprender", href: routes.formacion },
      { label: "Marca personal", note: "Expresar", href: routes.marcaPersonal },
    ],
  },
  {
    label: "Destinos",
    href: routes.destinos,
    children: [
      { label: "Milán", note: "Salone del Mobile", href: routes.milan },
      { label: "São Paulo", note: "CASACOR", href: routes.saoPaulo },
    ],
  },
];
export const navContact = { label: "Contacto", href: routes.contacto };

/** Títulos de pestaña por ruta. */
export const pageTitles: Record<string, string> = {
  [routes.inicio]: "Experience Design · Abrir la mirada hacia nuevas posibilidades",
  [routes.nosotros]: "Nosotros · Experience Design",
  [routes.programas]: "Programas · Experience Design",
  [routes.formacion]: "Formación · Programas · Experience Design",
  [routes.marcaPersonal]: "Marca personal · Programas · Experience Design",
  [routes.destinos]: "Destinos · Experience Design",
  [routes.milan]: "Milán, Salone del Mobile · Destinos · Experience Design",
  [routes.saoPaulo]: "São Paulo, CASACOR · Destinos · Experience Design",
  [routes.contacto]: "Contacto · Experience Design",
};
/** Título de rutas que no existen (página 404). */
export const notFoundTitle = "Página no encontrada · Experience Design";

/**
 * Descripción de cada página para buscadores y enlaces compartidos. Hechas sólo con frases
 * que ya aparecen en la página correspondiente. Las rutas sin entrada usan la de Inicio.
 */
export const defaultDescription =
  "Experience Design crea experiencias curadas para vivir el diseño desde dentro: experiencias en las capitales del diseño, formación y marca personal. Más que viajar. Vivir el diseño para ampliar la mirada.";
export const pageDescriptions: Record<string, string> = {
  [routes.inicio]: defaultDescription,
  [routes.nosotros]:
    "Experience Design crea experiencias curadas para vivir el diseño desde dentro. Propósito, misión, visión y valores, y quiénes están detrás: Danae Barla y Christian Erdmann.",
  [routes.programas]:
    "Dos programas para llevar lo vivido a la propia práctica: Formación, para aprender, y Marca personal, para expresar el sello propio. Para estudiantes y profesionales del diseño.",
  [routes.formacion]:
    "Formación: cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca.",
  [routes.marcaPersonal]:
    "Marca personal: construir la propia marca y encontrar el sello que distingue a cada persona, estudio o empresa. Partimos de lo que ya tienes: lo que has hecho, lo que sabes y lo que ves distinto.",
  [routes.destinos]:
    "Experiencias en las capitales del diseño: Milán, durante el Salone del Mobile, y São Paulo, en CASACOR. Fotos reales de las experiencias de 2025 y 2026.",
  [routes.milan]:
    "Milán 2027, Salone del Mobile.Milano. Seis días, del 12 al 17 de abril de 2027: el Salone, el Fuorisalone, el Istituto Marangoni y el Lago di Como.",
  [routes.saoPaulo]:
    "São Paulo, CASACOR. Arquitectos, interioristas y paisajistas transforman una casa en una secuencia de ambientes. Una casa no se entiende en una foto. Se recorre.",
  [routes.contacto]:
    "Cuéntanos qué te interesa. Te respondemos con lo concreto: qué es, qué incluye y cuánto cuesta.",
};

/** Cada página termina invitando a la siguiente: un mismo libro, distintos capítulos. */
export const chapterOrder: { href: string; label: string }[] = [
  { href: routes.inicio, label: "Inicio" },
  { href: routes.nosotros, label: "Nosotros" },
  { href: routes.programas, label: "Programas" },
  { href: routes.formacion, label: "Formación" },
  { href: routes.marcaPersonal, label: "Marca personal" },
  { href: routes.destinos, label: "Destinos" },
  { href: routes.milan, label: "Milán" },
  { href: routes.saoPaulo, label: "São Paulo" },
  { href: routes.contacto, label: "Contacto" },
];

export const hero = {
  wordmark: { ink: "wordmark-ink", paper: "wordmark-paper" } as const,
  titleA: "Abrir la mirada",
  titleB: "hacia nuevas posibilidades.",
  cta: "Descubre Milán 2027",
};

export const idea = {
  lead: "El diseño no solo se observa.",
  verbs: ["Se vive.", "Se toca.", "Se reflexiona.", "Se admira."],
  closing: "Hay cosas que una pantalla puede mostrarte, pero no puede hacerte sentir.",
  /** Cierre de la secuencia en Inicio, en dos tiempos. */
  beyond: { lead: "Más allá de la pantalla,", rest: "el diseño se convierte en", accent: "experiencia." },
};

/** Inicio · los tres ejes sobre una línea vertical: Descubrir, Aprender, Expresar. */
export const programsSpine = {
  kicker: "Experience Design",
  title: ["Tres ejes.", "Una misma experiencia."],
  items: [
    {
      id: "experiencias",
      n: "01",
      verb: "Descubrir",
      name: "Experiencias",
      text: "Experiencias curadas en las capitales del diseño, conocidas en su propio contexto.",
      href: routes.destinos as string | undefined,
      cta: "Milán 2027" as string | undefined,
      main: { image: "salone-cocina-bosque" as ImageName, alt: "Salone del Mobile 2026: visitantes en un stand de cocina rodeado por una pantalla envolvente con un bosque" },
      detail: { image: "casacor-arco-verde-mural" as ImageName, alt: "CASACOR São Paulo 2025: un arco de madera oscura en un muro verde enmarca un mural de hojas tropicales" },
      destinations: ["São Paulo", "Milán"],
      next: { label: "Próxima experiencia", place: "Milán 2027", note: "Abril de 2027" },
    },
    {
      id: "formacion",
      n: "02",
      verb: "Aprender",
      name: "Formación",
      text: "Cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca.",
      href: routes.formacion as string | undefined,
      cta: "Conocer Formación" as string | undefined,
      main: { image: "verona-antolini-veta" as ImageName, alt: "Participante recorriendo con la mano la veta de una placa de mármol en el showroom de Antolini, en Verona" },
      detail: { image: "fuori-charla-arcos" as ImageName, alt: "Charla durante el Fuorisalone de Milán: el público sentado bajo una galería de arcos frente a una pantalla" },
    },
    {
      id: "marca-personal",
      n: "03",
      verb: "Expresar",
      name: "Marca personal",
      text: "Acompañamos a construir la propia marca y a encontrar el sello que distingue a cada persona, estudio o empresa.",
      href: routes.marcaPersonal as string | undefined,
      cta: "Conocer Marca personal" as string | undefined,
      main: { image: "marca-vestidor-retrato" as ImageName, alt: "Participante sentada en un puf capitoné de un showroom de vestidores en Milán, con la bolsa de Experience Design" },
      detail: { image: "marca-retrato-backdrop" as ImageName, alt: "Participante sonriendo frente al muro de prensa de un evento de diseño en Milán" },
    },
  ],
};

export const milan = {
  city: "Milán",
  year: "2027",
  event: "Milan Design Week",
  fair: "Salone del Mobile",
  openingImage: { image: "fuori-showroom-biblioteca" as ImageName, alt: "Showroom del Fuorisalone en Milán: pilares de piedra, sofás bajos y una gran biblioteca iluminada al fondo" },
  topics: ["Salone del Mobile", "Showrooms", "Estudios", "Materiales", "Cultura", "Conexiones"],
  statementA: "No venimos a mirar desde afuera.",
  statementB: "Venimos a entrar.",
  chapters: [
    {
      n: "01",
      title: "La ciudad",
      text: "Una ciudad que lleva generaciones pensando cómo vivimos.",
      material: "plaster" as MaterialName,
      image: "milan-galleria-cupula" as ImageName,
      alt: "La Galleria Vittorio Emanuele II de noche, con su cúpula de vidrio y el piso de mosaico",
    },
    {
      n: "02",
      title: "El diseño",
      text: "Durante el Salone del Mobile la ciudad entera se vuelve exposición.",
      material: "terrazzo" as MaterialName,
      image: "salone-escalinata-roja" as ImageName,
      alt: "Escalinata roja de acceso a los pabellones del Salone del Mobile, bajo la cubierta de vidrio de Fiera Milano Rho",
    },
    {
      n: "03",
      title: "Los materiales",
      text: "Superficies, revestimientos, texturas.",
      material: "terracotta" as MaterialName,
      image: "verona-marmol-book-match" as ImageName,
      alt: "Placa de mármol en espejo, con vetas violáceas, en el showroom de Antolini en Verona",
    },
    {
      n: "04",
      title: "Los espacios",
      text: "Patios, fachadas, showrooms, estudios.",
      material: "travertine" as MaterialName,
      image: "fuori-galeria-arcos" as ImageName,
      alt: "Galería de arcos blancos de un espacio del Fuorisalone, con lámparas suspendidas y piso de madera",
    },
    {
      n: "05",
      title: "Las personas",
      text: "Detrás de cada showroom y cada estudio hay alguien que tomó decisiones.",
      material: "walnut" as MaterialName,
      image: "milan-grupo-gessi" as ImageName,
      alt: "El grupo de Experience Design reunido en el espacio de Gessi durante la Milan Design Week",
    },
    {
      n: "06",
      title: "Las conexiones",
      text: "Vuelves con referencias, preguntas y personas con las que seguir conversando.",
      material: "linen" as MaterialName,
      image: "venecia-grupo-escalinata" as ImageName,
      alt: "Participantes sentados en una escalinata de piedra en Venecia, con la bolsa de Experience Design",
    },
  ],
  /** Itinerario 2027, de la ficha de producto oficial (Milan_2027_Ficha_de_producto.pdf). */
  itinerary: {
    label: "Milán 2027",
    title: "Una semana en Milán.",
    body: "Seis días, de lunes a sábado, del 12 al 17 de abril de 2027. Lo más y lo mejor.",
    days: [
      { day: "Día 1", date: "Lunes 12", title: "Bienvenida", text: "Encuentro en Milán, aperitivo de bienvenida en La Rinascente e inicio del Fuorisalone." },
      { day: "Día 2", date: "Martes 13", title: "Salone del Mobile.Milano", text: "Jornada completa en la feria y evento por la noche." },
      { day: "Día 3", date: "Miércoles 14", title: "Salone y Fuorisalone", text: "Charlas, networking y encuentros con marcas líderes del diseño." },
      { day: "Día 4", date: "Jueves 15", title: "Fuorisalone", text: "Visita al Istituto Marangoni y evento nocturno." },
      { day: "Día 5", date: "Viernes 16", title: "Brera y Tortona", text: "Fuorisalone: showrooms, instalaciones y distritos de diseño." },
      { day: "Día 6", date: "Sábado 17", title: "Lago di Como", text: "Visita al lago y aperitivo de cierre." },
    ],
    note: "El itinerario podrá ajustarse según la disponibilidad y los horarios de las empresas que nos reciban, para sumar nuevas visitas y encuentros.",
  },
  /** Lo concreto de Milán 2027 (ficha oficial). El detalle completo está en la landing. */
  facts: {
    title: "Lo concreto.",
    body: "Escríbenos y te enviamos el detalle: qué incluye, formas de pago e inscripción.",
    items: [
      { label: "Fechas", value: "12 al 17 de abril de 2027" },
      { label: "Early bird", value: "USD 2.549 hasta el 30 de noviembre" },
      { label: "Precio normal", value: "USD 2.999 hasta el 15 de enero" },
      { label: "Cupos", value: "Limitados" },
    ],
  },
  galleryLabel: "Milan Design Week 2026",
  galleryTitle: "Lo que recorrimos.",
  gallery: [
    { image: "milan-duomo-grupo-noche", alt: "El grupo de Experience Design frente al Duomo de Milán iluminado, de noche" },
    { image: "salone-cocina-bosque", alt: "Stand del Salone del Mobile 2026: una cocina de madera rodeada por una pantalla envolvente con un bosque" },
    { image: "fuori-showroom-lampara", alt: "Showroom del Fuorisalone con techo de vigas, sofás bajos y una lámpara cálida suspendida" },
    { image: "salone-sillon-cuero", alt: "Sillón de cuero caramelo junto a un mueble de madera y una lámpara de escritorio, en un stand del Salone" },
    { image: "venecia-gran-canal", alt: "Participantes en una lancha sobre el Gran Canal de Venecia" },
    { image: "salone-lamparas-burbujas", alt: "Lámpara de esferas de vidrio sobre una mesa de madera, con plantas detrás, en el Salone del Mobile" },
    { image: "milan-zapato-rojo", alt: "Participante junto a una escultura de un zapato rojo gigante bajo los arcos de la Galleria" },
    { image: "verona-grupo-antolini", alt: "El grupo de Experience Design en el showroom de Antolini, en Verona, frente a una placa de mármol" },
    { image: "salone-cocina-verde", alt: "Cocina de módulos verde oscuro con cubierta de madera en un stand del Salone del Mobile" },
    { image: "milan-tranvia", alt: "Un tranvía histórico avanzando por una calle de Milán" },
    { image: "salone-sofa-repisas", alt: "Sofá curvo claro frente a repisas de vidrio con objetos negros, en un stand del Salone" },
    { image: "milan-grupo-eurocucina", alt: "Participante frente al muro amarillo de EuroCucina en el Salone del Mobile" },
    { image: "venecia-salute", alt: "La basílica de Santa Maria della Salute vista desde el agua, con una góndola en primer plano" },
    { image: "verona-antolini-veta", alt: "Participante recorriendo con la mano la veta de una placa de mármol en Antolini, Verona" },
    { image: "milan-galleria-grupo", alt: "Participantes recorriendo la Galleria Vittorio Emanuele II de noche" },
    { image: "salone-cubierta-rho-fiera", alt: "Christian Erdmann bajo la cubierta de vidrio de Fiera Milano Rho, junto al cartel del Salone del Mobile" },
    { image: "milan-grupo-lago-como", alt: "El grupo de Experience Design en un barco en el lago de Como" },
    { image: "venecia-gran-canal-retrato", alt: "Participante con la bolsa de Experience Design frente al Gran Canal de Venecia" },
  ] as { image: ImageName; alt: string }[],
  cta: "Quiero ser parte",
};

/**
 * Milán 2027: los datos de la ficha de producto oficial (Milan_2027_Ficha_de_producto.pdf).
 * Las frases que el manual de marca evita («la experiencia más exclusiva», «acceso a lo mejor
 * del diseño mundial», «exclusivo» como adorno) se reemplazaron por sus equivalentes del manual.
 */
export const milan2027 = {
  title: "Milán 2027",
  fair: "Salone del Mobile.Milano",
  dates: "12 al 17 de abril de 2027",
  datesShort: "12–17 abril 2027",
  days: "6 días",
  /** La experiencia */
  experience: {
    label: "La experiencia",
    title: ["Vivir el diseño", "donde nace."],
    body: "Experiencias curadas en las capitales del diseño. No somos una agencia de viajes: elegimos qué ver, explicamos por qué importa y te acompañamos para que lo lleves a tu propio contexto.",
    whyLabel: "Por qué Milán",
    why: "Los milaneses respiran diseño. Está en los showrooms, en las calles, en los materiales y en la manera de trabajar de las marcas y las empresas. Durante el Salone y el Fuorisalone, la ciudad entera abre sus puertas.",
    promise: "No vienes solo a conocer el mundo del diseño. Vienes a descubrir qué puede despertar en ti.",
  },
  audience: {
    label: "Para quiénes",
    title: "Para quienes estudian, crean y quieren ir más allá.",
    items: [
      { name: "Mientras te formas", text: "Ver en vivo lo que en clases solo aparece en fotos: piezas, materiales y espacios, con guía y tiempo para preguntar." },
      { name: "Mientras te consolidas", text: "Romper la rutina, contrastar tu mirada con la de otros profesionales y volver con nuevas referencias para tus proyectos." },
      { name: "Cuando buscas tu sello", text: "Descubrir qué te mueve, qué te distingue y cómo contarlo. Lo vivido en Milán se transforma en criterio propio." },
    ],
  },
  places: {
    label: "Dónde ocurre",
    title: "Seis escenarios.",
    items: [
      { name: "Salone del Mobile.Milano", text: "La feria, en Fiera Milano Rho. La recorremos con una selección previa de pabellones y stands.", image: "salone-escalinata-roja" as ImageName, alt: "Escalinata roja de acceso a los pabellones del Salone del Mobile, bajo la cubierta de vidrio de Fiera Milano Rho" },
      { name: "Fuorisalone", text: "Tortona, Brera Design District y cientos de eventos e instalaciones: la ciudad entera como vitrina del diseño.", image: "fuori-showroom-biblioteca" as ImageName, alt: "Showroom del Fuorisalone en Milán: pilares de piedra, sofás bajos y una gran biblioteca iluminada al fondo" },
      { name: "La Rinascente", text: "En la Piazza del Duomo. Desde aquí recorremos la Galleria Vittorio Emanuele II, la Scala, Via Montenapoleone, Via della Spiga y Corso Venezia. Aquí comienza la semana.", image: "milan-galleria-cupula" as ImageName, alt: "La Galleria Vittorio Emanuele II de noche, con su cúpula de vidrio y el piso de mosaico" },
      { name: "Istituto Marangoni", text: "Una de las escuelas de moda y diseño más reconocidas del mundo, nacida en Milán.", image: "fuori-charla-arcos" as ImageName, alt: "Charla durante el Fuorisalone de Milán: el público sentado bajo una galería de arcos frente a una pantalla" },
      { name: "Lago di Como", text: "Villas históricas, jardines frente al agua y montañas que descienden hasta el lago. Llegamos en tren y lo recorremos en ferry.", image: "milan-grupo-lago-como" as ImageName, alt: "El grupo de Experience Design en un barco en el lago de Como" },
      { name: "Milán, la ciudad", text: "Patios escondidos tras cada portón, cafés y una forma de vivir donde el diseño está en todo. A pie, en bici o en scooter: tú eliges.", image: "milan-tranvia" as ImageName, alt: "Un tranvía histórico avanzando por una calle de Milán" },
    ],
  },
  process: {
    label: "Conoce el proceso",
    title: "Lo que vas a ver y tocar.",
    body: "Detrás de una silla, un textil o una cubierta de piedra hay referencias, decisiones y un fundamento. Materiales, terminaciones, proporción y luz, vistos y tocados donde se presentan.",
    quote: "Si no lo tocas, no lo viste.",
    claim: "Reencuéntrate con los fundamentos del diseño, con lo más y lo mejor.",
    image: "verona-antolini-veta" as ImageName,
    alt: "Participante recorriendo con la mano la veta de una placa de mármol en el showroom de Antolini, en Verona",
  },
  includes: {
    label: "Qué incluye",
    title: "Todo lo que incluye.",
    body: "El programa completo en Milán: acceso, curaduría, encuentros y momentos pensados al detalle.",
    items: [
      { name: "Salone del Mobile.Milano y Fuorisalone", text: "Entrada a la feria y recorridos por showrooms y distritos de diseño en Brera y Tortona." },
      { name: "Acompañamiento de Danae y Christian", text: "Toda la semana, para descubrir qué ver y por qué importa." },
      { name: "Istituto Marangoni y encuentros con marcas", text: "Una visita académica e instancias de networking con marcas y empresas." },
      { name: "Lago di Como", text: "Tren y ferry incluidos, con Navigazione Laghi." },
      { name: "Aperitivos de bienvenida y de cierre", text: "Bienvenida en La Rinascente y cierre en el Lago di Como." },
      { name: "Transporte", text: "Transfer desde cualquier punto de Santiago al aeropuerto, ida y vuelta, y pase de 10 viajes en metro en Milán." },
      { name: "Fotógrafo del grupo", text: "10 fotos y 2 videos cortos de tu experiencia, para tu marca personal y tus redes. Registros extra con costo adicional." },
      { name: "eSIM Holafly", text: "Datos desde que llegas, durante todo el viaje." },
      { name: "Productos Experience Design", text: "Productos de diseño para acompañar tu viaje." },
      { name: "Encuentros del grupo", text: "Antes de viajar, para conocerse y llegar a Milán como grupo." },
    ],
    newLabel: "Nuevo en 2027",
    newText: "Fotógrafo del grupo, transfer al aeropuerto en Santiago, encuentros antes de viajar, eSIM Holafly y productos Experience Design.",
    requirementLabel: "Requisito",
    requirement: "Contar con un seguro médico de viaje, por tu seguridad y la del grupo.",
    excludesLabel: "No incluye",
    excludes: ["Vuelos", "Alojamiento", "Alimentación", "Traslados entre el aeropuerto de Milán y la ciudad", "Entradas a visitas turísticas, como el Duomo", "Cualquier servicio que no figure en esta lista"],
    excludesNote: "Vuelos y alojamiento los organiza cada persona según su ciudad de origen. Si lo necesitas, te recomendamos una agencia de viajes.",
  },
  pricing: {
    label: "Inversión",
    title: "Tu lugar en Milán.",
    plans: [
      {
        id: "early",
        name: "Early bird",
        until: "Hasta el 30 de noviembre de 2026",
        price: "USD 2.549",
        badge: "15% de descuento",
        payment: "Pago del 100% hasta el 30 de noviembre de 2026.",
        benefits: [
          "Mentoría 1:1 con Danae y Christian: una sesión para conocer tu contexto y diseñar contigo una visión estratégica personalizada.",
          "Encuentro y mentoría grupal en Studio Barla, con Danae, Christian y el grupo, antes de viajar.",
        ],
        featured: true,
      },
      {
        id: "normal",
        name: "Precio normal",
        until: "Hasta el 15 de enero de 2027",
        price: "USD 2.999",
        badge: "Por persona",
        payment: "50% hasta el 15 de diciembre de 2026 y 50% hasta el 15 de enero de 2027.",
        benefits: ["Encuentro y mentoría grupal en Studio Barla, con Danae, Christian y el grupo, antes de viajar."],
        featured: false,
      },
    ],
    reserve: {
      name: "Reserva tu cupo",
      price: "USD 300",
      until: "Hasta el 30 de noviembre de 2026",
      steps: ["USD 300 no reembolsables aseguran tu lugar.", "50% del total hasta el 15 de diciembre de 2026.", "50% restante hasta el 15 de enero de 2027, cierre de cupos."],
    },
    seats: "Cupos limitados. El grupo se cierra cuando se completan.",
    paymentLabel: "Formas de pago",
    payments: [
      { name: "Transferencia bancaria", text: "Sin recargo." },
      { name: "Tarjeta de crédito vía Webpay", text: "Con un recargo del 4%." },
    ],
    refund: "No se reembolsan las actividades a las que no se asista.",
  },
  people: {
    label: "Las personas",
    title: "Con quién vives la experiencia.",
    body: "Las conversaciones al final del día, las ideas en una cena, el camino al lago: eso es lo que permanece. Vuelves con contactos y una red que sigue creciendo.",
    before: "Antes de viajar, un encuentro para conocer a quienes viajan contigo. El viaje empieza antes de subir al avión.",
    items: [
      { name: "Personas con tu misma ambición", text: "Quieren crecer y viven esta semana como una inversión en su desarrollo." },
      { name: "Relaciones que continúan", text: "Colegas de otras ciudades y países con quienes compartes la feria y los descubrimientos. El vínculo sigue al volver." },
      { name: "La red de los curadores", text: "Danae Barla y Christian Erdmann abren puertas a empresas, marcas y personas del diseño que conocen de primera mano." },
    ],
    image: "milan-grupo-gessi" as ImageName,
    alt: "El grupo de Experience Design reunido en el espacio de Gessi durante la Milan Design Week",
  },
  /** Testimonios textuales de la ficha oficial. */
  testimonials: {
    label: "Personas que ya dieron el primer paso",
    items: [
      { quote: "Desde el primer contacto sentí que estaba tomando la mejor decisión para mi primer viaje soñado al Salón del Mueble de Milán 2026. Danae y Christian fueron unos anfitriones excepcionales.", name: "Gisèle Valentiè", role: "Diseñadora industrial · Diseño & Complemento" },
      { quote: "Ir al Salone del Mobile fue un sueño hecho realidad. En medio de tanto por ver, la estructura y la curatoría que ellos propusieron se agradeció muchísimo.", name: "Lucía Bustos", role: "Arquitecta · Especificadora en Codelpa Chile" },
      { quote: "Una experiencia que marcó profundamente mi manera de mirar el diseño. Pero si algo hizo especialmente valioso este viaje fueron las personas.", name: "Katherina Calderón", role: "Diseñadora de interiores · Trunkai Diseño" },
    ],
  },
  fit: {
    label: "Antes de decidir",
    title: "Una inversión en ti.",
    body: "Milán 2027 es una inversión en tu mirada, en tus relaciones y en tu manera de crear.",
    takeawaysLabel: "Lo que te llevas de vuelta",
    takeaways: [
      { name: "Referencias propias", text: "Piezas, materiales y espacios vistos en vivo, que pasan a ser tu archivo de inspiración." },
      { name: "Criterio para aplicarlas", text: "Entender por qué funciona una decisión de diseño y cómo traducirla a tu contexto." },
      { name: "Materiales y procesos", text: "Texturas, terminaciones y soluciones que solo se entienden cuando se tocan." },
      { name: "Relaciones", text: "Colegas, curadores y marcas con quienes seguir conversando al volver." },
      { name: "El registro de tu semana", text: "Lo vivido, ordenado en ideas y referencias para volver a ellas." },
      { name: "Tu propio sello", text: "Una mirada más definida sobre lo que te distingue y cómo mostrarlo." },
    ],
    question: "¿Es para ti?",
    lead: "Este viaje no es para ti si buscas museos, ir de compras o levantarte tarde.",
    yesLabel: "Es para ti si",
    yes: [
      "Quieres un cambio de visión en tu carrera de diseño.",
      "Sabes que invertir en ti es tu mejor decisión.",
      "Quieres experiencias que te reten y te expandan.",
      "Necesitas romper la rutina e inspirarte.",
      "Quieres compartir la experiencia con un grupo que se apoya.",
    ],
    noLabel: "No es para ti si",
    no: [
      "Piensas que es solo turismo y fotos.",
      "No te gusta conectar con otras personas.",
      "Prefieres los referentes online, sin vivirlos.",
      "Crees que es solo para descansar y comprar.",
      "No ves viajar e inspirarte como una inversión.",
    ],
  },
  steps: {
    label: "Siguiente paso",
    title: "Cómo ser parte de Milán 2027.",
    items: [
      { name: "Conversemos", text: "Escríbenos por WhatsApp, Instagram o correo y resolvemos tus dudas." },
      { name: "Reserva o paga", text: "Reserva tu cupo o paga por anticipado: el primer paso para no perder tu lugar." },
      { name: "Completa el pago", text: "Antes del 15 de enero de 2027. Los cupos son limitados." },
      { name: "Conoce al grupo", text: "Al equipo de Experience Design y a quienes viajarán contigo." },
      { name: "Haz tus maletas", text: "Milán te espera." },
    ],
    closing: "No esperes a que te lo cuenten. Vive el diseño donde nace: sé parte de Milán 2027.",
    motto: "Vivirlo. Cuestionarlo. Hacerlo propio.",
  },
};

export const neverLate = {
  doubts: ["Ya es tarde para estudiar.", "Debí hacerlo antes.", "No sé si este mundo es para mí."],
  answer: "Nunca es tarde para mirar distinto.",
  body: "Para quienes trabajan en arquitectura, interiorismo y diseño. Para quienes recién empiezan. Y para quienes deciden empezar otra vez.",
  /** Sólo en Inicio (Profesionales sigue usando `body`). */
  homeBody: "Para quienes eligen seguir creciendo, explorar lo desconocido y descubrir todo lo que todavía es posible.",
};

export const formation = {
  title: "Aprendizaje aplicado, no clases teóricas.",
  formatsLabel: "Formatos que estamos preparando",
  formats: ["Cursos", "Webinars", "Herramientas prácticas", "Fotografía", "Marketing", "Marca"],
  modalities: [
    {
      id: "antes",
      label: "Antes",
      text: "Aprender prepara la mirada.",
    },
    {
      id: "despues",
      label: "Después",
      text: "Volver con referencias propias y criterio para aplicarlas.",
    },
  ],
  status: "Programa en desarrollo",
  cta: "Avísame",
  image: {
    image: "verona-marmol-verde",
    alt: "Placas de mármol verde y de tonos tierra exhibidas en Antolini, Verona",
    material: "plaster",
    brief: "Materiales de cerca.",
  } as ImageSlot,
};

export const personalBrand = {
  titleA: "Tienes una mirada.",
  titleB: "¿Qué hacemos con ella?",
  body: "Te ayudamos a reconocer lo que sabes, lo que has vivido y lo que ves distinto.",
  steps: [
    { title: "Tu historia", text: "Lo que has hecho y vivido, ordenado para que se entienda." },
    { title: "Tu mirada", text: "Lo que ves distinto. Ahí suele estar tu valor." },
    { title: "Tu posicionamiento", text: "Dónde te ubicas, con quién trabajas y por qué." },
    { title: "Tu voz", text: "Cómo lo cuentas, con coherencia, en cada lugar donde apareces." },
  ],
  cta: "Quiero saber más",
};

export const community = {
  title: "Más que viajes, creamos relaciones.",
  disciplines: ["Arquitectura", "Interiorismo", "Diseño", "Marcas", "Materiales", "Iluminación", "Mobiliario", "Industrias creativas"],
  body: "El viaje dura unos días. Las conversaciones que empiezan ahí duran bastante más.",
  image: {
    image: "charla-showroom",
    alt: "Conversación con un diseñador invitado en un showroom de Milán, con público sentado alrededor",
    material: "travertine",
    brief: "Grupo conversando en un showroom (foto real).",
  } as ImageSlot,
};

export const founders = {
  statement: "Detrás de cada experiencia hay personas que llevan años mirando el mundo del diseño desde dentro.",
  people: [
    {
      name: "Danae Barla",
      field: "Arquitecta interiorista · Studio Barla",
      bio: "Desde el interiorismo, selecciona las experiencias, las referencias y los aprendizajes: ferias, showrooms, estudios y materiales que vale la pena conocer en su propio contexto." as string | null,
      image: { image: "danae", alt: "Retrato de Danae Barla", material: "terracotta", brief: "Retrato real de Danae, luz natural. 4:5." } as ImageSlot,
    },
    {
      name: "Christian Erdmann",
      field: "Diseñador industrial · Mobiliario y curaduría de diseño",
      bio: "Abre puertas que no están a la vista y lee los códigos de las grandes casas del diseño." as string | null,
      image: { image: "christian", alt: "Retrato de Christian Erdmann", material: "walnut", brief: "Retrato real de Christian, luz natural. 4:5." } as ImageSlot,
    },
  ],
  bioPending: "Biografía en preparación.",
};

export type ArchiveEntry = {
  year: string;
  place: string;
  tag: string;
  text: string;
  status?: "next" | "soon";
  material: MaterialName;
};

export const archive = {
  title: "Lo que ya recorrimos.",
  entries: [
    {
      year: "2026",
      place: "Milán",
      tag: "Milan Design Week · abril de 2026",
      text: "Salone del Mobile, Fuorisalone y showrooms de la ciudad, con Verona, entre los mármoles de Antolini, y Venecia.",
      material: "travertine",
    },
    {
      year: "2025",
      place: "São Paulo",
      tag: "CASACOR São Paulo · julio de 2025",
      text: "Una casa recorrida ambiente por ambiente, con paradas en Bontempo, Todeschini y Eliane.",
      material: "terracotta",
    },
    {
      year: "2025",
      place: "Milán",
      tag: "Primera experiencia abierta",
      text: "Christian Erdmann se suma al proyecto. Los seis lugares se llenaron a través de contactos y recomendaciones.",
      material: "plaster",
    },
    {
      year: "2024",
      place: "Milán",
      tag: "Piloto",
      text: "Un segundo grupo pequeño. El concepto toma forma junto a empresas de revestimientos, materiales y decoración.",
      material: "travertine",
    },
    {
      year: "2023",
      place: "São Paulo",
      tag: "Piloto",
      text: "La primera prueba, con tres participantes.",
      material: "terracotta",
    },
  ] as ArchiveEntry[],
};

/* ---------------------------------------------------------------------------
 * NOSOTROS
 * ------------------------------------------------------------------------- */

export const about = {
  title: "Nosotros",
  statement: "Abrir la mirada hacia nuevas posibilidades.",
  positioning: { lead: "Más que viajar.", rest: "Vivir el diseño para", accent: "ampliar la mirada." },
  motto: "Vivirlo. Cuestionarlo. Hacerlo propio.",
  promise: "No vienes solo a conocer el mundo del diseño. Vienes a descubrir qué puede despertar en ti.",
  image: {
    image: "fundadores-showroom",
    alt: "Danae Barla y Christian Erdmann en un showroom de baño con muros de mármol",
    material: "travertine",
    brief: "Danae y Christian juntos, en un lugar de diseño.",
  } as ImageSlot,
  who: {
    label: "Quiénes somos",
    text: "Experience Design crea experiencias curadas para vivir el diseño desde dentro, en las capitales del diseño y en los escenarios donde nacen las ideas.",
    history: "Empezó como un experimento con pocas personas. Sigue igual de cerca.",
  },
  /** Textos oficiales del manual de marca (versión aprobada el 21 de octubre de 2026). */
  principles: [
    {
      id: "proposito",
      label: "Propósito",
      text: "Abrir la mirada hacia nuevas posibilidades.",
      body: "Salir de lo conocido cambia la forma en que vemos las cosas.",
    },
    {
      id: "mision",
      label: "Misión",
      text: "Facilitar y contribuir a la evolución de quienes buscan descubrir, aprender y crecer a través del diseño.",
      body: "Con experiencias cuidadosamente curadas que permiten vivirlo desde dentro.",
    },
    {
      id: "vision",
      label: "Visión",
      text: "Consolidar y experimentar dentro.",
      body: "Ser el referente de la curaduría y la vanguardia en la práctica profesional del diseño.",
    },
  ],
  valuesLabel: "Valores",
  values: [
    { name: "Ambición", text: "Aspirar a más: lo más y lo mejor del diseño." },
    { name: "Superación", text: "Evolucionar y no conformarse." },
    { name: "Curiosidad", text: "Explorar, cuestionar y descubrir." },
    { name: "Sello propio", text: "Descubrir lo que distingue a cada persona y expresarlo con criterio y coherencia." },
    { name: "Creatividad", text: "Imaginar nuevas posibilidades." },
    { name: "Relaciones", text: "Construir redes y generar intercambios que aporten valor." },
  ],
  mottoLabel: "Lema",
  promiseLabel: "Promesa",
  philosophyLabel: "Filosofía",
  foundersLabel: "Quiénes están detrás",
};

/* ---------------------------------------------------------------------------
 * PROGRAMAS: Formación y Marca personal. Nunca mezclar con destinos.
 * Estudiantes y profesionales no son programas: son el "para quién" de cada uno.
 * ------------------------------------------------------------------------- */

export type ProgramId = "formacion" | "marca-personal";

export type Program = {
  id: ProgramId;
  n: string;
  /** Verbo del eje (Aprender, Expresar). */
  verb: string;
  name: string;
  href: string;
  /** Idea central del programa. */
  lines: string[];
  intro: string;
  /** Una o dos frases para la página Programas. */
  short: string;
  keywords: string[];
  /** Tono del sitio mientras el programa está activo. */
  tone: "clay" | "sand" | "ink";
  /** Color de la luz WebGL sobre ese tono. */
  glow: string;
  material: MaterialName;
  image: ImageSlot;
  /** Segunda imagen pequeña (el material de cerca). */
  detail?: ImageSlot;
  /** Foto de la página Programas. */
  railImage: { image: ImageName; alt: string };
  audience: { students: string; professionals: string };
  interest: InterestId;
  cta: string;
};

export const programs = {
  title: "Programas",
  lead: "Lo vivido, convertido en criterio propio.",
  question: "¿Qué quieres llevar a tu práctica?",
  hint: "Dos programas",
  more: "Quiero saber más",
  audienceLabel: "Para quién es",
  audienceStudents: "Estudiantes",
  audienceProfessionals: "Profesionales",
  items: [
    {
      id: "formacion",
      n: "01",
      verb: "Aprender",
      name: "Formación",
      href: routes.formacion,
      lines: ["Lo que descubres", "también puede transformarse", "en conocimiento."],
      intro: "Cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca.",
      short: "Cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca.",
      keywords: ["Cursos", "Webinars", "Herramientas", "Fotografía", "Marketing", "Marca"],
      tone: "ink",
      glow: "#C97B4A",
      material: "travertine",
      image: {
        image: "fuori-charla-arcos",
        alt: "Charla durante el Fuorisalone de Milán: el público sentado bajo una galería de arcos frente a una pantalla",
        material: "travertine",
        brief: "Charla o encuentro con profesionales.",
      },
      detail: {
        image: "formacion-muestrario-cueros",
        alt: "Muestrario de cueros de colores ordenados en una repisa de showroom",
        material: "walnut",
        brief: "Material de cerca.",
      },
      railImage: {
        image: "verona-antolini-veta",
        alt: "Participante recorriendo con la mano la veta de una placa de mármol en el showroom de Antolini, en Verona",
      },
      audience: {
        students: "Estudiantes de pregrado en sus últimos años, de posgrado y recién titulados.",
        professionals: "Profesionales de arquitectura, interiorismo y diseño.",
      },
      interest: "formacion",
      cta: "Conocer Formación",
    },
    {
      id: "marca-personal",
      n: "02",
      verb: "Expresar",
      name: "Marca personal",
      href: routes.marcaPersonal,
      lines: ["Tienes una mirada.", "¿Qué hacemos con ella?"],
      intro: "Construir la propia marca y encontrar el sello que distingue a cada persona, estudio o empresa.",
      short: "Construir la propia marca y encontrar el sello que distingue a cada persona, estudio o empresa.",
      keywords: ["Tu historia", "Tu mirada", "Tu posicionamiento", "Tu voz"],
      tone: "clay",
      glow: "#F1D6BF",
      material: "linen",
      image: {
        image: "marca-retrato-backdrop",
        alt: "Participante sonriendo frente al muro de prensa de un evento de diseño en Milán",
        material: "linen",
        brief: "Retrato de una participante, luz natural, vertical.",
      },
      railImage: {
        image: "marca-showroom-retrato",
        alt: "Participante sentada en un showroom de Milán, entre espejos redondos y butacas de cuero",
      },
      audience: {
        students: "Estudiantes de pregrado en sus últimos años, de posgrado y recién titulados.",
        professionals: "Profesionales de arquitectura, interiorismo y diseño.",
      },
      interest: "marca",
      cta: "Conocer Marca personal",
    },
  ] as Program[],
};

export const programPending = {
  label: "Lo concreto",
  status: "Por confirmar",
};

export const formationPage = {
  closeTitle: "Lo concreto, apenas esté confirmado.",
  closeBody: "Te avisamos cuando abramos los primeros cursos y webinars.",
  pending: ["Cursos", "Fechas", "Valor"],
};

export const personalBrandPage = {
  notLabel: "Lo que no es",
  not: ["Crecer en redes sociales.", "Ser influencer.", "Hacerte famoso en internet."],
  notAnswer: "Se trata de tu valor profesional.",
  notBody: "Partimos de lo que ya tienes: lo que has hecho, lo que sabes y lo que ves distinto.",
  focusLabel: "En qué se enfoca",
  focus: ["Tu experiencia", "Tu trayectoria", "Tu perspectiva", "Tus fortalezas", "Tu posicionamiento", "Tu identidad profesional", "Tu voz", "Tu narrativa"],
  closeTitle: "Empecemos por tu historia.",
  closeBody: "Te respondemos con lo concreto cuando el programa esté confirmado.",
  pending: ["Formato", "Fechas", "Valor"],
};

/* ---------------------------------------------------------------------------
 * DESTINOS: experiencias para vivir. No son programas.
 * ------------------------------------------------------------------------- */

export type CollagePhoto = { image: ImageName; alt: string };

export const destinations = {
  title: "Destinos",
  lead: "Hay lugares que cambian tu forma de mirar.",
  /** Sólo en Inicio: la sección Destinos (la página Destinos sigue usando `lead`). */
  homeLead: "Hay mundos que, cuando los vives, amplían el tuyo.",
  question: "¿Qué experiencia puedo vivir?",
  more: "Quiero saber más",
  doneLabel: "Experiencia realizada",
  items: [
    {
      id: "milan",
      n: "01",
      name: "Milán",
      event: "Milan Design Week",
      sub: "Salone del Mobile",
      href: routes.milan,
      when: "12 al 17 de abril de 2027",
      done: "Abril de 2026",
      text: "La semana en que una ciudad entera se vuelve exposición.",
      cta: "Entrar a Milán",
      /** Inicio: la etiqueta del selector y su carrusel. */
      homeLabel: "Salone del Mobile",
      collage: [
        { image: "salone-cocina-bosque", alt: "Stand del Salone del Mobile 2026: una cocina de madera rodeada por una pantalla envolvente con un bosque" },
        { image: "milan-duomo-grupo-noche", alt: "El grupo de Experience Design frente al Duomo de Milán iluminado, de noche" },
        { image: "salone-escalinata-roja", alt: "Escalinata roja de acceso a los pabellones del Salone del Mobile, bajo la cubierta de vidrio de Fiera Milano Rho" },
        { image: "fuori-showroom-lampara", alt: "Showroom del Fuorisalone con techo de vigas, sofás bajos y una lámpara cálida suspendida" },
        { image: "verona-marmol-verde", alt: "Placas de mármol verde y de tonos tierra exhibidas en Antolini, Verona" },
        { image: "milan-galleria-cupula", alt: "La Galleria Vittorio Emanuele II de noche, con su cúpula de vidrio y el piso de mosaico" },
        { image: "salone-cielo-cintas", alt: "Instalación de cintas blancas suspendidas sobre un stand del Salone del Mobile" },
        { image: "milan-grupo-suelo-rojo", alt: "Participantes sentados en un banco junto al suelo rojo de un pabellón del Salone" },
        { image: "venecia-gondola", alt: "Participante en una góndola bajo un puente de Venecia" },
      ] as CollagePhoto[],
      gallery: [
        { image: "salone-cocina-bosque" as ImageName, alt: "Stand del Salone del Mobile 2026: una cocina de madera rodeada por una pantalla envolvente con un bosque" },
        { image: "fuori-showroom-biblioteca" as ImageName, alt: "Showroom del Fuorisalone: sofás bajos, pilares de piedra y una gran biblioteca iluminada al fondo" },
        { image: "milan-duomo-grupo-noche" as ImageName, alt: "El grupo de Experience Design frente al Duomo de Milán iluminado, de noche" },
        { image: "salone-living" as ImageName, alt: "Estar de sofás curvos y mesas de piedra en un stand del Salone del Mobile" },
        { image: "verona-marmol-verde" as ImageName, alt: "Placas de mármol verde y de tonos tierra exhibidas en Antolini, Verona" },
      ],
    },
    {
      id: "sao-paulo",
      n: "02",
      name: "São Paulo",
      event: "CASACOR São Paulo",
      sub: "Arquitectura, interiorismo y paisajismo",
      href: routes.saoPaulo,
      when: "Próxima fecha por confirmar",
      done: "Julio de 2025",
      text: "Una casa entera convertida en ambientes para recorrer.",
      cta: "Entrar a São Paulo",
      homeLabel: "CASACOR",
      collage: [
        { image: "casacor-arco-verde-mural", alt: "CASACOR São Paulo 2025: un arco de madera oscura en un muro verde enmarca un mural de hojas tropicales" },
        { image: "casacor-lavamanos-terracota", alt: "Baño con lavamanos de madera terracota y dos espejos redondos iluminados" },
        { image: "casacor-atrio-reflejo-agua", alt: "Atrio de varios niveles reflejado en un espejo de agua" },
        { image: "casacor-biblioteca", alt: "Biblioteca de repisas de madera con objetos de cerámica y libros, junto a un sofá" },
        { image: "casacor-celosia-arcos-madera", alt: "Celosía de madera con arcos que deja ver el jardín" },
        { image: "casacor-grupo-espaco", alt: "El grupo de Experience Design frente a un muro con el letrero «espaço» en CASACOR" },
        { image: "casacor-bontempo-espejo-agua", alt: "Letras de Casa Bontempo sobre un muro de hormigón, con jardín y espejo de agua" },
        { image: "casacor-sala-naranja", alt: "Sala de luz naranja con una butaca acolchada y una obra circular en el muro" },
      ] as CollagePhoto[],
      gallery: [
        { image: "casacor-arco-verde-mural" as ImageName, alt: "CASACOR São Paulo 2025: un arco de madera oscura en un muro verde enmarca un mural de hojas tropicales" },
        { image: "casacor-terraza-jardin" as ImageName, alt: "Terraza abierta a un jardín tropical, con sillas de madera y un pilar de hormigón" },
        { image: "casacor-lavamanos-terracota" as ImageName, alt: "Baño con lavamanos de madera terracota y dos espejos redondos iluminados" },
        { image: "casacor-living-biblioteca" as ImageName, alt: "Living frente a una biblioteca iluminada, con una mesa de piedra cubierta de libros" },
        { image: "casacor-atrio-reflejo-agua" as ImageName, alt: "Atrio de varios niveles reflejado en un espejo de agua" },
      ],
    },
  ],
};

export const saoPaulo = {
  city: "São Paulo",
  event: "CASACOR São Paulo",
  year: "Julio de 2025",
  statementA: "Una casa no se entiende en una foto.",
  statementB: "Se recorre.",
  intro: "En CASACOR, arquitectos, interioristas y paisajistas transforman una casa en una secuencia de ambientes.",
  origin: "Aquí empezó todo: en 2023, la primera prueba de Experience Design fue en São Paulo, con tres participantes.",
  rooms: [
    { n: "01", title: "La casa", text: "Una muestra que se recorre de puerta en puerta, ambiente por ambiente.", material: "plaster" as MaterialName, image: "casacor-atrio-desde-arriba" as ImageName, alt: "Atrio de CASACOR São Paulo visto desde arriba, con visitantes recorriendo el nivel inferior" },
    { n: "02", title: "Los ambientes", text: "Cada espacio es una propuesta distinta. Recorrerlos es comparar miradas.", material: "terracotta" as MaterialName, image: "casacor-dormitorio-muro-curvo" as ImageName, alt: "Dormitorio con un muro curvo revestido en madera y un velador redondo" },
    { n: "03", title: "Los materiales", text: "Lo que en catálogo es un nombre, aquí es luz, peso y temperatura.", material: "travertine" as MaterialName, image: "casacor-aplique-muro-marmolado" as ImageName, alt: "Aplique metálico sobre un muro de piedra con vetas verdes y ocres" },
    { n: "04", title: "Las marcas", text: "Bontempo, Todeschini, Eliane: los procesos detrás de lo que se ve en cada ambiente.", material: "terrazzo" as MaterialName, image: "casacor-cocina-marmol-verde" as ImageName, alt: "Cocina con una cubierta de mármol verde texturado y muebles de madera" },
    { n: "05", title: "Las personas", text: "Quienes diseñan cada ambiente, y quienes lo recorren con nosotros.", material: "walnut" as MaterialName, image: "casacor-grupo-almuerzo" as ImageName, alt: "El grupo de Experience Design almorzando durante la visita a CASACOR São Paulo" },
  ],
  galleryLabel: "CASACOR São Paulo 2025",
  galleryTitle: "Lo que recorrimos.",
  gallery: [
    { image: "casacor-bontempo-espejo-agua", alt: "Letras de Casa Bontempo sobre un muro de hormigón, con jardín y espejo de agua" },
    { image: "casacor-ventana-arco", alt: "Baño de muros oscuros con una ventana en arco, plantas y piedras al pie del lavamanos" },
    { image: "casacor-biblioteca", alt: "Biblioteca de repisas de madera con objetos de cerámica y libros, junto a un sofá" },
    { image: "casacor-arbol-celosia", alt: "Un árbol interior frente a una celosía de cuadros iluminada" },
    { image: "casacor-grupo-escalera", alt: "Participantes sentadas en una escalera de vidrio y madera en CASACOR" },
    { image: "casacor-bar-cielo-estampado", alt: "Bar con cielo de papel estampado, repisas de vidrio y cubierta de piedra" },
    { image: "casacor-tocador-ventana", alt: "Tocador con espejo enmarcado en madera frente a un ventanal al jardín" },
    { image: "casacor-quiebravistas-plantas", alt: "Quiebravistas de lamas blancas sobre un jardín de plantas tropicales" },
    { image: "casacor-grupo-atrio", alt: "Participantes sentadas en un sofá del atrio de CASACOR São Paulo" },
    { image: "casacor-jardin-sillas-rojas", alt: "Jardín con un muro verde y dos sillas rojas sobre pasto y piedra" },
    { image: "casacor-dormitorio-celosia", alt: "Dormitorio nocturno tras una celosía de lamas blancas, con un árbol en primer plano" },
    { image: "casacor-terraza-jardin", alt: "Terraza abierta a un jardín tropical, con sillas de madera y un pilar de hormigón" },
    { image: "casacor-grupo-cena", alt: "El grupo de Experience Design en una cena durante el viaje a São Paulo" },
    { image: "casacor-living-biblioteca", alt: "Living frente a una biblioteca iluminada, con una mesa de piedra cubierta de libros" },
  ] as CollagePhoto[],
  pending: {
    title: "Lo concreto, apenas esté confirmado.",
    body: "Te avisamos cuando definamos la próxima experiencia en São Paulo.",
    items: ["Año", "Fechas", "Programa", "Valor"],
    status: "Por confirmar",
  },
  cta: "Quiero saber de São Paulo",
};

/* ---------------------------------------------------------------------------
 * CONTACTO
 * ------------------------------------------------------------------------- */

export const interests = [
  { id: "formacion", label: "Formación" },
  { id: "marca", label: "Marca personal" },
  { id: "milan", label: "Milán" },
  { id: "sao-paulo", label: "São Paulo" },
  { id: "colaboraciones", label: "Colaboraciones" },
  { id: "otro", label: "Otro" },
] as const;
export type InterestId = (typeof interests)[number]["id"];

export const contact = {
  title: "¿Conversamos?",
  body: "Cuéntanos qué te interesa. Te respondemos con lo concreto: qué es, qué incluye y cuánto cuesta.",
  b2b: "¿Eres una marca, una empresa o una universidad?",
  b2bCta: "Hablemos de colaborar",
  submit: "Enviar",
};

export const invite = {
  title: "¿Nos vemos en el camino?",
  body: "Cuatro datos y te escribimos. Nada más.",
  cta: "Conversemos",
};

export const nextChapter = {
  label: "Siguiente capítulo",
};

export const footer = {
  statement: "Abrir la mirada hacia nuevas posibilidades.",
};
