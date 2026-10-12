/**
 * Genera public/og.png (1200x630) para las tarjetas de redes sociales.
 * Texto con fuente bitmap 5x7, dibujado a 2x y reductido a la mitad (antialiasing).
 *
 * Uso: npm run og
 */

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'

const WIDTH = 1200
const HEIGHT = 630
const SS = 2

const COLOR = {
  bg: '#161616',
  bar: '#1f1f1f',
  rule: '#2e2e2e',
  fg: '#fafafa',
  muted: '#a3a3a3',
  barText: '#8a8a8a',
  link: '#a5d6ff',
  accent: '#d2a8ff',
  light: { red: '#ff5f57', yellow: '#febc2e', green: '#28c840' },
}

const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  J: ['..###', '....#', '....#', '....#', '#...#', '#...#', '.###.'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  0: ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  1: ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  2: ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  3: ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
  4: ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  5: ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  6: ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  7: ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  8: ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  9: ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  '/': ['....#', '....#', '...#.', '..#..', '.#...', '#....', '#....'],
  '>': ['#....', '.#...', '..#..', '...#.', '..#..', '.#...', '#....'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  _: ['.....', '.....', '.....', '.....', '.....', '.....', '#####'],
  $: ['..#..', '.####', '#.#..', '.###.', '..#.#', '####.', '..#..'],
}

const ACCENTS = {
  Á: { base: 'A', mark: 'acute' },
  É: { base: 'E', mark: 'acute' },
  Í: { base: 'I', mark: 'acute' },
  Ó: { base: 'O', mark: 'acute' },
  Ú: { base: 'U', mark: 'acute' },
  Ü: { base: 'U', mark: 'diaeresis' },
  Ñ: { base: 'N', mark: 'tilde' },
}

const MARKS = {
  acute: ['...#.', '..#..', '.#...'],
  tilde: ['.#...', '#.#.#', '...#.'],
  diaeresis: ['.#.#.', '.....', '.....'],
}

const MARK_HEIGHT = 3
const GLYPH_HEIGHT = 7
const ADVANCE = 6

const hex = (value) => [
  Number.parseInt(value.slice(1, 3), 16),
  Number.parseInt(value.slice(3, 5), 16),
  Number.parseInt(value.slice(5, 7), 16),
]

function createCanvas() {
  return {
    width: WIDTH * SS,
    height: HEIGHT * SS,
    data: new Uint8Array(WIDTH * SS * HEIGHT * SS * 4),
  }
}

function fillRect(canvas, x, y, width, height, color) {
  const [r, g, b] = hex(color)
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const px = x + col
      const py = y + row
      if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue
      const at = (py * canvas.width + px) * 4
      canvas.data[at] = r
      canvas.data[at + 1] = g
      canvas.data[at + 2] = b
      canvas.data[at + 3] = 255
    }
  }
}

function fillCircle(canvas, cx, cy, radius, color) {
  const [r, g, b] = hex(color)
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      if (dx * dx + dy * dy > radius * radius) continue
      const px = cx + dx
      const py = cy + dy
      if (px < 0 || py < 0 || px >= canvas.width || py >= canvas.height) continue
      const at = (py * canvas.width + px) * 4
      canvas.data[at] = r
      canvas.data[at + 1] = g
      canvas.data[at + 2] = b
      canvas.data[at + 3] = 255
    }
  }
}

function drawRows(canvas, rows, x, y, scale, color) {
  rows.forEach((row, rowIndex) => {
    for (let col = 0; col < row.length; col += 1) {
      if (row[col] !== '#') continue
      fillRect(canvas, x + col * scale, y + rowIndex * scale, scale, scale, color)
    }
  })
}

function drawText(canvas, text, x, yBase, scale, color) {
  let cursor = x
  const bodyTop = yBase - GLYPH_HEIGHT * scale

  for (const char of text) {
    const accent = ACCENTS[char]
    const glyph = FONT[accent ? accent.base : char] ?? FONT[' ']

    if (accent) {
      const mark = MARKS[accent.mark]
      drawRows(canvas, mark, cursor, bodyTop - MARK_HEIGHT * scale, scale, color)
    }

    drawRows(canvas, glyph, cursor, bodyTop, scale, color)
    cursor += ADVANCE * scale
  }

  return text.length * ADVANCE * scale - scale
}

function textWidth(text, scale) {
  return text.length * ADVANCE * scale - scale
}

function compose() {
  const canvas = createCanvas()
  const s = (value) => value * SS

  fillRect(canvas, 0, 0, canvas.width, canvas.height, COLOR.bg)
  fillRect(canvas, 0, 0, canvas.width, s(80), COLOR.bar)
  fillRect(canvas, 0, s(78), canvas.width, s(2), COLOR.rule)

  fillCircle(canvas, s(46), s(40), s(14), COLOR.light.red)
  fillCircle(canvas, s(88), s(40), s(14), COLOR.light.yellow)
  fillCircle(canvas, s(130), s(40), s(14), COLOR.light.green)

  drawText(canvas, 'PORTAFOLIO TERMINAL', s(170), s(50), s(3), COLOR.barText)

  const prompt = '> ESCRIBE HELP Y PULSA ENTER'
  const promptWidth = textWidth(prompt, 3)
  const promptX = Math.round((WIDTH - promptWidth) / 2)
  drawText(canvas, prompt, s(promptX), s(225), s(3), COLOR.accent)
  fillRect(
    canvas,
    s(promptX + promptWidth + 14),
    s(225 - GLYPH_HEIGHT * 3),
    s(12),
    s(GLYPH_HEIGHT * 3),
    COLOR.muted,
  )

  const title = 'DAREL MASIS'
  drawText(canvas, title, s(Math.round((WIDTH - textWidth(title, 8)) / 2)), s(350), s(8), COLOR.fg)

  const role = 'DESARROLLADOR Y DISEÑADOR WEB'
  drawText(canvas, role, s(Math.round((WIDTH - textWidth(role, 4)) / 2)), s(430), s(4), COLOR.muted)

  const site = 'DARELMASIS.GITHUB.IO'
  drawText(canvas, site, s(Math.round((WIDTH - textWidth(site, 3)) / 2)), s(500), s(3), COLOR.link)

  return canvas
}

function downsample(canvas) {
  const out = Buffer.alloc(WIDTH * HEIGHT * 4)

  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      let r = 0
      let g = 0
      let b = 0
      let a = 0

      for (let dy = 0; dy < SS; dy += 1) {
        for (let dx = 0; dx < SS; dx += 1) {
          const at = ((y * SS + dy) * canvas.width + (x * SS + dx)) * 4
          r += canvas.data[at]
          g += canvas.data[at + 1]
          b += canvas.data[at + 2]
          a += canvas.data[at + 3]
        }
      }

      const at = (y * WIDTH + x) * 4
      const count = SS * SS
      out[at] = Math.round(r / count)
      out[at + 1] = Math.round(g / count)
      out[at + 2] = Math.round(b / count)
      out[at + 3] = Math.round(a / count)
    }
  }

  return out
}

const CRC_TABLE = new Uint32Array(256)
for (let index = 0; index < 256; index += 1) {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1
  }
  CRC_TABLE[index] = value >>> 0
}

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const head = Buffer.alloc(4)
  head.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([head, body, crc])
}

function encodePng(rgba) {
  const stride = WIDTH * 4
  const raw = Buffer.alloc((stride + 1) * HEIGHT)

  for (let y = 0; y < HEIGHT; y += 1) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(WIDTH, 0)
  ihdr.writeUInt32BE(HEIGHT, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(root, 'public', 'og.png')
writeFileSync(target, encodePng(downsample(compose())))
console.log(`og.png → ${target} (${WIDTH}x${HEIGHT})`)
