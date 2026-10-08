import { formatPrice, plans } from '@/features/plans/model/plans.ts';

// QUÉ ES: los datos del formulario de inscripción, sus opciones y la
// validación.
// NIVEL: model — tipos y funciones puras, sin JSX. Por eso la validación se
// puede probar sin abrir la página.
// DÓNDE SE USA: EnrollmentPageContainer guarda un EnrollmentForm en el estado
// y lo valida con validateEnrollment al enviar.
// A FUTURO: cuando esté la base de datos, este mismo tipo es lo que se le
// manda a la API.

export type EnrollmentForm = {
  firstName: string;
  lastName: string;
  dni: string;
  // Formato del <input type="date">: "AAAA-MM-DD" (ej.: "2004-03-15").
  birthDate: string;
  email: string;
  phone: string;
  // El id de un plan de plans.ts, o '' si todavía no eligió.
  planId: string;
};

// keyof: la unión de los nombres de los campos ('firstName' | 'lastName' | ...).
export type EnrollmentField = keyof EnrollmentForm;

// Un mensaje de error por campo. Partial = cada campo es opcional: solo
// aparecen los que tienen error.
export type EnrollmentErrors = Partial<Record<EnrollmentField, string>>;

// Una opción de un <select>: lo que se guarda (value) y lo que se ve (label).
export type SelectOption = {
  value: string;
  label: string;
};

// Formulario vacío. Recibe el plan por si se llega desde "Quiero este plan".
export function createEmptyEnrollment(planId = ''): EnrollmentForm {
  return {
    firstName: '',
    lastName: '',
    dni: '',
    birthDate: '',
    email: '',
    phone: '',
    planId,
  };
}

// Devuelve el id solo si es un plan que existe; si no, ''. Así una URL
// escrita a mano (?plan=cualquiera) no deja el formulario en un plan falso.
export function findPlanId(value: string | null): string {
  return plans.some((plan) => plan.id === value) ? (value ?? '') : '';
}

// Las opciones del desplegable se arman con map() a partir de los planes: si
// se agrega un plan, aparece solo en el formulario.
export const planOptions: SelectOption[] = plans.map((plan) => ({
  value: plan.id,
  label: `${plan.name} · ${formatPrice(plan.monthlyPrice)} por mes`,
}));

// Convierte "AAAA-MM-DD" en una fecha. Se arma con los números (y no con
// new Date("2004-03-15")) porque así el navegador la toma en hora argentina
// y no en UTC, que la correría un día.
function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Lo contrario: una fecha en el formato "AAAA-MM-DD" del <input type="date">.
// padStart completa con ceros: 3 → "03".
export function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Edad en años cumplidos a la fecha "today".
export function getAge(birthDate: string, today: Date): number {
  const birth = parseDate(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!hasHadBirthday) age -= 1;
  return age;
}

// Expresiones regulares: patrones para revisar el formato de un texto.
// Nombre y apellido: solo letras (con tildes, ñ y ü), y pueden llevar un
// espacio, un guion o un apóstrofo entre palabras: "María José",
// "Pérez-Gil", "D'Angelo". \p{L} es "cualquier letra" (necesita la "u").
const NAME_PATTERN = /^\p{L}+(?:[\s'’-]\p{L}+)*$/u;
// DNI: 7 u 8 números (los puntos y espacios se sacan antes de revisar).
const DNI_PATTERN = /^\d{7,8}$/;
// Email: algo@algo.algo, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Teléfono: solo números, espacios, guiones, paréntesis y "+".
const PHONE_PATTERN = /^[\d\s()+-]+$/;

// Revisa un nombre o un apellido. Devuelve el mensaje de error, o undefined
// si está bien. "what" es "nombre" o "apellido", para armar el mensaje.
function validateName(value: string, what: string): string | undefined {
  // Varios espacios seguidos cuentan como uno: "Juan  Pablo" = "Juan Pablo".
  const name = value.trim().replace(/\s+/g, ' ');
  if (!name) return `Escribí tu ${what}.`;
  if (!NAME_PATTERN.test(name))
    return `El ${what} solo puede tener letras, sin números ni símbolos.`;
  if (name.length < 2) return `El ${what} tiene que tener al menos 2 letras.`;
  if (name.length > 40) return `El ${what} puede tener hasta 40 letras.`;
  return undefined;
}

// Revisa el formulario y devuelve los errores encontrados. Si devuelve un
// objeto vacío, está todo bien. Los errores se agregan en el mismo orden que
// los campos en pantalla: el container enfoca el primero.
// "today" llega por parámetro (como en schedule.ts) para que la función sea
// pura: con la misma entrada, siempre la misma salida.
export function validateEnrollment(
  form: EnrollmentForm,
  today: Date
): EnrollmentErrors {
  const errors: EnrollmentErrors = {};

  // trim() saca los espacios de las puntas: "  " no cuenta como nombre.
  const firstNameError = validateName(form.firstName, 'nombre');
  if (firstNameError) errors.firstName = firstNameError;
  const lastNameError = validateName(form.lastName, 'apellido');
  if (lastNameError) errors.lastName = lastNameError;

  const dni = form.dni.replace(/[.\s]/g, '');
  if (!dni) errors.dni = 'Escribí tu DNI.';
  else if (!DNI_PATTERN.test(dni))
    errors.dni = 'El DNI tiene 7 u 8 números, sin letras.';

  if (!form.birthDate) {
    errors.birthDate = 'Elegí tu fecha de nacimiento.';
  } else {
    const age = getAge(form.birthDate, today);
    if (age < 0) errors.birthDate = 'La fecha no puede ser futura.';
    else if (age > 110) errors.birthDate = 'Revisá el año de nacimiento.';
  }

  if (!form.email.trim()) errors.email = 'Escribí tu email.';
  else if (!EMAIL_PATTERN.test(form.email.trim()))
    errors.email = 'Revisá el email: falta la @ o el dominio.';

  const phoneDigits = form.phone.replace(/\D/g, '');
  if (!form.phone.trim()) errors.phone = 'Escribí un teléfono de contacto.';
  else if (!PHONE_PATTERN.test(form.phone) || phoneDigits.length < 8)
    errors.phone =
      'Escribí el teléfono con la característica (ej.: 381 555-1234).';

  if (!form.planId) errors.planId = 'Elegí un plan.';

  return errors;
}

// Lo que tiene que llevar a la ventanilla para terminar el trámite. Depende
// de la edad, así que se calcula a partir del formulario.
export function getWindowChecklist(
  form: EnrollmentForm,
  today: Date
): string[] {
  const checklist = ['Tu DNI'];
  if (form.birthDate && getAge(form.birthDate, today) < 18) {
    checklist.push(
      'Un adulto responsable, con la libreta o la partida de nacimiento'
    );
  }
  // Todos los planes incluyen el natatorio, así que el apto médico va siempre.
  checklist.push('El apto médico, si vas a usar el natatorio');
  return checklist;
}
