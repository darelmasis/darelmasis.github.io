/**
 * Genera los iconos del sitio a partir del monograma DM:
 * favicon.ico (16+32+48), favicon-16x16.png, favicon-32x32.png,
 * favicon-48x48.png y apple-touch-icon.png (180x180, sin esquinas).
 *
 * Uso: npm run icons
 */

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const MONOGRAM =
  'M94.59 23.64H59.12v94.6h35.47c13.06 0 24.89-5.3 33.45-13.86S141.89 84 141.89 70.94c0-26.12-21.17-47.3-47.3-47.3m16.73 64.02a23.58 23.58 0 0 1-16.73 6.93H82.77v-47.3h11.82c13.07 0 23.65 10.59 23.65 23.65 0 6.53-2.65 12.44-6.92 16.72m136.99-64.01v94.59h-23.65V63.4l-13.45 31.19h-20.4l-13.44-31.18v54.83h-23.65V23.65h23.65l23.64 47.29 23.65-47.29zM307.44 0v141.89h-47.3v-23.65h23.65V23.65h-23.65V0zM23.65 23.65v94.59H47.3v23.65H0V0h47.3v23.65z'

function iconSvg(size, rounded) {
  const radius = rounded ? 7 : 0
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" rx="${radius}" fill="#161616"/>
  <svg x="4" y="10.47" width="24" height="11.06" viewBox="0 0 307.44 141.89" fill="#fafafa">
    <path d="${MONOGRAM}"/>
  </svg>
</svg>`
}

const render = (svg, size) =>
  sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer()

function buildIco(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  const entries = []
  let offset = 6 + 16 * images.length

  for (const { size, png } of images) {
    const entry = Buffer.alloc(16)
    entry[0] = size >= 256 ? 0 : size
    entry[1] = size >= 256 ? 0 : size
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(png.length, 8)
    entry.writeUInt32LE(offset, 12)
    entries.push(entry)
    offset += png.length
  }

  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)])
}

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const png16 = await render(iconSvg(16, true), 16)
const png32 = await render(iconSvg(32, true), 32)
const png48 = await render(iconSvg(48, true), 48)
const touch = await render(iconSvg(180, false), 180)

writeFileSync(join(publicDir, 'favicon-16x16.png'), png16)
writeFileSync(join(publicDir, 'favicon-32x32.png'), png32)
writeFileSync(join(publicDir, 'favicon-48x48.png'), png48)
writeFileSync(join(publicDir, 'apple-touch-icon.png'), touch)
writeFileSync(
  join(publicDir, 'favicon.ico'),
  buildIco([
    { size: 16, png: png16 },
    { size: 32, png: png32 },
    { size: 48, png: png48 },
  ]),
)

console.log('iconos → public/ (favicon.ico, favicon-*.png, apple-touch-icon.png)')
