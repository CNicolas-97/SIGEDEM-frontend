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
        {/* Cada texto es distinto dentro de un plan, así que el propio texto
            sirve como key. El "before:" dibuja un guion de color delante. */}
        {plan.includes.map((item) => (
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
