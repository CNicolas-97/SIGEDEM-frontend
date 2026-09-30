import { Link } from 'react-router';
import { BrandMark } from '@/features/landing/components/BrandMark.tsx';
import type { FooterColumn } from '@/features/landing/model/navigation.ts';

// QUÉ ES: pie de página del sitio público.
// NIVEL: componente presentacional — recibe las columnas de links por props.
// DÓNDE SE USA: en PublicLayout, así aparece en todas las páginas públicas.

type SiteFooterProps = {
  columns: FooterColumn[];
};

export function SiteFooter({ columns }: SiteFooterProps) {
  return (
    // <footer>: etiqueta semántica para el cierre de la página.
    <footer className="relative z-1 bg-ink px-6.5 pt-[70px] pb-12">
      <div className="mx-auto flex max-w-page flex-wrap items-start justify-between gap-[34px]">
        <div>
          <BrandMark spinning={false} size="lg" />
          <p className="mt-3 max-w-[34ch] text-[14.5px] opacity-60">
            Complejo Deportivo Municipal Teniente Ledesma. Av. Ejército del
            Norte s/n, San Miguel de Tucumán.
          </p>
        </div>
        {/* Un map dentro de otro: primero las columnas, después los links
            de cada columna. */}
        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3 font-body text-[14px] font-semibold opacity-55">
              {column.title}
            </h4>
            {column.links.map((link) => (
              // Hay links que repiten ruta (/#pasos), así que la key es el texto.
              <Link
                key={link.label}
                to={link.to}
                className="block py-[3px] text-[15px] opacity-85"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="mx-auto mt-[52px] max-w-page border-t border-white/14 pt-5.5 text-[13px] opacity-50">
        Maqueta de diseño — contenido y datos de ejemplo. Calderón · Núñez ·
        Rodríguez.
      </p>
    </footer>
  );
}
