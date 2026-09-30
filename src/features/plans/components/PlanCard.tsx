import { Button } from '@/shared/ui/Button.tsx';
import { Card } from '@/shared/ui/Card.tsx';
import { formatPrice, type Plan } from '@/features/plans/model/plans.ts';

// QUÉ ES: la tarjeta de UN plan: nombre, precio, qué incluye y un botón.
// NIVEL: componente presentacional — arma la tarjeta con los componentes
// genéricos Card y Button, pasándoles props.
// DÓNDE SE USA: en PlansPageContainer, dentro de plans.map(...).

type PlanCardProps = {
  plan: Plan;
};

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card
      title={plan.name}
      description={plan.description}
      eyebrow={plan.badge}
      footer={<Button to="/#pasos">Quiero este plan</Button>}
    >
      {/* Todo lo que va entre <Card> y </Card> le llega como "children". */}
      <p className="plan-price">
        {formatPrice(plan.monthlyPrice)} <small>por mes</small>
      </p>
      {plan.discountNote && <p className="plan-note">{plan.discountNote}</p>}
      <ul className="plan-includes">
        {/* Cada texto es distinto dentro de un plan, así que el propio texto
            sirve como key. */}
        {plan.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
