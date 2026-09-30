import type { ReactNode } from 'react';
import type { ActivitySlug } from '@/features/landing/model/activities.ts';

// QUÉ ES: las líneas de cancha / pileta que se dibujan en SVG detrás de cada
// sección de actividad.
// NIVEL: componentes presentacionales.
// DÓNDE SE USA: dentro de ActivitySection.
// POR QUÉ ASÍ: cada deporte tiene un dibujo distinto. En lugar de un if por
// deporte, guardamos los dibujos en un objeto indexado por slug.
// "Record<ActivitySlug, ReactNode>" obliga a tener un dibujo para cada slug:
// si mañana se agrega una actividad y falta su dibujo, TypeScript avisa.

type ActivityArtProps = {
  slug: ActivitySlug;
};

// Marcas de la cancha / pileta, muy tenues, detrás de toda la sección.
const courtLines: Record<ActivitySlug, ReactNode> = {
  natacion: (
    <g stroke="#fff" strokeWidth="3" fill="none" opacity=".9">
      {[140, 290, 440, 590, 740].map((y) => (
        <line key={y} x1="0" y1={y} x2="1200" y2={y} strokeDasharray="26 18" />
      ))}
    </g>
  ),
  futbol: (
    <g stroke="#fff" strokeWidth="3" fill="none" opacity=".9">
      <rect x="60" y="60" width="1080" height="680" rx="4" />
      <line x1="600" y1="60" x2="600" y2="740" />
      <circle cx="600" cy="400" r="120" />
      <rect x="60" y="250" width="130" height="300" />
      <rect x="1010" y="250" width="130" height="300" />
    </g>
  ),
  voley: (
    <g stroke="#fff" strokeWidth="3" fill="none" opacity=".9">
      <rect x="180" y="120" width="840" height="560" />
      <line x1="600" y1="120" x2="600" y2="680" strokeWidth="5" />
      <line x1="390" y1="120" x2="390" y2="680" />
      <line x1="810" y1="120" x2="810" y2="680" />
    </g>
  ),
};

export function CourtLines({ slug }: ActivityArtProps) {
  return (
    <svg
      className="court"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {courtLines[slug]}
    </svg>
  );
}
