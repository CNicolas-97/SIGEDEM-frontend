// QUÉ ES: los links de navegación del sitio público (header y footer).
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

// Un grupo de links del pie de página, con su título.
export type FooterColumn = {
  title: string;
  links: SiteLink[];
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

// Botón destacado a la derecha del header.
export const headerCta: SiteLink = { to: '/planes', label: 'Sacar el abono' };

export const footerColumns: FooterColumn[] = [
  {
    title: 'Actividades',
    links: [
      { to: '/actividades/natacion', label: 'Natatorio' },
      { to: '/actividades/futbol', label: 'Fútbol' },
      { to: '/actividades/voley', label: 'Vóley' },
    ],
  },
  {
    title: 'Trámites',
    links: [
      { to: '/planes', label: 'Planes y precios' },
      { to: '/#pasos', label: 'Sacar el abono' },
      { to: '/#pasos', label: 'Renovar' },
      { to: '/#pasos', label: 'Apto médico' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { to: '/#hero', label: 'Ventanilla: 8 a 20 h' },
      { to: '/#hero', label: '(0381) 000-0000' },
    ],
  },
];
