import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { COPY, Copy, Lang } from './copy';
import './assets/styles/landing2.css';

/* Landing de cucoarts.com: tienda, cotizador artístico, registro de artistas para la tienda y eventos (próximamente).
   Sin backend: las solicitudes se arman como texto y salen por WhatsApp o correo (igual que cucoarts.com/rob). */

const LANG_KEY = 'cucoarts-lang';
const THEME_KEY = 'cucoarts-theme';
const WA = '528120321492';
const MAIL = 'hello@cucoarts.com';
const STORE = 'https://store.cucoarts.com';

type Theme = 'light' | 'dark';
type Vals = Record<string, string>;

const read = (k: string): string | null => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const write = (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };

function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    const s = read(LANG_KEY);
    if (s === 'es' || s === 'en') return s;
    return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  });
  useEffect(() => { document.documentElement.lang = lang; document.title = COPY[lang].htmlTitle; }, [lang]);
  useEffect(() => {
    const on = (e: StorageEvent) => { if (e.key === LANG_KEY && (e.newValue === 'es' || e.newValue === 'en')) setLang(e.newValue); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);
  const choose = useCallback((l: Lang) => { write(LANG_KEY, l); setLang(l); }, []);
  return [lang, choose];
}

/* Modo día / noche compartido con /rob: misma llave, sigue al sistema hasta que la persona elige. */
function useTheme(): [Theme, () => void] {
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

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select,textarea,[tabindex="0"]';

function Modal({ open, onClose, label, closeLabel, children }: { open: boolean; onClose: () => void; label: string; closeLabel: string; children: React.ReactNode }) {
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
      <div className="cl-modal-box" role="dialog" aria-modal="true" aria-label={label} ref={box}>
        <button type="button" className="cl-x" onClick={onClose} aria-label={closeLabel}>✕</button>
        {children}
      </div>
    </div>
  );
}

const Icon = {
  store: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18 11 8h26l3 10" /><path d="M8 18c0 3 2 5 5.3 5S18.7 21 18.7 18c0 3 2 5 5.3 5s5.3-2 5.3-5c0 3 2 5 5.4 5S40 21 40 18" /><path d="M10 23v17h28V23" /><rect x="15" y="28" width="8" height="12" /><rect x="27" y="28" width="7" height="6" /></svg>,
  quote: <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="7" width="30" height="26" /><rect x="14" y="12" width="20" height="16" /><path d="m17 25 5-6 4 4 3-3 3 5" /><circle cx="29.5" cy="16.5" r="1.6" /><path d="M16 33 12 43M32 33l4 10M24 33v6" /></svg>,
  sell: <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 24V8h16l20 20-16 16z" /><circle cx="15" cy="17" r="2.6" /><path d="M23 30l6 6" /></svg>,
  events: <svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="31" rx="2" /><path d="M7 19h34M16 6v8M32 6v8" /><path d="m24 25 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" /></svg>,
  globe: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" /></svg>,
  moon: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>,
  sun: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></svg>,
};

/* Obras de la tira de portada (sin personas), tomadas de la galería de /rob */
const ART: { id: string; w: number; h: number }[] = [
  { id: 'karisma-01', w: 601, h: 800 },
  { id: 'lucha-01', w: 800, h: 800 },
  { id: 'consultorio-01', w: 600, h: 800 },
  { id: 'nupec-04', w: 601, h: 800 },
  { id: 'grill-05', w: 800, h: 600 },
];

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

/* ---------- resumen de solicitudes ---------- */
function quoteSummary(c: Copy, v: Vals): string {
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
  if (v.idea && v.idea.trim()) { L.push(''); L.push(v.idea.trim()); }
  return L.join('\n');
}

function sellSummary(c: Copy, v: Vals): string {
  const x = c.sell, s = c.sumSell, L: string[] = [s.head, ''];
  const add = (k: string, val?: string) => { if (val && val.trim()) L.push(`${k}: ${val.trim()}`); };
  add(s.nombre, v.nombre); add(s.correo, v.correo); add(s.ig, v.ig); add(s.portafolio, v.portafolio);
  add(s.opcion, (x.opts as Record<string, string>)[v.opcion]);
  if (v.opcion === 'condonacion') add(s.colab, v.colab);
  add(s.extras, v.extras);
  add(s.news, v.novedades === 'on' ? c.quote.yes : c.quote.no);
  return L.join('\n');
}

const toVals = (fd: FormData): Vals => {
  const o: Vals = {};
  Array.from(fd.entries()).forEach(([k, val]) => { o[k] = String(val); });
  return o;
};

function SummaryPanel({ c, summary, subject, intro, note, onEdit }: { c: Copy; summary: string; subject: string; intro: string; note?: string; onEdit: () => void }) {
  const [copied, setCopied] = useState(false);
  const wa = `https://wa.me/${WA}?text=${encodeURIComponent(summary)}`;
  const mail = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); } catch (e) { /* sin portapapeles */ }
    setCopied(true); window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="cl-done">
      <p>{intro}</p>
      <pre className="cl-sum">{summary}</pre>
      {note && <p className="cl-note">{note}</p>}
      <div className="cl-actions">
        <a className="cl-btn cl-primary" href={wa} target="_blank" rel="noopener noreferrer">{c.done.wa}</a>
        <a className="cl-btn" href={mail}>{c.done.mail}</a>
        <button type="button" className="cl-btn" onClick={copy}>{copied ? c.done.copied : c.done.copy}</button>
        <button type="button" className="cl-btn cl-ghost" onClick={onEdit}>{c.done.edit}</button>
      </div>
    </div>
  );
}

/* ---------- cotizador artístico (ventana) ---------- */
function QuoteBody({ c }: { c: Copy }) {
  const q = c.quote;
  const [tipo, setTipo] = useState('mural');
  const [vals, setVals] = useState<Vals | null>(null);
  const [err, setErr] = useState('');
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = toVals(new FormData(e.currentTarget));
    const tel = (v.tel || '').replace(/\D/g, '');
    if (!(v.nombre || '').trim()) { setErr(q.errName); return; }
    if (tel.length < 10) { setErr(q.errPhone); return; }
    setErr(''); setVals(v);
  };
  return (
    <>
      <span className="cl-label">{c.nav.quote}</span>
      <h3>{q.title}</h3>
      <p className="cl-sub">{q.intro}</p>
      <form className="cl-form" onSubmit={submit} noValidate hidden={!!vals}>
        <div className="cl-grid">
          <label className="cl-full">{q.type}
            <select name="tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
              {Object.entries(q.types).map(([k, t]) => <option key={k} value={k}>{t}</option>)}
            </select>
          </label>
          {tipo === 'mural' && (
            <fieldset className="cl-radios cl-full"><legend>{q.place}</legend>
              {Object.entries(q.places).map(([k, t], i) => <label key={k}><input type="radio" name="lugar" value={k} defaultChecked={i === 0} /> {t}</label>)}
            </fieldset>
          )}
          <div className="cl-full">
            <span className="cl-flabel">{q.size}</span>
            <div className="cl-dims">
              <label>{q.width}<input name="ancho" type="number" min="1" inputMode="decimal" /></label>
              <span aria-hidden="true">×</span>
              <label>{q.height}<input name="alto" type="number" min="1" inputMode="decimal" /></label>
              <label>{q.unit}<select name="unidad" defaultValue="m"><option value="cm">cm</option><option value="m">m</option></select></label>
            </div>
          </div>
          <label className="cl-full">{q.idea}
            <textarea name="idea" rows={4} placeholder={q.ideaHint} />
          </label>
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
      {vals && <SummaryPanel c={c} summary={quoteSummary(c, vals)} subject={c.mailSubjQuote} intro={q.intro2} onEdit={() => setVals(null)} />}
    </>
  );
}

/* ---------- registro de artistas para la tienda ---------- */
function SellSection({ c }: { c: Copy }) {
  const x = c.sell;
  const [opt, setOpt] = useState('paquete');
  const [vals, setVals] = useState<Vals | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const top = useRef<HTMLDivElement>(null);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const v = toVals(new FormData(form));
    const er: Record<string, string> = {};
    if (!(v.nombre || '').trim()) er.nombre = c.errors.name;
    if (!emailOk(v.correo || '')) er.correo = c.errors.email;
    if (!(v.ig || '').trim()) er.ig = c.errors.ig;
    if (!(v.portafolio || '').trim()) er.portafolio = c.errors.portfolio;
    if (v.consent !== 'on') er.consent = c.errors.consent;
    setErrs(er);
    const keys = Object.keys(er);
    if (keys.length) { (form.elements.namedItem(keys[0]) as HTMLElement | null)?.focus(); return; }
    setVals(v);
    window.setTimeout(() => top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };
  const fieldErr = (k: string) => (errs[k] ? <span className="cl-ferr" role="alert">{errs[k]}</span> : null);
  const [consentA, consentB] = x.consent.split('{privacy}');
  return (
    <section id="vende" className="cl-sell" aria-labelledby="vende-h">
      <div className="cl-sechead">
        <span className="cl-label">{x.label}</span>
        <h2 id="vende-h">{x.title}</h2>
        <p>{x.lede}</p>
      </div>
      <div className="cl-sellgrid">
        <div className="cl-pkg">
          <span className="cl-label">{x.pkgLabel}</span>
          <h3>{x.pkgTitle}</h3>
          <p className="cl-price"><b>{x.price}</b><span>{x.priceNote}</span></p>
          <ul>{x.items.map(i => <li key={i}>{i}</li>)}</ul>
          <div className="cl-alt"><b>{x.altTitle}</b><p>{x.altText}</p></div>
          <div className="cl-alt"><b>{x.ownTitle}</b><p>{x.ownText}</p></div>
        </div>
        <div className="cl-formbox" ref={top}>
          <h3>{x.formTitle}</h3>
          <form className="cl-form" onSubmit={submit} noValidate hidden={!!vals}>
            <div className="cl-grid">
              <label>{x.name} *<input name="nombre" autoComplete="name" required aria-invalid={!!errs.nombre} />{fieldErr('nombre')}</label>
              <label>{x.email} *<input name="correo" type="email" autoComplete="email" required aria-invalid={!!errs.correo} />{fieldErr('correo')}</label>
              <label>{x.ig} *<input name="ig" placeholder={x.igHint} required aria-invalid={!!errs.ig} />{fieldErr('ig')}</label>
              <label className="cl-full">{x.portfolio} *
                <textarea name="portafolio" rows={3} placeholder={x.portfolioHint} required aria-invalid={!!errs.portafolio} />{fieldErr('portafolio')}
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
            </div>
            <label className="cl-check"><input type="checkbox" name="consent" aria-invalid={!!errs.consent} /> <span>{consentA}<a href="/privacidad" target="_blank" rel="noopener noreferrer">{c.privacy}</a>{consentB}</span></label>
            {fieldErr('consent')}
            <label className="cl-check"><input type="checkbox" name="novedades" /> {x.news}</label>
            <div className="cl-actions"><button type="submit" className="cl-btn cl-primary">{x.submit}</button></div>
          </form>
          {vals && <SummaryPanel c={c} summary={sellSummary(c, vals)} subject={c.mailSubjSell} intro={x.intro} note={x.attachNote} onEdit={() => setVals(null)} />}
        </div>
      </div>
    </section>
  );
}

/* ---------- página ---------- */
export default function Landing() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const c = COPY[lang];
  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'landing');
    return () => document.documentElement.removeAttribute('data-page');
  }, []);

  const dark = theme === 'dark';
  return (
    <div className="cl">
      <div className="cl-wrap">
        <header className="cl-top">
          <a className="cl-logo" href="/"><span className="cl-sr">CUCO ARTS</span></a>
          <nav className="cl-nav" aria-label={c.nav.label}>
            <a href={STORE}>{c.nav.store}</a>
            <button type="button" onClick={() => setQuoteOpen(true)}>{c.nav.quote}</button>
            <a href="#vende">{c.nav.sell}</a>
            <span className="cl-soon" aria-disabled="true">{c.nav.events} · {c.footerSoon.toLowerCase()}</span>
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

        <section className="cl-hero">
          <div className="cl-herotext">
            <span className="cl-label">{c.hero.label}</span>
            <h1>{c.hero.title}</h1>
            <p className="cl-lede">{c.hero.lede}</p>
            <div className="cl-actions">
              <a className="cl-btn cl-primary cl-big" href={STORE}>{c.hero.cta}</a>
              <a className="cl-btn cl-big" href="#acciones">{c.hero.cta2}</a>
            </div>
          </div>
          <div className="cl-mosaic" role="group" aria-label={c.strip}>
            {[[0, 4], [1, 3]].map((col, ci) => (
              <div className="cl-mcol" key={ci}>
                {col.map(i => (
                  <img key={ART[i].id} src={`/rob-galeria/${ART[i].id}.jpg`} width={ART[i].w} height={ART[i].h} alt={c.imgAlts[i]} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                ))}
              </div>
            ))}
          </div>
        </section>

        <section id="acciones" className="cl-actionsec" aria-labelledby="acciones-h">
          <h2 id="acciones-h">{c.actionsTitle}</h2>
          <div className="cl-cards">
            <a className="cl-card" href={STORE}>
              <span className="cl-icon">{Icon.store}</span>
              <h3>{c.cards.store.h}</h3><p>{c.cards.store.p}</p>
              <span className="cl-go">{c.cards.store.cta} <i aria-hidden="true">→</i></span>
            </a>
            <button type="button" className="cl-card" onClick={() => setQuoteOpen(true)}>
              <span className="cl-icon">{Icon.quote}</span>
              <h3>{c.cards.quote.h}</h3><p>{c.cards.quote.p}</p>
              <span className="cl-go">{c.cards.quote.cta} <i aria-hidden="true">→</i></span>
            </button>
            <a className="cl-card" href="#vende">
              <span className="cl-icon">{Icon.sell}</span>
              <h3>{c.cards.sell.h}</h3><p>{c.cards.sell.p}</p>
              <span className="cl-go">{c.cards.sell.cta} <i aria-hidden="true">→</i></span>
            </a>
            <div className="cl-card cl-disabled" aria-disabled="true">
              <span className="cl-icon">{Icon.events}</span>
              <h3>{c.cards.events.h}</h3><p>{c.cards.events.p}</p>
              <span className="cl-go cl-badge">{c.cards.events.cta}</span>
            </div>
          </div>
        </section>

        <SellSection c={c} />
      </div>

      <Modal open={quoteOpen} onClose={closeQuote} label={c.quote.title} closeLabel={c.done.close}>
        <QuoteBody c={c} />
      </Modal>
    </div>
  );
}
