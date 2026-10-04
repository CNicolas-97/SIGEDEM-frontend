// QUÉ ES: los planes del abono del complejo, con sus precios.
// NIVEL: model — datos, tipos y funciones puras; sin JSX.
// DÓNDE SE USA: PlansPageContainer los filtra y los recorre con map() para
// armar una PlanCard por cada plan.

// Unión de strings: un plan solo puede ser de uno de estos tres tipos.
export type PlanType = 'individual' | 'familiar' | 'actividad';

export type Plan = {
  // Identificador único y estable: se usa como "key" al recorrer la lista.
  id: string;
  name: string;
  type: PlanType;
  // Precio por mes en pesos, como número (el formato "$ 18.000" lo arma
  // formatPrice al mostrarlo).
  monthlyPrice: number;
  description: string;
  // Qué incluye el plan: una línea por ítem.
  includes: string[];
  // Opcionales ("?"): no todos los planes los tienen.
  badge?: string;
  discountNote?: string;
};

// Filtro de la página: los tres tipos de plan, o "todos".
export type PlanFilter = PlanType | 'todos';

// Botones del filtro. También es un array de datos: la página lo recorre con
// map() en lugar de escribir cada botón a mano.
export const planFilters: { value: PlanFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'individual', label: 'Individual' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'actividad', label: 'Por actividad' },
];

export const plans: Plan[] = [
  {
    id: 'individual',
    name: 'Individual',
    type: 'individual',
    monthlyPrice: 18000,
    description: 'Acceso libre a todo el complejo para una persona.',
    includes: [
      'Natatorio en turnos de nado libre',
      'Reserva de canchas de fútbol y vóley',
      'Vestuarios y duchas',
    ],
  },
  {
    id: 'individual-jubilado',
    name: 'Jubilado o pensionado',
    type: 'individual',
    monthlyPrice: 9000,
    description: 'El plan individual completo, a mitad de precio.',
    includes: [
      'Natatorio en turnos de nado libre',
      'Gimnasia acuática por la mañana',
      'Vestuarios y duchas',
    ],
    discountNote: '50 % de descuento presentando el carnet de jubilado.',
  },
  {
    id: 'familiar',
    name: 'Familiar',
    type: 'familiar',
    monthlyPrice: 42000,
    description: 'Hasta cuatro integrantes del mismo grupo familiar.',
    includes: [
      'Todo lo del plan individual para cada integrante',
      'Escuela de natación para los menores',
      'Un carnet con QR por persona',
    ],
    badge: 'Más elegido',
  },
  {
    id: 'familia-numerosa',
    name: 'Familia numerosa',
    type: 'familiar',
    monthlyPrice: 50000,
    description: 'Para grupos familiares de cinco integrantes o más.',
    includes: [
      'Todo lo del plan familiar',
      'Sin costo extra desde el quinto integrante',
      'Prioridad en la inscripción a las escuelas',
    ],
    discountNote: 'Se acredita con la libreta o las partidas de nacimiento.',
  },
  {
    id: 'solo-natatorio',
    name: 'Solo natatorio',
    type: 'actividad',
    monthlyPrice: 14000,
    description: 'Para quien viene únicamente a nadar.',
    includes: [
      'Turnos de nado libre de 45 minutos',
      'Reserva desde la app',
      'Requiere apto médico',
    ],
  },
  {
    id: 'escuela-deportiva',
    name: 'Escuela deportiva',
    type: 'actividad',
    monthlyPrice: 11000,
    description: 'Una comisión de fútbol o vóley, dos veces por semana.',
    includes: [
      'Entrenadores del complejo',
      'Categorías desde los 6 años',
      'Torneos durante la temporada',
    ],
  },
];

// Intl.NumberFormat es la herramienta del navegador para formatear números
// según el país: 18000 → "$ 18.000". Se crea una sola vez y se reutiliza.
const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}
