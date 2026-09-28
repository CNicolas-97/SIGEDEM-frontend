import type { ReactNode } from 'react';

// QUÉ ES: botón reutilizable de la interfaz. Esqueleto: por ahora sin estilos.
// NIVEL: componente genérico de shared/ui (no pertenece a ninguna feature).
// DÓNDE SE USA: en cualquier feature que necesite un botón.

// PROPS: el "type" describe qué datos recibe el componente.
// El "?" marca una prop como opcional.
type ButtonProps = {
  // Solo acepta estos tres valores; cualquier otro texto da error al escribirlo.
  type?: 'button' | 'submit' | 'reset';
  // Función que se ejecuta al hacer click. "() => void" = no recibe ni devuelve nada.
  onClick?: () => void;
  // ReactNode = cualquier cosa que React pueda mostrar: texto, etiquetas, componentes.
  children: ReactNode;
};

// type = 'button' por defecto: sin él, un <button> dentro de un <form>
// enviaría el formulario al hacer click.
export function Button({ type = 'button', onClick, children }: ButtonProps) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
}
