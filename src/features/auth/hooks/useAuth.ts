import { use } from 'react';
import { AuthContext } from '@/features/auth/context/AuthContext.ts';

// QUÉ ES: hook para leer la sesión desde cualquier componente.
// NIVEL: custom hook de la feature auth.
// DÓNDE SE USA: en el header (mostrar "Ingresar" o el nombre), en la página
// de login y en RequireAuth (proteger rutas).
// Ej.: const { user, logout } = useAuth();
export function useAuth() {
  // use(Context): lee el valor que puso el AuthProvider más cercano.
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useAuth se usa dentro de <AuthProvider>.');
  }
  return value;
}
