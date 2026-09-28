import { Seo } from '@/shared/ui/Seo.tsx';
import { SiteFooter } from '@/features/landing/components/SiteFooter.tsx';
import { SiteHeader } from '@/features/landing/components/SiteHeader.tsx';
import { navLinks } from '@/features/landing/model/navigation.ts';

// QUÉ ES: la página de inicio del sitio público. Esqueleto.
// NIVEL: container — obtiene los datos (de model/, y más adelante de la API)
// y se los pasa por props a los componentes presentacionales.
// Equivale a una "página" (page): React Router va a mostrar este componente
// en la ruta "/".
export function LandingPageContainer() {
  return (
    <>
      <Seo
        title="Inicio"
        description="Disciplinas deportivas municipales de Tucumán: sedes, horarios e inscripción online."
      />
      <SiteHeader links={navLinks} />
      {/* <main>: contenido principal de la página. Debe haber uno solo. */}
      <main>
        {/* Un único <h1> por página: es el título principal para el SEO. */}
        <h1>Dirección de Deportes de Tucumán</h1>
      </main>
      <SiteFooter />
    </>
  );
}
