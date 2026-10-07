import { cn } from '@/shared/lib/cn.ts';
import type { Activity } from '@/features/landing/model/activities.ts';
import {
  formatSchedule,
  formatToday,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';

// QUÉ ES: los horarios de hoy en el hero: si el complejo está abierto y el
// horario de cada actividad, siempre a la vista (sin desplegable).
// NIVEL: componente presentacional — no lee el reloj por su cuenta: recibe
// la fecha por props ("now") y calcula todo a partir de ella.
// DÓNDE SE USA: dentro de Hero.
// CÓMO SE VE: desde 861px es una franja abajo a la izquierda, con las
// actividades en fila; en celular va debajo de los botones, una por renglón.

type TodayBoardProps = {
  activities: Activity[];
  now: Date;
};

// Etiqueta "abierto / cerrado" con un puntito delante. El "before:" dibuja el
// punto; el color del punto se elige en cada uso.
const STATUS_CLASSES =
  'flex items-center gap-[7px] font-bold not-italic before:size-2 before:flex-none before:rounded-full';

export function TodayBoard({ activities, now }: TodayBoardProps) {
  const hour = now.getHours();
  // Si al menos una actividad está abierta, el complejo figura abierto.
  const isComplexOpen = activities.some(
    (activity) => getOpeningStatus(activity.schedule, hour).isOpen
  );

  return (
    // hero-board (landing.css): baja y se desvanece con el scroll.
    // <section> con aria-label: los lectores de pantalla la anuncian como
    // "Horarios de hoy".
    <section
      aria-label="Horarios de hoy"
      className="hero-board z-4 rounded-2xl bg-pool text-cream shadow-[0_18px_36px_-18px] shadow-pool/70 tablet:absolute tablet:bottom-[clamp(20px,4vh,36px)] tablet:left-[clamp(20px,4vw,64px)] tablet:flex max-tablet:relative max-tablet:mt-10"
    >
      {/* Encabezado: estado del complejo y fecha de hoy. */}
      <div className="flex items-center gap-3 px-4 py-3 max-tablet:border-b max-tablet:border-cream/12 tablet:border-r tablet:border-cream/12">
        <ClockIcon className="size-[22px] flex-none opacity-85" />
        <span className="flex flex-col gap-0.5">
          <i
            className={cn(
              STATUS_CLASSES,
              'text-[14.5px]',
              isComplexOpen ? 'before:bg-open-bright' : 'before:bg-closed'
            )}
          >
            {isComplexOpen ? 'Complejo abierto' : 'Complejo cerrado'}
          </i>
          <span className="text-[12.5px] opacity-72">
            Hoy, {formatToday(now)}
          </span>
        </span>
      </div>

      {/* Una actividad por ítem, armada con map(). En compu van en fila;
          en celular, una debajo de la otra. */}
      <ul className="flex divide-cream/12 max-tablet:flex-col max-tablet:divide-y tablet:divide-x">
        {activities.map((activity) => {
          const status = getOpeningStatus(activity.schedule, hour);
          return (
            <li
              key={activity.slug}
              className="flex justify-between gap-3 px-4 py-2.5 max-tablet:items-center tablet:flex-col tablet:justify-center tablet:gap-0.5"
            >
              <span className="flex flex-col max-tablet:flex-row max-tablet:items-baseline max-tablet:gap-2">
                <b className="text-[14.5px] font-bold">{activity.name}</b>
                <span className="text-[13px] tabular-nums opacity-72">
                  {formatSchedule(activity.schedule)}
                </span>
              </span>
              <i
                className={cn(
                  STATUS_CLASSES,
                  'text-[12.5px] opacity-85',
                  status.isOpen ? 'before:bg-open-bright' : 'before:bg-closed'
                )}
              >
                {status.label}
              </i>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

type IconProps = {
  className?: string;
};

function ClockIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
