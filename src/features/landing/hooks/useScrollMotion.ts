import { useEffect } from 'react';

// QUÉ ES: hook que acompaña el scroll con movimiento: el contenido del hero
// se desvanece al bajar y las imágenes de las actividades se inclinan en 3D.
// NIVEL: custom hook de la feature landing.
// DÓNDE SE USA: en LandingPageContainer.
// POR QUÉ ASÍ: el scroll dispara decenas de eventos por segundo. Si
// guardáramos la posición en un estado de React, la página entera se volvería
// a renderizar cada vez. En cambio, escribimos números en variables CSS y el
// CSS (landing.css) calcula las transformaciones. React no re-renderiza nada.
// Con "prefers-reduced-motion", landing.css ignora estas variables.

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function useScrollMotion() {
  useEffect(() => {
    const root = document.documentElement.style;
    let frameId = 0;

    function update() {
      frameId = 0;
      const viewportHeight = window.innerHeight;

      // 0 = arriba de todo, 1 = ya bajamos una pantalla completa.
      root.setProperty(
        '--hero-progress',
        String(clamp(window.scrollY / viewportHeight, 0, 1))
      );

      // Cada imagen marcada con data-tilt recibe su posición: -1 (arriba),
      // 0 (centro de la pantalla) o 1 (abajo).
      document
        .querySelectorAll<HTMLElement>('[data-tilt]')
        .forEach((element) => {
          const rect = element.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const position = clamp(
            (center - viewportHeight / 2) / (viewportHeight / 2),
            -1,
            1
          );
          element.style.setProperty('--tilt', String(position));
          element.style.setProperty('--tilt-abs', String(Math.abs(position)));
        });
    }

    // requestAnimationFrame agrupa los eventos: como mucho un cálculo por cuadro.
    function requestUpdate() {
      if (frameId === 0) frameId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      root.removeProperty('--hero-progress');
    };
  }, []);
}
