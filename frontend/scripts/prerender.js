/* Se ejecuta solo después de `npm run build` (script "postbuild").
   Toma build/index.html y genera una copia por ruta e idioma con su <head> correcto (título, descripción, canónica, hreflang,
   Open Graph, Twitter y datos estructurados) y un texto de respaldo en <noscript>. Así WhatsApp, Facebook, Google y cualquier
   rastreador que no ejecuta JavaScript ven la información de cada página. La app de React sigue funcionando igual encima.
   También escribe build/404.html (noindex) y build/sitemap.xml con los idiomas alternos.

   Salida:  /            → build/index.html
            /en          → build/en/index.html
            /husky       → build/husky/index.html
            /en/husky    → build/en/husky/index.html
            /privacidad  → build/privacidad/index.html
            (errores)    → build/404.html
   CloudFront traduce la ruta al archivo con infra/cloudfront/viewer-request.js. */
const fs = require('fs');
const path = require('path');
const { PAGES, SITE, ld, url } = require('../src/components/landing/seoShared.js');

const BUILD = path.join(__dirname, '..', 'build');
const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const meta = (attr, key, value) => `<meta ${attr}="${key}" content="${esc(value)}"/>`;

function headBlock(key, lang) {
  const P = PAGES[key];
  const s = P[lang];
  const here = url(P.paths[lang]);
  const image = url(P.image);
  const social = s.ogDescription || s.description;   // versión corta para tarjetas de redes sociales
  const out = [];
  out.push(`<title>${esc(s.title)}</title>`);
  out.push(meta('name', 'description', s.description));
  if (!P.noindex) out.push(`<link rel="canonical" href="${here}"/>`);
  if (!P.single) {
    out.push(`<link rel="alternate" hreflang="es" href="${url(P.paths.es)}"/>`);
    out.push(`<link rel="alternate" hreflang="en" href="${url(P.paths.en)}"/>`);
    out.push(`<link rel="alternate" hreflang="x-default" href="${url(P.paths.es)}"/>`);
  }
  if (P.noindex) out.push(meta('name', 'robots', 'noindex,follow'));
  out.push(meta('property', 'og:type', 'website'));
  out.push(meta('property', 'og:site_name', 'CUCO ARTS'));
  if (!P.noindex) out.push(meta('property', 'og:url', here));
  out.push(meta('property', 'og:title', s.title));
  out.push(meta('property', 'og:description', social));
  out.push(meta('property', 'og:image', image));
  out.push(meta('property', 'og:image:width', '1200'));
  out.push(meta('property', 'og:image:height', '630'));
  out.push(meta('property', 'og:image:alt', s.imageAlt));
  out.push(meta('property', 'og:locale', lang === 'en' ? 'en_US' : 'es_MX'));
  if (!P.single) out.push(meta('property', 'og:locale:alternate', lang === 'en' ? 'es_MX' : 'en_US'));
  out.push(meta('name', 'twitter:card', 'summary_large_image'));
  out.push(meta('name', 'twitter:title', s.title));
  out.push(meta('name', 'twitter:description', social));
  out.push(meta('name', 'twitter:image', image));
  out.push(`<script type="application/ld+json">${JSON.stringify(ld(key, lang)).replace(/</g, '\\u003c')}</script>`);
  return out.join('');
}

function render(key, lang) {
  const P = PAGES[key];
  let html = template;
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, '');
  html = html.replace(/<meta name="description"[^>]*>/g, '');
  html = html.replace(/<meta name="robots"[^>]*>/g, '');
  html = html.replace(/<meta (?:name|property)="(?:og:|twitter:)[^"]*"[^>]*>/g, '');
  html = html.replace(/<link rel="(?:canonical|alternate)"[^>]*>/g, '');
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>${P.noscript[lang]}</noscript>`);
  if (!html.includes('</head>')) throw new Error('build/index.html no tiene </head>');
  return html.replace('</head>', headBlock(key, lang) + '</head>');
}

function write(file, html) {
  const full = path.join(BUILD, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
  console.log('prerender  ' + file.padEnd(28) + ' ' + (html.length / 1024).toFixed(1) + ' KB');
}

const jobs = [
  ['home', 'es', 'index.html.tmp'],     // se escribe al final: es la plantilla de las demás
  ['home', 'en', 'en/index.html'],
  ['husky', 'es', 'husky/index.html'],
  ['husky', 'en', 'en/husky/index.html'],
  ['murales', 'es', 'murales/index.html'],
  ['murales', 'en', 'en/murals/index.html'],
  ['arte', 'es', 'arte-por-encargo/index.html'],
  ['arte', 'en', 'en/custom-art/index.html'],
  ['privacy', 'es', 'privacidad/index.html'],
  ['notfound', 'es', '404.html'],
];
jobs.forEach(([key, lang, file]) => write(file, render(key, lang)));
fs.renameSync(path.join(BUILD, 'index.html.tmp'), path.join(BUILD, 'index.html'));
console.log('prerender  index.html (español)');

/* sitemap.xml con idiomas alternos */
const lastmod = new Date().toISOString().slice(0, 10);
const entries = ['home', 'husky', 'murales', 'arte'].flatMap((key) => {
  const P = PAGES[key];
  return ['es', 'en'].map((lang) => {
    const alts = [
      `<xhtml:link rel="alternate" hreflang="es" href="${url(P.paths.es)}"/>`,
      `<xhtml:link rel="alternate" hreflang="en" href="${url(P.paths.en)}"/>`,
      `<xhtml:link rel="alternate" hreflang="x-default" href="${url(P.paths.es)}"/>`,
    ].join('\n    ');
    const prio = key === 'home' ? (lang === 'es' ? '1.0' : '0.9') : (lang === 'es' ? '0.8' : '0.7');
    return `  <url>\n    <loc>${url(P.paths[lang])}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${prio}</priority>\n    ${alts}\n  </url>`;
  });
});
fs.writeFileSync(path.join(BUILD, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
console.log('prerender  sitemap.xml (' + entries.length + ' URLs)');
