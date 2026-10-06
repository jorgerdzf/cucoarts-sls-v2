/* Datos de SEO compartidos por la página (React, vía seo.ts) y por el prerender (Node, scripts/prerender.js).
   Una sola fuente para títulos, descripciones, rutas por idioma y datos estructurados JSON-LD. Archivo CommonJS a propósito. */
const { FAQ } = require('./faqData');

const SITE = 'https://cucoarts.com';
const STORE = 'https://store.cucoarts.com';
const SOCIAL = ['https://www.instagram.com/cucoarts/', 'https://www.youtube.com/@cucoarts', STORE];

const ORG = {
  '@type': 'Organization',
  '@id': SITE + '/#org',
  name: 'CUCO ARTS',
  url: SITE,
  logo: SITE + '/logo512.png',
  email: 'hello@cucoarts.com',
  description: 'Plataforma de descubrimiento artístico y cultural de Monterrey: tienda en línea de obra original de artistas locales.',
  areaServed: 'Monterrey, Nuevo León, México',
  sameAs: SOCIAL,
};

/* path por idioma: el español vive en la raíz y el inglés bajo /en */
const PAGES = {
  home: {
    paths: { es: '/', en: '/en' },
    image: '/og-cucoarts.png',
    es: {
      title: 'CUCO ARTS · Arte y cultura de Monterrey',
      description: 'Tienda de obra original de artistas locales, cotizador de murales, registro para artistas y expo en Santiago, N.L. Envíos internacionales.',
      ogDescription: 'Compra obra original de artistas locales, cotiza un mural a tu medida y descubre la expo en Santiago, N.L.',
      imageAlt: 'CUCO ARTS: descubre el Monterrey que existe más allá de los mapas',
    },
    en: {
      title: 'CUCO ARTS · Art and culture from Monterrey',
      description: 'Online store for original work by local artists, mural quotes, artist registration, and an exhibition in Santiago, N.L. International shipping.',
      ogDescription: 'Buy original work by local artists, get a custom mural quote, and discover the expo in Santiago, N.L.',
      imageAlt: 'CUCO ARTS: discover the Monterrey that exists beyond the maps',
    },
    noscript: {
      es: '<h1>CUCO ARTS · Arte y cultura de Monterrey</h1><p>Obra original de artistas de Monterrey, cotizador de murales y artes plásticas, expo de arte local en Santiago, N.L. y registro de artistas para nuestra tienda en línea. Para ver este sitio activa JavaScript.</p><ul><li><a href="' + STORE + '">Tienda en línea</a></li><li><a href="' + SITE + '/husky">Expo CUCO ARTS × HUSKY en Santiago, N.L.</a></li><li><a href="' + SITE + '/en">English version</a></li></ul>',
      en: '<h1>CUCO ARTS · Art and culture from Monterrey</h1><p>Original art by Monterrey artists, mural and fine art quotes, a local art exhibition in Santiago, N.L., and artist registration for our online store. Please enable JavaScript to view this site.</p><ul><li><a href="' + STORE + '">Online store</a></li><li><a href="' + SITE + '/en/husky">CUCO ARTS × HUSKY exhibition in Santiago, N.L.</a></li><li><a href="' + SITE + '/">Versión en español</a></li></ul>',
    },
  },
  husky: {
    paths: { es: '/husky', en: '/en/husky' },
    image: '/og-husky.jpg',
    es: {
      title: 'CUCO ARTS × HUSKY · Expo de arte local en Santiago, N.L.',
      description: 'Entrada libre en HUSKY Coffee Shop (Morelos 302): conoce a los artistas, lleva obra original a casa y descubre el photowalk y el documental en preparación.',
      ogDescription: 'Entrada libre en HUSKY Coffee Shop. Conoce a los artistas y lleva obra original a casa.',
      imageAlt: 'Exposición CUCO ARTS × HUSKY Coffee Shop en Santiago, Nuevo León',
    },
    en: {
      title: 'CUCO ARTS × HUSKY · Local art exhibition in Santiago, N.L.',
      description: 'Free entry at HUSKY Coffee Shop (Morelos 302): meet the artists, take original art home, and discover the photowalk and the documentary in the making.',
      ogDescription: 'Free entry at HUSKY Coffee Shop. Meet the artists and take original art home.',
      imageAlt: 'CUCO ARTS × HUSKY Coffee Shop exhibition in Santiago, Nuevo León',
    },
    noscript: {
      es: '<h1>La ciudad más allá de los estadios · CUCO ARTS × HUSKY</h1><p>Exposición temporal de arte local en HUSKY Coffee Shop, Morelos 302, Santiago, N.L.: artistas de Monterrey, obra a la venta, photowalk con fotógrafos locales y documental. Para ver esta página activa JavaScript.</p><ul><li><a href="' + STORE + '">Tienda en línea</a></li><li><a href="' + SITE + '/">CUCO ARTS</a></li><li><a href="' + SITE + '/en/husky">English version</a></li></ul>',
      en: '<h1>The city beyond the stadiums · CUCO ARTS × HUSKY</h1><p>A temporary local art exhibition at HUSKY Coffee Shop, Morelos 302, Santiago, N.L.: Monterrey artists, original art for sale, a photowalk with local photographers, and a documentary. Please enable JavaScript to view this page.</p><ul><li><a href="' + STORE + '">Online store</a></li><li><a href="' + SITE + '/en">CUCO ARTS</a></li><li><a href="' + SITE + '/husky">Versión en español</a></li></ul>',
    },
  },
  privacy: {
    paths: { es: '/privacidad', en: '/privacidad' },
    image: '/og-cucoarts.png',
    es: { title: 'Aviso de privacidad · CUCO ARTS', description: 'Aviso de privacidad de CUCO ARTS: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos.', imageAlt: 'CUCO ARTS' },
    en: { title: 'Aviso de privacidad · CUCO ARTS', description: 'Aviso de privacidad de CUCO ARTS: qué datos recabamos, para qué los usamos y cómo ejercer tus derechos.', imageAlt: 'CUCO ARTS' },
    noscript: {
      es: '<h1>Aviso de privacidad · CUCO ARTS</h1><p>Para ver este aviso activa JavaScript. Para cualquier tema de privacidad escribe a hello@cucoarts.com.</p>',
      en: '<h1>Aviso de privacidad · CUCO ARTS</h1><p>Para ver este aviso activa JavaScript. Para cualquier tema de privacidad escribe a hello@cucoarts.com.</p>',
    },
    indexable: true,
    single: true,
  },
  notfound: {
    paths: { es: '/404', en: '/404' },
    image: '/og-cucoarts.png',
    es: { title: 'Página no encontrada · CUCO ARTS', description: 'La página que buscas no existe. Visita la portada de CUCO ARTS o nuestra tienda en línea.', imageAlt: 'CUCO ARTS' },
    en: { title: 'Page not found · CUCO ARTS', description: 'The page you are looking for does not exist. Visit the CUCO ARTS home page or our online store.', imageAlt: 'CUCO ARTS' },
    noscript: {
      es: '<h1>Página no encontrada</h1><p>La página que buscas no existe.</p><ul><li><a href="' + SITE + '/">Ir a la portada de CUCO ARTS</a></li><li><a href="' + STORE + '">Tienda en línea</a></li></ul>',
      en: '<h1>Page not found</h1><p>The page you are looking for does not exist.</p><ul><li><a href="' + SITE + '/en">Go to the CUCO ARTS home page</a></li><li><a href="' + STORE + '">Online store</a></li></ul>',
    },
    noindex: true,
    single: true,
  },
};

const url = (path) => SITE + path;

/** Datos estructurados (JSON-LD, ya con @context) de cada página e idioma. */
function ld(page, lang) {
  const P = PAGES[page];
  const here = url(P.paths[lang]);
  const inLanguage = lang === 'en' ? 'en' : 'es-MX';
  if (page === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        ORG,
        { '@type': 'WebSite', '@id': SITE + '/#site', url: SITE, name: 'CUCO ARTS', inLanguage: ['es-MX', 'en'], publisher: { '@id': SITE + '/#org' } },
        { '@type': 'WebPage', '@id': here + '#page', url: here, name: P[lang].title, description: P[lang].description, inLanguage, isPartOf: { '@id': SITE + '/#site' } },
        {
          '@type': 'FAQPage',
          '@id': here + '#faq',
          inLanguage,
          mainEntity: FAQ[lang].items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
        },
      ],
    };
  }
  if (page === 'husky') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        ORG,
        {
          '@type': 'ExhibitionEvent',
          '@id': url('/husky') + '#expo',
          name: 'The City Beyond the Stadiums · CUCO ARTS × HUSKY',
          description: P[lang].description,
          url: here,
          image: [url(P.image)],
          startDate: '2026-06-25',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          isAccessibleForFree: true,
          inLanguage,
          location: {
            '@type': 'Place',
            name: 'HUSKY Coffee Shop',
            sameAs: 'https://www.instagram.com/huskycoffeeshop/',
            address: { '@type': 'PostalAddress', streetAddress: 'Morelos 302', addressLocality: 'Santiago', addressRegion: 'Nuevo León', postalCode: '67310', addressCountry: 'MX' },
          },
          organizer: { '@id': SITE + '/#org' },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'CUCO ARTS', item: url(PAGES.home.paths[lang]) },
            { '@type': 'ListItem', position: 2, name: 'HUSKY', item: here },
          ],
        },
      ],
    };
  }
  return { '@context': 'https://schema.org', '@graph': [ORG] };
}

module.exports = { SITE, STORE, ORG, PAGES, FAQ, url, ld };
