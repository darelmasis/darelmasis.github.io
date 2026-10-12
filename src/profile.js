/**
 * Única fuente de contenido. Bio, proyectos y redes salen de aquí.
 */

export const profile = {
  name: 'Darel Masís',
  username: 'darelmasis',
  host: 'github',
  role: 'Desarrollador y diseñador web',
  location: 'Granada, Nicaragua',
  site: 'darelmasis.github.io',
  tagline: 'menos es más',
  hireable: true,
  bio: [
    'Darel Masís. Desarrollador web desde Granada, Nicaragua.',
    'Publico librerías de React en npm y construyo herramientas de negocio.',
    'menos es más',
  ],
  stack: [
    ['lenguajes', 'JavaScript, TypeScript'],
    ['interfaces', 'React, Astro, Vite, Tailwind CSS'],
    ['utilidades', 'Floating UI, perfect-freehand'],
    ['datos', 'MongoDB Atlas, Power BI'],
    ['despliegue', 'Vercel, GitHub Pages, Render'],
  ],
  projects: [
    {
      id: 'quickit-ui',
      title: 'quickit-ui',
      kind: 'librería npm · MIT · v1.8.1',
      description:
        'Librería de componentes React enfocada en reuso, consistencia visual y una base escalable. React 18.2+/19 con Tailwind CSS 4.',
      tech: 'Vite, React, JavaScript, Tailwind CSS, Floating UI',
      links: [
        { label: 'npm', url: 'https://www.npmjs.com/package/quickit-ui' },
        { label: 'docs', url: 'https://quickit-ui.vercel.app' },
        { label: 'github', url: 'https://github.com/darelmasis/quickit-ui' },
      ],
      snippet: {
        file: 'App.jsx · quickit-ui',
        lines: [
          'import { Button, Input, Label, QuickitThemeProvider } from "quickit-ui"',
          '',
          'export default function App() {',
          '  return (',
          '    <QuickitThemeProvider defaultTheme="system">',
          '      <Label>Correo</Label>',
          '      <Input type="email" placeholder="equipo@quickit.dev" />',
          '      <Button color="primary">Empezar</Button>',
          '    </QuickitThemeProvider>',
          '  )',
          '}',
        ],
      },
    },
    {
      id: 'signpad',
      title: '@darelmasis/signpad',
      kind: 'librería npm · MIT · v1.1.1',
      description:
        'Librería React headless para captura de firmas digitales con trazos realistas usando perfect-freehand. Sin UI predefinida.',
      tech: 'React, perfect-freehand, Canvas',
      links: [
        { label: 'npm', url: 'https://www.npmjs.com/package/@darelmasis/signpad' },
        { label: 'github', url: 'https://github.com/darelmasis/signpad' },
      ],
      snippet: {
        file: 'App.jsx · @darelmasis/signpad',
        lines: [
          "import { useRef } from 'react'",
          "import { SignPad } from '@darelmasis/signpad'",
          '',
          'function App() {',
          '  const signPadRef = useRef(null)',
          '',
          '  const handleSave = async () => {',
          "    const dataUrl = await signPadRef.current?.save('png')",
          '    console.log(`Firma guardada: ${dataUrl}`)',
          '  }',
          '',
          '  return (',
          '    <div>',
          '      <SignPad ref={signPadRef} height={300} />',
          '      <button onClick={handleSave}>Guardar</button>',
          '    </div>',
          '  )',
          '}',
        ],
      },
    },
    {
      id: 'ava',
      title: 'AVA',
      kind: 'herramienta de negocio',
      description:
        'Herramienta para la realización de conciliaciones de ventas y efectivo. Incluye panel de control, auditoría y observabilidad.',
      tech: 'JavaScript, websockets',
      links: [{ label: 'panel', url: 'https://ava-helper.vercel.app' }],
    },
    {
      id: 'calma-calma',
      title: 'Calma Calma Nails & Spa',
      kind: 'web para negocio · privado',
      description:
        'Salón de uñas y spa. Una web para un espacio de renovación y tranquilidad en medio de lo cotidiano.',
      tech: 'Sitio web para el negocio',
      links: [],
    },
  ],
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      handle: 'darelmasis',
      url: 'https://github.com/darelmasis',
    },
    {
      id: 'npm',
      label: 'npm',
      handle: 'darelmasis',
      url: 'https://npmjs.com/~darelmasis',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'darelmasis',
      url: 'https://linkedin.com/in/darelmasis',
    },
  ],
}

export const promptUser = `${profile.username}@${profile.host}`

export const snippets = profile.projects.filter((project) => project.snippet)
