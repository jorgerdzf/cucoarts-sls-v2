import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lang } from './copy';

/* El idioma vive en la URL: español en la raíz (/, /husky) e inglés bajo /en (/en, /en/husky). Así cada idioma tiene su propia
   dirección que Google puede indexar (con hreflang) y compartir el enlace siempre abre el idioma correcto.
   La elección también se guarda en "cucoarts-lang" para que /rob (página aparte) la recuerde. */

const LANG_KEY = 'cucoarts-lang';

export const langOf = (pathname: string): Lang => (pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es');

/** Dirección de una ruta en un idioma: lp('en', '/husky') → '/en/husky'; lp('es', '/husky') → '/husky'. */
export const lp = (lang: Lang, path: string): string => (lang === 'en' ? (path === '/' ? '/en' : '/en' + path) : path);

/** La misma página en el otro idioma. */
export const switchPath = (pathname: string, to: Lang): string => {
  const base = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) : pathname;
  return lp(to, base);
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
