import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { noGlowPageSections } from '@/features/landing/model/sectionTheme.ts';
import { isInvalidCredentials } from '@/features/auth/api/authApi.ts';
import { LoginForm } from '@/features/auth/components/LoginForm.tsx';
import { useAuth } from '@/features/auth/hooks/useAuth.ts';
import {
  emptyCredentials,
  validateLogin,
  type LoginCredentials,
  type LoginErrors,
  type LoginField,
} from '@/features/auth/model/auth.ts';

// QUÉ ES: la página de ingreso de los socios (/login).
// NIVEL: container (página) — guarda lo que se escribe, valida, llama al
// backend con login() de useAuth y, si sale bien, lleva a la página que la
// persona quería ver (o a /mi-cuenta).
export function LoginPageContainer() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginCredentials>(emptyCredentials);
  const [errors, setErrors] = useState<LoginErrors>({});
  // Error que viene del backend (distinto de los errores de formato).
  const [serverError, setServerError] = useState<string | null>(null);
  // true mientras se espera la respuesta: apaga el botón para no mandar
  // el pedido dos veces.
  const [isSubmitting, setIsSubmitting] = useState(false);

  useSectionTheme(noGlowPageSections);

  // RequireAuth guarda en "state" la página que se quería abrir.
  const from = (location.state as { from?: string } | null)?.from;
  const destination = from ?? '/mi-cuenta';

  // Si ya hay sesión, no tiene sentido mostrar el formulario.
  if (user) return <Navigate to={destination} replace />;

  function handleFieldChange(field: LoginField, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateLogin(form);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(destination, { replace: true });
    } catch (err) {
      if (isInvalidCredentials(err)) {
        // 401: el backend respondió, pero los datos no coinciden.
        setServerError('Email o contraseña incorrectos.');
      } else {
        // Sin respuesta (backend caído o sin conexión): mismo aviso que en
        // los planes.
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: 'No pudimos conectarnos para ingresar. Probá de nuevo en un rato.',
          confirmButtonText: 'Entendido',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Ingresar"
        path="/login"
        description="Ingresá con tu cuenta de socio del Complejo Teniente Ledesma."
        noIndex
      />
      <main className="mx-auto max-w-page px-6.5 pt-[calc(130px+env(safe-area-inset-top,0px))] pb-[110px]">
        <section id="contenido" className="mb-10">
          <h1 className="mb-[18px] text-[length:clamp(40px,6vw,72px)]">
            Ingresar
          </h1>
          <p className="max-w-[52ch] text-[18px] opacity-80">
            Entrá con tu cuenta de socio para ver tus datos.
          </p>
        </section>
        <LoginForm
          values={form}
          errors={errors}
          serverError={serverError}
          isSubmitting={isSubmitting}
          onFieldChange={handleFieldChange}
          onSubmit={handleSubmit}
        />
        {/* Usuario de prueba hasta que exista el backend con base de datos. */}
        <p className="mt-5 text-[14px] opacity-60">
          Cuenta de prueba: socio@sigedem.com / socio1234
        </p>
      </main>
    </>
  );
}
