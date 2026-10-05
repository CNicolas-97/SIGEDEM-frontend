import { Button } from '@/shared/ui/Button.tsx';

// QUÉ ES: el mensaje que reemplaza al formulario cuando se envía bien.
// NIVEL: componente presentacional — recibe todo armado por props.
// DÓNDE SE USA: en EnrollmentPageContainer, cuando isSent es true.

type EnrollmentSuccessProps = {
  firstName: string;
  planName: string;
  // Ej.: "Lunes a sábado, de 8:00 a 20:00".
  windowHours: string;
  // Qué llevar a la ventanilla (ver getWindowChecklist).
  checklist: string[];
  // Vuelve a mostrar el formulario vacío.
  onReset: () => void;
};

export function EnrollmentSuccess({
  firstName,
  planName,
  windowHours,
  checklist,
  onReset,
}: EnrollmentSuccessProps) {
  return (
    // role="status": el lector de pantalla anuncia el mensaje al aparecer.
    <section
      role="status"
      className="grid max-w-[640px] gap-5 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px] tablet:p-8"
    >
      <span className="self-start justify-self-start rounded-full bg-accent px-[11px] py-[3px] text-[12.5px] font-bold text-btn-fg">
        Preinscripción lista
      </span>
      <h2 className="text-[length:clamp(28px,4vw,40px)]">
        ¡Gracias, {firstName}!
      </h2>
      <p className="text-[17px] opacity-85">
        Preinscripción realizada del plan <strong>{planName}</strong>. Para
        terminar, acercate a la ventanilla del complejo ({windowHours}) con:
      </p>
      <ul className="grid gap-2 text-[16px]">
        {/* Cada texto es distinto, así que el propio texto sirve de key. */}
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
          Cargar otra inscripción
        </Button>
      </div>
    </section>
  );
}
