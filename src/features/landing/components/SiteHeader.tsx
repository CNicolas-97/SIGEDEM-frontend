import { Link } from 'react-router';
import { Button } from '@/shared/ui/Button.tsx';
import { BrandMark } from '@/features/landing/components/BrandMark.tsx';
import type { SiteLink } from '@/features/landing/model/navigation.ts';

// QUÉ ES: barra superior fija del sitio público: marca, navegación y botón.
// NIVEL: componente presentacional — solo muestra lo que recibe por props,
// no busca datos por su cuenta.
// DÓNDE SE USA: en PublicLayout, así aparece en todas las páginas públicas.
// El backoffice del personal tendrá su propio header, por eso este vive en
// features/landing y no en shared/.

type SiteHeaderProps = {
  links: SiteLink[];
  cta: SiteLink;
};

export function SiteHeader({ links, cta }: SiteHeaderProps) {
  return (
    // topbar-veil (landing.css): el degradado de fondo, que cambia con la
    // sección visible (--ui-veil de useSectionTheme).
    <header className="topbar-veil fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-5 px-6.5 pt-[calc(18px+env(safe-area-inset-top,0px))] pb-[18px] text-ui-fg backdrop-blur-[6px] transition-[color] duration-600 ease-[ease]">
      {/* La marca lleva al inicio desde cualquier página. */}
      <Link
        className="flex items-center"
        to="/"
        aria-label="SIGEDEM, ir al inicio"
      >
        <BrandMark />
      </Link>
      {/* aria-label: le dice a los lectores de pantalla qué navegación es. */}
      {/* Hasta 860px de ancho la navegación se oculta (queda el botón). */}
      <nav
        className="hidden gap-6.5 text-[14.5px] font-medium tablet:flex"
        aria-label="Principal"
      >
        {/* map() recorre el array y devuelve un <Link> por cada link.
            "key" debe ser único: React lo usa para saber qué elemento cambió.
            <Link> cambia de ruta sin recargar la página (un <a> la recargaría). */}
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="border-b-[1.5px] border-transparent py-1 opacity-82 transition-[opacity,border-color] duration-200 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {/* En el header el botón va un poco más chico. */}
      <Button to={cta.to} className="px-[18px] py-2.5">
        {cta.label}
      </Button>
    </header>
  );
}
