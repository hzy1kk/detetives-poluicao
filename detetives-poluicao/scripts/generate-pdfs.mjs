/**
 * Gera PDFs estilizados a partir dos HTML em docs/
 * Uso: npm run docs:pdf
 */
import puppeteer from 'puppeteer'
import { mkdir, readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const docsDir = path.join(root, 'docs')
const pdfDir = path.join(docsDir, 'pdf')

const files = (await readdir(docsDir)).filter(
  (f) => f.endsWith('.html') && f !== 'index.html',
)

await mkdir(pdfDir, { recursive: true })

console.log('Gerando PDFs em docs/pdf/ ...')

const browser = await puppeteer.launch({ headless: true })

for (const file of files) {
  const htmlPath = path.join(docsDir, file)
  const pdfName = file.replace('.html', '.pdf')
  const pdfPath = path.join(pdfDir, pdfName)

  const page = await browser.newPage()
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })
  await page.close()
  console.log('  ✓', pdfName)
}

// Índice também
const indexPage = await browser.newPage()
await indexPage.goto(`file://${path.join(docsDir, 'index.html')}`, {
  waitUntil: 'networkidle0',
  timeout: 60000,
})
await indexPage.pdf({
  path: path.join(pdfDir, '00-indice-documentacao.pdf'),
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})
await indexPage.close()

await browser.close()
console.log('\nConcluído! Arquivos em detetives-poluicao/docs/pdf/')
