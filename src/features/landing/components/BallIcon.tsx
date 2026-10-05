import { useId } from 'react';
import type { CourtRate } from '@/features/landing/model/courts.ts';

// QUÉ ES: la pelota de cada deporte, dibujada como SVG (sin librerías).
// NIVEL: componente presentacional mínimo.
// DÓNDE SE USA: en CourtRatesTable, al lado del título de la tabla.
// Como los íconos del footer, usa stroke="currentColor": toma el color del
// texto que la rodea.

type BallIconProps = {
  activity: CourtRate['activity'];
  className?: string;
};

// Atributos comunes. aria-hidden: es decorativa, el título ya dice el deporte.
const SVG_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;

export function BallIcon({ activity, className }: BallIconProps) {
  const clipId = useId();

  if (activity === 'futbol') {
    return (
      <svg className={className} {...SVG_PROPS}>
        {/* clipPath: lo que se dibuja adentro de <g> se recorta con la forma
            de la pelota, así los parches del borde no se salen. El id viene
            de useId para que no choque si hay más de una pelota en pantalla. */}
        <defs>
          <clipPath id={clipId}>
            <circle cx="12" cy="12" r="10" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {/* Pentágono del centro y los cinco parches del borde, rellenos. */}
          {/* stroke="none": sin el borde, los parches no se agrandan y
              queda aire entre ellos. */}
          <path
            fill="currentColor"
            stroke="none"
            d="M12 8.6 15.23 10.95 14 14.75 10 14.75 8.77 10.95Z"
          />
          <path
            fill="currentColor"
            stroke="none"
            d="M12 5.4 9.15 3.33 10.24 -0.03 13.76 -0.03 14.85 3.33ZM18.28 9.96 19.37 6.61 22.89 6.61 23.98 9.96 21.13 12.03ZM15.88 17.34 19.41 17.34 20.5 20.69 17.64 22.77 14.79 20.69ZM8.12 17.34 9.21 20.69 6.36 22.77 3.5 20.69 4.59 17.34ZM5.72 9.96 2.87 12.03 0.02 9.96 1.11 6.61 4.63 6.61Z"
          />
          {/* Costuras: unen el pentágono del centro con los del borde. */}
          <path d="M12 8.6 12 5.4M15.23 10.95 18.28 9.96M14 14.75 15.88 17.34M10 14.75 8.12 17.34M8.77 10.95 5.72 9.96" />
        </g>
        <circle cx="12" cy="12" r="10" />
      </svg>
    );
  }

  // Vóley: las tres costuras curvas. Basado en el ícono "volleyball" de
  // Lucide (lucide.dev, licencia ISC).
  return (
    <svg className={className} {...SVG_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
      <path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
      <path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
      <path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
      <path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
    </svg>
  );
}
