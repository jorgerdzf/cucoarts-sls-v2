import { Lang } from './copy';
import { PAGES, ld, url } from './seoShared';

/* SEO por página para el sitio de una sola página (React). Cada ruta llama applySeo() y se actualizan el título, la descripción,
   la URL canónica, los idiomas alternos (hreflang), Open Graph / Twitter y los datos estructurados (JSON-LD).
   Los mismos datos (seoShared.js) los usa scripts/prerender.js para dejar el <head> correcto en el HTML de cada ruta,
   que es lo que leen los rastreadores que no ejecutan JavaScript (WhatsApp, Facebook, etc.). */

export type PageKey = 'home' | 'husky' | 'privacy' | 'notfound';
type Txt = { title: string; description: string; ogDescription?: string; imageAlt: string };
type PageDef = { paths: Record<Lang, string>; image: string; noindex?: boolean; single?: boolean; es: Txt; en: Txt };
const PAGE = PAGES as unknown as Record<PageKey, PageDef>;

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', value);
};
const dropMeta = (attr: 'name' | 'property', key: string) => {
  document.head.querySelectorAll(`meta[${attr}="${key}"]`).forEach(n => n.remove());
};

/** Aplica el SEO de la página y devuelve la función que limpia lo que se agregó (alternos y datos estructurados). */
export function applySeo(page: PageKey, lang: Lang): () => void {
  const P = PAGE[page];
  const s = P[lang];
  const here = url(P.paths[lang]);
  const image = url(P.image);
  const alt = lang === 'en' ? 'es_MX' : 'en_US';

  document.title = s.title;
  setMeta('name', 'description', s.description);

  // quita también la canónica y los alternos que ya trae el HTML prerenderizado, para que quede una sola de cada una
  document.head.querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]').forEach(n => n.remove());
  const added: HTMLElement[] = [];
  const link = (rel: string, href: string, hreflang?: string) => {
    const l = document.createElement('link');
    l.rel = rel; l.href = href; l.setAttribute('data-seo', '1');
    if (hreflang) l.hreflang = hreflang;
    document.head.appendChild(l); added.push(l);
  };
  if (!P.noindex) link('canonical', here);
  if (!P.single) {
    link('alternate', url(P.paths.es), 'es');
    link('alternate', url(P.paths.en), 'en');
    link('alternate', url(P.paths.es), 'x-default');
  }
  if (P.noindex) setMeta('name', 'robots', 'noindex,follow'); else dropMeta('name', 'robots');

  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:site_name', 'CUCO ARTS');
  setMeta('property', 'og:url', here);
  setMeta('property', 'og:title', s.title);
  const social = s.ogDescription || s.description;   // versión corta para tarjetas de redes sociales
  setMeta('property', 'og:description', social);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:alt', s.imageAlt);
  setMeta('property', 'og:locale', lang === 'en' ? 'en_US' : 'es_MX');
  if (P.single) dropMeta('property', 'og:locale:alternate'); else setMeta('property', 'og:locale:alternate', alt);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', s.title);
  setMeta('name', 'twitter:description', social);
  setMeta('name', 'twitter:image', image);

  document.head.querySelectorAll('script[type="application/ld+json"]').forEach(n => n.remove());
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(ld(page, lang));
  document.head.appendChild(script); added.push(script);

  return () => { added.forEach(n => n.remove()); dropMeta('name', 'robots'); };
}
