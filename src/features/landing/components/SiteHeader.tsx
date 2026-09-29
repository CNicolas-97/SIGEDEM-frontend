import { BrandMark } from '@/features/landing/components/BrandMark.tsx';
import type { NavLink } from '@/features/landing/model/navigation.ts';

// QUÉ ES: barra superior fija del sitio público: marca, navegación y botón.
// NIVEL: componente presentacional — solo muestra lo que recibe por props,
// no busca datos por su cuenta.
// DÓNDE SE USA: en LandingPageContainer. El backoffice del personal tendrá su
// propio header, por eso este vive en features/landing y no en shared/.

type SiteHeaderProps = {
  links: NavLink[];
  cta: NavLink;
};

export function SiteHeader({ links, cta }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <BrandMark />
      {/* aria-label: le dice a los lectores de pantalla qué navegación es. */}
      <nav className="topnav" aria-label="Principal">
        {/* map() recorre el array y devuelve un <a> por cada link.
            "key" debe ser único: React lo usa para saber qué elemento cambió.
            Son anclas (#) a secciones de esta misma página, por eso usamos
            <a> y no <Link> de React Router (que es para cambiar de ruta). */}
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <a className="btn" href={cta.href}>
        {cta.label}
      </a>
    </header>
  );
}
