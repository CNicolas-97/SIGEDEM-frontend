import type { ActivitySlug } from '@/features/landing/model/activities.ts';

// QUÉ ES: lo que cuesta alquilar una cancha de fútbol o de vóley por hora.
// NIVEL: model — datos y tipos, sin JSX.
// DÓNDE SE USA: PlansPageContainer arma una tabla por deporte, debajo de los
// planes del abono.

export type CourtRate = {
  // Identificador único: se usa como "key" al recorrer la lista.
  id: string;
  // Solo fútbol y vóley tienen canchas para alquilar. Exclude saca
  // 'natacion' de la unión ActivitySlug.
  activity: Exclude<ActivitySlug, 'natacion'>;
  name: string;
  // Cuántas canchas hay y cómo son.
  detail: string;
  // Precio por hora en pesos: con el abono (socio) y sin el abono.
  memberPrice: number;
  publicPrice: number;
};

export const courtRates: CourtRate[] = [
  {
    id: 'futbol-5',
    activity: 'futbol',
    name: 'Fútbol 5',
    detail: 'Cuatro canchas con iluminación LED',
    memberPrice: 15000,
    publicPrice: 22000,
  },
  {
    id: 'futbol-11',
    activity: 'futbol',
    name: 'Fútbol 11',
    detail: 'Dos canchas reglamentarias',
    memberPrice: 35000,
    publicPrice: 50000,
  },
  {
    id: 'voley-cubierta',
    activity: 'voley',
    name: 'Vóley cubierta',
    detail: 'Dos canchas con piso flotante',
    memberPrice: 10000,
    publicPrice: 15000,
  },
  {
    id: 'voley-playa',
    activity: 'voley',
    name: 'Vóley playa',
    detail: 'Tres canchas de arena',
    memberPrice: 8000,
    publicPrice: 12000,
  },
];

// Un grupo por deporte: el título de la tabla y sus canchas.
export type CourtGroup = {
  activity: CourtRate['activity'];
  title: string;
  rates: CourtRate[];
};

// filter() separa las canchas de cada deporte. Si se agrega una cancha a
// courtRates, aparece sola en la tabla que le corresponde.
export const courtGroups: CourtGroup[] = [
  {
    activity: 'futbol',
    title: 'Fútbol',
    rates: courtRates.filter((rate) => rate.activity === 'futbol'),
  },
  {
    activity: 'voley',
    title: 'Vóley',
    rates: courtRates.filter((rate) => rate.activity === 'voley'),
  },
];
