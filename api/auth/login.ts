import { randomUUID } from 'node:crypto';

// QUÉ ES: el login de prueba mientras no exista el backend en NestJS.
// NIVEL: función de Vercel (corre en el servidor, no en el navegador). En la
// compu la sirve Vite en /api/auth/login (ver vite.config.ts), así que
// funciona igual con "npm run dev".
// CÓMO FUNCIONA: recibe { email, password } por POST y, si coinciden con el
// usuario de prueba, devuelve { token, user }. Si no, responde 401.
// CUANDO ESTÉ NESTJS: este archivo se borra. El backend real busca el usuario
// en la base de datos, compara la contraseña encriptada (bcrypt) y devuelve
// un JWT con la MISMA forma de respuesta, así el front no cambia.

// Usuario de prueba para la demo (no es una cuenta real ni un secreto).
const DEMO_USER = {
  id: 1,
  name: 'Socio de prueba',
  email: 'socio@sigedem.com',
  password: 'socio1234',
};

// POST /api/auth/login
export async function POST(request: Request) {
  // Si el cuerpo no es JSON válido, se trata como credenciales vacías.
  const body = (await request.json().catch(() => ({}))) as {
    email?: unknown;
    password?: unknown;
  };
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(body.password ?? '');

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    return Response.json(
      { message: 'Email o contraseña incorrectos.' },
      { status: 401 }
    );
  }

  // La contraseña nunca vuelve al navegador: solo los datos públicos.
  return Response.json({
    token: randomUUID(),
    user: { id: DEMO_USER.id, name: DEMO_USER.name, email: DEMO_USER.email },
  });
}
