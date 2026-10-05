import { activities } from '@/features/landing/model/activities.ts';

// QUÉ ES: los colores que toma la página según la sección que se está viendo.
// NIVEL: model — datos y tipos, sin JSX.
// DÓNDE SE USA: useSectionTheme los aplica como variables CSS (--bg,
// --accent, ...) cuando cada sección entra en pantalla.

export type SectionTheme = {
  bg: string;
  accent: string;
  glowA: string;
  // "?" = opcional. true si la sección es clara (el header usa texto oscuro).
  isLight?: boolean;
  // Color del texto de los botones, si no alcanza con el valor por defecto.
  buttonFg?: string;
};

// Une el id de una <section> con los colores que le corresponden.
export type ThemedSection = {
  id: string;
  theme: SectionTheme;
};

export const heroTheme: SectionTheme = {
  bg: '#EFEADC',
  accent: '#06263F',
  glowA: '#C9CFB8',
  isLight: true,
  buttonFg: '#F3EFE4',
};

export const stepsTheme: SectionTheme = {
  bg: '#0B1C24',
  accent: '#1EA7EF',
  glowA: '#1C7FD6',
};

// Todas las secciones de la home, en orden. Cada actividad trae su propio
// tema, así que se agregan con map() en lugar de repetirlas a mano.
export const pageSections: ThemedSection[] = [
  { id: 'hero', theme: heroTheme },
  ...activities.map((activity) => ({
    id: activity.slug,
    theme: activity.theme,
  })),
  { id: 'pasos', theme: stepsTheme },
];

// Páginas simples (404, planes): un solo bloque con id="contenido" que toma
// los colores oscuros de "pasos". Sin esto, el header quedaría con el texto
// oscuro pensado para el hero claro de la home.
export const defaultPageSections: ThemedSection[] = [
  { id: 'contenido', theme: stepsTheme },
];

// Igual que defaultPageSections, pero sin el brillo azul de arriba a la
// izquierda: el brillo toma el mismo color que el fondo, así no se nota.
// Lo usa la página para hacerse socio, donde el formulario va solo.
export const noGlowPageSections: ThemedSection[] = [
  { id: 'contenido', theme: { ...stepsTheme, glowA: stepsTheme.bg } },
];
