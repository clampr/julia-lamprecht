#!/usr/bin/env node
/**
 * Renders letter.md (or a custom --file=<path>) as an A4 PDF.
 *
 * The letter can contain YAML frontmatter for structured metadata:
 *
 *   ---
 *   date:      27. Mai 2026
 *   recipient: |
 *     Musterunternehmen GmbH
 *     z. Hd. Frau Muster
 *     Musterstraße 1
 *     12345 Musterstadt
 *   subject:   Bewerbung als Psychologin
 *   ---
 *
 * The body is standard Markdown (headings, bold, italic, lists, …).
 * The generated PDF uses the same purple header and typography as the CV PDFs.
 *
 * Usage:
 *   npm run letter              – generate from letter.md → dist/
 *   npm run letter -- --file=applications/company-x.md
 *   npm run letter -- --out=dist/my-letter.pdf
 */

import { readFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import puppeteer from 'puppeteer'
import { marked } from 'marked'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir   = resolve(__dirname, '..')
const distDir   = resolve(rootDir, 'dist')
const PORT      = 4175

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [key, ...rest] = a.slice(2).split('=')
      return [key, rest.join('=') || true]
    })
)

const letterFile = args.file
  ? resolve(process.cwd(), args.file)
  : resolve(rootDir, 'letter.md')

if (!existsSync(letterFile)) {
  console.error(`✗  ${letterFile} not found.`)
  process.exit(1)
}

// Derive output path from --out or from the letter filename.
const stem    = basename(letterFile, '.md')
const outFile = args.out
  ? resolve(process.cwd(), args.out)
  : resolve(distDir, `julia-lamprecht-${stem}.pdf`)

// ── Frontmatter parser ────────────────────────────────────────────────────────
// Supports scalar values and block scalars (key: |).

function parseFrontmatter(src) {
  const FM_RE = /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n([\s\S]*)$/
  const match = src.match(FM_RE)
  if (!match) return { meta: {}, body: src }

  const meta        = {}
  let currentKey    = null
  let isBlockScalar = false

  for (const line of match[1].split(/\r?\n/)) {
    // Block scalar continuation: indented by at least 2 spaces.
    if (isBlockScalar && /^  /.test(line)) {
      meta[currentKey] = meta[currentKey]
        ? meta[currentKey] + '\n' + line.trim()
        : line.trim()
      continue
    }

    // Reset block scalar state on any non-indented line.
    isBlockScalar = false

    const kv = line.match(/^([A-Za-z_]\w*):\s*(.*)$/)
    if (!kv) continue

    const [, key, val] = kv
    if (val === '|') {
      meta[key]     = ''
      currentKey    = key
      isBlockScalar = true
    } else {
      meta[key] = val.trim()
    }
  }

  return { meta, body: match[2] }
}

// ── HTML builder ──────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildHtml(meta, bodyHtml) {
  const recipientHtml = meta.recipient
    ? meta.recipient
        .split('\n')
        .map(l => `<p>${escapeHtml(l)}</p>`)
        .join('\n        ')
    : ''

  const dateHtml    = meta.date    ? `<div class="letter-date">${escapeHtml(meta.date)}</div>` : ''
  const subjectHtml = meta.subject
    ? `<div class="letter-subject">${escapeHtml(meta.subject)}</div>`
    : ''

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
  <style>
    /* ── Reset ──────────────────────────────────────────────────────────────── */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ── A4 page: same margins as the CV so the header sits inset with white
          paper around it, matching the CV's printed appearance. ─────────── */
    @page {
      size: A4;
      margin: 14mm 16mm 12mm 16mm;
    }

    /* ── Base typography – matches the CV ───────────────────────────────────── */
    html { font-size: 15px; }

    body {
      font-family: 'Inter', sans-serif;
      font-weight: 400;
      color: #1a1a1a;
      background: #ffffff;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Purple header – identical to the CV print header ───────────────────── */
    .letter-header {
      background: #5c3a8c;
      color: #ffffff;
      /* Horizontal padding matches the CV hero's print padding (24px).
         The @page margins already provide 16mm of outer inset, so this
         is purely the inner breathing room within the purple block. */
      padding: 44px 24px 36px;
      /* Force background to print (required by most browsers / Puppeteer). */
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .letter-header h1 {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 2.2rem;
      letter-spacing: 0.04em;
      margin-bottom: 10px;
    }

    .letter-header .subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 300;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.8);
    }

    /* ── Letter layout ──────────────────────────────────────────────────────── */
    .letter-body {
      /* @page margins handle the outer horizontal inset.
         Just add top/bottom rhythm matching CV section spacing. */
      padding: 28px 0 28px;
    }

    /* Recipient (left) + Date (right) */
    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
    }

    .recipient p {
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .letter-date {
      font-size: 0.95rem;
      color: #555555;
      white-space: nowrap;
      padding-top: 2px;
      text-align: right;
    }

    /* Subject line with the same purple underline accent used in section headings */
    .letter-subject {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      font-size: 1.15rem;
      margin-bottom: 20px;
      padding-bottom: 10px;
      position: relative;
    }

    .letter-subject::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 48px;
      height: 2px;
      background: #5c3a8c;
    }

    /* ── Markdown content ────────────────────────────────────────────────────── */
    .letter-content p {
      margin-bottom: 1em;
      font-size: 0.95rem;
    }

    .letter-content p:last-child {
      margin-bottom: 0;
    }

    .letter-content h1,
    .letter-content h2,
    .letter-content h3,
    .letter-content h4 {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      margin: 1.4em 0 0.5em;
      line-height: 1.2;
    }

    .letter-content h1 { font-size: 1.5rem; }
    .letter-content h2 { font-size: 1.25rem; }
    .letter-content h3 { font-size: 1.1rem; }
    .letter-content h4 { font-size: 1rem; }

    .letter-content strong { font-weight: 600; }
    .letter-content em     { font-style: italic; }

    .letter-content ul,
    .letter-content ol {
      margin: 0.5em 0 1em 1.6em;
    }

    .letter-content li {
      font-size: 0.95rem;
      margin-bottom: 0.3em;
    }

    .letter-content ul { list-style: disc; }
    .letter-content ol { list-style: decimal; }

    .letter-content a {
      color: #5c3a8c;
      text-decoration: underline;
    }

    .letter-content blockquote {
      border-left: 3px solid #5c3a8c;
      padding-left: 1em;
      color: #555555;
      margin: 1em 0;
      font-style: italic;
    }

    .letter-content hr {
      border: none;
      border-top: 1px solid #e0e0e0;
      margin: 1.5em 0;
    }

    .letter-content code {
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      background: #f5f5f5;
      padding: 0.1em 0.3em;
      border-radius: 2px;
    }

    .letter-content pre code {
      display: block;
      padding: 0.75em 1em;
      overflow: auto;
    }

    /* Avoid page breaks inside paragraphs / list items */
    .letter-content p,
    .letter-content li {
      break-inside: avoid;
    }
  </style>
</head>
<body>

  <!-- ── Purple header ──────────────────────────────────────────────────────── -->
  <div class="letter-header">
    <h1>Julia Lamprecht</h1>
    <p class="subtitle">M.Sc. Psychologie · Autismustherapeutin</p>
  </div>

  <!-- ── Letter content ─────────────────────────────────────────────────────── -->
  <div class="letter-body">

    ${(recipientHtml || dateHtml) ? `
    <div class="meta-row">
      <div class="recipient">${recipientHtml}</div>
      ${dateHtml}
    </div>
    ` : ''}

    ${subjectHtml}

    <div class="letter-content">
      ${bodyHtml}
    </div>

  </div>

</body>
</html>`
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Ensure the output directory exists.
  const outDir = resolve(outFile, '..')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const src             = readFileSync(letterFile, 'utf8')
  const { meta, body }  = parseFrontmatter(src)
  const bodyHtml        = marked.parse(body, { gfm: true, breaks: false })
  const html            = buildHtml(meta, bodyHtml)

  // Spin up a minimal HTTP server so Puppeteer can load Google Fonts over HTTPS.
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(html)
  })
  await new Promise(resolve => server.listen(PORT, 'localhost', resolve))

  let browser
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Wide viewport so nothing reflows to a mobile layout.
    await page.setViewport({ width: 1200, height: 900 })

    process.stdout.write('⏳ Loading letter … ')
    await page.goto(`http://localhost:${PORT}`, {
      waitUntil: 'networkidle2',
      timeout:   30_000,
    })

    // Wait for web fonts (Playfair Display, Inter) to finish loading.
    await page.evaluateHandle('document.fonts.ready')
    console.log('done.')

    // Apply print media type so all @media print rules take effect.
    await page.emulateMediaType('print')

    // Brief settle for any CSS transitions triggered by the media change.
    await new Promise(r => setTimeout(r, 400))

    process.stdout.write('⏳ Rendering PDF … ')
    await page.pdf({
      path:            outFile,
      format:          'A4',
      printBackground: true,   // preserves the purple header background
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    })
    console.log('done.')
    console.log(`   ✅  ${outFile}`)

    await page.close()
  } finally {
    await browser?.close()
    server.close()
  }
}

main().catch(err => {
  console.error('\n✗ ', err.message)
  process.exit(1)
})
