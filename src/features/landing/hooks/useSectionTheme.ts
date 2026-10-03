import { useEffect } from 'react';
import type {
  SectionTheme,
  ThemedSection,
} from '@/features/landing/model/sectionTheme.ts';

// QUÉ ES: hook que cambia los colores de la página (fondo, acento, header)
// según la sección que está en pantalla.
// NIVEL: custom hook de la feature landing. Un "custom hook" es una función
// que empieza con "use" y agrupa lógica con hooks de React para reutilizarla.
// DÓNDE SE USA: en LandingPageContainer.
// CÓMO FUNCIONA: IntersectionObserver avisa cuando una sección entra en
// pantalla; en ese momento escribimos sus colores como variables CSS en
// <html>. Las utilidades de Tailwind (bg-page, text-accent, ... definidas en
// index.css) y landing.css leen esas variables y animan el cambio.

const THEME_VARIABLES = [
  '--bg',
  '--accent',
  '--glow-a',
  '--ui-fg',
  '--btn-fg',
  '--ui-veil',
];

function applyTheme(theme: SectionTheme) {
  const root = document.documentElement.style;
  root.setProperty('--bg', theme.bg);
  root.setProperty('--accent', theme.accent);
  root.setProperty('--glow-a', theme.glowA);
  root.setProperty('--ui-fg', theme.isLight ? '#08313D' : '#ffffff');
  root.setProperty(
    '--btn-fg',
    theme.buttonFg ?? (theme.isLight ? '#08313D' : '#04121B')
  );
  root.setProperty(
    '--ui-veil',
    theme.isLight
      ? 'linear-gradient(180deg,rgba(226,233,231,.7),rgba(226,233,231,0))'
      : 'linear-gradient(180deg,rgba(0,0,0,.34),transparent)'
  );
}

export function useSectionTheme(sections: ThemedSection[]) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // Buscamos el tema de la sección que acaba de aparecer.
          const section = sections.find((item) => item.id === entry.target.id);
          if (section) applyTheme(section.theme);
        });
      },
      // 0.2 = se considera "visible" cuando se ve al menos el 20 %.
      { threshold: 0.2 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    // Limpieza: dejamos de observar y borramos las variables, así otra página
    // arranca con los colores por defecto de index.css.
    return () => {
      observer.disconnect();
      THEME_VARIABLES.forEach((name) =>
        document.documentElement.style.removeProperty(name)
      );
    };
    // "sections" viene de model/ (un array fijo), así que el efecto corre una vez.
  }, [sections]);
}
