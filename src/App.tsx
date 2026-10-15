import { BrowserRouter, Route, Routes } from 'react-router';
import { AccountPageContainer } from '@/features/auth/containers/AccountPageContainer.tsx';
import { LoginPageContainer } from '@/features/auth/containers/LoginPageContainer.tsx';
import { RequireAuth } from '@/features/auth/containers/RequireAuth.tsx';
import { AuthProvider } from '@/features/auth/context/AuthProvider.tsx';
import { BookingPageContainer } from '@/features/booking/containers/BookingPageContainer.tsx';
import { EnrollmentPageContainer } from '@/features/enrollment/containers/EnrollmentPageContainer.tsx';
import { ActivityDetailPageContainer } from '@/features/landing/containers/ActivityDetailPageContainer.tsx';
import { LandingPageContainer } from '@/features/landing/containers/LandingPageContainer.tsx';
import { NotFoundPageContainer } from '@/features/landing/containers/NotFoundPageContainer.tsx';
import { PublicLayout } from '@/features/landing/containers/PublicLayout.tsx';
import { PlansPageContainer } from '@/features/plans/containers/PlansPageContainer.tsx';

// QUÉ ES: el componente raíz de la app. Define qué página se ve en cada ruta.
// CÓMO FUNCIONA (React Router, modo declarativo):
// - <BrowserRouter> lee la URL del navegador y avisa cuando cambia.
// - <Routes> mira la URL actual y elige UNA <Route> que coincida.
// - <Route path="..." element={...}> une una dirección con una página.
// - Rutas anidadas: la <Route> de PublicLayout no tiene path; envuelve a sus
//   hijas y las dibuja en su <Outlet />. Así todas comparten header y footer.
// - <AuthProvider> envuelve todo: cualquier página puede saber si hay
//   alguien logueado (useAuth). <RequireAuth> protege las rutas privadas.
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPageContainer />} />
            {/* ":slug" es un parámetro: la parte variable de la dirección. */}
            <Route
              path="/actividades/:slug"
              element={<ActivityDetailPageContainer />}
            />
            <Route path="/planes" element={<PlansPageContainer />} />
            <Route path="/inscripcion" element={<EnrollmentPageContainer />} />
            <Route path="/alquilar-cancha" element={<BookingPageContainer />} />
            <Route path="/login" element={<LoginPageContainer />} />
            {/* Rutas privadas: sin sesión, RequireAuth manda a /login. */}
            <Route element={<RequireAuth />}>
              <Route path="/mi-cuenta" element={<AccountPageContainer />} />
            </Route>
            {/* "*" atrapa cualquier otra dirección: página 404. */}
            <Route path="*" element={<NotFoundPageContainer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
