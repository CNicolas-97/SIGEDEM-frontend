// QUÉ ES: revisiones de formato que comparten los formularios (hacerse socio
// y alquilar una cancha).
// NIVEL: utilidad genérica de shared/lib — funciones puras, sin JSX.
// CÓMO FUNCIONA: cada función recibe el texto tal como lo escribió la
// persona y devuelve true si el formato es válido.

// Expresiones regulares: patrones para revisar el formato de un texto.
// DNI: 7 u 8 números.
const DNI_PATTERN = /^\d{7,8}$/;
// Email: algo@algo.algo, sin espacios.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Teléfono: solo números, espacios, guiones, paréntesis y "+".
const PHONE_PATTERN = /^[\d\s()+-]+$/;

// Los puntos y espacios se sacan antes de revisar: "40.123.456" vale.
export function isValidDni(value: string): boolean {
  return DNI_PATTERN.test(value.replace(/[.\s]/g, ''));
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

// Además del formato, pide al menos 8 números (característica + número).
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return PHONE_PATTERN.test(value) && digits.length >= 8;
}
