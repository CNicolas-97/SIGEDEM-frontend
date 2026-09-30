import { HeroScene } from '@/features/landing/components/HeroScene.tsx';
import { MembershipCard } from '@/features/landing/components/MembershipCard.tsx';
import { TodayBoard } from '@/features/landing/components/TodayBoard.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';
import type { MembershipCardData } from '@/features/landing/model/membership.ts';

// QUÉ ES: la primera pantalla de la home: título, botones, carnet y tablero
// de horarios, sobre la escena animada de fondo.
// NIVEL: componente presentacional — arma la sección con otros componentes y
// les reparte las props que recibe.
// DÓNDE SE USA: en LandingPageContainer.

type HeroProps = {
  card: MembershipCardData;
  activities: Activity[];
  now: Date;
};

export function Hero({ card, activities, now }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <HeroScene />

      <div className="hero-grid">
        {/* Un único <h1> por página: es el título principal para el SEO. */}
        <h1>El complejo municipal, con un solo carnet.</h1>
        <p className="lede">
          Natatorio climatizado, seis canchas y escuelas deportivas en el
          Teniente Ledesma. Sacás el abono en la ventanilla y entrás mostrando
          el QR.
        </p>
        <div className="actions">
          <a className="ticket" href="#pasos">
            Sacar el abono
          </a>
          <a className="plain" href="#natacion">
            Ver qué hay en el complejo
          </a>
        </div>
      </div>

      <MembershipCard card={card} />

      <div className="scrollcue">
        <span className="bar" /> Entrá al complejo
      </div>

      <TodayBoard activities={activities} now={now} />
    </section>
  );
}
