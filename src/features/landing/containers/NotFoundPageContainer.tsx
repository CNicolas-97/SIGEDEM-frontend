import { Link } from 'react-router';
import { Seo } from '@/shared/ui/Seo.tsx';
import '@/features/landing/landing.css';

// QUÉ ES: la página que se muestra cuando la dirección no existe (error 404).
// NIVEL: container (página). React Router la muestra con la ruta "*", que
// atrapa cualquier dirección que no coincida con las anteriores.
export function NotFoundPageContainer() {
  return (
    <main className="not-found">
      <Seo
        title="Página no encontrada"
        description="La página que buscás no existe."
      />
      <h1>No encontramos esta página</h1>
      {/* <Link> cambia de ruta sin recargar el sitio (a diferencia de <a>). */}
      <Link className="btn" to="/">
        Volver al inicio
      </Link>
    </main>
  );
}
