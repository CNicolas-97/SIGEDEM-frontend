// Componentes reutilizables de la interfaz: Button dibuja un enlace con
// apariencia de boton y Card proporciona la estructura visual de una tarjeta.
import { Button } from '@/shared/ui/Button.tsx';
import { Card } from '@/shared/ui/Card.tsx';
// formatPrice transforma un numero en moneda; Plan describe los datos
// permitidos para una tarjeta.
import { formatPrice, type Plan } from '@/features/plans/model/plans.ts';

// TypeScript permite describir la forma de los datos que recibe una funcion.
// Este objeto tiene una propiedad llamada plan, cuyo valor debe cumplir Plan.
type PlanCardProps = {
  plan: Plan;
};

// { plan }: PlanCardProps es desestructuracion: extrae la propiedad plan del
// objeto de props. El tipo despues de los dos puntos permite a TypeScript
// comprobar que se reciban los datos correctos.
export function PlanCard({ plan }: PlanCardProps) {
  return (
    // Card recibe informacion mediante props. Lo que se coloca entre la
    // apertura y el cierre del componente se conoce como children, y aparece
    // dentro de la estructura interna de Card.
    <Card
      title={plan.name}
      description={plan.description}
      eyebrow={plan.badge}
      footer={<Button to="/#pasos">Quiero este plan</Button>}
    >
        {/* formatPrice recibe el precio numerico y devuelve texto con moneda.
          Las llaves permiten insertar el resultado JavaScript en JSX. {' '}
          agrega un espacio visible entre el precio y el elemento small. */}
      <p className="mt-1 font-display text-[34px] leading-none text-accent tabular-nums">
        {formatPrice(plan.monthlyPrice)}{' '}
        {/* small marca un texto secundario. font-body usa la tipografia de
          lectura; text-[14px] fija el tamano y opacity-70 lo atenúa. */}
        <small className="font-body text-[14px] text-white opacity-70">
          por mes
        </small>
      </p>
        {/* && es una condicion abreviada: si discountNote existe y no esta
          vacio, React muestra el parrafo; si no, no agrega nada al HTML. */}
        {plan.discountNote && (
        <p className="rounded-[10px] bg-white/8 px-3 py-2 text-[14px]">
          {plan.discountNote}
        </p>
      )}
      {/* Cada beneficio es un elemento de lista. grid y gap-2 los ordenan en
          filas con separacion; text-[15px] define el tamano de lectura. */}
      <ul className="mt-1 grid gap-2 text-[15px]">
        {/* map recorre includes y crea un li para cada texto. Aqui el propio
            texto es una key porque no se repite dentro de esta lista. Las
            clases flex alinean el marcador y el texto; before: aplica estilos
            a un marcador generado por CSS, sin escribir otro elemento HTML. */}
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
