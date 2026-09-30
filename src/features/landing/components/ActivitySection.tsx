import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { CourtLines } from '@/features/landing/components/ActivityArt.tsx';
import { ActivityPhoto } from '@/features/landing/components/ActivityPhoto.tsx';
import { StatList } from '@/features/landing/components/StatList.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';

// QUÉ ES: la sección de UNA actividad (natación, fútbol o vóley).
// NIVEL: componente presentacional reutilizable: es el mismo componente para
// las tres actividades; lo único que cambia son las props.
// DÓNDE SE USA: en LandingPageContainer, dentro de activities.map(...).

type ActivitySectionProps = {
  activity: Activity;
};

export function ActivitySection({ activity }: ActivitySectionProps) {
  // "--sec" es una variable CSS con el color de fondo de la sección (la usa
  // landing.css). TypeScript no conoce las variables CSS inventadas por
  // nosotros, por eso le aclaramos el tipo con "as CSSProperties".
  const sectionStyle = { '--sec': activity.theme.bg } as CSSProperties;

  return (
    // El id es el slug: así funcionan los links "#natacion", "#futbol"...
    <section className="sport" id={activity.slug} style={sectionStyle}>
      <CourtLines slug={activity.slug} />
      <div className="sport-inner">
        <ActivityPhoto activity={activity} loading="lazy" />
        <div className="copy">
          <h2>{activity.title}</h2>
          <p>{activity.description}</p>
          <StatList stats={activity.stats} />
          {/* Lleva a la página de detalle: /actividades/natacion, etc. */}
          <Link className="btn" to={`/actividades/${activity.slug}`}>
            {activity.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
