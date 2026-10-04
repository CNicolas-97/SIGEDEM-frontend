// Este archivo contiene el modelo de planes: los tipos que describen los
// datos, los datos concretos y una funcion de formato. No dibuja interfaz
// porque no contiene componentes JSX.

// type crea un alias de tipo. Esta union (| significa "o") restringe type a
// uno de tres textos exactos; TypeScript avisara si se escribe otro valor.
export type PlanType = 'individual' | 'familiar' | 'actividad';

// Un objeto Plan debe tener las propiedades obligatorias de abajo y con sus
// respectivos tipos. string es texto, number es numero y string[] es una
// lista de textos. Las propiedades con ? son opcionales.
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

// Reutilizamos PlanType y le agregamos la opcion 'todos'. Esta union sirve
// para tipar el estado del filtro y las opciones que lo pueden cambiar.
export type PlanFilter = PlanType | 'todos';

// [] significa que es un array. Cada elemento debe ser un objeto con value
// (una opcion de filtro) y label (el texto visible del boton). La pagina
// recorrera el array con map() para crear los botones desde estos datos.
export const planFilters: { value: PlanFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'individual', label: 'Individual' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'actividad', label: 'Por actividad' },
];

// Esta lista es la fuente de datos de las tarjetas. Plan[] indica a TypeScript
// que cada elemento debe cumplir la forma definida por el tipo Plan.
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

// Intl.NumberFormat es una funcion incluida en JavaScript para presentar
// numeros segun una convencion regional. Se configura una vez para Argentina
// y pesos (ARS), sin decimales, y se reutiliza para todos los precios.
const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

// Recibe un numero (price: number) y devuelve texto (: string). Esta funcion
// delega el formato en priceFormatter; no modifica los datos originales.
export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}
