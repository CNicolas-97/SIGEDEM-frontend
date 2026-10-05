import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn.ts';
import type { SelectOption } from '@/features/enrollment/model/enrollment.ts';

// QUÉ ES: los campos del formulario (texto y desplegable) con su etiqueta y
// su mensaje de error.
// NIVEL: componentes presentacionales. No guardan el valor: lo reciben por
// props ("value") y avisan cada cambio con "onChange". Esto se llama
// "input controlado": el estado vive en el container.
// DÓNDE SE USA: en EnrollmentForm.

// Estilo común de <input> y <select>. Con error, el borde se pone rojo.
const CONTROL_CLASSES =
  'w-full rounded-[12px] border border-white/18 bg-white/6 px-4 py-3 text-[16px] text-white transition-[border-color] duration-180 ease-[ease] placeholder:text-white/40 hover:border-white/35';

// Opciones de la lista desplegable: fondo oscuro del sitio y texto blanco.
const OPTION_CLASSES = 'bg-ink text-white';

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

// Etiqueta arriba, el control en el medio y el error (o una ayuda) abajo.
// No se exporta: solo la usan TextField y SelectField.
function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className="grid content-start gap-1.5">
      {/* htmlFor une la etiqueta con el input: al tocar el texto, se
          enfoca el campo. */}
      <label htmlFor={id} className="text-[15px] font-semibold">
        {label}
      </label>
      {children}
      {/* El id del mensaje lo lee el lector de pantalla gracias a
          aria-describedby (ver los controles de abajo). */}
      {error ? (
        <p id={`${id}-message`} className="text-[14px] text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-message`} className="text-[14px] opacity-60">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  // Tipo del <input>: cambia el teclado en el celular y el control (fecha).
  type?: 'text' | 'email' | 'tel' | 'date';
  // Le dice al navegador qué dato es, para que lo autocomplete.
  autoComplete?: string;
  // Teclado numérico en el celular (para el DNI).
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  placeholder?: string;
  // Fecha máxima permitida (solo para type="date").
  max?: string;
  required?: boolean;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  type = 'text',
  autoComplete,
  inputMode,
  placeholder,
  max,
  required = false,
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        // event.target.value es el texto nuevo; se lo pasamos al container.
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        max={max}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-message` : undefined}
        className={cn(CONTROL_CLASSES, error && 'border-danger')}
      />
    </FieldShell>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  // Texto de la opción vacía, la que se ve antes de elegir.
  placeholder: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  hint,
  required = false,
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? `${id}-message` : undefined}
        className={cn(
          CONTROL_CLASSES,
          'cursor-pointer',
          error && 'border-danger'
        )}
      >
        {/* La lista que se abre la dibuja el navegador: en Chrome y Edge toma
            el fondo semitransparente del <select> y queda blanca, con el
            texto blanco encima. Por eso cada opción lleva su fondo oscuro. */}
        <option value="" className={OPTION_CLASSES}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className={OPTION_CLASSES}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
