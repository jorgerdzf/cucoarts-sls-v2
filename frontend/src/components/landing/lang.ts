import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lang } from './copy';

/* El idioma vive en la URL: español en la raíz (/, /husky) e inglés bajo /en (/en, /en/husky). Así cada idioma tiene su propia
   dirección que Google puede indexar (con hreflang) y compartir el enlace siempre abre el idioma correcto.
   La elección también se guarda en "cucoarts-lang" para que /rob (página aparte) la recuerde. */

const LANG_KEY = 'cucoarts-lang';

export const langOf = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es');

/* Páginas cuyo nombre cambia de idioma: /murales (español) ↔ /en/murals (inglés). */
const EN_SLUG: Record<string, string> = { '/murales': '/murals', '/arte-por-encargo': '/custom-art' };
const ES_SLUG: Record<string, string> = { '/murals': '/murales', '/custom-art': '/arte-por-encargo' };

/** Dirección de una ruta en un idioma: lp('en', '/husky') → '/en/husky'; lp('es', '/husky') → '/husky'.
 *  Siempre se parte de la ruta en español: lp('en', '/murales') → '/en/murals'. */
export const lp = (lang: Lang, path: string): string => (lang === 'en' ? (path === '/' ? '/en' : '/en' + (EN_SLUG[path] || path)) : path);

/** La misma página en el otro idioma. */
export const switchPath = (pathname: string, to: Lang): string => {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;   // tolera la diagonal final (/murales/)
  const raw = p === '/en' ? '/' : p.startsWith('/en/') ? p.slice(3) : p;
  return lp(to, ES_SLUG[raw] || raw);   // primero vuelve a la ruta en español y luego la lleva al idioma pedido
};

export function useLang(): [Lang, (l: Lang) => void] {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const lang = langOf(pathname);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const choose = useCallback((l: Lang) => {
    if (l === lang) return;
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* sin almacenamiento */ }
    navigate(switchPath(pathname, l) + hash);
    window.scrollTo(0, 0);
  }, [lang, pathname, hash, navigate]);
  return [lang, choose];
}
