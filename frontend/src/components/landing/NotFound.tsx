import React, { useEffect } from 'react';
import { COPY } from './copy';
import { Icon, STORE, useTheme } from './Landing';
import { useLang, lp } from './lang';
import { applySeo } from './seo';
import './assets/styles/landing2.css';

/* Página 404 de cucoarts.com. CloudFront la entrega con estado 404 para cualquier dirección que no existe;
   lleva noindex para que Google no la indexe. */

const T = {
  es: { h1: 'Esta página no existe', p: 'Puede que el enlace haya cambiado o que la dirección esté mal escrita. Te dejamos dos caminos.', home: 'Ir a la portada', store: 'Visitar la tienda', corner: 'ERROR 404' },
  en: { h1: 'This page does not exist', p: 'The link may have changed or the address may be mistyped. Here are two ways forward.', home: 'Go to the home page', store: 'Visit the store', corner: 'ERROR 404' },
};

export default function NotFound() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const c = COPY[lang];
  const t = T[lang];
  const dark = theme === 'dark';
  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);
  useEffect(() => applySeo('notfound', lang), [lang]);

  return (
    <div className="cl">
      <header className="cl-top cl-in">
        <a className="cl-logo" href={lp(lang, '/')}><span className="cl-sr">CUCO ARTS</span></a>
        <div className="cl-tools" style={{ marginLeft: 'auto' }}>
          <button type="button" className="cl-pill" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={c.langBtn.label} title={c.langBtn.label}>
            {Icon.globe}<span>{c.langBtn.short}</span>
          </button>
          <button type="button" className="cl-pill" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? c.theme.toLight : c.theme.toDark}>
            {dark ? Icon.sun : Icon.moon}<span className="cl-hide-s">{dark ? c.theme.toLight : c.theme.toDark}</span>
          </button>
        </div>
      </header>
      <section className="cl-band cl-heroband">
        <div className="cl-in">
          <div className="cl-corners" aria-hidden="true"><span>CUCOARTS</span><span>{t.corner}</span></div>
          <div className="cl-herotext">
            <h1>{t.h1}</h1>
            <p className="cl-lede">{t.p}</p>
            <div className="cl-actions">
              <a className="cl-fun" href={lp(lang, '/')}><span>{t.home}</span><i aria-hidden="true">→</i></a>
              <a className="cl-textlink" href={STORE}>{t.store} ↗</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
