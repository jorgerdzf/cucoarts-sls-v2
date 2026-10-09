import React from 'react';
import { Cycler } from './Cycler';

/* Collage de polaroids del encabezado (el mismo de la portada) para /murales y /arte-por-encargo.
   Cada cuadro rota entre su lista de imágenes; `key` es el artista o proyecto: dos cuadros nunca muestran a la vez la misma clave. */
export type PolItem = { src: string; w: number; h: number; alt: string; caption: string; key: string };

export const shuffle = <T,>(a: T[]): T[] => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [b[i], b[k]] = [b[k], b[i]]; } return b; };

/** Reparte las claves (artistas o proyectos) en 4 grupos al azar, una por polaroid, así ninguna clave aparece en dos cuadros;
    cada cuadro rota entre hasta `perSet` imágenes de sus claves. */
export function dealFour(items: PolItem[], perSet = 6): PolItem[][] {
  const byKey = new Map<string, PolItem[]>();
  items.forEach(p => byKey.set(p.key, [...(byKey.get(p.key) || []), p]));
  const sets: PolItem[][] = [[], [], [], []];
  shuffle(Array.from(byKey.keys())).forEach((k, i) => sets[i % 4].push(...byKey.get(k)!));
  return sets.map(s => shuffle(s).slice(0, perSet)).filter(s => s.length > 0);
}

export default function HeroPols({ sets, label }: { sets: PolItem[][]; label: string }) {
  if (sets.length === 0) return null;
  const columns = [[0, 2], [1, 3]];
  return (
    <div className="cl-pols" role="group" aria-label={label}>
      {columns.map((col, ci) => (
        <div className="cl-pcol" key={ci}>
          {col.filter(k => sets[k]).map((k, i) => (
            <figure className={`cl-pol cl-pol-${ci * 2 + i}`} key={sets[k][0].src}>
              <Cycler items={sets[k]} group="hero" keyOf={q => q.key} offset={k * 1300} ms={6200} src={q => q.src}
                render={q => (
                  <>
                    <img src={q.src} width={q.w} height={q.h} alt={q.alt} loading={k === 0 ? 'eager' : 'lazy'} decoding="async"
                      style={{ aspectRatio: `${sets[k][0].w} / ${sets[k][0].h}`, objectFit: 'cover' }} />
                    <figcaption>{q.caption}</figcaption>
                  </>
                )} />
            </figure>
          ))}
        </div>
      ))}
    </div>
  );
}
