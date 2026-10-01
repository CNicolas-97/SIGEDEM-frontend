import { Button } from '@/shared/ui/Button.tsx';
import type { MembershipStep } from '@/features/landing/model/membership.ts';

// QUÉ ES: la sección "Cómo asociarse", con los pasos del trámite.
// NIVEL: componente presentacional.
// DÓNDE SE USA: en LandingPageContainer.

type StepsSectionProps = {
  steps: MembershipStep[];
};

export function StepsSection({ steps }: StepsSectionProps) {
  return (
    <section
      className="relative z-1 mt-10 rounded-t-[44px] bg-paper px-6.5 py-[min(13vh,110px)] text-ink"
      id="pasos"
    >
      <div className="mx-auto max-w-page">
        <h2 className="mb-3.5 max-w-[18ch] text-[length:clamp(34px,5vw,58px)]">
          Asociarse lleva cinco minutos
        </h2>
        <p className="mb-14 max-w-[52ch] text-[18px] opacity-75">
          Se hace en la ventanilla del complejo, de lunes a sábado de 8 a 20. Si
          ya sos socio, renovás desde la app sin venir.
        </p>
        {/* 3 columnas desde 768px (tablet vertical): con menos ancho los
            títulos de los pasos se cortan en dos renglones. */}
        <div className="grid grid-cols-[1fr] gap-6.5 min-[768px]:grid-cols-[repeat(3,1fr)]">
          {/* map() también da el índice (0, 1, 2): lo usamos para numerar. */}
          {steps.map((step, index) => (
            <div key={step.title} className="border-t-[3px] border-ink pt-5">
              <span className="font-display text-[15px] opacity-45">
                Paso {index + 1}
              </span>
              <h3 className="my-2.5 text-[23px]">{step.title}</h3>
              <p className="text-[16px] leading-[1.55] opacity-78">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        {/* Sobre el fondo claro de esta sección el botón va oscuro. */}
        <Button to="/planes" className="mt-[52px] bg-ink text-white">
          Ver planes y precios
        </Button>
      </div>
    </section>
  );
}
