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
   * Ruta al logo oficial (SVG o PNG con fondo transparente), ej. "/brand/logo.svg".
   * Mientras sea null se usa una reconstrucción provisoria del sello (círculo terracota + "E.").
   * Al definirla, el logo se usa en navegación, loader, footer y como textura del objeto 3D.
   */
  logoAsset: null as string | null,
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
  marcaPersonal: "/programas/marca-personal",
  estudiantes: "/programas/estudiantes",
  profesionales: "/programas/profesionales",
  destinos: "/destinos",
  milan: "/destinos/milan",
  saoPaulo: "/destinos/sao-paulo",
  contacto: "/contacto",
} as const;

export type NavItem = { label: string; href: string; children?: { label: string; note?: string; href: string }[] };

/** Navegación principal: Inicio, Nosotros, Programas, Destinos (+ Contacto como CTA). */
export const nav: NavItem[] = [
  { label: "Inicio", href: routes.inicio },
  { label: "Nosotros", href: routes.nosotros },
  {
    label: "Programas",
    href: routes.programas,
    children: [
      { label: "Marca personal", href: routes.marcaPersonal },
      { label: "Estudiantes", href: routes.estudiantes },
      { label: "Profesionales", href: routes.profesionales },
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
  [routes.marcaPersonal]: "Marca personal · Programas · Experience Design",
  [routes.estudiantes]: "Estudiantes · Programas · Experience Design",
  [routes.profesionales]: "Profesionales · Programas · Experience Design",
  [routes.destinos]: "Destinos · Experience Design",
  [routes.milan]: "Milán, Salone del Mobile · Destinos · Experience Design",
  [routes.saoPaulo]: "São Paulo, CASACOR · Destinos · Experience Design",
  [routes.contacto]: "Contacto · Experience Design",
};

/** Cada página termina invitando a la siguiente: un mismo libro, distintos capítulos. */
export const chapterOrder: { href: string; label: string }[] = [
  { href: routes.inicio, label: "Inicio" },
  { href: routes.nosotros, label: "Nosotros" },
  { href: routes.programas, label: "Programas" },
  { href: routes.marcaPersonal, label: "Marca personal" },
  { href: routes.estudiantes, label: "Estudiantes" },
  { href: routes.profesionales, label: "Profesionales" },
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

/** Inicio · Programas: tres bloques sobre una línea vertical (Viajes, Marca personal, Formación). */
export const programsSpine = {
  kicker: "Programas",
  title: "Tres caminos. Un mismo mundo.",
  items: [
    {
      id: "viajes",
      n: "01",
      verb: "Descubrir",
      name: "Viajes",
      text: "Experiencias internacionales curadas alrededor del diseño, la cultura y las formas de vivirlo. Vamos a conocer lugares, marcas y personas: observar, cuestionar y aprender, para volver con algo propio.",
      href: routes.destinos,
      cta: "Ver destinos",
      main: { image: "milan-showroom" as ImageName, alt: "Showroom en Milán con pilares de piedra, sofás y una gran estantería iluminada" },
      detail: { image: "salone-banderas" as ImageName, alt: "Banderas del Salone del Mobile.Milano frente al pabellón" },
      history: {
        pastLabel: "Experiencias realizadas",
        past: [
          { year: "2023", place: "São Paulo", note: "Piloto" },
          { year: "2024", place: "Milán", note: "Piloto" },
          { year: "2025", place: "Milán", note: "Primera experiencia abierta" },
        ],
        nextLabel: "Próxima experiencia",
        next: { year: "2027", place: "Milán", note: "Milan Design Week. Fechas por confirmar" },
      },
    },
    {
      id: "marca-personal",
      n: "02",
      verb: "Expresar",
      name: "Marca personal",
      text: "Tu trayectoria ya dice mucho. Te ayudamos a ordenarla y darle criterio, proyección y una voz profesional propia, coherente en cada lugar donde apareces.",
      href: routes.marcaPersonal,
      cta: "Conocer Marca personal",
      main: { image: "danae" as ImageName, alt: "Detalle de un retrato: textil de lino, collar de cerámica y una silla tejida" },
      detail: { image: "materiales" as ImageName, alt: "Muestras de piedra, madera y metal" },
      notes: ["Historia", "Mirada", "Criterio", "Voz"],
    },
    {
      id: "formacion",
      n: "03",
      verb: "Aprender",
      name: "Formación",
      text: "Conocimiento que sigue después del viaje: conversaciones con profesionales, herramientas y casos reales, con un formato flexible para seguir aprendiendo.",
      href: routes.programas,
      cta: "Ver programas",
      main: { image: "charla-showroom" as ImageName, alt: "Conversación con un diseñador invitado en un showroom de Milán, con público alrededor" },
      detail: { image: "materiales" as ImageName, alt: "Muestras de materiales sobre una mesa de trabajo" },
      formats: ["Webinars", "Masterclasses", "Cursos", "Conversaciones"],
    },
  ],
};

export const milan = {
  city: "Milán",
  year: "2027",
  event: "Milan Design Week",
  fair: "Salone del Mobile",
  openingImage: { image: "milan-showroom" as ImageName, alt: "Showroom en Milán con pilares de piedra, sofás y una gran estantería iluminada" },
  topics: ["Salone del Mobile", "Showrooms", "Estudios", "Materiales", "Cultura", "Conexiones"],
  statementA: "No venimos a mirar desde afuera.",
  statementB: "Venimos a entrar.",
  chapters: [
    {
      n: "01",
      title: "La ciudad",
      text: "Una ciudad que lleva generaciones pensando cómo vivimos. La recorremos con la atención de quien diseña.",
      material: "plaster" as MaterialName,
      image: "milan-ciudad" as ImageName,
      alt: "Catedral de Milán al atardecer, con gente en la plaza",
    },
    {
      n: "02",
      title: "El diseño",
      text: "Durante el Salone del Mobile la ciudad entera se vuelve exposición. Vamos a donde ocurre.",
      material: "terrazzo" as MaterialName,
      image: "salone-pabellon" as ImageName,
      alt: "Pasillo del Salone del Mobile con visitantes",
    },
    {
      n: "03",
      title: "Los materiales",
      text: "Superficies, revestimientos, texturas. Verlos en persona, con luz real, a la distancia de la mano.",
      material: "terracotta" as MaterialName,
      image: "showroom-piedra" as ImageName,
      alt: "Showroom con mesa de piedra, sillas tapizadas y arcos",
    },
    {
      n: "04",
      title: "Los espacios",
      text: "Patios, fachadas, showrooms, estudios. La arquitectura también se aprende caminando.",
      material: "travertine" as MaterialName,
      image: "milan-patio" as ImageName,
      alt: "Patio porticado con una instalación de tela iluminada",
    },
    {
      n: "05",
      title: "Las personas",
      text: "Detrás de cada showroom y cada estudio hay alguien que tomó decisiones. Queremos escucharlas.",
      material: "walnut" as MaterialName,
      image: "salone-personas" as ImageName,
      alt: "Visitantes frente al muro rojo del Salone del Mobile",
    },
    {
      n: "06",
      title: "Las conexiones",
      text: "Vuelves con referencias, preguntas y personas con las que seguir conversando.",
      material: "linen" as MaterialName,
      image: "instalacion-roja" as ImageName,
      alt: "Instalación de mallas rojas en un pabellón, con personas recorriéndola",
    },
  ],
  pending: {
    title: "Lo concreto, apenas esté confirmado.",
    body: "Te enviamos el programa, qué incluye y el valor. Sin formularios largos.",
    items: ["Fechas", "Programa", "Valor", "Cupos"],
    status: "Por confirmar",
    image: { image: "salone-banderas" as ImageName, alt: "Banderas del Salone del Mobile.Milano frente al pabellón" },
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
    image: "materiales",
    alt: "Muestras de piedra, madera y metal sobre una mesa de trabajo",
    material: "plaster",
    brief: "Sesión de materiales.",
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
      field: "Arquitectura, interiorismo y diseño.",
      bio: null as string | null,
      image: { image: "danae", alt: "Retrato de Danae Barla", material: "terracotta", brief: "Retrato real de Danae, luz natural. 4:5." } as ImageSlot,
    },
    {
      name: "Christian Erdmann",
      field: "Arquitectura, interiorismo y diseño. Parte del proyecto desde 2025.",
      bio: null as string | null,
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
  image: {
    image: "fundadores-showroom",
    alt: "Danae Barla y Christian Erdmann en un showroom de baño con muros de mármol",
    material: "travertine",
    brief: "Danae y Christian juntos, en un lugar de diseño.",
  } as ImageSlot,
  who: {
    label: "Quiénes somos",
    text: "Experience Design crea experiencias de diseño que conectan viajes, aprendizaje y personas con el mundo de la arquitectura, el interiorismo y el diseño.",
    history: "Empezó como un experimento con pocas personas. Sigue igual de cerca.",
  },
  /**
   * BORRADOR para validar con Danae y Christian: misión, visión y valores están
   * redactados sólo a partir de frases que ya usa la marca (hero, ejes, comunidad).
   */
  principles: [
    { id: "mision", label: "Misión", text: "Crear experiencias de diseño, formación y conexiones para quienes quieren seguir descubriendo." },
    { id: "vision", label: "Visión", text: "Que el diseño se viva en primera persona: mirado, tocado y conversado donde está ocurriendo." },
  ],
  valuesLabel: "Valores",
  values: [
    { name: "Mirar", text: "Abrir la mirada hacia nuevas posibilidades." },
    { name: "Tocar", text: "Si no lo tocas, no lo viste." },
    { name: "Aprender", text: "Nunca es tarde para mirar distinto." },
    { name: "Conectar", text: "Más que viajes, creamos relaciones." },
  ],
  philosophyLabel: "Filosofía",
  foundersLabel: "Danae + Christian",
};

/* ---------------------------------------------------------------------------
 * PROGRAMAS: tres programas independientes. Nunca mezclar con destinos.
 * ------------------------------------------------------------------------- */

export type ProgramId = "marca-personal" | "estudiantes" | "profesionales";

export type Program = {
  id: ProgramId;
  n: string;
  name: string;
  href: string;
  /** Idea central del programa. */
  lines: string[];
  intro: string;
  keywords: string[];
  /** Tono del sitio mientras el programa está activo. */
  tone: "clay" | "sand" | "ink";
  /** Color de la luz WebGL sobre ese tono. */
  glow: string;
  material: MaterialName;
  image: ImageSlot;
  /** Segunda imagen pequeña (sólo Profesionales: el material de cerca). */
  detail?: ImageSlot;
  interest: InterestId;
  cta: string;
  mood: string;
};

export const programs = {
  title: "Programas",
  lead: "Experiencias diseñadas para distintos momentos de tu camino.",
  body: "Experience Design tiene distintas formas de participar, según quién eres y qué estás buscando.",
  question: "¿Qué camino dentro de Experience Design es para mí?",
  hint: "Tres puertas al mismo mundo",
  items: [
    {
      id: "marca-personal",
      n: "01",
      name: "Marca personal",
      href: routes.marcaPersonal,
      lines: ["Tienes una mirada.", "¿Qué hacemos con ella?"],
      intro: "Reconocer tu identidad profesional y aprender a contarla. No se trata de seguidores: se trata de tu valor.",
      keywords: ["Tu historia", "Tu mirada", "Tu posicionamiento", "Tu voz"],
      tone: "clay",
      glow: "#F1D6BF",
      material: "linen",
      image: {
        image: "fundadores-showroom",
        alt: "Danae Barla y Christian Erdmann en un showroom de baño con muros de mármol",
        material: "linen",
        brief: "Retrato íntimo, luz natural, vertical. Reemplazar por la foto oficial de Marca personal cuando exista.",
      },
      interest: "marca",
      cta: "Conocer Marca personal",
      mood: "Íntimo",
    },
    {
      id: "estudiantes",
      n: "02",
      name: "Estudiantes",
      href: routes.estudiantes,
      lines: ["El mundo del diseño", "también se aprende", "fuera del aula."],
      intro: "Para estudiantes de pregrado y posgrado de arquitectura, interiorismo, diseño y disciplinas creativas afines.",
      keywords: ["Aprender", "Descubrir", "Conectar", "Imaginar tu camino"],
      tone: "sand",
      glow: "#C9765C",
      material: "terrazzo",
      image: {
        image: "charla-showroom",
        alt: "Conversación con un diseñador invitado en un showroom de Milán, con público sentado alrededor",
        material: "terrazzo",
        brief: "Estudiantes en un recorrido o conversación fuera del aula.",
      },
      interest: "estudiantes",
      cta: "Conocer el programa",
      mood: "Exploración",
    },
    {
      id: "profesionales",
      n: "03",
      name: "Profesionales",
      href: routes.profesionales,
      lines: ["Seguir aprendiendo", "también es parte", "de una carrera."],
      intro: "Para quienes ya trabajan en arquitectura, interiorismo, diseño y en las industrias que los rodean.",
      keywords: ["Referencias", "Industria", "Materiales", "Conexiones"],
      tone: "ink",
      glow: "#B7664F",
      material: "walnut",
      image: {
        image: "showroom-piedra",
        alt: "Showroom con mesa de piedra, sillas tapizadas y arcos",
        material: "walnut",
        brief: "Showroom o estudio, arquitectura y material.",
      },
      detail: {
        image: "materiales",
        alt: "Muestras de piedra, madera y metal sobre una mesa de trabajo",
        material: "travertine",
        brief: "Material de cerca.",
      },
      interest: "profesionales",
      cta: "Conocer el programa",
      mood: "Profundidad",
    },
  ] as Program[],
};

export const programPending = {
  label: "Lo concreto",
  status: "Por confirmar",
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

export const studentsPage = {
  audienceLabel: "Para quién",
  levels: ["Pregrado", "Posgrado"],
  disciplines: ["Arquitectura", "Interiorismo", "Diseño", "Disciplinas creativas afines"],
  journeyLabel: "Un recorrido",
  journey: [
    { title: "Aprender", text: "Lo que no cabe en una clase: el oficio visto de cerca." },
    { title: "Descubrir", text: "Lugares, estudios y materiales que hasta ahora eran una foto." },
    { title: "Conectar", text: "Personas de la industria con las que seguir conversando." },
    { title: "Imaginar tu camino", text: "Volver con otra idea de lo que puedes llegar a hacer." },
  ],
  gainsLabel: "Lo que se vive",
  gains: ["Exposición profesional", "Inspiración", "Conexiones con la industria", "Cultura del diseño", "Referencias reales", "Aprendizaje", "Networking", "Nuevas perspectivas"],
  closeTitle: "La propuesta para estudiantes está en definición.",
  closeBody: "Déjanos tus datos y te contamos apenas tengamos lo concreto.",
  pending: ["Formato", "Fechas", "Valor", "Cupos"],
};

export const professionalsPage = {
  audienceLabel: "Para quién",
  audience: ["Arquitectos", "Interioristas", "Diseñadores", "Profesionales creativos", "Fundadores de estudios", "Profesionales independientes"],
  industriesLabel: "Y quienes trabajan en",
  industries: ["Materiales", "Mobiliario", "Iluminación", "Arquitectura", "Interiorismo", "Decoración", "Industria del diseño"],
  gainsLabel: "Lo que se lleva",
  gains: ["Desarrollo profesional", "Nuevas referencias", "Conocimiento de la industria", "Cultura del diseño", "Conexiones", "Nuevas perspectivas", "Aprendizaje continuo", "Experiencias reales"],
  closeTitle: "Lo concreto, apenas esté confirmado.",
  closeBody: "Te enviamos formato, fechas y valor. Sin formularios largos.",
  pending: ["Formato", "Fechas", "Valor", "Cupos"],
};

/* ---------------------------------------------------------------------------
 * DESTINOS: experiencias para vivir. No son programas.
 * ------------------------------------------------------------------------- */

export const destinations = {
  title: "Destinos",
  lead: "Hay lugares que cambian tu forma de mirar.",
  question: "¿Qué experiencia puedo vivir?",
  items: [
    {
      id: "milan",
      n: "01",
      name: "Milán",
      event: "Milan Design Week",
      sub: "Salone del Mobile",
      href: routes.milan,
      when: "2027 · Fechas por confirmar",
      text: "La semana en que una ciudad entera se vuelve exposición.",
      image: { image: "milan-showroom", alt: "Showroom en Milán con pilares de piedra, sofás y una gran estantería iluminada", material: "terrazzo", brief: "Milán, Design Week." } as ImageSlot,
      cta: "Entrar a Milán",
    },
    {
      id: "sao-paulo",
      n: "02",
      name: "São Paulo",
      event: "CASACOR São Paulo",
      sub: "Arquitectura, interiorismo y paisajismo",
      href: routes.saoPaulo,
      when: "Año por confirmar",
      text: "Una casa entera convertida en ambientes para recorrer.",
      image: { alt: "", material: "terracotta", brief: "Foto real de CASACOR São Paulo (pendiente)." } as ImageSlot,
      cta: "Entrar a São Paulo",
    },
  ],
};

export const saoPaulo = {
  city: "São Paulo",
  event: "CASACOR São Paulo",
  year: "Año por confirmar",
  statementA: "Una casa no se entiende en una foto.",
  statementB: "Se recorre.",
  intro: "En CASACOR, arquitectos, interioristas y paisajistas transforman una casa en una secuencia de ambientes. Cada uno es una forma distinta de resolver cómo vivimos.",
  origin: "Aquí empezó todo: en 2023, la primera prueba de Experience Design fue en São Paulo, con tres participantes.",
  /** Sin fotos reales todavía: cada ambiente usa una placa de material. Reemplazar por fotos de CASACOR. */
  rooms: [
    { n: "01", title: "La casa", text: "Una muestra que se recorre de puerta en puerta, ambiente por ambiente.", material: "plaster" as MaterialName, brief: "Fachada o acceso de CASACOR São Paulo." },
    { n: "02", title: "Los ambientes", text: "Cada espacio es una propuesta distinta. Recorrerlos es comparar miradas.", material: "terracotta" as MaterialName, brief: "Un ambiente completo, plano general." },
    { n: "03", title: "Los materiales", text: "Lo que en catálogo es un nombre, aquí es luz, peso y temperatura.", material: "travertine" as MaterialName, brief: "Detalle de material en un ambiente." },
    { n: "04", title: "La ciudad", text: "Una de las grandes capitales de la arquitectura moderna, a escala de calle.", material: "terrazzo" as MaterialName, brief: "São Paulo, arquitectura de la ciudad." },
    { n: "05", title: "Las personas", text: "Quienes diseñan cada ambiente, y quienes lo recorren con nosotros.", material: "walnut" as MaterialName, brief: "Grupo recorriendo un ambiente." },
  ],
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
  { id: "marca", label: "Marca personal" },
  { id: "estudiantes", label: "Estudiantes" },
  { id: "profesionales", label: "Profesionales" },
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
