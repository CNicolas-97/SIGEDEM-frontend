import type { FormEvent } from 'react';
import { Button } from '@/shared/ui/Button.tsx';
import { TextField } from '@/shared/ui/FormFields.tsx';
import type {
  LoginCredentials,
  LoginErrors,
  LoginField,
} from '@/features/auth/model/auth.ts';

// QUÉ ES: el formulario de ingreso: email y contraseña.
// NIVEL: componente presentacional — no guarda nada. Recibe valores, errores
// y si se está enviando; avisa con onFieldChange y onSubmit.
// DÓNDE SE USA: en LoginPageContainer.

type LoginFormProps = {
  values: LoginCredentials;
  errors: LoginErrors;
  // Error que devolvió el backend (ej.: contraseña incorrecta).
  serverError: string | null;
  isSubmitting: boolean;
  onFieldChange: (field: LoginField, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LoginForm({
  values,
  errors,
  serverError,
  isSubmitting,
  onFieldChange,
  onSubmit,
}: LoginFormProps) {
  return (
    // noValidate: los mensajes los arma validateLogin, no el navegador.
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid max-w-[460px] gap-5 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px] tablet:p-8"
    >
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
      {/* type="password": oculta lo que se escribe. */}
      <TextField
        id="password"
        label="Contraseña"
        type="password"
        value={values.password}
        onChange={(value) => onFieldChange('password', value)}
        error={errors.password}
        autoComplete="current-password"
        required
      />

      {/* role="alert": el lector de pantalla lo anuncia apenas aparece. */}
      {serverError && (
        <p role="alert" className="text-[15px] text-danger">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="justify-self-start"
      >
        {isSubmitting ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  );
}
