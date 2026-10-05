import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import {
  SelectField,
  TextField,
  type SelectOption,
} from '@/shared/ui/FormFields.tsx';
import { SlotPicker } from '@/features/booking/components/SlotPicker.tsx';
import type {
  BookingErrors,
  BookingForm as BookingFormValues,
  BookingTextField,
  Slot,
} from '@/features/booking/model/booking.ts';

// QUÉ ES: el formulario para alquilar una cancha: cancha, día, horario y
// datos de quien reserva.
// NIVEL: componente presentacional — no guarda nada. Recibe los valores, los
// errores y los turnos por props, y avisa los cambios con funciones.
// DÓNDE SE USA: en BookingPageContainer.

type BookingFormProps = {
  values: BookingFormValues;
  errors: BookingErrors;
  courtOptions: SelectOption[];
  slots: Slot[];
  // Primer y último día que se pueden elegir ("AAAA-MM-DD").
  minDate: string;
  maxDate: string;
  // Una función por tipo de dato: los campos de texto mandan un string y la
  // casilla de socio, true o false.
  onTextChange: (field: BookingTextField, value: string) => void;
  onMemberChange: (isMember: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

// Un grupo de campos con su título (<fieldset> + <legend>).
function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="grid gap-5">
      <legend className="mb-4 font-display text-[20px] leading-none">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

export function BookingForm({
  values,
  errors,
  courtOptions,
  slots,
  minDate,
  maxDate,
  onTextChange,
  onMemberChange,
  onSubmit,
}: BookingFormProps) {
  return (
    // noValidate: los mensajes de error los arma validateBooking.
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid gap-9 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px] tablet:p-8"
    >
      <FieldGroup title="Cancha y horario">
        <div className="grid gap-5 min-[768px]:grid-cols-[repeat(2,1fr)]">
          <SelectField
            id="courtId"
            label="Cancha"
            value={values.courtId}
            onChange={(value) => onTextChange('courtId', value)}
            options={courtOptions}
            placeholder="Elegí una cancha"
            error={errors.courtId}
            required
          />
          <TextField
            id="date"
            label="Día"
            type="date"
            value={values.date}
            onChange={(value) => onTextChange('date', value)}
            error={errors.date}
            min={minDate}
            max={maxDate}
            hint="Hasta dos semanas adelante."
            required
          />
        </div>
        <SlotPicker
          slots={slots}
          selectedHour={values.hour}
          onSelect={(hour) => onTextChange('hour', hour)}
          error={errors.hour}
          isReady={Boolean(values.courtId && values.date)}
        />
      </FieldGroup>

      <FieldGroup title="Tus datos">
        <div className="grid gap-5 min-[768px]:grid-cols-[repeat(2,1fr)]">
          <TextField
            id="fullName"
            label="Nombre y apellido"
            value={values.fullName}
            onChange={(value) => onTextChange('fullName', value)}
            error={errors.fullName}
            autoComplete="name"
            required
          />
          <TextField
            id="dni"
            label="DNI"
            value={values.dni}
            onChange={(value) => onTextChange('dni', value)}
            error={errors.dni}
            hint="Sin puntos ni espacios."
            inputMode="numeric"
            placeholder="40123456"
            required
          />
          <TextField
            id="phone"
            label="Teléfono"
            type="tel"
            value={values.phone}
            onChange={(value) => onTextChange('phone', value)}
            error={errors.phone}
            autoComplete="tel"
            inputMode="tel"
            placeholder="381 555-1234"
            required
          />
        </div>
        {/* Casilla: checked (no value) y event.target.checked (true/false). */}
        <label className="flex cursor-pointer items-center gap-3 text-[16px]">
          <input
            type="checkbox"
            checked={values.isMember}
            onChange={(event) => onMemberChange(event.target.checked)}
            className="size-5 cursor-pointer accent-accent"
          />
          Soy socio del complejo (pago el precio de socio)
        </label>
      </FieldGroup>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button type="submit">Reservar cancha</Button>
        <p className="text-[14px] opacity-60">
          Pagás en la ventanilla al llegar.
        </p>
      </div>
    </form>
  );
}
