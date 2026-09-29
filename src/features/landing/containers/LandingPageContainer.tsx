import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Seo } from '@/shared/ui/Seo.tsx';
import { ActivitySection } from '@/features/landing/components/ActivitySection.tsx';
import { Hero } from '@/features/landing/components/Hero.tsx';
import { StepsSection } from '@/features/landing/components/StepsSection.tsx';
import { useScrollMotion } from '@/features/landing/hooks/useScrollMotion.ts';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { activities } from '@/features/landing/model/activities.ts';
import {
  membershipSteps,
  sampleCard,
} from '@/features/landing/model/membership.ts';
import { pageSections } from '@/features/landing/model/sectionTheme.ts';

// QUÉ ES: la página de inicio del sitio público (Complejo Teniente Ledesma).
// NIVEL: container — obtiene los datos (de model/, y más adelante de la API)
// y se los pasa por props a los componentes presentacionales.
// Equivale a una "página" (page): React Router muestra este componente en la
// ruta "/" (ver App.tsx). El header y el footer los pone PublicLayout.
export function LandingPageContainer() {
  // Fecha y hora al abrir la página, para el tablero "Hoy".
  // La función dentro de useState se ejecuta solo en el primer render: así
  // la fecha no cambia en cada re-render y los componentes quedan "puros".
  const [now] = useState(() => new Date());
  const location = useLocation();

  useSectionTheme(pageSections);
  useScrollMotion();

  // Links como "/#pasos": al llegar desde otra página, React Router cambia la
  // URL pero no baja solo hasta la sección. Buscamos el elemento con ese id
  // (el hash sin el "#") y lo llevamos a la pantalla.
  // Depende de "location" entero: cada navegación crea un objeto nuevo, así
  // que también funciona si se toca dos veces el mismo link.
  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    target?.scrollIntoView();
  }, [location]);

  return (
    <>
      <Seo
        title="Inicio"
        description="Complejo Deportivo Municipal Teniente Ledesma: natatorio climatizado, canchas de fútbol y vóley. Sacá el abono y entrá con el QR."
      />
      {/* <main>: contenido principal de la página. Debe haber uno solo. */}
      <main>
        <Hero card={sampleCard} activities={activities} now={now} />
        {/* Un mismo componente para las tres actividades: cambian las props. */}
        {activities.map((activity) => (
          <ActivitySection key={activity.slug} activity={activity} />
        ))}
        <StepsSection steps={membershipSteps} />
      </main>
    </>
  );
}
