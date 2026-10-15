import { Link } from 'react-router';
import { Button } from '@/shared/ui/Button.tsx';
import { BrandMark } from '@/features/landing/components/BrandMark.tsx';
import type { SiteLink } from '@/features/landing/model/navigation.ts';

// QUÉ ES: barra superior fija del sitio público: marca, navegación y, en
// celular, el botón para asociarse.
// NIVEL: componente presentacional — solo muestra lo que recibe por props,
// no busca datos por su cuenta.
// DÓNDE SE USA: en PublicLayout, así aparece en todas las páginas públicas.
// El backoffice del personal tendrá su propio header, por eso este vive en
// features/landing y no en shared/.

type SiteHeaderProps = {
  links: SiteLink[];
  cta: SiteLink;
  // Si hay sesión, el link de cuenta lleva a /mi-cuenta; si no, a /login.
  isLoggedIn: boolean;
};

export function SiteHeader({ links, cta, isLoggedIn }: SiteHeaderProps) {
  return (
    // topbar-veil (landing.css): el degradado de fondo, que cambia con la
    // sección visible (--ui-veil de useSectionTheme).
    <header className="topbar-veil fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-5 px-6.5 max-[359px]:gap-3 max-[359px]:px-4 pt-[calc(18px+env(safe-area-inset-top,0px))] pb-[18px] text-ui-fg backdrop-blur-[6px] transition-[color] duration-600 ease-[ease]">
      {/* La marca lleva al inicio desde cualquier página. */}
      <Link
        className="flex shrink-0 items-center"
        to="/"
        aria-label="SIGEDEM, ir al inicio"
      >
        <BrandMark />
      </Link>
      {/* aria-label: le dice a los lectores de pantalla qué navegación es. */}
      {/* Hasta 860px de ancho la navegación se oculta (queda el botón). */}
      <nav
        className="hidden gap-6.5 text-[16.5px] font-semibold tablet:flex"
        aria-label="Principal"
      >
        {/* map() recorre el array y devuelve un <Link> por cada link.
            "key" debe ser único: React lo usa para saber qué elemento cambió.
            <Link> cambia de ruta sin recargar la página (un <a> la recargaría). */}
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="py-1 transition-[scale] duration-500 hover:scale-110 focus-visible:scale-110"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-2.5 tablet:gap-5">
        {/* Se ve siempre: es la puerta al login. En celular queda solo el
            ícono (no entra el texto al lado del botón); aria-label le da
            el nombre al lector de pantalla. */}
        <Link
          to={isLoggedIn ? '/mi-cuenta' : '/login'}
          aria-label={isLoggedIn ? 'Mi cuenta' : 'Ingresar'}
          className="flex shrink-0 items-center gap-2 py-1 text-[16.5px] font-semibold transition-[scale] duration-500 hover:scale-110 focus-visible:scale-110"
        >
          <UserIcon className="size-6 shrink-0 tablet:hidden" />
          <span className="hidden tablet:inline">
            {isLoggedIn ? 'Mi cuenta' : 'Ingresar'}
          </span>
        </Link>
        {/* Solo en celular (tablet:hidden lo oculta desde 860px): es la forma
            de llegar al formulario cuando la navegación no se ve. */}
        <Button
          to={cta.to}
          className="px-[18px] py-2.5 max-[359px]:px-3.5 max-[359px]:text-[14px] tablet:hidden"
        >
          {cta.label}
        </Button>
      </div>
    </header>
  );
}

// Ícono de persona (cuenta), dibujado como SVG igual que los del footer.
// aria-hidden: el link ya tiene su nombre en aria-label.
function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}
