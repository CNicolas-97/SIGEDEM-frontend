import type { CSSProperties } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import { CourtLines } from '@/features/landing/components/ActivityArt.tsx';
import { ActivityPhoto } from '@/features/landing/components/ActivityPhoto.tsx';
import { StatList } from '@/features/landing/components/StatList.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';
import {
  getLowestMemberPrice,
  type CourtRate,
} from '@/features/landing/model/courts.ts';
import { formatPrice } from '@/features/plans/model/plans.ts';

// QUÉ ES: la sección de UNA actividad (natación, fútbol o vóley).
// NIVEL: componente presentacional reutilizable: es el mismo componente para
// las tres actividades; lo único que cambia son las props.
// DÓNDE SE USA: en LandingPageContainer, dentro de activities.map(...).

type ActivitySectionProps = {
  activity: Activity;
  // Canchas para alquilar. Vacío en natación: ahí no se muestra el precio.
  courtRates: CourtRate[];
};

export function ActivitySection({
  activity,
  courtRates,
}: ActivitySectionProps) {
  const hasCourts = courtRates.length > 0;

  // "--sec" es una variable CSS con el color de fondo de la sección (la usa
  // la utilidad bg-section, definida en index.css). TypeScript no conoce las variables CSS inventadas por
  // nosotros, por eso le aclaramos el tipo con "as CSSProperties".
  const sectionStyle = { '--sec': activity.theme.bg } as CSSProperties;

  return (
    // El id es el slug: así funcionan los links "#natacion", "#futbol"...
    <section
      className="relative overflow-hidden bg-section/88 px-6.5 py-[min(15vh,130px)]"
      id={activity.slug}
      style={sectionStyle}
    >
      <CourtLines slug={activity.slug} />
      {/* Foto y texto lado a lado; hasta 940px de ancho, uno debajo del otro. */}
      <div className="relative z-1 mx-auto grid max-w-page grid-cols-[1fr] items-center gap-[clamp(34px,5.5vw,76px)] laptop:grid-cols-[1.05fr_0.95fr]">
        <ActivityPhoto activity={activity} loading="lazy" />
        <div>
          <h2 className="mb-5 text-[length:clamp(38px,5.6vw,66px)]">
            {activity.title}
          </h2>
          <p className="mb-[30px] max-w-[44ch] text-[18.5px] opacity-92">
            {activity.description}
          </p>
          <StatList stats={activity.stats} />
          {/* Fútbol y vóley: el precio más bajo, como adelanto. La tabla
              completa está en la página del deporte. */}
          {hasCourts && (
            <p className="mb-6 text-[17px]">
              Alquiler de cancha desde{' '}
              <strong className="font-display text-[20px] text-accent tabular-nums">
                {formatPrice(getLowestMemberPrice(courtRates))}
              </strong>{' '}
              la hora para socios.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {/* Lleva a la página de detalle: /actividades/natacion, etc. */}
            <Button to={`/actividades/${activity.slug}`}>
              {activity.ctaLabel}
            </Button>
            {/* "#canchas": la página del deporte baja directo a la tabla. */}
            {hasCourts && (
              <Button
                to={`/actividades/${activity.slug}#canchas`}
                variant="secondary"
              >
                Alquilar cancha
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
