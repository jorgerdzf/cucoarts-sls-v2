/* Preguntas frecuentes de la portada (ES / EN). Archivo CommonJS a propósito: lo leen la página (React) y el prerender (Node)
   para generar también los datos estructurados FAQPage.
   Fuentes: la antigua página /Faq (proceso de "Arte de la ciudad", tipos de proyecto, intención, misión), el registro de artistas
   de la portada (paquete $1,500 MXN) y el material de marca de CUCO ARTS. NO se reutilizaron las comisiones de la página vieja
   (30 % obras / 10 % murales): ya no coinciden con lo que está documentado hoy. */

const FAQ = {
  es: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Qué es CUCO ARTS?',
        a: 'CUCO ARTS es una plataforma de descubrimiento artístico y cultural de Monterrey. Tenemos una tienda en línea con obra original de artistas locales, un proyecto editorial de fotografía por zonas culturales de la ciudad y activaciones como la expo en Santiago, N.L.',
      },
      {
        q: '¿Cómo compro obra original de artistas de Monterrey?',
        a: 'Entra a store.cucoarts.com: cada pieza es original y sale del taller de un artista local. Hacemos envíos internacionales.',
      },
      {
        q: '¿Puedo encargar un mural o una obra a mi medida?',
        a: 'Sí. Con el cotizador artístico nos cuentas qué quieres, dónde va y tu presupuesto. Platicamos para entender qué buscas, te proponemos alternativas y tú eliges al artista o artistas que trabajarán en tu proyecto.',
      },
      {
        q: '¿Cómo puedo vender mi obra en la tienda?',
        a: 'Llena el registro para artistas y mándanos tu catálogo con precios; te contactamos para ver cómo entrar. El paquete de registro oficial cuesta $1,500 MXN (IVA incluido) e incluye fotos profesionales de tus obras, una entrevista en video y tomas de tu taller. Si no puedes cubrirlo puedes pedir condonación o proponer una colaboración equivalente, y si ya tienes tus fotos y tu entrevista, solo pagas la comisión de la tienda y hacemos un acuerdo de trabajo.',
      },
      {
        q: '¿Qué tipo de proyectos han trabajado?',
        a: 'Proyectos de artes visuales (pintura, ilustración, dibujo, diseño y arte urbano) y de producción audiovisual: video podcasts, entrevistas, cobertura de eventos, documentales, reportajes y campañas.',
      },
      {
        q: '¿Qué hace diferente a CUCO ARTS?',
        a: 'La intención. Buscamos que cada proyecto sea ganar-ganar para todas las personas involucradas: no te vendemos lo que nos conviene a nosotros o al artista, sino lo que realmente buscas.',
      },
      {
        q: '¿Dónde puedo ver la expo CUCO ARTS × HUSKY?',
        a: 'La exposición está montada en HUSKY Coffee Shop, Morelos 302, Santiago, N.L. Conoce el proyecto, a los artistas y la obra que puedes llevarte en cucoarts.com/husky.',
      },
      {
        q: '¿Cómo ayuda CUCO ARTS a la comunidad artística?',
        a: 'Queremos ser una plataforma que ayude al desarrollo de creadores de la ciudad: un puente entre quienes crean y quienes aman la creatividad, para que puedan dedicar su vida a expresar lo que ven.',
      },
    ],
  },
  en: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What is CUCO ARTS?',
        a: 'CUCO ARTS is an art and culture discovery platform from Monterrey. We run an online store with original work by local artists, an editorial photography project built around the city’s cultural zones, and activations such as the exhibition in Santiago, N.L.',
      },
      {
        q: 'How do I buy original art by Monterrey artists?',
        a: 'Visit store.cucoarts.com: every piece is original and comes from a local artist’s studio. We ship internationally.',
      },
      {
        q: 'Can I commission a mural or a custom artwork?',
        a: 'Yes. With the art quote tool you tell us what you want, where it goes, and your budget. We talk to understand what you are looking for, propose alternatives, and you choose the artist or artists who will work on your project.',
      },
      {
        q: 'How can I sell my art in the store?',
        a: 'Fill in the artist registration and send us your catalog with prices; we will contact you to see how to join. The official registration package costs $1,500 MXN (VAT included) and includes professional photos of your work, a video interview, and footage of your studio. If you cannot cover it you can ask for a waiver or propose an equivalent collaboration, and if you already have your own photos and interview, you only pay the store commission and we sign a work agreement.',
      },
      {
        q: 'What kinds of projects have you worked on?',
        a: 'Visual arts projects (painting, illustration, drawing, design, and street art) and audiovisual production: video podcasts, interviews, event coverage, documentaries, reports, and campaigns.',
      },
      {
        q: 'What makes CUCO ARTS different?',
        a: 'Intention. We want every project to be win-win for everyone involved: we do not sell what suits us or the artist, but what you are really looking for.',
      },
      {
        q: 'Where can I see the CUCO ARTS × HUSKY exhibition?',
        a: 'The exhibition is on view at HUSKY Coffee Shop, Morelos 302, Santiago, N.L. Discover the project, the artists, and the work you can take home at cucoarts.com/en/husky.',
      },
      {
        q: 'How does CUCO ARTS help the art community?',
        a: 'We want to be a platform that supports the development of the city’s creators: a bridge between those who create and those who love creativity, so they can dedicate their lives to expressing what they see.',
      },
    ],
  },
};

module.exports = { FAQ };
