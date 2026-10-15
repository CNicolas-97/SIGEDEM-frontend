import { isValidEmail } from '@/shared/lib/validation.ts';

// QUÉ ES: los tipos y las reglas del login.
// NIVEL: model — datos, tipos y funciones puras; acá no hay JSX.
// DÓNDE SE USA: en authApi (forma de la respuesta), en AuthProvider (la
// sesión) y en LoginPageContainer (validar el formulario).

// Lo que escribe la persona en el formulario.
export type LoginCredentials = {
  email: string;
  password: string;
};

// Los nombres de los campos: "keyof" toma las claves del tipo de arriba.
export type LoginField = keyof LoginCredentials;

// Un mensaje de error por campo; si el campo está bien, no tiene entrada.
export type LoginErrors = Partial<Record<LoginField, string>>;

// Los datos públicos del usuario que devuelve el backend (sin contraseña).
export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

// La respuesta del backend al loguearse: el token prueba que la persona ya
// ingresó y se manda en los próximos pedidos que lo requieran.
export type AuthSession = {
  token: string;
  user: AuthUser;
};

export const emptyCredentials: LoginCredentials = { email: '', password: '' };

// Mínimo de caracteres de la contraseña (el backend puede pedir más).
const MIN_PASSWORD_LENGTH = 6;

// Revisa el formato antes de llamar al backend: si falta algo, no hace falta
// esperar la respuesta para avisarlo.
export function validateLogin(values: LoginCredentials): LoginErrors {
  const errors: LoginErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Ingresá tu email.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Revisá el email: falta la @ o el dominio.';
  }

  if (!values.password) {
    errors.password = 'Ingresá tu contraseña.';
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña tiene al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}
