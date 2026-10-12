import { profile, snippets } from './profile.js'

export const out = {
  command: (text) => ({ kind: 'command', text }),
  text: (text) => ({ kind: 'text', text }),
  muted: (text) => ({ kind: 'muted', text }),
  accent: (text) => ({ kind: 'accent', text }),
  blank: () => ({ kind: 'blank' }),
  row: (label, value) => ({ kind: 'row', label, value }),
  link: (social) => ({ kind: 'link', label: social.label, value: social.url }),
  block: (lines) => ({ kind: 'block', lines }),
  code: (lines, file) => ({ kind: 'code', lines, file }),
}

const HELP = [
  ['help', 'muestra esta lista'],
  ['whoami', 'quién soy'],
  ['about', 'qué hago y de dónde soy'],
  ['projects', 'proyectos y librerías'],
  ['stack', 'tecnologías que uso'],
  ['code <lib>', 'ejemplo de uso resaltado'],
  ['links', 'mis redes'],
  ['ls', 'archivos disponibles'],
  ['cat <archivo>', 'lee un archivo'],
  ['neofetch', 'resumen del perfil'],
  ['date', 'fecha y hora local'],
  ['echo <texto>', 'repite el texto'],
  ['clear', 'limpia la pantalla'],
]

const FILES = {
  'about.txt': () => profile.bio.map(out.text),
  'links.txt': () => profile.socials.map((social) => out.text(`${social.label}: ${social.url}`)),
  'proyectos.txt': () =>
    profile.projects.map((project) => out.text(`${project.title} — ${project.kind}`)),
  'stack.txt': () => profile.stack.map(([group, items]) => out.text(`${group}: ${items}`)),
}

const NEOFETCH_LOGO = ['+--------+', '|  >_    |', '|        |', '+--------+']

const npmCount = profile.projects.filter((project) => project.kind.includes('npm')).length

function neofetch() {
  const info = [
    `${profile.username}@${profile.host}`,
    '-'.repeat(24),
    `nombre   ${profile.name}`,
    `rol      ${profile.role}`,
    `lugar    ${profile.location}`,
    `web      ${profile.site}`,
    `npm      ${npmCount} librerías publicadas`,
    `redes    ${profile.socials.map((social) => social.id).join(', ')}`,
  ]
  const rows = Math.max(NEOFETCH_LOGO.length, info.length)
  const lines = Array.from({ length: rows }, (_, index) => {
    const logo = (NEOFETCH_LOGO[index] ?? '').padEnd(11)
    return `${logo}${info[index] ?? ''}`.trimEnd()
  })
  return out.block(lines)
}

function listProjects() {
  return profile.projects.flatMap((project) => [
    out.accent(`${project.title} — ${project.kind}`),
    out.text(project.description),
    out.row('stack', project.tech),
    ...project.links.map((link) => out.link({ label: link.label, url: link.url })),
    out.blank(),
  ])
}

function findSnippet(query) {
  const key = query.toLowerCase()
  return snippets.find(
    (project) => project.id.includes(key) || project.title.toLowerCase().includes(key),
  )
}

function showCode(arg) {
  if (!arg) {
    return {
      output: [
        out.text('Ejemplos disponibles:'),
        out.blank(),
        ...snippets.map((project) => out.row(`code ${project.id}`, project.title)),
        out.blank(),
        out.muted('Ejemplo: code quickit-ui'),
      ],
    }
  }

  const project = findSnippet(arg)
  if (!project) {
    return {
      output: [
        out.text(`code: no tengo un ejemplo de "${arg}"`),
        out.muted(`Disponibles: ${snippets.map((item) => item.id).join(', ')}`),
      ],
    }
  }

  return {
    output: [out.code(project.snippet.lines, project.snippet.file)],
  }
}

function readFile(file) {
  const name = file.replace(/^\.\//, '').toLowerCase()
  const reader = FILES[name]
  if (reader) return reader()
  return [out.text(`cat: ${file}: no existe ese archivo`)]
}

const handlers = {
  help: () => ({
    output: [
      out.text('Comandos disponibles:'),
      out.blank(),
      ...HELP.map(([command, description]) => out.row(command, description)),
      out.blank(),
      out.muted('Tab autocompleta. ↑/↓ recorre el historial. Ctrl+L limpia.'),
    ],
  }),
  whoami: () => ({
    output: [
      out.accent(profile.name),
      out.muted(profile.role),
      out.row('ubicación', profile.location),
      out.row('disponible', profile.hireable ? 'sí, en GitHub' : 'no'),
    ],
  }),
  about: () => ({
    output: [
      out.accent(`"${profile.tagline}"`),
      out.blank(),
      ...profile.bio.map(out.text),
      out.blank(),
      out.muted(`Ubicación: ${profile.location}`),
    ],
  }),
  projects: () => ({
    output: [out.text(`${profile.projects.length} proyectos:`), out.blank(), ...listProjects()],
  }),
  stack: () => ({
    output: [
      out.text('Stack:'),
      out.blank(),
      ...profile.stack.map(([group, items]) => out.row(group, items)),
      out.blank(),
      out.muted('Esta página: React 19 + Vite 8 + Tailwind CSS 4.'),
    ],
  }),
  code: showCode,
  links: () => ({
    output: [
      out.text('Puedes encontrarme aquí:'),
      out.blank(),
      ...profile.socials.map(out.link),
      out.blank(),
      out.muted('Los enlaces del pie también son clicables.'),
    ],
  }),
  ls: () => ({
    output: [out.text(Object.keys(FILES).join('   '))],
  }),
  cat: (arg) =>
    arg
      ? { output: readFile(arg) }
      : { output: [out.muted(`uso: cat <archivo>  ·  ${Object.keys(FILES).join(', ')}`)] },
  neofetch: () => ({ output: [neofetch()] }),
  date: () => ({
    output: [
      out.text(
        new Date().toLocaleString('es-ES', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      ),
    ],
  }),
  echo: (arg) => ({ output: [out.text(arg ?? '')] }),
  pwd: () => ({ output: [out.text(`/${profile.username}`)] }),
  sudo: () => ({ output: [out.text('sudo: no tienes permisos para ser yo')] }),
  clear: () => ({ output: [], clear: true }),
  exit: () => ({ output: [], close: true }),
}

handlers.proyectos = handlers.projects
handlers.redes = handlers.links
handlers.social = handlers.links
handlers.quit = handlers.exit

export const COMMANDS = [
  ...new Set([...HELP.map(([name]) => name.split(' ')[0]), ...Object.keys(handlers)]),
].sort()

export function runCommand(input) {
  const trimmed = input.trim()
  if (!trimmed) return { output: [] }

  const [name, ...rest] = trimmed.split(/\s+/)
  const handler = handlers[name.toLowerCase()]
  if (!handler) {
    return {
      output: [
        out.text(`command not found: ${name}`),
        out.muted('Escribe "help" para ver los comandos disponibles.'),
      ],
    }
  }
  return handler(rest.join(' '))
}
