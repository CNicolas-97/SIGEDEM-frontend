import { Link } from 'react-router';
import { Seo } from '@/shared/ui/Seo.tsx';
import { useSectionTheme } from '@/features/landing/hooks/useSectionTheme.ts';
import { defaultPageSections } from '@/features/landing/model/sectionTheme.ts';

// QUÉ ES: la página que se muestra cuando la dirección no existe (error 404).
// NIVEL: container (página). React Router la muestra con la ruta "*", que
// atrapa cualquier dirección que no coincida con las anteriores. También la
// usa el detalle de actividad cuando el slug no existe.
export function NotFoundPageContainer() {
  useSectionTheme(defaultPageSections);

  return (
    // id="contenido": el bloque que toma los colores (ver defaultPageSections).
    <main className="not-found" id="contenido">
      <Seo
        title="Página no encontrada"
        description="La página que buscás no existe."
        noIndex
      />
      <h1>No encontramos esta página</h1>
      {/* <Link> cambia de ruta sin recargar el sitio (a diferencia de <a>). */}
      <Link className="btn" to="/">
        Volver al inicio
      </Link>
    </main>
  );
}
