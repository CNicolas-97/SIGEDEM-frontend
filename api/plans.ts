import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// QUÉ ES: la API de planes cuando la app está publicada en Vercel.
// NIVEL: función de Vercel (corre en el servidor, no en el navegador).
// POR QUÉ EXISTE: en la compu, los planes los sirve json-server con
// "npm run api". En Vercel json-server no corre, así que esta función
// responde lo mismo en /api/plans, leyendo el MISMO db.json: los datos
// están en un solo lugar.
// CÓMO SE CONECTA: en producción env.apiUrl vale "/api" (ver
// src/shared/lib/env.ts), así que el front pide "/api/plans" y llega acá.

// Se lee una sola vez, cuando Vercel arranca la función.
const db = JSON.parse(readFileSync(join(process.cwd(), 'db.json'), 'utf8'));

// GET /api/plans: devuelve la lista de planes como JSON.
export function GET() {
  return Response.json(db.plans);
}
