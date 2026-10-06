import React, { useEffect, useState } from 'react';
import { COPY } from './copy';
import { HK, BIOS, WORKS, ARTISTS, PEOPLE, PW_PHOTOS, PwPhoto } from './huskyCopy';
import { Icon, STORE, useTheme } from './Landing';
import { useLang, lp } from './lang';
import { applySeo } from './seo';
import './assets/styles/landing2.css';
import './assets/styles/husky.css';

/* cucoarts.com/husky — proyecto CUCO ARTS × HUSKY Coffee Shop (exposición "The city beyond the stadiums").
   Usa la misma estructura y estilo que la landing (clases cl-*, variables de html[data-page="landing"]);
   lo propio de esta página lleva el prefijo hk-. */

const COLORS = ['#F7D649', '#EA663D', '#067DFF', '#ABCFDD', '#644DEF', '#C7F74E', '#CDE8D8'];
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('HUSKY Coffee Shop, Morelos 302, Santiago, Nuevo León 67310');
const money = (n: number) => '$' + new Intl.NumberFormat('es-MX').format(n) + ' MXN';
const IG = 'https://www.instagram.com/huskycoffeeshop/';

const shuffle = <T,>(a: T[]): T[] => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [b[i], b[k]] = [b[k], b[i]]; } return b; };

/** 4 fotografías del photowalk, cada una de un fotógrafo distinto, distintas en cada visita. */
function pickPhotos(): PwPhoto[] {
  const by: Record<string, PwPhoto[]> = {};
  PW_PHOTOS.forEach(p => { (by[p.ig] = by[p.ig] || []).push(p); });
  return shuffle(Object.values(by)).slice(0, 4).map(g => shuffle(g)[0]);
}

export default function Husky() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const [pw] = useState<PwPhoto[]>(pickPhotos);
  const c = COPY[lang];
  const h = HK[lang];
  const dark = theme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);
  // SEO de la página (título, descripción, canónica, Open Graph y datos estructurados); va después del título genérico de useLang
  useEffect(() => applySeo('husky', lang), [lang]);

  const photo = (n: number, alt: string, eager?: boolean) => (
    <img src={`/husky/husky-${n}.jpg`} width={1200} height={1200} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  );

  return (
    <div className="cl hk">
      <header className="cl-top cl-in">
        <a className="cl-logo" href={lp(lang, '/')}><span className="cl-sr">CUCO ARTS</span></a>
        <nav className="cl-nav" aria-label={h.nav.label}>
          <a href={lp(lang, '/')}>{h.nav.home}</a>
          <a href={STORE}>{h.nav.store}</a>
        </nav>
        <div className="cl-tools">
          <button type="button" className="cl-pill" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={c.langBtn.label} title={c.langBtn.label}>
            {Icon.globe}<span>{c.langBtn.short}</span>
          </button>
          <button type="button" className="cl-pill" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? c.theme.toLight : c.theme.toDark}>
            {dark ? Icon.sun : Icon.moon}<span className="cl-hide-s">{dark ? c.theme.toLight : c.theme.toDark}</span>
          </button>
        </div>
      </header>

      <section className="cl-band cl-heroband hk-hero">
        <div className="cl-in">
          <div className="cl-corners" aria-hidden="true"><span>{h.hero.cornerL}</span><span>{h.hero.cornerR}</span></div>
          <div className="cl-hero">
            <div className="cl-herotext">
              <h1>{h.hero.title}</h1>
              <p className="cl-lede">{h.hero.lede}</p>
              <div className="cl-actions">
                <a className="cl-fun" href="#obra"><span>{h.hero.cta}</span><i aria-hidden="true">→</i></a>
                <a className="cl-textlink" href="#concepto">{h.hero.cta2} ↓</a>
              </div>
            </div>
            <div className="cl-pols" role="group" aria-label={h.hero.galleryLabel}>
              <div className="cl-pcol">
                <figure className="cl-pol cl-pol-0">{photo(2, h.alt.p2, true)}<figcaption>{h.credit}</figcaption></figure>
              </div>
              <div className="cl-pcol">
                <figure className="cl-pol cl-pol-1">{photo(3, h.alt.p3, true)}<figcaption>{h.credit}</figcaption></figure>
              </div>
              <em className="cl-stamp cl-stamp-hero" aria-hidden="true">{h.hero.stamp.map(t => <span key={t}>{t}</span>)}</em>
            </div>
          </div>
        </div>
      </section>

      <section id="concepto" className="cl-band hk-concept" aria-labelledby="concepto-h">
        <div className="cl-in hk-conceptgrid">
          <div className="hk-text">
            <span className="cl-label">{h.concept.label}</span>
            <h2 id="concepto-h">{h.concept.title}</h2>
            <p className="hk-lead">{h.concept.p1}</p>
            <p>{h.concept.p2}</p>
            <p>{h.concept.p3}</p>
          </div>
          <aside className="hk-data" aria-label={h.concept.dataTitle}>
            <span className="cl-label">{h.concept.dataTitle}</span>
            <dl>
              {h.concept.data.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
            <a className="cl-btn" href={MAPS} target="_blank" rel="noopener noreferrer">{h.concept.map} ↗</a>
          </aside>
        </div>
      </section>

      <section id="lugar" className="cl-band hk-place" aria-labelledby="lugar-h">
        <div className="cl-in hk-placegrid">
          <div className="hk-logo">
            <img src="/husky/husky-logo.png" width={559} height={560} alt={h.place.logoAlt} loading="lazy" decoding="async" />
          </div>
          <div className="hk-text">
            <span className="cl-label">{h.place.label}</span>
            <h2 id="lugar-h">{h.place.title}</h2>
            <p className="hk-lead">{h.place.p1}</p>
            <p>{h.place.p2}</p>
            <div className="cl-actions">
              <a className="cl-btn" href={IG} target="_blank" rel="noopener noreferrer">{h.place.ig} @huskycoffeeshop ↗</a>
              <a className="cl-btn" href={MAPS} target="_blank" rel="noopener noreferrer">{h.concept.map} ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section id="artistas" className="cl-band hk-artists" aria-labelledby="artistas-h">
        <div className="cl-in">
          <div className="cl-sechead">
            <span className="cl-label">{h.artists.label}</span>
            <h2 id="artistas-h">{h.artists.title}</h2>
            <p>{h.artists.lede}</p>
          </div>
          <ul className="hk-cards">
            {ARTISTS.map((a, i) => (
              <li key={a.id} className="hk-card" style={{ '--c': COLORS[i % COLORS.length] } as React.CSSProperties}>
                <figure className="hk-art">
                  <img src={a.art.src} width={a.art.w} height={a.art.h} alt={a.art[lang]} loading="lazy" decoding="async" />
                  {a.art.title && <figcaption>{a.art.title}</figcaption>}
                </figure>
                <h3>{a.name}</h3>
                {a.bio && (
                  <details>
                    <summary>{h.artists.bio}</summary>
                    <p lang={lang}>{BIOS[a.bio][lang]}</p>
                  </details>
                )}
                <a className="hk-more" href={`${STORE}/collections/vendors?q=${encodeURIComponent(a.vendor)}`}>{h.artists.shop} →</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="obra" className="cl-band cl-sell hk-works" aria-labelledby="obra-h">
        <div className="cl-in">
          <div className="cl-sechead">
            <span className="cl-label">{h.works.label}</span>
            <h2 id="obra-h">{h.works.title}</h2>
            <p>{h.works.lede}</p>
          </div>
          <ul className="hk-workgrid">
            {WORKS.map(w => (
              <li key={w.id} className={`hk-work${w.available ? '' : ' is-sold'}`}>
                <figure>
                  <img src={`/husky/${w.img}.jpg`} width={w.w} height={w.h} alt={w[lang].alt} loading="lazy" decoding="async" />
                </figure>
                <div className="hk-wbody">
                  <span className="hk-wartist">{w.artist}</span>
                  <h3>{w.title}</h3>
                  <p className="hk-tech">{w[lang].tech}</p>
                  <div className="hk-buy">
                    <b>{money(w.price)}</b>
                    <span className={`hk-status ${w.available ? 'ok' : 'off'}`}>{w.available ? h.works.available : h.works.sold}</span>
                  </div>
                  <a className="cl-btn hk-wlink" href={`${STORE}/products/${w.handle}`}>{w.available ? h.works.view : h.works.viewSold} →</a>
                </div>
              </li>
            ))}
          </ul>
          <p className="hk-note">{h.works.note}</p>
        </div>
      </section>

      <section id="dinamicas" className="cl-band hk-dynamics" aria-labelledby="dinamicas-h">
        <div className="cl-in">
          <div className="cl-sechead">
            <span className="cl-label">{h.dynamics.label}</span>
            <h2 id="dinamicas-h">{h.dynamics.title}</h2>
            <p>{h.dynamics.lede}</p>
          </div>
          <ul className="hk-dyn">
            {h.dynamics.cards.map(card => (
              <li key={card.tag}>
                <span className="cl-label">{card.tag}</span>
                <h3>{card.h}</h3>
                <p>{card.p}</p>
              </li>
            ))}
          </ul>
          <div className="hk-pw" role="group" aria-label={h.dynamics.photosLabel}>
            <span className="cl-label">{h.dynamics.photosLabel}</span>
            <ul>
              {pw.map((p, i) => (
                <li key={p.id}>
                  <figure className={`cl-pol hk-pol-${i}`}>
                    <img src={`/husky/pw/${p.id}.jpg`} width={p.w} height={p.h} alt={p[lang]} loading="lazy" decoding="async" />
                    <figcaption>{h.dynamics.photoBy}: {p.who} · @{p.ig}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <p className="hk-pwnote">{h.dynamics.photosNote}</p>
          </div>
          <div className="hk-people">
            <span className="cl-label">{h.dynamics.peopleTitle}</span>
            <ul>
              {PEOPLE.map(p => (
                <li key={p.ig}>
                  <a href={`https://www.instagram.com/${p.ig}/`} target="_blank" rel="noopener noreferrer">
                    <b>{p.name}</b><span>@{p.ig}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="cl-band cl-eventband hk-doc" aria-labelledby="doc-h">
        <div className="cl-in cl-evgrid">
          <div className="cl-evphoto">
            {photo(1, h.alt.p1)}
            <em className="cl-stamp cl-stamp-ev" aria-hidden="true">{h.doc.stamp.map(t => <span key={t}>{t}</span>)}</em>
            <small className="cl-credit">{h.credit}</small>
          </div>
          <div className="cl-evpanel">
            <span className="cl-label">{h.doc.label}</span>
            <h2 id="doc-h">{h.doc.title}</h2>
            <p>{h.doc.p1}</p>
            <p>{h.doc.p2}</p>
            <span className="cl-badge">{h.doc.badge}</span>
          </div>
        </div>
      </section>

      <section className="cl-band cl-heroband hk-cta" aria-labelledby="cta-h">
        <div className="cl-in hk-ctain">
          <h2 id="cta-h">{h.cta.title}</h2>
          <p className="cl-lede">{h.cta.text}</p>
          <div className="cl-actions">
            <a className="cl-fun" href={STORE}><span>{h.cta.shop}</span><i aria-hidden="true">→</i></a>
            <a className="cl-textlink" href={lp(lang, '/')}>{h.cta.home}</a>
          </div>
        </div>
      </section>
    </div>
  );
}
