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

/**
 * Inscripción a Milán 2027 (formulario de Google).
 * Si `googleFormUrl` queda en null, los botones abren WhatsApp con un mensaje listo.
 */
export const inscripcion = {
  // PEGAR AQUÍ el link del Google Form (Enviar → ícono de enlace → copiar)
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe0alwozIWI8wbkIG35Vwiufl9t2zmhpSEfDnw2sBhRTfd7FQ/viewform" as string | null,
  label: "Completar formulario de inscripción",
};

/** Destino de todo botón de inscripción: el formulario o, si falta, WhatsApp. Siempre en pestaña nueva. */
export function inscripcionHref(): string {
  if (inscripcion.googleFormUrl) return inscripcion.googleFormUrl;
  if (brand.whatsapp) return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent("Hola, quiero ser parte de Milano Design Week 2027")}`;
  return brand.instagram.url;
}

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
  experiencias: "/programas/experiencias",
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
      { label: "Experiencias", note: "Descubrir", href: routes.experiencias },
      { label: "Formación", note: "Aprender", href: routes.formacion },
      { label: "Marca personal", note: "Expresar", href: routes.marcaPersonal },
    ],
  },
  {
    label: "Destinos",
    href: routes.destinos,
    children: [
      { label: "Milán", note: "Milano Design Week", href: routes.milan },
      { label: "São Paulo", note: "Casacor", href: routes.saoPaulo },
    ],
  },
];
export const navContact = { label: "Contacto", href: routes.contacto };

/** Títulos de pestaña por ruta. */
export const pageTitles: Record<string, string> = {
  [routes.inicio]: "Experience Design · Abrir la mirada hacia nuevas posibilidades",
  [routes.nosotros]: "Nosotros · Experience Design",
  [routes.programas]: "Programas · Experience Design",
  [routes.experiencias]: "Experiencias · Programas · Experience Design",
  [routes.formacion]: "Formación · Programas · Experience Design",
  [routes.marcaPersonal]: "Marca personal · Programas · Experience Design",
  [routes.destinos]: "Destinos · Experience Design",
  [routes.milan]: "Milán, Milano Design Week · Destinos · Experience Design",
  [routes.saoPaulo]: "São Paulo, Casacor · Destinos · Experience Design",
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
    "Tres ejes: Experiencias, para descubrir el diseño en su contexto; Formación, para aprender a capitalizar lo vivido; y Marca personal, para expresarlo con un sello propio.",
  [routes.experiencias]:
    "Experience Design crea experiencias curadas en las capitales del diseño: ferias, showrooms, empresas y ciudades donde el diseño forma parte de la vida cotidiana.",
  [routes.formacion]:
    "Formación: herramientas específicas en formato presencial y online, con profesionales de marketing, fotografía, identidad y estrategia comercial.",
  [routes.marcaPersonal]:
    "Marca personal: construir tu propia marca y desarrollar el sello que te distingue como profesional, en tu estudio o en tu empresa. Partimos de lo que ya tienes: lo que has hecho, lo que sabes y lo que ves distinto.",
  [routes.destinos]:
    "Experiencias en las capitales del diseño: Milán, durante la Milano Design Week, y São Paulo, en Casacor. Fotos reales de las experiencias que ya recorrimos.",
  [routes.milan]:
    "Milano Design Week 2027, Salone del Mobile.Milano. Seis días, del 12 al 17 de abril de 2027: el Salone, el Fuorisalone, el Istituto Marangoni y el Lago di Como.",
  [routes.saoPaulo]:
    "São Paulo, Casacor. Arquitectos, interioristas y paisajistas transforman una casa en una secuencia de ambientes. Una casa no se entiende en una foto. Se recorre.",
  [routes.contacto]:
    "Sé parte de Milano Design Week 2027, del 12 al 17 de abril. Completar el formulario es el primer paso. Te respondemos personalmente.",
};

/** Cada página termina invitando a la siguiente: un mismo libro, distintos capítulos. */
export const chapterOrder: { href: string; label: string }[] = [
  { href: routes.inicio, label: "Inicio" },
  { href: routes.nosotros, label: "Nosotros" },
  { href: routes.programas, label: "Programas" },
  { href: routes.formacion, label: "Formación" },
  { href: routes.marcaPersonal, label: "Marca personal" },
  { href: routes.destinos, label: "Destinos" },
  { href: routes.milan, label: "Milano Design Week" },
  { href: routes.saoPaulo, label: "São Paulo" },
  { href: routes.contacto, label: "Contacto" },
];

export const hero = {
  wordmark: { ink: "wordmark-ink", paper: "wordmark-paper" } as const,
  titleA: "Abrir la mirada",
  titleB: "hacia nuevas posibilidades.",
  cta: "Descubre Milano Design Week",
};

export const idea = {
  lead: "El diseño no solo se observa.",
  verbs: ["Se vive.", "Se experimenta."],
  closing: "Hay cosas que una pantalla puede mostrarte, pero no puede hacerte sentir.",
  /** Cierre de la secuencia en Inicio, en dos tiempos. */
  beyond: { lead: "Más allá de la pantalla,", rest: "el diseño se convierte en", accent: "experiencia." },
};

/** Inicio · los tres ejes sobre una línea vertical: Descubrir, Aprender, Expresar. */
export const programsSpine = {
  kicker: "Experience Design",
  /** Nombre accesible de la sección (el triángulo reemplaza al titular visible). */
  label: "Los tres ejes de Experience Design: Experiencias, Formación y Marca personal",
  /** Triángulo de los ejes: una foto por eje. */
  triangle: {
    experiencias: { image: "fuori-kerakoll-fachada" as ImageName, align: "xMidYMax" },
    formacion: { image: "milan-calle-bolsas" as ImageName },
    "marca-personal": { image: "verona-antolini-bolsa" as ImageName },
  } as Record<string, { image: ImageName; align?: string }>,
  items: [
    {
      id: "experiencias",
      n: "01",
      verb: "Descubrir",
      name: "Experiencias",
      /** Página del eje (triángulo de Inicio). */
      axisHref: routes.experiencias as string,
      text: "Viajes curados a las mejores ferias y eventos exclusivos en las capitales del diseño mundial.",
      href: routes.destinos as string | undefined,
      cta: "Milano Design Week 2027" as string | undefined,
      /** El CTA de Experiencias lleva al formulario de inscripción. */
      enroll: true,
      main: { image: "milan-grupo-lago-como" as ImageName, alt: "El grupo de Experience Design en un barco en el lago de Como" },
      detail: { image: "milan-duomo-grupo-vertical" as ImageName, alt: "El grupo de Experience Design frente a la fachada iluminada del Duomo de Milán, de noche" },
      destinations: ["São Paulo", "Milano Design Week", "Colonia", "Buenos Aires"],
      /** Sin fecha cuando no la tenemos: no se inventa. */
      next: { label: "Próximas experiencias", items: [{ place: "Milano Design Week", note: "Abril 2027" }, { place: "Casacor São Paulo", note: "Julio 2027" }] as { place: string; note?: string }[] },
    },
    {
      id: "formacion",
      n: "02",
      verb: "Aprender",
      name: "Formación",
      /** Página del eje (triángulo de Inicio). */
      axisHref: routes.formacion as string,
      text: "Herramientas específicas en formato presencial y online, con profesionales de marketing, fotografía, identidad y estrategia comercial.",
      href: routes.formacion as string | undefined,
      cta: "Conocer Formación" as string | undefined,
      main: { image: "fuori-guia-explica" as ImageName, alt: "Fuorisalone de Milán: un guía explica a una participante la obra expuesta en el muro" },
      detail: { image: "fuori-grupo-escucha" as ImageName, alt: "El grupo de Experience Design escucha a un guía en una sala del Fuorisalone" },
    },
    {
      id: "marca-personal",
      n: "03",
      verb: "Expresar",
      name: "Marca personal",
      /** Página del eje (triángulo de Inicio). */
      axisHref: routes.marcaPersonal as string,
      text: "Construir tu propia marca y desarrollar el sello que te distingue como profesional, en tu estudio o en tu empresa.",
      href: routes.marcaPersonal as string | undefined,
      cta: "Conocer Marca personal" as string | undefined,
      main: { image: "venecia-grupo-mirador" as ImageName, alt: "El grupo de Experience Design, con sus bolsas negras de la marca, en un mirador sobre el Gran Canal de Venecia" },
      detail: { image: "verona-antolini-pasillo" as ImageName, alt: "Participante con la bolsa de Experience Design recorre la galería de piedras de Antolini, en Verona" },
    },
  ],
};

export const milan = {
  city: "Milán",
  /** Nombre de la experiencia en el resto del sitio (el hero de la página sigue con `city`). */
  name: "Milano Design Week",
  year: "2027",
  event: "Milano Design Week",
  openingImage: { image: "fuori-showroom-biblioteca" as ImageName, alt: "Showroom del Fuorisalone en Milán: pilares de piedra, sofás bajos y una gran biblioteca iluminada al fondo" },
  topics: ["Showrooms", "Estudios", "Materiales", "Cultura", "Conexiones"],
  statementA: "No venimos a mirar desde afuera.",
  statementB: "Venimos a entrar.",
  chapters: [
    {
      n: "01",
      title: "La ciudad",
      text: "Una ciudad que lleva generaciones pensando cómo vivimos.",
      material: "plaster" as MaterialName,
      image: "milan-duomo-grupo-noche" as ImageName,
      alt: "El grupo de Experience Design frente al Duomo de Milán iluminado, de noche",
    },
    {
      n: "02",
      title: "El diseño",
      text: "Durante la Milano Design Week la ciudad entera se vuelve exposición.",
      material: "terrazzo" as MaterialName,
      image: "salone-cielo-cintas" as ImageName,
      alt: "Instalación de cintas blancas suspendidas sobre un stand del Salone del Mobile 2026",
    },
    {
      n: "03",
      title: "Los materiales",
      text: "Superficies, revestimientos, texturas.",
      material: "terracotta" as MaterialName,
      image: "salone-repisa-ceramica" as ImageName,
      alt: "Salone del Mobile 2026: repisas iluminadas con piezas de cerámica y vidrio sobre una cubierta y un muro de piedra veteada",
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
      image: "fuori-kerakoll-explicacion" as ImageName,
      alt: "Fuorisalone de Milán: el grupo, con la bolsa negra de Experience Design, escucha a un anfitrión frente al muestrario de colores de Kerakoll",
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
    label: "Milano Design Week 2027",
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
  galleryLabel: "Milano Design Week 2026",
  galleryTitle: "Lo que recorrimos.",
  gallery: [
    { image: "milan-galleria-cupula", alt: "La Galleria Vittorio Emanuele II de noche, con su cúpula de vidrio y el piso de mosaico" },
    { image: "salone-cocina-bosque", alt: "Stand del Salone del Mobile 2026: una cocina de madera rodeada por una pantalla envolvente con un bosque" },
    { image: "fuori-showroom-lampara", alt: "Showroom del Fuorisalone con techo de vigas, sofás bajos y una lámpara cálida suspendida" },
    { image: "salone-sillon-cuero", alt: "Sillón de cuero caramelo junto a un mueble de madera y una lámpara de escritorio, en un stand del Salone" },
    { image: "salone-escalinata-roja", alt: "Escalinata roja de acceso a los pabellones del Salone del Mobile, bajo la cubierta de vidrio de Fiera Milano Rho" },
    { image: "salone-lamparas-burbujas", alt: "Lámpara de esferas de vidrio sobre una mesa de madera, con plantas detrás, en el Salone del Mobile" },
    { image: "milan-zapato-rojo", alt: "Participante junto a una escultura de un zapato rojo gigante bajo los arcos de la Galleria" },
    { image: "milan-terraza-atardecer", alt: "Los techos de Milán al atardecer, vistos desde una terraza" },
    { image: "salone-cocina-verde", alt: "Cocina de módulos verde oscuro con cubierta de madera en un stand del Salone del Mobile" },
    { image: "milan-tranvia", alt: "Un tranvía histórico avanzando por una calle de Milán" },
    { image: "salone-sofa-repisas", alt: "Sofá curvo claro frente a repisas de vidrio con objetos negros, en un stand del Salone" },
    { image: "verona-grupo-antolini", alt: "El grupo de Experience Design en el showroom de Antolini, en Verona, frente a una placa de mármol" },
    { image: "milan-galleria-grupo", alt: "Participantes recorriendo la Galleria Vittorio Emanuele II de noche" },
    { image: "salone-cubierta-rho-fiera", alt: "Christian Erdmann bajo la cubierta de vidrio de Fiera Milano Rho, junto al cartel del Salone del Mobile" },
    { image: "venecia-salute", alt: "La basílica de Santa Maria della Salute en Venecia, vista desde el agua, con una góndola en primer plano" },
    { image: "salone-silla-escultura", alt: "Silla blanca de líneas curvas bajo un cuadro con dibujos de su forma, en el Salone del Mobile" },
    { image: "fuori-showroom-sala", alt: "Sala de un showroom del Fuorisalone con sofás bajos, una biblioteca al fondo y lámparas de papel" },
    { image: "venecia-pareja-canal", alt: "Dos participantes con pañuelos y gafas de sol a bordo de un taxi acuático en el Gran Canal de Venecia" },
    { image: "venecia-calle-danae", alt: "Danae Barla, con la bolsa de Experience Design, en una calle angosta de Venecia" },
    { image: "venecia-gondola", alt: "Participante en una góndola bajo un puente de Venecia" },
  ] as { image: ImageName; alt: string }[],
  cta: "Quiero ser parte",
  /** Botón fijo de la página de Milán. */
  floatingCta: "Llena el formulario",
};

/**
 * Los seis capítulos de la página de Milano Design Week, con su índice fijo.
 * `short`: el nombre en el índice; `title`: el del encabezado del capítulo.
 */
export const milanChapters = {
  label: "Capítulos de Milano Design Week",
  items: [
    { id: "la-experiencia", n: "01", short: "La experiencia", title: "La experiencia", sub: "Vivir el diseño donde nace.", tone: "paper" },
    { id: "el-programa", n: "02", short: "El programa", title: "El programa", sub: "El itinerario día por día y los seis escenarios.", tone: "sand" },
    { id: "que-incluye", n: "03", short: "Qué incluye", title: "Qué incluye", sub: "Lo que cubre el programa, lo nuevo, el requisito y lo que no incluye.", tone: "paper" },
    { id: "como-se-vivio", n: "04", short: "Cómo se vivió", title: "Cómo se vivió en 2026", sub: "La edición 2026, en capítulos y fotos reales.", tone: "ink" },
    { id: "testimonios", n: "05", short: "Testimonios", title: "Testimonios", sub: "En sus propias palabras.", tone: "sand" },
    { id: "inscribete", n: "06", short: "Inscríbete", title: "Inscríbete", sub: "Cinco pasos para ser parte.", tone: "paper" },
  ] as const,
};
export type MilanChapterId = (typeof milanChapters.items)[number]["id"];

/*
 * Borrador de precios de Milán 2027 (ficha oficial), sin publicar por ahora.
 * Para activarlo: descomentar, exportar y mostrarlo en la página de Milán.
 */
// const milanPricing = {
//   label: "Inversión",
//   title: "Tu lugar en Milán.",
//   plans: [
//     {
//       id: "early",
//       name: "Early bird",
//       until: "Hasta el 30 de noviembre de 2026",
//       price: "USD 2.549",
//       badge: "15% de descuento",
//       payment: "Pago del 100% hasta el 30 de noviembre de 2026.",
//       benefits: [
//         "Mentoría 1:1 con Danae y Christian: una sesión para conocer tu contexto y diseñar contigo una visión estratégica personalizada.",
//         "Encuentro y mentoría grupal en Studio Barla, con Danae, Christian y el grupo, antes de viajar.",
//       ],
//       featured: true,
//     },
//     {
//       id: "normal",
//       name: "Precio normal",
//       until: "Hasta el 15 de enero de 2027",
//       price: "USD 2.999",
//       badge: "Por persona",
//       payment: "50% hasta el 15 de diciembre de 2026 y 50% hasta el 15 de enero de 2027.",
//       benefits: ["Encuentro y mentoría grupal en Studio Barla, con Danae, Christian y el grupo, antes de viajar."],
//       featured: false,
//     },
//   ],
//   reserve: {
//     name: "Reserva tu cupo",
//     price: "USD 300",
//     until: "Hasta el 30 de noviembre de 2026",
//     steps: ["USD 300 no reembolsables aseguran tu lugar.", "50% del total hasta el 15 de diciembre de 2026.", "50% restante hasta el 15 de enero de 2027, cierre de cupos."],
//   },
//   seats: "Cupos limitados. El grupo se cierra cuando se completan.",
//   paymentLabel: "Formas de pago",
//   payments: [
//     { name: "Transferencia bancaria", text: "Sin recargo." },
//     { name: "Tarjeta de crédito vía Webpay", text: "Con un recargo del 4%." },
//   ],
//   refund: "No se reembolsan las actividades a las que no se asista.",
// };

/**
 * Milán 2027: los datos de la ficha de producto oficial (Milan_2027_Ficha_de_producto.pdf),
 * sin precios (ver `milanPricing`).
 * Se mantiene la redacción de la ficha, salvo el titular «la experiencia más exclusiva del
 * diseño», que no se usa: el manual pide transmitir la exclusividad «sin necesidad de anunciarla».
 */
export const milan2027 = {
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
      { name: "Salone del Mobile.Milano", text: "La feria de diseño más importante del mundo, en Fiera Milano Rho. La recorremos con una selección previa de pabellones y stands." },
      { name: "Fuorisalone", text: "Tortona, Brera Design District y cientos de eventos e instalaciones: la ciudad entera como vitrina del diseño." },
      { name: "La Rinascente", text: "El epicentro de la moda y el lujo, en la Piazza del Duomo. Desde aquí recorremos la Galleria Vittorio Emanuele II, el Teatro alla Scala, Via Montenapoleone, Via della Spiga y Corso Venezia." },
      { name: "Istituto Marangoni", text: "Una de las escuelas de moda y diseño más reconocidas del mundo, nacida en Milán." },
      { name: "Lago di Como", text: "Villas históricas de las familias más antiguas de Italia, jardines frente al agua y montañas que descienden hasta el lago. Llegamos en tren y lo recorremos en ferry para cerrar la semana." },
      { name: "Milán, la ciudad", text: "Siglos de historia, patios escondidos tras cada portón, cafés y una forma de vivir donde el diseño está en todo. Se descubre a pie, en bici o en scooter: tú eliges." },
    ],
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
      { name: "Aperitivos de bienvenida y de cierre", text: "Bienvenida en La Rinascente, con lo mejor de la gastronomía italiana, y cierre en el Lago di Como." },
      { name: "Transporte", text: "Transfer desde cualquier punto de Santiago al aeropuerto, ida y vuelta, y pase de 10 viajes en metro en Milán." },
      { name: "Fotógrafo exclusivo del grupo", text: "Un profesional que te acompaña durante la semana. 10 fotos exclusivas y 2 videos cortos, para tu marca personal y tus redes. Registros extra con costo adicional." },
      { name: "eSIM Holafly", text: "Datos desde que llegas, durante todo el viaje." },
      { name: "Productos Experience Design", text: "Productos de diseño para acompañar tu viaje." },
      { name: "Encuentros del grupo", text: "Antes de viajar, para conocerse y llegar a Milán como grupo." },
    ],
    newLabel: "Nuevo en 2027",
    newItems: ["Fotógrafo del grupo", "Transfer al aeropuerto en Santiago", "Encuentros antes de viajar", "eSIM Holafly", "Productos Experience Design"],
    requirementLabel: "Requisito",
    requirements: ["Contar con un seguro médico de viaje, por tu seguridad y la del grupo.", "Alojarse cerca de Porta Venezia, para moverse junto al grupo."],
    excludesLabel: "No incluye",
    excludes: ["Ticket de viaje", "Alojamiento", "Alimentación", "Traslados entre el aeropuerto de Milán y la ciudad", "Entradas a visitas turísticas", "Cualquier servicio que no figure en esta lista"],
    excludesNote: "El ticket de viaje y el alojamiento los organiza cada persona según su ciudad de origen. Si lo necesitas, te recomendamos una agencia de viajes.",
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
    title: "Cómo ser parte de Milano Design Week 2027.",
    items: [
      { name: "Conversemos", text: "Escríbenos por WhatsApp, Instagram o correo y resolvemos tus dudas." },
      { name: "Reserva o paga", text: "Reserva tu cupo o paga por anticipado: el primer paso para no perder tu lugar." },
      { name: "Completa el pago", text: "Los cupos son limitados." },
      { name: "Conoce al grupo", text: "Al equipo de Experience Design y a quienes viajarán contigo." },
      { name: "Haz tus maletas", text: "Milán te espera." },
    ],
    closing: "No esperes a que te lo cuenten. Vive el diseño donde nace: sé parte de Milano Design Week 2027.",
    motto: "Vivirlo. Cuestionarlo. Hacerlo propio.",
  },
};

/**
 * PROGRAMAS · Experiencias. Textos de la ficha oficial y de la definición de marca;
 * sin precios. Las fotos son del grupo en Milán y Venecia.
 */
export const experiencesPage = {
  axes: {
    label: "Tres ejes",
    text: "Descubrir el diseño en su contexto, aprender a capitalizar lo vivido y expresarlo con un sello propio.",
  },
  blocks: [
    {
      id: "ver-tocar",
      label: "Lo que vas a ver y tocar",
      paragraphs: [
        "Detrás de una silla, un textil o una cubierta de piedra hay referencias, decisiones y un fundamento. La curaduría pone el foco ahí: cómo y por qué se diseñó cada pieza, más allá de la última novedad.",
        "Materiales, terminaciones, proporción y luz, vistos y tocados en el lugar donde se presentan.",
      ],
      accent: "Si no lo tocas, no lo viste.",
      image: "salone-grupo-letras-mobile" as ImageName,
      alt: "El grupo de Experience Design junto a las grandes letras rojas «Mobile» a la entrada del Salone, bajo los árboles",
    },
    {
      id: "con-quien",
      label: "Con quién vives la experiencia",
      paragraphs: [
        "Un viaje se recuerda por lo que se ve, pero sobre todo por con quién se vive. Las conversaciones al final del día, las ideas que surgen en una cena, el camino al lago, las personas que conoces en cada encuentro: eso es lo que permanece.",
      ],
      accent: "Vuelves con contactos, complicidades y una red que sigue creciendo mucho después del viaje.",
      image: "venecia-selfie-canal" as ImageName,
      alt: "Tres participantes sonríen en una selfie a bordo de un taxi acuático en el Gran Canal de Venecia",
    },
  ],
  cta: {
    label: "Próximas experiencias",
    title: "¿Qué experiencia puedo vivir?",
    items: [
      { place: "Milano Design Week", note: "Abril 2027", href: routes.milan },
      { place: "Casacor São Paulo", note: "Julio 2027", href: routes.saoPaulo },
    ],
    button: "Ver destinos",
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
    image: "danae-espejo-showroom",
    alt: "Danae Barla se fotografía en un espejo de un showroom del Fuorisalone",
    material: "plaster",
    brief: "Aprender frente al material.",
  } as ImageSlot,
  /** Foto de "Después": el resultado, con criterio propio en un espacio de diseño. */
  afterImage: {
    image: "fundadores-espejo-showroom" as ImageName,
    alt: "Danae y Christian fotografiados en un espejo iluminado de un showroom, con la bolsa de Experience Design",
  },
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
  disciplines: ["Arquitectura", "Interiorismo", "Diseño", "Marcas", "Materiales", "Iluminación", "Mobiliario", "Industrias creativas", "Artes", "Lujo"],
  body: "Las conversaciones empiezan y el aprendizaje dura para siempre.",
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
      field: "Arquitecta interiorista · Studio Barla Interiorismo",
      bio: "Arquitecta interiorista y fundadora de Studio Barla Interiorismo. Su pasión por el mobiliario, el arte y la fotografía, y su convicción de que los viajes alimentan la búsqueda de un diseño propio, dieron origen a la marca." as string | null,
      image: { image: "danae", alt: "Retrato de Danae Barla", material: "terracotta", brief: "Retrato real de Danae, luz natural. 4:5." } as ImageSlot,
    },
    {
      name: "Christian Erdmann",
      field: "Diseñador industrial · Mobiliario y curaduría de diseño",
      bio: "Diseñador industrial especializado en mobiliario y curador de diseño. Abre puertas que no están a la vista, lee los códigos de las grandes casas del diseño y crea el espacio para que cada encuentro se sienta natural y genuino." as string | null,
      image: { image: "christian", alt: "Retrato de Christian Erdmann", material: "walnut", brief: "Retrato real de Christian, luz natural. 4:5." } as ImageSlot,
    },
  ],
  bioPending: "Biografía en preparación.",
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
    image: "fundadores-juntos",
    alt: "Danae Barla y Christian Erdmann en un showroom de baño con muros de mármol",
    material: "travertine",
    brief: "Danae y Christian juntos, en un lugar de diseño.",
  } as ImageSlot,
  who: {
    label: "Quiénes somos",
    text: "Experience Design crea experiencias curadas para vivir el diseño desde dentro, en las capitales del diseño y en los escenarios donde nacen las ideas.",
    history: "Empezó como un experimento con pocas personas. Sigue igual de cerca.",
    notAgency: "No somos una agencia de viajes: creamos experiencias de diseño curadas.",
  },
  /** Textos oficiales del manual de marca (versión aprobada el 21 de octubre de 2026). */
  principles: [
    {
      id: "proposito",
      label: "Propósito",
      text: "Abrir la mirada hacia nuevas posibilidades.",
      body: "Creemos que salir de lo conocido puede cambiar la forma en que vemos las cosas.",
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
      text: "Consolidar y experimentar desde la cuna del diseño.",
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

export type ProgramId = "experiencias" | "formacion" | "marca-personal";

export type AudienceItem = { name: string; detail?: string; text: string };

export type Program = {
  id: ProgramId;
  n: string;
  /** Verbo del eje (Descubrir, Aprender, Expresar). */
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
  tone: "clay" | "sand" | "ink" | "warm";
  /** Color de la luz WebGL sobre ese tono. */
  glow: string;
  material: MaterialName;
  image: ImageSlot;
  /** Portada en video (sin audio, en bucle): reemplaza a `image` en la cabecera del programa. */
  heroVideo?: { src: string; poster: string; ratio: string; alt: string };
  /** Segunda imagen pequeña (el material de cerca). */
  detail?: ImageSlot;
  /** Foto de la página Programas. */
  railImage: { image: ImageName; alt: string };
  /** Para quién es: profesionales primero, Estudiantes siempre al final (Experiencias no lo lleva). */
  audience: AudienceItem[];
  interest: InterestId;
  cta: string;
};

export const programs = {
  title: "Programas",
  lead: "Lo vivido, convertido en criterio propio.",
  question: "¿Qué quieres llevar a tu estudio?",
  hint: "Tres programas",
  more: "Quiero saber más",
  audienceLabel: "Para quién es",
  items: [
    {
      id: "experiencias",
      n: "01",
      verb: "Descubrir",
      name: "Experiencias",
      href: routes.experiencias,
      lines: ["Más que viajar.", "Vivir el diseño", "para ampliar la mirada."],
      intro: "Experience Design crea experiencias curadas en las capitales del diseño: ferias, showrooms, empresas y ciudades donde el diseño forma parte de la vida cotidiana. No somos una agencia de viajes: te damos acceso a lo mejor del diseño mundial, elegimos qué ver, explicamos por qué importa y te acompañamos para que lo lleves a tu propio contexto.",
      short: "Viajes curados a las mejores ferias y eventos exclusivos en las capitales del diseño mundial.",
      keywords: ["Ferias", "Showrooms", "Empresas", "Ciudades"],
      tone: "warm",
      glow: "#C97B4A",
      material: "travertine",
      image: {
        image: "fuori-kerakoll-grupo-bolsa",
        alt: "El grupo de Experience Design, con la bolsa negra de la marca, frente al muro de colores de Kerakoll en el Fuorisalone",
        material: "travertine",
        brief: "Grupo en Milán.",
      },
      detail: {
        image: "fuori-showroom-conversacion",
        alt: "Participantes conversando en los sofás de un showroom del Fuorisalone, en Milán",
        material: "walnut",
        brief: "Grupo en Venecia.",
      },
      railImage: {
        image: "milan-grupo-gessi",
        alt: "El grupo de Experience Design reunido en el espacio de Gessi durante la Milano Design Week",
      },
      audience: [],
      interest: "milan",
      cta: "Conocer Experiencias",
    },
    {
      id: "formacion",
      n: "02",
      verb: "Aprender",
      name: "Formación",
      href: routes.formacion,
      lines: ["Lo que descubres", "también puede transformarse", "en conocimiento."],
      intro: "Herramientas específicas en formato presencial y online, con profesionales de marketing, fotografía, identidad y estrategia comercial. Quien participa aprende a capitalizar lo que vive: qué observar, qué contenido generar, cómo registrar lo aprendido y cómo convertirlo en reflexiones útiles para su trabajo.",
      short: "Herramientas específicas en formato presencial y online, con profesionales de marketing, fotografía, identidad y estrategia comercial.",
      keywords: ["Cursos", "Webinars", "Herramientas", "Fotografía", "Marketing", "Marca"],
      tone: "ink",
      glow: "#C97B4A",
      material: "travertine",
      /** Portada: video sin audio en vez de foto (en su proporción, sin recorte). */
      heroVideo: { src: "/video/formacion-christian-explica.mp4", poster: "/video/formacion-christian-explica.jpg", ratio: "9 / 16", alt: "Video: Christian Erdmann explica una pieza al grupo en un showroom del Fuorisalone" },
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
        image: "christian-showroom-cocina",
        alt: "Christian Erdmann en un showroom de cocinas del Fuorisalone, junto a una isla con una obra de arte",
      },
      audience: [
        { name: "Arquitectos", text: "Fotografía, identidad y estrategia comercial para mostrar tus proyectos." },
        { name: "Diseñadores de muebles", text: "Fotografía, identidad y estrategia para presentar tus piezas a marcas, editores y la industria." },
        { name: "Tu empresa", text: "Herramientas específicas de marketing y estrategia comercial para tu equipo." },
        { name: "Corredores de propiedades", text: "Fotografía y estrategia comercial para presentar cada propiedad con criterio." },
        { name: "Construcción", text: "Identidad y estrategia comercial para comunicar lo que construyes." },
        { name: "Estudiantes", text: "Últimos años de pregrado, posgrado y recién titulados: herramientas para llegar al mundo profesional." },
      ],
      interest: "formacion",
      cta: "Conocer Formación",
    },
    {
      id: "marca-personal",
      n: "03",
      verb: "Expresar",
      name: "Marca personal",
      href: routes.marcaPersonal,
      lines: ["Tienes una mirada.", "¿Qué hacemos con ella?"],
      intro: "Construir tu propia marca y desarrollar el sello que te distingue como profesional, en tu estudio o en tu empresa.",
      short: "Construir tu propia marca y desarrollar el sello que te distingue como profesional, en tu estudio o en tu empresa.",
      keywords: ["Tu historia", "Tu mirada", "Tu posicionamiento", "Tu voz"],
      tone: "clay",
      glow: "#F1D6BF",
      material: "linen",
      heroVideo: { src: "/video/salone-video-mesa.mp4", poster: "/video/salone-video-mesa.jpg", ratio: "16 / 9", alt: "Video: un living de sofás claros en un stand del Salone del Mobile" },
      image: {
        image: "marca-retrato-backdrop",
        alt: "Participante sonriendo frente al muro de prensa de un evento de diseño en Milán",
        material: "linen",
        brief: "Retrato de una participante, luz natural, vertical.",
      },
      railImage: {
        image: "milan-grupo-eurocucina",
        alt: "El grupo de Experience Design frente al telón de EuroCucina en el Salone del Mobile",
      },
      audience: [
        { name: "Arquitectos", text: "Tu trayectoria y tu mirada, ordenadas en una marca que se reconoce." },
        { name: "Diseñadores de muebles", text: "Tus muebles y objetos, con una firma que marcas y editores reconocen." },
        { name: "Interioristas", text: "Tu forma de pensar los espacios, convertida en posicionamiento." },
        { name: "Corredores de propiedades", text: "Una voz profesional propia, coherente en cada lugar donde apareces." },
        { name: "Ingenieros", text: "Lo que sabes y lo que has hecho, contado para que se entienda." },
        { name: "Iluminadores", text: "Lo que ves distinto, convertido en tu valor profesional." },
        { name: "Inversionistas", text: "Tu posicionamiento: dónde te ubicas, con quién trabajas y por qué." },
        { name: "Empresarios", text: "La identidad de tu empresa y tu voz como quien la lidera." },
        { name: "Emprendedores", text: "Tu marca desde el inicio, con historia, mirada y voz propias." },
        { name: "Maestros y dueños de taller", text: "Tu oficio y tu trayectoria, contados con el mismo cuidado con que trabajas." },
        { name: "Tu negocio", detail: "Empresa de talleres, tienda de decoración", text: "El sello de tu negocio: qué lo distingue y cómo contarlo." },
        { name: "Estudiantes", text: "Para quienes recién empiezan: descubrir su sello desde los primeros proyectos." },
      ],
      interest: "marca",
      cta: "Conocer Marca personal",
    },
  ] as Program[],
};

export const personalBrandPage = {
  notLabel: "Lo que no es",
  not: ["Crecer en redes sociales.", "Ser influencer.", "Hacerte famoso en internet."],
  notAnswer: "Se trata de tu valor profesional.",
  notBody: "Partimos de lo que ya tienes: lo que has hecho, lo que sabes y lo que ves distinto.",
  focusLabel: "En qué se enfoca",
  focus: ["Tu experiencia", "Tu trayectoria", "Tu perspectiva", "Tus fortalezas", "Tu posicionamiento", "Tu identidad profesional", "Tu voz", "Tu narrativa"],
};

/* ---------------------------------------------------------------------------
 * DESTINOS: experiencias para vivir. No son programas.
 * ------------------------------------------------------------------------- */

/** Foto o video corto (sin audio) de una tira de MediaStrip. `ratio` sólo para videos; `wide` = horizontal a todo el ancho. */
export type MediaItem = { image?: ImageName; video?: { src: string; poster: string }; alt: string; ratio?: string; wide?: boolean };

/** Fotos y videos seleccionados por Danae para cada página (FOTOS, hojas 2 a 7). */
export const media = {
  nosotros: {
    label: "Danae y Christian, en el viaje",
    items: [
    { image: "marca-vestidor-retrato", alt: "Danae Barla sentada en un puf capitoné de un showroom de vestidores en Milán, con la bolsa de Experience Design" },
    { video: { src: "/video/danae-antolini-marmol.mp4", poster: "/video/danae-antolini-marmol.jpg" }, alt: "Video: Danae Barla recorre con la mano las vetas de una placa de mármol en Antolini, Verona" },
    { video: { src: "/video/christian-fuori-bolsa.mp4", poster: "/video/christian-fuori-bolsa.jpg" }, alt: "Video: el grupo camina por una calle arbolada del Fuorisalone, con la bolsa de Experience Design" },
    { image: "danae-lavamanos-espejo", alt: "Danae Barla prueba la grifería de un lavamanos de piedra frente a un espejo redondo" },
    { video: { src: "/video/danae-fuori-biblioteca.mp4", poster: "/video/danae-fuori-biblioteca.jpg" }, alt: "Video: una biblioteca de madera en un showroom del Fuorisalone", ratio: "16 / 9" },
    { image: "fundadores-galleria-selfie", alt: "Selfie de Danae y Christian bajo la cúpula de la Galleria Vittorio Emanuele II, el último día" },
    { video: { src: "/video/fundadores-salone.mp4", poster: "/video/fundadores-salone.jpg" }, alt: "Video: bajo la cubierta de Fiera Milano Rho, durante el Salone del Mobile" },
    { image: "danae-escalinata-salone", alt: "Danae sentada en la escalinata roja del Salone del Mobile, con la bolsa de Experience Design" },
    { video: { src: "/video/christian-salone.mp4", poster: "/video/christian-salone.jpg" }, alt: "Video: participantes recorren un stand del Salone del Mobile" },
    { video: { src: "/video/danae-showroom-deco.mp4", poster: "/video/danae-showroom-deco.jpg" }, alt: "Video: un showroom luminoso con una mesa baja, flores y repisas de objetos" },
  ] as MediaItem[],
  },
  formacion: {
    label: "Aprender en el lugar: Fuorisalone e Istituto Marangoni",
    items: [
    { video: { src: "/video/formacion-charla-fuori.mp4", poster: "/video/formacion-charla-fuori.jpg" }, alt: "Video: el grupo escucha una charla bajo una galería de arcos durante el Fuorisalone" },
    { video: { src: "/video/formacion-marangoni-placa.mp4", poster: "/video/formacion-marangoni-placa.jpg" }, alt: "Video: la placa del Istituto Marangoni en la fachada de su sede de Milán" },
    { video: { src: "/video/formacion-muestras.mp4", poster: "/video/formacion-muestras.jpg" }, alt: "Video: muestras de color de un muestrario, ordenadas en una repisa" },
  ] as MediaItem[],
  },
  marcaPersonal: {
    label: "Marca personal, en el viaje",
    items: [
    { image: "christian-disenadores", alt: "Christian Erdmann junto a dos diseñadores, en una calle de Milán durante el Fuorisalone" },
    { image: "christian-venecia-bolsa", alt: "Christian Erdmann con la bolsa de Experience Design en un embarcadero de Venecia" },
    { video: { src: "/video/marca-bolsa-antolini.mp4", poster: "/video/marca-bolsa-antolini.jpg" }, alt: "Video: Christian Erdmann en el showroom de Antolini, en Verona, frente a una placa de piedra verde" },
  ] as MediaItem[],
  },
  milan: {
    label: "Milano Design Week 2026, en video",
    items: [
    { video: { src: "/video/fuori-video-gessi-pieza.mp4", poster: "/video/fuori-video-gessi-pieza.jpg" }, alt: "Video: una pieza de grifería sobre un bloque de mármol en el espacio de Gessi" },
    { video: { src: "/video/salone-video-bancos.mp4", poster: "/video/salone-video-bancos.jpg" }, alt: "Video: lámparas de vidrio suspendidas sobre un comedor, en un stand del Salone del Mobile" },
    { video: { src: "/video/fuori-video-flor.mp4", poster: "/video/fuori-video-flor.jpg" }, alt: "Video: una gran ilustración de una flor en blanco y negro durante el Fuorisalone" },
    { video: { src: "/video/fuori-video-gessi-sala.mp4", poster: "/video/fuori-video-gessi-sala.jpg" }, alt: "Video: el grupo recorre un showroom amplio del Fuorisalone" },
    { video: { src: "/video/fuori-video-cuero.mp4", poster: "/video/fuori-video-cuero.jpg" }, alt: "Video: muestras de cuero con costuras, tocadas de cerca en un showroom" },
  ] as MediaItem[],
  },
};

export type CollagePhoto = { image: ImageName; alt: string };
/** Pieza del collage de Destinos (polaroid): una foto o un video corto sin audio. */
export type CollageItem = {
  image?: ImageName;
  video?: { src: string; poster: string };
  alt: string;
  /** Pie manuscrito con el nombre del lugar (opcional). */
  caption?: string;
};

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
      name: "Milano Design Week",
      event: "Milano Design Week",
      sub: "Milano Design Week",
      href: routes.milan,
      /** Página Destinos: la ciudad como título y el evento debajo. */
      city: "Milán",
      railSub: "Milano Design Week",
      when: "12 al 17 de abril de 2027",
      done: "Abril de 2026",
      text: "La semana en que una ciudad entera se vuelve exposición.",
      cta: "Entrar a Milano Design Week",
      /** Inicio: la etiqueta del selector y su carrusel. */
      homeLabel: "Milano Design Week",
      collage: [
        { image: "fuori-selfie-grupo", alt: "Selfie de Danae, Christian y el grupo en una calle de Milán durante el Fuorisalone" },
        { video: { src: "/video/pol-fuori-espejo.mp4", poster: "/video/pol-fuori-espejo.jpg" }, alt: "Video: tres participantes se fotografían en un espejo de un showroom del Fuorisalone" },
        { image: "aeropuerto-bolsa-maleta", alt: "La bolsa de Experience Design sobre una maleta, frente a las pantallas de salidas del aeropuerto" },
        { video: { src: "/video/pol-fuori-selfie.mp4", poster: "/video/pol-fuori-selfie.jpg" }, alt: "Video: Danae y Christian en una selfie en una calle de Milán" },
        { video: { src: "/video/pol-venecia-bolsa.mp4", poster: "/video/pol-venecia-bolsa.jpg" }, alt: "Video: la bolsa de Experience Design en alto, sobre el Gran Canal de Venecia" },
        { image: "milan-galleria-noche-fundadores", alt: "Danae y Christian de noche, con la Galleria Vittorio Emanuele II iluminada detrás" },
        { video: { src: "/video/pol-fuori-microcar.mp4", poster: "/video/pol-fuori-microcar.jpg" }, alt: "Video: un pequeño auto verde agua con la puerta frontal abierta, en una calle de Milán" },
        { image: "lago-como-grupo-glicinas", alt: "Tres participantes con bolsas de Experience Design bajo una pérgola de glicinas, junto al lago de Como" },
        { video: { src: "/video/pol-lago-como-banderas.mp4", poster: "/video/pol-lago-como-banderas.jpg" }, alt: "Video: Christian junto al lago de Como, bajo banderas de Italia" },
        { video: { src: "/video/pol-fuori-escultura.mp4", poster: "/video/pol-fuori-escultura.jpg" }, alt: "Video: una escultura de tela plisada en el patio de un palacio, durante el Fuorisalone" },
        { video: { src: "/video/pol-lago-como-bolsa.mp4", poster: "/video/pol-lago-como-bolsa.jpg" }, alt: "Video: de cerca, la «E.» bordada en la bolsa negra de Experience Design" },
        { image: "milan-scala-cafe-mesa", alt: "Mesa del café de La Scala: una flor, cubiertos dorados y la carta, el último día en Milán" },
      ] as CollageItem[],
      gallery: [
        { image: "milan-showroom-letrero" as ImageName, alt: "Una participante frente a un letrero luminoso de Milán en un showroom, entre lámparas de vidrio ámbar" },
        { image: "salone-cocina-isla" as ImageName, alt: "Salone del Mobile: una cocina con isla de piedra y campana suspendida, con visitantes recorriendo el stand" },
        { image: "milan-galleria-arco-noche" as ImageName, alt: "La entrada de la Galleria Vittorio Emanuele II iluminada, de noche" },
        { image: "salone-living-curvo" as ImageName, alt: "Salone del Mobile: un living de sofás curvos y una mesa de mármol frente a un espejo redondo" },
        { image: "salone-sillas-tejido" as ImageName, alt: "Sillas de tejido gris oscuro alrededor de una mesa de madera, vistas desde arriba" },
      ],
    },
    {
      id: "sao-paulo",
      n: "02",
      name: "São Paulo",
      event: "Casacor São Paulo",
      sub: "Arquitectura, interiorismo y paisajismo",
      href: routes.saoPaulo,
      city: "São Paulo",
      railSub: "Casacor",
      when: "Próxima fecha por confirmar",
      done: "Julio de 2025",
      text: "Una casa entera convertida en ambientes para recorrer.",
      cta: "Entrar a São Paulo",
      homeLabel: "Casacor",
      collage: [
        { image: "casacor-arco-verde-mural", alt: "Casacor São Paulo 2025: un arco de madera oscura en un muro verde enmarca un mural de hojas tropicales", caption: "Casacor" },
        { image: "casacor-lavamanos-terracota", alt: "Baño con lavamanos de madera terracota y dos espejos redondos iluminados" },
        { image: "casacor-atrio-reflejo-agua", alt: "Atrio de varios niveles reflejado en un espejo de agua" },
        { image: "casacor-biblioteca", alt: "Biblioteca de repisas de madera con objetos de cerámica y libros, junto a un sofá" },
        { image: "casacor-celosia-arcos-madera", alt: "Celosía de madera con arcos que deja ver el jardín" },
        { image: "casacor-grupo-espaco", alt: "El grupo de Experience Design frente a un muro con el letrero «espaço» en Casacor", caption: "São Paulo" },
        { image: "casacor-bontempo-espejo-agua", alt: "Letras de Casa Bontempo sobre un muro de hormigón, con jardín y espejo de agua", caption: "Casa Bontempo" },
        { image: "casacor-sala-naranja", alt: "Sala de luz naranja con una butaca acolchada y una obra circular en el muro" },
      ] as CollageItem[],
      gallery: [
        { image: "casacor-comedor-madera" as ImageName, alt: "Casacor São Paulo: comedor con una larga mesa de madera bajo un cielo de paneles y ventanales" },
        { image: "casacor-marmol-verde-sofa" as ImageName, alt: "Casacor São Paulo: muro de mármol verde veteado, con una cubierta de piedra y un sofá curvo" },
        { image: "casacor-mesas-vitrina" as ImageName, alt: "Casacor São Paulo: mesas bajas negras frente a una vitrina con vasijas, abierta al jardín" },
        { image: "casacor-vitrina-blanca" as ImageName, alt: "Casacor São Paulo: vitrina blanca de vidrio con vajilla, junto a una isla de madera clara" },
      ],
    },
  ],
};

export const saoPaulo = {
  city: "São Paulo",
  event: "Casacor São Paulo",
  year: "Julio de 2025",
  statementA: "Una casa no se entiende en una foto.",
  statementB: "Se recorre.",
  intro: "En Casacor, arquitectos, interioristas y paisajistas transforman una casa en una secuencia de ambientes.",
  origin: "Aquí empezó todo: en 2023, la primera prueba de Experience Design fue en São Paulo, con tres participantes.",
  rooms: [
    { n: "01", title: "La casa", text: "Una muestra que se recorre de puerta en puerta, ambiente por ambiente.", material: "plaster" as MaterialName, image: "casacor-atrio-desde-arriba" as ImageName, alt: "Atrio de Casacor São Paulo visto desde arriba, con visitantes recorriendo el nivel inferior" },
    { n: "02", title: "Los ambientes", text: "Cada espacio es una propuesta distinta. Recorrerlos es comparar miradas.", material: "terracotta" as MaterialName, image: "casacor-dormitorio-muro-curvo" as ImageName, alt: "Dormitorio con un muro curvo revestido en madera y un velador redondo" },
    { n: "03", title: "Los materiales", text: "Lo que en catálogo es un nombre, aquí es luz, peso y temperatura.", material: "travertine" as MaterialName, image: "casacor-aplique-muro-marmolado" as ImageName, alt: "Aplique metálico sobre un muro de piedra con vetas verdes y ocres" },
    { n: "04", title: "Las marcas", text: "Bontempo, Todeschini, Eliane: los procesos detrás de lo que se ve en cada ambiente.", material: "terrazzo" as MaterialName, image: "casacor-cocina-marmol-verde" as ImageName, alt: "Cocina con una cubierta de mármol verde texturado y muebles de madera" },
    { n: "05", title: "Las personas", text: "Quienes diseñan cada ambiente, y quienes lo recorren con nosotros.", material: "walnut" as MaterialName, image: "casacor-grupo-almuerzo" as ImageName, alt: "El grupo de Experience Design almorzando durante la visita a Casacor São Paulo" },
  ],
  galleryLabel: "Casacor São Paulo 2025",
  galleryTitle: "Lo que recorrimos.",
  gallery: [
    { image: "casacor-ventana-arco", alt: "Baño de muros oscuros con una ventana en arco, plantas y piedras al pie del lavamanos" },
    { image: "casacor-arbol-celosia", alt: "Un árbol interior frente a una celosía de cuadros iluminada" },
    { image: "casacor-grupo-escalera", alt: "Participantes sentadas en una escalera de vidrio y madera en Casacor" },
    { image: "casacor-bar-cielo-estampado", alt: "Bar con cielo de papel estampado, repisas de vidrio y cubierta de piedra" },
    { image: "casacor-tocador-ventana", alt: "Tocador con espejo enmarcado en madera frente a un ventanal al jardín" },
    { image: "casacor-quiebravistas-plantas", alt: "Quiebravistas de lamas blancas sobre un jardín de plantas tropicales" },
    { image: "casacor-grupo-atrio", alt: "Participantes sentadas en un sofá del atrio de Casacor São Paulo" },
    { image: "casacor-jardin-sillas-rojas", alt: "Jardín con un muro verde y dos sillas rojas sobre pasto y piedra" },
    { image: "casacor-dormitorio-celosia", alt: "Dormitorio nocturno tras una celosía de lamas blancas, con un árbol en primer plano" },
    { image: "casacor-terraza-jardin", alt: "Terraza abierta a un jardín tropical, con sillas de madera y un pilar de hormigón" },
    { image: "casacor-grupo-cena", alt: "El grupo de Experience Design en una cena durante el viaje a São Paulo" },
    { image: "casacor-living-biblioteca", alt: "Living frente a una biblioteca iluminada, con una mesa de piedra cubierta de libros" },
  ] as CollagePhoto[],
  cta: "Quiero saber de São Paulo",
};

/* ---------------------------------------------------------------------------
 * CONTACTO
 * ------------------------------------------------------------------------- */

export const interests = [
  { id: "formacion", label: "Formación" },
  { id: "marca", label: "Marca personal" },
  { id: "milan", label: "Milano Design Week" },
  { id: "sao-paulo", label: "São Paulo" },
  { id: "colaboraciones", label: "Colaboraciones" },
  { id: "otro", label: "Otro" },
] as const;
export type InterestId = (typeof interests)[number]["id"];

/** Contacto: el foco es la inscripción a Milán 2027 por el formulario. */
export const enroll = {
  label: "Milano Design Week 2027 · 12 al 17 de abril",
  title: ["Sé parte de", "Milano Design Week 2027."],
  body: "Completar el formulario es el primer paso. Te respondemos personalmente.",
  stepsLabel: "Cómo sigue",
  steps: ["Completa el formulario", "Te contactamos", "Reserva tu cupo"],
  channelsLabel: "También por",
  otherLabel: "¿Otra consulta?",
};

export const contact = {
  title: "¿Conversamos?",
  body: "Cuéntanos qué te interesa. Te respondemos con lo concreto: qué es, qué incluye y cuánto cuesta.",
  b2b: "¿Eres una marca, una empresa o una universidad?",
  b2bCta: "Hablemos de colaborar",
  submit: "Enviar",
};

export const invite = {
  title: "¿Viajamos juntos?",
  body: "Ya nos encontraste. Ahora inscríbete para recibir todo el itinerario.",
  cta: "Inscríbete",
};

/** Inicio: un fragmento del video de Milán (sin audio), bajo la invitación; el video completo está en YouTube. */
export const milanVideo = {
  title: "Así se vivió Milán.",
  video: { src: "/video/milan-asi-se-vivio.mp4", poster: "/video/milan-asi-se-vivio.jpg" },
  alt: "Video: Danae y Christian conversan en una mesa al aire libre en Milán",
  cta: "Ver en YouTube",
  url: "https://www.youtube.com/@ExperiencedesignChile",
};

export const nextChapter = {
  label: "Siguiente capítulo",
};

export const footer = {
  statement: "Abrir la mirada hacia nuevas posibilidades.",
};

/** Crédito del sitio, al pie. */
export const credit = { name: "Emilio Guerrero", url: "https://www.linkedin.com/in/emilio-guerrero-43a844235" };
