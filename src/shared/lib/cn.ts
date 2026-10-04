import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// QUÉ ES: arma el "className" de un elemento a partir de varias partes.
// NIVEL: utilidad genérica de shared/lib (no pertenece a ninguna feature).
// CÓMO FUNCIONA:
// - clsx descarta los valores falsos, así se pueden escribir clases
//   condicionales: cn('px-4', activo && 'bg-accent').
// - twMerge resuelve choques entre utilidades de Tailwind: en
//   cn('px-4', 'px-2') gana la última ('px-2').
// CUÁNDO USARLO: solo si hay clases condicionales o que se pueden pisar
// (ej.: un "className" que llega por props). Para clases fijas alcanza con
// className="...".
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
