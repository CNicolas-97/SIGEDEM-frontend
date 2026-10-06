import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Seo } from '@/shared/ui/Seo.tsx';
import { ActivityDetail } from '@/features/landing/components/ActivityDetail.tsx';
import { NotFoundPageContainer } from '@/features/landing/containers/NotFoundPageContainer.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { activities } from '@/features/landing/model/activities.ts';
import { getCourtRates } from '@/features/landing/model/courts.ts';
import { pageSections } from '@/features/landing/model/sectionTheme.ts';

// QUÉ ES: la página de detalle de una actividad (/actividades/:slug).
// NIVEL: container (página) — lee el parámetro de la URL, busca la actividad
// en model/ y se la pasa por props a ActivityDetail.
// CÓMO FUNCIONA: en App.tsx la ruta es "/actividades/:slug". Los dos puntos
// marcan una parte variable: en /actividades/futbol, slug vale "futbol".
export function ActivityDetailPageContainer() {
  // useParams devuelve los parámetros de la URL. slug puede ser undefined
  // (TypeScript no sabe desde qué ruta se usa el componente).
  const { slug } = useParams();
  const [now] = useState(() => new Date());

  // pageSections ya tiene un tema por cada slug de actividad: el <section>
  // de ActivityDetail usa el slug como id, así que toma sus mismos colores.
  // Los hooks van antes de cualquier "return": React exige llamarlos siempre
  // en el mismo orden, en todos los renders.
  useSectionTheme(pageSections);

  // Links como "/actividades/futbol#canchas" (botón "Alquilar cancha" del
  // inicio): igual que en la home, bajamos hasta el elemento con ese id.
  const location = useLocation();
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, [location]);

  // find() devuelve la primera actividad cuyo slug coincide, o undefined.
  const activity = activities.find((item) => item.slug === slug);

  // Slug inexistente (ej.: /actividades/tenis): mostramos la página 404.
  if (!activity) {
    return <NotFoundPageContainer />;
  }

  return (
    <>
      <Seo
        title={activity.name}
        description={activity.description}
        path={`/actividades/${activity.slug}`}
      />
      <main>
        <ActivityDetail
          activity={activity}
          now={now}
          courtRates={getCourtRates(activity.slug)}
        />
      </main>
    </>
  );
}
