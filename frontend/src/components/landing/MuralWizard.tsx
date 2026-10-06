import React, { useEffect, useRef, useState } from 'react';
import { Copy, Lang } from './copy';
import { MURAL, MuralCopy } from './muralCopy';
import { AMBIENTE, CUANDO, LUGAR, Mural, MURALS, Opt, PRESUPUESTO, PROPOSITO, TAMANO } from './muralData';
import { FilePicker, Fallback, Sent, useSender } from './shared';

/* "Crea tu mural": asistente por pasos del cotizador artístico (se muestra cuando se elige "Mural").
   Una pregunta por pantalla, opciones en colores planos de la paleta, galería de estilos con zoom y envío al servidor. */

const STEPS = ['intro', 'proposito', 'espacio', 'estilos', 'ambiente', 'presupuesto', 'contacto'] as const;
type Step = typeof STEPS[number];
const COUNTED = STEPS.filter(s => s !== 'intro').length;

type Answers = {
  proposito: string; lugar: string; tamano: string; ancho: string; alto: string; estilos: number[]; ambiente: string[]; idea: string;
  presupuesto: string; cuando: string; fecha: string; factura: boolean; nombre: string; tel: string; correo: string; zona: string; novedades: boolean; website: string;
};
const EMPTY: Answers = {
  proposito: '', lugar: '', tamano: '', ancho: '', alto: '', estilos: [], ambiente: [], idea: '', presupuesto: '', cuando: '', fecha: '',
  factura: false, nombre: '', tel: '', correo: '', zona: '', novedades: false, website: '',
};

const fill = (t: string, vars: Record<string, string | number>) => t.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const colorVar = (o: Opt) => ({ ['--c' as string]: `var(--c-${o.color})` } as React.CSSProperties);

/* chispas de colores al elegir (se omiten si la persona pidió menos movimiento) */
function splash(e: React.MouseEvent) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#EA663D', '#F7D649', '#C7F74E', '#067DFF', '#644DEF'];
  const x = e.clientX || 0, y = e.clientY || 0;
  for (let i = 0; i < 8; i++) {
    const d = document.createElement('span'); d.className = 'mw-splash';
    const a = (i / 8) * Math.PI * 2, r = 28 + Math.random() * 26;
    d.style.cssText = `left:${x - 5}px;top:${y - 5}px;background:${cols[i % 5]};--x:${Math.cos(a) * r}px;--y:${Math.sin(a) * r}px`;
    document.body.appendChild(d); window.setTimeout(() => d.remove(), 750);
  }
}

function OptGrid({ items, texts, value, onPick }: { items: Opt[]; texts: Record<string, { t: string; s?: string }>; value: string; onPick: (id: string, e: React.MouseEvent) => void }) {
  return (
    <div className="mw-opts">
      {items.map(o => (
        <button key={o.id} type="button" className="mw-opt" style={colorVar(o)} aria-pressed={value === o.id} onClick={e => onPick(o.id, e)}>
          <span className="mw-sw" aria-hidden="true" />
          <b>{texts[o.id].t}</b>
          {texts[o.id].s && <small>{texts[o.id].s}</small>}
        </button>
      ))}
    </div>
  );
}

/* ---------- visor con zoom (rueda, pellizco, doble toque) ---------- */
function Lightbox({ m, mc, onClose }: { m: Mural; mc: MuralCopy; onClose: () => void }) {
  const stage = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const view = useRef({ s: 1, x: 0, y: 0 });
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number } | null>(null);
  const drag = useRef<{ x: number; y: number; sx: number; sy: number } | null>(null);
  const tap = useRef(0);
  const label = m.cuco ? `${m.cuco} · ${mc.estilos.tagCuco}` : `${mc.estilos.tagLocal} · ${String(m.n).padStart(2, '0')}`;

  const apply = () => { if (img.current) img.current.style.transform = `translate(${view.current.x}px,${view.current.y}px) scale(${view.current.s})`; };
  const zoomAt = (ns: number, cx: number, cy: number) => {
    const v = view.current; ns = Math.min(5, Math.max(1, ns));
    const r = stage.current!.getBoundingClientRect(), px = cx - (r.left + r.width / 2), py = cy - (r.top + r.height / 2);
    v.x = px - (px - v.x) * (ns / v.s); v.y = py - (py - v.y) * (ns / v.s); v.s = ns;
    if (ns === 1) { v.x = 0; v.y = 0; }
    apply();
  };

  useEffect(() => {
    const el = stage.current!;
    const wheel = (e: WheelEvent) => { e.preventDefault(); zoomAt(view.current.s * Math.exp(-e.deltaY * 0.0015), e.clientX, e.clientY); };
    el.addEventListener('wheel', wheel, { passive: false });
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); } };
    document.addEventListener('keydown', key, true);
    return () => { el.removeEventListener('wheel', wheel); document.removeEventListener('keydown', key, true); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const down = (e: React.PointerEvent) => {
    stage.current!.setPointerCapture(e.pointerId); ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.current.size === 2) { const [a, b] = Array.from(ptrs.current.values()); pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y) }; }
    else drag.current = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY };
  };
  const move = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId)) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && ptrs.current.size === 2) {
      const [a, b] = Array.from(ptrs.current.values()), d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(view.current.s * d / pinch.current.d, (a.x + b.x) / 2, (a.y + b.y) / 2); pinch.current.d = d;
    } else if (drag.current && view.current.s > 1) {
      view.current.x += e.clientX - drag.current.x; view.current.y += e.clientY - drag.current.y;
      drag.current.x = e.clientX; drag.current.y = e.clientY; apply();
    }
  };
  const up = (e: React.PointerEvent) => {
    ptrs.current.delete(e.pointerId); if (ptrs.current.size < 2) pinch.current = null;
    const d = drag.current; if (!d) return; drag.current = null;
    if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 6) return;
    const now = performance.now();
    if (now - tap.current < 300) { view.current.s > 1 ? zoomAt(1, e.clientX, e.clientY) : zoomAt(2.5, e.clientX, e.clientY); tap.current = 0; }
    else {
      tap.current = now;
      const b = img.current!.getBoundingClientRect();
      if (view.current.s === 1 && (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom)) onClose();
    }
  };

  return (
    <div className="mw-lb" role="dialog" aria-modal="true" aria-label={label}>
      <div className="mw-lb-bar"><span>{label}</span><button type="button" className="mw-lb-x" onClick={onClose} aria-label="✕" autoFocus>✕</button></div>
      <div className="mw-lb-stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <img ref={img} src={`/murales/full/${m.id}.jpg`} alt={m.cuco ? fill(mc.estilos.cucoLabel, { a: m.cuco }) : mc.estilos.localLabel} draggable={false} />
      </div>
    </div>
  );
}

/* ---------- asistente ---------- */
export default function MuralWizard({ c, lang }: { c: Copy; lang: Lang }) {
  const mc = MURAL[lang];
  const [a, setA] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [zoom, setZoom] = useState<Mural | null>(null);
  const top = useRef<HTMLDivElement>(null);
  const s = useSender(lang);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA(prev => ({ ...prev, [k]: v }));
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const go = (i: number) => { setStep(i); setErr(''); window.setTimeout(() => top.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 30); };
  const cur: Step = STEPS[step];

  const buildSummary = (): string => {
    const m = mc.sum, L: string[] = [m.head, ''];
    const add = (k: string, v?: string) => { if (v && v.trim()) L.push(`${k}: ${v.trim()}`); };
    add(m.nombre, a.nombre); add(m.tel, a.tel); add(m.correo, a.correo); add(m.zona, a.zona); L.push('');
    add(m.proposito, a.proposito && mc.proposito.o[a.proposito]?.t);
    add(m.donde, a.lugar && mc.espacio.lugar[a.lugar]?.t);
    add(m.tamano, a.tamano && `${mc.espacio.tamano[a.tamano].t} (${mc.espacio.tamano[a.tamano].s})`);
    if (a.ancho && a.alto) add(m.medidas, `${a.ancho} × ${a.alto} m`);
    const est = [...a.estilos].sort((x, y) => x - y).map(n => { const mu = MURALS[n - 1]; return mu.cuco ? `${mu.cuco} ${m.cucoSuffix}` : `${m.local} ${String(n).padStart(2, '0')}`; });
    add(m.estilos, est.join(', '));
    add(m.ambiente, a.ambiente.map(id => mc.ambiente.o[id].t).join(', '));
    add(m.presupuesto, a.presupuesto && mc.presupuesto.o[a.presupuesto].t);
    let when = a.cuando && mc.presupuesto.cuando[a.cuando].t;
    if (a.cuando === 'fecha' && a.fecha) { const [y, mo, d] = a.fecha.split('-'); when = `${+d}/${+mo}/${y}`; }
    add(m.cuando, when);
    add(m.factura, a.factura ? m.yes : m.no);
    if (s.files.length) add(m.fotos, s.files.map(f => f.name).join(', '));
    add(m.news, a.novedades ? m.yes : m.no);
    if (a.idea.trim()) { L.push(''); L.push(`${m.idea}: ${a.idea.trim()}`); }
    return L.join('\n');
  };

  const send = () => {
    const tel = a.tel.replace(/\D/g, '');
    if (!a.nombre.trim()) { setErr(mc.contacto.errName); return; }
    if (tel.length < 10) { setErr(mc.contacto.errPhone); return; }
    setErr('');
    const values: Record<string, string> = {
      tipo: 'mural', lugar: a.lugar, ancho: a.ancho, alto: a.alto, unidad: 'm', presupuesto: a.presupuesto && mc.presupuesto.o[a.presupuesto].t,
      ciudad: a.zona, fecha: a.cuando === 'fecha' ? a.fecha : '', factura: a.factura ? 'si' : 'no', idea: a.idea,
      nombre: a.nombre, tel: a.tel, correo: a.correo, novedades: a.novedades ? 'on' : '', website: a.website,
    };
    s.send('quote', values, buildSummary());
  };

  const next = () => (cur === 'contacto' ? send() : go(step + 1));
  const idx = STEPS.indexOf(cur);                               // 0 = intro
  const pct = cur === 'intro' ? 4 : (idx / COUNTED) * 100;

  // al cambiar de idioma con un error visible, se limpia para no mostrarlo en el idioma anterior
  useEffect(() => { setErr(''); }, [lang]);

  if (s.status !== 'idle') {
    const summary = buildSummary();
    return (
      <div className="mw" ref={top}>
        {s.status === 'sending' && <p className="cl-sending" role="status">{c.status.sending}</p>}
        {s.status === 'sent' && <Sent c={c} result={s.result} text={c.status.sentQuote} onAgain={() => { setA(EMPTY); setStep(0); s.reset(true); }} />}
        {s.status === 'failed' && <Fallback c={c} summary={summary} subject={mc.subject} onEdit={() => s.reset(false)} />}
      </div>
    );
  }

  const pick = (k: 'proposito' | 'lugar' | 'tamano' | 'presupuesto' | 'cuando') => (id: string, e: React.MouseEvent) => { set(k, id); splash(e); };

  return (
    <div className="mw" ref={top}>
      <div className="mw-progress">
        <div className="mw-bar"><i style={{ width: `${pct}%` }} /></div>
        <span className="mw-stepn">{cur === 'intro' ? mc.before : fill(mc.stepOf, { n: idx, t: COUNTED })}</span>
      </div>

      {cur === 'intro' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.intro.q}</h4>
          <p className="mw-hint">{mc.intro.hint}</p>
          <div className="mw-values">
            {mc.intro.values.map((v, i) => (
              <div key={v.b} style={{ ['--c' as string]: `var(--c-${(['yellow', 'sky', 'lime', 'mint'] as const)[i]})` } as React.CSSProperties}>
                <span className="mw-n">{String(i + 1).padStart(2, '0')}</span><b>{v.b}</b><span>{v.s}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {cur === 'proposito' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.proposito.q}</h4><p className="mw-hint">{mc.proposito.hint}</p>
          <OptGrid items={PROPOSITO} texts={mc.proposito.o} value={a.proposito} onPick={pick('proposito')} />
        </section>
      )}

      {cur === 'espacio' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.espacio.q}</h4><p className="mw-hint">{mc.espacio.hint}</p>
          <OptGrid items={LUGAR} texts={mc.espacio.lugar} value={a.lugar} onPick={pick('lugar')} />
          <div className="mw-sub">{mc.espacio.sizeTitle}</div>
          <OptGrid items={TAMANO} texts={mc.espacio.tamano} value={a.tamano} onPick={pick('tamano')} />
          <div className="mw-dims">
            <label>{mc.espacio.width}<input type="number" min="0" step="0.1" inputMode="decimal" placeholder={mc.espacio.optional} value={a.ancho} onChange={e => set('ancho', e.target.value)} /></label>
            <span aria-hidden="true">×</span>
            <label>{mc.espacio.height}<input type="number" min="0" step="0.1" inputMode="decimal" placeholder={mc.espacio.optional} value={a.alto} onChange={e => set('alto', e.target.value)} /></label>
          </div>
        </section>
      )}

      {cur === 'estilos' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.estilos.q}</h4><p className="mw-hint">{mc.estilos.hint}</p>
          <div className="mw-legend">
            <span><i />{mc.estilos.legendCuco}</span><span><i className="l" />{mc.estilos.legendLocal}</span>
            <span className="mw-count">{a.estilos.length ? fill(mc.estilos.count, { n: a.estilos.length }) : ''}</span>
          </div>
          <div className="mw-styles">
            {MURALS.map(m => {
              const on = a.estilos.includes(m.n);
              const label = m.cuco ? fill(mc.estilos.cucoLabel, { a: m.cuco }) : `${mc.estilos.localLabel} ${String(m.n).padStart(2, '0')}`;
              return (
                <div key={m.id} className={`mw-sty${m.cuco ? ' cuco' : ''}`}>
                  <button type="button" className="mw-sty-pick" aria-pressed={on} aria-label={label} onClick={e => { set('estilos', toggle(a.estilos, m.n)); if (!on) splash(e); }}>
                    <img src={`/murales/${m.id}.jpg`} alt="" loading="lazy" width={600} height={600} />
                    <span className="mw-sel" aria-hidden="true">✓</span>
                    <span className="mw-tag">{m.cuco ? <><b>{m.cuco}</b>{mc.estilos.tagCuco}</> : `${mc.estilos.tagLocal} · ${String(m.n).padStart(2, '0')}`}</span>
                  </button>
                  <button type="button" className="mw-zoom" onClick={() => setZoom(m)} aria-label={`${mc.estilos.zoom}: ${label}`}>+</button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {cur === 'ambiente' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.ambiente.q}</h4><p className="mw-hint">{mc.ambiente.hint}</p>
          <div className="mw-chips">
            {AMBIENTE.map(o => (
              <button key={o.id} type="button" className="mw-chip" style={colorVar(o)} aria-pressed={a.ambiente.includes(o.id)}
                onClick={e => { const on = a.ambiente.includes(o.id); set('ambiente', toggle(a.ambiente, o.id)); if (!on) splash(e); }}><i />{mc.ambiente.o[o.id].t}</button>
            ))}
          </div>
          <div className="mw-sub">{mc.ambiente.idea}</div>
          <textarea className="mw-ta" rows={4} placeholder={mc.ambiente.ideaHint} value={a.idea} onChange={e => set('idea', e.target.value)} />
          <div className="mw-sub">{mc.ambiente.photos}</div>
          <FilePicker c={c} hint={mc.ambiente.photosHint} files={s.files} onChange={s.setFiles} />
        </section>
      )}

      {cur === 'presupuesto' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.presupuesto.q}</h4><p className="mw-hint">{mc.presupuesto.hint}</p>
          <OptGrid items={PRESUPUESTO} texts={mc.presupuesto.o} value={a.presupuesto} onPick={pick('presupuesto')} />
          <div className="mw-sub">{mc.presupuesto.whenTitle}</div>
          <div className="mw-chips">
            {CUANDO.map(o => (
              <button key={o.id} type="button" className="mw-chip" style={colorVar(o)} aria-pressed={a.cuando === o.id} onClick={e => { set('cuando', o.id); splash(e); }}><i />{mc.presupuesto.cuando[o.id].t}</button>
            ))}
          </div>
          {a.cuando === 'fecha' && <label className="mw-date">{mc.presupuesto.date}<input type="date" value={a.fecha} onChange={e => set('fecha', e.target.value)} /></label>}
          <label className="mw-check"><input type="checkbox" checked={a.factura} onChange={e => set('factura', e.target.checked)} /> {mc.presupuesto.invoice}</label>
        </section>
      )}

      {cur === 'contacto' && (
        <section className="mw-step">
          <h4 className="mw-q">{mc.contacto.q}</h4><p className="mw-hint">{mc.contacto.hint}</p>
          <div className="mw-fields">
            <label>{mc.contacto.name} *<input autoComplete="name" value={a.nombre} onChange={e => set('nombre', e.target.value)} /></label>
            <label>{mc.contacto.phone} *<input type="tel" autoComplete="tel" inputMode="tel" placeholder="81 1234 5678" value={a.tel} onChange={e => set('tel', e.target.value)} /></label>
            <label>{mc.contacto.email}<input type="email" autoComplete="email" value={a.correo} onChange={e => set('correo', e.target.value)} /></label>
            <label>{mc.contacto.zone}<input placeholder={mc.contacto.zoneHint} value={a.zona} onChange={e => set('zona', e.target.value)} /></label>
          </div>
          <div className="cl-hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={a.website} onChange={e => set('website', e.target.value)} /></label></div>
          <label className="mw-check"><input type="checkbox" checked={a.novedades} onChange={e => set('novedades', e.target.checked)} /> {mc.contacto.news}</label>
          <p className="cl-note">{mc.contacto.consentPre} <a href="/privacidad" target="_blank" rel="noopener noreferrer">{c.privacy}</a>.</p>
        </section>
      )}

      {err && <p className="cl-err" role="alert">{err}</p>}
      <div className="mw-nav">
        <button type="button" className="cl-btn" onClick={() => go(Math.max(0, step - 1))} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>{mc.nav.back}</button>
        <button type="button" className="cl-btn cl-primary" onClick={next}>{cur === 'intro' ? mc.nav.start : cur === 'contacto' ? mc.nav.send : mc.nav.next}</button>
      </div>
      {zoom && <Lightbox m={zoom} mc={mc} onClose={() => setZoom(null)} />}
    </div>
  );
}
