import { useState } from 'react';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { defaultPageSections } from '@/features/landing/model/sectionTheme.ts';
import { PlanCard } from '@/features/plans/components/PlanCard.tsx';
import {
  planFilters,
  plans,
  type PlanFilter,
} from '@/features/plans/model/plans.ts';
import '@/features/plans/plans.css';

// QUÉ ES: la página de planes y precios (/planes).
// NIVEL: container (página) — guarda el filtro elegido, filtra los planes de
// model/ y se los pasa a PlanCard por props.
// map() EN ESTA PÁGINA: los botones del filtro, las tarjetas de los planes y,
// dentro de cada PlanCard, la lista de lo que incluye.
export function PlansPageContainer() {
  // Estado: qué filtro está elegido. Arranca en "todos".
  const [filter, setFilter] = useState<PlanFilter>('todos');

  // Mismo header y colores que las otras páginas simples (ver sectionTheme.ts).
  useSectionTheme(defaultPageSections);

  // filter() devuelve un array NUEVO solo con los planes que cumplen la
  // condición. No hace falta guardarlo en un estado: se recalcula en cada
  // render a partir de "filter".
  const visiblePlans =
    filter === 'todos' ? plans : plans.filter((plan) => plan.type === filter);

  return (
    <>
      <Seo
        title="Planes y precios"
        path="/planes"
        description="Planes del abono del Complejo Teniente Ledesma: individual, familiar o por actividad, con descuento para jubilados y familias numerosas."
      />
      <main className="plans-page">
        {/* id="contenido": el bloque que toma los colores de la página. */}
        <section className="plans-intro" id="contenido">
          <h1>Planes y precios</h1>
          <p>
            Individual, familiar o por actividad. Si te corresponde descuento de
            jubilado o familia numerosa, se aplica en la ventanilla.
          </p>

          <div className="plan-filters" role="group" aria-label="Tipo de plan">
            {planFilters.map((option) => (
              <button
                key={option.value}
                type="button"
                className="plan-filter"
                // aria-pressed: avisa a los lectores de pantalla cuál está
                // activo; el CSS también lo usa para pintarlo.
                aria-pressed={filter === option.value}
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {visiblePlans.length === 0 ? (
          <p className="plans-empty">No hay planes de este tipo por ahora.</p>
        ) : (
          <ul className="plan-grid">
            {/* key={plan.id}: React usa la key para saber qué tarjeta es cuál
                cuando la lista cambia (al filtrar). Tiene que ser única y
                estable: por eso el id del plan y no el índice del map, porque
                al filtrar un mismo plan puede pasar de la posición 3 a la 0. */}
            {visiblePlans.map((plan) => (
              <li key={plan.id}>
                <PlanCard plan={plan} />
              </li>
            ))}
          </ul>
        )}

        <p className="plans-footnote">
          Precios mensuales de ejemplo. Para el natatorio se pide apto médico,
          que se carga en la misma ventanilla.
        </p>
      </main>
    </>
  );
}
