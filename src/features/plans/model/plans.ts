// QUÉ ES: los planes del abono del complejo, con sus precios.
// NIVEL: model — datos, tipos y funciones puras; sin JSX.
// DÓNDE SE USA: PlansPageContainer los filtra y los recorre con map() para
// armar una PlanCard por cada plan.

// Unión de strings: un plan solo puede ser de uno de estos dos tipos.
export type PlanType = 'individual' | 'familiar';

export type Plan = {
  // Identificador único y estable: se usa como "key" al recorrer la lista.
  id: string;
  name: string;
  type: PlanType;
  // Cuántas personas cubre (ej.: "Hasta 4 personas"). Es lo único que
  // cambia entre los planes, junto con el precio.
  people: string;
  // Precio por mes en pesos, como número (el formato "$ 18.000" lo arma
  // formatPrice al mostrarlo).
  monthlyPrice: number;
  description: string;
  // Opcionales ("?"): no todos los planes los tienen.
  badge?: string;
  discountNote?: string;
};

// Lo que incluye el abono. Es igual para todos los planes, así que se
// escribe una sola vez: cada PlanCard recorre esta misma lista con map().
export const planBenefits: string[] = [
  'Natatorio en turnos de nado libre',
  'Canchas de fútbol y vóley a precio de socio',
  'Escuelas de natación, fútbol y vóley',
  'Vestuarios y duchas',
  'Un carnet con QR por persona',
];

// Filtro de la página: los dos tipos de plan, o "todos".
export type PlanFilter = PlanType | 'todos';

// Botones del filtro. También es un array de datos: la página lo recorre con
// map() en lugar de escribir cada botón a mano.
export const planFilters: { value: PlanFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'individual', label: 'Individual' },
  { value: 'familiar', label: 'Familiar' },
];

export const plans: Plan[] = [
  {
    id: 'individual',
    name: 'Individual',
    type: 'individual',
    people: '1 persona',
    monthlyPrice: 18000,
    description: 'Acceso completo al complejo para una persona.',
    discountNote:
      'Jubilados y pensionados: 50 % de descuento presentando el carnet.',
  },
  {
    id: 'familiar',
    name: 'Familiar',
    type: 'familiar',
    people: 'Hasta 4 personas',
    monthlyPrice: 42000,
    description: 'Para el grupo familiar que vive en la misma casa.',
    badge: 'Más elegido',
  },
  {
    id: 'familia-numerosa',
    name: 'Familia numerosa',
    type: 'familiar',
    people: '5 personas o más',
    monthlyPrice: 50000,
    description: 'Sin costo extra desde el quinto integrante.',
    discountNote: 'Se acredita con la libreta o las partidas de nacimiento.',
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
