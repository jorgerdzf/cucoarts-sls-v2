import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PHOTOS, Photo, Tag } from './muralesPhotos';

/* Galería de la página /murales: visor de fotos (Lightbox) y mosaico que cambia en cada visita.
   - El mosaico reparte las fotos entre proyectos (una de cada uno antes de repetir) y da prioridad a las de más color.
   - Las miniaturas (640 px) se cargan perezosamente; la foto grande (1600 px) solo al abrir el visor. */

export const fullSrc = (p: Photo) => `/murales/proyectos/${p.dir}/${p.n}.jpg`;
export const thumbSrc = (p: Photo) => `/murales/proyectos/${p.dir}/${p.n}-t.jpg`;

export type LbItem = { photo: Photo; caption: string };
type LbText = { close: string; prev: string; next: string; of: string; cartel: string };

/* ---------- visor ---------- */
export function Lightbox({ items, start, t, onClose }: { items: LbItem[]; start: number; t: LbText; onClose: () => void }) {
  const [i, setI] = useState(start);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const n = items.length;
  const go = useCallback((d: number) => setI(k => (k + d + n) % n), [n]);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('keydown', key); document.body.style.overflow = overflow; prev?.focus?.(); };
  }, [go, onClose]);

  // precarga de la foto anterior y la siguiente
  useEffect(() => {
    [i - 1, i + 1].forEach(k => { const it = items[(k + n) % n]; if (it) { const im = new Image(); im.src = fullSrc(it.photo); } });
  }, [i, items, n]);

  const cur = items[i];
  const isCartel = cur.photo.tags.includes('cartel');
  return (
    <div className="mp-lb" role="dialog" aria-modal="true" aria-label={cur.caption}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={e => { const p = e.touches[0]; touch.current = { x: p.clientX, y: p.clientY }; }}
      onTouchEnd={e => {
        const s = touch.current; touch.current = null; if (!s) return;
        const p = e.changedTouches[0]; const dx = p.clientX - s.x, dy = p.clientY - s.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
      }}>
      <div className="mp-lb-bar">
        <span>{cur.caption}{isCartel ? ` · ${t.cartel}` : ''}</span>
        <span className="mp-lb-n">{i + 1} {t.of} {n}</span>
        <button ref={closeBtn} type="button" className="mp-lb-x" onClick={onClose} aria-label={t.close}>✕</button>
      </div>
      <div className="mp-lb-stage">
        {n > 1 && <button type="button" className="mp-lb-nav prev" onClick={() => go(-1)} aria-label={t.prev}>‹</button>}
        <img key={i} src={fullSrc(cur.photo)} width={cur.photo.w} height={cur.photo.h} alt={cur.caption} decoding="async" />
        {n > 1 && <button type="button" className="mp-lb-nav next" onClick={() => go(1)} aria-label={t.next}>›</button>}
      </div>
    </div>
  );
}

/* ---------- mosaico ---------- */
function mulberry32(a: number) {
  return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const b = arr.slice();
  for (let k = b.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [b[k], b[j]] = [b[j], b[k]]; }
  return b;
}

type Tile = { id: string; photo: Photo; caption: string };

/** Orden del mosaico: por proyecto, con las más coloridas primero; luego se alternan los proyectos para dar variedad. */
function order(tiles: Tile[], seed: number): Tile[] {
  const rnd = mulberry32(seed);
  const groups: Record<string, Tile[]> = {};
  tiles.forEach(t => { (groups[t.id] = groups[t.id] || []).push(t); });
  const lists = shuffle(Object.keys(groups), rnd).map(id => {
    const g = groups[id];
    return [...shuffle(g.filter(t => t.photo.hl), rnd), ...shuffle(g.filter(t => !t.photo.hl), rnd)];
  });
  const out: Tile[] = [];
  for (let r = 0; lists.some(l => r < l.length); r++) lists.forEach(l => { if (r < l.length) out.push(l[r]); });
  return out;
}

export function MuralMosaic({ names, text, onOpen }: {
  names: Record<string, string>;                       // id de proyecto → nombre corto
  text: { all: string; tagNames: Record<string, string>; more: string; less: string; count: string };
  onOpen: (items: LbItem[], start: number) => void;
}) {
  const [seed] = useState(() => Math.floor(Math.random() * 2 ** 31));
  const [tag, setTag] = useState<'all' | Tag>('all');
  const [shown, setShown] = useState(8);
  const STEP = 8;

  const tiles = useMemo(() => {
    const all: Tile[] = [];
    Object.entries(PHOTOS).forEach(([id, list]) => list.forEach(photo => all.push({ id, photo, caption: names[id] || id })));
    // sin carteles; "Todo" tampoco muestra las fotos "antes" (el filtro "Antes" sí)
    const base = all.filter(t => !t.photo.tags.includes('cartel') && (tag === 'antes' ? true : tag === 'all' ? !t.photo.tags.includes('antes') : true));
    const f = tag === 'all' ? base : base.filter(t => t.photo.tags.includes(tag));
    return order(f, seed + (tag === 'all' ? 0 : tag.length * 7919));
  }, [tag, seed, names]);

  const chips: Array<'all' | Tag> = ['all', 'proceso', 'vivo', 'personas', 'resultado', 'antes'];
  const view = tiles.slice(0, shown);
  const open = (k: number) => onOpen(tiles.map(t => ({ photo: t.photo, caption: t.caption })), k);

  return (
    <div className="mp-mosaic">
      <div className="mp-chips" role="group">
        {chips.map(c => (
          <button key={c} type="button" className="mp-chipbtn" aria-pressed={tag === c} onClick={() => { setTag(c); setShown(8); }}>
            {c === 'all' ? text.all : text.tagNames[c]}
          </button>
        ))}
      </div>
      <ul className="mp-tiles">
        {view.map((t, k) => (
          <li key={t.photo.dir + t.photo.n}>
            <button type="button" onClick={() => open(k)} aria-label={t.caption}>
              <img src={thumbSrc(t.photo)} width={640} height={640} alt="" loading={k < 4 ? 'eager' : 'lazy'} decoding="async" />
              <span>{t.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mp-more">
        <span className="mp-count">{text.count.replace('{n}', String(view.length)).replace('{t}', String(tiles.length))}</span>
        {shown < tiles.length && <button type="button" className="cl-btn" onClick={() => setShown(s => s + STEP)}>{text.more}</button>}
        {shown > 8 && <button type="button" className="cl-textlink" onClick={() => setShown(8)}>{text.less}</button>}
      </div>
    </div>
  );
}
