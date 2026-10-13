import axios from 'axios';
import { env } from '@/shared/lib/env.ts';
import type { Plan } from '@/features/plans/model/plans.ts';

// QUÉ ES: el pedido de los planes a la API (json-server sirviendo db.json).
// NIVEL: api — solo habla con el servidor; no guarda estado ni muestra nada.
// DÓNDE SE USA: en el hook usePlans, dentro de un useEffect.

// La URL sale de la variable de entorno VITE_API_URL (archivo .env), nunca
// escrita a mano en el código. Se lee en un solo lugar: shared/lib/env.ts.
const API_URL = env.apiUrl;

// signal: permite cancelar el pedido si la página se cierra antes de que
// llegue la respuesta.
export async function getPlans(signal?: AbortSignal): Promise<Plan[]> {
  // <Plan[]>: le dice a TypeScript qué forma tienen los datos de la respuesta.
  const response = await axios.get<Plan[]>(`${API_URL}/plans`, { signal });
  // Axios ya convierte el JSON: los datos vienen en response.data.
  return response.data;
}
