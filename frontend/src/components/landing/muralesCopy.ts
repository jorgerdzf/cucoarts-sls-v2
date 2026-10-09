import { Lang } from './copy';

/* Textos de la página cucoarts.com/murales (y /en/murals): argumentos para hacer un mural, trayectoria y portafolio de proyectos.
   El asistente en sí vive en MuralWizard (muralCopy.ts); las fotos en muralesPhotos.ts (generado).

   PROJECTS: proyectos reales de CUCO ARTS, escritos con lo que contó Roberto (2026-10-08). Para sumar uno agrega un objeto aquí y sus
   fotos en muralesPhotos.ts. Cada proyecto lleva uno o varios "papeles" (RoleKey), el mismo vocabulario en todas las fichas:
   producimos · conectamos · gestionamos · documentamos · impulsamos. `video` puede ser de YouTube (se carga solo al pulsar
   "Ver video", con youtube-nocookie) o un enlace externo (TikTok). Los artistas llevan su Instagram.
   Datos que NO se publican: comisiones, tarifas ni presupuestos. */

export type RoleKey = 'produce' | 'connect' | 'manage' | 'document' | 'drive';
export type Person = { name: string; ig: string };
export type Video = { kind: 'youtube'; id: string } | { kind: 'link'; url: string; label: Record<Lang, string> };
export type Status = 'done' | 'ongoing' | 'proposed';
type Txt = { title: string; text: string; role: string; why: string; tags: string[]; extra?: string };

export type Project = {
  id: string;                       // también es la clave en muralesPhotos.ts
  status: Status;
  roles: RoleKey[];
  brand: string;
  color: string;                    // color de la tarjeta cuando no hay foto
  logo?: { src: string; bg: 'light' | 'dark' };   // logotipo (ruta bajo /public/murales/logos/) y color de la placa donde se ve bien
  when?: string;
  artists: Person[];
  collab?: Person;                  // colaborador del proyecto (no es el artista)
  video?: Video;
  link?: { url: string; label: Record<Lang, string> };
  es: Txt;
  en: Txt;
};

const ig = (h: string) => 'https://www.instagram.com/' + h + '/';

/* De más reciente a más antiguo; el proyecto propuesto (aún sin pintar) va aparte, al final. */
export const PROJECTS: Project[] = [
  {
    id: 'servimascota',
    status: 'done',
    roles: ['manage'],
    brand: 'Servimascota (NUPEC) · San Nicolás',
    logo: { src: '/murales/logos/servimascota.png', bg: 'light' },
    color: '#F7D649',
    when: '2021',
    artists: [{ name: 'Wale González y Claudette Rosas', ig: ig('wc_nobathrooms') }],
    video: { kind: 'link', url: 'https://www.tiktok.com/@cucoarts.mx/video/7211256002514111750', label: { es: 'Ver video en TikTok', en: 'Watch the video on TikTok' } },
    es: {
      title: 'Cortina metálica de colores',
      text: 'Un gato y un perro pop art cubren la cortina del negocio sobre un fondo magenta con su marca.',
      role: 'Elegimos al artista, supervisamos el boceto y presentamos 3 opciones con presupuesto. También el cobro y la factura.',
      why: 'El servicio completo, de la idea a la factura.',
      tags: ['Negocio', 'Cortina metálica', 'Aerosol', '3 días de trabajo'],
    },
    en: {
      title: 'A colourful roll-up shutter',
      text: 'A pop-art cat and dog cover the shop’s shutter over a magenta background with its brand.',
      role: 'We chose the artist, supervised the sketch and presented 3 options with budgets. Billing and invoice too.',
      why: 'The full service, from idea to invoice.',
      tags: ['Business', 'Roll-up shutter', 'Spray paint', '3 working days'],
    },
  },
  {
    id: 'grillteam',
    status: 'ongoing',
    roles: ['connect', 'document'],
    brand: 'Grill Team · Monterrey',
    logo: { src: '/murales/logos/grillteam.png', bg: 'light' },
    color: '#EA663D',
    when: '2020',
    artists: [{ name: 'Silvestre Madera', ig: ig('silvestre.madera') }],
    video: { kind: 'youtube', id: 'vUhiwi0Qa3U' },
    es: {
      title: 'Un patio que sigue creciendo',
      text: 'Los muros de un patio de restaurante se cubrieron de amarillo y de personajes dibujados a mano.',
      role: 'Fui a hablar con el dueño y le recomendé artistas de confianza; eligió a Silvestre. Documentamos el proceso.',
      why: 'Sigue activo: el artista sigue sumando personajes y trabaja otros proyectos visuales con la empresa.',
      tags: ['Restaurante', 'Muros de patio', 'Proyecto activo'],
    },
    en: {
      title: 'A courtyard that keeps growing',
      text: 'The walls of a restaurant courtyard were covered in yellow and hand-drawn characters.',
      role: 'I talked to the owner in person and recommended artists I trust; he chose Silvestre. We documented the process.',
      why: 'Still active: the artist keeps adding characters and works on other visual projects with the company.',
      tags: ['Restaurant', 'Courtyard walls', 'Ongoing'],
    },
  },
  {
    id: 'citadel',
    status: 'done',
    roles: ['produce'],
    brand: 'Plaza Citadel · San Nicolás',
    logo: { src: '/murales/logos/citadel.png', bg: 'dark' },
    color: '#067DFF',
    when: 'Julio 2019',
    artists: [{ name: 'Jaaska', ig: ig('jaaskauno') }],
    video: { kind: 'youtube', id: 'LW2WOXrn8C0' },
    es: {
      title: '«Vive el arte»: pintar con el público',
      text: 'Mural en vivo con música. Al terminar el trazo, Jaaska invitó al público a pintar con aerosol y les enseñó cómo.',
      role: 'Organizamos el evento con el departamento de marketing de la plaza: equipo prestado por la FAMUS (UANL), House of DJ y la banda HarrysonFord.',
      why: 'La gente dejó de mirar y pintó. Se hizo sin costo, en todos los sentidos.',
      tags: ['Plaza comercial', 'Evento en vivo', 'Participación del público'],
    },
    en: {
      title: '“Vive el arte”: painting with the public',
      text: 'A live mural with music. Once the outline was done, Jaaska invited the public to paint with spray cans and showed them how.',
      role: 'We organised the event with the plaza’s marketing team: equipment lent by FAMUS (UANL), House of DJ and the band HarrysonFord.',
      why: 'People stopped watching and painted. It was free in every sense.',
      tags: ['Shopping plaza', 'Live event', 'Public participation'],
    },
  },
  {
    id: 'via-cordillera',
    status: 'done',
    roles: ['produce'],
    brand: 'Vía Cordillera · Monterrey',
    logo: { src: '/murales/logos/via-cordillera.png', bg: 'dark' },
    color: '#C7F74E',
    when: 'Junio 2019',
    artists: [{ name: 'Jaaska', ig: ig('jaaskauno') }, { name: 'Josafk', ig: ig('josafk') }, { name: 'Inthegente', ig: ig('inthegente') }],
    collab: { name: 'Murall', ig: ig('wearemurall') },
    video: { kind: 'youtube', id: '6qACKTO95eI' },
    es: {
      title: 'Tres artistas, un festival',
      text: 'En un festival de murales y exposiciones, pintamos en vivo una barda y un gabinete urbano.',
      role: 'Con Murall armamos un espacio de contenido e invitamos a los artistas. Cerramos con un recorrido.',
      why: 'Varios estilos distintos pintando elementos cotidianos de la ciudad.',
      tags: ['Festival', 'Desarrollo urbano', 'Pintura en vivo'],
    },
    en: {
      title: 'Three artists, one festival',
      text: 'At a festival of murals and exhibitions, we painted live on a wall and an urban utility box.',
      role: 'With Murall we set up a content space and invited the artists. We closed with a walk-through.',
      why: 'Several different styles painting everyday elements of the city.',
      tags: ['Festival', 'Urban development', 'Live painting'],
    },
  },
  {
    id: 'nuevo-sur',
    status: 'done',
    roles: ['manage', 'produce'],
    brand: 'Plaza Nuevo Sur · Monterrey',
    logo: { src: '/murales/logos/nuevo-sur.png', bg: 'light' },
    color: '#F7D649',
    when: 'Abril 2019',
    artists: [{ name: 'Jaaska', ig: ig('jaaskauno') }],
    video: { kind: 'youtube', id: '8V5km_Xq8xM' },
    es: {
      title: 'De un estacionamiento gris a 3D, y nuestro primer mural en vivo',
      text: 'Dos proyectos en la plaza: un estacionamiento de unos 50 metros que pasó de gris a estructuras 3D, y un mural en vivo durante un evento.',
      role: 'Gestionamos la colaboración con la plaza y construimos el muro de tablaroca para el mural en vivo.',
      why: 'El mural en vivo fue nuestro primer intento y costó más con poco público; de ahí aprendimos lo que luego funcionó en Citadel.',
      tags: ['Plaza comercial', 'Estacionamiento ≈ 50 m', 'Mural en vivo'],
    },
    en: {
      title: 'From a grey car park to 3D, and our first live mural',
      text: 'Two projects at the plaza: a car park of about 50 metres that went from grey to 3D structures, and a live mural during an event.',
      role: 'We managed the collaboration with the plaza and built the drywall wall for the live mural.',
      why: 'The live mural was our first try and was harder with a small crowd; we learned what later worked at Citadel.',
      tags: ['Shopping plaza', 'Car park ≈ 50 m', 'Live mural'],
    },
  },
  {
    id: 'tacos-pena',
    status: 'done',
    roles: ['document'],
    brand: 'Mural en Cumbres · Monterrey',
    color: '#067DFF',
    when: 'Abril 2019',
    artists: [{ name: 'Jaaska', ig: ig('jaaskauno') }],
    video: { kind: 'youtube', id: 'ZZ7qoqS0A1I' },
    es: {
      title: 'La barda de una taquería',
      text: 'Buscamos un lugar que necesitara mantenimiento; el dueño de una taquería nos dio el visto bueno para pintar su barda trasera.',
      role: 'Encontramos el muro, conseguimos el permiso y grabamos toda la jornada, de 5 a. m. a 7 p. m.',
      why: 'Un mural de principio a fin en un solo día. Nuestra primera vez documentándolo así.',
      tags: ['Negocio', 'Barda', 'Una jornada', 'Video del proceso'],
    },
    en: {
      title: 'The back wall of a taco shop',
      text: 'We looked for a place in need of upkeep; the owner of a taco shop gave us the go-ahead to paint his back wall.',
      role: 'We found the wall, got the permission and filmed the whole day, from 5 a.m. to 7 p.m.',
      why: 'A mural from start to finish in a single day. Our first time documenting one like this.',
      tags: ['Business', 'Wall', 'One day', 'Process video'],
    },
  },
  {
    id: 'la-fuente',
    status: 'proposed',
    roles: ['drive'],
    brand: 'Parque La Fuente · Guadalupe, N.L.',
    color: '#C7F74E',
    artists: [],
    link: { url: 'https://www.instagram.com/urbanhfest/', label: { es: 'Modelo de referencia: @urbanhfest', en: 'Reference model: @urbanhfest' } },
    es: {
      title: 'La Fuente Street Art Project',
      text: 'Propuesta de murales comunitarios alrededor del Parque La Fuente: 9 muros numerados y varios «muros extra», hoy blancos o rayados.',
      role: 'Hoy: convencer a los vecinos de darnos los permisos y encontrar artistas. Empezaríamos con un mural e iríamos sumando muros.',
      why: 'Probar el impacto de los espacios coloridos en la conservación del barrio y en la sensibilización de los niños. Aún no se ha pintado ningún muro.',
      tags: ['Proyecto en gestión', 'Comunidad', '9 muros + extras'],
      extra: '¿Eres artista, vecino o una marca que quiere apoyar un muro? Escríbenos.',
    },
    en: {
      title: 'La Fuente Street Art Project',
      text: 'A proposal for community murals around La Fuente Park: 9 numbered walls and several “extra walls”, currently blank or tagged.',
      role: 'Today: convincing the neighbours to grant permission and finding artists. We would start with one mural and add walls over time.',
      why: 'To test the impact of colourful spaces on the upkeep of the neighbourhood and on raising awareness among children. No wall has been painted yet.',
      tags: ['Project in progress', 'Community', '9 walls + extras'],
      extra: 'Are you an artist, a neighbour or a brand that wants to back a wall? Write to us.',
    },
  },
];

const es = {
  hero: { cta: 'Quiero mi mural', cta2: 'Ver proyectos' },
  why: {
    label: 'Para negocios, casas e instituciones',
    title: '¿Por qué un mural?',
    lede: 'Un muro puede ser solo un muro, o lo más recordado de tu espacio.',
    items: [
      { b: 'Se convierte en tu seña', s: 'Un mural es lo primero que se ve y lo que se recuerda. Hace que tu fachada o tu local sea fácil de reconocer y de encontrar.' },
      { b: 'Contenido que se comparte solo', s: 'La gente se detiene, se toma fotos y las comparte. Cada foto lleva tu marca o tu espacio por la ciudad, sin depender de anuncios.' },
      { b: 'Obra única, hecha para ti', s: 'No es un diseño repetido: es una obra original, pintada a mano por un artista local, pensada para tu muro y tu historia.' },
      { b: 'Cultura y comunidad', s: 'Trabajar con artistas de Monterrey cuenta una historia de comunidad que refuerza tu identidad y apoya al talento de tu ciudad.' },
    ],
  },
  exp: {
    label: 'Nuestra experiencia',
    title: 'Creatividad con un propósito',
    lede: 'Detonamos la creatividad y la dirigimos a lo que necesitas: dar identidad a un negocio, animar un evento o transformar un barrio.',
    steps: [
      { y: '2019', b: 'Producimos', s: 'Murales en vivo y eventos en plazas y festivales.' },
      { y: '2020', b: 'Conectamos', s: 'Presentamos a las marcas artistas de confianza.' },
      { y: '2021', b: 'Gestionamos', s: 'De la idea a la factura: artista, boceto, opciones y cobro.' },
      { y: 'Hoy', b: 'Impulsamos', s: 'Proyectos para barrios, con vecinos, artistas y marcas.' },
    ],
  },
  roles: { produce: 'Producimos', connect: 'Conectamos', manage: 'Gestionamos', document: 'Documentamos', drive: 'Impulsamos' } as Record<RoleKey, string>,
  projects: {
    label: 'Portafolio',
    title: 'Proyectos',
    lede: 'Somos el puente entre marcas y artistas locales. Estos son proyectos que hemos coordinado.',
    role: 'Nuestro papel',
    why: 'Lo interesante',
    artist: 'Artista',
    artists: 'Artistas',
    collab: 'En colaboración con',
    video: 'Ver video',
    closeVideo: 'Cerrar video',
    openYT: 'Abrir en YouTube',
    gallery: 'Ver fotos',
    photos: 'fotos',
    status: { done: 'Realizado', ongoing: 'Proyecto activo', proposed: 'En gestión' },
    mail: 'Escríbenos',
    yours: { title: 'El siguiente puede ser el tuyo', text: 'Cuéntanos tu idea y te conectamos con el artista indicado.', cta: 'Crear mi mural' },
  },
  gallery: {
    label: 'En imágenes',
    title: 'Color, gente y proceso',
    lede: 'Cada visita muestra una selección distinta.',
    all: 'Todo', tagNames: { proceso: 'Proceso', vivo: 'En vivo', personas: 'Personas', resultado: 'Resultado', antes: 'Antes' } as Record<string, string>,
    more: 'Ver más', less: 'Mostrar menos', count: '{n} de {t}',
    lb: { close: 'Cerrar', prev: 'Anterior', next: 'Siguiente', of: 'de', cartel: 'Cartel del evento' },
  },
  how: {
    label: 'Cómo trabajamos',
    title: 'Nosotros nos encargamos',
    steps: [
      { b: 'Tu idea', s: 'Respondes unas preguntas sencillas: para qué es, dónde va, qué estilos te gustan y tu presupuesto.' },
      { b: 'El artista ideal', s: 'Te proponemos artistas de CUCO ARTS y de la comunidad local según tu estilo y presupuesto.' },
      { b: 'Boceto y tiempos', s: 'Coordinamos el boceto, los materiales y las fechas para que el proceso sea claro desde el inicio.' },
      { b: 'Mural terminado', s: 'Acompañamos la ejecución y la entrega. Si necesitas factura, también la gestionamos.' },
    ],
  },
  wizard: { label: 'Empieza aquí', title: 'Cuéntanos tu idea', lede: 'Son unos pasos cortos y no tienes que saber de arte. Al final nos lo envías y te respondemos.' },
};

const en: typeof es = {
  hero: { cta: 'I want my mural', cta2: 'See projects' },
  why: {
    label: 'For businesses, homes and institutions',
    title: 'Why a mural?',
    lede: 'A wall can be just a wall, or the most remembered part of your space.',
    items: [
      { b: 'It becomes your landmark', s: 'A mural is the first thing people see and the one they remember. It makes your storefront or venue easy to recognise and to find.' },
      { b: 'Content that shares itself', s: 'People stop, take photos and share them. Every photo carries your brand or your space around the city, without relying on ads.' },
      { b: 'A one-of-a-kind piece, made for you', s: 'Not a repeated design: an original work, hand-painted by a local artist, made for your wall and your story.' },
      { b: 'Culture and community', s: 'Working with Monterrey artists tells a story of community that strengthens your identity and supports your city’s talent.' },
    ],
  },
  exp: {
    label: 'Our experience',
    title: 'Creativity with a purpose',
    lede: 'We spark creativity and point it at what you need: giving a business identity, bringing an event to life or transforming a neighbourhood.',
    steps: [
      { y: '2019', b: 'We produce', s: 'Live murals and events at plazas and festivals.' },
      { y: '2020', b: 'We connect', s: 'We introduce brands to artists we trust.' },
      { y: '2021', b: 'We manage', s: 'From idea to invoice: artist, sketch, options and billing.' },
      { y: 'Today', b: 'We drive', s: 'Neighbourhood projects with neighbours, artists and brands.' },
    ],
  },
  roles: { produce: 'We produce', connect: 'We connect', manage: 'We manage', document: 'We document', drive: 'We drive' } as Record<RoleKey, string>,
  projects: {
    label: 'Portfolio',
    title: 'Projects',
    lede: 'We are the bridge between brands and local artists. These are projects we have coordinated.',
    role: 'Our role',
    why: 'Why it matters',
    artist: 'Artist',
    artists: 'Artists',
    collab: 'In collaboration with',
    video: 'Watch video',
    closeVideo: 'Close video',
    openYT: 'Open on YouTube',
    gallery: 'See photos',
    photos: 'photos',
    status: { done: 'Completed', ongoing: 'Ongoing', proposed: 'In progress' },
    mail: 'Write to us',
    yours: { title: 'The next one could be yours', text: 'Tell us your idea and we will connect you with the right artist.', cta: 'Create my mural' },
  },
  gallery: {
    label: 'In pictures',
    title: 'Colour, people and process',
    lede: 'Each visit shows a different selection.',
    all: 'All', tagNames: { proceso: 'Process', vivo: 'Live', personas: 'People', resultado: 'Result', antes: 'Before' } as Record<string, string>,
    more: 'See more', less: 'Show less', count: '{n} of {t}',
    lb: { close: 'Close', prev: 'Previous', next: 'Next', of: 'of', cartel: 'Event poster' },
  },
  how: {
    label: 'How we work',
    title: 'We take care of it',
    steps: [
      { b: 'Your idea', s: 'You answer a few simple questions: what it is for, where it goes, which styles you like and your budget.' },
      { b: 'The right artist', s: 'We suggest CUCO ARTS and local community artists based on your style and budget.' },
      { b: 'Sketch and timing', s: 'We coordinate the sketch, materials and dates so the process is clear from the start.' },
      { b: 'Finished mural', s: 'We support the painting and the handover. If you need an invoice, we handle that too.' },
    ],
  },
  wizard: { label: 'Start here', title: 'Tell us your idea', lede: 'It takes a few short steps and you do not need to know about art. At the end you send it to us and we reply.' },
};

export const MURALES = { es, en };
