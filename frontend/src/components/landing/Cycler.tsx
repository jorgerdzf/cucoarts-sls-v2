import React, { useEffect, useRef, useState } from 'react';
import './assets/styles/cycler.css';

/* Rotación de imágenes con fundido cruzado: muestra una lista de elementos uno tras otro.
   - Solo corre mientras está a la vista y la pestaña está activa (no gasta batería ni datos de más).
   - Se pausa al pasar el cursor o enfocar (para que nadie pierda la foto que está mirando).
   - Con "reducir movimiento" no rota (se queda en el primer elemento).
   - La siguiente imagen se precarga antes de mostrarse.
   - Con `group` + `keyOf`: en un mismo conjunto nunca se ven a la vez dos imágenes con la misma clave (por ejemplo, del mismo artista):
     cada Cycler reserva la clave de lo que muestra y al avanzar se salta las imágenes cuya clave ya está en pantalla en otro lugar del conjunto. */
const REG = new Map<string, Map<string, string>>();   // conjunto → (cuadro → clave que muestra ahora)
export function Cycler<T>({ items, render, src, ms = 5200, offset = 0, className = '', onChange, group, keyOf }: {
  items: T[]; render: (item: T, index: number) => React.ReactNode; src?: (item: T) => string; ms?: number; offset?: number; className?: string; onChange?: (item: T, index: number) => void;
  group?: string; keyOf?: (item: T) => string;
}) {
  const n = items.length;
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(false);
  const nextShown = useRef(1 % Math.max(1, items.length));   // índice de la imagen que entra durante el fundido
  const wrap = useRef<HTMLDivElement>(null);
  const idx = useRef(0);
  const paused = useRef(false);
  const me = useRef(Math.random().toString(36).slice(2));
  const seen = useRef(true);   // el observador corrige el valor en cuanto reporta

  useEffect(() => {
    const el = wrap.current;
    if (!el || n < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = me.current;
    const slots = group && keyOf ? (REG.get(group) || REG.set(group, new Map()).get(group)!) : null;
    if (slots && keyOf) slots.set(id, keyOf(items[idx.current]));
    // siguiente imagen cuya clave no esté ya en pantalla en otro cuadro del conjunto (-1 si todas están ocupadas)
    const pick = (): number => {
      for (let k = 1; k < n; k++) {
        const j = (idx.current + k) % n;
        if (!slots || !keyOf) return j;
        const key = keyOf(items[j]);
        if (!Array.from(slots.entries()).some(([other, v]) => other !== id && v === key)) return j;
      }
      return -1;
    };
    let timer = 0, commit = 0, first = true;
    const run = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!seen.current || paused.current || document.hidden) { run(); return; }   // no avanza si no se ve o si alguien la está mirando
        const nx = pick();
        if (nx < 0) { run(); return; }   // todas las opciones repetirían un artista que ya se ve: espera al siguiente turno
        if (slots && keyOf) slots.set(id, keyOf(items[nx]));   // reserva la clave desde que empieza el fundido
        const go = () => {
          nextShown.current = nx;
          setFade(true);
          commit = window.setTimeout(() => { idx.current = nx; setI(nx); setFade(false); onChange?.(items[nx], nx); run(); }, 950);
        };
        const u = src ? src(items[nx]) : '';
        if (u) { const im = new Image(); im.onload = go; im.onerror = go; im.src = u; } else go();
      }, first ? ms + offset : ms);
      first = false;
    };
    const io = new IntersectionObserver(es => { seen.current = es[0].isIntersecting; }, { threshold: 0.25 });
    io.observe(el);
    run();
    return () => { io.disconnect(); window.clearTimeout(timer); window.clearTimeout(commit); slots?.delete(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, ms, offset]);

  const nx = nextShown.current;
  return (
    <div ref={wrap} className={`cy ${className}`} onMouseEnter={() => { paused.current = true; }} onMouseLeave={() => { paused.current = false; }}
      onFocus={() => { paused.current = true; }} onBlur={() => { paused.current = false; }}>
      <div className="cy-base">{render(items[i], i)}</div>
      {fade && n > 1 && <div className="cy-top" aria-hidden="true">{render(items[nx], nx)}</div>}
    </div>
  );
}
