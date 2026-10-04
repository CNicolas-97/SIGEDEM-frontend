import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Configuración de Vite: el servidor de desarrollo y el build de producción.
// https://vite.dev/config/
export default defineConfig({
  // tailwindcss(): genera las clases utilitarias que usan los componentes
  // a partir de los tokens de src/index.css.
  plugins: [react(), tailwindcss()],
  resolve: {
    // Alias "@/" -> "src/", para no encadenar "../../.." al importar entre features.
    // Debe coincidir con "paths" en tsconfig.app.json.
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
});
