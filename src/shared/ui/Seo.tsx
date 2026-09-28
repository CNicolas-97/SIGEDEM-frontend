// QUÉ ES: define el título y la descripción de cada página para los buscadores.
// NIVEL: componente genérico de shared/ui. No muestra nada en pantalla.
// DÓNDE SE USA: al principio de cada página (container).
// CÓMO FUNCIONA: React 19 detecta <title> y <meta> y los mueve solo al <head>
// del documento, sin librerías extra.

type SeoProps = {
  // Nombre de la página. Se le agrega " | SIGEDEM" al final.
  title: string;
  // Resumen de la página que muestra Google en los resultados (120-155 caracteres).
  description: string;
};

export function Seo({ title, description }: SeoProps) {
  return (
    <>
      <title>{`${title} | SIGEDEM`}</title>
      <meta name="description" content={description} />
    </>
  );
}
