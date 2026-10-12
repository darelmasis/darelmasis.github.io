/**
 * Resaltado de JS/JSX y de la línea de comando.
 * Unir `token.text` reconstruye el original, carácter por carácter.
 */

const KEYWORDS = new Set([
  'await',
  'async',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'from',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'let',
  'new',
  'of',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
])

const LITERALS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity'])
const BUILTINS = new Set([
  'Array',
  'Date',
  'JSON',
  'Math',
  'Number',
  'Object',
  'Promise',
  'console',
  'document',
  'window',
])

const isDigit = (ch) => ch >= '0' && ch <= '9'
const isIdentStart = (ch) => /[A-Za-z_$@]/.test(ch)
const isIdentPart = (ch) => /[\w$]/.test(ch)

function lastMeaningful(tokens) {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    if (tokens[index].kind !== 'plain') return tokens[index]
  }
  return null
}

function peekNonWs(source, start) {
  let index = start
  while (index < source.length && (source[index] === ' ' || source[index] === '\t')) {
    index += 1
  }
  return source[index] ?? ''
}

function readQuoted(source, start) {
  const quote = source[start]
  let index = start + 1
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2
      continue
    }
    if (source[index] === quote) return { text: source.slice(start, index + 1), next: index + 1 }
    index += 1
  }
  return { text: source.slice(start), next: source.length }
}

function readNumber(source, start) {
  let index = start
  if (source[index] === '0' && /[xXbBoO]/.test(source[index + 1] ?? '')) {
    index += 2
    while (index < source.length && /[\da-fA-F_]/.test(source[index])) index += 1
    return { text: source.slice(start, index), next: index }
  }
  while (index < source.length && /[\d_]/.test(source[index])) index += 1
  if (source[index] === '.') {
    index += 1
    while (index < source.length && /[\d_]/.test(source[index])) index += 1
  }
  if (/[eE]/.test(source[index] ?? '')) {
    index += 1
    if (/[+-]/.test(source[index] ?? '')) index += 1
    while (index < source.length && /[\d_]/.test(source[index])) index += 1
  }
  return { text: source.slice(start, index), next: index }
}

function classifyIdent(text, source, end, tokens) {
  if (KEYWORDS.has(text)) return 'keyword'
  if (LITERALS.has(text)) return 'literal'
  if (BUILTINS.has(text)) return 'type'

  const prev = lastMeaningful(tokens)
  const prevText = prev?.text ?? ''
  const next = peekNonWs(source, end)
  const rest = source.slice(end).trimStart()

  if (prevText.endsWith('<') || prevText === '</' || prevText.endsWith('</')) return 'tag'
  if (rest.startsWith('</')) return 'plain'
  if (next === '(') return 'function'
  if (prevText === '.') return 'property'
  if (
    next === '=' &&
    (prev?.kind === 'tag' ||
      prev?.kind === 'attr' ||
      prev?.kind === 'string' ||
      (prev?.kind === 'punct' && prevText.endsWith('}')))
  ) {
    return 'attr'
  }
  if (/^[A-Z]/.test(text)) return 'type'
  return 'plain'
}

function push(tokens, text, kind) {
  if (!text) return
  const prev = tokens[tokens.length - 1]
  if (prev && prev.kind === kind) {
    prev.text += text
    return
  }
  tokens.push({ text, kind })
}

function tokenize(source) {
  const tokens = []
  let index = 0
  const length = source.length

  const readTemplate = (start) => {
    push(tokens, '`', 'string')
    let cursor = start + 1
    let buffer = ''

    const flush = () => {
      push(tokens, buffer, 'string')
      buffer = ''
    }

    while (cursor < length) {
      const ch = source[cursor]
      if (ch === '\\') {
        buffer += source.slice(cursor, cursor + 2)
        cursor += 2
        continue
      }
      if (ch === '`') {
        flush()
        push(tokens, '`', 'string')
        return cursor + 1
      }
      if (ch === '$' && source[cursor + 1] === '{') {
        flush()
        push(tokens, '${', 'punct')
        cursor += 2
        let depth = 1
        const innerStart = cursor
        while (cursor < length && depth > 0) {
          if (source[cursor] === '{') depth += 1
          else if (source[cursor] === '}') depth -= 1
          if (depth > 0) cursor += 1
        }
        tokenizeChunk(source.slice(innerStart, cursor), tokens)
        if (source[cursor] === '}') {
          push(tokens, '}', 'punct')
          cursor += 1
        }
        continue
      }
      buffer += ch
      cursor += 1
    }

    flush()
    return cursor
  }

  while (index < length) {
    const ch = source[index]

    if (ch === ' ' || ch === '\t') {
      let end = index + 1
      while (end < length && (source[end] === ' ' || source[end] === '\t')) end += 1
      push(tokens, source.slice(index, end), 'plain')
      index = end
      continue
    }

    if (ch === '/' && source[index + 1] === '/') {
      push(tokens, source.slice(index), 'comment')
      break
    }

    if (ch === '/' && source[index + 1] === '*') {
      const close = source.indexOf('*/', index + 2)
      const end = close === -1 ? length : close + 2
      push(tokens, source.slice(index, end), 'comment')
      index = end
      continue
    }

    if (ch === '"' || ch === "'") {
      const quoted = readQuoted(source, index)
      push(tokens, quoted.text, 'string')
      index = quoted.next
      continue
    }

    if (ch === '`') {
      index = readTemplate(index)
      continue
    }

    if (isDigit(ch) || (ch === '.' && isDigit(source[index + 1] ?? ''))) {
      const number = readNumber(source, index)
      push(tokens, number.text, 'number')
      index = number.next
      continue
    }

    if (isIdentStart(ch)) {
      let end = index + 1
      while (end < length && isIdentPart(source[end])) end += 1
      const text = source.slice(index, end)
      push(tokens, text, classifyIdent(text, source, end, tokens))
      index = end
      continue
    }

    if (ch === '<' && source[index + 1] === '/') {
      push(tokens, '</', 'punct')
      index += 2
      continue
    }
    if (ch === '/' && source[index + 1] === '>') {
      push(tokens, '/>', 'punct')
      index += 2
      continue
    }
    if (ch === '=' && source[index + 1] === '>') {
      push(tokens, '=>', 'punct')
      index += 2
      continue
    }
    if (ch === '?' && source[index + 1] === '.') {
      push(tokens, '?.', 'punct')
      index += 2
      continue
    }

    push(tokens, ch, 'punct')
    index += 1
  }

  return tokens
}

function tokenizeChunk(source, into) {
  for (const token of tokenize(source)) push(into, token.text, token.kind)
}

export function highlight(line) {
  return tokenize(line)
}

const SHELL = /(\s+)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(--?[\w-]+)|(\S+)/g

export function highlightShell(line, commands = []) {
  const known = new Set(commands)
  const tokens = []
  let firstWord = true

  for (const match of line.matchAll(SHELL)) {
    const [, ws, str, flag, word] = match
    if (ws) {
      tokens.push({ text: ws, kind: 'plain' })
      continue
    }
    if (str) {
      tokens.push({ text: str, kind: 'string' })
      firstWord = false
      continue
    }
    if (flag) {
      tokens.push({ text: flag, kind: 'attr' })
      firstWord = false
      continue
    }
    if (firstWord && known.has(word.toLowerCase())) {
      tokens.push({ text: word, kind: 'command' })
    } else {
      tokens.push({ text: word, kind: 'plain' })
    }
    firstWord = false
  }

  return tokens
}
