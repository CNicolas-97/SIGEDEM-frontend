import type { CSSProperties } from 'react';
import { Link } from 'react-router';
import { Button } from '@/shared/ui/Button.tsx';
import { Card } from '@/shared/ui/Card.tsx';
import { CourtLines } from '@/features/landing/components/ActivityArt.tsx';
import { ActivityPhoto } from '@/features/landing/components/ActivityPhoto.tsx';
import { StatList } from '@/features/landing/components/StatList.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';
import {
  formatSchedule,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';

// QUÉ ES: el contenido de la página de UNA actividad: foto, descripción,
// horario de hoy, datos destacados e información extra.
// NIVEL: componente presentacional — recibe la actividad ya encontrada y la
// fecha por props; no lee la URL ni el reloj por su cuenta.
// DÓNDE SE USA: en ActivityDetailPageContainer.

type ActivityDetailProps = {
  activity: Activity;
  now: Date;
};

export function ActivityDetail({ activity, now }: ActivityDetailProps) {
  // Mismo truco que ActivitySection: el color de fondo va en la variable --sec.
  const sectionStyle = { '--sec': activity.theme.bg } as CSSProperties;
  const status = getOpeningStatus(activity.schedule, now.getHours());

  return (
    // El id es el slug: useSectionTheme lo busca para aplicar los colores.
    <section className="sport detail" id={activity.slug} style={sectionStyle}>
      <CourtLines slug={activity.slug} />
      <div className="sport-inner">
        <ActivityPhoto activity={activity} loading="eager" />
        <div className="copy">
          <Link className="back" to="/">
            ← Volver al inicio
          </Link>
          {/* En esta página el título de la actividad es el <h1>. */}
          <h1>{activity.title}</h1>
          <p>{activity.description}</p>
          <p className="today">
            <b>Hoy</b> {formatSchedule(activity.schedule)}
            <i className={status.isOpen ? 'on' : 'off'}>{status.label}</i>
          </p>
          <StatList stats={activity.stats} />
        </div>
      </div>

      <div className="detail-more">
        <h2>Lo que tenés que saber</h2>
        <ul className="highlights">
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
        {/* El mismo Button con distinta "variant": relleno o solo borde. */}
        <div className="detail-actions">
          <Button to="/#pasos">Cómo asociarse</Button>
          <Button to="/#natacion" variant="secondary">
            Ver todas las actividades
          </Button>
        </div>
      </div>
    </section>
  );
}
