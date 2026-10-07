import { formatPrice } from '@/features/plans/model/plans.ts';
import type { CourtRate } from '@/features/landing/model/courts.ts';

// QUÉ ES: el resumen de la reserva, al costado del formulario: cancha, día,
// horario y precio.
// NIVEL: componente presentacional — recibe todo armado por props. Se
// actualiza solo mientras se completa el formulario, porque los datos
// llegan desde el estado del container.
// DÓNDE SE USA: en BookingPageContainer.

type BookingSummaryProps = {
  // undefined = todavía no eligió cancha.
  court?: CourtRate;
  // Ej.: "sábado 11 de octubre", o '' si falta el día.
  dateLabel: string;
  // Ej.: "18:00 a 19:00", o '' si falta el horario.
  slotLabel: string;
  isMember: boolean;
};

export function BookingSummary({
  court,
  dateLabel,
  slotLabel,
  isMember,
}: BookingSummaryProps) {
  // Una fila por dato. Lo que todavía no se eligió se muestra con un guion.
  const rows = [
    { label: 'Cancha', value: court?.name },
    { label: 'Día', value: dateLabel },
    { label: 'Horario', value: slotLabel },
  ];
  const price = court && (isMember ? court.memberPrice : court.publicPrice);

  return (
    // En pantallas anchas queda fijo mientras se baja por el formulario.
    <aside className="grid gap-4 laptop:sticky laptop:top-[110px]">
      <h2 className="font-body text-[15px] font-semibold tracking-normal opacity-70">
        Tu reserva
      </h2>
      <div className="grid gap-4 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px]">
        {/* <dl>: lista de "dato: valor", lo correcto para un resumen así. */}
        <dl className="grid gap-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between gap-4 border-b border-white/14 pb-3 text-[16px]"
            >
              <dt className="opacity-70">{row.label}</dt>
              <dd className="text-right font-semibold">{row.value || '—'}</dd>
            </div>
          ))}
        </dl>
        {price !== undefined ? (
          <p className="font-display text-[34px] leading-none text-accent tabular-nums">
            {formatPrice(price)}{' '}
            <small className="font-body text-[14px] text-white opacity-70">
              {isMember ? 'precio de socio' : 'precio de no socio'}
            </small>
          </p>
        ) : (
          <p className="text-[15px] opacity-70">
            Elegí una cancha para ver el precio.
          </p>
        )}
        <p className="text-[14px] opacity-70">
          Pagás en la ventanilla al llegar. Si sos socio, mostrá el carnet.
        </p>
      </div>
    </aside>
  );
}
