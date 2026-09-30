import { BrowserRouter, Route, Routes } from 'react-router';
import { ActivityDetailPageContainer } from '@/features/landing/containers/ActivityDetailPageContainer.tsx';
import { LandingPageContainer } from '@/features/landing/containers/LandingPageContainer.tsx';
import { NotFoundPageContainer } from '@/features/landing/containers/NotFoundPageContainer.tsx';
import { PublicLayout } from '@/features/landing/containers/PublicLayout.tsx';

// QUÉ ES: el componente raíz de la app. Define qué página se ve en cada ruta.
// CÓMO FUNCIONA (React Router, modo declarativo):
// - <BrowserRouter> lee la URL del navegador y avisa cuando cambia.
// - <Routes> mira la URL actual y elige UNA <Route> que coincida.
// - <Route path="..." element={...}> une una dirección con una página.
// - Rutas anidadas: la <Route> de PublicLayout no tiene path; envuelve a sus
//   hijas y las dibuja en su <Outlet />. Así todas comparten header y footer.
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPageContainer />} />
          {/* ":slug" es un parámetro: la parte variable de la dirección. */}
          <Route
            path="/actividades/:slug"
            element={<ActivityDetailPageContainer />}
          />
          {/* "*" atrapa cualquier otra dirección: página 404. */}
          <Route path="*" element={<NotFoundPageContainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
