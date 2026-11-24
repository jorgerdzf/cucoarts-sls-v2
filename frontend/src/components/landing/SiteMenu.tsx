import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, Lang } from './copy';
import { lp } from './lang';
import './assets/styles/menu.css';

/* Menú del sitio como recorrido curatorial en 6 pilares: Descubre MTY → Artistas → Catálogo → Eventos y expos → Proyectos → RIPPLE.
   Un solo botón "Menú" abre una capa a pantalla completa (círculo desde el botón, enlaces uno por uno, icono → ✕).
   Cabecera: logo · selector de ciudad · cerrar. Escritorio: al pasar sobre un pilar con tarjeta, se muestra a la derecha.
   Es el mismo menú en la portada, /murales, /arte-por-encargo y /husky, y debe coincidir con MTY_PROTOTIPO/src/sitemenu.js (/mty). */

const STORE = 'https://store.cucoarts.com';
const TXT = {
  es: {
    menu: 'Menú', close: 'Cerrar menú', here: 'estás aquí', label: 'Menú principal', city: 'Ciudad', cityMore: 'Más ciudades pronto', guide: 'Guía', live: 'Activa',
    sell: '¿Eres artista? Vende tu obra', quote: 'Cotizador rápido', connect: 'Escríbenos', copy: 'Copiar enlace', copied: '¡Enlace copiado!', top: 'Arriba', topLabel: 'Volver al menú superior',
    i1: 'Descubre MTY', s1: 'Tienda, artistas, murales y exposiciones', iA: 'Artistas', sA: 'Quiénes son y cómo trabajan', i2: 'Catálogo', s2: 'Obra original y ediciones', i3: 'Exposiciones', s3: 'Agenda de artes visuales de MTY',
    i4: 'Proyectos', s4: 'Murales, comisiones y cotizador', i5: 'RIPPLE', s5: 'Gana puntos por descubrir arte local',
    p1k: 'Arte urbano', p1t: 'Los murales de San Nicolás, zona por zona', p1d: 'Quién los pintó, con qué estilo y dónde encontrar su obra en la tienda.', p1c: 'Recorrer murales',
    p3k: 'En curso', p3t: 'Expo en Santiago', p3d: 'Arte local en HUSKY Coffee Shop. Pasa, toma un café y mira la obra en persona.', p3c: 'Ver la expo',
  },
  en: {
    menu: 'Menu', close: 'Close menu', here: 'you are here', label: 'Main menu', city: 'City', cityMore: 'More cities soon', guide: 'Guide', live: 'Live',
    sell: 'Are you an artist? Sell your art', quote: 'Quick quote', connect: 'Write to us', copy: 'Copy link', copied: 'Link copied!', top: 'Top', topLabel: 'Back to the top menu',
    i1: 'Discover MTY', s1: 'Store, artists, murals and exhibitions', iA: 'Artists', sA: 'Who they are and how they work', i2: 'Catalog', s2: 'Original work and editions', i3: 'Exhibitions', s3: 'Visual arts agenda of MTY',
    i4: 'Projects', s4: 'Murals, commissions and quotes', i5: 'RIPPLE', s5: 'Earn points for discovering local art',
    p1k: 'Street art', p1t: 'San Nicolás murals, zone by zone', p1d: 'Who painted them, in what style, and where to find their work in the store.', p1c: 'Explore murals',
    p3k: 'On now', p3t: 'Expo in Santiago', p3d: 'Local art at HUSKY Coffee Shop. Drop by, grab a coffee and see the work in person.', p3c: 'See the expo',
  },
};

export type MenuPreview = { img: string; k: string; t: string; d: string; c: string; href: string };
export type MenuItem = { id: string; label: string; sub?: string; href?: string; onClick?: () => void; badge?: string; current?: boolean; external?: boolean; prev?: MenuPreview };
export type MenuPage = 'home' | 'murales' | 'arte' | 'husky' | 'descubre';
export type MenuFoot = { sellHref: string; onSell?: () => void; quoteHref: string; onQuote?: () => void };

/** Los 6 pilares (los mismos en todas las páginas). */
export function buildMenu(lang: Lang, _c: Copy, page: MenuPage): MenuItem[] {
  const t = TXT[lang];
  return [
    { id: 'discover', label: t.i1, sub: t.s1, href: lp(lang, '/descubre-monterrey'), badge: t.guide, current: page === 'descubre', prev: { img: '/mty/img/murales/greometria-puente-sn-b1-2.jpg', k: t.p1k, t: t.p1t, d: t.p1d, c: t.p1c, href: lp(lang, '/mty/arte-urbano') } },
    { id: 'artists', label: t.iA, sub: t.sA, href: '/artistas' },
    { id: 'catalog', label: t.i2, sub: t.s2, href: STORE, external: true },
    { id: 'events', label: t.i3, sub: t.s3, href: '/mty', badge: t.live, current: page === 'husky', prev: { img: '/mty/img/husky-expo.jpg', k: t.p3k, t: t.p3t, d: t.p3d, c: t.p3c, href: lp(lang, '/husky') } },
    { id: 'projects', label: t.i4, sub: t.s4, href: lp(lang, '/murales'), current: page === 'murales' || page === 'arte' },
    { id: 'ripple', label: t.i5, sub: t.s5, href: '/ripple/mty' },
  ];
}

/** Enlaces del pie: "¿Eres artista?" y "Cotizador rápido" (en la portada abren sus paneles; en el resto llevan a la portada / a /murales). */
export function buildFoot(lang: Lang, h?: { onQuote?: () => void; onSell?: () => void }): MenuFoot {
  return { sellHref: lp(lang, '/') + '#vende', onSell: h?.onSell, quoteHref: lp(lang, '/murales'), onQuote: h?.onQuote };
}

export default function SiteMenu({ lang, items, foot }: { lang: Lang; items: MenuItem[]; foot: MenuFoot }) {
  const t = TXT[lang];
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [ready, setReady] = useState(false);   // true cuando terminó la animación de entrada: antes, el cursor no activa las filas que se mueven debajo de él
  const [cityOpen, setCityOpen] = useState(false);
  const [active, setActive] = useState('discover');
  const [copied, setCopied] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setOpen(o => {
      if (!o && btn.current && panel.current) {
        // el círculo de apertura nace en el centro del botón
        const r = btn.current.getBoundingClientRect();
        panel.current.style.setProperty('--ox', `${r.left + r.width / 2}px`);
        panel.current.style.setProperty('--oy', `${r.top + r.height / 2}px`);
      }
      return !o;
    });
  }, []);
  const close = useCallback(() => { setOpen(false); btn.current?.focus(); }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    document.addEventListener('keydown', key);
    const f = window.setTimeout(() => panel.current?.focus({ preventScroll: true }), 120);
    const r = window.setTimeout(() => setReady(true), 1000);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', key); window.clearTimeout(f); window.clearTimeout(r); setReady(false); setCityOpen(false); };
  }, [open, close]);

  // botón flotante para volver al menú superior: aparece al bajar un poco y se queda a la mano mientras se navega
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);   // React ignora el cambio si el valor no cambió
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // al cambiar la orientación el círculo de apertura ya no importa: se cierra para evitar estados raros
  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener('orientationchange', onResize);
    return () => window.removeEventListener('orientationchange', onResize);
  }, []);

  const pick = (it: { onClick?: () => void }) => (e: React.MouseEvent) => {
    if (it.onClick) { e.preventDefault(); it.onClick(); }
    setOpen(false);
  };
  const copyLink = async () => {
    const link = window.location.origin + window.location.pathname;
    try { await navigator.clipboard.writeText(link); } catch { /* sin permiso del portapapeles: no pasa nada */ }
    setCopied(true); window.setTimeout(() => setCopied(false), 1800);
  };
  const tab = open ? 0 : -1;
  const activeHasCard = items.some(i => i.id === active && i.prev);

  return (
    <>
      <button ref={btn} type="button" className={`cl-menubtn${open ? ' is-open' : ''}`} aria-expanded={open} aria-controls="site-menu" onClick={toggle}>
        <span className="cl-menuicon" aria-hidden="true"><i /><i /><i /></span>
        <span className="cl-menutxt">{open ? t.close : t.menu}</span>
      </button>
      <div ref={panel} id="site-menu" className={`cl-menu${open ? ' is-open' : ''}${ready ? ' is-ready' : ''}`} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t.label} aria-hidden={!open}
        onClick={e => { if (!(e.target as HTMLElement).closest('.cl-city-w')) setCityOpen(false); }}>
        <div className="cl-menu-in">
          <div className="cl-menu-top">
            <span className="cl-menu-logo" aria-hidden="true" />
            <span className="cl-city-w">
              <button type="button" className="cl-city" aria-haspopup="true" aria-expanded={cityOpen} aria-label={`${t.city}: Monterrey`} tabIndex={tab} onClick={e => { e.stopPropagation(); setCityOpen(o => !o); }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg>
                <span>MONTERREY</span>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <span className="cl-city-pop" role="menu" hidden={!cityOpen}>
                <span className="cl-city-it is-on" role="menuitem" aria-current="true">Monterrey</span>
                <span className="cl-city-it is-off" aria-disabled="true">{t.cityMore}</span>
              </span>
            </span>
            <button type="button" className="cl-menu-x" onClick={close} tabIndex={tab} aria-label={t.close}><span aria-hidden="true">✕</span></button>
          </div>
          <div className="cl-menu-body">
            <ol className="cl-menu-list">
              {items.map((it, i) => (
                <li key={it.id} style={{ ['--i' as string]: i } as React.CSSProperties}>
                  <a className={`cl-mi${it.current ? ' is-current' : ''}`} href={it.href} onClick={pick(it)} tabIndex={tab} onMouseEnter={() => setActive(it.id)} onFocus={() => setActive(it.id)}
                    {...(it.external ? { rel: 'noopener' } : {})} {...(it.current ? { 'aria-current': 'page' as const, title: t.here } : {})}>
                    <span className="cl-mi-n">{it.current ? '●' : String(i + 1).padStart(2, '0')}</span>
                    <span className="cl-mi-tx"><span className="cl-mi-t">{it.label}</span>{it.sub && <span className="cl-mi-s">{it.sub}</span>}</span>
                    {it.badge && <span className="cl-live cl-mi-b">{it.badge}</span>}
                    <span className="cl-mi-go" aria-hidden="true">{it.external ? '↗' : '→'}</span>
                  </a>
                </li>
              ))}
            </ol>
            <div className={`cl-menu-side${activeHasCard ? '' : ' is-none'}`} aria-hidden="true">
              {items.filter(i => i.prev).map(it => (
                <a key={it.id} className={`cl-card${it.id === active ? ' is-on' : ''}`} href={it.prev!.href} tabIndex={-1}>
                  <span className="cl-card-img"><img src={it.prev!.img} alt="" loading="lazy" onError={e => { const im = e.currentTarget; im.parentElement?.classList.add('is-empty'); im.remove(); }} /></span>
                  <span className="cl-card-b"><span className="cl-card-k">{it.prev!.k}</span><span className="cl-card-t">{it.prev!.t}</span><span className="cl-card-d">{it.prev!.d}</span><span className="cl-card-c">{it.prev!.c} →</span></span>
                </a>
              ))}
            </div>
          </div>
          <div className="cl-menu-foot">
            <div className="cl-foot-main">
              <a href={foot.sellHref} tabIndex={tab} onClick={pick({ onClick: foot.onSell })}>{t.sell} →</a>
              <a href={foot.quoteHref} tabIndex={tab} onClick={pick({ onClick: foot.onQuote })}>{t.quote} →</a>
            </div>
            <div className="cl-foot-sub">
              <span>{t.connect}</span>
              <a href="mailto:hello@cucoarts.com" tabIndex={tab}>hello@cucoarts.com</a>
              <a href="https://www.instagram.com/cucoarts/" target="_blank" rel="noopener noreferrer" tabIndex={tab}>Instagram ↗</a>
              <button type="button" className="cl-copy" aria-live="polite" tabIndex={tab} onClick={copyLink}>{copied ? t.copied : t.copy}</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className={`cl-fab${showTop && !open ? ' is-on' : ''}`} aria-label={t.topLabel} tabIndex={showTop && !open ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>
        <span aria-hidden="true">↑</span><b>{t.top}</b>
      </button>
    </>
  );
}
