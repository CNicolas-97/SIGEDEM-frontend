import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';

// Punto de entrada de la app: busca el <div id="root"> de index.html y
// monta React adentro.
const rootElement = document.getElementById('root');

// getElementById puede devolver null si el elemento no existe. TypeScript nos
// obliga a contemplar ese caso antes de usarlo: si falta, cortamos con un
// error claro en lugar de fallar más adelante sin explicación.
if (!rootElement) {
  throw new Error('No se encontró el elemento #root en index.html');
}

createRoot(rootElement).render(
  // StrictMode activa chequeos extra de React solo en desarrollo.
  <StrictMode>
    <App />
  </StrictMode>
);
