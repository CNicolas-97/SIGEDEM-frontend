import type { CSSProperties, ReactNode } from 'react';
import { useInView } from '@/features/landing/hooks/useInView.ts';
import type { ActivitySlug } from '@/features/landing/model/activities.ts';

// QUÉ ES: las líneas de cancha / pileta que se dibujan en SVG detrás de cada
// sección de actividad.
// NIVEL: componentes presentacionales.
// DÓNDE SE USA: dentro de ActivitySection.
// POR QUÉ ASÍ: cada deporte tiene un dibujo distinto. En lugar de un if por
// deporte, guardamos los dibujos en un objeto indexado por slug.
// "Record<ActivitySlug, ReactNode>" obliga a tener un dibujo para cada slug:
// si mañana se agrega una actividad y falta su dibujo, TypeScript avisa.
// MOVIMIENTO: cuando la sección aparece, las líneas se dibujan (clase
// court-line, landing.css). pathLength="1" hace que cada trazo "mida" 1, así
// el CSS esconde y muestra cualquier forma con stroke-dasharray: 1. Las
// sogas de la pileta ya son punteadas, por eso entran deslizándose
// (court-lane) en lugar de dibujarse.

type ActivityArtProps = {
  slug: ActivitySlug;
};

// Marcas de la cancha / pileta, muy tenues, detrás de toda la sección.
const courtLines: Record<ActivitySlug, ReactNode> = {
  natacion: (
    <g stroke="#fff" strokeWidth="3" fill="none" opacity=".9">
      {[140, 290, 440, 590, 740].map((y, index) => (
        <line
          key={y}
          className="court-lane"
          style={{ '--lane': index } as CSSProperties}
          x1="0"
          y1={y}
          x2="1200"
          y2={y}
          strokeDasharray="26 18"
        />
      ))}
    </g>
  ),
  futbol: (
    <g stroke="#fff" strokeWidth="3" fill="none" opacity=".9">
      <rect
        className="court-line"
        pathLength="1"
        x="60"
        y="60"
        width="1080"
        height="680"
        rx="4"
      />
      <line
        className="court-line"
        pathLength="1"
        x1="600"
        y1="60"
        x2="600"
        y2="740"
      />
      <circle className="court-line" pathLength="1" cx="600" cy="400" r="120" />
      <rect
        className="court-line"
        pathLength="1"
        x="60"
        y="250"
        width="130"
        height="300"
      />
      <rect
        className="court-line"
        pathLength="1"
        x="1010"
        y="250"
        width="130"
        height="300"
      />
    </g>
  ),
  voley: (
    <g stroke="#fff" strokeWidth="3" fill="none" opacity=".9">
      <rect
        className="court-line"
        pathLength="1"
        x="180"
        y="120"
        width="840"
        height="560"
      />
      <line
        className="court-line"
        pathLength="1"
        x1="600"
        y1="120"
        x2="600"
        y2="680"
        strokeWidth="5"
      />
      <line
        className="court-line"
        pathLength="1"
        x1="390"
        y1="120"
        x2="390"
        y2="680"
      />
      <line
        className="court-line"
        pathLength="1"
        x1="810"
        y1="120"
        x2="810"
        y2="680"
      />
    </g>
  ),
};

export function CourtLines({ slug }: ActivityArtProps) {
  const [svgRef, inView] = useInView<SVGSVGElement>(0.15);

  return (
    <svg
      ref={svgRef}
      data-in-view={inView}
      className="court-draw pointer-events-none absolute inset-0 z-0 opacity-20"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {courtLines[slug]}
    </svg>
  );
}
