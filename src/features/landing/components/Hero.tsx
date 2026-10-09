import type { CSSProperties } from 'react';
import { HeroScene } from '@/features/landing/components/HeroScene.tsx';
import { useInView } from '@/features/landing/hooks/useInView.ts';
import { TodayBoard } from '@/features/landing/components/TodayBoard.tsx';
import type { Activity } from '@/features/landing/model/activities.ts';

// QUÉ ES: la primera pantalla de la home: título, botones y desplegable
// de horarios, sobre la escena animada de fondo.
// NIVEL: componente presentacional — arma la sección con otros componentes y
// les reparte las props que recibe.
// DÓNDE SE USA: en LandingPageContainer.

type HeroProps = {
  activities: Activity[];
  now: Date;
};

// Título dividido en palabras: cada una aparece por separado.
const TITLE_WORDS = 'Complejo Municipal Ledesma'.split(' ');

// Orden de aparición de cada pieza (ver .reveal en landing.css).
function revealOrder(index: number) {
  return { '--i': index } as CSSProperties;
}

export function Hero({ activities, now }: HeroProps) {
  // El hero ya está en pantalla al abrir la página: se arma enseguida,
  // pieza por pieza. Primero la escena, después cada palabra del título,
  // el texto, los botones, la indicación de bajar y el tablero de horarios.
  const [sectionRef, inView] = useInView<HTMLElement>(0.1);
  const afterTitle = 1 + TITLE_WORDS.length;

  return (
    // hero-veil (landing.css): velo claro detrás del texto, sobre la escena.
    // Hasta 860px el desplegable de horarios ocupa todo el ancho abajo: el
    // padding inferior de 110px le reserva ese lugar para que no tape los
    // botones.
    <section
      ref={sectionRef}
      data-inview={inView}
      className="reveal-group hero-veil relative isolate touch-pan-y touch-pinch-zoom flex min-h-svh flex-col justify-center overflow-hidden bg-sand px-6.5 pt-30 max-tablet:px-5.5 max-tablet:pt-26 max-tablet:pb-[110px]"
      id="hero"
    >
      {/* La escena aparece primero, con un fundido desde el crema. Ocupa
          todo el hero, detrás del texto, también en celular. */}
      <div
        className="reveal reveal-fade absolute inset-0 z-1"
        style={revealOrder(0)}
      >
        <HeroScene />
      </div>

      {/* hero-content (landing.css): sube y se desvanece al bajar.
          El desplegable de horarios (TodayBoard) va abajo a la izquierda: el
          padding inferior nunca baja de 128px para que los botones no queden
          debajo de él en pantallas bajas. */}
      <div className="hero-content relative z-3 mx-auto w-full max-w-page pb-[max(12vh,128px)] text-center max-tablet:pb-0">
        {/* Un único <h1> por página: es el título principal para el SEO. */}
        <h1 className="mx-auto mb-5.5 max-w-[16ch] text-[length:clamp(38px,6.4vw,88px)] leading-[0.96] text-balance text-pool max-tablet:text-[length:clamp(34px,8.6vw,46px)]">
          {TITLE_WORDS.map((word, index) => (
            <span key={word}>
              <span
                className="reveal inline-block"
                style={revealOrder(1 + index)}
              >
                {word}
              </span>{' '}
            </span>
          ))}
        </h1>
        <p
          className="reveal mx-auto mb-8 max-w-[46ch] text-[length:clamp(33px,2.8vw,38px)] leading-[1.2] text-pool-muted"
          style={revealOrder(afterTitle)}
        >
          Para la juventud Tucumana
        </p>
        <div className="flex flex-wrap items-center justify-center gap-[clamp(18px,3vw,30px)]">
          {/* Cada botón va en un span que aparece: el link queda libre
              para su propio movimiento al pasar el mouse. */}
          <span className="reveal" style={revealOrder(afterTitle + 1)}>
            <a
              className="rounded-full bg-pool px-[34px] py-[15px] text-[16.5px] font-bold text-cream transition-[translate,background-color] duration-160 ease-[ease] hover:-translate-y-0.5 hover:bg-pool-hover focus-visible:-translate-y-0.5 focus-visible:bg-pool-hover"
              href="#pasos"
            >
              Sacar el abono
            </a>
          </span>
          <span className="reveal" style={revealOrder(afterTitle + 2)}>
            <a
              className="rounded-full border-2 border-pool px-8 py-[13px] text-[16.5px] font-bold text-pool transition-[translate,background-color,color] duration-500 ease-[ease] hover:-translate-y-0.5 hover:bg-pool hover:text-cream focus-visible:-translate-y-0.5 focus-visible:bg-pool focus-visible:text-cream"
              href="#natacion"
            >
              Ver qué hay en el complejo
            </a>
          </span>
        </div>
      </div>

      {/* hero-scrollcue (landing.css): se desvanece al bajar.
          Va a una distancia fija del borde de abajo y los botones van
          centrados: con menos de 860px de alto se encima a los botones, así
          que en esas pantallas se oculta. */}
      <div className="hero-scrollcue absolute bottom-[calc(9vh+74px)] left-1/2 z-3 flex -translate-x-1/2 items-center gap-2.5 text-[12.5px] tracking-[0.03em] text-pool-faint max-tablet:hidden [@media(max-height:859px)]:hidden">
        {/* La pieza que aparece es este span: el div de afuera ya usa
            translate para centrarse. */}
        <span
          className="reveal flex items-center gap-2.5"
          style={revealOrder(afterTitle + 3)}
        >
          <span className="block h-0.5 w-[34px] origin-left animate-pull bg-current" />{' '}
          Entrá al complejo
        </span>
      </div>

      {/* El tablero de horarios aparece último. El envoltorio ocupa todo el
          hero sin tapar los clicks; el tablero se ubica igual que antes. */}
      <div
        className="reveal pointer-events-none absolute inset-0 z-4 [&>*]:pointer-events-auto"
        style={revealOrder(afterTitle + 4)}
      >
        <TodayBoard activities={activities} now={now} />
      </div>
    </section>
  );
}
