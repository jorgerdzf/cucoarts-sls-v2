import { Lang } from './copy';

// Textos del asistente de murales en español e inglés.
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
      { b: 'Proyecto administrado', s: 'Coordinamos boceto, tiempos, materiales y entrega para que el resultado y la experiencia sean increíbles, para ti y para el artista.' },
      { b: 'Factura si la necesitas', s: 'Todo formal y en orden, sin complicaciones.' },
    ],
  },
  proposito: {
    q: '¿Para qué es el mural?', hint: 'Elige la que más se acerque. No hay respuesta incorrecta.',
    o: { casa: { t: 'Para mi casa' }, regalo: { t: 'Un regalo' }, negocio: { t: 'Mi negocio o marca' }, institucion: { t: 'Institución o escuela' },
      evento: { t: 'Evento o festival' }, causa: { t: 'Causa o comunidad' }, nose: { t: 'Aún no lo sé', s: '¡También vale!' } } as Record<string, OptText>,
  },
  espacio: {
    q: '¿Dónde va a vivir?', hint: 'Esto nos ayuda a elegir materiales y artista.',
    lugar: { interior: { t: 'Interior', s: 'Sala, recámara, oficina, local' }, exterior: { t: 'Exterior', s: 'Fachada, barda, patio' }, indef: { t: 'Todavía no lo defino' } } as Record<string, OptText>,
    sizeTitle: 'Tamaño aproximado',
    tamano: { chico: { t: 'Pequeño', s: 'menos de 5 m²' }, mediano: { t: 'Mediano', s: '5 a 15 m²' }, grande: { t: 'Grande', s: '15 a 40 m²' },
      monumental: { t: 'Monumental', s: 'más de 40 m²' }, nose: { t: 'No sé', s: 'lo medimos juntos' } } as Record<string, OptText>,
    width: 'Ancho (m)', height: 'Alto (m)', optional: 'Opcional',
  },
  estilos: {
    q: '¿Qué estilos te gustan?', hint: 'Toca todos los que te llamen la atención. Usa el botón + para verlos en grande.',
    legendCuco: 'Artistas de la tienda CUCO ARTS', legendLocal: 'Artistas locales de Monterrey',
    count: '{n} elegido(s)', tagCuco: 'Artista CUCO ARTS', tagLocal: 'Artista local MTY', zoom: 'Ver en grande', cucoLabel: 'Mural de {a}, artista de la tienda CUCO ARTS', localLabel: 'Mural de artista local de Monterrey',
  },
  ambiente: {
    q: '¿Qué ambiente quieres crear?', hint: 'Elige las palabras que van con tu idea.',
    o: { colorido: { t: 'Colorido y alegre' }, sereno: { t: 'Sereno y natural' }, geometrico: { t: 'Geométrico' }, personajes: { t: 'Personajes y retratos' },
      cultura: { t: 'Cultura local y mexicana' }, abstracto: { t: 'Abstracto' }, byn: { t: 'Blanco y negro' }, animales: { t: 'Animales y naturaleza' },
      ninos: { t: 'Para niños' }, mensaje: { t: 'Con mensaje o letras' } } as Record<string, OptText>,
    idea: 'Cuéntanos tu idea (opcional)', ideaHint: '¿Qué te gustaría que cuente o transmita? ¿Hay algo que no quieras?',
    photos: 'Fotos del espacio (opcional)', photosHint: 'Fotos de la pared o del lugar. Hasta 4 de 5 MB.',
  },
  presupuesto: {
    q: '¿Qué presupuesto tienes en mente?', hint: 'Es una referencia para proponerte artistas que encajen. Lo afinamos juntos.',
    o: { p1: { t: 'Hasta $10,000' }, p2: { t: '$10,000 a $25,000' }, p3: { t: '$25,000 a $50,000' }, p4: { t: 'Más de $50,000' }, rec: { t: 'Recomiéndenme', s: 'no tengo idea' } } as Record<string, OptText>,
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
    head: 'Hola CUCO ARTS, quiero hacer un mural', nombre: 'Nombre', tel: 'WhatsApp', correo: 'Correo', zona: 'Zona', proposito: 'Para qué es', donde: 'Dónde', tamano: 'Tamaño',
    medidas: 'Medidas', estilos: 'Estilos que me gustaron', ambiente: 'Ambiente', presupuesto: 'Presupuesto', cuando: 'Para cuándo', factura: 'Factura', fotos: 'Fotos del espacio',
    news: 'Quiero recibir noticias', yes: 'Sí', no: 'No', idea: 'Mi idea', cucoSuffix: '(CUCO ARTS)', local: 'Local',
  },
  subject: 'Quiero un mural',
};

type MuralCopy = typeof es;

const en: MuralCopy = {
  stepOf: 'Step {n} of {t}',
  before: 'Before we start',
  nav: { back: '← Back', start: 'Start →', next: 'Next →', send: 'Send my request' },
  intro: {
    q: 'How we help you',
    hint: "We're the bridge between your idea and local talent.",
    values: [
      { b: 'The right artist for you', s: 'We suggest CUCO ARTS artists and artists from the local community based on the style you like and your budget.' },
      { b: 'No searching on your own', s: "We already know the community and have worked with many of them; we save you the research." },
      { b: 'Managed project', s: 'We coordinate the sketch, timing, materials and delivery so the result and the experience are great, for you and for the artist.' },
      { b: 'Invoice if you need it', s: 'Everything formal and in order, no hassle.' },
    ],
  },
  proposito: {
    q: 'What is the mural for?', hint: 'Pick the closest one. There are no wrong answers.',
    o: { casa: { t: 'For my home' }, regalo: { t: 'A gift' }, negocio: { t: 'My business or brand' }, institucion: { t: 'Institution or school' },
      evento: { t: 'Event or festival' }, causa: { t: 'Cause or community' }, nose: { t: "I don't know yet", s: "That's fine too!" } },
  },
  espacio: {
    q: 'Where will it live?', hint: 'This helps us choose materials and the artist.',
    lugar: { interior: { t: 'Indoors', s: 'Living room, bedroom, office, shop' }, exterior: { t: 'Outdoors', s: 'Facade, wall, patio' }, indef: { t: "I haven't decided" } },
    sizeTitle: 'Approximate size',
    tamano: { chico: { t: 'Small', s: 'under 5 m²' }, mediano: { t: 'Medium', s: '5 to 15 m²' }, grande: { t: 'Large', s: '15 to 40 m²' },
      monumental: { t: 'Monumental', s: 'over 40 m²' }, nose: { t: 'Not sure', s: "we'll measure together" } },
    width: 'Width (m)', height: 'Height (m)', optional: 'Optional',
  },
  estilos: {
    q: 'Which styles do you like?', hint: 'Tap every one that catches your eye. Use the + button to see them larger.',
    legendCuco: 'CUCO ARTS store artists', legendLocal: 'Local artists from Monterrey',
    count: '{n} chosen', tagCuco: 'CUCO ARTS artist', tagLocal: 'Local artist MTY', zoom: 'View larger', cucoLabel: 'Mural by {a}, CUCO ARTS store artist', localLabel: 'Mural by a local artist from Monterrey',
  },
  ambiente: {
    q: 'What mood do you want to create?', hint: 'Choose the words that go with your idea.',
    o: { colorido: { t: 'Colorful and joyful' }, sereno: { t: 'Calm and natural' }, geometrico: { t: 'Geometric' }, personajes: { t: 'Characters and portraits' },
      cultura: { t: 'Local and Mexican culture' }, abstracto: { t: 'Abstract' }, byn: { t: 'Black and white' }, animales: { t: 'Animals and nature' },
      ninos: { t: 'For kids' }, mensaje: { t: 'With a message or lettering' } },
    idea: 'Tell us your idea (optional)', ideaHint: 'What would you like it to tell or convey? Is there anything you do not want?',
    photos: 'Photos of the space (optional)', photosHint: 'Photos of the wall or the place. Up to 4 of 5 MB.',
  },
  presupuesto: {
    q: 'What budget do you have in mind?', hint: "It's a reference so we can suggest artists that fit. We'll fine-tune it together.",
    o: { p1: { t: 'Up to $10,000' }, p2: { t: '$10,000 to $25,000' }, p3: { t: '$25,000 to $50,000' }, p4: { t: 'Over $50,000' }, rec: { t: 'Recommend me', s: 'no idea' } },
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
    head: "Hi CUCO ARTS, I'd like a mural", nombre: 'Name', tel: 'WhatsApp', correo: 'Email', zona: 'Area', proposito: 'What it is for', donde: 'Where', tamano: 'Size',
    medidas: 'Measurements', estilos: 'Styles I liked', ambiente: 'Mood', presupuesto: 'Budget', cuando: 'By when', factura: 'Invoice', fotos: 'Photos of the space',
    news: "I'd like to receive news", yes: 'Yes', no: 'No', idea: 'My idea', cucoSuffix: '(CUCO ARTS)', local: 'Local',
  },
  subject: 'I want a mural',
};

export const MURAL: Record<Lang, MuralCopy> = { es, en };
export type { MuralCopy };
