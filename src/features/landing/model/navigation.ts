// QUÉ ES: los links de navegación del sitio público (header y footer).
// NIVEL: model — datos y tipos; acá no hay componentes ni JSX.
// POR QUÉ SEPARADO: si mañana los links vienen de la API, solo cambia este
// archivo; los componentes que los muestran quedan iguales.

// Forma de cada link. "export" permite reutilizar el tipo en los componentes.
export type NavLink = {
  href: string;
  label: string;
};

// Un grupo de links del pie de página, con su título.
export type FooterColumn = {
  title: string;
  links: NavLink[];
};

// "NavLink[]" = un array de NavLink. Si a un link le falta "label" o se
// escribe mal una propiedad, TypeScript marca el error.
// Por ahora son anclas (#) a secciones de la misma página de inicio.
export const navLinks: NavLink[] = [
  { href: '#natacion', label: 'Natatorio' },
  { href: '#futbol', label: 'Fútbol' },
  { href: '#voley', label: 'Vóley' },
  { href: '#pasos', label: 'Cómo asociarse' },
];

// Botón destacado a la derecha del header.
export const headerCta: NavLink = { href: '#pasos', label: 'Sacar el abono' };

export const footerColumns: FooterColumn[] = [
  {
    title: 'Actividades',
    links: [
      { href: '#natacion', label: 'Natatorio' },
      { href: '#futbol', label: 'Fútbol' },
      { href: '#voley', label: 'Vóley' },
    ],
  },
  {
    title: 'Trámites',
    links: [
      { href: '#pasos', label: 'Sacar el abono' },
      { href: '#pasos', label: 'Renovar' },
      { href: '#pasos', label: 'Apto médico' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { href: '#hero', label: 'Ventanilla: 8 a 20 h' },
      { href: '#hero', label: '(0381) 000-0000' },
    ],
  },
];
