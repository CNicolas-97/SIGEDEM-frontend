import type { MembershipStep } from '@/features/landing/model/membership.ts';

// QUÉ ES: la sección "Cómo asociarse", con los pasos del trámite.
// NIVEL: componente presentacional.
// DÓNDE SE USA: en LandingPageContainer.

type StepsSectionProps = {
  steps: MembershipStep[];
};

export function StepsSection({ steps }: StepsSectionProps) {
  return (
    <section className="steps" id="pasos">
      <div className="steps-inner">
        <h2>Asociarse lleva cinco minutos</h2>
        <p>
          Se hace en la ventanilla del complejo, de lunes a sábado de 8 a 20. Si
          ya sos socio, renovás desde la app sin venir.
        </p>
        <div className="step-grid">
          {/* map() también da el índice (0, 1, 2): lo usamos para numerar. */}
          {steps.map((step, index) => (
            <div key={step.title} className="step">
              <span className="num">Paso {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        <a className="btn" href="#hero">
          Ver planes y precios
        </a>
      </div>
    </section>
  );
}
