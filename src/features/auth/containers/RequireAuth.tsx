import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/features/auth/hooks/useAuth.ts';

// QUÉ ES: el "guardia" de las rutas que necesitan estar logueado.
// NIVEL: container de layout. En App.tsx envuelve a las rutas privadas.
// CÓMO FUNCIONA: si hay usuario, dibuja la ruta hija en <Outlet />. Si no,
// manda a /login y recuerda en "state" a qué página quería ir, para volver
// ahí después de ingresar.
export function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // replace: /login reemplaza a esta página en el historial, así el botón
    // "atrás" no vuelve a una página que redirige de nuevo.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
