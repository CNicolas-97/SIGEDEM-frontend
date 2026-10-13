import axios from 'axios';
import type { Plan } from '@/features/plans/model/plans.ts';

// QUÉ ES: el pedido de los planes a la API (json-server sirviendo db.json).
// NIVEL: api — solo habla con el servidor; no guarda estado ni muestra nada.
// DÓNDE SE USA: en el hook usePlans, dentro de un useEffect.

// La URL sale de la variable de entorno (archivo .env), nunca escrita a mano
// en el código. Vite solo expone las variables que empiezan con VITE_.
const API_URL = import.meta.env.VITE_API_URL;

// signal: permite cancelar el pedido si la página se cierra antes de que
// llegue la respuesta.
export async function getPlans(signal?: AbortSignal): Promise<Plan[]> {
  // <Plan[]>: le dice a TypeScript qué forma tienen los datos de la respuesta.
  const response = await axios.get<Plan[]>(`${API_URL}/plans`, { signal });
  // Axios ya convierte el JSON: los datos vienen en response.data.
  return response.data;
}
