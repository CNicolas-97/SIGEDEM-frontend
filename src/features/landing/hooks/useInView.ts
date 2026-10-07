import { useEffect, useRef, useState } from 'react';

// QUÉ ES: hook que avisa cuando un elemento aparece en pantalla por primera
// vez (y después ya no vuelve a cambiar).
// NIVEL: custom hook de la feature landing.
// DÓNDE SE USA: en StatList (cifras que cuentan) y en CourtLines (líneas de
// cancha que se dibujan).
// CÓMO FUNCIONA: devuelve [ref, inView]. El ref se pega al elemento; un
// IntersectionObserver lo mira y, cuando se ve al menos "threshold" de él,
// pone inView en true y deja de observar.

export function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        // Una sola vez: la animación no se repite al volver a pasar.
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(element);

    // Limpieza: si el componente se desmonta antes de aparecer.
    return () => observer.disconnect();
  }, [threshold]);

  // "as const": TypeScript lo entiende como tupla [ref, boolean] y no como
  // un array de cualquiera de los dos tipos.
  return [ref, inView] as const;
}
