// Datos del asistente de murales ("Crea tu mural"). Imágenes en public/murales/ (miniatura) y public/murales/full/.
// Regla de la marca: los artistas de la tienda CUCO ARTS se nombran; los demás artistas locales NUNCA se nombran
// (solo "Artista local MTY · NN"). La tabla privada de quién es quién vive fuera del sitio.

/* g = grupo del artista (anónimo; solo sirve para repartir las rondas) · r = ronda en que aparece (0 = primera foto de cada artista). */
export type Mural = { id: string; n: number; cuco?: string; g: string; r: number };

/* `n` es el número estable de cada mural (lo que llega en la solicitud: "Local 09"); NO cambia aunque se reordene la galería.
   Orden de la galería: primero los de la tienda CUCO ARTS (con contorno amarillo), luego los locales.
   Para agregar murales: copiar la miniatura (600×600) a public/murales/ y la grande a public/murales/full/, y sumar el id aquí
   con el siguiente número libre. Anotar de quién es en el índice privado (ROB_PRODUCTOR\mural\INDICE_PRIVADO_artistas.md). */
const CUCO_IDS: Array<[string, string, number]> = [
  ['cuco-greometria-1', 'Greometría', 1], ['cuco-eliezer-1', 'Eliezer Blanco', 2], ['cuco-dario-1', 'Darío Diario', 3], ['cuco-mizael-1', 'Mizael Valero', 4],
  ['cuco-greometria-2', 'Greometría', 5], ['cuco-eliezer-2', 'Eliezer Blanco', 6], ['cuco-dario-2', 'Darío Diario', 7], ['cuco-mizael-2', 'Mizael Valero', 8],
  ['cuco-greometria-3', 'Greometría', 24], ['cuco-eliezer-3', 'Eliezer Blanco', 25], ['cuco-dario-3', 'Darío Diario', 26], ['cuco-mizael-3', 'Mizael Valero', 27], ['cuco-mizael-4', 'Mizael Valero', 28],
];
const local = (k: number, n: number) => ({ id: `local-${String(k).padStart(2, '0')}`, n });
// locales 29–62: cuántas fotos seguidas son del mismo artista (en el orden de local-16 a local-49)
const RUNS = [2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const NEW_G: string[] = RUNS.flatMap((len, gi) => Array<string>(len).fill('x' + gi));

const BASE: Array<Omit<Mural, 'r'>> = [
  ...CUCO_IDS.map(([id, cuco, n]) => ({ id, cuco, n, g: 'c-' + cuco })),
  ...Array.from({ length: 15 }, (_, i) => ({ ...local(i + 1, i + 9), g: 'e' + i })),         // locales 09–23: un artista cada uno
  ...Array.from({ length: 34 }, (_, i) => ({ ...local(i + 16, i + 29), g: NEW_G[i] })),      // locales 29–62
];
const seen: Record<string, number> = {};
// máximo 3 rondas: 1ª foto de cada artista, 2ª foto, y todas las demás juntas (así no hay botones de "ver más" con 1 o 2 murales)
const WITH_ROUND: Mural[] = BASE.map(m => { const k = seen[m.g] || 0; seen[m.g] = k + 1; return { ...m, r: Math.min(k, 2) }; });

/** Galería en el orden en que se muestra: primera ronda = una foto de cada artista; las siguientes rondas se piden con "Ver más". */
export const MURALS: Mural[] = WITH_ROUND.map((m, i) => ({ m, i })).sort((a, b) => a.m.r - b.m.r || a.i - b.i).map(x => x.m);
export const MURAL_ROUNDS = Math.max(...WITH_ROUND.map(m => m.r)) + 1;

/** Busca un mural por su número estable. */
export const muralByN = (n: number): Mural | undefined => MURALS.find(m => m.n === n);

export type Color = 'yellow' | 'orange' | 'blue' | 'sky' | 'purple' | 'lime' | 'mint';
export type Opt = { id: string; color: Color };

export const PROPOSITO: Opt[] = [
  { id: 'casa', color: 'yellow' }, { id: 'regalo', color: 'orange' }, { id: 'negocio', color: 'blue' },
  { id: 'institucion', color: 'sky' }, { id: 'evento', color: 'purple' }, { id: 'causa', color: 'lime' }, { id: 'nose', color: 'mint' },
];
export const LUGAR: Opt[] = [{ id: 'interior', color: 'yellow' }, { id: 'exterior', color: 'blue' }, { id: 'indef', color: 'mint' }];
export const TAMANO: Opt[] = [
  { id: 'chico', color: 'lime' }, { id: 'mediano', color: 'yellow' }, { id: 'grande', color: 'orange' }, { id: 'monumental', color: 'purple' }, { id: 'nose', color: 'mint' },
];
export const AMBIENTE: Opt[] = [
  { id: 'colorido', color: 'orange' }, { id: 'sereno', color: 'lime' }, { id: 'geometrico', color: 'blue' }, { id: 'personajes', color: 'yellow' },
  { id: 'cultura', color: 'orange' }, { id: 'abstracto', color: 'purple' }, { id: 'byn', color: 'sky' }, { id: 'animales', color: 'lime' },
  { id: 'ninos', color: 'sky' }, { id: 'mensaje', color: 'mint' },
];
export const PRESUPUESTO: Opt[] = [
  { id: 'p1', color: 'lime' }, { id: 'p2', color: 'yellow' }, { id: 'p3', color: 'orange' }, { id: 'p4', color: 'purple' }, { id: 'rec', color: 'sky' },
];
export const CUANDO: Opt[] = [
  { id: 'pronto', color: 'orange' }, { id: 'meses', color: 'yellow' }, { id: 'despues', color: 'lime' }, { id: 'fecha', color: 'purple' },
];
