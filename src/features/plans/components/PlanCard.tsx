import { Button } from '@/shared/ui/Button.tsx';
import { Card } from '@/shared/ui/Card.tsx';
import {
  formatPrice,
  planBenefits,
  type Plan,
} from '@/features/plans/model/plans.ts';

// QUÉ ES: la tarjeta de UN plan: nombre, para cuántas personas, precio, qué
// incluye y un botón.
// NIVEL: componente presentacional — arma la tarjeta con los componentes
// genéricos Card y Button, pasándoles props.
// DÓNDE SE USA: en PlansPageContainer, dentro de plans.map(...), y en la
// inscripción como resumen del plan elegido.

type PlanCardProps = {
  plan: Plan;
  // Opcional. false = sin el botón "Quiero este plan" (en la inscripción el
  // plan ya está elegido).
  showAction?: boolean;
};

export function PlanCard({ plan, showAction = true }: PlanCardProps) {
  return (
    <Card
      title={plan.name}
      description={plan.description}
      eyebrow={plan.badge}
      // ?plan=...: la inscripción lee este dato de la URL y deja el plan
      // elegido en el formulario.
      footer={
        showAction && (
          <Button to={`/inscripcion?plan=${plan.id}`}>Quiero este plan</Button>
        )
      }
    >
      {/* Todo lo que va entre <Card> y </Card> le llega como "children". */}
      {/* Cuántas personas cubre: es lo que diferencia a un plan de otro. */}
      <p className="self-start rounded-full px-3 py-1 text-[14px] font-semibold inset-ring-[1.5px] inset-ring-white/35">
        {plan.people}
      </p>
      <p className="mt-1 font-display text-[34px] leading-none text-accent tabular-nums">
        {formatPrice(plan.monthlyPrice)}{' '}
        <small className="font-body text-[14px] text-white opacity-70">
          por mes
        </small>
      </p>
      {plan.discountNote && (
        <p className="rounded-[10px] bg-white/8 px-3 py-2 text-[14px]">
          {plan.discountNote}
        </p>
      )}
      <ul className="mt-1 grid gap-2 text-[15px]">
        {/* Los beneficios son los mismos en todos los planes (planBenefits).
            Cada texto es distinto, así que el propio texto sirve como key.
            El "before:" dibuja un guion de color delante. */}
        {planBenefits.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 before:mt-[0.8em] before:h-0.5 before:w-3 before:flex-none before:bg-accent"
          >
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
