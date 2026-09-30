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
    <footer className="site-footer">
      <div className="foot-inner">
        <div>
          <BrandMark spinning={false} />
          <p>
            Complejo Deportivo Municipal Teniente Ledesma. Av. Ejército del
            Norte s/n, San Miguel de Tucumán.
          </p>
        </div>
        {/* Un map dentro de otro: primero las columnas, después los links
            de cada columna. */}
        {columns.map((column) => (
          <div key={column.title} className="foot-col">
            <h4>{column.title}</h4>
            {column.links.map((link) => (
              // Hay links que repiten ruta (/#pasos), así que la key es el texto.
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <p className="legal">
        Maqueta de diseño — contenido y datos de ejemplo. Calderón · Núñez ·
        Rodríguez.
      </p>
    </footer>
  );
}
