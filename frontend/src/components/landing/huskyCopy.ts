import { Lang } from './copy';

/* Textos de cucoarts.com/husky (ES / EN).
   Fuentes: "Descripcion artistica.pdf" y "Fichas tecnicas.pdf" (HUSKY STGO/PROMO), doc. "Documental Cultura local",
   póster POP-UP y registro de participación del photowalk. Las semblanzas en inglés son las de las fichas de la exposición;
   la versión en español es traducción de CUCO ARTS. */

const es = {
  htmlTitle: 'CUCO ARTS × HUSKY · La ciudad más allá de los estadios',
  nav: { home: 'Inicio', store: 'Tienda', label: 'Secciones' },
  hero: {
    cornerL: 'CUCOARTS × HUSKY CAFÉ', cornerR: 'SANTIAGO, N.L.',
    title: 'La ciudad más allá de los estadios',
    lede: 'Exposición temporal de arte local dentro de HUSKY Coffee Shop. Pide un café, recorre la galería y llévate arte a casa.',
    cta: 'Ver la obra en la tienda', cta2: 'Conoce el proyecto',
    stamp: ['EN', 'EXHIBICIÓN'],
    galleryLabel: 'Fotografías de la exposición en HUSKY',
  },
  credit: 'Foto: CUCO ARTS · HUSKY Coffee Shop',
  concept: {
    label: 'El concepto',
    title: 'Una mirada a la cultura local, desde Santiago',
    p1: 'Esta pequeña exposición es un vistazo a la idea detrás de CUCO ARTS y nuestra tienda de arte en línea: compartir la cultura de Monterrey y su área metropolitana como una forma de conectar con personas de todo el mundo a través del arte.',
    p2: 'Cada artista representa un fragmento distinto de nuestra identidad local —sus calles, barrios, memorias, contrastes y energía creativa— que juntos son una invitación a descubrir la ciudad más allá de los estadios, a través de los ojos de quienes viven y crean aquí.',
    p3: 'El proyecto nació con motivo del Mundial, ante la alta afluencia de visitantes extranjeros y la inquietud de mostrar a un público interesado una mirada de nuestra cultura local a través del arte. Reúne a una plataforma artística y a un expendio y taller de café de especialidad en un pueblo mágico.',
    dataTitle: 'Datos',
    data: [
      ['Lugar', 'HUSKY Coffee Shop · Morelos 302, Santiago, N.L. 67310'],
      ['Entrada', 'Libre'],
      ['Formato', 'Exposición temporal · venta de arte original'],
      ['Inauguración', 'Jueves 25 de junio de 2026'],
      ['Zona cultural', 'Sur · Santiago, N.L.'],
      ['Estado', 'En exhibición'],
    ] as string[][],
    map: 'Cómo llegar',
  },
  place: {
    label: 'El lugar',
    title: 'HUSKY Coffee Shop',
    p1: 'HUSKY es un taller de tueste y expendio de café en Nuevo León, que investiga café mexicano desde 2018 y trabaja lotes de acceso limitado.',
    p2: 'Es un espacio de convivencia: la gente suele ir a platicar, tomar un cafecito o trabajar los fines de semana. Aquí, en sus paredes, viven las obras de la exposición.',
    ig: 'Su Instagram', logoAlt: 'Logotipo de HUSKY Coffee Shop',
  },
  artists: {
    label: 'Artistas',
    title: 'Quiénes exponen',
    lede: 'Artistas locales cuya obra ya forma parte de la tienda de CUCO ARTS. Cada uno cuenta un fragmento distinto de la ciudad.',
    bio: 'Semblanza',
    shop: 'Ver su obra en la tienda',
  },
  works: {
    label: 'En la tienda',
    title: 'Obra expuesta que puedes llevarte',
    lede: 'Estas piezas estuvieron en las paredes de HUSKY y hoy forman parte del catálogo de la tienda en línea.',
    available: 'Disponible', sold: 'Ya encontró casa',
    view: 'Ver en la tienda', viewSold: 'Ver la obra',
    note: 'Precio y disponibilidad al 6 de octubre de 2026; la tienda es la fuente oficial y puede cambiar. Algunas obras de la exposición son piezas únicas que no están en la tienda en línea.',
    framed: 'Con marco',
  },
  dynamics: {
    label: 'Dinámicas culturales',
    title: 'Más que una exposición',
    lede: 'Alrededor de la muestra organizamos encuentros con la comunidad creativa local.',
    cards: [
      { tag: '01', h: 'Photowalk', p: 'Un recorrido fotográfico por Santiago, con la plaza principal como escenario, junto a fotógrafas y fotógrafos locales. Cada quien miró el mismo lugar con ojos distintos.' },
      { tag: '02', h: 'Entrevistas', p: 'Conversaciones con artistas y fotógrafos sobre su oficio, su ciudad y lo que significa crear en Monterrey hoy.' },
    ],
    peopleTitle: 'Quienes participaron en el photowalk y las entrevistas',
    photosLabel: 'Fotografías del photowalk', photosNote: 'Una selección distinta cada vez que abres la página.', photoBy: 'Foto',
  },
  doc: {
    label: 'Documental',
    title: 'Documental en preparación',
    p1: 'Una exposición es efímera: reúne piezas durante un tiempo limitado en un lugar determinado, y la experiencia de cada persona que la visita es única.',
    p2: 'A través del documental queremos ahondar en cada arista de este proyecto: los artistas, los fotógrafos, la cafetería y el pueblo mágico donde se vive la cultura que ofrecemos a quien nos visita.',
    badge: 'PRÓXIMAMENTE · FALL 2026',
    stamp: ['FALL', '2026'],
  },
  cta: {
    title: 'Llévate un pedazo de Monterrey',
    text: 'Conoce el catálogo completo en la tienda en línea de CUCO ARTS, con envíos a todo el mundo.',
    shop: 'Visitar la tienda', home: 'Volver a CUCO ARTS',
  },
  alt: {
    p1: 'Pintura de formas doradas y una naranja sobre fondo morado, junto a un plato decorado y la barra de café de HUSKY',
    p2: 'Pinturas de un dragón y de una ciudad fantástica en la pared de entrada de HUSKY, junto a un pizarrón con carteles',
    p3: 'Pintura circular de mariposas y nopales sobre la barra de HUSKY, junto a un café',
  },
};

const en: typeof es = {
  htmlTitle: 'CUCO ARTS × HUSKY · The city beyond the stadiums',
  nav: { home: 'Home', store: 'Store', label: 'Sections' },
  hero: {
    cornerL: 'CUCOARTS × HUSKY CAFÉ', cornerR: 'SANTIAGO, N.L.',
    title: 'The city beyond the stadiums',
    lede: 'A temporary exhibition of local art inside HUSKY Coffee Shop. Grab a coffee, enjoy the gallery, and take some art home with you.',
    cta: 'See the art in the store', cta2: 'Discover the project',
    stamp: ['ON', 'VIEW'],
    galleryLabel: 'Photographs of the exhibition at HUSKY',
  },
  credit: 'Photo: CUCO ARTS · HUSKY Coffee Shop',
  concept: {
    label: 'The concept',
    title: 'A glimpse of local culture, from Santiago',
    p1: 'This small exhibition is a glimpse into the idea behind CUCO ARTS and our online art store: sharing the culture of Monterrey and its metropolitan area as a way to connect with people from around the world through art.',
    p2: 'Each artist represents a different fragment of our local identity — its streets, neighborhoods, memories, contrasts and creative energy — coming together as an invitation to discover the city beyond the stadiums, through the eyes of those who live and create here.',
    p3: 'The project was born around the World Cup, with the large number of foreign visitors in the city and our wish to show an interested audience a view of our local culture through art. It brings together an art platform and a specialty coffee shop and roastery in a pueblo mágico.',
    dataTitle: 'Details',
    data: [
      ['Place', 'HUSKY Coffee Shop · Morelos 302, Santiago, N.L. 67310'],
      ['Entry', 'Free'],
      ['Format', 'Temporary exhibition · original art for sale'],
      ['Opening', 'Thursday, June 25, 2026'],
      ['Cultural zone', 'South · Santiago, N.L.'],
      ['Status', 'On view'],
    ],
    map: 'Get directions',
  },
  place: {
    label: 'The place',
    title: 'HUSKY Coffee Shop',
    p1: 'HUSKY is a coffee roastery and shop in Nuevo León that has researched Mexican coffee since 2018 and works with limited-access lots.',
    p2: 'It is a place to gather: people usually come to chat, have a coffee, or work on the weekends. Here, on its walls, hang the works of the exhibition.',
    ig: 'Their Instagram', logoAlt: 'HUSKY Coffee Shop logo',
  },
  artists: {
    label: 'Artists',
    title: 'Who is exhibiting',
    lede: 'Local artists whose work is already part of the CUCO ARTS store. Each one tells a different fragment of the city.',
    bio: 'Bio',
    shop: 'See their work in the store',
  },
  works: {
    label: 'In the store',
    title: 'Exhibited work you can take home',
    lede: 'These pieces hung on the walls of HUSKY and are now part of the online store catalog.',
    available: 'Available', sold: 'Found a home',
    view: 'View in the store', viewSold: 'View the artwork',
    note: 'Price and availability as of October 6, 2026; the store is the official source and may change. Some works in the exhibition are one-of-a-kind pieces that are not in the online store.',
    framed: 'Framed',
  },
  dynamics: {
    label: 'Cultural activities',
    title: 'More than an exhibition',
    lede: 'Around the show we organized gatherings with the local creative community.',
    cards: [
      { tag: '01', h: 'Photowalk', p: 'A photo walk through Santiago, with the main plaza as its stage, alongside local photographers. Each of them looked at the same place through different eyes.' },
      { tag: '02', h: 'Interviews', p: 'Conversations with artists and photographers about their craft, their city, and what it means to create in Monterrey today.' },
    ],
    peopleTitle: 'Who took part in the photowalk and interviews',
    photosLabel: 'Photowalk photographs', photosNote: 'A different selection every time you open the page.', photoBy: 'Photo',
  },
  doc: {
    label: 'Documentary',
    title: 'Documentary in production',
    p1: 'An exhibition is ephemeral: it gathers pieces for a limited time in a specific place, and every visitor’s experience is unique.',
    p2: 'Through the documentary we want to explore every side of this project: the artists, the photographers, the coffee shop, and the pueblo mágico where the culture we share with visitors is lived.',
    badge: 'COMING SOON · FALL 2026',
    stamp: ['FALL', '2026'],
  },
  cta: {
    title: 'Take a piece of Monterrey home',
    text: 'Explore the full catalog in the CUCO ARTS online store, with shipping worldwide.',
    shop: 'Visit the store', home: 'Back to CUCO ARTS',
  },
  alt: {
    p1: 'Painting of golden shapes and an orange on a purple background, next to a decorated plate and the HUSKY coffee bar',
    p2: 'Paintings of a dragon and a fantasy city on the HUSKY entrance wall, next to a bulletin board with posters',
    p3: 'Round painting of butterflies and prickly pear cacti on the HUSKY counter, next to a coffee',
  },
};

export const HK: Record<Lang, typeof es> = { es, en };

/* Semblanzas (fichas técnicas de la exposición). Solo las artistas y los artistas con ficha. */
export const BIOS: Record<string, Record<Lang, string>> = {
  ana: {
    es: 'Ana Ahedo es una artista plástica cuya obra nace de lo íntimo: la memoria, la familia y la necesidad de expresar lo que no siempre puede decirse con palabras. Creció viendo pintar a su madre y a su padre y hoy, además de producir obra, dirige su propio taller de dibujo y pintura. Fascinada por el retrato y el detalle —las arrugas, las manos, la luz sobre la piel—, suele representarse a sí misma junto a símbolos como el león, en piezas que responden a un momento específico de su vida.',
    en: 'Ana Ahedo is a visual artist whose work springs from the intimate: memory, family, and the need to express what cannot always be put into words. She grew up watching her mother and father paint and today, besides making her own work, she runs her own drawing and painting studio. Fascinated by portraiture and detail—wrinkles, hands, light on skin—she often portrays herself alongside symbols such as the lion, in pieces that respond to a specific moment in her life.',
  },
  correoppola: {
    es: 'Correoppola empezó dibujando para escapar de la rutina de oficina y terminó descubriendo que dibujar también conecta. Sus ilustraciones, impresas en risografía —una técnica por capas de colores vibrantes—, son como un «greatest hits» emocional: momentos y etapas de su vida, desde hacer las paces con la ansiedad hasta un homenaje a su época de baterista. Su trabajo ha llegado a flyers, portadas, merch y libros infantiles.',
    en: 'Correoppola began drawing to escape the office routine and ended up discovering that drawing also connects. His illustrations, printed in risograph—a layered technique with vibrant colors—are like an emotional “greatest hits”: moments and stages of his life, from making peace with anxiety to a tribute to his days as a drummer. His work has reached flyers, album covers, merch, and children’s books.',
  },
  greometria: {
    es: 'Greometría es un artista regiomontano que pinta desde la intuición: color, textura y buena vibra. Su obra parte de los muestrarios de pintura, que dejó de ver como referencia para usarlos como materia, y sobre ellos dibuja con ejercicios rápidos de apenas segundos. Tras más de dos décadas en museografía, entiende el arte desde ambos lados: el montaje y la creación.',
    en: 'Greometría is an artist from Monterrey who paints from intuition: color, texture, and good vibes. His work starts from paint swatch charts, which he stopped seeing as reference and began using as material, drawing over them with quick exercises lasting only seconds. After more than two decades in museography, he understands art from both sides: installation and creation.',
  },
  porras: {
    es: 'Ilustrador y diseñador regio. Su trabajo se mueve entre la ilustración comercial, el arte digital y la exploración análoga con técnicas como tinta china, acrílico, acuarela y risografía. Su obra destaca por el uso consciente del color, la experimentación técnica y una mirada que cruza cultura visual, deporte, manga, diseño y vida cotidiana en Monterrey.',
    en: 'Illustrator and designer from Monterrey. His work moves between commercial illustration, digital art, and analog exploration with techniques such as India ink, acrylic, watercolor, and risograph. His work stands out for its conscious use of color, technical experimentation, and a view that crosses visual culture, sports, manga, design, and everyday life in Monterrey.',
  },
  romualdo: {
    es: 'Romualdo Castañeda, nacido en 1952, es un pintor autodidacta que entiende la pintura como un acto íntimo y continuo, arraigado más en el oficio que en la idealización del arte. Radicado en Monterrey desde 1973, su desarrollo artístico ha sido moldeado por el entorno, la luz y las condiciones propias del norte de México, elementos que dialogan constantemente con su proceso creativo.',
    en: 'Romualdo Castañeda, born in 1952, is a self-taught painter who approaches painting as a deeply intimate and continuous act—one rooted more in craftsmanship than in the idealization of art. Based in Monterrey since 1973, his artistic development has been profoundly shaped by the region’s environment, light, and the distinctive conditions of northern Mexico, elements that remain in constant dialogue with his creative process.',
  },
  eliezer: {
    es: 'Originario de Monterrey, Eliezer crea una obra profundamente ligada a la identidad local, la vida cotidiana y las emociones humanas. Su práctica combina observaciones de la ciudad —sus parques, mercados, montañas, arquitectura y comunidades— con una mirada optimista que transforma experiencias comunes en narrativas visuales llenas de color y significado.',
    en: 'Originally from Monterrey, Eliezer creates work that is deeply connected to local identity, everyday life, and human emotions. His practice combines observations of the city—its parks, markets, mountains, architecture, and communities—with an optimistic perspective that transforms ordinary experiences into visual narratives rich in color and meaning.',
  },
  tankez: {
    es: 'Tankez77 surge de los stickers, los esténciles y la calle como narradora del malestar emocional. Su práctica no se funda en la técnica ni en una formación académica, sino en la necesidad: una urgencia por expresar lo que no podía decirse en voz alta.',
    en: 'Tankez77 emerges from stickers, stencils, and the street as a narrator of emotional discomfort. His practice is rooted neither in technique nor in academic training, but in necessity—an urgent need to express what could not be spoken aloud.',
  },
  salvador: {
    es: 'La obra de Salvador recorre paisajes, cielos, océanos, montañas y entornos naturales que no son un escape de la realidad, sino una manera de relacionarse con ella más a fondo. Sus pinturas nacen de un juego dinámico de movimiento, contraste y equilibrio —calma y caos, belleza y melancolía, luz y sombra—. En lugar de transformar lo que observa, lo filtra a través de su propia sensibilidad, creando composiciones profundamente personales y universalmente resonantes.',
    en: 'Salvador’s work traverses landscapes, skies, oceans, mountains, and natural environments that do not serve as an escape from reality, but as a means of engaging with it more profoundly. His paintings are shaped by a dynamic interplay of movement, contrast, and balance—calm and chaos, beauty and melancholy, light and shadow. Rather than transforming what he observes, Salvador filters it through his own sensibility, creating compositions that are both deeply personal and universally resonant.',
  },
  chema: {
    es: 'Chema Chapa descubrió la pintura más tarde en la vida, pero pronto encontró en ella una fuente de calma, concentración y realización personal. Lo que empezó como curiosidad se volvió una práctica diaria y una parte esencial de su rutina.',
    en: 'Chema Chapa discovered painting later in life, but quickly found in it a source of calm, focus, and personal fulfillment. What began as curiosity soon became a daily practice and an essential part of his routine.',
  },
  dario: {
    es: 'Para Darío, el arte nunca fue una búsqueda lejana. Creció viendo a su padre pintar retratos familiares, convirtiendo recuerdos y ausencias en imágenes duraderas. Casi sin darse cuenta, el dibujo se tejió en su vida: primero como juego, luego como práctica diaria y, finalmente, como una manera de darle sentido al mundo que lo rodea.',
    en: 'For Darío, art was never a distant pursuit. He grew up watching his father paint family portraits, turning memories and absences into enduring images. Almost unconsciously, drawing became woven into the fabric of his life—first as a form of play, then as a daily practice, and ultimately as a way of making sense of the world around him.',
  },
  mizael: {
    es: 'Mizael Valero encontró el camino al arte mucho antes de tener las palabras para definirlo. Desde pequeño, dibujar fue una forma natural de relacionarse con el mundo: dinosaurios en el preescolar, personajes de Cartoon Network en la primaria, anime en la adolescencia y, más tarde, una exploración cada vez más personal del color, la figura humana, la naturaleza y el simbolismo.',
    en: 'Mizael Valero found his way to art long before he had the words to define it. From an early age, drawing became a natural way of engaging with the world: dinosaurs in preschool, Cartoon Network characters in elementary school, anime during his teenage years, and, later, an increasingly personal exploration of color, the human figure, nature, and symbolism.',
  },
  jhosh: {
    es: 'Para Jhosh Mata, el arte comenzó como un ejercicio de observación. A los diez años, sentado frente a su tío con solo una libreta y una pluma, decidió intentar algo distinto: reproducir exactamente lo que veía. Ese momento marcó el descubrimiento de un talento que pronto se volvería una vocación de toda la vida.',
    en: 'For Jhosh Mata, art began as an exercise in observation. At the age of ten, sitting across from his uncle with nothing more than a notebook and a pen, he decided to try something different: to reproduce exactly what he saw. That moment marked the discovery of a talent that would soon grow into a lifelong vocation.',
  },
};

/* Obra expuesta que hoy está en la tienda (Base Maestra V1, verificado en store.cucoarts.com el 6-oct-2026). */
export type Work = {
  id: string; img: string; w: number; h: number; artist: string; title: string; price: number; available: boolean; handle: string;
  es: { tech: string; alt: string }; en: { tech: string; alt: string };
};
export const WORKS: Work[] = [
  { id: 'OBRA-220', img: 'obra-220', w: 900, h: 900, artist: 'Romualdo Castañeda', title: 'Ventana al Cerro de la silla', price: 3500, available: true, handle: 'ventana-al-cerro-de-la-silla-painting',
    es: { tech: 'Técnica mixta sobre placa de fibrocemento · 55.3 × 40.5 cm', alt: 'Paisaje de otoño con árboles naranjas que enmarcan una montaña verde' },
    en: { tech: 'Mixed media on fiber cement board · 55.3 × 40.5 cm', alt: 'Autumn landscape with orange trees framing a green mountain' } },
  { id: 'OBRA-252', img: 'obra-252', w: 900, h: 900, artist: 'Tankez77', title: 'Ya no te quiere', price: 500, available: true, handle: 'ya-no-te-quiere-mx-original-painting',
    es: { tech: 'Plumón acrílico sobre papel kraft · 21.5 × 17 cm · con marco', alt: 'Ilustración de un aloe en una maceta con letras rosas, en un marco magenta' },
    en: { tech: 'Acrylic marker on craft paper · 21.5 × 17 cm · framed', alt: 'Illustration of an aloe in a pot with pink lettering, in a magenta frame' } },
  { id: 'OBRA-013', img: 'obra-013', w: 900, h: 676, artist: 'Chema Chapa', title: 'Ártico', price: 2000, available: true, handle: 'paisaje-nevado-mx-original-framed-painting',
    es: { tech: 'Óleo sobre tela · 53.5 × 43.5 cm · con marco', alt: 'Paisaje de montañas nevadas y un lago bajo un cielo turquesa y gris' },
    en: { tech: 'Oil on canvas · 53.5 × 43.5 cm · framed', alt: 'Landscape of snowy mountains and a lake under a turquoise and gray sky' } },
  { id: 'OBRA-228', img: 'obra-228', w: 900, h: 900, artist: 'Salvador López', title: 'Abstracción 2', price: 3000, available: true, handle: 'abstraccion-2-mx-original-painting',
    es: { tech: 'Óleo sobre tela · Ø 40 cm', alt: 'Pintura circular de flores color coral entre pinceladas verdes y azules' },
    en: { tech: 'Oil on canvas · Ø 40 cm', alt: 'Round painting of coral flowers among green and blue brushstrokes' } },
  { id: 'OBRA-230', img: 'obra-230', w: 900, h: 900, artist: 'Salvador López', title: 'Abstracción 4', price: 3000, available: true, handle: 'abstraccion-4-mx-original-painting',
    es: { tech: 'Óleo sobre tela · Ø 40 cm', alt: 'Pintura circular de flores rosas con empaste grueso' },
    en: { tech: 'Oil on canvas · Ø 40 cm', alt: 'Round painting of pink flowers in thick impasto' } },
  { id: 'OBRA-236', img: 'obra-236', w: 900, h: 900, artist: 'Salvador López', title: 'Nenúfares X', price: 7000, available: false, handle: 'nenufares-x-mx-original-painting',
    es: { tech: 'Óleo sobre tela · 60 × 60 cm', alt: 'Pintura de nenúfares rosas sobre agua turquesa y azul' },
    en: { tech: 'Oil on canvas · 60 × 60 cm', alt: 'Painting of pink water lilies on turquoise and blue water' } },
];

/* Artistas que terminaron exponiendo (confirmado por Roberto el 6-oct-2026). `vendor` = nombre en Shopify. */
export type HArtist = { id: string; name: string; vendor: string; bio?: string; art: { src: string; w: number; h: number; title?: string; es: string; en: string } };
export const ARTISTS: HArtist[] = [
  { id: 'ana', name: 'Ana Ahedo', vendor: 'Ana Ahedo', bio: 'ana', art: { src: '/landing-pool/ahedo-76.jpg', w: 1000, h: 1000, es: 'Mujer de rojo y un león subiendo una escalinata hacia torres de roca', en: 'Woman in red and a lion climbing a staircase toward rock towers' } },
  { id: 'chema', name: 'Chema Chapa', vendor: 'Chema Chapa', bio: 'chema', art: { src: '/husky/obra-013.jpg', w: 900, h: 676, title: 'Ártico', es: 'Paisaje de montañas nevadas y un lago bajo un cielo turquesa y gris', en: 'Landscape of snowy mountains and a lake under a turquoise and gray sky' } },
  { id: 'correoppola', name: 'Correoppola', vendor: 'Correoppola', bio: 'correoppola', art: { src: '/landing-pool/correoppola-1.jpg', w: 751, h: 1000, es: 'Ilustración amarilla con un personaje y rayos negros', en: 'Yellow illustration with a character and black rays' } },
  { id: 'dario', name: 'Darío Diario', vendor: 'Dario Diario', bio: 'dario', art: { src: '/landing-pool/dario-diario-2.jpg', w: 1000, h: 1000, es: 'Grabado de un rostro con casco dorado', en: 'Print of a face with a golden helmet' } },
  { id: 'eliezer', name: 'Eliezer Blanco', vendor: 'Eliezer Blanco', bio: 'eliezer', art: { src: '/landing-pool/eliezer-blanco-3.jpg', w: 1000, h: 1000, es: 'Calavera de colores sobre fondo amarillo y rosa', en: 'Colorful skull on a yellow and pink background' } },
  { id: 'greometria', name: 'Greometría', vendor: 'Greometria', bio: 'greometria', art: { src: '/landing-pool/gre2-64.jpg', w: 1000, h: 1000, es: 'Pintura circular de una figura y peces con puntos sobre fondo turquesa', en: 'Circular painting of a figure and fish with dots on a turquoise background' } },
  { id: 'jhosh', name: 'Jhosh Mata', vendor: 'Jhoseph Mata', bio: 'jhosh', art: { src: '/landing-pool/jhoseph-mata-3.jpg', w: 1000, h: 1000, es: 'Pintura de un pavorreal', en: 'Painting of a peacock' } },
  { id: 'mizael', name: 'Mizael Valero', vendor: 'Mizael Valero', bio: 'mizael', art: { src: '/landing-pool/mizael-valero-2.jpg', w: 1000, h: 1000, es: 'Mariposa naranja sobre fondo azul', en: 'Orange butterfly on a blue background' } },
  { id: 'porras', name: 'Porras Visual', vendor: 'Porras Visual', bio: 'porras', art: { src: '/landing-pool/porras-visual-1.jpg', w: 1000, h: 1000, es: 'Araña metálica con ojos azules sobre fondo naranja', en: 'Metallic spider with blue eyes on an orange background' } },
  { id: 'romualdo', name: 'Romualdo Castañeda', vendor: 'Romualdo Castañeda', bio: 'romualdo', art: { src: '/husky/obra-220.jpg', w: 900, h: 900, title: 'Ventana al Cerro de la silla', es: 'Paisaje de otoño con árboles naranjas que enmarcan una montaña verde', en: 'Autumn landscape with orange trees framing a green mountain' } },
  { id: 'salvador', name: 'Salvador López', vendor: 'Salvador López', bio: 'salvador', art: { src: '/husky/obra-228.jpg', w: 900, h: 900, title: 'Abstracción 2', es: 'Pintura circular de flores color coral entre pinceladas verdes y azules', en: 'Round painting of coral flowers among green and blue brushstrokes' } },
  { id: 'tankez', name: 'Tankez77', vendor: 'Tankez77', bio: 'tankez', art: { src: '/husky/obra-252.jpg', w: 900, h: 900, title: 'Ya no te quiere', es: 'Ilustración de un aloe en una maceta con letras rosas, en un marco magenta', en: 'Illustration of an aloe in a pot with pink lettering, in a magenta frame' } },
];

/* Participantes del photowalk y las entrevistas. Instagram tomado del "Registro de Participación - CuCo Arts" (sin teléfonos). */
export const PEOPLE: { name: string; ig: string }[] = [
  { name: 'Melisa Garza', ig: 'mg.jamesson' },
  { name: 'Abner Fabian', ig: 'byabnerfabian' },
  { name: 'Melanie Gil', ig: 'melaniegilq_' },
  { name: 'Faty Reyes', ig: 'fatyreyez' },
  { name: 'Zahid Armenta', ig: 'stillarmenta' },
  { name: 'Cynthia Fernanda Villarreal', ig: '3kly_34' },
  { name: 'Juan Ángel Segura', ig: 'juan_sgr23' },
];

/* Fotografías del photowalk (carpeta Documental/Fotografos). Se muestran 4 al azar, de fotógrafos distintos, en cada visita. */
export type PwPhoto = { id: string; w: number; h: number; who: string; ig: string; es: string; en: string };
const P = (id: string, w: number, h: number, who: string, ig: string, es: string, en: string): PwPhoto => ({ id, w, h, who, ig, es, en });
export const PW_PHOTOS: PwPhoto[] = [
  P('zahid-armenta-1', 880, 1100, 'Zahid Armenta', 'stillarmenta', 'Balcón con herrería sobre un muro color naranja', 'Wrought-iron balcony on an orange wall'),
  P('zahid-armenta-2', 880, 1100, 'Zahid Armenta', 'stillarmenta', 'Estatua de una mujer entre plantas, en la penumbra', 'Statue of a woman among plants in the dark'),
  P('zahid-armenta-3', 880, 1100, 'Zahid Armenta', 'stillarmenta', 'Estatua de un hombre con bastón sobre una columna, contra el cielo', 'Statue of a man with a staff on a column against the sky'),
  P('zahid-armenta-4', 880, 1100, 'Zahid Armenta', 'stillarmenta', 'Torres de una iglesia con la sierra al fondo', 'Church towers with the mountains behind'),
  P('fernanda-villarreal-1', 686, 1100, 'Cynthia Fernanda Villarreal', '3kly_34', 'Placa «Villa de Santiago · Pueblo Mágico» en un poste, en blanco y negro', '“Villa de Santiago · Pueblo Mágico” plaque on a lamp post, black and white'),
  P('fernanda-villarreal-2', 733, 1100, 'Cynthia Fernanda Villarreal', '3kly_34', 'Fachada de una iglesia sobre una escalinata, en blanco y negro', 'Church facade above a flight of steps, black and white'),
  P('fernanda-villarreal-3', 733, 1100, 'Cynthia Fernanda Villarreal', '3kly_34', 'Torres de una iglesia detrás de un muro, en blanco y negro', 'Church towers behind a wall, black and white'),
  P('fernanda-villarreal-4', 733, 1100, 'Cynthia Fernanda Villarreal', '3kly_34', 'Bicicleta alta frente a un mural, en blanco y negro', 'Tall bicycle in front of a mural, black and white'),
  P('juan-segura-1', 640, 1100, 'Juan Ángel Segura', 'juan_sgr23', 'Casa de esquina con techo de teja al atardecer', 'Corner house with a tiled roof at dusk'),
  P('juan-segura-2', 723, 1100, 'Juan Ángel Segura', 'juan_sgr23', 'Edificio color terracota contra un cielo azul', 'Terracotta-colored building against a blue sky'),
  P('juan-segura-3', 682, 1100, 'Juan Ángel Segura', 'juan_sgr23', 'Fachada de una iglesia con papel picado contra un cielo azul', 'Church facade with papel picado against a blue sky'),
  P('juan-segura-4', 734, 1100, 'Juan Ángel Segura', 'juan_sgr23', 'Interior de una iglesia con el altar', 'Church interior with the altar'),
  P('juan-segura-5', 733, 1100, 'Juan Ángel Segura', 'juan_sgr23', 'Bicicleta alta frente a un mural, en blanco y negro', 'Tall bicycle in front of a mural, black and white'),
  P('melanie-gil-1', 1100, 733, 'Melanie Gil', 'melaniegilq_', 'Bicicleta alta verde y amarilla frente a un mural con garzas', 'Green and yellow tall bicycle in front of a mural with herons'),
  P('melanie-gil-2', 1100, 733, 'Melanie Gil', 'melaniegilq_', 'Silueta de la sierra al atardecer con un parapente', 'Mountain silhouette at sunset with a paraglider'),
  P('melanie-gil-3', 1100, 733, 'Melanie Gil', 'melaniegilq_', 'Bicicleta alta tirada en el piso, en blanco y negro', 'Tall bicycle lying on the ground, black and white'),
  P('melanie-gil-4', 733, 1100, 'Melanie Gil', 'melaniegilq_', 'Detalle de la cadena y los pedales de una bicicleta alta', 'Detail of the chain and pedals of a tall bicycle'),
  P('melanie-gil-5', 1100, 733, 'Melanie Gil', 'melaniegilq_', 'Cables con foquitos contra el cielo, en blanco y negro', 'Wires with string lights against the sky, black and white'),
  P('melisa-garza-1', 736, 1100, 'Melisa Garza', 'mg.jamesson', 'Lago y montañas con árboles en primer plano', 'Lake and mountains with trees in the foreground'),
  P('melisa-garza-2', 1100, 736, 'Melisa Garza', 'mg.jamesson', 'Iglesia amarilla con papel picado contra un cielo azul', 'Yellow church with papel picado against a blue sky'),
  P('melisa-garza-3', 1100, 736, 'Melisa Garza', 'mg.jamesson', 'Pueblo y montañas al atardecer', 'Town and mountains at dusk'),
  P('melisa-garza-4', 736, 1100, 'Melisa Garza', 'mg.jamesson', 'Detalle de la fachada de una iglesia con papel picado', 'Detail of a church facade with papel picado'),
  P('melisa-garza-5', 1100, 736, 'Melisa Garza', 'mg.jamesson', 'Lago y montañas', 'Lake and mountains'),
  P('melisa-garza-6', 1100, 736, 'Melisa Garza', 'mg.jamesson', 'Árbol seco con montañas al fondo', 'Dry tree with mountains behind'),
];
