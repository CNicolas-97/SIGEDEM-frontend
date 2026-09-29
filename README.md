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
npm run dev
```

La app queda disponible en http://localhost:5173

## Funcionalidades

| Módulo               | Descripción                                                                                     | Estado        |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| Landing pública      | Presentación de la Dirección de Deportes y sus disciplinas                                      | En desarrollo |
| Detalle de actividad | Página por actividad (natatorio, fútbol, vóley) con horario de hoy y datos destacados           | Hecho         |
| Disciplinas          | Listado de disciplinas con edades, sede y horarios                                              | Previsto      |
| Inscripciones        | Alta de vecinos en una disciplina                                                               | Previsto      |
| Acceso del personal  | Ingreso con pantalla inicial según el rol (ventanilla, caja, portería, coordinación, dirección) | Previsto      |
| Navegación           | Rutas entre páginas con React Router, layout compartido (header y footer) y página 404          | Hecho         |

## Tecnologías

| Tecnología                                    | Uso                                                     |
| --------------------------------------------- | ------------------------------------------------------- |
| [React 19](https://react.dev/)                | Librería de interfaz basada en componentes              |
| [TypeScript](https://www.typescriptlang.org/) | JavaScript con tipos: detecta errores antes de ejecutar |
| [Vite](https://vite.dev/)                     | Servidor de desarrollo y build                          |
| [React Router](https://reactrouter.com/)      | Navegación entre páginas (modo declarativo)             |
| ESLint + typescript-eslint                    | Análisis estático del código                            |
| Prettier                                      | Formato de código consistente                           |

El backend se desarrolla en un repositorio separado con **NestJS + TypeScript**, así que todo el sistema usa el mismo lenguaje.

## Scripts

| Comando             | Qué hace                                                      |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Levanta el servidor de desarrollo                             |
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
│   │   └── ui/                  # Componentes genéricos (Button, Card, Seo)
│   ├── features/
│   │   └── landing/             # Sitio público
│   │       ├── components/      # Presentacionales (SiteHeader, ActivitySection, ...)
│   │       ├── containers/      # Páginas y layout (PublicLayout, LandingPageContainer, ...)
│   │       ├── hooks/           # Custom hooks (colores por sección, movimiento al scroll)
│   │       └── model/           # Datos y tipos de la feature
│   ├── App.tsx                  # Componente raíz y rutas
│   └── main.tsx                 # Punto de entrada
├── index.html                   # HTML base con metadatos SEO
└── tsconfig*.json               # Configuración de TypeScript
```

### Rutas

Definidas en `src/App.tsx`. Todas se dibujan dentro de `PublicLayout`, que pone el header y el footer una sola vez.

| Ruta                 | Página                        | Qué muestra                                              |
| -------------------- | ----------------------------- | -------------------------------------------------------- |
| `/`                  | `LandingPageContainer`        | Home: hero, actividades y cómo asociarse                 |
| `/actividades/:slug` | `ActivityDetailPageContainer` | Detalle de una actividad (`natacion`, `futbol`, `voley`) |
| `*`                  | `NotFoundPageContainer`       | Página 404 para cualquier otra dirección                 |

Los links a secciones de la home (por ejemplo `/#pasos`) funcionan desde cualquier página: la home busca el elemento con ese id al cargarse y baja hasta él.

Los imports usan el alias `@/` en lugar de rutas relativas: `@/shared/ui/Button.tsx` apunta a `src/shared/ui/Button.tsx`.

### Correspondencia con los conceptos de React

> La escena animada del hero (`HeroScene`, con WebGL) es un extra visual: queda fuera de los temas del trabajo práctico.

| Concepto     | Dónde se aplica                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Components   | `shared/ui/` y `features/*/components/`                                                                                                                         |
| Pages        | `features/landing/containers/`: `LandingPageContainer`, `ActivityDetailPageContainer`, `NotFoundPageContainer` (una por ruta)                                   |
| Props        | Tipadas en cada componente (`type ...Props`)                                                                                                                    |
| `map()`      | Listas renderizadas a partir de datos de `model/` (por ejemplo, la navegación en `SiteHeader`)                                                                  |
| React Router | `App.tsx` (rutas anidadas y parámetro `:slug`), `PublicLayout.tsx` (`<Outlet />`), `ActivityDetailPageContainer.tsx` (`useParams`), `SiteHeader.tsx` (`<Link>`) |

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
