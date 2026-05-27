#!/usr/bin/env node
/**
 * Renders the built portfolio as an A4 PDF using Puppeteer.
 *
 * Prerequisites: `npm run build` (or `npm run pdf` which does both).
 * Output:        dist/julia-lamprecht-cv.pdf
 *
 * Usage:
 *   npm run pdf        – build + generate
 *   npm run pdf:only   – generate from existing dist/
 */

import { spawn } from 'child_process'
import { createConnection } from 'net'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import puppeteer from 'puppeteer'
import QRCode from 'qrcode'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir   = resolve(__dirname, '..')
const distDir   = resolve(rootDir, 'dist')
const PORT      = 4174

const LOCALES = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
]

// ── Pre-flight check ────────────────────────────────────────────────────────

if (!existsSync(resolve(distDir, 'index.html'))) {
  console.error('✗  dist/index.html not found — run `npm run build` first.')
  process.exit(1)
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Poll until the TCP port accepts connections (or time out). */
function waitForPort(port, timeoutMs = 20_000) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs
    function attempt() {
      const socket = createConnection({ port, host: 'localhost' })
      socket.once('connect', () => { socket.destroy(); resolve() })
      socket.once('error',   () => {
        socket.destroy()
        if (Date.now() >= deadline) {
          reject(new Error(`Timed out waiting for port ${port}`))
        } else {
          setTimeout(attempt, 300)
        }
      })
    }
    attempt()
  })
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // Start `vite preview` to serve the dist/ folder over HTTP.
  // Using a dedicated port (4174) to avoid clashing with `vite dev` (5173)
  // or the default preview port (4173).
  const server = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', 'localhost'],
    { cwd: rootDir, stdio: ['ignore', 'pipe', 'pipe'] },
  )

  // Surface any vite errors immediately.
  server.stderr.on('data', d => process.stderr.write(d))

  let browser
  try {
    process.stdout.write('⏳ Starting preview server … ')
    await waitForPort(PORT)
    console.log('ready.')

    browser = await puppeteer.launch({
      // --no-sandbox is required on Linux CI (GitHub Actions, Docker, etc.)
      // It is safe for a locally-spawned, trusted server.
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    // Generate the QR code once — same URL for both language PDFs.
    // SVG keeps it sharp at any print resolution.
    const qrSvg = await QRCode.toString('https://julia-lamprecht.com/', {
      type:   'svg',
      margin: 1,
      color:  { dark: '#1a1a1a', light: '#ffffff' },
    })

    for (const { code, label } of LOCALES) {
      const page = await browser.newPage()

      // Viewport wide enough that nothing reflows to a mobile layout.
      await page.setViewport({ width: 1200, height: 900 })

      // Seed localStorage *before* the page scripts run so vue-i18n picks up
      // the correct locale on first initialisation.
      await page.evaluateOnNewDocument((locale) => {
        localStorage.setItem('locale', locale)
      }, code)

      process.stdout.write(`⏳ [${label}] Loading page … `)
      await page.goto(`http://localhost:${PORT}`, {
        waitUntil: 'networkidle2',
        timeout:   30_000,
      })

      // Wait for web fonts (Playfair Display, Inter) to finish loading.
      await page.evaluateHandle('document.fonts.ready')
      console.log('done.')

      // Inject QR code block at the bottom of <main>.
      // Done before emulating print so layout is stable when the PDF renders.
      await page.evaluate((svg) => {
        const style = document.createElement('style')
        style.textContent = `
          .pdf-qr {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 32px 0 8px;
            break-before: avoid;
          }
          .pdf-qr svg {
            width: 88px;
            height: 88px;
            display: block;
          }
          .pdf-qr-label {
            font-family: 'Inter', sans-serif;
            font-size: 0.6875rem;
            letter-spacing: 0.08em;
            color: #888888;
          }
        `
        document.head.appendChild(style)

        const block = document.createElement('div')
        block.className = 'pdf-qr'
        block.innerHTML = svg + '<span class="pdf-qr-label">julia-lamprecht.com</span>'
        document.querySelector('main').appendChild(block)
      }, qrSvg)

      // Switch to print media so all @media print rules take effect.
      await page.emulateMediaType('print')

      // Brief settle time for any CSS transitions triggered by the media change.
      await new Promise(r => setTimeout(r, 400))

      const outFile = resolve(distDir, `julia-lamprecht-cv-${code}.pdf`)

      process.stdout.write(`⏳ [${label}] Rendering PDF … `)
      await page.pdf({
        path:            outFile,
        format:          'A4',
        printBackground: true,   // preserve background colours (the purple)
        // Margins are defined via @page in style.css; set to 0 here to avoid
        // Puppeteer adding its own whitespace on top of the CSS margins.
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      })
      console.log('done.')
      console.log(`   ✅  dist/julia-lamprecht-cv-${code}.pdf`)

      await page.close()
    }

    console.log('')
  } finally {
    await browser?.close()
    server.kill()
  }
}

main().catch(err => {
  console.error('\n✗ ', err.message)
  process.exit(1)
})
