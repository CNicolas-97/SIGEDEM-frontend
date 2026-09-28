// QUÉ ES: tarjeta reutilizable con título y descripción. Esqueleto: sin estilos.
// NIVEL: componente genérico de shared/ui.
// DÓNDE SE USA: por ejemplo, para mostrar cada disciplina deportiva en un listado.

// PROPS: ambas son obligatorias (no llevan "?").
type CardProps = {
  title: string;
  description: string;
};

export function Card({ title, description }: CardProps) {
  return (
    // <article>: etiqueta semántica para un contenido independiente. Ayuda al SEO
    // y a los lectores de pantalla a entender la estructura.
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
