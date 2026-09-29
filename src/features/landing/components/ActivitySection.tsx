import type { CSSProperties } from 'react';
import { CourtLines } from '@/features/landing/components/ActivityArt.tsx';
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
        <div className="stage">
          {/* data-tilt: marca para useScrollMotion, que inclina la imagen
              según su posición en la pantalla. */}
          <figure className="shot" data-tilt>
            {/* sizes: ancho que ocupa la foto en pantalla. Con eso y el
                srcSet, el navegador decide qué archivo descargar.
                loading="lazy": la foto se baja recién cuando está por
                aparecer al hacer scroll, así no demora la carga inicial.
                width/height: reservan el lugar antes de que llegue la
                imagen y evitan que la página "salte". */}
            <img
              className="fill photo"
              src={activity.image.src}
              srcSet={activity.image.srcSet}
              sizes="(max-width: 940px) 100vw, 580px"
              alt={activity.image.alt}
              width={400}
              height={500}
              loading="lazy"
              decoding="async"
            />
            <figcaption className="float">{activity.name}</figcaption>
          </figure>
        </div>
        <div className="copy">
          <h2>{activity.title}</h2>
          <p>{activity.description}</p>
          <StatList stats={activity.stats} />
          <a className="btn" href="#pasos">
            {activity.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
