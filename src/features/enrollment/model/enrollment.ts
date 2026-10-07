import type { SelectOption } from '@/shared/ui/FormFields.tsx';
import { parseDateInput } from '@/shared/lib/dateInput.ts';
import {
  isValidDni,
  isValidEmail,
  isValidPhone,
} from '@/shared/lib/validation.ts';
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

// Edad en años cumplidos a la fecha "today".
export function getAge(birthDate: string, today: Date): number {
  const birth = parseDateInput(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  if (!hasHadBirthday) age -= 1;
  return age;
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
  if (!form.firstName.trim()) errors.firstName = 'Escribí tu nombre.';
  if (!form.lastName.trim()) errors.lastName = 'Escribí tu apellido.';

  if (!form.dni.trim()) errors.dni = 'Escribí tu DNI.';
  else if (!isValidDni(form.dni))
    errors.dni = 'El DNI tiene 7 u 8 números, sin letras.';

  if (!form.birthDate) {
    errors.birthDate = 'Elegí tu fecha de nacimiento.';
  } else {
    const age = getAge(form.birthDate, today);
    if (age < 0) errors.birthDate = 'La fecha no puede ser futura.';
    else if (age > 110) errors.birthDate = 'Revisá el año de nacimiento.';
  }

  if (!form.email.trim()) errors.email = 'Escribí tu email.';
  else if (!isValidEmail(form.email))
    errors.email = 'Revisá el email: falta la @ o el dominio.';

  if (!form.phone.trim()) errors.phone = 'Escribí un teléfono de contacto.';
  else if (!isValidPhone(form.phone))
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
