import type { ReactNode } from 'react';

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
    <article className="flex h-full flex-col gap-3 rounded-[22px] border border-white/14 bg-white/6 p-6 backdrop-blur-[6px]">
      {/* "condición && <elemento>": si la prop no llegó (undefined), React no
          dibuja nada. Así las props opcionales no dejan etiquetas vacías. */}
      {eyebrow && (
        <span className="self-start rounded-full bg-accent px-[11px] py-[3px] text-[12.5px] font-bold text-btn-fg">
          {eyebrow}
        </span>
      )}
      <h3 className="text-[22px] leading-[1.05]">{title}</h3>
      {description && (
        <p className="text-[15.5px] leading-normal opacity-80">{description}</p>
      )}
      {children}
      {/* mt-auto empuja el pie al fondo, aunque las tarjetas de una misma
          fila tengan textos de distinto largo. */}
      {footer && <div className="mt-auto pt-2">{footer}</div>}
    </article>
  );
}
