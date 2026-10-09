import { Lang } from './copy';

// Textos del asistente de arte por encargo ("Tu obra, a tu manera") en español e inglés.
type OptText = { t: string; s?: string };

const es = {
  stepOf: 'Paso {n} de {t}',
  before: 'Antes de empezar',
  nav: { back: '← Atrás', start: 'Empezar →', next: 'Siguiente →', send: 'Enviar mi solicitud' },
  intro: {
    q: 'Así te ayudamos',
    hint: 'Somos el puente entre tu idea y el talento local.',
    values: [
      { b: 'El artista ideal para ti', s: 'Te proponemos artistas de CUCO ARTS y de la comunidad local según el estilo que te guste y tu presupuesto.' },
      { b: 'Sin buscar por tu cuenta', s: 'Ya conocemos a la comunidad y hemos trabajado con muchos de ellos; te ahorramos la investigación.' },
      { b: 'Proyecto administrado', s: 'Coordinamos la propuesta, los tiempos y la entrega para que el resultado y la experiencia sean increíbles, para ti y para el artista.' },
      { b: 'Factura si la necesitas', s: 'Todo formal y en orden, sin complicaciones.' },
    ],
  },
  proposito: {
    q: '¿Para qué es la obra?', hint: 'Elige la que más se acerque. No hay respuesta incorrecta.',
    o: { casa: { t: 'Para mi casa' }, regalo: { t: 'Un regalo' }, retrato: { t: 'Un retrato', s: 'de una persona o familia' }, mascota: { t: 'Mi mascota' },
      negocio: { t: 'Mi negocio u oficina' }, coleccion: { t: 'Para mi colección' }, nose: { t: 'Aún no lo sé', s: '¡También vale!' } } as Record<string, OptText>,
  },
  obra: {
    q: '¿Qué tipo de obra te imaginas?', hint: 'Si no estás seguro, elige “Aún no lo sé” y te orientamos.',
    tipo: { pintura: { t: 'Pintura', s: 'óleo, acrílico, acuarela' }, dibujo: { t: 'Dibujo', s: 'lápiz, carbón, tinta' }, ilustracion: { t: 'Ilustración', s: 'a mano o digital' },
      grabado: { t: 'Grabado o estampa', s: 'linograbado, serigrafía' }, nose: { t: 'Aún no lo sé', s: 'recomiéndenme' } } as Record<string, OptText>,
    sizeTitle: 'Tamaño aproximado (lado más largo)',
    tamano: { chico: { t: 'Pequeño', s: 'hasta 30 cm' }, mediano: { t: 'Mediano', s: '30 a 60 cm' }, grande: { t: 'Grande', s: '60 a 100 cm' },
      xl: { t: 'Muy grande', s: 'más de 1 m' }, nose: { t: 'No sé', s: 'lo definimos juntos' } } as Record<string, OptText>,
    width: 'Ancho (cm)', height: 'Alto (cm)', optional: 'Opcional', frame: 'Quiero la obra enmarcada',
  },
  estilos: {
    q: '¿Qué estilos te gustan?', hint: 'Toca todos los que te llamen la atención; el nombre del artista aparece al elegirlos. Usa el botón + para verlos en grande.',
    legendCuco: 'Artistas de la tienda CUCO ARTS', legendLocal: 'Artistas locales de Monterrey',
    count: '{n} elegido(s)', tagCuco: 'Artista CUCO ARTS', tagLocal: 'Artista local MTY', zoom: 'Ver en grande', cucoLabel: 'Obra de {a}, artista de la tienda CUCO ARTS', localLabel: 'Obra de artista local de Monterrey',
    more: 'Ver más obras',
    credit: '¿Ves una obra tuya?', creditCta: 'Pide crédito, asigna autoría o contáctanos', creditSubj: 'Crédito de autoría en la galería', creditRef: 'Referencia', creditBody: 'Hola CUCO ARTS, creo que esta obra de su galería es mía.\n\nMi nombre:\nMi usuario de Instagram:\nQuisiera: (escribe una opción) que se me dé crédito / que la retiren / que me contacten',
  },
  ambiente: {
    q: '¿Qué ambiente quieres crear?', hint: 'Elige las palabras que van con tu idea.',
    o: { colorido: { t: 'Colorido y alegre' }, sereno: { t: 'Sereno y natural' }, realista: { t: 'Realista y detallado' }, abstracto: { t: 'Abstracto' },
      geometrico: { t: 'Geométrico' }, retrato: { t: 'Retratos y personajes' }, cultura: { t: 'Cultura local y mexicana' }, animales: { t: 'Animales y naturaleza' },
      byn: { t: 'Blanco y negro' }, onirico: { t: 'Onírico y fantástico' } } as Record<string, OptText>,
    idea: 'Cuéntanos tu idea (opcional)', ideaHint: '¿Qué te gustaría que cuente o transmita? ¿Hay algo que no quieras?',
    photos: 'Fotos de referencia (opcional)', photosHint: 'Una foto de la persona, la mascota o el espacio donde irá. Hasta 4 de 5 MB.',
  },
  presupuesto: {
    q: '¿Qué presupuesto tienes en mente?', hint: 'Es una referencia para proponerte artistas que encajen. Lo afinamos juntos.',
    o: { p1: { t: 'Hasta $5,000' }, p2: { t: '$5,000 a $10,000' }, p3: { t: '$10,000 a $20,000' }, p4: { t: 'Más de $20,000' }, rec: { t: 'Recomiéndenme', s: 'no tengo idea' } } as Record<string, OptText>,
    whenTitle: '¿Para cuándo?',
    cuando: { pronto: { t: 'Lo antes posible' }, meses: { t: 'En 1 a 2 meses' }, despues: { t: 'Más adelante' }, fecha: { t: 'Tengo una fecha' } } as Record<string, OptText>,
    date: 'Fecha', invoice: 'Necesito factura',
  },
  contacto: {
    q: '¡Último paso! ¿Cómo te contactamos?', hint: 'Te escribimos con una propuesta de artistas y los siguientes pasos.',
    name: 'Nombre', phone: 'WhatsApp', email: 'Correo', zone: 'Ciudad o colonia', zoneHint: 'Monterrey, San Pedro…',
    news: 'Quiero recibir noticias de artistas y proyectos (opcional)', consentPre: 'Al enviar aceptas el',
    errName: 'Escribe tu nombre para saber a quién responder.', errPhone: 'Revisa tu WhatsApp: necesitamos un número de 10 dígitos.',
  },
  sum: {
    head: 'Hola CUCO ARTS, quiero una obra por encargo', nombre: 'Nombre', tel: 'WhatsApp', correo: 'Correo', zona: 'Zona', proposito: 'Para qué es', tipo: 'Tipo de obra', tamano: 'Tamaño',
    medidas: 'Medidas', marco: 'Enmarcada', estilos: 'Obras que me gustaron', ambiente: 'Ambiente', presupuesto: 'Presupuesto', cuando: 'Para cuándo', factura: 'Factura', fotos: 'Fotos de referencia',
    news: 'Quiero recibir noticias', yes: 'Sí', no: 'No', idea: 'Mi idea', cucoSuffix: '(CUCO ARTS)', local: 'Local',
  },
  subject: 'Quiero una obra por encargo',
};

type ObraCopy = typeof es;

const en: ObraCopy = {
  stepOf: 'Step {n} of {t}',
  before: 'Before we start',
  nav: { back: '← Back', start: 'Start →', next: 'Next →', send: 'Send my request' },
  intro: {
    q: 'How we help you',
    hint: "We're the bridge between your idea and local talent.",
    values: [
      { b: 'The right artist for you', s: 'We suggest CUCO ARTS artists and artists from the local community based on the style you like and your budget.' },
      { b: 'No searching on your own', s: 'We already know the community and have worked with many of them; we save you the research.' },
      { b: 'Managed project', s: 'We coordinate the proposal, timing and delivery so the result and the experience are great, for you and for the artist.' },
      { b: 'Invoice if you need it', s: 'Everything formal and in order, no hassle.' },
    ],
  },
  proposito: {
    q: 'What is the artwork for?', hint: 'Pick the closest one. There are no wrong answers.',
    o: { casa: { t: 'For my home' }, regalo: { t: 'A gift' }, retrato: { t: 'A portrait', s: 'of a person or family' }, mascota: { t: 'My pet' },
      negocio: { t: 'My business or office' }, coleccion: { t: 'For my collection' }, nose: { t: "I don't know yet", s: "That's fine too!" } },
  },
  obra: {
    q: 'What kind of artwork do you imagine?', hint: "If you're not sure, choose “I don't know yet” and we'll guide you.",
    tipo: { pintura: { t: 'Painting', s: 'oil, acrylic, watercolor' }, dibujo: { t: 'Drawing', s: 'pencil, charcoal, ink' }, ilustracion: { t: 'Illustration', s: 'by hand or digital' },
      grabado: { t: 'Print', s: 'linocut, screen print' }, nose: { t: "I don't know yet", s: 'recommend me' } },
    sizeTitle: 'Approximate size (longest side)',
    tamano: { chico: { t: 'Small', s: 'up to 30 cm' }, mediano: { t: 'Medium', s: '30 to 60 cm' }, grande: { t: 'Large', s: '60 to 100 cm' },
      xl: { t: 'Very large', s: 'over 1 m' }, nose: { t: 'Not sure', s: "we'll decide together" } },
    width: 'Width (cm)', height: 'Height (cm)', optional: 'Optional', frame: 'I want it framed',
  },
  estilos: {
    q: 'Which styles do you like?', hint: 'Tap every one that catches your eye; the artist’s name shows once you pick it. Use the + button to see them larger.',
    legendCuco: 'CUCO ARTS store artists', legendLocal: 'Local artists from Monterrey',
    count: '{n} chosen', tagCuco: 'CUCO ARTS artist', tagLocal: 'Local artist MTY', zoom: 'View larger', cucoLabel: 'Artwork by {a}, CUCO ARTS store artist', localLabel: 'Artwork by a local artist from Monterrey',
    more: 'See more artworks',
    credit: 'See your own artwork?', creditCta: 'Ask for credit, assign authorship or contact us', creditSubj: 'Authorship credit in the gallery', creditRef: 'Reference', creditBody: 'Hi CUCO ARTS, I believe this artwork in your gallery is mine.\n\nMy name:\nMy Instagram handle:\nI would like: (type one) to be credited / to have it removed / to be contacted',
  },
  ambiente: {
    q: 'What mood do you want to create?', hint: 'Choose the words that go with your idea.',
    o: { colorido: { t: 'Colorful and joyful' }, sereno: { t: 'Calm and natural' }, realista: { t: 'Realistic and detailed' }, abstracto: { t: 'Abstract' },
      geometrico: { t: 'Geometric' }, retrato: { t: 'Portraits and characters' }, cultura: { t: 'Local and Mexican culture' }, animales: { t: 'Animals and nature' },
      byn: { t: 'Black and white' }, onirico: { t: 'Dreamlike and fantasy' } },
    idea: 'Tell us your idea (optional)', ideaHint: 'What would you like it to tell or convey? Is there anything you do not want?',
    photos: 'Reference photos (optional)', photosHint: 'A photo of the person, the pet or the space where it will go. Up to 4 of 5 MB.',
  },
  presupuesto: {
    q: 'What budget do you have in mind?', hint: "It's a reference so we can suggest artists that fit. We'll fine-tune it together.",
    o: { p1: { t: 'Up to $5,000' }, p2: { t: '$5,000 to $10,000' }, p3: { t: '$10,000 to $20,000' }, p4: { t: 'Over $20,000' }, rec: { t: 'Recommend me', s: 'no idea' } },
    whenTitle: 'By when?',
    cuando: { pronto: { t: 'As soon as possible' }, meses: { t: 'In 1 to 2 months' }, despues: { t: 'Later on' }, fecha: { t: 'I have a date' } },
    date: 'Date', invoice: 'I need an invoice',
  },
  contacto: {
    q: 'Last step! How do we contact you?', hint: "We'll write to you with a proposal of artists and the next steps.",
    name: 'Name', phone: 'WhatsApp', email: 'Email', zone: 'City or neighborhood', zoneHint: 'Monterrey, San Pedro…',
    news: 'I would like to receive news about artists and projects (optional)', consentPre: 'By submitting you accept the',
    errName: 'Please type your name so we know who to reply to.', errPhone: 'Check your WhatsApp: we need a 10-digit number.',
  },
  sum: {
    head: "Hi CUCO ARTS, I'd like a custom artwork", nombre: 'Name', tel: 'WhatsApp', correo: 'Email', zona: 'Area', proposito: 'What it is for', tipo: 'Type of artwork', tamano: 'Size',
    medidas: 'Measurements', marco: 'Framed', estilos: 'Artworks I liked', ambiente: 'Mood', presupuesto: 'Budget', cuando: 'By when', factura: 'Invoice', fotos: 'Reference photos',
    news: "I'd like to receive news", yes: 'Yes', no: 'No', idea: 'My idea', cucoSuffix: '(CUCO ARTS)', local: 'Local',
  },
  subject: 'I want a custom artwork',
};

export const OBRA: Record<Lang, ObraCopy> = { es, en };
export type { ObraCopy };
