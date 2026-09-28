import type { NavLink } from '@/features/landing/model/navigation.ts';

// QUÉ ES: encabezado del sitio público con la navegación principal. Esqueleto.
// NIVEL: componente presentacional — solo muestra lo que recibe por props,
// no busca datos por su cuenta.
// DÓNDE SE USA: en LandingPageContainer. El backoffice del personal tendrá su
// propio header, por eso este vive en features/landing y no en shared/.

type SiteHeaderProps = {
  links: NavLink[];
};

export function SiteHeader({ links }: SiteHeaderProps) {
  return (
    <header>
      {/* aria-label: le dice a los lectores de pantalla qué navegación es. */}
      <nav aria-label="Navegación principal">
        <ul>
          {/* map() recorre el array y devuelve un <li> por cada link.
              "key" debe ser único: React lo usa para saber qué elemento cambió. */}
          {links.map((link) => (
            <li key={link.href}>
              {/* <a> provisorio: pasará a <Link> de React Router. */}
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
