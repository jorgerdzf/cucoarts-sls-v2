import type { Opt } from './muralData';
import { CUANDO } from './muralData';

// Opciones (con su color de la paleta) de los pasos del asistente de arte por encargo. Los textos están en obraCopy.ts.
export const O_PROPOSITO: Opt[] = [
  { id: 'casa', color: 'yellow' }, { id: 'regalo', color: 'orange' }, { id: 'retrato', color: 'sky' }, { id: 'mascota', color: 'lime' },
  { id: 'negocio', color: 'blue' }, { id: 'coleccion', color: 'purple' }, { id: 'nose', color: 'mint' },
];
export const O_TIPO: Opt[] = [
  { id: 'pintura', color: 'orange' }, { id: 'dibujo', color: 'sky' }, { id: 'ilustracion', color: 'yellow' }, { id: 'grabado', color: 'purple' }, { id: 'nose', color: 'mint' },
];
export const O_TAMANO: Opt[] = [
  { id: 'chico', color: 'lime' }, { id: 'mediano', color: 'yellow' }, { id: 'grande', color: 'orange' }, { id: 'xl', color: 'purple' }, { id: 'nose', color: 'mint' },
];
export const O_AMBIENTE: Opt[] = [
  { id: 'colorido', color: 'orange' }, { id: 'sereno', color: 'lime' }, { id: 'realista', color: 'sky' }, { id: 'abstracto', color: 'purple' },
  { id: 'geometrico', color: 'blue' }, { id: 'retrato', color: 'yellow' }, { id: 'cultura', color: 'orange' }, { id: 'animales', color: 'lime' },
  { id: 'byn', color: 'sky' }, { id: 'onirico', color: 'mint' },
];
// Rangos PROVISIONALES: Roberto debe confirmarlos (no hay tarifas documentadas para pintura, dibujo e ilustración por encargo).
export const O_PRESUPUESTO: Opt[] = [
  { id: 'p1', color: 'lime' }, { id: 'p2', color: 'yellow' }, { id: 'p3', color: 'orange' }, { id: 'p4', color: 'purple' }, { id: 'rec', color: 'sky' },
];
export const O_CUANDO = CUANDO;
