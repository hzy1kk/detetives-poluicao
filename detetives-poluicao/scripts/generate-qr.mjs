/**
 * Gera QR code PNG para o jogo
 * Uso: npm run qr
 */
import QRCode from 'qrcode'
import { copyFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const url = process.env.GAME_URL || 'https://detetives-poluicao.vercel.app'

const outDir = path.join(root, 'public')
await mkdir(outDir, { recursive: true })

const pngPath = path.join(outDir, 'qr-jogo.png')
const svgPath = path.join(outDir, 'qr-jogo.svg')

await QRCode.toFile(pngPath, url, {
  width: 512,
  margin: 2,
  color: { dark: '#071f63', light: '#ffffff' },
})

const svg = await QRCode.toString(url, { type: 'svg', margin: 2 })
await writeFile(svgPath, svg)

const docsAssets = path.join(root, 'docs', 'assets')
await mkdir(docsAssets, { recursive: true })
await copyFile(pngPath, path.join(docsAssets, 'qr-jogo.png'))

console.log('QR gerado:', pngPath)
console.log('URL:', url)
