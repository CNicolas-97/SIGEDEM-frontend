import axios from 'axios';
import { env } from '@/shared/lib/env.ts';
import type {
  AuthSession,
  LoginCredentials,
} from '@/features/auth/model/auth.ts';

// QUÉ ES: el pedido de login al backend.
// NIVEL: api — solo habla con el servidor; no guarda estado ni muestra nada.
// DÓNDE SE USA: en AuthProvider, dentro de la función login().
// CUANDO ESTÉ NESTJS: el endpoint POST /auth/login ya tiene el nombre y la
// forma de respuesta que se usan en NestJS; solo cambia VITE_API_URL.

const AUTH_URL = env.authUrl;

// POST: manda las credenciales en el cuerpo del pedido (nunca en la URL).
export async function login(
  credentials: LoginCredentials
): Promise<AuthSession> {
  const response = await axios.post<AuthSession>(
    `${AUTH_URL}/auth/login`,
    credentials
  );
  return response.data;
}

// true si el backend respondió 401: el email o la contraseña no coinciden.
// Sirve para diferenciarlo de un error de conexión.
export function isInvalidCredentials(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
