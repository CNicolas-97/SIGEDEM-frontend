import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import {
  SelectField,
  TextField,
} from '@/features/enrollment/components/FormFields.tsx';
import type {
  EnrollmentErrors,
  EnrollmentField,
  EnrollmentForm as EnrollmentFormValues,
  SelectOption,
} from '@/features/enrollment/model/enrollment.ts';

// QUÉ ES: el formulario de inscripción: datos personales, contacto y plan.
// NIVEL: componente presentacional — no guarda nada. Recibe los valores y
// los errores por props, y avisa con onFieldChange y onSubmit. El container
// decide qué hacer (validar, y más adelante mandarlo a la base de datos).
// DÓNDE SE USA: en EnrollmentPageContainer.

type EnrollmentFormProps = {
  values: EnrollmentFormValues;
  errors: EnrollmentErrors;
  planOptions: SelectOption[];
  activityOptions: SelectOption[];
  // Fecha de hoy en "AAAA-MM-DD": tope del campo de nacimiento.
  maxBirthDate: string;
  onFieldChange: (field: EnrollmentField, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

// Un grupo de campos con su título. <fieldset> + <legend> le dicen al lector
// de pantalla que esos campos van juntos.
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
      {/* Dos columnas desde 768px; en celular, una debajo de la otra. */}
      <div className="grid gap-5 min-[768px]:grid-cols-[repeat(2,1fr)]">
        {children}
      </div>
    </fieldset>
  );
}

export function EnrollmentForm({
  values,
  errors,
  planOptions,
  activityOptions,
  maxBirthDate,
  onFieldChange,
  onSubmit,
}: EnrollmentFormProps) {
  return (
    // noValidate: apaga los globos de error del navegador; los mensajes los
    // arma validateEnrollment, con el mismo estilo en todos los navegadores.
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid gap-9 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px] tablet:p-8"
    >
      <FieldGroup title="Tus datos">
        <TextField
          id="firstName"
          label="Nombre"
          value={values.firstName}
          onChange={(value) => onFieldChange('firstName', value)}
          error={errors.firstName}
          autoComplete="given-name"
          required
        />
        <TextField
          id="lastName"
          label="Apellido"
          value={values.lastName}
          onChange={(value) => onFieldChange('lastName', value)}
          error={errors.lastName}
          autoComplete="family-name"
          required
        />
        <TextField
          id="dni"
          label="DNI"
          value={values.dni}
          onChange={(value) => onFieldChange('dni', value)}
          error={errors.dni}
          hint="Sin puntos ni espacios."
          inputMode="numeric"
          placeholder="40123456"
          required
        />
        <TextField
          id="birthDate"
          label="Fecha de nacimiento"
          type="date"
          value={values.birthDate}
          onChange={(value) => onFieldChange('birthDate', value)}
          error={errors.birthDate}
          autoComplete="bday"
          max={maxBirthDate}
          required
        />
      </FieldGroup>

      <FieldGroup title="Contacto">
        <TextField
          id="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => onFieldChange('email', value)}
          error={errors.email}
          autoComplete="email"
          inputMode="email"
          placeholder="nombre@correo.com"
          required
        />
        <TextField
          id="phone"
          label="Teléfono"
          type="tel"
          value={values.phone}
          onChange={(value) => onFieldChange('phone', value)}
          error={errors.phone}
          autoComplete="tel"
          inputMode="tel"
          placeholder="381 555-1234"
          required
        />
      </FieldGroup>

      <FieldGroup title="Plan">
        <SelectField
          id="planId"
          label="Plan del abono"
          value={values.planId}
          onChange={(value) => onFieldChange('planId', value)}
          options={planOptions}
          placeholder="Elegí un plan"
          error={errors.planId}
          required
        />
        <SelectField
          id="activity"
          label="Actividad que más vas a usar"
          value={values.activity}
          onChange={(value) => onFieldChange('activity', value)}
          options={activityOptions}
          placeholder="Todavía no sé"
          hint="Opcional."
        />
      </FieldGroup>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {/* type="submit": al tocarlo, el <form> dispara onSubmit. */}
        <Button type="submit">Enviar inscripción</Button>
        <p className="text-[14px] opacity-60">
          Después terminás el trámite en la ventanilla.
        </p>
      </div>
    </form>
  );
}
