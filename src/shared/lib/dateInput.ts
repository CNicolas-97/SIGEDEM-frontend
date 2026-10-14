// QUÉ ES: conversiones entre Date y el texto "AAAA-MM-DD" que usa el
// <input type="date">.
// NIVEL: utilidad genérica de shared/lib — funciones puras.
// DÓNDE SE USA: en los formularios de hacerse socio y de alquilar cancha.

// "AAAA-MM-DD" → Date. Se arma con los números (y no con
// new Date("2004-03-15")) porque así el navegador la toma en hora argentina
// y no en UTC, que la correría un día.
export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Date → "AAAA-MM-DD". padStart completa con ceros: 3 → "03".
export function toDateInputValue(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
