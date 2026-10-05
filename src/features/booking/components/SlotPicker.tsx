import { cn } from '@/shared/lib/cn.ts';
import type { Slot } from '@/features/booking/model/booking.ts';

// QUÉ ES: la grilla de turnos de un día, un botón por hora.
// NIVEL: componente presentacional — recibe los turnos y el elegido por
// props, y avisa con onSelect. No sabe qué turnos están ocupados: eso lo
// calcula getSlots en model/.
// DÓNDE SE USA: en BookingForm.

type SlotPickerProps = {
  slots: Slot[];
  // La hora elegida ("18"), o '' si todavía no eligió.
  selectedHour: string;
  onSelect: (hour: string) => void;
  error?: string;
  // false = todavía falta elegir la cancha o el día.
  isReady: boolean;
};

export function SlotPicker({
  slots,
  selectedHour,
  onSelect,
  error,
  isReady,
}: SlotPickerProps) {
  const hasFreeSlots = slots.some((slot) => slot.isAvailable);

  return (
    // id="hour" y tabIndex={-1}: el container puede enfocar este bloque si
    // falta elegir el horario, igual que hace con los campos de texto.
    <div
      id="hour"
      tabIndex={-1}
      className="grid gap-2.5"
      role="group"
      aria-labelledby="hour-label"
      aria-describedby={error ? 'hour-message' : undefined}
    >
      <span id="hour-label" className="text-[15px] font-semibold">
        Horario
      </span>

      {/* Renderizado condicional: tres casos según lo que haya elegido. */}
      {!isReady ? (
        <p className="text-[15px] opacity-60">
          Elegí la cancha y el día para ver los horarios.
        </p>
      ) : !hasFreeSlots ? (
        <p className="text-[15px] opacity-80">
          No quedan turnos libres ese día. Probá con otro.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
          {slots.map((slot) => {
            const isSelected = selectedHour === String(slot.hour);
            return (
              <button
                key={slot.hour}
                type="button"
                // disabled: el navegador no deja tocar los turnos ocupados.
                disabled={!slot.isAvailable}
                aria-pressed={isSelected}
                onClick={() => onSelect(String(slot.hour))}
                className={cn(
                  'cursor-pointer rounded-[12px] px-3 py-2.5 text-[15px] font-semibold tabular-nums transition-[background-color,color] duration-180 ease-[ease]',
                  isSelected
                    ? 'bg-accent text-btn-fg'
                    : 'inset-ring-[1.5px] inset-ring-white/30 hover:bg-white/8',
                  // Ocupado: tachado y apagado.
                  !slot.isAvailable &&
                    'cursor-not-allowed line-through opacity-35 hover:bg-transparent'
                )}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      )}

      {isReady && hasFreeSlots && (
        <p className="text-[14px] opacity-60">
          Turnos de una hora. Los tachados ya están ocupados.
        </p>
      )}
      {error && (
        <p id="hour-message" className="text-[14px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
