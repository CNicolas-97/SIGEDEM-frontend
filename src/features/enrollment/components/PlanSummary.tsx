import { Link } from 'react-router';
import { PlanCard } from '@/features/plans/components/PlanCard.tsx';
import type { Plan } from '@/features/plans/model/plans.ts';

// QUÉ ES: el resumen del plan elegido, al costado del formulario.
// NIVEL: componente presentacional. Reutiliza la PlanCard de /planes, sin
// su botón.
// DÓNDE SE USA: en EnrollmentPageContainer. Cambia solo al elegir otro plan
// en el desplegable, porque el plan llega por props desde el estado.

type PlanSummaryProps = {
  // undefined = todavía no eligió ninguno.
  plan?: Plan;
};

export function PlanSummary({ plan }: PlanSummaryProps) {
  return (
    // En pantallas anchas queda fijo mientras se baja por el formulario.
    <aside className="grid gap-4 laptop:sticky laptop:top-[110px]">
      <h2 className="text-[15px] font-semibold tracking-normal opacity-70 font-body">
        Tu plan
      </h2>
      {plan ? (
        <PlanCard plan={plan} showAction={false} />
      ) : (
        <p className="rounded-[22px] border border-dashed border-white/25 p-6 text-[15.5px] opacity-80">
          Elegí un plan en el formulario para ver el precio y qué incluye.
        </p>
      )}
      <Link
        to="/planes"
        className="justify-self-start text-[15px] font-semibold text-accent underline-offset-4 hover:underline"
      >
        Comparar todos los planes
      </Link>
    </aside>
  );
}
