// React es la biblioteca que construye la interfaz. useState es un "hook":
// una funcion de React que permite que un componente recuerde un valor entre
// renderizados y actualice la pantalla cuando ese valor cambia.
import { useState } from 'react';
// cn combina clases CSS de Tailwind. Aqui permite elegir un estilo segun
// cual filtro este seleccionado.
import { cn } from '@/shared/lib/cn.ts';
// Seo agrega datos de la pagina para buscadores y para la pestana del navegador.
import { Seo } from '@/shared/ui/Seo.tsx';
// Este hook sincroniza el tema visual de la pagina con las variables CSS.
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { defaultPageSections } from '@/features/landing/model/sectionTheme.ts';
// Componente que dibuja una tarjeta individual para un plan.
import { PlanCard } from '@/features/plans/components/PlanCard.tsx';
// Datos que muestra esta pagina y el tipo TypeScript permitido para el filtro.
import {
  planFilters,
  plans,
  type PlanFilter,
} from '@/features/plans/model/plans.ts';

// Un componente de React es una funcion que devuelve interfaz usando JSX.
// JSX parece HTML, pero se escribe dentro de TypeScript y permite insertar
// expresiones de JavaScript entre llaves: por ejemplo, {filter}.
// Este componente coordina el filtro y muestra los planes que corresponden.
export function PlansPageContainer() {
  // useState<PlanFilter> declara el tipo del valor recordado. PlanFilter es
  // una union de opciones permitidas, asi TypeScript puede detectar valores
  // invalidos. El array que devuelve contiene el valor actual y una funcion
  // para cambiarlo. El valor inicial es 'todos'.
  const [filter, setFilter] = useState<PlanFilter>('todos');

  // Los hooks se llaman dentro de componentes React. Este sincroniza los
  // colores de la pagina; no devuelve contenido que haya que insertar en JSX.
  useSectionTheme(defaultPageSections);

  // Esta es una expresion condicional: condicion ? resultadoSi : resultadoNo.
  // Si el filtro es 'todos', usamos el array completo. Si no, filter() crea
  // un array con los planes cuyo campo type coincide con el filtro. La flecha
  // => define una funcion corta que se ejecuta para cada plan. No guardamos
  // este resultado en estado porque se puede volver a calcular desde filter.
  const visiblePlans =
    filter === 'todos' ? plans : plans.filter((plan) => plan.type === filter);

  return (
    // Fragment (<></>) agrupa varios elementos JSX sin agregar un contenedor
    // extra al HTML final.
    <>
      {/* Los atributos de un componente se llaman props. Seo recibe aqui
          titulo, ruta y descripcion como datos de la pagina. */}
      <Seo
        title="Planes y precios"
        path="/planes"
        description="Planes del abono del Complejo Teniente Ledesma: individual, familiar o por actividad, con descuento para jubilados y familias numerosas."
      />
      {/* En className se escriben clases de Tailwind, separadas por espacios.
          mx-auto centra horizontalmente; max-w-page limita el ancho usando
          un token del tema; px-6.5 agrega espacio a los lados. pt-[...] y
          pb-[...] son valores personalizados entre corchetes para los espacios
          superior e inferior. env() reserva el area segura del dispositivo. */}
      <main className="mx-auto max-w-page px-6.5 pt-[calc(130px+env(safe-area-inset-top,0px))] pb-[110px]">
        {/* section agrupa contenido relacionado. El id permite que otras
            partes de la pagina puedan enlazar a esta seccion. */}
        <section id="contenido">
          {/* h1 es el titulo principal de la pagina. mb agrega margen abajo;
              text-[length:...] define un tamano adaptable entre limites. */}
          <h1 className="mb-[18px] text-[length:clamp(40px,6vw,72px)]">
            Planes y precios
          </h1>
            {/* p representa un parrafo. max-w-[52ch] limita el ancho a unas 52
              letras promedio para que las lineas sean faciles de leer. */}
            <p className="mb-8 max-w-[52ch] text-[18px] opacity-80">
            Individual, familiar o por actividad. Si te corresponde descuento de
            jubilado o familia numerosa, se aplica en la ventanilla.
          </p>

            {/* map transforma cada opcion de datos en un boton. El resultado
              se inserta aqui como varios elementos JSX. role y aria-label
              describen el grupo para tecnologias de asistencia. */}
            <div
            className="mb-10 flex flex-wrap gap-2.5"
            role="group"
            aria-label="Tipo de plan"
          >
            {planFilters.map((option) => {
              // Comparamos el valor del boton con el estado para saber si
              // esta seleccionado. const crea una variable que no se reasigna.
              const isActive = filter === option.value;
              return (
                <button
                  // React pide una key unica en cada elemento de una lista,
                  // para poder reconocerlo si la lista cambia.
                  key={option.value}
                  // type="button" evita que el boton intente enviar un
                  // formulario si mas adelante se coloca dentro de uno.
                  type="button"
                  // cn() une clases base con un grupo u otro segun isActive.
                  // Las clases base definen cursor, forma, relleno, tamano de
                  // texto y transicion. bg-accent aplica el color de acento;
                  // text-btn-fg el color del texto. Si no esta activo, se
                  // muestra un borde tenue y hover:bg-white/8 cambia el fondo
                  // cuando el puntero pasa por encima. hover: es una variante.
                  className={cn(
                    'cursor-pointer rounded-full px-[18px] py-[9px] text-[15px] font-semibold transition-[background-color,color] duration-180 ease-[ease]',
                    isActive
                      ? 'bg-accent text-btn-fg'
                      : 'inset-ring-[1.5px] inset-ring-white/35 hover:bg-white/8'
                  )}
                  // aria-pressed expresa el estado activo a lectores de
                  // pantalla. onClick recibe una funcion que corre al pulsar;
                  // setFilter actualiza el estado y React vuelve a dibujar.
                  aria-pressed={isActive}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Condicion dentro de JSX: si la cantidad de planes visibles es
          cero, se muestra un mensaje; si no, se dibuja la lista. */}
        {visiblePlans.length === 0 ? (
          <p className="my-[1em] text-[15px] opacity-70">
            No hay planes de este tipo por ahora.
          </p>
        ) : (
          <>
            {/* ul es una lista semantica. grid activa CSS Grid; la regla entre
              corchetes crea columnas de al menos 290px y reparte el espacio
              sobrante. auto-fill agrega tantas columnas como quepan y gap-5
              separa las tarjetas. */}
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5">
            {/* map() produce un elemento li por cada plan. key usa un id
              estable, no la posicion, porque al filtrar cambia el orden y
              la cantidad de elementos. plan se pasa a PlanCard como prop. */}
            {visiblePlans.map((plan) => (
              <li key={plan.id}>
                <PlanCard plan={plan} />
              </li>
            ))}
          </ul>
          </>
        )}

        {/* Nota final; mt-10 agrega espacio arriba y opacity-70 baja el
          contraste para indicar que es informacion secundaria. */}
        <p className="mt-10 text-[15px] opacity-70">
          Precios mensuales de ejemplo. Para el natatorio se pide apto médico,
          que se carga en la misma ventanilla.
        </p>
      </main>
    </>
  );
}
