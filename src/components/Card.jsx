// Esqueleto: tarjeta reutilizable (por ejemplo, una disciplina deportiva).
export function Card({ title, description }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
