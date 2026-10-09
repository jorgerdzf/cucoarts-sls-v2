import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COPY } from './copy';
import MuralWizard from './MuralWizard';
import { MURALES, PROJECTS, Project } from './muralesCopy';
import { PHOTOS, COVER } from './muralesPhotos';
import { Lightbox, LbItem, MuralMosaic, thumbSrc, fullSrc } from './MuralGallery';
import { Cycler } from './Cycler';
import HeroPols, { dealFour } from './HeroPols';
import { Icon, useTheme } from './Landing';
import { MAIL } from './shared';
import { useLang, lp } from './lang';
import type { Lang } from './copy';
import { applySeo } from './seo';
import SiteMenu, { buildMenu } from './SiteMenu';
import './assets/styles/landing2.css';
import './assets/styles/murales.css';

/* cucoarts.com/murales (y /en/murals) — página propia de "Crea tu mural": argumentos para hacer un mural, nuestra experiencia,
   proyectos realizados (con videos, artistas y fotos), galería y el asistente (MuralWizard, el mismo que se abre en la ventana del
   cotizador de la portada). Se comparte con un enlace directo (por ejemplo por WhatsApp). Misma estructura y estilo que la landing
   (clases cl-*); lo propio lleva el prefijo mp-. */

const TXT = {
  es: {
    nav: { label: 'Principal', home: 'Inicio', store: 'Tienda' },
    label: 'CUCO ARTS × artistas locales',
    title: 'Crea tu mural',
    lede: 'Cuéntanos tu idea en unos pasos. Te conectamos con artistas locales de Monterrey y administramos el proyecto de principio a fin.',
    region: 'Asistente para crear tu mural',
    galleryLabel: 'Fotos de murales realizados', captionPre: 'Mural ·',
  },
  en: {
    nav: { label: 'Main', home: 'Home', store: 'Store' },
    label: 'CUCO ARTS × local artists',
    title: 'Create your mural',
    lede: 'Tell us your idea in a few steps. We connect you with local artists from Monterrey and manage the project from start to finish.',
    region: 'Mural creation assistant',
    galleryLabel: 'Photos of completed murals', captionPre: 'Mural ·',
  },
};

const COLORS = ['#F7D649', '#EA663D', '#067DFF', '#C7F74E'];
const shortName = (p: Project) => p.brand.split(' · ')[0];

type MText = (typeof MURALES)['es'];
type OnOpen = (items: LbItem[], start: number) => void;

/** Video de YouTube que se carga solo al pulsar (youtube-nocookie): no se descarga nada de YouTube hasta que la persona lo pide. */
function YouTube({ id, title, t }: { id: string; title: string; t: MText['projects'] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mp-video">
      <button type="button" className="cl-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        {open ? t.closeVideo : t.video} {open ? '✕' : '▶'}
      </button>
      {open && (
        <div className="mp-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <a className="cl-textlink" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">{t.openYT} ↗</a>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ p, lang, m, onOpen }: { p: Project; lang: Lang; m: MText; onOpen: OnOpen }) {
  const t = m.projects;
  const x = p[lang];
  const photos = PHOTOS[p.id] || [];
  const ci = COVER[p.id] ?? 0;
  const cover = photos[ci];
  const items = photos.map(photo => ({ photo, caption: shortName(p) }));
  // la portada rota entre las fotos del proyecto (sin carteles ni fotos del "antes"); al abrir la galería empieza en la que se estaba viendo
  const rot = cover ? [cover, ...photos.filter(q => q !== cover && !q.tags.includes('antes') && !q.tags.includes('cartel'))] : [];
  const shown = useRef(cover);
  const openAt = () => onOpen(items, Math.max(0, photos.indexOf(shown.current || cover)));
  const people = p.artists.length > 1 ? t.artists : t.artist;
  return (
    <article className={`mp-proj mp-${p.status}`} id={p.id}>
      {cover ? (
        <button type="button" className="mp-cover" onClick={openAt} aria-label={`${t.gallery}: ${x.title} (${photos.length})`}>
          <Cycler items={rot} offset={(Array.from(p.id).reduce((n, ch) => n + ch.charCodeAt(0), 0) % 5) * 700} ms={4800} src={thumbSrc} onChange={q => { shown.current = q; }}
            render={q => (
              <img
                src={thumbSrc(q)}
                srcSet={`${thumbSrc(q)} 640w, ${fullSrc(q)} 1600w`}
                sizes="(min-width: 900px) 33vw, (min-width: 640px) 50vw, 100vw"
                width={q.w} height={q.h} alt={x.title} loading="lazy" decoding="async" />
            )} />
          <span className="mp-chip">{t.status[p.status]}</span>
          <span className="mp-count-b">{photos.length} {t.photos}</span>
        </button>
      ) : (
        <div className="mp-ph" style={{ background: p.color }}><span className="mp-chip">{t.status[p.status]}</span><span className="mp-year">{p.when || ''}</span></div>
      )}
      <div className="mp-pbody">
        <div className="mp-brandrow">
          {p.logo && <img className={`mp-logo ${p.logo.bg}`} src={p.logo.src} alt="" loading="lazy" decoding="async" />}
          <p className="mp-brand">{p.brand}</p>
        </div>
        <ul className="mp-roles" aria-label={t.role}>{p.roles.map(r => <li key={r}>{m.roles[r]}</li>)}</ul>
        <h3>{x.title}</h3>
        <p>{x.text}</p>
        <dl className="mp-facts">
          <div><dt>{t.role}</dt><dd>{x.role}</dd></div>
          <div><dt>{t.why}</dt><dd>{x.why}</dd></div>
        </dl>
        {p.artists.length > 0 && (
          <p className="mp-people">
            <b>{people}:</b>{' '}
            {p.artists.map((a, i) => (
              <React.Fragment key={a.ig}>{i > 0 && ', '}<a href={a.ig} target="_blank" rel="noopener noreferrer">{a.name} ↗</a></React.Fragment>
            ))}
          </p>
        )}
        {p.collab && (
          <p className="mp-people"><b>{t.collab}:</b> <a href={p.collab.ig} target="_blank" rel="noopener noreferrer">{p.collab.name} ↗</a></p>
        )}
        <ul className="mp-tags">{[...(p.when ? [p.when] : []), ...x.tags].map(g => <li key={g}>{g}</li>)}</ul>
        <div className="mp-actions">
          {photos.length > 0 && <button type="button" className="cl-btn" onClick={openAt}>{t.gallery} ({photos.length})</button>}
          {p.video && p.video.kind === 'youtube' && <YouTube id={p.video.id} title={x.title} t={t} />}
          {p.video && p.video.kind === 'link' && (
            <a className="cl-btn" href={p.video.url} target="_blank" rel="noopener noreferrer">{p.video.label[lang]} ↗</a>
          )}
          {p.link && <a className="cl-textlink" href={p.link.url} target="_blank" rel="noopener noreferrer">{p.link.label[lang]} ↗</a>}
          {x.extra && <a className="cl-fun" href={`mailto:${MAIL}?subject=${encodeURIComponent(x.title)}`}><span>{t.mail}</span><i aria-hidden="true">→</i></a>}
        </div>
        {x.extra && <p className="mp-extra">{x.extra}</p>}
      </div>
    </article>
  );
}

export default function Murales() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const [lb, setLb] = useState<{ items: LbItem[]; start: number } | null>(null);
  const c = COPY[lang];
  const t = TXT[lang];
  const m = MURALES[lang];
  const dark = theme === 'dark';
  const names = useMemo(() => Object.fromEntries(PROJECTS.map(p => [p.id, shortName(p)])), []);
  const open = useCallback<OnOpen>((items, start) => setLb({ items, start }), []);
  const close = useCallback(() => setLb(null), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);
  // SEO de la página (título, descripción, canónica, Open Graph y datos estructurados); va después del título genérico de useLang
  useEffect(() => applySeo('murales', lang), [lang]);
  // enlaces con ancla desde la portada (/murales#asistente): en una app de una sola página el navegador no baja solo
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    return () => window.clearTimeout(t);
  }, []);

  // collage del encabezado: fotos de los proyectos realizados (sin carteles ni fotos del "antes"), repartidas al azar en cada visita
  const heroSets = useMemo(() => dealFour(PROJECTS.filter(p => p.status !== 'proposed').flatMap(p =>
    (PHOTOS[p.id] || []).filter(q => !q.tags.includes('antes') && !q.tags.includes('cartel')).map(q => ({
      src: thumbSrc(q), w: q.w, h: q.h, alt: p[lang].title, caption: `${t.captionPre} ${shortName(p)}`, key: p.id,
    })))), [lang, t]);
  const done = PROJECTS.filter(p => p.status !== 'proposed');
  const proposed = PROJECTS.filter(p => p.status === 'proposed');

  return (
    <div className="cl mp">
      <header className="cl-top cl-in">
        <a className="cl-logo" href={lp(lang, '/')}><span className="cl-sr">CUCO ARTS</span></a>
        <div className="cl-tools">
          <button type="button" className="cl-pill" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={c.langBtn.label} title={c.langBtn.label}>
            {Icon.globe}<span>{c.langBtn.short}</span>
          </button>
          <button type="button" className="cl-pill" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? c.theme.toLight : c.theme.toDark}>
            {dark ? Icon.sun : Icon.moon}<span className="cl-hide-s">{dark ? c.theme.toLight : c.theme.toDark}</span>
          </button>
          <SiteMenu lang={lang} items={buildMenu(lang, c, 'murales')} />
        </div>
      </header>

      <section className="cl-band mp-intro">
        <div className="cl-in cl-hero">
          <div className="cl-herotext">
          <span className="cl-label">{t.label}</span>
          <h1>{t.title}</h1>
          <p className="cl-lede">{t.lede}</p>
          <div className="cl-actions">
            <a className="cl-fun" href="#asistente"><span>{m.hero.cta}</span><i aria-hidden="true">→</i></a>
            <a className="cl-textlink" href="#proyectos">{m.hero.cta2} ↓</a>
          </div>
          </div>
          <HeroPols sets={heroSets} label={t.galleryLabel} />
        </div>
      </section>

      <section id="por-que" className="cl-band mp-why" aria-labelledby="por-que-h">
        <div className="cl-in">
          <span className="cl-label">{m.why.label}</span>
          <h2 id="por-que-h">{m.why.title}</h2>
          <p className="mp-lead">{m.why.lede}</p>
          <div className="mp-cards">
            {m.why.items.map((it, i) => (
              <div key={it.b} className="mp-card" style={{ ['--c' as string]: COLORS[i % COLORS.length] }}>
                <span className="mp-n">{String(i + 1).padStart(2, '0')}</span>
                <b>{it.b}</b>
                <span>{it.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia" className="cl-band mp-exp" aria-labelledby="exp-h">
        <div className="cl-in">
          <span className="cl-label">{m.exp.label}</span>
          <h2 id="exp-h">{m.exp.title}</h2>
          <p className="mp-lead">{m.exp.lede}</p>
          <ol className="mp-steps mp-timeline">
            {m.exp.steps.map(s => (
              <li key={s.b}><span className="mp-n">{s.y}</span><b>{s.b}</b><span>{s.s}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="proyectos" className="cl-band mp-projects" aria-labelledby="proyectos-h">
        <div className="cl-in">
          <span className="cl-label">{m.projects.label}</span>
          <h2 id="proyectos-h">{m.projects.title}</h2>
          <p className="mp-lead">{m.projects.lede}</p>
          <div className="mp-grid">
            {done.map(p => <ProjectCard key={p.id} p={p} lang={lang} m={m} onOpen={open} />)}
          </div>
          {proposed.length > 0 && (
            <div className="mp-grid mp-grid-one">
              {proposed.map(p => <ProjectCard key={p.id} p={p} lang={lang} m={m} onOpen={open} />)}
            </div>
          )}
          <article className="mp-proj mp-yours">
            <div className="mp-pbody">
              <h3>{m.projects.yours.title}</h3>
              <p>{m.projects.yours.text}</p>
              <a className="cl-fun" href="#asistente"><span>{m.projects.yours.cta}</span><i aria-hidden="true">→</i></a>
            </div>
          </article>
        </div>
      </section>

      <section id="galeria" className="cl-band mp-gallery" aria-labelledby="galeria-h">
        <div className="cl-in">
          <span className="cl-label">{m.gallery.label}</span>
          <h2 id="galeria-h">{m.gallery.title}</h2>
          <p className="mp-lead">{m.gallery.lede}</p>
          <MuralMosaic names={names} text={m.gallery} onOpen={open} />
        </div>
      </section>

      <section id="como" className="cl-band mp-how" aria-labelledby="como-h">
        <div className="cl-in">
          <span className="cl-label">{m.how.label}</span>
          <h2 id="como-h">{m.how.title}</h2>
          <ol className="mp-steps">
            {m.how.steps.map((s, i) => (
              <li key={s.b}><span className="mp-n">{String(i + 1).padStart(2, '0')}</span><b>{s.b}</b><span>{s.s}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="asistente" className="cl-band mp-wrap" aria-labelledby="asistente-h">
        <div className="cl-in">
          <span className="cl-label">{m.wizard.label}</span>
          <h2 id="asistente-h">{m.wizard.title}</h2>
          <p className="mp-lead">{m.wizard.lede}</p>
          {/* mismas clases que la ventana del cotizador para reutilizar los estilos del asistente */}
          <div className="cl-modal-box wide mp-box" role="region" aria-label={t.region}>
            <MuralWizard c={c} lang={lang} />
          </div>
        </div>
      </section>

      {lb && <Lightbox items={lb.items} start={lb.start} t={m.gallery.lb} onClose={close} />}
    </div>
  );
}
