import type { CSSProperties } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import { useInView } from '@/features/landing/hooks/useInView.ts';
import type { MembershipStep } from '@/features/landing/model/membership.ts';
// Ícono gratuito de Magnific (Flaticon): la licencia pide citar al autor,
// el crédito está en SiteFooter.
import credentialImage from '@/assets/landing/credencial-socio.webp';

// QUÉ ES: la sección "Cómo asociarse", con los pasos del trámite. Usa el
// mismo azul que la sección de natación (bg-pool).
// NIVEL: componente presentacional.
// DÓNDE SE USA: en LandingPageContainer.

type StepsSectionProps = {
  steps: MembershipStep[];
};

// Orden de aparición de cada pieza (ver .reveal en landing.css).
function revealOrder(index: number) {
  return { '--i': index } as CSSProperties;
}

export function StepsSection({ steps }: StepsSectionProps) {
  // Al entrar en pantalla, la sección se arma pieza por pieza: título,
  // texto, credencial, cada paso y el botón.
  const [sectionRef, inView] = useInView<HTMLElement>(0.2);

  return (
    <section
      ref={sectionRef}
      data-inview={inView}
      className="reveal-group relative z-1 bg-pool px-6.5 py-[min(13vh,110px)] text-white"
      id="pasos"
    >
      <div className="mx-auto max-w-page">
        {/* Texto a la izquierda y la credencial a la derecha. En celular
            la credencial se oculta para no empujar los pasos hacia abajo. */}
        <div className="mb-14 flex items-center justify-between gap-8">
          <div>
            <h2
              className="reveal mb-3.5 max-w-[18ch] text-[length:clamp(34px,5vw,58px)]"
              style={revealOrder(0)}
            >
              Asociarse lleva cinco minutos
            </h2>
            <p
              className="reveal max-w-[52ch] text-[18px] opacity-75"
              style={revealOrder(1)}
            >
              Completás la inscripción acá y la terminás en la ventanilla del
              complejo, de lunes a sábado de 8 a 20. Si ya sos socio, renovás
              desde la app sin venir.
            </p>
          </div>
          {/* alt vacío: es decorativa, el texto ya dice todo. */}
          <img
            src={credentialImage}
            alt=""
            width={256}
            height={180}
            loading="lazy"
            className="reveal reveal-big hidden w-[clamp(150px,18vw,230px)] shrink-0 -rotate-6 min-[768px]:block"
            style={revealOrder(2)}
          />
        </div>
        {/* 3 columnas desde 768px (tablet vertical): con menos ancho los
            títulos de los pasos se cortan en dos renglones. */}
        <div className="grid grid-cols-[1fr] gap-6.5 min-[768px]:grid-cols-[repeat(3,1fr)]">
          {/* map() también da el índice (0, 1, 2): lo usamos para numerar. */}
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="reveal border-t-[3px] border-white pt-5"
              style={revealOrder(3 + index)}
            >
              <span className="font-display text-[15px] opacity-60">
                Paso {index + 1}
              </span>
              <h3 className="my-2.5 text-[23px]">{step.title}</h3>
              <p className="text-[16px] leading-[1.55] opacity-78">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        {/* Sin colores propios: usa el acento cian, igual que el botón del header. */}
        <div
          className="reveal mt-[52px] flex flex-wrap gap-3"
          style={revealOrder(3 + steps.length)}
        >
          <Button to="/inscripcion">Inscribirme</Button>
          <Button to="/planes" variant="secondary">
            Ver planes y precios
          </Button>
        </div>
      </div>
    </section>
  );
}
