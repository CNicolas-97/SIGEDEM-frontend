# SIGEDEM Frontend

Interfaz web del **Sistema Integral de Gestión Deportiva Municipal (SIGEDEM)** para la Dirección de Deportes de Tucumán. Permite que los vecinos consulten y se inscriban en las disciplinas deportivas, y que el personal de la Dirección gestione inscripciones, sedes y cobros desde un solo lugar.

**Sitio en producción:** https://sigedem-frontend.vercel.app

> Proyecto desarrollado para la materia **Programación IV** (2do año, 2do cuatrimestre).

## Inicio rápido

Requisitos: **Node.js 20+** y **npm**.

```bash
git clone https://github.com/CNicolas-97/SIGEDEM-frontend.git
cd SIGEDEM-frontend
npm install
npm run dev
```

La app queda disponible en http://localhost:5173

## Funcionalidades

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| Landing pública | Presentación de la Dirección de Deportes y sus disciplinas | En desarrollo |
| Disciplinas | Listado de disciplinas con edades, sede y horarios | Previsto |
| Inscripciones | Alta de vecinos en una disciplina | Previsto |
| Acceso del personal | Ingreso con pantalla inicial según el rol (ventanilla, caja, portería, coordinación, dirección) | Previsto |
| Navegación | Rutas entre páginas con React Router | Previsto |

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| [React 19](https://react.dev/) | Librería de interfaz basada en componentes |
| [Vite](https://vite.dev/) | Servidor de desarrollo y build |
| [React Router](https://reactrouter.com/) | Navegación entre páginas (a incorporar) |
| ESLint | Análisis estático del código |
| Prettier | Formato de código consistente |

El backend se desarrolla en un repositorio separado con **NestJS + TypeScript**.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente el build de producción |
| `npm run lint` | Revisa el código con ESLint |

## Estructura del proyecto

```
SIGEDEM-frontend/
├── public/            # Archivos estáticos (favicon, robots.txt, sitemap.xml)
├── src/
│   ├── assets/        # Imágenes y recursos importados desde el código
│   ├── components/    # Componentes reutilizables
│   ├── pages/         # Vistas de la aplicación (una por ruta)
│   ├── App.jsx        # Componente raíz
│   └── main.jsx       # Punto de entrada
├── index.html         # HTML base con metadatos SEO
└── package.json
```

## Flujo de trabajo

| Rama | Uso |
|------|-----|
| `main` | Producción (deploy automático en Vercel) |
| `develop` | Integración del desarrollo |
| `feat/*`, `fix/*`, `docs/*` | Una rama por tarea, con Pull Request hacia `develop` |

- Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Cada Pull Request lo revisa y aprueba otro integrante del equipo antes de mergear.

## Equipo

- [CNicolas-97](https://github.com/CNicolas-97)
- [leanNunez](https://github.com/leanNunez)
- [lourdesrodriguez071102-ui](https://github.com/lourdesrodriguez071102-ui)
