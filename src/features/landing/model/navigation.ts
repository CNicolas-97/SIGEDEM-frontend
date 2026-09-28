// QUÉ ES: los datos de la feature "landing" (sitio público).
// NIVEL: model — datos y tipos; acá no hay componentes ni JSX.
// POR QUÉ SEPARADO: si mañana los links vienen de la API, solo cambia este
// archivo; los componentes que los muestran quedan iguales.

// Forma de cada link. "export" permite reutilizar el tipo en los componentes.
export type NavLink = {
  href: string;
  label: string;
};

// "NavLink[]" = un array de NavLink. Si a un link le falta "label" o se
// escribe mal una propiedad, TypeScript marca el error.
export const navLinks: NavLink[] = [
  { href: '/', label: 'Inicio' },
  { href: '/disciplinas', label: 'Disciplinas' },
  { href: '/login', label: 'Ingresar' },
];
