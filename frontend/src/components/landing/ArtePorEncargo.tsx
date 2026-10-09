import React, { useEffect, useMemo } from 'react';
import { COPY } from './copy';
import ObraWizard from './ObraWizard';
import { Cycler } from './Cycler';
import HeroPols, { dealFour } from './HeroPols';
import { OBRAS } from './obraData';
import { Icon, STORE, useTheme } from './Landing';
import { useLang, lp } from './lang';
import { applySeo } from './seo';
import SiteMenu, { buildMenu } from './SiteMenu';
import './assets/styles/landing2.css';
import './assets/styles/murales.css';
import './assets/styles/obra.css';

/* cucoarts.com/arte-por-encargo (y /en/custom-art) — página propia de "Tu obra, a tu manera": pintura, dibujo, ilustración y grabado
   por encargo con artistas de la tienda y de la comunidad local de Monterrey. Misma estructura y estilo que /murales
   (clases cl-* de la landing y mp-* de murales); lo propio de esta página lleva el prefijo ap-. */

const STORE_SLUG: Record<string, string> = {
  'Ana Ahedo': 'ana-ahedo', 'Chema Chapa': 'chema-chapa', 'Correoppola': 'correoppola', 'Darío Diario': 'dario-diario', 'Eliezer Blanco': 'eliezer-blanco',
  'Frida Balderas': 'frida-balderas', 'Greometría': 'greometria', 'Jhoseph Mata': 'jmr', 'Lindara': 'lindara', 'Mina Martins': 'mina-martins',
  'Mizael Valero': 'mizael-valero', 'Porras Visual': 'porras-visual', 'Romualdo Castañeda': 'romualdo-castaneda', 'Salvador López': 'salvador-lopez', 'Tankez77': 'tankez77',
};
const COLORS = ['#F7D649', '#EA663D', '#067DFF', '#C7F74E'];

const TXT = {
  es: {
    nav: { label: 'Principal', home: 'Inicio', store: 'Tienda', murals: 'Murales' },
    label: 'CUCO ARTS × artistas locales',
    title: 'Tu obra, a tu manera',
    lede: 'Pintura, dibujo e ilustración hechos por artistas de Monterrey. Cuéntanos tu idea y te conectamos con el artista ideal.',
    cta: 'Encargar mi obra', cta2: 'Ver artistas',
    region: 'Asistente para encargar tu obra',
    galleryLabel: 'Obras de artistas de la tienda', captionPre: 'Obra de',
    types: {
      label: 'Qué puedes encargar', title: 'Una obra pensada para ti', lede: 'Elige la técnica que más te guste o déjanos orientarte según tu idea y tu espacio.',
      items: [
        { b: 'Pintura', s: 'Óleo, acrílico o acuarela sobre lienzo, madera o papel.' },
        { b: 'Dibujo', s: 'Lápiz, carbón o tinta: de lo más detallado a lo más gestual.' },
        { b: 'Ilustración', s: 'A mano o digital, con la personalidad del artista que elijas.' },
        { b: 'Grabado', s: 'Linograbado, serigrafía y otras estampas de edición limitada.' },
      ],
    },
    how: {
      label: 'Cómo funciona', title: 'De tu idea a tu pared',
      steps: [
        { b: 'Cuéntanos tu idea', s: 'Responde unas preguntas rápidas: para qué es, qué tamaño, qué estilos te gustan.' },
        { b: 'Te proponemos artistas', s: 'De la tienda CUCO ARTS y de la comunidad local, según tu estilo y tu presupuesto.' },
        { b: 'Afinamos los detalles', s: 'Técnica, tamaño, tiempos y presupuesto, para que todos tengan claro qué se va a hacer.' },
        { b: 'Recibes tu obra', s: 'Nosotros administramos el proyecto hasta la entrega, con factura si la necesitas.' },
      ],
    },
    artists: {
      label: 'Artistas de la tienda', title: 'Obra original que ya puedes conocer', lede: 'Estos artistas tienen obra en la tienda CUCO ARTS: ahí puedes ver su estilo completo.',
      view: 'Ver en la tienda →',
    },
    wizard: { label: 'El asistente', title: 'Cuéntanos tu idea', lede: 'Toma unos minutos y no te compromete a nada: te respondemos con una propuesta.' },
    murals: { text: '¿Buscas pintar una pared completa?', cta: 'Conoce los murales →' },
  },
  en: {
    nav: { label: 'Main', home: 'Home', store: 'Store', murals: 'Murals' },
    label: 'CUCO ARTS × local artists',
    title: 'Art, made for you',
    lede: 'Paintings, drawings and illustrations made by artists from Monterrey. Tell us your idea and we connect you with the right artist.',
    cta: 'Commission my artwork', cta2: 'See artists',
    region: 'Assistant to commission your artwork',
    galleryLabel: 'Artworks by store artists', captionPre: 'Work by',
    types: {
      label: 'What you can commission', title: 'Artwork designed for you', lede: 'Pick the technique you like best or let us guide you based on your idea and your space.',
      items: [
        { b: 'Painting', s: 'Oil, acrylic or watercolor on canvas, wood or paper.' },
        { b: 'Drawing', s: 'Pencil, charcoal or ink: from the most detailed to the most gestural.' },
        { b: 'Illustration', s: 'By hand or digital, with the personality of the artist you choose.' },
        { b: 'Print', s: 'Linocut, screen print and other limited-edition prints.' },
      ],
    },
    how: {
      label: 'How it works', title: 'From your idea to your wall',
      steps: [
        { b: 'Tell us your idea', s: 'Answer a few quick questions: what it is for, what size, which styles you like.' },
        { b: 'We suggest artists', s: 'From the CUCO ARTS store and the local community, based on your style and budget.' },
        { b: 'We fine-tune the details', s: 'Technique, size, timing and budget, so everyone is clear on what will be made.' },
        { b: 'You receive your artwork', s: 'We manage the project through delivery, with an invoice if you need one.' },
      ],
    },
    artists: {
      label: 'Store artists', title: 'Original work you can already explore', lede: 'These artists have work in the CUCO ARTS store: you can see their full style there.',
      view: 'See in the store →',
    },
    wizard: { label: 'The assistant', title: 'Tell us your idea', lede: "It takes a few minutes and commits you to nothing: we'll reply with a proposal." },
    murals: { text: 'Looking to paint a whole wall?', cta: 'Discover murals →' },
  },
};

// obras de muestra por técnica (ids de obraData); la primera es la que se ve al cargar y las demás rotan
const SAMPLE: string[][] = [
  ['l023', 'l024', 'l021', 'l017', 'l018', 'c001'],
  ['l022', 'l091', 'l098', 'l087', 'l105', 'l048'],
  ['l108', 'l078', 'l110', 'l056', 'l052', 'l053'],
  ['c011', 'c068', 'c121', 'c134', 'c136', 'c119'],
];

export default function ArtePorEncargo() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const c = COPY[lang];
  const t = TXT[lang];
  const dark = theme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);
  useEffect(() => applySeo('arte', lang), [lang]);
  // enlaces con ancla desde la portada (/arte-por-encargo#asistente): en una app de una sola página el navegador no baja solo
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const tm = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    return () => window.clearTimeout(tm);
  }, []);

  // artistas de la tienda con sus obras (la primera se ve al cargar y las demás rotan)
  const cuco = useMemo(() => {
    const g: Record<string, typeof OBRAS> = {};
    OBRAS.filter(o => o.cuco).forEach(o => { (g[o.cuco!] = g[o.cuco!] || []).push(o); });
    return Object.entries(g).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, []);

  // collage del encabezado: obra de los artistas de la tienda, repartida al azar en cada visita (un artista por cuadro)
  const heroSets = useMemo(() => dealFour(OBRAS.filter(o => o.cuco).map(o => ({
    src: `/obra/${o.id}.jpg`, w: o.w, h: o.h, alt: `${t.captionPre} ${o.cuco}`, caption: `${t.captionPre} ${o.cuco}`, key: o.cuco!,
  }))), [t]);

  return (
    <div className="cl mp ap">
      <header className="cl-top cl-in">
        <a className="cl-logo" href={lp(lang, '/')}><span className="cl-sr">CUCO ARTS</span></a>
        <div className="cl-tools">
          <button type="button" className="cl-pill" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={c.langBtn.label} title={c.langBtn.label}>
            {Icon.globe}<span>{c.langBtn.short}</span>
          </button>
          <button type="button" className="cl-pill" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? c.theme.toLight : c.theme.toDark}>
            {dark ? Icon.sun : Icon.moon}<span className="cl-hide-s">{dark ? c.theme.toLight : c.theme.toDark}</span>
          </button>
          <SiteMenu lang={lang} items={buildMenu(lang, c, 'arte')} />
        </div>
      </header>

      <section className="cl-band mp-intro ap-intro">
        <div className="cl-in cl-hero">
          <div className="cl-herotext">
            <span className="cl-label">{t.label}</span>
            <h1>{t.title}</h1>
            <p className="cl-lede">{t.lede}</p>
            <div className="cl-actions">
              <a className="cl-fun" href="#asistente"><span>{t.cta}</span><i aria-hidden="true">→</i></a>
              <a className="cl-textlink" href="#artistas">{t.cta2} ↓</a>
            </div>
          </div>
          <HeroPols sets={heroSets} label={t.galleryLabel} />
        </div>
      </section>

      <section id="tipos" className="cl-band mp-why" aria-labelledby="tipos-h">
        <div className="cl-in">
          <span className="cl-label">{t.types.label}</span>
          <h2 id="tipos-h">{t.types.title}</h2>
          <p className="mp-lead">{t.types.lede}</p>
          <div className="ap-types">
            {t.types.items.map((it, i) => {
              const list = SAMPLE[i].map(id => OBRAS.find(x => x.id === id)).filter((o): o is NonNullable<typeof o> => !!o);
              return (
                <div key={it.b} className="ap-type" style={{ ['--c' as string]: COLORS[i % COLORS.length] }}>
                  {list.length > 0 && (
                    <div className="ap-typeimg">
                      <Cycler items={list} group="tipos" keyOf={o => o.cuco || o.g} offset={i * 1100} ms={4600} src={o => `/obra/${o.id}.jpg`}
                        render={o => <img src={`/obra/${o.id}.jpg`} alt="" width={o.w} height={o.h} loading="lazy" decoding="async" />} />
                    </div>
                  )}
                  <b>{it.b}</b>
                  <span>{it.s}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="como" className="cl-band mp-exp" aria-labelledby="como-h">
        <div className="cl-in">
          <span className="cl-label">{t.how.label}</span>
          <h2 id="como-h">{t.how.title}</h2>
          <ol className="mp-steps">
            {t.how.steps.map((s, i) => (
              <li key={s.b}><span className="mp-n">{String(i + 1).padStart(2, '0')}</span><b>{s.b}</b><span>{s.s}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="artistas" className="cl-band mp-projects" aria-labelledby="artistas-h">
        <div className="cl-in">
          <span className="cl-label">{t.artists.label}</span>
          <h2 id="artistas-h">{t.artists.title}</h2>
          <p className="mp-lead">{t.artists.lede}</p>
          <ul className="ap-artists">
            {cuco.map(([name, list], k) => (
              <li key={name}>
                <a href={STORE_SLUG[name] ? `${STORE}/collections/${STORE_SLUG[name]}` : `${STORE}/search?q=${encodeURIComponent(name)}`}>
                  <span className="ap-aimg">
                    <Cycler items={list} offset={(k % 5) * 900} ms={5200} src={o => `/obra/${o.id}.jpg`}
                      render={o => <img src={`/obra/${o.id}.jpg`} alt="" width={o.w} height={o.h} loading="lazy" decoding="async" />} />
                  </span>
                  <b>{name}</b>
                  <i>{t.artists.view}</i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="asistente" className="cl-band mp-wrap" aria-labelledby="asistente-h">
        <div className="cl-in">
          <span className="cl-label">{t.wizard.label}</span>
          <h2 id="asistente-h">{t.wizard.title}</h2>
          <p className="mp-lead">{t.wizard.lede}</p>
          <div className="cl-modal-box wide mp-box" role="region" aria-label={t.region}>
            <ObraWizard c={c} lang={lang} />
          </div>
          <p className="ap-murals">{t.murals.text} <a href={lp(lang, '/murales')}>{t.murals.cta}</a></p>
        </div>
      </section>
    </div>
  );
}
