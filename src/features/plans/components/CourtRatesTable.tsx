import { BallIcon } from '@/features/plans/components/BallIcon.tsx';
import type { CourtRate } from '@/features/plans/model/courts.ts';
import { formatPrice } from '@/features/plans/model/plans.ts';

// QUÉ ES: la tabla de precios por hora de las canchas de UN deporte.
// NIVEL: componente presentacional — recibe el título y las canchas por
// props y las recorre con map(), una fila por cancha.
// DÓNDE SE USA: en PlansPageContainer, una vez por deporte (fútbol y vóley).

type CourtRatesTableProps = {
  // Qué deporte es: elige la pelota que va al lado del título.
  activity: CourtRate['activity'];
  title: string;
  rates: CourtRate[];
};

export function CourtRatesTable({
  activity,
  title,
  rates,
}: CourtRatesTableProps) {
  return (
    <div className="rounded-[22px] border border-white/14 bg-white/6 p-5 backdrop-blur-[6px] min-[768px]:p-6">
      {/* <table>: los precios son datos en filas y columnas, y así el lector
          de pantalla los lee junto con el encabezado de cada columna. */}
      <table className="w-full border-collapse text-left">
        <caption className="mb-4 text-left font-display text-[22px] leading-none">
          {/* El flex va en un <span>: a un <caption> no conviene cambiarle el
              display, porque deja de comportarse como título de la tabla. */}
          <span className="flex items-center gap-2.5">
            <BallIcon activity={activity} className="size-8 text-accent" />
            {title}
          </span>
        </caption>
        <thead>
          <tr className="text-[13px] tracking-[0.06em] uppercase opacity-60">
            <th scope="col" className="pb-2 font-semibold">
              Cancha
            </th>
            <th scope="col" className="pb-2 text-right font-semibold">
              Socio
            </th>
            <th
              scope="col"
              className="pb-2 pl-3 text-right font-semibold min-[768px]:pl-4"
            >
              No socio
            </th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.id} className="border-t border-white/14">
              <th scope="row" className="py-3.5 pr-3 font-normal">
                <span className="block text-[16px] font-semibold">
                  {rate.name}
                </span>
                <span className="block text-[14px] opacity-70">
                  {rate.detail}
                </span>
              </th>
              {/* El precio de socio va con el color de acento: es el que
                  se paga con el abono. */}
              <td className="py-3.5 text-right font-display text-[16px] whitespace-nowrap text-accent tabular-nums min-[768px]:text-[19px]">
                {formatPrice(rate.memberPrice)}
              </td>
              <td className="py-3.5 pl-3 text-right text-[15px] whitespace-nowrap tabular-nums opacity-80 min-[768px]:pl-4 min-[768px]:text-[16px]">
                {formatPrice(rate.publicPrice)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
