import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/shared/lib/cn.ts';

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
  // Opcional. Clases extra para ajustar el botón según dónde se usa (ej.: más
  // chico en el header). Si choca con una clase base, gana esta (ver cn()).
  className?: string;
};

// Clases de cada variante. "Record" obliga a tener una entrada por variante.
const VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-accent text-btn-fg',
  // Secundario: sin relleno, solo el contorno (un anillo interno de 1.5px,
  // así mide lo mismo que el primario).
  secondary:
    'bg-transparent text-inherit inset-ring-[1.5px] inset-ring-current hover:bg-white/8',
};

// Forma "píldora" común a las dos variantes. Un <button> trae borde y
// tipografía propios del navegador; el reset de Tailwind ya los quita, así se
// ve igual que la versión link.
const BASE_CLASSES =
  'inline-block cursor-pointer rounded-full px-[22px] py-3 text-[15px] font-semibold transition-[translate,filter,background-color] duration-180 ease-[ease] hover:-translate-y-0.5 hover:brightness-108';

// Valores por defecto con "=" al desestructurar: si no se pasa la prop,
// variant vale 'primary' y type vale 'button'. type = 'button' evita que un
// <button> dentro de un <form> envíe el formulario sin querer.
export function Button({
  children,
  variant = 'primary',
  to,
  type = 'button',
  onClick,
  className,
}: ButtonProps) {
  // Las clases dependen de la prop "variant"; al final van las que llegan
  // por "className", que pueden pisar a las anteriores.
  const classes = cn(BASE_CLASSES, VARIANT_CLASSES[variant], className);

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type={type} onClick={onClick}>
      {children}
    </button>
  );
}
