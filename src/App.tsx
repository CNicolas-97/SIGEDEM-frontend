import { BrowserRouter, Route, Routes } from 'react-router';
import { LandingPageContainer } from '@/features/landing/containers/LandingPageContainer.tsx';
import { NotFoundPageContainer } from '@/features/landing/containers/NotFoundPageContainer.tsx';

// QUÉ ES: el componente raíz de la app. Define qué página se ve en cada ruta.
// CÓMO FUNCIONA (React Router, modo declarativo):
// - <BrowserRouter> lee la URL del navegador y avisa cuando cambia.
// - <Routes> mira la URL actual y elige UNA <Route> que coincida.
// - <Route path="..." element={...}> une una dirección con una página.
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPageContainer />} />
        {/* "*" atrapa cualquier otra dirección: página 404. */}
        <Route path="*" element={<NotFoundPageContainer />} />
      </Routes>
    </BrowserRouter>
  );
}
