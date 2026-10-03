import { HeroScene } from '@/features/landing/components/HeroScene.tsx';
import { TodayBoard } from '@/features/landing/components/TodayBoard.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';

// QUÉ ES: la primera pantalla de la home: título, botones y tablero
// de horarios, sobre la escena animada de fondo.
// NIVEL: componente presentacional — arma la sección con otros componentes y
// les reparte las props que recibe.
// DÓNDE SE USA: en LandingPageContainer.

type HeroProps = {
  activities: Activity[];
  now: Date;
};

export function Hero({ activities, now }: HeroProps) {
  return (
    // hero-veil (landing.css): velo claro detrás del texto, sobre la escena.
    // Hasta 860px el tablero de horarios tiene 3 filas (293px): el padding
    // inferior de 324px le reserva ese lugar para que no tape los botones.
    <section
      className="hero-veil relative isolate flex min-h-svh flex-col justify-center overflow-hidden bg-sand px-6.5 pt-30 max-tablet:px-5.5 max-tablet:pt-26 max-tablet:pb-[324px]"
      id="hero"
    >
      <HeroScene />

      {/* hero-content (landing.css): sube y se desvanece al bajar.
          El tablero de horarios (TodayBoard) va pegado abajo y mide 97px: el
          padding inferior nunca baja de 128px para que los botones no queden
          debajo de él en pantallas bajas. */}
      <div className="hero-content relative z-3 mx-auto w-full max-w-page pb-[max(12vh,128px)] text-center max-tablet:pb-0">
        {/* Un único <h1> por página: es el título principal para el SEO. */}
        <h1 className="mx-auto mb-5.5 max-w-[16ch] text-[length:clamp(38px,6.4vw,88px)] leading-[0.96] text-balance text-pool max-tablet:text-[length:clamp(34px,8.6vw,46px)]">
          El complejo municipal, con un solo carnet.
        </h1>
        <p className="mx-auto mb-8 max-w-[46ch] text-[length:clamp(16.5px,1.4vw,19px)] leading-[1.55] text-pool-muted">
          Natatorio climatizado, seis canchas y escuelas deportivas en el
          Teniente Ledesma. Sacás el abono en la ventanilla y entrás mostrando
          el QR.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[clamp(18px,3vw,30px)]">
          <a
            className="rounded-[3px] bg-pool px-[34px] py-[15px] text-[16.5px] font-bold text-cream transition-[translate,background-color] duration-160 ease-[ease] hover:-translate-y-0.5 hover:bg-pool-hover focus-visible:-translate-y-0.5 focus-visible:bg-pool-hover"
            href="#pasos"
          >
            Sacar el abono
          </a>
          <a
            className="border-b-2 border-pool/45 pb-[3px] text-[16.5px] font-semibold text-pool hover:border-pool"
            href="#natacion"
          >
            Ver qué hay en el complejo
          </a>
        </div>
      </div>

      {/* hero-scrollcue (landing.css): se desvanece al bajar.
          Va a una distancia fija del borde de abajo y los botones van
          centrados: con menos de 860px de alto se encima a los botones, así
          que en esas pantallas se oculta. */}
      <div className="hero-scrollcue absolute bottom-[calc(9vh+74px)] left-1/2 z-3 flex -translate-x-1/2 items-center gap-2.5 text-[12.5px] tracking-[0.03em] text-pool-faint max-tablet:hidden [@media(max-height:859px)]:hidden">
        <span className="block h-0.5 w-[34px] origin-left animate-pull bg-current" />{' '}
        Entrá al complejo
      </div>

      <TodayBoard activities={activities} now={now} />
    </section>
  );
}
