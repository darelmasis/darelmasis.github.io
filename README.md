# darelmasis.github.io

Portafolio personal en forma de terminal interactiva, siempre en modo oscuro:
React 19 + Vite 8 + Tailwind CSS 4, sin dependencias de runtime más allá de React.

Escribe `help` y explora. Tab autocompleta, ↑/↓ recorre el historial, `Ctrl+L` limpia.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5174
```

## Scripts

| Comando                | Qué hace                            |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | servidor de desarrollo              |
| `npm run build`        | build de producción en `dist/`      |
| `npm run preview`      | sirve el build en local             |
| `npm test`             | tests del resaltador de sintaxis    |
| `npm run lint`         | ESLint                              |
| `npm run format`       | Prettier (escribir)                 |
| `npm run format:check` | Prettier (comprobar)                |
| `npm run og`           | regenera `public/og.png` para redes |

## Estructura

```
src/
  profile.js        única fuente de contenido: bio, proyectos, redes, snippets
  commands.js       motor de comandos (help, whoami, cat, code, sudo, ...)
  terminal.jsx      ventana, boot animado, historial y autocompletado
  line.jsx          render de cada tipo de línea de salida
  highlight.js      tokenizador JS/JSX + resaltado de línea de comandos
  chrome.jsx        semáforo y sesión cerrada
index.html          meta SEO/OG + script que fija el modo oscuro
scripts/            generador de la tarjeta og.png
```

Para cambiar el contenido basta con editar `src/profile.js`.

## Despliegue

El workflow `.github/workflows/deploy.yml` hace lint, formato, tests y build, y publica
`dist/` en GitHub Pages en cada push a `main` (o `master`).

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Haz push a la rama principal.

El sitio vive en la raíz del dominio (`https://darelmasis.github.io`), así que Vite usa
`base: '/'` por defecto.
