import type { Schedule } from '@/features/landing/model/activities.ts';

// QUÉ ES: los links de navegación del sitio público y los datos de contacto
// del footer.
// NIVEL: model — datos y tipos; acá no hay componentes ni JSX.
// POR QUÉ SEPARADO: si mañana los links vienen de la API, solo cambia este
// archivo; los componentes que los muestran quedan iguales.

// Forma de cada link. "to" es la ruta de React Router (lo que recibe <Link>).
// Puede llevar un "#" al final para ir a una sección de la home: "/#pasos".
// Se llama SiteLink (y no NavLink) para no confundirlo con el componente
// <NavLink> de React Router.
export type SiteLink = {
  to: string;
  label: string;
};

// "SiteLink[]" = un array de SiteLink. Si a un link le falta "label" o se
// escribe mal una propiedad, TypeScript marca el error.
// Las actividades tienen su propia página (/actividades/:slug), los planes
// también (/planes); "Cómo asociarse" es una sección de la home.
export const navLinks: SiteLink[] = [
  { to: '/actividades/natacion', label: 'Natatorio' },
  { to: '/actividades/futbol', label: 'Fútbol' },
  { to: '/actividades/voley', label: 'Vóley' },
  { to: '/planes', label: 'Planes' },
  { to: '/#pasos', label: 'Cómo asociarse' },
];

// Botón destacado a la derecha del header: lleva al formulario de inscripción.
export const headerCta: SiteLink = {
  to: '/inscripcion',
  label: 'Sacar el abono',
};

// Datos de contacto del footer. La ventanilla atiende de lunes a sábado; el
// horario usa el mismo tipo Schedule que las actividades, así el footer
// calcula si está abierta con la misma función (getOpeningStatus).
export type ContactInfo = {
  windowSchedule: Schedule;
  windowDays: string;
  phone: string;
  address: string;
  mapsUrl: string;
};

export const footerContact: ContactInfo = {
  windowSchedule: { opensAt: 8, closesAt: 20 },
  windowDays: 'Lunes a sábado',
  phone: '(0381) 000-0000',
  address: '25 de Mayo 971, T4000 San Miguel de Tucumán, Tucumán',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=25+de+Mayo+971%2C+T4000+San+Miguel+de+Tucum%C3%A1n%2C+Tucum%C3%A1n',
};
