import type { Schedule } from '@/features/landing/model/activities.ts';

// QUÉ ES: funciones para el tablero "Hoy" del hero: fecha en texto y si cada
// actividad está abierta según la hora.
// NIVEL: model — funciones puras: con la misma entrada devuelven siempre lo
// mismo y no tocan la pantalla. Por eso son fáciles de probar.

const WEEKDAYS = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
];
const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export type OpeningStatus = {
  isOpen: boolean;
  label: string;
};

// Ej.: "lunes 29 de septiembre".
export function formatToday(date: Date): string {
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}`;
}

// Ej.: "7:00 a 21:00".
export function formatSchedule(schedule: Schedule): string {
  return `${schedule.opensAt}:00 a ${schedule.closesAt}:00`;
}

// Estado de una actividad a una hora dada (0 a 23).
export function getOpeningStatus(
  schedule: Schedule,
  hour: number
): OpeningStatus {
  if (hour >= schedule.opensAt && hour < schedule.closesAt) {
    return { isOpen: true, label: 'Abierto' };
  }
  if (hour < schedule.opensAt) {
    return { isOpen: false, label: `Abre ${schedule.opensAt}:00` };
  }
  return { isOpen: false, label: 'Cerrado' };
}
