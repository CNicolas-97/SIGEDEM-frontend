import { createContext } from 'react';
import type { AuthUser, LoginCredentials } from '@/features/auth/model/auth.ts';

// QUÉ ES: el "canal" por el que cualquier componente puede saber si hay
// alguien logueado, sin pasar props por toda la app.
// NIVEL: contexto de React de la feature auth. El valor lo pone
// AuthProvider; los componentes lo leen con el hook useAuth.
// POR QUÉ SEPARADO DE AuthProvider: un archivo .tsx con componentes no debe
// exportar otras cosas (lo pide la recarga rápida de Vite).

export type AuthContextValue = {
  // null = nadie logueado.
  user: AuthUser | null;
  // El token que devolvió el backend (para los pedidos que lo pidan).
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

// null por defecto: si alguien usa useAuth fuera de AuthProvider, el hook
// lo detecta y avisa con un error claro.
export const AuthContext = createContext<AuthContextValue | null>(null);
