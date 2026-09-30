import type { ReactNode } from 'react';
import { Link } from 'react-router';
import '@/shared/ui/ui.css';

// QUÉ ES: botón reutilizable de la interfaz, con el estilo "píldora" del sitio.
// NIVEL: componente genérico de shared/ui (no pertenece a ninguna feature).
// DÓNDE SE USA: header, secciones de actividad, detalle, 404 y planes.
// CÓMO FUNCIONA: si recibe "to", navega a otra ruta (dibuja un <Link> de
// React Router); si no, es un <button> común que ejecuta "onClick".

// PROPS: el "type" describe qué datos recibe el componente.
// El "?" marca una prop como opcional.
type ButtonProps = {
  // OBLIGATORIA. ReactNode = cualquier cosa que React pueda mostrar: texto,
  // etiquetas u otros componentes. Es lo que va entre <Button> y </Button>.
  children: ReactNode;
  // Opcional. Unión de strings: solo acepta estos dos valores.
  // "primary" = relleno con el color de acento; "secondary" = solo borde.
  variant?: 'primary' | 'secondary';
  // Opcional. Ruta a la que navega (ej.: "/planes"). Si está, es un link.
  to?: string;
  // Opcional. Tipo del <button> (solo se usa si no hay "to").
  type?: 'button' | 'submit' | 'reset';
  // Opcional. Función que se ejecuta al hacer click.
  // "() => void" = no recibe nada y no devuelve nada.
  onClick?: () => void;
};

// Valores por defecto con "=" al desestructurar: si no se pasa la prop,
// variant vale 'primary' y type vale 'button'. type = 'button' evita que un
// <button> dentro de un <form> envíe el formulario sin querer.
export function Button({
  children,
  variant = 'primary',
  to,
  type = 'button',
  onClick,
}: ButtonProps) {
  // La clase depende de la prop: "btn btn--primary" o "btn btn--secondary".
  const className = `btn btn--${variant}`;

  if (to) {
    return (
      <Link className={className} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
