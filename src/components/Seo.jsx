// Esqueleto: título y descripción únicos por página.
// React 19 mueve automáticamente <title> y <meta> al <head> del documento.
export function Seo({ title, description }) {
  return (
    <>
      <title>{`${title} | SIGEDEM`}</title>
      <meta name="description" content={description} />
    </>
  );
}
