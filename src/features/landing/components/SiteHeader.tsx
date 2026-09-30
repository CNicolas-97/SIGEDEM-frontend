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
    <header className="topbar">
      {/* La marca lleva al inicio desde cualquier página. */}
      <Link className="brand-link" to="/" aria-label="SIGEDEM, ir al inicio">
        <BrandMark />
      </Link>
      {/* aria-label: le dice a los lectores de pantalla qué navegación es. */}
      <nav className="topnav" aria-label="Principal">
        {/* map() recorre el array y devuelve un <Link> por cada link.
            "key" debe ser único: React lo usa para saber qué elemento cambió.
            <Link> cambia de ruta sin recargar la página (un <a> la recargaría). */}
        {links.map((link) => (
          <Link key={link.to} to={link.to}>
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
