# SIGEDEM Frontend

Interfaz web del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Permite que los vecinos consulten y se inscriban en las disciplinas deportivas, y que el personal de la Dirección gestione inscripciones, sedes y cobros desde un solo lugar.

**Sitio en producción:** https://sigedem-frontend.vercel.app

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Inicio rápido

Requisitos: **Node.js 20.19+** (o 22.12+) y **npm**.

```bash
git clone https://github.com/CNicolas-97/SIGEDEM-frontend.git
cd SIGEDEM-frontend
npm install
cp .env.example .env
npm run api   # en una terminal: la API con los datos de db.json
npm run dev   # en otra terminal: la app
```

La app queda disponible en http://localhost:5173 y la API en http://localhost:3000

### API de prueba (db.json)

Mientras el backend no está listo, los datos salen de `db.json`, servido con [json-server](https://github.com/typicode/json-server). Cada clave de primer nivel es una ruta: `"plans"` → `GET http://localhost:3000/plans`.

La URL de la API sale de `VITE_API_URL` (ver [Variables de entorno](#variables-de-entorno)).

En Vercel json-server no corre: la función `api/plans.ts` responde `GET /api/plans` con el mismo `db.json`. Sin `VITE_API_URL`, la versión publicada usa `/api` (ver `src/shared/lib/env.ts`).

## Variables de entorno

La configuración que cambia según dónde corre la app (en tu compu, en Vercel) va en un archivo `.env`, no escrita en el código.

- `.env.example` **sí** se sube a git: lista las variables con valores de ejemplo.
- `.env` **no** se sube (está en `.gitignore`): cada uno crea el suyo copiando el de ejemplo.
- Vite solo deja llegar al navegador las variables que empiezan con `VITE_`, y se leen con `import.meta.env`. En el proyecto se leen una sola vez en `src/shared/lib/env.ts`, y sus tipos están en `src/vite-env.d.ts`.
- Si falta el `.env`, la app usa los valores por defecto de `env.ts` y funciona igual.
- Si cambiás el `.env`, reiniciá `npm run dev`.
- Lo que lee el front queda a la vista de cualquiera: **nunca** poner contraseñas ni claves secretas.

| Variable        | Para qué sirve                                        | Dónde se usa                                                                                  |
| --------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `VITE_SITE_URL` | Dirección pública del sitio (URLs canónicas para SEO) | `shared/ui/Seo.tsx`                                                                           |
| `VITE_API_URL`  | Dirección de la API (hoy json-server con `db.json`)   | Planes (`plans/api/plansApi.ts`); formularios de inscripción y alquiler (donde va el `fetch`) |

## Funcionalidades

| Módulo               | Descripción                                                                                                                | Estado        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Landing pública      | Presentación de la Dirección de Deportes y sus disciplinas                                                                 | En desarrollo |
| Detalle de actividad | Página por actividad con horario de hoy, datos destacados y alquiler de canchas (fútbol y vóley)                           | Hecho         |
| Planes y precios     | Planes del abono por cantidad de personas, con precio mensual y filtro por tipo; los trae de la API                        | Hecho         |
| Disciplinas          | Listado de disciplinas con edades, sede y horarios                                                                         | Previsto      |
| Inscripciones        | Formulario de inscripción al abono con validación; queda listo para guardarse en la base de datos                          | En desarrollo |
| Alquiler de canchas  | Reserva de canchas de fútbol y vóley por día y horario; los turnos ocupados son de ejemplo hasta conectar la base de datos | En desarrollo |
| Acceso del personal  | Ingreso con pantalla inicial según el rol (ventanilla, caja, portería, coordinación, dirección)                            | Previsto      |
| Navegación           | Rutas entre páginas con React Router, layout compartido (header y footer) y página 404                                     | Hecho         |

## Tecnologías

| Tecnología                                             | Uso                                                     |
| ------------------------------------------------------ | ------------------------------------------------------- |
| [React 19](https://react.dev/)                         | Librería de interfaz basada en componentes              |
| [TypeScript](https://www.typescriptlang.org/)          | JavaScript con tipos: detecta errores antes de ejecutar |
| [Vite](https://vite.dev/)                              | Servidor de desarrollo y build                          |
| [React Router](https://reactrouter.com/)               | Navegación entre páginas (modo declarativo)             |
| [Axios](https://axios-http.com/)                       | Pedidos HTTP a la API                                   |
| [SweetAlert2](https://sweetalert2.github.io/)          | Avisos al usuario (por ejemplo, si falla la API)        |
| [json-server](https://github.com/typicode/json-server) | API de prueba a partir de `db.json`                     |
| ESLint + typescript-eslint                             | Análisis estático del código                            |
| Prettier                                               | Formato de código consistente                           |

El backend se desarrolla en un repositorio separado con **NestJS + TypeScript**, así que todo el sistema usa el mismo lenguaje.

## Scripts

| Comando             | Qué hace                                                      |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Levanta el servidor de desarrollo                             |
| `npm run api`       | Levanta la API de prueba con `db.json` en el puerto 3000      |
| `npm run build`     | Revisa los tipos y genera la versión de producción en `dist/` |
| `npm run typecheck` | Revisa los tipos con TypeScript, sin generar archivos         |
| `npm run preview`   | Sirve localmente el build de producción                       |
| `npm run lint`      | Revisa el código con ESLint                                   |

## Arquitectura

El código se organiza **por features** (estilo [Bulletproof React](https://github.com/alan2207/bulletproof-react)): cada funcionalidad del sistema tiene su propia carpeta, y las carpetas nombran lo que hace el sistema (`landing`, `inscripciones`), no la tecnología que usan.

Dentro de cada feature se aplica el patrón **container/presentational**:

| Tipo                               | Responsabilidad                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| **Presentacional** (`components/`) | Recibe datos por props y los muestra. No busca datos por su cuenta.                   |
| **Container** (`containers/`)      | Obtiene los datos y se los pasa a los presentacionales. Cada container es una página. |

```
SIGEDEM-frontend/
├── public/                      # Archivos estáticos (favicon, robots.txt, sitemap.xml)
├── src/
│   ├── shared/
│   │   ├── lib/                 # Utilidades (cn, validaciones, fechas del input date)
│   │   └── ui/                  # Componentes genéricos (Button, Card, Seo, FormFields)
│   ├── features/
│   │   ├── landing/             # Sitio público
│   │   │   ├── components/      # Presentacionales (SiteHeader, ActivitySection, ...)
│   │   │   ├── containers/      # Páginas y layout (PublicLayout, LandingPageContainer, ...)
│   │   │   ├── hooks/           # Custom hooks (colores por sección, movimiento al scroll)
│   │   │   └── model/           # Datos y tipos de la feature
│   │   ├── plans/               # Planes y precios (PlansPageContainer, PlanCard, model/)
│   │   ├── enrollment/          # Hacerse socio (EnrollmentPageContainer, EnrollmentForm, model/)
│   │   └── booking/             # Alquiler de canchas (BookingPageContainer, BookingForm, SlotPicker, model/)
│   ├── App.tsx                  # Componente raíz y rutas
│   └── main.tsx                 # Punto de entrada
├── index.html                   # HTML base con metadatos SEO
└── tsconfig*.json               # Configuración de TypeScript
```

### Rutas

Definidas en `src/App.tsx`. Todas se dibujan dentro de `PublicLayout`, que pone el header y el footer una sola vez.

| Ruta                 | Página                        | Qué muestra                                                                        |
| -------------------- | ----------------------------- | ---------------------------------------------------------------------------------- |
| `/`                  | `LandingPageContainer`        | Home: hero, actividades y cómo asociarse                                           |
| `/actividades/:slug` | `ActivityDetailPageContainer` | Detalle de una actividad (`natacion`, `futbol`, `voley`)                           |
| `/planes`            | `PlansPageContainer`          | Planes y precios, con filtro por tipo de plan                                      |
| `/inscripcion`       | `EnrollmentPageContainer`     | Formulario de inscripción (acepta `?plan=<id>`)                                    |
| `/alquilar-cancha`   | `BookingPageContainer`        | Reserva de una cancha de fútbol o vóley por hora (acepta `?deporte=` y `?cancha=`) |
| `*`                  | `NotFoundPageContainer`       | Página 404 para cualquier otra dirección                                           |

Los links a secciones de la home (por ejemplo `/#pasos`) funcionan desde cualquier página: la home busca el elemento con ese id al cargarse y baja hasta él.

Los imports usan el alias `@/` en lugar de rutas relativas: `@/shared/ui/Button.tsx` apunta a `src/shared/ui/Button.tsx`.

### Correspondencia con los conceptos de React

> La escena animada del hero (`HeroScene`, con WebGL) es un extra visual: queda fuera de los temas del trabajo práctico.

| Concepto     | Dónde se aplica                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components   | `shared/ui/` y `features/*/components/`                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Pages        | `features/landing/containers/`: `LandingPageContainer`, `ActivityDetailPageContainer`, `NotFoundPageContainer` (una por ruta)                                                                                                                                                                                                                                                                                                                                                                                    |
| Props        | Tipadas en cada componente (`type ...Props`). `shared/ui/Button.tsx`: `children` obligatoria, `variant` opcional con valor por defecto (`'primary'`) y `to` que decide si es link o botón. `shared/ui/Card.tsx`: `title` obligatoria y el resto opcional (`description`, `eyebrow`, `children`, `footer`). `ActivitySection.tsx`: el mismo componente muestra las tres actividades cambiando la prop `activity`                                                                                                  |
| `map()`      | Listas renderizadas a partir de datos de `model/`: `PlansPageContainer.tsx` (botones del filtro y tarjetas de planes, después de `filter()`), `PlanCard.tsx` (los beneficios, iguales para todos los planes), `CourtRatesTable.tsx` (una fila por cancha, en la página de fútbol y de vóley), `LandingPageContainer.tsx` (una `ActivitySection` por actividad), `StatList.tsx`, `TodayBoard.tsx` y `SiteHeader.tsx`. Cada ítem lleva una `key` única y estable (un id o un texto que no se repite, no el índice) |
| React Router | `App.tsx` (rutas anidadas y parámetro `:slug`), `PublicLayout.tsx` (`<Outlet />`), `ActivityDetailPageContainer.tsx` (`useParams`), `SiteHeader.tsx` (`<Link>`), `EnrollmentPageContainer.tsx` (`useSearchParams` para leer `?plan=`)                                                                                                                                                                                                                                                                            |
| Formularios  | `features/enrollment/` y `features/booking/`: inputs controlados (el valor vive en el estado del container), `onSubmit` con `preventDefault`, validación en una función pura (`validateEnrollment`) y renderizado condicional del mensaje de éxito                                                                                                                                                                                                                                                               |

## SEO

El sitio es una SPA (React arma la página en el navegador), así que el SEO se resuelve en tres capas: metadatos por defecto en el HTML, metadatos propios de cada página y archivos para los buscadores.

### 1. Metadatos por defecto (`index.html`)

Es lo primero que lee un buscador o una red social, antes de que corra React:

| Qué                            | Para qué sirve                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| `<html lang="es-AR">`          | Indica el idioma y la región del contenido                                           |
| `<title>` y `meta description` | Título y resumen que aparecen en los resultados de búsqueda                          |
| Open Graph (`og:*`)            | Título, descripción, tipo e idioma de la vista previa al compartir en WhatsApp, etc. |
| Twitter / X (`twitter:*`)      | Lo mismo para X                                                                      |
| Datos estructurados (JSON-LD)  | Le dicen a Google que el sitio es un organismo público (`GovernmentOrganization`)    |
| `theme-color` y favicon        | Color de la barra del navegador en celular e ícono de la pestaña                     |

### 2. Metadatos de cada página (`<Seo>`)

`src/shared/ui/Seo.tsx` recibe por props el título, la descripción y la ruta de la página. React 19 lleva esos `<title>`, `<meta>` y `<link>` al `<head>` solo, sin librerías extra.

```tsx
<Seo
  title="Planes y precios"
  path="/planes"
  description="Planes del abono del Complejo Teniente Ledesma..."
/>
```

Genera:

- `<title>Planes y precios | SIGEDEM</title>`: cada página tiene un título distinto.
- `<meta name="description">`: el resumen propio de esa página.
- `<link rel="canonical">` y `og:url`: la dirección oficial de la página, armada con `VITE_SITE_URL` (ver [Variables de entorno](#variables-de-entorno)). Evita que Google cuente como páginas distintas la misma página con parámetros (`/inscripcion?plan=familiar`).
- `noIndex`: agrega `<meta name="robots" content="noindex">`. Se usa en la página 404 para que no aparezca en Google.

Lo usan todas las páginas: home, detalle de actividad, planes, inscripción, alquiler de canchas y 404.

### 3. Archivos para los buscadores (`public/`)

- **`robots.txt`**: permite indexar todo el sitio y avisa dónde está el sitemap.
- **`sitemap.xml`**: la lista de páginas públicas (`/`, las tres actividades, `/planes`, `/inscripcion` y `/alquilar-cancha`) para que el buscador las encuentre sin tener que seguir los links.

### HTML semántico

También ayuda al SEO y a la accesibilidad: un solo `<h1>` por página, `<header>`, `<main>`, `<section>` y `<footer>` en lugar de `<div>` sueltos, `alt` en las imágenes (vacío en las decorativas) y links reales (`<Link>`) para navegar entre páginas.

## Flujo de trabajo

| Rama                        | Uso                                                  |
| --------------------------- | ---------------------------------------------------- |
| `main`                      | Producción (deploy automático en Vercel)             |
| `develop`                   | Integración del desarrollo                           |
| `feat/*`, `fix/*`, `docs/*` | Una rama por tarea, con Pull Request hacia `develop` |

- Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Cada Pull Request lo revisa y aprueba otro integrante del equipo antes de mergear.

## Equipo

- [CNicolas-97](https://github.com/CNicolas-97)
- [leanNunez](https://github.com/leanNunez)
- [lourdesrodriguez071102-ui](https://github.com/lourdesrodriguez071102-ui)
