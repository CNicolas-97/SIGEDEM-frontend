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
    // hero-veil (landing.css): velo claro detrás del texto, sobre la escena.
    <section
      className="hero-veil relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-sand px-6.5 pt-30 max-tablet:px-5.5 max-tablet:pt-26 max-tablet:pb-[238px]"
      id="hero"
    >
      <HeroScene />

      {/* hero-content (landing.css): sube y se desvanece al bajar. */}
      <div className="hero-content relative z-3 mx-auto w-full max-w-page pb-[12vh] text-center max-tablet:pb-0">
        {/* Un único <h1> por página: es el título principal para el SEO. */}
        <h1 className="mx-auto mb-5.5 max-w-[16ch] text-[length:clamp(38px,6.4vw,88px)] leading-[0.96] text-balance text-forest max-tablet:text-[length:clamp(34px,8.6vw,46px)]">
          El complejo municipal, con un solo carnet.
        </h1>
        <p className="mx-auto mb-8 max-w-[46ch] text-[length:clamp(16.5px,1.4vw,19px)] leading-[1.55] text-moss">
          Natatorio climatizado, seis canchas y escuelas deportivas en el
          Teniente Ledesma. Sacás el abono en la ventanilla y entrás mostrando
          el QR.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[clamp(18px,3vw,30px)]">
          <a
            className="rounded-[3px] bg-forest px-[34px] py-[15px] text-[16.5px] font-bold text-cream transition-[translate,background-color] duration-160 ease-[ease] hover:-translate-y-0.5 hover:bg-forest-hover focus-visible:-translate-y-0.5 focus-visible:bg-forest-hover"
            href="#pasos"
          >
            Sacar el abono
          </a>
          <a
            className="border-b-2 border-forest/45 pb-[3px] text-[16.5px] font-semibold text-forest hover:border-forest"
            href="#natacion"
          >
            Ver qué hay en el complejo
          </a>
        </div>
      </div>

      <MembershipCard card={card} />

      {/* hero-scrollcue (landing.css): se desvanece al bajar.
          Va a una distancia fija del borde de abajo y los botones van
          centrados: con menos de 860px de alto se encima a los botones, así
          que en esas pantallas se oculta. */}
      <div className="hero-scrollcue absolute bottom-[calc(9vh+74px)] left-1/2 z-3 flex -translate-x-1/2 items-center gap-2.5 text-[12.5px] tracking-[0.03em] text-sage max-tablet:hidden [@media(max-height:859px)]:hidden">
        <span className="block h-0.5 w-[34px] origin-left animate-pull bg-current" />{' '}
        Entrá al complejo
      </div>

      <TodayBoard activities={activities} now={now} />
    </section>
  );
}
