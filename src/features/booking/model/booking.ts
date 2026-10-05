import { parseDateInput, toDateInputValue } from '@/shared/lib/dateInput.ts';
import { isValidDni, isValidPhone } from '@/shared/lib/validation.ts';
import type { SelectOption } from '@/shared/ui/FormFields.tsx';
import {
  activities,
  type Schedule,
} from '@/features/landing/model/activities.ts';
import { courtRates, type CourtRate } from '@/features/landing/model/courts.ts';

// QUÉ ES: los datos del formulario para alquilar una cancha, los turnos de
// cada día y la validación.
// NIVEL: model — tipos y funciones puras, sin JSX.
// DÓNDE SE USA: BookingPageContainer guarda un BookingForm en el estado, pide
// los turnos con getSlots y valida con validateBooking al enviar.
// A FUTURO: cuando esté la base de datos, los turnos ocupados salen de la API
// (ver isTakenExample) y la reserva se guarda ahí.

export type BookingForm = {
  // El id de una cancha de courts.ts, o '' si todavía no eligió.
  courtId: string;
  // Formato del <input type="date">: "AAAA-MM-DD".
  date: string;
  // La hora de inicio del turno ("18" = de 18:00 a 19:00), o ''.
  hour: string;
  fullName: string;
  dni: string;
  phone: string;
  // true = paga el precio de socio (tiene que mostrar el carnet).
  isMember: boolean;
};

export type BookingField = keyof BookingForm;

// Los campos que se completan con texto: todos menos la casilla de socio.
// Exclude saca 'isMember' de la unión de nombres.
export type BookingTextField = Exclude<BookingField, 'isMember'>;

// Un mensaje de error por campo; solo aparecen los que tienen error.
export type BookingErrors = Partial<Record<BookingField, string>>;

// Un turno de una hora dentro del horario del deporte.
export type Slot = {
  hour: number;
  // Ej.: "18:00".
  label: string;
  // false si ya pasó o si está ocupado.
  isAvailable: boolean;
};

// Se puede reservar desde hoy hasta dos semanas adelante.
export const BOOKING_DAYS_AHEAD = 14;

export function createEmptyBooking(courtId = ''): BookingForm {
  return {
    courtId,
    date: '',
    hour: '',
    fullName: '',
    dni: '',
    phone: '',
    isMember: false,
  };
}

export function findCourt(courtId: string): CourtRate | undefined {
  return courtRates.find((rate) => rate.id === courtId);
}

// Cancha con la que arranca el formulario, según la URL:
// ?cancha=futbol-5 elige esa cancha; ?deporte=voley elige la primera cancha
// de vóley. Si no viene nada (o algo que no existe), arranca vacío.
export function findInitialCourtId(
  courtParam: string | null,
  sportParam: string | null
): string {
  if (courtParam && findCourt(courtParam)) return courtParam;
  const firstOfSport = courtRates.find((rate) => rate.activity === sportParam);
  return firstOfSport?.id ?? '';
}

// Opciones del desplegable, armadas con map() a partir de las canchas.
export const courtOptions: SelectOption[] = courtRates.map((rate) => ({
  value: rate.id,
  label: rate.name,
}));

// El horario de una cancha es el de su deporte (activities.ts).
function getCourtSchedule(court: CourtRate): Schedule | undefined {
  return activities.find((activity) => activity.slug === court.activity)
    ?.schedule;
}

// Primer y último día que se pueden elegir, en "AAAA-MM-DD".
export function getBookingDateRange(now: Date): { min: string; max: string } {
  const last = new Date(now);
  last.setDate(last.getDate() + BOOKING_DAYS_AHEAD);
  return { min: toDateInputValue(now), max: toDateInputValue(last) };
}

// "AAAA-MM-DD" → "18/10" (día/mes), para los mensajes.
export function formatShortDate(date: string): string {
  const [, month, day] = date.split('-').map(Number);
  return `${day}/${month}`;
}

// Revisa solo el día. Devuelve el mensaje de error, o undefined si el día
// se puede reservar. La usa validateBooking y también el container, para
// avisar apenas se elige un día fuera de rango (sin esperar al envío).
// Las fechas "AAAA-MM-DD" se pueden comparar como texto: el orden
// alfabético coincide con el orden de los días.
export function getDateError(date: string, now: Date): string | undefined {
  const { min, max } = getBookingDateRange(now);
  const range = `entre hoy (${formatShortDate(min)}) y el ${formatShortDate(max)}`;
  if (!date) return 'Elegí el día.';
  if (date < min) return `Ese día ya pasó. Elegí uno ${range}.`;
  if (date > max) return `Todavía no se puede reservar. Elegí un día ${range}.`;
  return undefined;
}

// TURNOS OCUPADOS DE EJEMPLO: todavía no hay base de datos, así que no hay
// reservas reales. Para que la grilla se vea como funcionaría, esta función
// marca como ocupados algunos turnos con una cuenta fija: siempre los mismos
// para la misma cancha, día y hora. Cuando esté la API, se reemplaza por la
// lista de reservas que devuelva.
function isTakenExample(courtId: string, date: string, hour: number): boolean {
  let sum = 0;
  for (const char of courtId + date) sum += char.charCodeAt(0);
  return (sum + hour * 7) % 5 === 0;
}

// Los turnos de un día: uno por hora, desde que abre hasta la última hora
// antes de cerrar. Un turno de hoy que ya empezó no se puede reservar.
export function getSlots(court: CourtRate, date: string, now: Date): Slot[] {
  const schedule = getCourtSchedule(court);
  if (!schedule || !date) return [];

  const slots: Slot[] = [];
  for (let hour = schedule.opensAt; hour < schedule.closesAt; hour++) {
    const start = parseDateInput(date);
    start.setHours(hour);
    const isPast = start <= now;
    slots.push({
      hour,
      label: `${hour}:00`,
      isAvailable: !isPast && !isTakenExample(court.id, date, hour),
    });
  }
  return slots;
}

// Ej.: 18 → "18:00 a 19:00".
export function formatSlot(hour: number): string {
  return `${hour}:00 a ${hour + 1}:00`;
}

export function getPrice(court: CourtRate, isMember: boolean): number {
  return isMember ? court.memberPrice : court.publicPrice;
}

// Revisa el formulario y devuelve los errores, en el mismo orden que los
// campos en pantalla (el container enfoca el primero). "now" llega por
// parámetro para que la función sea pura.
export function validateBooking(form: BookingForm, now: Date): BookingErrors {
  const errors: BookingErrors = {};
  const court = findCourt(form.courtId);

  if (!court) errors.courtId = 'Elegí una cancha.';

  const dateError = getDateError(form.date, now);
  if (dateError) errors.date = dateError;

  // El horario solo se revisa si la cancha y el día están bien: si no, la
  // grilla ni aparece y el error estaría de más.
  if (court && !dateError && !form.hour) {
    errors.hour = 'Elegí un horario.';
  } else if (court && !dateError) {
    // Se vuelve a revisar al enviar: el turno pudo haber pasado mientras la
    // persona completaba el resto.
    const slot = getSlots(court, form.date, now).find(
      (item) => item.hour === Number(form.hour)
    );
    if (!slot?.isAvailable) errors.hour = 'Ese horario ya no está libre.';
  }

  if (!form.fullName.trim()) errors.fullName = 'Escribí tu nombre y apellido.';

  if (!form.dni.trim()) errors.dni = 'Escribí tu DNI.';
  else if (!isValidDni(form.dni))
    errors.dni = 'El DNI tiene 7 u 8 números, sin letras.';

  if (!form.phone.trim()) errors.phone = 'Escribí un teléfono de contacto.';
  else if (!isValidPhone(form.phone))
    errors.phone =
      'Escribí el teléfono con la característica (ej.: 381 555-1234).';

  return errors;
}
