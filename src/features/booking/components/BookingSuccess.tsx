import { Button } from '@/shared/ui/Button.tsx';

// QUÉ ES: el mensaje que reemplaza al formulario cuando la reserva sale bien.
// NIVEL: componente presentacional — recibe todo armado por props.
// DÓNDE SE USA: en BookingPageContainer, cuando isSent es true.

type BookingSuccessProps = {
  firstName: string;
  courtName: string;
  // Ej.: "sábado 11 de octubre".
  dateLabel: string;
  // Ej.: "18:00 a 19:00".
  slotLabel: string;
  // Ya con formato: "$ 15.000".
  priceLabel: string;
  isMember: boolean;
  // Vuelve a mostrar el formulario vacío.
  onReset: () => void;
};

export function BookingSuccess({
  firstName,
  courtName,
  dateLabel,
  slotLabel,
  priceLabel,
  isMember,
  onReset,
}: BookingSuccessProps) {
  // Qué llevar: el carnet solo si reservó como socio.
  const checklist = ['Tu DNI'];
  if (isMember) checklist.push('El carnet de socio, para el precio de socio');

  return (
    // role="status": el lector de pantalla anuncia el mensaje al aparecer.
    <section
      role="status"
      className="grid max-w-[640px] gap-5 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px] tablet:p-8"
    >
      <span className="self-start justify-self-start rounded-full bg-accent px-[11px] py-[3px] text-[12.5px] font-bold text-btn-fg">
        Reserva lista
      </span>
      <h2 className="text-[length:clamp(28px,4vw,40px)]">
        ¡Listo, {firstName}!
      </h2>
      <p className="text-[17px] opacity-85">
        Reserva realizada: <strong>{courtName}</strong>, {dateLabel}, de{' '}
        {slotLabel}. Pagás <strong>{priceLabel}</strong> en la ventanilla al
        llegar. Traé:
      </p>
      <ul className="grid gap-2 text-[16px]">
        {checklist.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 before:mt-[0.8em] before:h-0.5 before:w-3 before:flex-none before:bg-accent"
          >
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap gap-3">
        <Button to="/">Volver al inicio</Button>
        <Button variant="secondary" onClick={onReset}>
          Hacer otra reserva
        </Button>
      </div>
    </section>
  );
}
