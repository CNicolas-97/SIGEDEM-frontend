/// <reference types="vite/client" />

// QUÉ ES: los tipos de las variables de entorno propias (las del .env).
// CÓMO FUNCIONA: Vite ya define "import.meta.env", pero no sabe qué
// variables agregamos nosotros. Al declararlas acá, TypeScript las
// autocompleta y avisa si se escribe mal un nombre.
interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
