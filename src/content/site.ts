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
  footer: "© 2026 Fundación ATYPICAL Py · Neurodiversidad · Hecho con 💙",
} as const;

export type NavLink = { label: string; href: string };

export const nav: NavLink[] = [
  { label: "Sobre Nosotros", href: "#sobre-nosotros" },
  { label: "Misión y Visión", href: "#mision-vision" },
  { label: "Objetivos", href: "#objetivos" },
  { label: "Nuestra historia", href: "#historia" },
  { label: "Proyecto", href: "#proyecto" },
  { label: "Eventos", href: "#eventos" },
  { label: "Contacto", href: "#contacto" },
];

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
        "Centro con 3 consultorios (terapia ocupacional, fonoaudiología, psicología)",
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
  lead: "Un viaje que nació del amor, la escucha y la comunidad. Desde su origen, Atypical Py busca acompañar a familias neurodivergentes con información, apoyo y experiencias que generan inclusión real. Nuestro camino combina educación, empatía y acción comunitaria.",
  timeline: [
    {
      year: "El origen",
      title: "Nace del amor y la escucha",
      text: "Un grupo de familias de personas neurodivergentes se une para transformar la vivencia personal en apoyo comunitario.",
    },
    {
      year: "Comunidad",
      title: "Primeros encuentros",
      text: "Reuniones, charlas y jornadas empiezan a tejer una red de acompañamiento entre familias, docentes y profesionales.",
    },
    {
      year: "Acción",
      title: "Eventos que visibilizan",
      text: "Picoteando por Lean, DiverTITE PicoTEAndo y más: espacios que combinan educación, empatía y fiesta por la neurodiversidad.",
    },
    {
      year: "El futuro",
      title: "Un centro de desarrollo integral",
      text: "El sueño de un espacio propio con equipo multidisciplinario para acompañar a cada niño desde la edad temprana.",
    },
  ],
};

export const historyPage: {
  title: string;
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
} = {
  title: "Nuestra historia",
  lead: "Un viaje que nació del amor, la escucha y la comunidad.",
  sections: [
    {
      heading: "El comienzo: del amor a la acción",
      paragraphs: [
        "Atypical Py nació de la vivencia de familias que, ante un diagnóstico, no encontraron en su entorno la información, el acompañamiento ni la empatía que necesitaban. En vez de resignarse, decidieron transformar esa experiencia en comunidad.",
        "Lo que empezó como un grupo de padres y madres compartiendo dudas y esperanzas se convirtió en una red que hoy acompaña a muchas otras familias que transitan el mismo camino.",
      ],
    },
    {
      heading: "Escuchar antes que etiquetar",
      paragraphs: [
        "Desde el principio entendimos que la neurodiversidad no es un problema a corregir, sino una forma distinta —y valiosa— de percibir y habitar el mundo. Un diagnóstico no es un pronóstico de vida: con los apoyos adecuados, cada persona puede alcanzar logros significativos.",
        "Por eso nuestro trabajo se apoya en tres pilares: educar, acompañar y visibilizar. Educar a padres, docentes y comunidad; acompañar emocionalmente a las familias; y visibilizar las condiciones neurodivergentes para construir una cultura del respeto.",
      ],
    },
    {
      heading: "Comunidad en acción",
      paragraphs: [
        "Con el tiempo, los encuentros se multiplicaron. Charlas, jornadas de capacitación y eventos como Picoteando por Lean y DiverTITE PicoTEAndo se volvieron espacios donde la neurodiversidad se celebra en familia, sin miedo y sin prejuicios.",
        "Cada evento es también una forma de sostener la causa: generar conciencia, tejer alianzas y abrir oportunidades para las personas neurodivergentes y sus familias.",
      ],
    },
    {
      heading: "Hacia el futuro: un centro propio",
      paragraphs: [
        "Nuestro sueño más grande es un centro de desarrollo integral con un equipo multidisciplinario —terapia ocupacional, fonoaudiología y psicología— que acompañe a cada niño desde la edad temprana.",
        "Ese centro será posible con el apoyo de personas, instituciones y empresas que crean, como nosotros, que la inclusión plena no es una utopía, sino una construcción colectiva. Sumate: juntos podemos hacer la diferencia.",
      ],
    },
  ],
};

export type ConsultingRoom = { name: string; description: string };
export type ProjectRender = { src: string; alt: string; label: string };

export const project: {
  id: string;
  title: string;
  lead: string;
  renders: ProjectRender[];
  rooms: ConsultingRoom[];
} = {
  id: "proyecto",
  title: "El proyecto: un centro de desarrollo integral",
  lead: "Un espacio propio, pensado con y para las familias, con un equipo multidisciplinario que acompaña a cada niño en su desarrollo.",
  renders: [
    {
      src: "/images/proyecto/render-frontal.webp",
      alt: "Render arquitectónico de la vista frontal del centro de desarrollo integral",
      label: "Vista frontal",
    },
    {
      src: "/images/proyecto/render-lateral.webp",
      alt: "Render arquitectónico de la vista lateral del centro de desarrollo integral",
      label: "Vista lateral",
    },
    {
      src: "/images/proyecto/render-panoramica.webp",
      alt: "Render arquitectónico de la vista panorámica del centro de desarrollo integral",
      label: "Vista panorámica",
    },
  ],
  rooms: [
    {
      name: "Terapia ocupacional",
      description:
        "Acompañamiento para el desarrollo de la autonomía, la integración sensorial y las habilidades de la vida diaria.",
    },
    {
      name: "Fonoaudiología",
      description:
        "Apoyo a la comunicación, el lenguaje y el habla, respetando los tiempos y formas de cada persona.",
    },
    {
      name: "Psicología",
      description:
        "Contención emocional para niños y familias, fortaleciendo el bienestar y los vínculos.",
    },
  ],
};

export type EventItem = {
  title: string;
  description: string;
  accent: string;
};

export const events: { id: string; title: string; items: EventItem[] } = {
  id: "eventos",
  title: "Eventos y programas",
  items: [
    {
      title: "Programa Neurodiversidad en Acción",
      description:
        "Espacio de encuentro, aprendizaje y participación, donde la comunidad se une para visibilizar.",
      accent: "var(--color-spectrum-blue)",
    },
    {
      title: "Red de Apoyo",
      description:
        "Espacio continuo de acompañamiento para familias y personas neurodivergentes en una comunidad de soporte.",
      accent: "var(--color-spectrum-teal)",
    },
    {
      title: "La Tiendita de Atypical",
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
      title: "DiverTITE PicoTEAndo",
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
