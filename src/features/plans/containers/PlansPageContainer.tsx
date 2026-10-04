import { useState } from 'react';
import { cn } from '@/shared/lib/cn.ts';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { defaultPageSections } from '@/features/landing/model/sectionTheme.ts';
import { PlanCard } from '@/features/plans/components/PlanCard.tsx';
import {
  planFilters,
  plans,
  type PlanFilter,
} from '@/features/plans/model/plans.ts';

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
      {/* El padding de arriba deja espacio para el header fijo. */}
      <main className="mx-auto max-w-page px-6.5 pt-[calc(130px+env(safe-area-inset-top,0px))] pb-[110px]">
        {/* id="contenido": el bloque que toma los colores de la página. */}
        <section id="contenido">
          <h1 className="mb-[18px] text-[length:clamp(40px,6vw,72px)]">
            Planes y precios
          </h1>
          <p className="mb-8 max-w-[52ch] text-[18px] opacity-80">
            Individual, familiar o por actividad. Si te corresponde descuento de
            jubilado o familia numerosa, se aplica en la ventanilla.
          </p>

          <div
            className="mb-10 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Tipo de plan"
          >
            {planFilters.map((option) => {
              const isActive = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  // cn(): las clases del final dependen de si es el activo,
                  // que se pinta con el color de acento.
                  className={cn(
                    'cursor-pointer rounded-full px-[18px] py-[9px] text-[15px] font-semibold transition-[background-color,color] duration-180 ease-[ease]',
                    isActive
                      ? 'bg-accent text-btn-fg'
                      : 'inset-ring-[1.5px] inset-ring-white/35 hover:bg-white/8'
                  )}
                  // aria-pressed: avisa a los lectores de pantalla cuál está
                  // activo.
                  aria-pressed={isActive}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {visiblePlans.length === 0 ? (
          <p className="my-[1em] text-[15px] opacity-70">
            No hay planes de este tipo por ahora.
          </p>
        ) : (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5">
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

        <p className="mt-10 text-[15px] opacity-70">
          Precios mensuales de ejemplo. Para el natatorio se pide apto médico,
          que se carga en la misma ventanilla.
        </p>
      </main>
    </>
  );
}
