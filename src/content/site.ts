/**
 * Fuente tipada de contenido del sitio.
 * Derivada de content/atypical-content.md (fuente de verdad).
 * Ningún componente debe hardcodear texto: todo sale de acá.
 */

export const site = {
  name: "Fundación ATYPICAL Py",
  shortName: "ATYPICAL Py",
  legalName: "Fundación ATYPICAL Py · Neurodiversidad",
  tagline:
    "Visibilizamos, valoramos y respetamos las diferentes condiciones neurodivergentes. Porque un diagnóstico no es un pronóstico de vida.",
  description:
    "ONG paraguaya sin fines de lucro que visibiliza, valora y respeta las condiciones neurodivergentes, ofreciendo apoyo emocional y terapéutico a familias.",
  url: "https://atypical.org.py",
  locale: "es-PY",
  whatsapp: {
    number: "+595 983 982188",
    href: "https://wa.me/595983982188",
    cta: "Escribinos por WhatsApp",
  },
  social: {
    instagram: {
      handle: "@atypical_paraguay",
      href: "https://instagram.com/atypical_paraguay",
    },
    tiktok: {
      handle: "@atypical_py",
      href: "https://tiktok.com/@atypical_py",
    },
  },
  footer: "© 2026 Fundación ATYPICAL Py · Neurodiversidad",
  credit: {
    madeWith: "Hecho con",
    by: "Neura",
    href: "https://neura.com.py",
  },
} as const;

export type NavLink = { label: string; href: string };

// Los href usan "/#ancla" (con la barra) para que funcionen también desde
// las subpáginas (/nuestra-historia, /divertite-picoteando): navegan al home
// y luego bajan al ancla. Un "#ancla" pelado no funciona fuera del home.
export const nav: NavLink[] = [
  { label: "Nosotros", href: "/#sobre-nosotros" },
  { label: "Misión", href: "/#mision-vision" },
  { label: "Objetivos", href: "/#objetivos" },
  { label: "Comisión", href: "/comision" },
  { label: "Historia", href: "/#historia" },
  { label: "Proyecto", href: "/#proyecto" },
  { label: "Eventos", href: "/#eventos" },
  { label: "Actividades", href: "/actividades" },
  { label: "DIVERtite", href: "/divertite-picoteando" },
  { label: "Contacto", href: "/#contacto" },
];

export const divertite = {
  id: "divertite",
  kicker: "Nuestro evento más esperado",
  title: "DIVERtite picoTEAndo 4ª edición",
  lead: "Una verdadera fiesta familiar por la neurodiversidad. Detrás de cada sonrisa hay una historia que celebramos.",
  cta: "Conocé a los protagonistas",
  href: "/divertite-picoteando",
  galleryTitle: "Ellos son el corazón de DIVERtite picoTEAndo 4ª edición",
  galleryLead: "Cada niño y cada niña que hace de este evento algo inolvidable.",
} as const;

export const hero = {
  eyebrow: "Fundación · Neurodiversidad · Paraguay",
  title: "Un diagnóstico no es un pronóstico de vida",
  tagline: site.tagline,
  primaryCta: { label: "Conocé la fundación", href: "#sobre-nosotros" },
  secondaryCta: { label: "Sumate", href: "#contacto" },
  scrollHint: "Desliza para conocer nuestra historia",
} as const;

export const about = {
  id: "sobre-nosotros",
  kicker: "¿Quiénes somos?",
  title: "La neurodiversidad es parte de la diversidad humana",
  paragraphs: [
    "La neurodiversidad fue descrita por primera vez en 1998 por la socióloga Judy Singer, como sinónimo de la biodiversidad neurológica. Se estima que entre el 15% y 20% de la población tiene un desarrollo neurológico diferente.",
    "Entre las personas neurodivergentes se encuentran quienes tienen diagnósticos como TEA, TDAH, dislexia, trastornos de ansiedad o apraxia. Hoy se cuestiona mantenerlos como «trastornos», prefiriendo el término de condiciones.",
    "En nuestro país existe una carencia educacional, de concienciación y empatía, y mucho menos enfoque para tratamientos necesarios desde la edad temprana. La fundación busca educar a padres, docentes y a toda la comunidad.",
  ],
  stat: {
    from: 15,
    to: 20,
    suffix: "%",
    label: "de la población tiene un desarrollo neurológico diferente",
  },
  conditions: ["TEA", "TDAH", "Dislexia", "Ansiedad", "Apraxia"],
  highlights: [
    {
      emoji: "🧠",
      title: "15-20% de la población",
      text: "Tiene un desarrollo neurológico diferente al esperado.",
      color: "var(--color-spectrum-red)",
    },
    {
      emoji: "🧩",
      title: "TEA, TDAH, Apraxia, Dislexia",
      text: "Condiciones que forman parte de la neurodivergencia.",
      color: "var(--color-spectrum-teal)",
    },
    {
      emoji: "📚",
      title: "Educación inclusiva",
      text: "Cada niño merece recibir la educación que necesita.",
      color: "var(--color-spectrum-green)",
    },
    {
      emoji: "💛",
      title: "Comunidad y empatía",
      text: "Neurotípicos y neurodivergentes juntos conformamos la neurodiversidad.",
      color: "var(--color-spectrum-purple)",
    },
  ],
} as const;

export type Concept = { term: string; definition: string };

export const concepts: { id: string; title: string; items: Concept[] } = {
  id: "conceptos",
  title: "Conceptos clave",
  items: [
    {
      term: "Neurodiversidad",
      definition:
        "Concepto creado por Judy Singer en 1998. Refiere a la variación infinita del funcionamiento de los cerebros humanos.",
    },
    {
      term: "Neurodivergentes",
      definition:
        "Personas con un funcionamiento neurocognitivo diferente. Ser neurodivergente no significa estar enfermo.",
    },
    {
      term: "Neurotípicos",
      definition:
        "Personas que comparten un funcionamiento neurocognitivo similar al de la mayoría de la población.",
    },
    {
      term: "Neurodiversos",
      definition:
        "Somos todos los seres humanos, con nuestras distintas formas de ser, pensar y sentir.",
    },
  ],
};

export const missionVision = {
  id: "mision-vision",
  title: "Misión y Visión",
  mission: {
    label: "Misión",
    text: "Somos una organización colaborativa de apoyo y gestión sin fines de lucro, conformada por familiares de personas con condiciones neurodivergentes y colaboradores comprometidos con el servicio a la comunidad.",
  },
  vision: {
    label: "Visión",
    text: "Visibilizar, valorar y respetar las diferentes condiciones neurodivergentes, fomentando el conocimiento y la cultura de la empatía; con la convicción de que un diagnóstico no es un pronóstico de vida y que con los apoyos necesarios se pueden alcanzar logros significativos para la inclusión plena en la sociedad.",
  },
} as const;

export type Objective = { title: string; methods: string[] };

export const objectives: {
  id: string;
  title: string;
  general: string;
  specific: Objective[];
} = {
  id: "objetivos",
  title: "Objetivos",
  general:
    "Concienciar a la población sobre la neurodiversidad y ofrecer apoyo emocional y terapéutico a niños diagnosticados con alguna condición del neurodesarrollo.",
  specific: [
    {
      title: "Educar a la población sobre la neurodiversidad",
      methods: [
        "Difusión en redes sociales",
        "Charlas presenciales y virtuales con profesionales capacitados",
        "Generar espacios de inclusión social, educativa y familiar",
        "Impulsar acciones públicas y privadas para la cultura del respeto",
      ],
    },
    {
      title: "Brindar apoyo emocional a padres con hijos neurodivergentes",
      methods: [
        "Reuniones de padres compartiendo vivencias",
        "Jornadas de capacitación con profesionales",
        "Capacitar a docentes de escuelas y colegios",
        "Charlas y capacitaciones presenciales o virtuales",
      ],
    },
    {
      title: "Crear un espacio de desarrollo integral con equipo multidisciplinario",
      methods: [
        "Centro con consultorios de psicología, fonoaudiología, terapia ocupacional, psicopedagogía, neurología, psiquiatría y nutrición",
        "Buscar organizaciones que apoyen la causa",
        "Generar ingresos con actividades para cubrir costos operativos",
        "Alianzas con instituciones públicas y privadas",
      ],
    },
  ],
};

export type TimelineItem = { year: string; title: string; text: string };

export const history: {
  id: string;
  title: string;
  lead: string;
  timeline: TimelineItem[];
} = {
  id: "historia",
  title: "Nuestra historia",
  lead: "Un viaje que nació del amor, la escucha y la comunidad. Desde 2023 acompañamos a familias neurodivergentes con información, apoyo y experiencias que generan inclusión real, y hoy estamos a un paso de inaugurar nuestro propio centro.",
  timeline: [
    {
      year: "2023",
      title: "Un gesto de amor que se volvió movimiento",
      text: "Impulsados por el amor, la esperanza y la unión de amigos y familiares, hicimos la primera actividad solidaria para cubrir las terapias de 1 niño con autismo.",
    },
    {
      year: "2024",
      title: "De 1 a 5 niños",
      text: "Extendimos la ayuda a 5 niños con diferentes condiciones neurodivergentes, dándoles acceso a terapias fundamentales para su desarrollo.",
    },
    {
      year: "2025",
      title: "23 niños con sus terapias",
      text: "Gracias al esfuerzo de voluntarios y familias comprometidas, hoy 23 niños reciben sus terapias: cambiamos realidades y generamos oportunidades.",
    },
    {
      year: "29 dic. 2025",
      title: "Somos Fundación ATYPICAL Paraguay",
      text: "Por el Decreto Nº 5216, firmado por el presidente de la República, se reconocieron nuestros estatutos sociales: la primera fundación neurodivergente del país.",
    },
    {
      year: "Hoy",
      title: "A un paso de nuestro propio centro",
      text: "Un espacio de apoyo, aprendizaje, desarrollo, contención y esperanza para muchas familias. Porque cuando una comunidad comprende, acompaña e incluye, transforma vidas.",
    },
  ],
};

export const historyPage: {
  title: string;
  lead: string;
  stats: { value: number; label: string; year: string }[];
  sections: { heading: string; paragraphs: string[] }[];
} = {
  title: "Nuestra historia",
  lead: "Un viaje que nació del amor, la escucha y la comunidad.",
  stats: [
    { value: 1, label: "niño con sus terapias cubiertas", year: "2023" },
    { value: 5, label: "niños con condiciones neurodivergentes", year: "2024" },
    { value: 23, label: "niños que hoy reciben sus terapias", year: "2025" },
  ],
  sections: [
    {
      heading: "2023: el comienzo",
      paragraphs: [
        "Nuestra historia comenzó en el año 2023, impulsada por el amor, la esperanza y la unión de amigos y familiares. La primera actividad solidaria se realizó con el objetivo de cubrir las terapias de 1 niño diagnosticado con autismo.",
        "Lo que empezó como un gesto de apoyo, se transformó en un movimiento lleno de compromiso y solidaridad.",
      ],
    },
    {
      heading: "2024: de 1 a 5 niños",
      paragraphs: [
        "En el año 2024, logramos extender esta ayuda a 5 niños con diferentes condiciones neurodivergentes, brindándoles acceso a terapias fundamentales para su desarrollo.",
      ],
    },
    {
      heading: "2025: 23 niños, y un decreto histórico",
      paragraphs: [
        "Para el año 2025, gracias al esfuerzo de muchas personas, voluntarios y familias comprometidas, alcanzamos a 23 niños que actualmente reciben sus terapias, cambiando realidades y generando oportunidades.",
        "El 29 de diciembre de 2025 marcó un momento histórico para nosotros: mediante el Decreto Nº 5216, firmado por el presidente de la República, se reconocieron nuestros estatutos sociales y oficialmente pasamos a ser la FUNDACIÓN ATYPICAL PARAGUAY, convirtiéndonos en la primera fundación neurodivergente del país.",
      ],
    },
    {
      heading: "Hoy: a un paso de nuestro centro",
      paragraphs: [
        "Hoy estamos a un paso de inaugurar nuestro propio centro, un espacio de apoyo, aprendizaje, desarrollo, contención y esperanza para muchas familias.",
        "Porque creemos que cuando una comunidad comprende, acompaña e incluye… transforma vidas. Sumate: juntos podemos hacer la diferencia.",
      ],
    },
  ],
};

export type BoardMember = { name: string; role: string; img: string };

export const board: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  president: BoardMember;
  vice: BoardMember;
  members: BoardMember[];
} = {
  id: "comision",
  kicker: "Comisión Directiva",
  title: "Quiénes lideran la fundación",
  lead: "Un equipo de familias y profesionales comprometidos con la causa de la neurodiversidad.",
  president: {
    name: "Carmen Adelaida Portillo Patiño",
    role: "Presidente",
    img: "/images/comision/presidente.webp",
  },
  vice: {
    name: "Christian David Viedman",
    role: "Vicepresidente",
    img: "/images/comision/vicepresidente.webp",
  },
  members: [
    { name: "David Tomás Vera", role: "Tesorero", img: "/images/comision/tesorero.webp" },
    { name: "Rocío Echeverría", role: "Protesorera", img: "/images/comision/protesorera.webp" },
    { name: "Noelia Elizabeth Rojas Ortiz", role: "Secretaria", img: "/images/comision/secretaria.webp" },
    { name: "Lic. Sergio Javier Morel Morel", role: "Administrador", img: "/images/comision/administrador.webp" },
    { name: "Nilsa González", role: "Consejera titular", img: "/images/comision/consejera.webp" },
  ],
};

export type ConsultingRoom = { name: string; description: string };
export type ProjectRender = { src: string; alt: string; label: string };

export const project: {
  id: string;
  title: string;
  lead: string;
  renders: ProjectRender[];
  plans: ProjectRender[];
  rooms: ConsultingRoom[];
  team: { title: string; text: string };
} = {
  id: "proyecto",
  title: "El proyecto: un centro de desarrollo integral",
  lead: "Un espacio propio, pensado con y para las familias, con siete servicios y un equipo multidisciplinario que acompaña a cada niño en su desarrollo.",
  renders: [
    {
      src: "/images/proyecto/render-terapia.webp",
      alt: "Render de la sala de terapia del centro, con un espacio de juego colorido donde una profesional acompaña a un niño",
      label: "Sala de terapia",
    },
    {
      src: "/images/proyecto/render-sensorial.webp",
      alt: "Render de la sala de integración sensorial, con columpios, colchonetas y elementos de motricidad",
      label: "Integración sensorial",
    },
    {
      src: "/images/proyecto/render-consultorio.webp",
      alt: "Render de un consultorio con pizarra, estanterías y materiales para el trabajo con niños",
      label: "Consultorio",
    },
    {
      src: "/images/proyecto/render-lectura.webp",
      alt: "Render del rincón de lectura, con estanterías arqueadas de colores y cojines",
      label: "Rincón de lectura",
    },
    {
      src: "/images/proyecto/render-materiales.webp",
      alt: "Render de la sala de materiales, con estanterías coloridas y mesa de trabajo",
      label: "Sala de materiales",
    },
  ],
  plans: [
    {
      src: "/images/proyecto/plano-predio.webp",
      alt: "Planta del predio del centro de desarrollo integral, con la ubicación del edificio",
      label: "Planta del predio",
    },
    {
      src: "/images/proyecto/plano-arquitectonico.webp",
      alt: "Planta arquitectónica del centro, con la distribución de los consultorios y espacios",
      label: "Planta arquitectónica",
    },
  ],
  rooms: [
    {
      name: "Psicología",
      description: "Contención emocional para niños y familias, fortaleciendo el bienestar y los vínculos.",
    },
    {
      name: "Fonoaudiología",
      description: "Apoyo a la comunicación, el lenguaje y el habla, respetando los tiempos y formas de cada persona.",
    },
    {
      name: "Terapia ocupacional",
      description: "Desarrollo de la autonomía, la integración sensorial y las habilidades de la vida diaria.",
    },
    {
      name: "Psicopedagogía",
      description: "Acompañamiento en los procesos de aprendizaje, con estrategias a la medida de cada niño.",
    },
    {
      name: "Neurología",
      description: "Evaluación y seguimiento del neurodesarrollo por profesionales especializados.",
    },
    {
      name: "Psiquiatría",
      description: "Atención de la salud mental, con un abordaje cuidadoso y en equipo con las familias.",
    },
    {
      name: "Nutrición",
      description: "Orientación alimentaria pensada para las necesidades y particularidades de cada niño.",
    },
  ],
  team: {
    title: "Nuestro plantel profesional",
    text: "Muy pronto vas a conocer al equipo de profesionales que acompañará a cada niño y a su familia en el centro.",
  },
};

export type EventItem = {
  title: string;
  description: string;
  accent: string;
  /** Portada del programa (opcional). Sin portada, la tarjeta rota fotos de la galería. */
  img?: string;
};

export const events: { id: string; title: string; items: EventItem[] } = {
  id: "eventos",
  title: "Eventos y programas",
  items: [
    {
      title: "Programa Neurodiversidad en Acción",
      img: "/images/programas/neurodiversidad-en-accion.webp",
      description:
        "Espacio de encuentro, aprendizaje y participación, donde la comunidad se une para visibilizar.",
      accent: "var(--color-spectrum-blue)",
    },
    {
      title: "Red de Apoyo",
      img: "/images/programas/red-de-apoyo.webp",
      description:
        "Espacio continuo de acompañamiento para familias y personas neurodivergentes en una comunidad de soporte.",
      accent: "var(--color-spectrum-teal)",
    },
    {
      title: "La Tiendita de Atypical",
      img: "/images/programas/la-tiendita.webp",
      description:
        "Mercado solidario con productos y apoyos que impulsan nuestra misión y generan oportunidades de empleo.",
      accent: "var(--color-spectrum-green)",
    },
    {
      title: "Lomiteada",
      description:
        "Encuentros creativos donde compartimos experiencias, recursos y actividades que fortalecen la inclusión.",
      accent: "var(--color-spectrum-orange)",
    },
    {
      title: "DIVERtite picoTEAndo",
      img: "/images/programas/divertite-picoteando.webp",
      description:
        "Nuestro evento anual más esperado, una verdadera fiesta familiar por la neurodiversidad.",
      accent: "var(--color-spectrum-purple)",
    },
    {
      title: "Atypical RUN 2026",
      description:
        "Una corrida que no es solo deportiva: es un espacio para generar conciencia, comunidad y oportunidades.",
      accent: "var(--color-spectrum-red)",
    },
  ],
};

/**
 * Actividades con inscripción.
 * Para CARGAR una actividad nueva: copiá un bloque y editá los campos.
 * La inscripción abre WhatsApp con un mensaje ya redactado (el sitio es
 * estático, sin backend). Si preferís un formulario propio (Google Forms,
 * etc.) para alguna actividad, poné su enlace en `formHref` y ese botón
 * llevará al formulario en vez de a WhatsApp.
 * `status: "open"` habilita el botón; `"soon"` lo muestra como “Próximamente”;
 * `"full"` como “Cupos llenos”.
 */
export type Activity = {
  id: string;
  title: string;
  description: string;
  date: string; // ej: "Sábado 4 de octubre, 2025"
  time: string; // ej: "09:00 a 11:30"
  modality: "Presencial" | "Virtual" | "Híbrida";
  location: string;
  seats?: string; // ej: "30 cupos" (opcional)
  accent: string;
  status?: "open" | "soon" | "full";
  formHref?: string; // opcional: formulario externo en vez de WhatsApp
};

export const activities: {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  items: Activity[];
} = {
  id: "actividades",
  kicker: "Sumate y participá",
  title: "Próximas actividades",
  lead: "Charlas, talleres y encuentros para toda la comunidad. Elegí la actividad que te interese e inscribite en un toque.",
  // Cargá acá las actividades (ver instructivo arriba). Ejemplo de un ítem:
  //   {
  //     id: "charla-neurodiversidad",
  //     title: "Charla: Entendiendo la neurodiversidad",
  //     description: "Descripción de la actividad...",
  //     date: "Sábado 4 de octubre, 2025",
  //     time: "09:00 a 11:00",
  //     modality: "Presencial",            // "Presencial" | "Virtual" | "Híbrida"
  //     location: "Asunción (sede a confirmar)",
  //     seats: "40 cupos",                 // opcional
  //     accent: "var(--color-spectrum-teal)",
  //     status: "open",                    // "open" | "soon" | "full"
  //   },
  items: [],
};

export const gallerySection = {
  id: "galeria",
  title: "Nuestra comunidad en acción",
  lead: "Momentos reales de nuestros eventos, donde la neurodiversidad se celebra en familia.",
} as const;

export const quote = {
  text: "Sueñe en grande, planee bien, sonría siempre y los milagros empezarán a suceder",
} as const;

export type Involvement = { title: string; text: string };

export const cta: {
  id: string;
  title: string;
  lead: string;
  ways: Involvement[];
} = {
  id: "contacto",
  title: "Unite a nuestra causa",
  lead: "Juntos podemos hacer la diferencia. Hay muchas formas de sumar.",
  ways: [
    {
      title: "Voluntariado",
      text: "Sumá tu tiempo y tus talentos a los encuentros, charlas y eventos de la comunidad.",
    },
    {
      title: "Donación",
      text: "Cada aporte impulsa el apoyo terapéutico y el sueño del centro de desarrollo integral.",
    },
    {
      title: "Alianzas",
      text: "Instituciones y empresas que quieran acompañar la causa y generar inclusión real.",
    },
  ],
};
