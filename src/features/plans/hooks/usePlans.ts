import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getPlans } from '@/features/plans/api/plansApi.ts';
import type { Plan } from '@/features/plans/model/plans.ts';

// QUÉ ES: hook que trae los planes de la API y avisa si está cargando o si
// falló.
// NIVEL: custom hook de la feature plans.
// DÓNDE SE USA: en PlansPageContainer.
// CÓMO FUNCIONA: guarda tres estados (planes, cargando y error). El pedido se
// hace en un useEffect, una sola vez al abrir la página. Si falla, muestra un
// aviso con SweetAlert2.

export function usePlans() {
  // Arranca vacío: los planes llegan después, cuando responde la API.
  const [plans, setPlans] = useState<Plan[]>([]);
  // Arranca en true: apenas se abre la página ya se están pidiendo.
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // [] al final: el efecto corre una sola vez, cuando se monta la página.
  useEffect(() => {
    // Para cancelar el pedido si la página se desmonta antes de la respuesta.
    const controller = new AbortController();

    async function loadPlans() {
      try {
        const data = await getPlans(controller.signal);
        setPlans(data);
      } catch (err) {
        // Pedido cancelado a propósito (la página se cerró): no es un error.
        // En desarrollo pasa siempre una vez, porque StrictMode monta, desmonta
        // y vuelve a montar; sin este chequeo el aviso saldría dos veces.
        if (axios.isCancel(err)) return;

        const message =
          'No pudimos cargar los planes. Revisá tu conexión y probá de nuevo en un rato.';
        setError(message);
        Swal.fire({
          icon: 'error',
          title: 'Algo salió mal',
          text: message,
          confirmButtonText: 'Entendido',
        });
      } finally {
        // Haya salido bien o mal, ya no está cargando (salvo que se haya
        // cancelado: en ese caso el componente ya no está en pantalla).
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadPlans();

    // Limpieza: corre cuando la página se desmonta.
    return () => controller.abort();
  }, []);

  return { plans, isLoading, error };
}
