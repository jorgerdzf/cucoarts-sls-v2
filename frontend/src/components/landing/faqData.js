/* Preguntas frecuentes de la portada (ES / EN). Archivo CommonJS a propósito: lo leen la página (React) y el prerender (Node)
   para generar también los datos estructurados FAQPage.
   Fuentes: la antigua página /Faq (proceso de "Arte de la ciudad", tipos de proyecto, intención, misión), el registro de artistas
   de la portada (paquete $1,500 MXN) y el material de marca de CUCO ARTS. Respuestas de ES y EN reescritas por Roberto el 9-oct-2026. NO se reutilizaron las comisiones de la página vieja
   (30 % obras / 10 % murales): ya no coinciden con lo que está documentado hoy. */

const FAQ = {
  es: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Qué es CUCO ARTS?',
        a: 'CUCO ARTS es una plataforma para descubrir el arte y la cultura de Monterrey a través de sus artistas, espacios e historias. Contamos con una tienda en línea de obra original de artistas locales, desarrollamos un proyecto editorial de fotografía por zonas culturales de la ciudad y organizamos exposiciones y colaboraciones culturales, como CUCO ARTS × HUSKY en Santiago, N.L.',
      },
      {
        q: '¿Cómo compro obra original de artistas de Monterrey?',
        a: 'Entra a store.cucoarts.com, explora nuestra colección y elige tu obra favorita. Encontrarás piezas originales de artistas locales, con envíos nacionales e internacionales.',
      },
      {
        q: '¿Puedo encargar un mural o una obra a mi medida?',
        a: '¡Sí! Con nuestro cotizador artístico puedes contarnos qué tienes en mente, dónde se realizará la obra y cuál es tu presupuesto. Nos ponemos en contacto contigo para entender tu idea, explorar alternativas y ayudarte a encontrar al artista o los artistas ideales para tu proyecto.',
      },
      {
        q: '¿Cómo puedo vender mi obra en la tienda?',
        a: 'Llena nuestro registro para artistas y envíanos tu catálogo con precios. Revisaremos tu propuesta y nos pondremos en contacto contigo para explorar una posible incorporación a la tienda. El paquete de registro oficial cuesta $1,500 MXN (IVA incluido) e incluye fotografía profesional de tus obras, una entrevista en video y tomas de tu taller. Si no puedes cubrir el costo, puedes solicitar una condonación o proponernos una colaboración equivalente. Si ya cuentas con fotografías profesionales y una entrevista en video, podemos evaluar tu incorporación mediante un acuerdo de trabajo en el que solo se aplique la comisión de la tienda.',
      },
      {
        q: '¿Qué tipo de proyectos han trabajado?',
        a: 'Trabajamos en proyectos de artes visuales y producción audiovisual. Desde pintura, ilustración, dibujo, diseño y arte urbano, hasta entrevistas, video podcasts, cobertura de eventos, documentales, reportajes y campañas. Colaboramos con artistas, espacios culturales, organizaciones y marcas para dar vida a ideas y contar historias a través del arte y la imagen.',
      },
      {
        q: '¿Qué hace diferente a CUCO ARTS?',
        a: 'La intención de crear relaciones justas y proyectos que beneficien a todas las personas involucradas. En CUCO ARTS no buscamos venderte lo que más nos conviene, sino escucharte, entender qué necesitas y ayudarte a encontrar la solución artística adecuada para ti, respetando también el trabajo y la visión de cada artista.',
      },
      {
        q: '¿Dónde puedo ver la expo CUCO ARTS × HUSKY?',
        a: 'Puedes visitar la exposición CUCO ARTS × HUSKY en HUSKY Coffee Shop, ubicado en Morelos 302, Santiago, Nuevo León. En cucoarts.com/husky encontrarás más información sobre el proyecto, los artistas participantes y las obras disponibles para llevarte a casa.',
      },
      {
        q: '¿Cómo ayuda CUCO ARTS a la comunidad artística?',
        a: 'En CUCO ARTS queremos contribuir al desarrollo de los artistas locales, conectando a quienes crean con quienes valoran y disfrutan el arte. Buscamos abrir espacios para compartir su trabajo, acercarlo a nuevos públicos y generar oportunidades para que puedan seguir desarrollando su práctica creativa y vivir de ella.',
      },
    ],
  },
  en: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What is CUCO ARTS?',
        a: 'CUCO ARTS is a platform for discovering the art and culture of Monterrey through its artists, spaces, and stories. We run an online store with original work by local artists, develop an editorial photography project built around the city’s cultural zones, and organize exhibitions and cultural collaborations, such as CUCO ARTS × HUSKY in Santiago, N.L.',
      },
      {
        q: 'How do I buy original art by Monterrey artists?',
        a: 'Visit store.cucoarts.com, explore our collection, and pick your favorite piece. You will find original work by local artists, with domestic and international shipping.',
      },
      {
        q: 'Can I commission a mural or a custom artwork?',
        a: 'Yes! With our art quote tool you can tell us what you have in mind, where the artwork will be made, and what your budget is. We get in touch to understand your idea, explore alternatives, and help you find the ideal artist or artists for your project.',
      },
      {
        q: 'How can I sell my art in the store?',
        a: 'Fill in our artist registration and send us your catalog with prices. We will review your proposal and get in touch to explore a possible addition to the store. The official registration package costs $1,500 MXN (VAT included) and includes professional photography of your work, a video interview, and footage of your studio. If you cannot cover the cost, you can request a waiver or propose an equivalent collaboration. If you already have professional photos and a video interview, we can evaluate your addition through a work agreement in which only the store commission applies.',
      },
      {
        q: 'What kinds of projects have you worked on?',
        a: 'We work on visual arts and audiovisual production projects. From painting, illustration, drawing, design, and street art to interviews, video podcasts, event coverage, documentaries, reports, and campaigns. We collaborate with artists, cultural spaces, organizations, and brands to bring ideas to life and tell stories through art and imagery.',
      },
      {
        q: 'What makes CUCO ARTS different?',
        a: 'The intention of building fair relationships and projects that benefit everyone involved. At CUCO ARTS we do not look to sell you what suits us best; we listen, understand what you need, and help you find the right artistic solution for you, while respecting the work and vision of each artist.',
      },
      {
        q: 'Where can I see the CUCO ARTS × HUSKY exhibition?',
        a: 'You can visit the CUCO ARTS × HUSKY exhibition at HUSKY Coffee Shop, located at Morelos 302, Santiago, Nuevo León. At cucoarts.com/en/husky you will find more information about the project, the participating artists, and the works available to take home.',
      },
      {
        q: 'How does CUCO ARTS help the art community?',
        a: 'At CUCO ARTS we want to contribute to the development of local artists, connecting those who create with those who value and enjoy art. We aim to open spaces to share their work, bring it to new audiences, and create opportunities for them to keep developing their creative practice and make a living from it.',
      },
    ],
  },
};

module.exports = { FAQ };
