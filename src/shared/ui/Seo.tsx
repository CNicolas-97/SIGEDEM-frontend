// QUÉ ES: define el título, la descripción y la URL canónica de cada página
// para los buscadores.
// NIVEL: componente genérico de shared/ui. No muestra nada en pantalla.
// DÓNDE SE USA: al principio de cada página (container).
// CÓMO FUNCIONA: React 19 detecta <title>, <meta> y <link> y los mueve solo al
// <head> del documento, sin librerías extra.

// Dirección pública del sitio. Se usa para armar las URLs absolutas.
const SITE_URL = 'https://sigedem-frontend.vercel.app';

type SeoProps = {
  // Nombre de la página. Se le agrega " | SIGEDEM" al final.
  title: string;
  // Resumen de la página que muestra Google en los resultados (120-155 caracteres).
  description: string;
  // Ruta de la página (ej.: "/planes"). Con ella se arma la URL canónica: le
  // dice a Google cuál es la dirección "oficial" de esta página. Si todas las
  // páginas apuntaran a "/", Google las tomaría como copias de la home.
  path?: string;
  // true = pedirle a los buscadores que no guarden esta página (ej.: la 404).
  noIndex?: boolean;
};

export function Seo({ title, description, path, noIndex = false }: SeoProps) {
  const url = path ? `${SITE_URL}${path}` : undefined;

  return (
    <>
      <title>{`${title} | SIGEDEM`}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {url && <meta property="og:url" content={url} />}
      {noIndex && <meta name="robots" content="noindex" />}
    </>
  );
}
