/**
 * Todo el contenido editable del sitio vive aquí.
 *
 * Regla: nada inventado. Lo que todavía está en definición (fechas, valores,
 * programa, cupos, cursos, biografías, fotos) se marca como pendiente y la UI
 * lo muestra como "Por confirmar" / "En desarrollo" / "Próximamente".
 */

import type { MaterialName } from "../lib/materials";

export const brand = {
  name: "Experience Design",
  instagram: { handle: "@experience__design", url: "https://www.instagram.com/experience__design/" },
  website: "experience-design.cl",
  /** Correo verificado. null = no se muestra. */
  email: null as string | null,
  /** WhatsApp verificado en formato internacional (ej. "56912345678"). null = no se muestra. */
  whatsapp: null as string | null,
  /**
   * Ruta al logo oficial (SVG o PNG con fondo transparente), ej. "/brand/logo.svg".
   * Mientras sea null se usa una reconstrucción provisoria del sello (círculo terracota + "E.").
   * Al definirla, el logo se usa en navegación, loader, footer y como textura del objeto 3D.
   */
  logoAsset: null as string | null,
};

export type ImageSlot = {
  /** Foto real. Si falta, se muestra una placa de material como sustituto. */
  src?: string;
  alt: string;
  material: MaterialName;
  /** Qué foto debería ir aquí (documentación para el equipo). */
  brief: string;
};

export const nav = [
  { label: "Experiencias", href: "#experiencias" },
  { label: "Formación", href: "#formacion" },
  { label: "Marca personal", href: "#marca-personal" },
  { label: "Nosotros", href: "#nosotros" },
];

export const hero = {
  titleA: "Abrir la mirada",
  titleB: "hacia nuevas posibilidades.",
  sub: "Experiencias de diseño, formación y conexiones para quienes quieren seguir descubriendo.",
  cta: "Quiero conocer la experiencia",
};

export const idea = {
  lead: "El diseño no solo se observa.",
  verbs: ["Se vive.", "Se toca.", "Se reflexiona.", "Se admira."],
  closing: "Hay cosas que una pantalla puede mostrarte, pero no puede hacerte sentir.",
};

export const touch = {
  title: "Si no lo tocas, no lo viste.",
  body: "Mirar y tocar es lo esencial en el interiorismo. Un material cambia con la luz, con la mano, con la distancia.",
  materials: [
    { name: "terracotta", label: "Terracota" },
    { name: "travertine", label: "Travertino" },
    { name: "walnut", label: "Nogal" },
    { name: "terrazzo", label: "Terrazzo" },
    { name: "linen", label: "Lino" },
    { name: "plaster", label: "Estuco" },
  ] as { name: MaterialName; label: string }[],
};

export const worlds = {
  title: "Tres formas de abrir la mirada.",
  thread: "Conectar",
  items: [
    {
      id: "experiencias",
      href: "#experiencias",
      verb: "Descubrir",
      name: "Experiencias",
      keywords: ["Ciudades", "Showrooms", "Estudios", "Materiales", "Personas"],
      text: "Viajar a donde el diseño está ocurriendo.",
      material: "travertine" as MaterialName,
      tone: "light" as const,
    },
    {
      id: "formacion",
      href: "#formacion",
      verb: "Aprender",
      name: "Formación",
      keywords: ["Workshops", "Conversaciones", "Casos", "Materiales"],
      text: "Convertir lo que viste en algo que puedes usar.",
      material: "walnut" as MaterialName,
      tone: "dark" as const,
    },
    {
      id: "marca-personal",
      href: "#marca-personal",
      verb: "Expresar",
      name: "Marca personal",
      keywords: ["Historia", "Mirada", "Posicionamiento", "Voz"],
      text: "Reconocer tu valor y saber contarlo.",
      material: "linen" as MaterialName,
      tone: "light" as const,
    },
  ],
};

export const milan = {
  city: "Milán",
  year: "2027",
  event: "Milan Design Week",
  topics: ["Salone del Mobile", "Showrooms", "Estudios", "Materiales", "Cultura", "Conexiones"],
  statementA: "No venimos a mirar desde afuera.",
  statementB: "Venimos a entrar.",
  chapters: [
    {
      n: "01",
      title: "Milán",
      text: "Una ciudad que lleva generaciones pensando cómo vivimos. La recorremos con la atención de quien diseña.",
      material: "plaster" as MaterialName,
    },
    {
      n: "02",
      title: "Design Week",
      text: "Durante el Salone del Mobile la ciudad entera se vuelve exposición. Vamos a donde ocurre.",
      material: "terrazzo" as MaterialName,
    },
    {
      n: "03",
      title: "La ciudad",
      text: "Patios, fachadas, tranvías, cafés. La arquitectura también se aprende caminando.",
      material: "travertine" as MaterialName,
    },
    {
      n: "04",
      title: "Las personas",
      text: "Detrás de cada showroom y cada estudio hay alguien que tomó decisiones. Queremos escucharlas.",
      material: "walnut" as MaterialName,
    },
    {
      n: "05",
      title: "Los materiales",
      text: "Superficies, revestimientos, texturas. Verlos en persona, con luz real, a la distancia de la mano.",
      material: "terracotta" as MaterialName,
    },
    {
      n: "06",
      title: "Las conexiones",
      text: "Vuelves con referencias, preguntas y personas con las que seguir conversando.",
      material: "linen" as MaterialName,
    },
  ],
  pending: {
    title: "Lo concreto, apenas esté confirmado.",
    body: "Te enviamos el programa, qué incluye y el valor. Sin formularios largos.",
    items: ["Fechas", "Programa", "Valor", "Cupos"],
    status: "Por confirmar",
  },
  cta: "Quiero conocer la experiencia",
};

export const neverLate = {
  doubts: ["Ya es tarde para estudiar.", "Debí hacerlo antes.", "No sé si este mundo es para mí."],
  answer: "Nunca es tarde para mirar distinto.",
  body: "Para quienes trabajan en arquitectura, interiorismo y diseño. Para quienes recién empiezan. Y para quienes deciden empezar otra vez.",
};

export const formation = {
  title: "Lo que descubres también puede transformarse en conocimiento.",
  body: "Formación conectada con el mundo real: materiales, marcas, casos y personas que hacen diseño todos los días.",
  formatsLabel: "Formatos que estamos preparando",
  formats: ["Workshops", "Masterclasses", "Conversaciones", "Casos reales", "Sesiones de materiales", "Encuentros con marcas", "Ejercicios"],
  modalities: [
    {
      id: "presencial",
      label: "Presencial",
      text: "En sala, en estudios y frente al material. Donde se puede mirar y tocar.",
    },
    {
      id: "online",
      label: "Online",
      text: "Una modalidad, no otro mundo. El mismo enfoque para quienes no pueden viajar o quieren seguir aprendiendo después.",
    },
  ],
  status: "Programa en desarrollo",
  cta: "Avísame",
  image: {
    alt: "",
    material: "plaster",
    brief: "Workshop o sesión de materiales: manos, muestras, mesa de trabajo. Formato 4:5.",
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
  cta: "Descubrir marca personal",
};

export const community = {
  title: "Más que viajes, creamos relaciones.",
  disciplines: ["Arquitectura", "Interiorismo", "Diseño", "Marcas", "Materiales", "Iluminación", "Mobiliario", "Industrias creativas"],
  body: "El viaje dura unos días. Las conversaciones que empiezan ahí duran bastante más.",
  images: [
    { alt: "", material: "travertine", brief: "Grupo conversando en un showroom (foto real de una experiencia). 4:5." },
    { alt: "", material: "terrazzo", brief: "Detalle de manos tocando un material. 1:1." },
    { alt: "", material: "walnut", brief: "Sobremesa o café con el grupo en Milán. 3:4." },
    { alt: "", material: "plaster", brief: "Recorrido por la calle o un patio milanés. 4:3." },
  ] as ImageSlot[],
};

export const founders = {
  statement: "Detrás de cada experiencia hay personas que llevan años mirando el mundo del diseño desde dentro.",
  people: [
    {
      name: "Danae Barla",
      field: "Arquitectura, interiorismo y diseño.",
      bio: null as string | null,
      image: { alt: "Retrato de Danae Barla", material: "terracotta", brief: "Retrato real de Danae, luz natural. 4:5." } as ImageSlot,
    },
    {
      name: "Christian Erdmann",
      field: "Arquitectura, interiorismo y diseño. Parte del proyecto desde 2025.",
      bio: null as string | null,
      image: { alt: "Retrato de Christian Erdmann", material: "walnut", brief: "Retrato real de Christian, luz natural. 4:5." } as ImageSlot,
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
      year: "2027",
      place: "Milán",
      tag: "Milan Design Week",
      text: "La próxima experiencia. Programa, fechas y valor en definición.",
      status: "next",
      material: "terrazzo",
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
      place: "Italia",
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
    {
      year: "",
      place: "Venecia",
      tag: "Italia",
      text: "Parte del universo de experiencias italianas.",
      material: "linen",
    },
    {
      year: "",
      place: "Próximo destino",
      tag: "Próximamente",
      text: "Estamos explorando nuevos lugares donde el diseño está ocurriendo.",
      status: "soon",
      material: "walnut",
    },
  ] as ArchiveEntry[],
};

export const interests = [
  { id: "milan", label: "Milán 2027" },
  { id: "formacion", label: "Formación" },
  { id: "marca", label: "Marca personal" },
  { id: "empresas", label: "Empresas y universidades" },
] as const;
export type InterestId = (typeof interests)[number]["id"];

export const contact = {
  title: "¿Nos vemos en el camino?",
  body: "Cuéntanos qué te interesa. Te respondemos con lo concreto: qué es, qué incluye y cuánto cuesta.",
  b2b: "¿Eres una marca, una empresa o una universidad?",
  b2bCta: "Hablemos",
  submit: "Enviar",
};

export const footer = {
  statement: "Abrir la mirada hacia nuevas posibilidades.",
};
