import { activities } from '@/features/landing/model/activities.ts';

// QUÉ ES: los colores que toma la página según la sección que se está viendo.
// NIVEL: model — datos y tipos, sin JSX.
// DÓNDE SE USA: useSectionTheme los aplica como variables CSS (--bg,
// --accent, ...) cuando cada sección entra en pantalla.

export type SectionTheme = {
  bg: string;
  accent: string;
  glowA: string;
  glowB: string;
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
  accent: '#23392F',
  glowA: '#C9CFB8',
  glowB: '#A9C7CE',
  isLight: true,
  buttonFg: '#F3EFE4',
};

export const stepsTheme: SectionTheme = {
  bg: '#0B1C24',
  accent: '#2BD4D9',
  glowA: '#1C7FD6',
  glowB: '#8CE05B',
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
