import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, Lang } from './copy';
import { lp } from './lang';
import './assets/styles/menu.css';

/* Menú del sitio: un solo botón "Menú" en todas las resoluciones que abre una capa a pantalla completa.
   La capa se expande desde el botón (círculo), los enlaces entran uno por uno y el icono se convierte en ✕.
   Es el mismo menú en la portada, /murales, /arte-por-encargo y /husky (cambia solo la página marcada como actual). */

const STORE = 'https://store.cucoarts.com';
const TXT = {
  es: { menu: 'Menú', close: 'Cerrar menú', home: 'Inicio', here: 'estás aquí', soon: 'Próximamente', label: 'Menú principal', connect: 'Escríbenos', top: 'Arriba', topLabel: 'Volver al menú superior' },
  en: { menu: 'Menu', close: 'Close menu', home: 'Home', here: 'you are here', soon: 'Coming soon', label: 'Main menu', connect: 'Write to us', top: 'Top', topLabel: 'Back to the top menu' },
};

export type MenuItem = { id: string; label: string; href?: string; onClick?: () => void; badge?: string; disabled?: boolean; current?: boolean; external?: boolean };
export type MenuPage = 'home' | 'murales' | 'arte' | 'husky';

/** Lista de enlaces del menú (la misma en todas las páginas). onQuote / onSell solo existen en la portada. */
export function buildMenu(lang: Lang, c: Copy, page: MenuPage, h?: { onQuote?: () => void; onSell?: () => void }): MenuItem[] {
  const t = TXT[lang];
  const items: MenuItem[] = [];
  if (page !== 'home') items.push({ id: 'home', label: t.home, href: lp(lang, '/') });
  items.push({ id: 'store', label: c.nav.store, href: STORE, external: true });
  if (h?.onQuote) items.push({ id: 'quote', label: c.nav.quote, onClick: h.onQuote });
  items.push({ id: 'murales', label: c.nav.murals, href: lp(lang, '/murales'), badge: c.nav.fresh, current: page === 'murales' });
  items.push({ id: 'arte', label: c.nav.art, href: lp(lang, '/arte-por-encargo'), badge: c.nav.fresh, current: page === 'arte' });
  items.push(h?.onSell ? { id: 'sell', label: c.nav.sell, href: '#vende', onClick: h.onSell } : { id: 'sell', label: c.nav.sell, href: lp(lang, '/') + '#vende' });
  items.push({ id: 'husky', label: c.nav.expo, href: lp(lang, '/husky'), badge: c.nav.live, current: page === 'husky' });
  items.push({ id: 'events', label: c.nav.events, disabled: true, badge: t.soon });
  return items;
}

export default function SiteMenu({ lang, items }: { lang: Lang; items: MenuItem[] }) {
  const t = TXT[lang];
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [ready, setReady] = useState(false);   // true cuando terminó la animación de entrada: antes, el cursor no activa las filas que se mueven debajo de él
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
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', key); window.clearTimeout(f); window.clearTimeout(r); setReady(false); };
  }, [open, close]);

  // botón flotante para volver al menú superior: aparece al bajar un poco y se queda a la mano mientras se navega
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);   // React ignora el cambio si el valor no cambió
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // al cambiar el tamaño de la ventana el círculo de apertura ya no importa: se cierra para evitar estados raros
  useEffect(() => {
    const onResize = () => setOpen(false);
    window.addEventListener('orientationchange', onResize);
    return () => window.removeEventListener('orientationchange', onResize);
  }, []);

  const pick = (it: MenuItem) => (e: React.MouseEvent) => {
    if (it.onClick) { e.preventDefault(); it.onClick(); }
    setOpen(false);
  };

  return (
    <>
      <button ref={btn} type="button" className={`cl-menubtn${open ? ' is-open' : ''}`} aria-expanded={open} aria-controls="site-menu" onClick={toggle}>
        <span className="cl-menuicon" aria-hidden="true"><i /><i /><i /></span>
        <span className="cl-menutxt">{open ? t.close : t.menu}</span>
      </button>
      <div ref={panel} id="site-menu" className={`cl-menu${open ? ' is-open' : ''}${ready ? ' is-ready' : ''}`} tabIndex={-1} role="dialog" aria-modal="true" aria-label={t.label} aria-hidden={!open}>
        <div className="cl-menu-in">
          <div className="cl-menu-top">
            <span className="cl-menu-logo" aria-hidden="true" />
            <button type="button" className="cl-menu-x" onClick={close} tabIndex={open ? 0 : -1} aria-label={t.close}><span aria-hidden="true">✕</span></button>
          </div>
          <ol className="cl-menu-list">
            {items.map((it, i) => {
              const cls = `cl-mi${it.current ? ' is-current' : ''}${it.disabled ? ' is-off' : ''}`;
              const inner = (
                <>
                  <span className="cl-mi-n">{it.current ? '●' : String(i + 1).padStart(2, '0')}</span>
                  <span className="cl-mi-t">{it.label}</span>
                  {it.badge && <span className={`cl-live cl-mi-b${it.disabled ? ' is-soon' : ''}`}>{it.badge}</span>}
                  {!it.disabled && <span className="cl-mi-go" aria-hidden="true">{it.external ? '↗' : '→'}</span>}
                </>
              );
              return (
                <li key={it.id} style={{ ['--i' as string]: i } as React.CSSProperties}>
                  {it.disabled
                    ? <span className={cls} aria-disabled="true">{inner}</span>
                    : <a className={cls} href={it.href} onClick={pick(it)} tabIndex={open ? 0 : -1} {...(it.external ? { rel: 'noopener' } : {})} {...(it.current ? { 'aria-current': 'page' as const, title: t.here } : {})}>{inner}</a>}
                </li>
              );
            })}
          </ol>
          <div className="cl-menu-foot">
            <span>{t.connect}</span>
            <a href="mailto:hello@cucoarts.com" tabIndex={open ? 0 : -1}>hello@cucoarts.com</a>
            <a href="https://www.instagram.com/cucoarts/" target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>Instagram ↗</a>
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
