// QUÉ ES: las variables de entorno de la app, leídas en un solo lugar.
// NIVEL: utilidad genérica de shared/lib (no pertenece a ninguna feature).
// CÓMO FUNCIONA:
// - Vite lee el archivo .env al arrancar y deja sus valores en
//   "import.meta.env". Solo pasan las que empiezan con VITE_.
// - Si una variable falta (ej.: alguien clonó el repo y no creó su .env),
//   se usa el valor por defecto que está después de "??", así la app
//   funciona igual.
// CUÁNDO USARLO: en lugar de escribir "import.meta.env" en cada archivo,
// se importa "env" de acá: si una variable cambia de nombre, se toca un
// solo lugar.
export const env = {
  // Dirección pública del sitio (para las URLs canónicas del SEO).
  siteUrl:
    import.meta.env.VITE_SITE_URL ?? 'https://sigedem-frontend.vercel.app',
  // Dirección del backend. Ej.: fetch(`${env.apiUrl}/inscripciones`).
  apiUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
};
