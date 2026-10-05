import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { cn } from '@/shared/lib/cn.ts';
import { Button } from '@/shared/ui/Button.tsx';
import { Card } from '@/shared/ui/Card.tsx';
import { CourtLines } from '@/features/landing/components/ActivityArt.tsx';
import { CourtRatesTable } from '@/features/landing/components/CourtRatesTable.tsx';
import { ActivityPhoto } from '@/features/landing/components/ActivityPhoto.tsx';
import { StatList } from '@/features/landing/components/StatList.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';
import type { CourtRate } from '@/features/landing/model/courts.ts';
import {
  formatSchedule,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';

// QUÉ ES: el contenido de la página de UNA actividad: foto, descripción,
// horario de hoy, datos destacados, información extra y, en fútbol y vóley,
// el alquiler de canchas.
// NIVEL: componente presentacional — recibe la actividad ya encontrada y la
// fecha por props; no lee la URL ni el reloj por su cuenta.
// DÓNDE SE USA: en ActivityDetailPageContainer.

type ActivityDetailProps = {
  activity: Activity;
  now: Date;
  // Canchas para alquilar. Vacío en natación: no se muestra la tabla.
  courtRates: CourtRate[];
};

export function ActivityDetail({
  activity,
  now,
  courtRates,
}: ActivityDetailProps) {
  // Mismo truco que ActivitySection: el color de fondo va en la variable --sec.
  const sectionStyle = { '--sec': activity.theme.bg } as CSSProperties;
  const status = getOpeningStatus(activity.schedule, now.getHours());

  return (
    // El id es el slug: useSectionTheme lo busca para aplicar los colores.
    // Mismas clases que ActivitySection, salvo el padding de arriba: deja
    // espacio para el header fijo.
    <section
      className="relative overflow-hidden bg-section/88 px-6.5 pt-[calc(120px+env(safe-area-inset-top,0px))] pb-[min(15vh,130px)]"
      id={activity.slug}
      style={sectionStyle}
    >
      <CourtLines slug={activity.slug} />
      <div className="relative z-1 mx-auto grid max-w-page grid-cols-[1fr] items-center gap-[clamp(34px,5.5vw,76px)] laptop:grid-cols-[1.05fr_0.95fr]">
        <ActivityPhoto activity={activity} loading="eager" />
        <div>
          <Link
            className="mb-5.5 inline-block border-b-[1.5px] border-transparent text-[15px] font-semibold opacity-80 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100"
            to="/"
          >
            ← Volver al inicio
          </Link>
          {/* En esta página el título de la actividad es el <h1>. */}
          <h1 className="mb-5 text-[length:clamp(38px,5.6vw,66px)]">
            {activity.title}
          </h1>
          <p className="mb-[30px] max-w-[44ch] text-[18.5px] opacity-92">
            {activity.description}
          </p>
          <p className="mb-[30px] flex max-w-[44ch] flex-wrap items-center gap-x-3 gap-y-2 text-[16px] tabular-nums opacity-92">
            <b>Hoy</b> {formatSchedule(activity.schedule)}
            <i
              className={cn(
                'rounded-full bg-white/12 px-2.5 py-[3px] text-[13px] font-bold not-italic',
                status.isOpen && 'text-accent'
              )}
            >
              {status.label}
            </i>
          </p>
          <StatList stats={activity.stats} />
        </div>
      </div>

      <div className="relative z-1 mx-auto mt-[clamp(56px,9vh,96px)] max-w-page">
        <h2 className="mb-7 text-[length:clamp(30px,4vw,46px)]">
          Lo que tenés que saber
        </h2>
        <ul className="mb-10 grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
          {/* Un <li> por cada dato extra, con una Card adentro. El título no
              se repite dentro de una actividad, así que sirve como key. */}
          {activity.highlights.map((highlight) => (
            <li key={highlight.title}>
              <Card
                title={highlight.title}
                description={highlight.description}
              />
            </li>
          ))}
        </ul>
        {courtRates.length > 0 && (
          // id="canchas": el botón "Alquilar cancha" del inicio baja hasta acá.
          // scroll-mt deja lugar para el header fijo al llegar.
          <section id="canchas" className="mb-12 scroll-mt-[110px]">
            <h2 className="mb-3.5 text-[length:clamp(30px,4vw,46px)]">
              Alquiler de canchas
            </h2>
            <p className="mb-7 max-w-[56ch] text-[17px] opacity-85">
              Se alquilan por hora, en la ventanilla o desde la web. Con el
              abono pagás el precio de socio.
            </p>
            <div className="max-w-[640px]">
              <CourtRatesTable
                activity={courtRates[0].activity}
                title="Precio por hora"
                rates={courtRates}
              />
            </div>
          </section>
        )}
        {/* El mismo Button con distinta "variant": relleno o solo borde. */}
        <div className="flex flex-wrap gap-3.5">
          <Button to="/#pasos">Cómo asociarse</Button>
          <Button to="/#natacion" variant="secondary">
            Ver todas las actividades
          </Button>
        </div>
      </div>
    </section>
  );
}
