import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COPY, Copy, Lang } from './copy';
import { POOL, PoolItem } from './pool';
import { FilePicker, Honeypot, Fallback, Sent, useSender, Vals } from './shared';
import MuralWizard from './MuralWizard';
import ObraWizard from './ObraWizard';
import { applySeo } from './seo';
import SiteMenu, { buildMenu } from './SiteMenu';
import { Cycler } from './Cycler';
import { useLang, lp } from './lang';
import { FAQ } from './faqData';
import { PHOTOS, COVER, Photo } from './muralesPhotos';
import { thumbSrc } from './MuralGallery';
import { OBRAS, Obra } from './obraData';
import './assets/styles/landing2.css';

/* Landing de cucoarts.com. Sigue la guía de estilo de la marca: bloques de color plano, titulares en mayúsculas,
   Courier para los datos, sellos rotados y fotografía de Monterrey. Las solicitudes (cotizador y registro de artistas)
   se guardan en el servidor (backend/lambda/requests) y llegan por correo; si el servidor falla, la persona puede
   mandarlas por WhatsApp o correo con el mismo mensaje. */

const THEME_KEY = 'cucoarts-theme';
export const STORE = 'https://store.cucoarts.com';

/* Las respuestas de las preguntas frecuentes son texto plano (también alimentan los datos estructurados de Google);
   al mostrarlas se convierten en enlace las direcciones conocidas: la tienda y la página de HUSKY. */
const FAQ_LINK = /(store\.cucoarts\.com|cucoarts\.com\/(?:en\/)?husky)/;
const faqText = (a: string): React.ReactNode[] => a.split(FAQ_LINK).map((part, i) => {
  if (i % 2 === 0) return part;
  const external = part.startsWith('store.');
  return <a key={i} href={external ? STORE : part.replace('cucoarts.com', '')} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{part}</a>;
});

export type Theme = 'light' | 'dark';

const read = (k: string): string | null => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

/* Modo día / noche compartido con /rob: misma llave, sigue al sistema hasta que la persona elige. */
export function useTheme(): [Theme, () => void] {
  const mq = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
  const [choice, setChoice] = useState<Theme | null>(() => {
    const s = read(THEME_KEY) || read('rob-theme');
    return s === 'dark' || s === 'light' ? s : null;
  });
  const [sys, setSys] = useState(mq.matches);
  useEffect(() => { const on = () => setSys(mq.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }, [mq]);
  useEffect(() => {
    if (choice) document.documentElement.dataset.theme = choice;
    return () => { delete document.documentElement.dataset.theme; };
  }, [choice]);
  useEffect(() => {
    const on = (e: StorageEvent) => { if (e.key === THEME_KEY && (e.newValue === 'dark' || e.newValue === 'light')) setChoice(e.newValue); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  const theme: Theme = choice ?? (sys ? 'dark' : 'light');
  const toggle = useCallback(() => { const n: Theme = theme === 'dark' ? 'light' : 'dark'; write(THEME_KEY, n); setChoice(n); }, [theme]);
  return [theme, toggle];
}

/* ---------- selección al azar de las imágenes de la portada ---------- */
const shuffle = <T,>(a: T[]): T[] => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [b[i], b[k]] = [b[k], b[i]]; } return b; };
const keyOf = (p: PoolItem) => p.who || p.zone;

/** 4 imágenes distintas: siempre al menos 1 fotografía de las zonas y 1 obra de la tienda; las otras 2 salen de todo el conjunto. */
function pickFour(): PoolItem[] {
  const fotos = shuffle(POOL.filter(p => p.kind === 'foto'));
  const obras = shuffle(POOL.filter(p => p.kind === 'obra'));
  const chosen: PoolItem[] = [fotos[0], obras[0]];
  for (const p of shuffle(POOL)) {
    if (chosen.length === 4) break;
    if (chosen.some(x => x.id === p.id || keyOf(x) === keyOf(p))) continue;   // sin repetir artista ni fotógrafo
    chosen.push(p);
  }
  return shuffle(chosen);
}
const pickEvent = (exclude: PoolItem[]): PoolItem => shuffle(POOL.filter(p => p.kind === 'foto' && !exclude.some(x => x.id === p.id)))[0];

const creditLine = (c: Copy, p: PoolItem) =>
  p.kind === 'obra' ? `${c.credit.art} ${p.who}` : p.who ? `${c.credit.photo}: ${p.who} · ${p.zone}` : `${c.credit.zone} · ${p.zone}`;

/* ---------- ventana (cotizador) ---------- */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select,textarea,[tabindex="0"]';

function Modal({ open, onClose, label, closeLabel, wide, children }: { open: boolean; onClose: () => void; label: string; closeLabel: string; wide?: boolean; children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !box.current) return;
      const f = Array.from(box.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(x => x.offsetParent !== null);
      if (!f.length) return;
      const i = f.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    box.current?.querySelector<HTMLElement>('select,input,textarea')?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="cl-modal" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`cl-modal-box${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={label} ref={box}>
        <button type="button" className="cl-x" onClick={onClose} aria-label={closeLabel}>✕</button>
        {children}
      </div>
    </div>
  );
}

export const Icon = {
  globe: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" /></svg>,
  moon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>,
  sun: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></svg>,
};

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

/* ---------- resumen de solicitudes ---------- */
const fileNames = (files: File[]) => files.map(f => f.name).join(', ');

function quoteSummary(c: Copy, v: Vals, files: File[]): string {
  const q = c.quote, s = c.sumQuote, L: string[] = [s.head, ''];
  const add = (k: string, val?: string) => { if (val && val.trim()) L.push(`${k}: ${val.trim()}`); };
  add(s.tipo, (q.types as Record<string, string>)[v.tipo] || v.tipo);
  if (v.tipo === 'mural') add(s.lugar, (q.places as Record<string, string>)[v.lugar]);
  if (v.ancho && v.alto) add(s.medidas, `${v.ancho} × ${v.alto} ${v.unidad}`);
  add(s.presupuesto, q.budgets[Number(v.presupuesto) || 0]);
  add(s.ciudad, v.ciudad);
  if (v.fecha) { const [y, m, d] = v.fecha.split('-'); add(s.fecha, `${+d}/${+m}/${y}`); }
  add(s.factura, v.factura === 'si' ? q.yes : q.no);
  add(s.nombre, v.nombre); add(s.tel, v.tel); add(s.correo, v.correo);
  add(s.news, v.novedades === 'on' ? q.yes : q.no);
  if (files.length) add(s.archivos, fileNames(files));
  if (v.idea && v.idea.trim()) { L.push(''); L.push(v.idea.trim()); }
  return L.join('\n');
}

function sellSummary(c: Copy, v: Vals, files: File[]): string {
  const x = c.sell, s = c.sumSell, L: string[] = [s.head, ''];
  const add = (k: string, val?: string) => { if (val && val.trim()) L.push(`${k}: ${val.trim()}`); };
  add(s.nombre, v.nombre); add(s.correo, v.correo); add(s.ig, v.ig); add(s.portafolio, v.portafolio);
  add(s.opcion, (x.opts as Record<string, string>)[v.opcion]);
  if (v.opcion === 'condonacion') add(s.colab, v.colab);
  add(s.extras, v.extras);
  if (files.length) add(s.archivos, fileNames(files));
  add(s.news, v.novedades === 'on' ? c.quote.yes : c.quote.no);
  return L.join('\n');
}

const toVals = (fd: FormData): Vals => {
  const o: Vals = {};
  Array.from(fd.entries()).forEach(([k, val]) => { if (typeof val === 'string') o[k] = val; });
  return o;
};

/* ---------- cotizador artístico (ventana) ---------- */
/* Con "Mural" se muestra el asistente por pasos (MuralWizard); con "Pintura, dibujo o ilustración", el mismo asistente de /arte-por-encargo (ObraWizard);
   con las demás opciones, el formulario corto. */
function QuoteBody({ c, lang, onWide }: { c: Copy; lang: Lang; onWide: (w: boolean) => void }) {
  const q = c.quote;
  const [tipo, setTipo] = useState('mural');
  const [err, setErr] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const s = useSender(lang);
  useEffect(() => { onWide(tipo === 'mural' || tipo === 'arte'); return () => onWide(false); }, [tipo, onWide]);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = toVals(new FormData(e.currentTarget));
    const tel = (v.tel || '').replace(/\D/g, '');
    if (!(v.nombre || '').trim()) { setErr(q.errName); return; }
    if (tel.length < 10) { setErr(q.errPhone); return; }
    setErr('');
    s.send('quote', v, quoteSummary(c, v, s.files));
  };
  const summary = s.vals ? quoteSummary(c, s.vals, s.files) : '';
  return (
    <>
      <span className="cl-label">{c.nav.quote}</span>
      <h3>{q.title}</h3>
      <p className="cl-sub">{q.intro}</p>
      <label className="cl-typesel">{q.type}
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          {Object.entries(q.types).map(([k, t]) => <option key={k} value={k}>{t}</option>)}
        </select>
      </label>
      {tipo === 'mural' ? <MuralWizard c={c} lang={lang} /> : tipo === 'arte' ? <ObraWizard c={c} lang={lang} /> : (
        <>
          <form className="cl-form" onSubmit={submit} noValidate hidden={s.status !== 'idle'} ref={form}>
            <Honeypot />
            <input type="hidden" name="tipo" value={tipo} />
            <div className="cl-grid">
              <div className="cl-full">
                <span className="cl-flabel">{q.size}</span>
                <div className="cl-dims">
                  <label>{q.width}<input name="ancho" type="number" min="1" inputMode="decimal" /></label>
                  <span aria-hidden="true">×</span>
                  <label>{q.height}<input name="alto" type="number" min="1" inputMode="decimal" /></label>
                  <label>{q.unit}<select name="unidad" defaultValue="cm"><option value="cm">cm</option><option value="m">m</option></select></label>
                </div>
              </div>
              <label className="cl-full">{q.idea}
                <textarea name="idea" rows={4} placeholder={q.ideaHint} />
              </label>
              <FilePicker c={c} hint={c.files.hintQuote} files={s.files} onChange={s.setFiles} />
              <label>{q.budget}
                <select name="presupuesto" defaultValue="0">{q.budgets.map((b, i) => <option key={b} value={i}>{b}</option>)}</select>
              </label>
              <label>{q.city}<input name="ciudad" placeholder="Monterrey" /></label>
              <label>{q.date}<input name="fecha" type="date" /></label>
              <fieldset className="cl-radios"><legend>{q.invoice}</legend>
                <label><input type="radio" name="factura" value="si" /> {q.yes}</label>
                <label><input type="radio" name="factura" value="no" defaultChecked /> {q.no}</label>
              </fieldset>
              <label>{q.name} *<input name="nombre" autoComplete="name" required /></label>
              <label>{q.phone} *<input name="tel" type="tel" autoComplete="tel" inputMode="tel" placeholder="81 1234 5678" required /></label>
              <label className="cl-full">{q.email}<input name="correo" type="email" autoComplete="email" /></label>
            </div>
            {err && <p className="cl-err" role="alert">{err}</p>}
            <div className="cl-actions">
              <button type="submit" className="cl-btn cl-primary">{q.submit}</button>
              <span className="cl-note">{q.consentPre} <a href="/privacidad" target="_blank" rel="noopener noreferrer">{c.privacy}</a>.</span>
            </div>
            <label className="cl-check"><input type="checkbox" name="novedades" /> {q.news}</label>
          </form>
          {s.status === 'sending' && <p className="cl-sending" role="status">{c.status.sending}</p>}
          {s.status === 'sent' && <Sent c={c} result={s.result} text={c.status.sentQuote} onAgain={() => { form.current?.reset(); s.reset(true); }} />}
          {s.status === 'failed' && <Fallback c={c} summary={summary} subject={c.mailSubjQuote} onEdit={() => s.reset(false)} />}
        </>
      )}
    </>
  );
}

/* ---------- registro de artistas para la tienda (se despliega al pulsar) ---------- */
function SellSection({ c, lang, open, onToggle, sectionRef }: { c: Copy; lang: Lang; open: boolean; onToggle: () => void; sectionRef: React.RefObject<HTMLElement> }) {
  const x = c.sell;
  const [opt, setOpt] = useState('paquete');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const form = useRef<HTMLFormElement>(null);
  const s = useSender(lang);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = e.currentTarget;
    const v = toVals(new FormData(f));
    const er: Record<string, string> = {};
    if (!(v.nombre || '').trim()) er.nombre = c.errors.name;
    if (!emailOk(v.correo || '')) er.correo = c.errors.email;
    if (!(v.ig || '').trim()) er.ig = c.errors.ig;
    if (!/^https?:\/\/\S+\.\S+/i.test((v.portafolio || '').trim())) er.portafolio = c.errors.portfolio;
    if (v.consent !== 'on') er.consent = c.errors.consent;
    setErrs(er);
    const keys = Object.keys(er);
    if (keys.length) { (f.elements.namedItem(keys[0]) as HTMLElement | null)?.focus(); return; }
    s.send('sell', v, sellSummary(c, v, s.files));
  };
  const fieldErr = (k: string) => (errs[k] ? <span className="cl-ferr" role="alert">{errs[k]}</span> : null);
  const [consentA, consentB] = x.consent.split('{privacy}');
  const summary = s.vals ? sellSummary(c, s.vals, s.files) : '';
  return (
    <section id="vende" className="cl-band cl-sell" aria-labelledby="vende-h" ref={sectionRef}>
      <div className="cl-in">
        <div className="cl-sellhead">
          <div className="cl-sechead">
            <span className="cl-label">{x.label}</span>
            <h2 id="vende-h">{x.title}</h2>
            <p>{x.lede}</p>
          </div>
          <button type="button" className="cl-toggle" aria-expanded={open} aria-controls="vende-panel" onClick={onToggle}>
            <span>{open ? x.close : x.open}</span><i aria-hidden="true">{open ? '–' : '+'}</i>
          </button>
        </div>
        <div id="vende-panel" role="region" aria-labelledby="vende-h" hidden={!open} className="cl-panel">
          <div className="cl-sellgrid">
            <div className="cl-pkg">
              <span className="cl-label">{x.pkgLabel}</span>
              <h3>{x.pkgTitle}</h3>
              <div className="cl-price">
                <b>{x.price}</b><span>{x.priceNote}</span>
                <em className="cl-stamp cl-stamp-sm" aria-label={x.stamp.join(' ')}>{x.stamp.map(t => <span key={t}>{t}</span>)}</em>
              </div>
              <ul>{x.items.map(i => <li key={i}>{i}</li>)}</ul>
              <div className="cl-alt"><b>{x.altTitle}</b><p>{x.altText}</p></div>
              <div className="cl-alt"><b>{x.ownTitle}</b><p>{x.ownText}</p></div>
            </div>
            <div className="cl-formbox">
              <h3>{x.formTitle}</h3>
              <form className="cl-form" onSubmit={submit} noValidate hidden={s.status !== 'idle'} ref={form}>
                <Honeypot />
                <div className="cl-grid">
                  <label>{x.name} *<input name="nombre" autoComplete="name" required aria-invalid={!!errs.nombre} />{fieldErr('nombre')}</label>
                  <label>{x.email} *<input name="correo" type="email" autoComplete="email" required aria-invalid={!!errs.correo} />{fieldErr('correo')}</label>
                  <label>{x.ig} *<input name="ig" placeholder={x.igHint} required aria-invalid={!!errs.ig} />{fieldErr('ig')}</label>
                  <label className="cl-full">{x.portfolio} *
                    <input name="portafolio" type="url" inputMode="url" autoComplete="off" placeholder={x.portfolioHint} required aria-invalid={!!errs.portafolio} />
                    <span className="cl-note">{x.portfolioNote}</span>{fieldErr('portafolio')}
                  </label>
                  <fieldset className="cl-radios cl-col cl-full"><legend>{x.option}</legend>
                    {Object.entries(x.opts).map(([k, t]) => (
                      <label key={k}><input type="radio" name="opcion" value={k} checked={opt === k} onChange={() => setOpt(k)} /> {t}</label>
                    ))}
                  </fieldset>
                  {opt === 'condonacion' && (
                    <label className="cl-full">{x.collab}<textarea name="colab" rows={2} placeholder={x.collabHint} /></label>
                  )}
                  <label className="cl-full">{x.extras}<textarea name="extras" rows={3} placeholder={x.extrasHint} /></label>
                  <FilePicker c={c} hint={c.files.hintSell} files={s.files} onChange={s.setFiles} />
                </div>
                <label className="cl-check"><input type="checkbox" name="consent" aria-invalid={!!errs.consent} /> <span>{consentA}<a href="/privacidad" target="_blank" rel="noopener noreferrer">{c.privacy}</a>{consentB}</span></label>
                {fieldErr('consent')}
                <label className="cl-check"><input type="checkbox" name="novedades" /> {x.news}</label>
                <div className="cl-actions"><button type="submit" className="cl-btn cl-primary">{x.submit}</button></div>
              </form>
              {s.status === 'sending' && <p className="cl-sending" role="status">{c.status.sending}</p>}
              {s.status === 'sent' && <Sent c={c} result={s.result} text={c.status.sentSell} onAgain={() => { form.current?.reset(); s.reset(true); }} />}
              {s.status === 'failed' && <Fallback c={c} summary={summary} subject={c.mailSubjSell} onEdit={() => s.reset(false)} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* portadas de la sección de murales: tres proyectos reales (fotos editadas por Roberto) */
/* cada polaroid rota entre fotos de los proyectos (portada primero, sin carteles ni fotos del "antes") */
const muralSlots = (): Photo[][] => {
  const first = ['servimascota', 'citadel', 'via-cordillera'].map(id => PHOTOS[id][COVER[id] ?? 0]);
  const rest = shuffle(Object.values(PHOTOS).flat().filter(p => !p.tags.includes('antes') && !p.tags.includes('cartel') && !first.includes(p)));
  return first.map((f, k) => [f, ...rest.filter((_, j) => j % 3 === k).slice(0, 5)]);
};

/* portadas de la sección de arte por encargo: tres obras completas (ids de obraData) */
const artSlots = (): Obra[][] => {
  const first = ['c005', 'l024', 'l112'].map(id => OBRAS.find(o => o.id === id)).filter((o): o is Obra => !!o);
  const rest = shuffle(OBRAS.filter(o => !first.includes(o)));
  return first.map((f, k) => [f, ...rest.filter((_, j) => j % 3 === k).slice(0, 5)]);
};

/* ---------- página ---------- */
export default function Landing() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [quoteWide, setQuoteWide] = useState(true);
  const [hero] = useState<PoolItem[]>(pickFour);          // distintas en cada visita
  const [teaser] = useState<PoolItem>(() => pickEvent(hero));
  // cada polaroid de la portada rota entre imágenes de su misma orientación (para que no se mueva el diseño)
  const [heroLists] = useState<PoolItem[][]>(() => {
    const cls = (p: PoolItem) => { const r = p.w / p.h; return r < 0.85 ? 0 : r < 1.2 ? 1 : 2; };
    return hero.map(h => [h, ...shuffle(POOL.filter(p => cls(p) === cls(h) && !hero.some(x => x.id === p.id))).slice(0, 4)]);
  });
  const [muSlots] = useState<Photo[][]>(muralSlots);
  const [arSlots] = useState<Obra[][]>(artSlots);
  const sellRef = useRef<HTMLElement>(null);
  const c = COPY[lang];
  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);
  // SEO de la página (título, descripción, canónica, Open Graph y datos estructurados)
  useEffect(() => applySeo('home', lang), [lang]);

  const scrollToSell = useCallback(() => {
    window.setTimeout(() => sellRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }, []);
  const goSell = (e: React.MouseEvent) => { e.preventDefault(); setSellOpen(true); scrollToSell(); };
  useEffect(() => { if (window.location.hash === '#vende') { setSellOpen(true); scrollToSell(); } }, [scrollToSell]);

  const dark = theme === 'dark';
  const alt = (p: PoolItem) => (lang === 'en' ? p.en : p.es);
  const img = (p: PoolItem, eager?: boolean) => (
    <img src={`/landing-pool/${p.id}.jpg`} width={p.w} height={p.h} alt={alt(p)} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  );
  const columns = [[0, 2], [1, 3]];

  return (
    <div className="cl">
      <header className="cl-top cl-in">
        <a className="cl-logo" href={lp(lang, '/')}><span className="cl-sr">CUCO ARTS</span></a>
        <div className="cl-tools">
          <button type="button" className="cl-pill" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label={c.langBtn.label} title={c.langBtn.label}>
            {Icon.globe}<span>{c.langBtn.short}</span>
          </button>
          <button type="button" className="cl-pill" onClick={toggleTheme} aria-pressed={dark} aria-label={dark ? c.theme.toLight : c.theme.toDark}>
            {dark ? Icon.sun : Icon.moon}<span className="cl-hide-s">{dark ? c.theme.toLight : c.theme.toDark}</span>
          </button>
          <SiteMenu lang={lang} items={buildMenu(lang, c, 'home', { onQuote: () => setQuoteOpen(true), onSell: () => { setSellOpen(true); scrollToSell(); } })} />
        </div>
      </header>

      <section className="cl-band cl-heroband">
        <div className="cl-in">
          <div className="cl-corners" aria-hidden="true"><span>{c.hero.cornerL}</span><span>{c.hero.cornerR}</span></div>
          <div className="cl-hero">
            <div className="cl-herotext">
              <h1>{c.hero.title}</h1>
              <p className="cl-lede">{c.hero.lede}</p>
              <div className="cl-actions">
                <a className="cl-fun" href={STORE}><span>{c.hero.cta}</span><i aria-hidden="true">→</i></a>
                <a className="cl-textlink" href="#acciones">{c.hero.cta2} ↓</a>
              </div>
              <a className="cl-expopill" href={lp(lang, '/husky')}><i className="cl-dot" aria-hidden="true" /><span>{c.hero.expo}</span><b aria-hidden="true">→</b></a>
            </div>
            <div className="cl-pols" role="group" aria-label={c.hero.galleryLabel}>
              {columns.map((col, ci) => (
                <div className="cl-pcol" key={ci}>
                  {col.map((k, i) => (
                    <figure className={`cl-pol cl-pol-${ci * 2 + i}`} key={hero[k].id}>
                      <Cycler items={heroLists[k]} group="hero" keyOf={keyOf} offset={k * 1300} ms={6200} src={q => `/landing-pool/${q.id}.jpg`}
                        render={q => (
                          <>
                            <img src={`/landing-pool/${q.id}.jpg`} width={q.w} height={q.h} alt={alt(q)} loading={ci === 0 && i === 0 && q === hero[k] ? 'eager' : 'lazy'} decoding="async"
                              style={{ aspectRatio: `${hero[k].w} / ${hero[k].h}`, objectFit: 'cover' }} />
                            <figcaption>{creditLine(c, q)}</figcaption>
                          </>
                        )} />
                    </figure>
                  ))}
                </div>
              ))}
              <em className="cl-stamp cl-stamp-hero" aria-hidden="true">{c.hero.stamp.map(t => <span key={t}>{t}</span>)}</em>
            </div>
          </div>
        </div>
      </section>

      <section id="acciones" className="cl-band cl-actionband" aria-labelledby="acciones-h">
        <div className="cl-in">
          <h2 id="acciones-h">{c.actionsTitle}</h2>
          <ol className="cl-rows">
            <li><a className="cl-row" href={STORE}>
              <span className="cl-n">01</span>
              <span className="cl-rt"><b>{c.cards.store.h}</b><i>{c.cards.store.p}</i></span>
              <span className="cl-go">{c.cards.store.cta} →</span>
            </a></li>
            <li><button type="button" className="cl-row" onClick={() => setQuoteOpen(true)}>
              <span className="cl-n">02</span>
              <span className="cl-rt"><b>{c.cards.quote.h}</b><i>{c.cards.quote.p}</i></span>
              <span className="cl-go">{c.cards.quote.cta} →</span>
            </button></li>
            <li><a className="cl-row" href="#vende" onClick={goSell}>
              <span className="cl-n">03</span>
              <span className="cl-rt"><b>{c.cards.sell.h}</b><i>{c.cards.sell.p}</i></span>
              <span className="cl-go">{c.cards.sell.cta} →</span>
            </a></li>
            <li><a className="cl-row" href={lp(lang, '/husky')}>
              <span className="cl-n">04</span>
              <span className="cl-rt"><b>{c.cards.expo.h} <span className="cl-live">{c.nav.live}</span></b><i>{c.cards.expo.p}</i></span>
              <span className="cl-go">{c.cards.expo.cta} →</span>
            </a></li>
            <li><div className="cl-row cl-off" aria-disabled="true">
              <span className="cl-n">05</span>
              <span className="cl-rt"><b>{c.cards.events.h}</b><i>{c.cards.events.p}</i></span>
              <span className="cl-go cl-badge">{c.cards.events.cta}</span>
            </div></li>
          </ol>
        </div>
      </section>

      <section id="murales" className="cl-band cl-muralband" aria-labelledby="murales-h">
        <div className="cl-in cl-mugrid">
          <div className="cl-mupanel">
            <span className="cl-label">{c.murals.label}</span>
            <h2 id="murales-h">{c.murals.title}</h2>
            <p>{c.murals.text}</p>
            <div className="cl-actions">
              <a className="cl-mubtn" href={lp(lang, '/murales')}><span>{c.murals.cta}</span><i aria-hidden="true">→</i></a>
              <a className="cl-textlink" href={lp(lang, '/murales') + '#asistente'}>{c.murals.cta2} →</a>
            </div>
          </div>
          <a className="cl-mupics" href={lp(lang, '/murales')} aria-label={c.murals.cta}>
            {muSlots.map((list, i) => (
              <figure className={`cl-mupic cl-mupic-${i}`} key={list[0].dir + list[0].n}>
                <Cycler items={list} group="murales" keyOf={p => p.dir} offset={i * 1500} src={thumbSrc}
                  render={p => <img src={thumbSrc(p)} width={p.w} height={p.h} alt={c.murals.alt} loading="lazy" decoding="async" />} />
              </figure>
            ))}
            <em className="cl-stamp cl-stamp-mu" aria-hidden="true">{c.murals.stamp.map(t => <span key={t}>{t}</span>)}</em>
          </a>
        </div>
      </section>

      <section id="arte" className="cl-band cl-muralband cl-artband" aria-labelledby="arte-h">
        <div className="cl-in cl-mugrid">
          <div className="cl-mupanel">
            <span className="cl-label">{c.art.label}</span>
            <h2 id="arte-h">{c.art.title}</h2>
            <p>{c.art.text}</p>
            <div className="cl-actions">
              <a className="cl-mubtn" href={lp(lang, '/arte-por-encargo')}><span>{c.art.cta}</span><i aria-hidden="true">→</i></a>
              <a className="cl-textlink" href={lp(lang, '/arte-por-encargo') + '#como'}>{c.art.cta2} →</a>
            </div>
          </div>
          <a className="cl-mupics" href={lp(lang, '/arte-por-encargo')} aria-label={c.art.cta}>
            {arSlots.map((list, i) => (
              <figure className={`cl-mupic cl-mupic-${i}`} key={list[0].id}>
                <Cycler items={list} group="arte" keyOf={o => o.cuco || o.g} offset={i * 1500} src={o => `/obra/${o.id}.jpg`}
                  render={o => <img src={`/obra/${o.id}.jpg`} width={o.w} height={o.h} alt={c.art.alt} loading="lazy" decoding="async" />} />
              </figure>
            ))}
            <em className="cl-stamp cl-stamp-mu" aria-hidden="true">{c.art.stamp.map(t => <span key={t}>{t}</span>)}</em>
          </a>
        </div>
      </section>

      <section id="sobre" className="cl-band cl-about" aria-labelledby="sobre-h">
        <div className="cl-in cl-aboutgrid">
          <div className="cl-sechead">
            <span className="cl-label">{c.about.label}</span>
            <h2 id="sobre-h">{c.about.title}</h2>
          </div>
          <div className="cl-abouttext">
            {c.about.text.map(p => <p key={p}>{p}</p>)}
          </div>
        </div>
        <div className="cl-in">
          <div className="cl-zonebox">
            <div className="cl-zonecopy">
              <h3>{c.about.zonesTitle}</h3>
              <p>{c.about.zonesText}</p>
            </div>
            <div className="cl-zones" role="list" aria-label={c.about.zonesLabel}>
              {c.about.zones.map((z, i) => <span role="listitem" className={`cl-zone cl-zone-${i}`} key={z}>{z}</span>)}
              <span className="cl-badge">{c.about.soon}</span>
            </div>
          </div>
        </div>
      </section>

      <SellSection c={c} lang={lang} open={sellOpen} onToggle={() => setSellOpen(o => !o)} sectionRef={sellRef} />

      <section className="cl-band cl-eventband" aria-labelledby="eventos-h">
        <div className="cl-in cl-evgrid">
          <div className="cl-evphoto">
            {img(teaser)}
            <em className="cl-stamp cl-stamp-ev" aria-hidden="true">{c.events.stamp.map(t => <span key={t}>{t}</span>)}</em>
            <small className="cl-credit">{creditLine(c, teaser)}</small>
          </div>
          <div className="cl-evpanel">
            <span className="cl-label">{c.events.label}</span>
            <h2 id="eventos-h">{c.events.title}</h2>
            <p>{c.events.text}</p>
            <span className="cl-badge">{c.events.stampFull}</span>
          </div>
        </div>
      </section>

      <section id="faq" className="cl-band cl-faq" aria-labelledby="faq-h">
        <div className="cl-in">
          <h2 id="faq-h">{FAQ[lang].title}</h2>
          <div className="cl-faqlist">
            {FAQ[lang].items.map(i => (
              <details key={i.q}>
                <summary><span>{i.q}</span><i aria-hidden="true">+</i></summary>
                <p>{faqText(i.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Modal open={quoteOpen} onClose={closeQuote} label={c.quote.title} closeLabel={c.done.close} wide={quoteWide}>
        <QuoteBody c={c} lang={lang} onWide={setQuoteWide} />
      </Modal>
    </div>
  );
}
