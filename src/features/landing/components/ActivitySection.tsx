import type { CSSProperties } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import { CourtLines } from '@/features/landing/components/ActivityArt.tsx';
import { ActivityCard } from '@/features/landing/components/ActivityCard.tsx';
import { StatList } from '@/features/landing/components/StatList.tsx';
import { useInView } from '@/features/landing/hooks/useInView.ts';
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
  // la utilidad bg-section, definida en index.css). TypeScript no conoce las variables CSS inventadas por
  // nosotros, por eso le aclaramos el tipo con "as CSSProperties".
  // Al entrar en pantalla, la sección se arma pieza por pieza (.reveal en
  // landing.css): tarjeta, nombre, título, texto, cada cifra y el botón.
  const [sectionRef, inView] = useInView<HTMLElement>(0.2);
  const { bg, bgTo = bg } = activity.theme;
  // Fondo en dos tonos: degradé diagonal de bg a bgTo, con la misma
  // transparencia (88 %) que tenía el color liso para que se vea el brillo
  // de atrás.
  const sectionStyle = {
    '--sec': bg,
    backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${bg} 88%, transparent) 15%, color-mix(in srgb, ${bgTo} 88%, transparent) 85%)`,
  } as CSSProperties;

  return (
    // El id es el slug: así funcionan los links "#natacion", "#futbol"...
    <section
      ref={sectionRef}
      className="reveal-group relative overflow-hidden bg-section/88 px-6.5 py-[min(15vh,130px)]"
      id={activity.slug}
      style={sectionStyle}
      data-inview={inView}
    >
      <CourtLines slug={activity.slug} />
      {/* Foto y texto lado a lado; hasta 940px de ancho, uno debajo del otro. */}
      <div className="relative z-1 mx-auto grid max-w-page grid-cols-[1fr] items-center gap-[clamp(34px,5.5vw,76px)] laptop:grid-cols-[1.05fr_0.95fr]">
        <ActivityCard activity={activity} />
        <div>
          <h2
            className="reveal mb-5 text-[length:clamp(38px,5.6vw,66px)]"
            style={{ '--i': 2 } as CSSProperties}
          >
            {activity.title}
          </h2>
          <p
            className="reveal mb-[30px] max-w-[44ch] text-[18.5px] opacity-92"
            style={{ '--i': 3 } as CSSProperties}
          >
            {activity.description}
          </p>
          <StatList stats={activity.stats} revealFrom={4} />
          {/* Lleva a la página de detalle: /actividades/natacion, etc. */}
          {/* El div aparece; el botón queda libre para su propio hover. */}
          <div
            className="reveal"
            style={{ '--i': 4 + activity.stats.length } as CSSProperties}
          >
            <Button to={`/actividades/${activity.slug}`}>
              {activity.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
