import React, { useEffect, useRef, useState } from 'react';
import { Copy, Lang } from './copy';
import { OBRA } from './obraCopy';
import { OBRAS, OBRA_ROUNDS, Obra, obraByN } from './obraData';
import { O_AMBIENTE, O_CUANDO, O_PRESUPUESTO, O_PROPOSITO, O_TAMANO, O_TIPO } from './obraOpts';
import { OptGrid, ZoomView, colorVar, creditHref, fill, splash } from './MuralWizard';
import { FilePicker, Fallback, Sent, useSender } from './shared';

/* "Tu obra, a tu manera": asistente por pasos para encargar pintura, dibujo, ilustración o grabado.
   Misma mecánica y estilos que el asistente de murales (clases mw-*); la galería de estilos muestra obras COMPLETAS (sin recortar). */

const STEPS = ['intro', 'proposito', 'obra', 'estilos', 'ambiente', 'presupuesto', 'contacto'] as const;
type Step = typeof STEPS[number];
const COUNTED = STEPS.filter(s => s !== 'intro').length;

type Answers = {
  proposito: string; tipo: string; tamano: string; ancho: string; alto: string; marco: boolean; estilos: number[]; ambiente: string[]; idea: string;
  presupuesto: string; cuando: string; fecha: string; factura: boolean; nombre: string; tel: string; correo: string; zona: string; novedades: boolean; website: string;
};
const EMPTY: Answers = {
  proposito: '', tipo: '', tamano: '', ancho: '', alto: '', marco: false, estilos: [], ambiente: [], idea: '', presupuesto: '', cuando: '', fecha: '',
  factura: false, nombre: '', tel: '', correo: '', zona: '', novedades: false, website: '',
};

export default function ObraWizard({ c, lang }: { c: Copy; lang: Lang }) {
  const oc = OBRA[lang];
  const [a, setA] = useState<Answers>(EMPTY);
  const [step, setStep] = useState(0);
  const [err, setErr] = useState('');
  const [zoom, setZoom] = useState<Obra | null>(null);
  const [rounds, setRounds] = useState(1);   // rondas de la galería que ya se muestran
  const top = useRef<HTMLDivElement>(null);
  const s = useSender(lang);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA(prev => ({ ...prev, [k]: v }));
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);
  const go = (i: number) => { setStep(i); setErr(''); window.setTimeout(() => { const el = top.current; if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start', behavior: 'smooth' }); }, 30); };   // solo sube si el inicio del asistente quedó fuera de pantalla: así la botonera no se mueve
  const cur: Step = STEPS[step];
  const num = (n: number) => String(n).padStart(3, '0');

  const buildSummary = (): string => {
    const m = oc.sum, L: string[] = [m.head, ''];
    const add = (k: string, v?: string) => { if (v && v.trim()) L.push(`${k}: ${v.trim()}`); };
    add(m.nombre, a.nombre); add(m.tel, a.tel); add(m.correo, a.correo); add(m.zona, a.zona); L.push('');
    add(m.proposito, a.proposito && oc.proposito.o[a.proposito]?.t);
    add(m.tipo, a.tipo && oc.obra.tipo[a.tipo]?.t);
    add(m.tamano, a.tamano && `${oc.obra.tamano[a.tamano].t} (${oc.obra.tamano[a.tamano].s})`);
    if (a.ancho && a.alto) add(m.medidas, `${a.ancho} × ${a.alto} cm`);
    add(m.marco, a.marco ? m.yes : '');
    const est = [...a.estilos].sort((x, y) => x - y).map(n => { const o = obraByN(n); return o && o.cuco ? `${o.cuco} ${m.cucoSuffix}` : `${m.local} ${num(n)}`; });
    add(m.estilos, est.join(', '));
    add(m.ambiente, a.ambiente.map(id => oc.ambiente.o[id].t).join(', '));
    add(m.presupuesto, a.presupuesto && oc.presupuesto.o[a.presupuesto].t);
    let when = a.cuando && oc.presupuesto.cuando[a.cuando].t;
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
    if (!a.nombre.trim()) { setErr(oc.contacto.errName); return; }
    if (tel.length < 10) { setErr(oc.contacto.errPhone); return; }
    setErr('');
    const values: Record<string, string> = {
      tipo: 'obra por encargo', lugar: a.tipo ? oc.obra.tipo[a.tipo].t : '', ancho: a.ancho, alto: a.alto, unidad: 'cm', presupuesto: a.presupuesto && oc.presupuesto.o[a.presupuesto].t,
      ciudad: a.zona, fecha: a.cuando === 'fecha' ? a.fecha : '', factura: a.factura ? 'si' : 'no', idea: a.idea,
      nombre: a.nombre, tel: a.tel, correo: a.correo, novedades: a.novedades ? 'on' : '', website: a.website,
    };
    s.send('quote', values, buildSummary());
  };

  const next = () => (cur === 'contacto' ? send() : go(step + 1));
  const idx = STEPS.indexOf(cur);
  const pct = cur === 'intro' ? 4 : (idx / COUNTED) * 100;
  useEffect(() => { setErr(''); }, [lang]);

  if (s.status !== 'idle') {
    const summary = buildSummary();
    return (
      <div className="mw" ref={top}>
        {s.status === 'sending' && <p className="cl-sending" role="status">{c.status.sending}</p>}
        {s.status === 'sent' && <Sent c={c} result={s.result} text={c.status.sentQuote} onAgain={() => { setA(EMPTY); setStep(0); s.reset(true); }} />}
        {s.status === 'failed' && <Fallback c={c} summary={summary} subject={oc.subject} onEdit={() => s.reset(false)} />}
      </div>
    );
  }

  const pick = (k: 'proposito' | 'tipo' | 'tamano' | 'presupuesto' | 'cuando') => (id: string, e: React.MouseEvent) => { set(k, id); splash(e); };

  return (
    <div className="mw" ref={top}>
      <div className="mw-top">
        <button type="button" className="cl-btn" onClick={() => go(Math.max(0, step - 1))} style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>{oc.nav.back}</button>
        <div className="mw-progress">
          <div className="mw-bar"><i style={{ width: `${pct}%` }} /></div>
          <span className="mw-stepn">{cur === 'intro' ? oc.before : fill(oc.stepOf, { n: idx, t: COUNTED })}</span>
        </div>
        <button type="button" className="cl-btn cl-primary" onClick={next}>{cur === 'intro' ? oc.nav.start : cur === 'contacto' ? oc.nav.send : oc.nav.next}</button>
      </div>
      {err && <p className="cl-err" role="alert">{err}</p>}

      {cur === 'intro' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.intro.q}</h4>
          <p className="mw-hint">{oc.intro.hint}</p>
          <div className="mw-values">
            {oc.intro.values.map((v, i) => (
              <div key={v.b} style={{ ['--c' as string]: `var(--c-${(['yellow', 'sky', 'lime', 'mint'] as const)[i]})` } as React.CSSProperties}>
                <span className="mw-n">{String(i + 1).padStart(2, '0')}</span><b>{v.b}</b><span>{v.s}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {cur === 'proposito' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.proposito.q}</h4><p className="mw-hint">{oc.proposito.hint}</p>
          <OptGrid items={O_PROPOSITO} texts={oc.proposito.o} value={a.proposito} onPick={pick('proposito')} />
        </section>
      )}

      {cur === 'obra' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.obra.q}</h4><p className="mw-hint">{oc.obra.hint}</p>
          <OptGrid items={O_TIPO} texts={oc.obra.tipo} value={a.tipo} onPick={pick('tipo')} />
          <div className="mw-sub">{oc.obra.sizeTitle}</div>
          <OptGrid items={O_TAMANO} texts={oc.obra.tamano} value={a.tamano} onPick={pick('tamano')} />
          <div className="mw-dims">
            <label>{oc.obra.width}<input type="number" min="0" step="1" inputMode="decimal" placeholder={oc.obra.optional} value={a.ancho} onChange={e => set('ancho', e.target.value)} /></label>
            <span aria-hidden="true">×</span>
            <label>{oc.obra.height}<input type="number" min="0" step="1" inputMode="decimal" placeholder={oc.obra.optional} value={a.alto} onChange={e => set('alto', e.target.value)} /></label>
          </div>
          <label className="mw-check"><input type="checkbox" checked={a.marco} onChange={e => set('marco', e.target.checked)} /> {oc.obra.frame}</label>
        </section>
      )}

      {cur === 'estilos' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.estilos.q}</h4><p className="mw-hint">{oc.estilos.hint}</p>
          <div className="mw-legend">
            <span><i />{oc.estilos.legendCuco}</span><span><i className="l" />{oc.estilos.legendLocal}</span>
            <span className="mw-count">{a.estilos.length ? fill(oc.estilos.count, { n: a.estilos.length }) : ''}</span>
          </div>
          <div className="mw-styles mw-art">
            {OBRAS.filter(o => o.r < rounds).map(o => {
              const on = a.estilos.includes(o.n);
              const label = o.cuco ? fill(oc.estilos.cucoLabel, { a: o.cuco }) : `${oc.estilos.localLabel} ${num(o.n)}`;
              return (
                <div key={o.id} className={`mw-sty${o.cuco ? ' cuco' : ''}`}>
                  <button type="button" className="mw-sty-pick" aria-pressed={on} aria-label={label} onClick={e => { set('estilos', toggle(a.estilos, o.n)); if (!on) splash(e); }}>
                    <img src={`/obra/${o.id}.jpg`} alt="" loading="lazy" width={o.w} height={o.h} />
                    <span className="mw-sel" aria-hidden="true">✓</span>
                    <span className="mw-tag">{o.cuco ? <><b>{o.cuco}</b>{oc.estilos.tagCuco}</> : `${oc.estilos.tagLocal} · ${num(o.n)}`}</span>
                  </button>
                  <button type="button" className="mw-zoom" onClick={() => setZoom(o)} aria-label={`${oc.estilos.zoom}: ${label}`}>+</button>
                </div>
              );
            })}
          </div>
          <p className="mw-credit">{oc.estilos.credit} <a href={creditHref(oc.estilos, 'galería')}>{oc.estilos.creditCta}</a></p>
          {rounds < OBRA_ROUNDS && (
            <div className="mw-morewrap">
              <button type="button" className="cl-btn" onClick={() => setRounds(r => r + 1)}>
                {oc.estilos.more} (+{OBRAS.filter(o => o.r === rounds).length})
              </button>
            </div>
          )}
        </section>
      )}

      {cur === 'ambiente' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.ambiente.q}</h4><p className="mw-hint">{oc.ambiente.hint}</p>
          <div className="mw-chips">
            {O_AMBIENTE.map(o => (
              <button key={o.id} type="button" className="mw-chip" style={colorVar(o)} aria-pressed={a.ambiente.includes(o.id)}
                onClick={e => { const on = a.ambiente.includes(o.id); set('ambiente', toggle(a.ambiente, o.id)); if (!on) splash(e); }}><i />{oc.ambiente.o[o.id].t}</button>
            ))}
          </div>
          <div className="mw-sub">{oc.ambiente.idea}</div>
          <textarea className="mw-ta" rows={4} placeholder={oc.ambiente.ideaHint} value={a.idea} onChange={e => set('idea', e.target.value)} />
          <div className="mw-sub">{oc.ambiente.photos}</div>
          <FilePicker c={c} hint={oc.ambiente.photosHint} files={s.files} onChange={s.setFiles} />
        </section>
      )}

      {cur === 'presupuesto' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.presupuesto.q}</h4><p className="mw-hint">{oc.presupuesto.hint}</p>
          <OptGrid items={O_PRESUPUESTO} texts={oc.presupuesto.o} value={a.presupuesto} onPick={pick('presupuesto')} />
          <div className="mw-sub">{oc.presupuesto.whenTitle}</div>
          <div className="mw-chips">
            {O_CUANDO.map(o => (
              <button key={o.id} type="button" className="mw-chip" style={colorVar(o)} aria-pressed={a.cuando === o.id} onClick={e => { set('cuando', o.id); splash(e); }}><i />{oc.presupuesto.cuando[o.id].t}</button>
            ))}
          </div>
          {a.cuando === 'fecha' && <label className="mw-date">{oc.presupuesto.date}<input type="date" value={a.fecha} onChange={e => set('fecha', e.target.value)} /></label>}
          <label className="mw-check"><input type="checkbox" checked={a.factura} onChange={e => set('factura', e.target.checked)} /> {oc.presupuesto.invoice}</label>
        </section>
      )}

      {cur === 'contacto' && (
        <section className="mw-step">
          <h4 className="mw-q">{oc.contacto.q}</h4><p className="mw-hint">{oc.contacto.hint}</p>
          <div className="mw-fields">
            <label>{oc.contacto.name} *<input autoComplete="name" value={a.nombre} onChange={e => set('nombre', e.target.value)} /></label>
            <label>{oc.contacto.phone} *<input type="tel" autoComplete="tel" inputMode="tel" placeholder="81 1234 5678" value={a.tel} onChange={e => set('tel', e.target.value)} /></label>
            <label>{oc.contacto.email}<input type="email" autoComplete="email" value={a.correo} onChange={e => set('correo', e.target.value)} /></label>
            <label>{oc.contacto.zone}<input placeholder={oc.contacto.zoneHint} value={a.zona} onChange={e => set('zona', e.target.value)} /></label>
          </div>
          <div className="cl-hp" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={a.website} onChange={e => set('website', e.target.value)} /></label></div>
          <label className="mw-check"><input type="checkbox" checked={a.novedades} onChange={e => set('novedades', e.target.checked)} /> {oc.contacto.news}</label>
          <p className="cl-note">{oc.contacto.consentPre} <a href="/privacidad" target="_blank" rel="noopener noreferrer">{c.privacy}</a>.</p>
        </section>
      )}

      {zoom && (
        <ZoomView
          label={zoom.cuco ? `${zoom.cuco} · ${oc.estilos.tagCuco}` : `${oc.estilos.tagLocal} · ${num(zoom.n)}`}
          src={`/obra/full/${zoom.id}.jpg`}
          alt={zoom.cuco ? fill(oc.estilos.cucoLabel, { a: zoom.cuco }) : oc.estilos.localLabel}
          credit={zoom.cuco ? undefined : { href: creditHref(oc.estilos, `${oc.estilos.tagLocal} · ${num(zoom.n)}`), text: oc.estilos.creditCta }}
          onClose={() => setZoom(null)}
        />
      )}
    </div>
  );
}
