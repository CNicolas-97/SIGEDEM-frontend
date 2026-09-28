import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Configuración de Vite: el servidor de desarrollo y el build de producción.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Alias "@/" -> "src/", para no encadenar "../../.." al importar entre features.
    // Debe coincidir con "paths" en tsconfig.app.json.
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
});
