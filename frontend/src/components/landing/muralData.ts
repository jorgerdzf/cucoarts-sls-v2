// Datos del asistente de murales ("Crea tu mural"). Imágenes en public/murales/ (miniatura) y public/murales/full/.
// Regla de la marca: los artistas de la tienda CUCO ARTS se nombran; los demás artistas locales NUNCA se nombran
// (solo "Artista local MTY · NN"). La tabla privada de quién es quién vive fuera del sitio.

export type Mural = { id: string; n: number; cuco?: string };

export const MURALS: Mural[] = [
  { id: 'cuco-greometria-1', cuco: 'Greometría' }, { id: 'cuco-eliezer-1', cuco: 'Eliezer Blanco' },
  { id: 'cuco-dario-1', cuco: 'Darío Diario' }, { id: 'cuco-mizael-1', cuco: 'Mizael Valero' },
  { id: 'cuco-greometria-2', cuco: 'Greometría' }, { id: 'cuco-eliezer-2', cuco: 'Eliezer Blanco' },
  { id: 'cuco-dario-2', cuco: 'Darío Diario' }, { id: 'cuco-mizael-2', cuco: 'Mizael Valero' },
  ...Array.from({ length: 15 }, (_, i) => ({ id: `local-${String(i + 1).padStart(2, '0')}` })),
].map((m, i) => ({ ...m, n: i + 1 }));

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
