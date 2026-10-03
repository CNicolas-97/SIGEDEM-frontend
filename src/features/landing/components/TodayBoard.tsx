import { cn } from '@/shared/lib/cn.ts';
import type { Activity } from '@/features/landing/model/activities.ts';
import {
  formatSchedule,
  formatToday,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';

// QUÉ ES: la franja "Hoy" al pie del hero: fecha y si cada actividad está
// abierta en este momento.
// NIVEL: componente presentacional. No lee el reloj por su cuenta: recibe la
// fecha por props ("now"), así el resultado depende solo de sus props.
// DÓNDE SE USA: dentro de Hero.

type TodayBoardProps = {
  activities: Activity[];
  now: Date;
};

// Clases de cada celda del tablero y de su etiqueta "abierto / cerrado".
// El "before:" dibuja el puntito de color (toma el color del texto).
const CELL_CLASSES =
  'flex flex-col gap-0.5 px-[clamp(16px,2.4vw,30px)] pt-3 pb-[13px] backdrop-blur-[6px]';
const STATUS_CLASSES =
  'mt-1 flex items-center gap-[7px] text-[12.5px] font-bold not-italic before:size-2 before:flex-none before:rounded-full before:bg-current';

export function TodayBoard({ activities, now }: TodayBoardProps) {
  const hour = now.getHours();
  // Si al menos una actividad está abierta, el complejo figura abierto.
  const isComplexOpen = activities.some(
    (activity) => getOpeningStatus(activity.schedule, hour).isOpen
  );

  return (
    // hero-board (landing.css): baja y se desvanece con el scroll.
    // gap-px + fondo: las líneas finas entre celdas.
    <div className="hero-board absolute inset-x-0 bottom-0 z-3 grid grid-cols-[1.1fr_1fr_1fr_1fr] gap-px bg-pool/20 max-tablet:grid-cols-[1fr_1fr]">
      {/* La celda "Hoy" va oscura; hasta 860px ocupa toda la fila. */}
      <div
        className={cn(
          CELL_CLASSES,
          'bg-pool text-cream max-tablet:col-span-full'
        )}
      >
        <b className="text-[14.5px] font-bold">Hoy</b>
        <span className="text-[13px] tabular-nums opacity-72">
          {formatToday(now)}
        </span>
        <i className={STATUS_CLASSES}>
          {isComplexOpen ? 'Complejo abierto' : 'Complejo cerrado'}
        </i>
      </div>
      {activities.map((activity) => {
        const status = getOpeningStatus(activity.schedule, hour);
        return (
          <div
            key={activity.slug}
            className={cn(CELL_CLASSES, 'bg-cream/93 text-pool')}
          >
            <b className="text-[14.5px] font-bold">{activity.name}</b>
            <span className="text-[13px] tabular-nums opacity-72">
              {formatSchedule(activity.schedule)}
            </span>
            <i
              className={cn(
                STATUS_CLASSES,
                status.isOpen ? 'text-open' : 'text-closed'
              )}
            >
              {status.label}
            </i>
          </div>
        );
      })}
    </div>
  );
}
