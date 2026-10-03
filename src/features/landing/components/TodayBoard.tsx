import { useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/cn.ts';
import type { Activity } from '@/features/landing/model/activities.ts';
import {
  formatSchedule,
  formatToday,
  getOpeningStatus,
} from '@/features/landing/model/schedule.ts';

// QUÉ ES: el desplegable "Hoy" abajo a la izquierda del hero: muestra si el
// complejo está abierto y, al tocarlo, el horario de cada actividad.
// NIVEL: componente con estado propio (useState + useEffect). No lee el reloj
// por su cuenta: recibe la fecha por props ("now").
// DÓNDE SE USA: dentro de Hero.
// CÓMO FUNCIONA: "isOpen" arranca en false. El botón lo invierte; mientras
// está en true se dibuja el panel, y un useEffect escucha la tecla Escape y
// los clics fuera del desplegable para cerrarlo.

type TodayBoardProps = {
  activities: Activity[];
  now: Date;
};

// Etiqueta "abierto / cerrado" con un puntito delante. El "before:" dibuja el
// punto y toma el color del texto.
const STATUS_CLASSES =
  'flex items-center gap-[7px] font-bold not-italic before:size-2 before:flex-none before:rounded-full before:bg-current';

export function TodayBoard({ activities, now }: TodayBoardProps) {
  // Estado: si el panel de horarios está desplegado.
  const [isOpen, setIsOpen] = useState(false);
  // useRef: acceso al <div> real, para saber si un clic cayó adentro o afuera.
  const containerRef = useRef<HTMLDivElement>(null);

  // Se ejecuta cada vez que cambia "isOpen". Solo con el panel abierto
  // escuchamos el teclado y los clics de la página; la función que devuelve
  // saca esos listeners al cerrarse (o si el componente desaparece).
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    function handlePointerDown(event: PointerEvent) {
      const container = containerRef.current;
      if (container && !container.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  const hour = now.getHours();
  // Si al menos una actividad está abierta, el complejo figura abierto.
  const isComplexOpen = activities.some(
    (activity) => getOpeningStatus(activity.schedule, hour).isOpen
  );

  return (
    // hero-board (landing.css): baja y se desvanece con el scroll.
    <div
      ref={containerRef}
      className="hero-board absolute bottom-[clamp(20px,4vh,36px)] left-[clamp(20px,4vw,64px)] z-4 w-[340px] max-tablet:right-5.5 max-tablet:left-5.5 max-tablet:w-auto"
    >
      {/* El panel se abre hacia arriba, encima del botón. Solo existe en el
          DOM mientras isOpen es true. starting: = estado inicial de la
          animación de entrada. */}
      {isOpen && (
        <div
          id="horarios-hoy"
          className="absolute inset-x-0 bottom-full mb-2.5 rounded-2xl bg-cream/95 p-4 text-pool shadow-[0_22px_44px_-20px] shadow-pool/50 ring-1 ring-pool/12 backdrop-blur-[6px] transition-[opacity,translate] duration-200 starting:translate-y-2 starting:opacity-0"
        >
          <p className="mb-2.5 text-[12.5px] font-bold tracking-[0.04em] uppercase opacity-60">
            Horarios de hoy
          </p>
          <ul className="flex flex-col divide-y divide-pool/12">
            {activities.map((activity) => {
              const status = getOpeningStatus(activity.schedule, hour);
              return (
                <li
                  key={activity.slug}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className="flex flex-col">
                    <b className="text-[14.5px] font-bold">{activity.name}</b>
                    <span className="text-[13px] tabular-nums opacity-72">
                      {formatSchedule(activity.schedule)}
                    </span>
                  </span>
                  <i
                    className={cn(
                      STATUS_CLASSES,
                      'text-[12.5px]',
                      status.isOpen ? 'text-open' : 'text-closed'
                    )}
                  >
                    {status.label}
                  </i>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* aria-expanded y aria-controls: avisan a los lectores de pantalla que
          el botón abre y cierra el panel "horarios-hoy". */}
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-pool px-4 py-3 text-left text-cream shadow-[0_18px_36px_-18px] shadow-pool/70 transition-colors duration-160 hover:bg-pool-hover"
        aria-expanded={isOpen}
        aria-controls="horarios-hoy"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ClockIcon className="size-[22px] flex-none opacity-85" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <i
            className={cn(
              STATUS_CLASSES,
              'text-[14.5px]',
              isComplexOpen ? 'before:bg-open-bright' : 'before:bg-closed'
            )}
          >
            {isComplexOpen ? 'Complejo abierto' : 'Complejo cerrado'}
          </i>
          <span className="text-[12.5px] tabular-nums opacity-72">
            Hoy, {formatToday(now)} · ver horarios
          </span>
        </span>
        {/* La flecha gira cuando el panel está abierto. */}
        <ChevronIcon
          className={cn(
            'size-4 flex-none transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
    </div>
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

// Apunta hacia arriba: el panel se abre en esa dirección.
function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}
