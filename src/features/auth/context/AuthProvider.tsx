import { useState, type ReactNode } from 'react';
import { login as loginRequest } from '@/features/auth/api/authApi.ts';
import { AuthContext } from '@/features/auth/context/AuthContext.ts';
import type {
  AuthSession,
  LoginCredentials,
} from '@/features/auth/model/auth.ts';

// QUÉ ES: guarda la sesión (quién está logueado) y la comparte con toda la
// app a través de AuthContext.
// NIVEL: provider de la feature auth. En App.tsx envuelve a las rutas.
// CÓMO FUNCIONA:
// - La sesión vive en un useState.
// - Al loguearse se guarda también en localStorage, así no se pierde al
//   recargar la página. Al salir, se borra de los dos lados.

// Nombre con el que se guarda en el navegador.
const STORAGE_KEY = 'sigedem-session';

// Lee la sesión guardada. try/catch: el navegador puede bloquear el acceso
// (modo privado) o el dato puede estar roto; en ese caso, sin sesión.
function readStoredSession(): AuthSession | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Se pasa la función (sin llamarla): lee localStorage una sola vez.
  const [session, setSession] = useState<AuthSession | null>(readStoredSession);

  async function login(credentials: LoginCredentials) {
    // Si el backend responde con error, axios lanza la excepción y la
    // atrapa la página de login para mostrar el mensaje.
    const newSession = await loginRequest(credentials);
    setSession(newSession);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    } catch {
      // Sin localStorage la sesión dura hasta recargar: igual funciona.
    }
  }

  function logout() {
    setSession(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nada que borrar.
    }
  }

  return (
    <AuthContext
      value={{
        user: session?.user ?? null,
        token: session?.token ?? null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}
