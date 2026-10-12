import { highlight, highlightShell } from './highlight.js'

const line = 'import { Button } from "quickit-ui"'
const tokens = highlight(line)
if (tokens.map((token) => token.text).join('') !== line) {
  throw new Error('highlight roundtrip failed')
}

const jsx = '<Button color="primary">Empezar</Button>'
const jsxTokens = highlight(jsx)
if (jsxTokens.map((token) => token.text).join('') !== jsx) {
  throw new Error('jsx roundtrip failed')
}

const kinds = Object.fromEntries(
  jsxTokens.filter((t) => t.text.trim()).map((t) => [t.text, t.kind]),
)
if (kinds.Button !== 'tag' && kinds.Button !== 'type') {
  throw new Error(`expected Button as tag/type, got ${kinds.Button}`)
}
if (kinds.color !== 'attr') throw new Error(`expected color as attr, got ${kinds.color}`)
if (!kinds['"primary"']?.includes('string') && kinds['"primary"'] !== 'string') {
  throw new Error(`expected string literal, got ${kinds['"primary"']}`)
}

const shell = highlightShell('code quickit-ui', ['code', 'help'])
if (shell[0].kind !== 'command') throw new Error(`expected command, got ${shell[0].kind}`)

console.log('ok', tokens.map((t) => `${t.kind}:${t.text}`).join('|'))
console.log('jsx', jsxTokens.map((t) => `${t.kind}:${t.text}`).join('|'))
