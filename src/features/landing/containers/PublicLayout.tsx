import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { SiteFooter } from '@/features/landing/components/SiteFooter.tsx';
import { SiteHeader } from '@/features/landing/components/SiteHeader.tsx';
import { activities } from '@/features/landing/model/activities.ts';
import {
  footerContact,
  headerCta,
  navLinks,
} from '@/features/landing/model/navigation.ts';
import '@/features/landing/landing.css';

// QUÉ ES: el "marco" común de todas las páginas públicas: fondo, header y
// footer. En el medio va la página que corresponda a la URL.
// NIVEL: container de layout. En App.tsx es la <Route> "padre" de las
// páginas públicas.
// CÓMO FUNCIONA: <Outlet /> es el hueco donde React Router dibuja la ruta
// "hija" que coincide (home, detalle de actividad, 404...). Así el header y
// el footer se escriben una sola vez y no se repiten en cada página.
export function PublicLayout() {
  const location = useLocation();

  // Al cambiar de página, el navegador conserva el scroll de la anterior.
  // Por eso volvemos arriba en cada navegación... salvo que la URL traiga un
  // "#" (ej.: /#pasos): en ese caso la home baja hasta esa sección.
  useEffect(() => {
    if (!location.hash) window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* Fondo fijo que cambia de color según la sección (useSectionTheme).
          Los brillos y el grano son degradados: viven en landing.css. */}
      <div
        className="page-glow fixed inset-0 -z-2 bg-page transition-[background-color] duration-900 ease-in-out"
        aria-hidden="true"
      />
      <div
        className="grain pointer-events-none fixed inset-0 -z-1 opacity-28 mix-blend-overlay"
        aria-hidden="true"
      />

      <SiteHeader links={navLinks} cta={headerCta} />
      {/* key={pathname}: si cambia la dirección, React monta la página de
          cero aunque sea el mismo componente (de /actividades/natacion a
          /actividades/futbol). Así cada página arranca con sus efectos y su
          estado limpios, por ejemplo los colores de useSectionTheme. */}
      <Outlet key={location.pathname} />
      <SiteFooter activities={activities} contact={footerContact} />
    </>
  );
}
