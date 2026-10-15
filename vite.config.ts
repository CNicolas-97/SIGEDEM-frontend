import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

// En la compu, sirve /api/auth/login con la misma función que corre en
// Vercel (api/auth/login.ts), así el login de prueba anda con "npm run dev".
// Los planes NO pasan por acá: en desarrollo los sirve json-server.
function devAuthApi(): Plugin {
  return {
    name: 'dev-auth-api',
    configureServer(server) {
      server.middlewares.use('/api/auth/login', async (req, res) => {
        // Se carga en cada pedido: si se edita la función, toma el cambio.
        const { POST } = await server.ssrLoadModule('/api/auth/login.ts');

        // Se arma el cuerpo con los pedazos que llegan del pedido.
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);

        // Solo responde a POST, igual que en Vercel.
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end();
          return;
        }

        const response: Response = await POST(
          new Request('http://localhost/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: Buffer.concat(chunks).toString(),
          })
        );
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(await response.text());
      });
    },
  };
}

// Configuración de Vite: el servidor de desarrollo y el build de producción.
// https://vite.dev/config/
export default defineConfig({
  // tailwindcss(): genera las clases utilitarias que usan los componentes
  // a partir de los tokens de src/index.css.
  plugins: [react(), tailwindcss(), devAuthApi()],
  resolve: {
    // Alias "@/" -> "src/", para no encadenar "../../.." al importar entre features.
    // Debe coincidir con "paths" en tsconfig.app.json.
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
});
