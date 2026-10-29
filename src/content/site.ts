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
  email: null as string | null,
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
    "Formación: cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca, para capitalizar la experiencia.",
  [routes.marcaPersonal]:
    "Marca personal: construir la propia marca y encontrar el sello que distingue a cada persona, estudio o empresa. Partimos de lo que ya tienes: lo que has hecho, lo que sabes y lo que ves distinto.",
  [routes.destinos]:
    "Experiencias en las capitales del diseño: Milán, durante el Salone del Mobile, y São Paulo, en CASACOR. Fotos reales de las experiencias de 2025 y 2026.",
  [routes.milan]:
    "Milán 2027, Salone del Mobile. Itinerario del 12 al 17 de abril de 2027: la feria, el Fuori Salone, showrooms, materiales y la ciudad, recorridos con la atención de quien diseña.",
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
  sub: "Experiencias curadas para llevar tu mirada más allá de lo conocido. Nuevas referencias, procesos de inspiración y un reencuentro con los fundamentos del diseño para descubrir otras perspectivas y transformar tu manera de crear.",
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
      text: "Experiencias curadas en las capitales del diseño, conocidas en su propio contexto. Recorremos ferias, showrooms, estudios y espacios donde nacen las ideas, en contacto con sus materiales, procesos y protagonistas. Para volver con referencias propias y criterio para aplicarlas.",
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
      text: "Cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca. Aprender prepara la mirada antes de viajar y ayuda a capitalizar lo vivido después: ideas que nacen de la experiencia y que puedes llevar a tu propia práctica.",
      href: routes.formacion as string | undefined,
      cta: "Conocer Formación" as string | undefined,
      main: { image: "verona-antolini-veta" as ImageName, alt: "Participante recorriendo con la mano la veta de una placa de mármol en el showroom de Antolini, en Verona" },
      detail: { image: "fuori-charla-arcos" as ImageName, alt: "Charla durante el Fuori Salone de Milán: el público sentado bajo una galería de arcos frente a una pantalla" },
    },
    {
      id: "marca-personal",
      n: "03",
      verb: "Expresar",
      name: "Marca personal",
      text: "Cada persona tiene una mirada, unos intereses y una forma propia de hacer las cosas. Acompañamos a construir la propia marca y a encontrar el sello que distingue a cada persona, estudio o empresa, para comunicarlo con criterio y coherencia. Expresar convierte lo vivido en criterio propio.",
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
  openingImage: { image: "fuori-showroom-biblioteca" as ImageName, alt: "Showroom del Fuori Salone en Milán: pilares de piedra, sofás bajos y una gran biblioteca iluminada al fondo" },
  topics: ["Salone del Mobile", "Showrooms", "Estudios", "Materiales", "Cultura", "Conexiones"],
  statementA: "No venimos a mirar desde afuera.",
  statementB: "Venimos a entrar.",
  chapters: [
    {
      n: "01",
      title: "La ciudad",
      text: "Una ciudad que lleva generaciones pensando cómo vivimos. La recorremos con la atención de quien diseña.",
      material: "plaster" as MaterialName,
      image: "milan-galleria-cupula" as ImageName,
      alt: "La Galleria Vittorio Emanuele II de noche, con su cúpula de vidrio y el piso de mosaico",
    },
    {
      n: "02",
      title: "El diseño",
      text: "Durante el Salone del Mobile la ciudad entera se vuelve exposición. Vamos a donde ocurre.",
      material: "terrazzo" as MaterialName,
      image: "salone-escalinata-roja" as ImageName,
      alt: "Escalinata roja de acceso a los pabellones del Salone del Mobile, bajo la cubierta de vidrio de Rho Fiera",
    },
    {
      n: "03",
      title: "Los materiales",
      text: "Superficies, revestimientos, texturas. Verlos en persona, con luz real, a la distancia de la mano.",
      material: "terracotta" as MaterialName,
      image: "verona-marmol-book-match" as ImageName,
      alt: "Placa de mármol en espejo, con vetas violáceas, en el showroom de Antolini en Verona",
    },
    {
      n: "04",
      title: "Los espacios",
      text: "Patios, fachadas, showrooms, estudios. La arquitectura también se aprende caminando.",
      material: "travertine" as MaterialName,
      image: "fuori-galeria-arcos" as ImageName,
      alt: "Galería de arcos blancos de un espacio del Fuori Salone, con lámparas suspendidas y piso de madera",
    },
    {
      n: "05",
      title: "Las personas",
      text: "Detrás de cada showroom y cada estudio hay alguien que tomó decisiones. Queremos escucharlas.",
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
  /** Itinerario 2027, tomado del programa publicado en el sitio anterior. Sin horarios: se confirman con cada grupo. */
  itinerary: {
    label: "Milán 2027",
    title: "Seis días, del 12 al 17 de abril.",
    body: "La Milan Design Week y el Salone del Mobile.Milano (13 al 18 de abril de 2027), recorridos en grupo reducido y con una agenda exigente.",
    days: [
      { day: "Día 1", date: "Lunes 12", title: "Fuori Salone", text: "Llegada a Milán y primer encuentro en Milano Centrale. Recorremos la ciudad y sus showrooms para entender cómo se vive el diseño fuera de la feria." },
      { day: "Día 2", date: "Martes 13", title: "Salone del Mobile", text: "Primera jornada completa en la feria, en Rho Fiera. Una selección previa de pabellones, marcas y piezas, para mirar con criterio y no solo recorrer." },
      { day: "Día 3", date: "Miércoles 14", title: "Salone del Mobile", text: "Segunda jornada en la feria. Nos reunimos en Milano Centrale y volvemos a los pabellones: materiales, procesos y referentes en directo." },
      { day: "Día 4", date: "Jueves 15", title: "Salone del Mobile", text: "Tercera jornada en la feria, para profundizar en lo que cada participante vino a buscar." },
      { day: "Día 5", date: "Viernes 16", title: "Fuori Salone", text: "La ciudad convertida en exposición: showrooms, estudios e instalaciones, donde el diseño se muestra en su propio contexto." },
      { day: "Día 6", date: "Sábado 17", title: "Fuera de Milán", text: "Una actividad en los alrededores de Milán y el cierre de la experiencia. Desde ahí, cada participante organiza su regreso o extiende su estadía." },
    ],
    note: "El detalle de cada jornada se envía con el programa completo.",
  },
  pending: {
    title: "Lo que falta confirmar.",
    body: "Te enviamos el programa completo y el valor apenas estén confirmados. Sin formularios largos.",
    items: ["Valor", "Cupos"],
    status: "Por confirmar",
  },
  galleryLabel: "Milan Design Week 2026",
  galleryTitle: "Lo que recorrimos.",
  gallery: [
    { image: "milan-duomo-grupo-noche", alt: "El grupo de Experience Design frente al Duomo de Milán iluminado, de noche" },
    { image: "salone-cocina-bosque", alt: "Stand del Salone del Mobile 2026: una cocina de madera rodeada por una pantalla envolvente con un bosque" },
    { image: "fuori-showroom-lampara", alt: "Showroom del Fuori Salone con techo de vigas, sofás bajos y una lámpara cálida suspendida" },
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
    { image: "salone-cubierta-rho-fiera", alt: "Christian Erdmann bajo la cubierta de vidrio de Rho Fiera, junto al cartel del Salone del Mobile" },
    { image: "milan-grupo-lago-como", alt: "El grupo de Experience Design en un barco en el lago de Como" },
    { image: "venecia-gran-canal-retrato", alt: "Participante con la bolsa de Experience Design frente al Gran Canal de Venecia" },
  ] as { image: ImageName; alt: string }[],
  cta: "Quiero conocer la experiencia",
};

export const neverLate = {
  doubts: ["Ya es tarde para estudiar.", "Debí hacerlo antes.", "No sé si este mundo es para mí."],
  answer: "Nunca es tarde para mirar distinto.",
  body: "Para quienes trabajan en arquitectura, interiorismo y diseño. Para quienes recién empiezan. Y para quienes deciden empezar otra vez.",
  /** Sólo en Inicio (Profesionales sigue usando `body`). */
  homeBody: "Para quienes saben que siempre pueden ir más allá. Para quienes buscan experiencias que los reten, nuevas perspectivas que los inspiren y oportunidades para reinventarse. Para quienes eligen seguir creciendo, explorar lo desconocido y descubrir todo lo que todavía es posible.",
};

export const formation = {
  title: "Aprendizaje aplicado, no clases teóricas.",
  body: "Profesionales de marketing, fotografía y marca comparten herramientas concretas para capitalizar cada experiencia y llevarla a la propia práctica.",
  formatsLabel: "Formatos que estamos preparando",
  formats: ["Cursos", "Webinars", "Herramientas prácticas", "Fotografía", "Marketing", "Marca"],
  modalities: [
    {
      id: "antes",
      label: "Antes",
      text: "Aprender prepara la mirada: qué observar, cómo registrarlo y qué preguntas llevar a cada feria, showroom y estudio.",
    },
    {
      id: "despues",
      label: "Después",
      text: "Volver con referencias propias y criterio para aplicarlas: herramientas online para llevar lo vivido a la propia práctica.",
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
  body: "Te ayudamos a reconocer lo que sabes, lo que has vivido y lo que ves distinto. Y a contarlo con claridad.",
  note: "No se trata de seguidores. Se trata de entender tu valor profesional.",
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
      bio: "Diseñador industrial especializado en mobiliario y curador de diseño. Abre puertas que no están a la vista y lee los códigos de las grandes casas del diseño. Parte del proyecto desde 2025." as string | null,
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
  body: "Empezó como un experimento con pocas personas. Sigue igual de cerca.",
  entries: [
    {
      year: "2026",
      place: "Milán",
      tag: "Milan Design Week · abril de 2026",
      text: "Salone del Mobile, Fuori Salone y showrooms de la ciudad, con Verona, entre los mármoles de Antolini, y Venecia.",
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
  positioningBody: "En un mundo de experiencias pasajeras, Experience Design apuesta por lo que permanece: no solo te llevamos a un destino, te sumergimos en una experiencia donde el diseño cobra vida.",
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
    body: "Ferias, showrooms, estudios y ciudades que tienen el diseño incorporado a su vida cotidiana. Su valor está en lo que ocurre en ellos: entender cómo se piensa una pieza, tocar los materiales, reconocer a los referentes y volver con una mirada propia. No somos una agencia de viajes: facilitamos experiencias, referencias y herramientas para que cada persona avance hacia lo que busca.",
    history: "Empezó como un experimento con pocas personas. Sigue igual de cerca.",
  },
  /** Textos oficiales del manual de marca (versión aprobada el 21 de octubre de 2026). */
  principles: [
    {
      id: "proposito",
      label: "Propósito",
      text: "Abrir la mirada hacia nuevas posibilidades.",
      body: "Salir de lo conocido cambia la forma en que vemos las cosas. Cada experiencia es un medio, no un fin.",
    },
    {
      id: "mision",
      label: "Misión",
      text: "Facilitar y contribuir a la evolución de quienes buscan descubrir, aprender y crecer a través del diseño.",
      body: "Con experiencias cuidadosamente curadas que permiten vivirlo desde dentro, conocer sus procesos de inspiración y llevar lo aprendido a la propia práctica, para ampliar la mirada y abrir nuevas formas de interpretar, crear y avanzar en el camino profesional.",
    },
    {
      id: "vision",
      label: "Visión",
      text: "Consolidar y experimentar dentro.",
      body: "Ser el referente de la curaduría y la vanguardia en la práctica profesional del diseño: experiencias que permiten vivirlo desde dentro, en las capitales del diseño, en sus procesos y en sus materiales.",
    },
  ],
  valuesLabel: "Valores",
  values: [
    { name: "Ambición", text: "Aspirar a más: lo más y lo mejor del diseño." },
    { name: "Superación", text: "Evolucionar y no conformarse. Cada experiencia es una inversión en el propio crecimiento." },
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
  body: "Dos programas para antes y después de cada experiencia: aprender prepara la mirada; expresar la convierte en un sello propio.",
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
      intro: "Cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca, para capitalizar la experiencia y llevarla a la propia práctica.",
      short: "Cursos, webinars y herramientas prácticas online con profesionales de marketing, fotografía y marca.",
      keywords: ["Cursos", "Webinars", "Herramientas", "Fotografía", "Marketing", "Marca"],
      tone: "ink",
      glow: "#C97B4A",
      material: "travertine",
      image: {
        image: "fuori-charla-arcos",
        alt: "Charla durante el Fuori Salone de Milán: el público sentado bajo una galería de arcos frente a una pantalla",
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
        students: "Estudiantes de pregrado en sus últimos años, de posgrado y recién titulados que quieren entender el oficio más allá del aula.",
        professionals: "Profesionales de arquitectura, interiorismo y diseño que quieren seguir aprendiendo y sacar más de cada experiencia.",
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
      intro: "Construir la propia marca y encontrar el sello que distingue a cada persona, estudio o empresa. No se trata de seguidores: se trata de tu valor profesional.",
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
        students: "Estudiantes de pregrado en sus últimos años, de posgrado y recién titulados que empiezan a definir su sello antes de salir al mundo profesional.",
        professionals: "Profesionales de arquitectura, interiorismo y diseño que quieren reconocer su valor y comunicarlo con criterio y coherencia.",
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
  closeBody: "Te avisamos cuando abramos los primeros cursos y webinars. Sin formularios largos.",
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
  closeBody: "Cuéntanos dónde estás. Te respondemos con lo concreto cuando el programa esté confirmado.",
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
        { image: "salone-escalinata-roja", alt: "Escalinata roja de acceso a los pabellones del Salone del Mobile, bajo la cubierta de vidrio de Rho Fiera" },
        { image: "fuori-showroom-lampara", alt: "Showroom del Fuori Salone con techo de vigas, sofás bajos y una lámpara cálida suspendida" },
        { image: "verona-marmol-verde", alt: "Placas de mármol verde y de tonos tierra exhibidas en Antolini, Verona" },
        { image: "milan-galleria-cupula", alt: "La Galleria Vittorio Emanuele II de noche, con su cúpula de vidrio y el piso de mosaico" },
        { image: "salone-cielo-cintas", alt: "Instalación de cintas blancas suspendidas sobre un stand del Salone del Mobile" },
        { image: "milan-grupo-suelo-rojo", alt: "Participantes sentados en un banco junto al suelo rojo de un pabellón del Salone" },
        { image: "venecia-gondola", alt: "Participante en una góndola bajo un puente de Venecia" },
      ] as CollagePhoto[],
      gallery: [
        { image: "salone-cocina-bosque" as ImageName, alt: "Stand del Salone del Mobile 2026: una cocina de madera rodeada por una pantalla envolvente con un bosque" },
        { image: "fuori-showroom-biblioteca" as ImageName, alt: "Showroom del Fuori Salone: sofás bajos, pilares de piedra y una gran biblioteca iluminada al fondo" },
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
  intro: "En CASACOR, arquitectos, interioristas y paisajistas transforman una casa en una secuencia de ambientes. Cada uno es una forma distinta de resolver cómo vivimos.",
  origin: "Aquí empezó todo: en 2023, la primera prueba de Experience Design fue en São Paulo, con tres participantes. En julio de 2025 volvimos a CASACOR.",
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
