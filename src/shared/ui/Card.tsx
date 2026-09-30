import type { ReactNode } from 'react';
import '@/shared/ui/ui.css';

// QUÉ ES: tarjeta reutilizable: título, descripción y contenido libre.
// NIVEL: componente genérico de shared/ui.
// DÓNDE SE USA: en el detalle de actividad (información extra) y en cada
// plan de la página de planes.

// PROPS: solo "title" es obligatoria; el resto lleva "?" (opcional).
type CardProps = {
  // OBLIGATORIA. Título de la tarjeta.
  title: string;
  // Opcional. Texto corto debajo del título.
  description?: string;
  // Opcional. Etiqueta chica arriba del título (ej.: "Más elegido").
  eyebrow?: string;
  // Opcional. Contenido libre que va entre <Card> y </Card> (precio, listas...).
  children?: ReactNode;
  // Opcional. Parte de abajo, por ejemplo un <Button>.
  footer?: ReactNode;
};

export function Card({
  title,
  description,
  eyebrow,
  children,
  footer,
}: CardProps) {
  return (
    // <article>: etiqueta semántica para un contenido independiente. Ayuda al SEO
    // y a los lectores de pantalla a entender la estructura.
    <article className="card">
      {/* "condición && <elemento>": si la prop no llegó (undefined), React no
          dibuja nada. Así las props opcionales no dejan etiquetas vacías. */}
      {eyebrow && <span className="card-eyebrow">{eyebrow}</span>}
      <h3 className="card-title">{title}</h3>
      {description && <p className="card-description">{description}</p>}
      {children}
      {footer && <div className="card-footer">{footer}</div>}
    </article>
  );
}
