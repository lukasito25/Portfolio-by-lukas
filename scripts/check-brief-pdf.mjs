/**
 * What a reader actually sees in the brief PDF.
 *
 * `check-pdf-pagination` covers the CV and letter designs only, and its
 * heading regex matches CV section labels — so it would not have caught the
 * brief's stranded "02 How my experience maps to the work" even if it had run
 * over the file. This covers the brief, and the two failures it shipped with:
 *
 *   - two runs drawn on top of one another. A `flex: 1` left on the
 *     requirement after the verdict badge was removed collapsed its height to
 *     nothing, and every proof paragraph was printed over its own heading.
 *     Nine of them, on page one, in a document meant to be forwarded.
 *   - a section heading alone at the foot of a page.
 *
 * Both have negative controls below, because a check that has stopped
 * checking passes forever.
 *
 * Run: node scripts/check-brief-pdf.mjs            (needs the dev server)
 */

import { chromium } from 'playwright'

const BASE = process.env.BRIEF_PDF_BASE ?? 'http://localhost:3000'
const SLUGS = (process.env.BRIEF_PDF_SLUGS ?? 'fifa,on,kura').split(',')
const LOCALES = ['en', 'it', 'de']

/** Adjacent kerned runs are not an overlap: "165" sits beside "M+". */
const MEANINGFUL = 0.3

function findOverlaps(pages) {
  const problems = []
  for (const { num, items } of pages) {
    for (let a = 0; a < items.length; a++) {
      for (let b = a + 1; b < items.length; b++) {
        const A = items[a]
        const B = items[b]
        if (Math.abs(A.y - B.y) >= Math.min(A.h, B.h) * 0.6) continue
        const shared = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x)
        if (shared > Math.min(A.w, B.w) * MEANINGFUL) {
          problems.push(
            `page ${num}: "${A.s.slice(0, 40)}" is drawn over "${B.s.slice(0, 40)}"`
          )
        }
      }
    }
  }
  return problems
}

function findStranded(pages) {
  const problems = []
  for (let i = 0; i < pages.length - 1; i++) {
    const text = pages[i].items
      .map(t => t.s)
      .join(' ')
      .replace(/https?:\S+|localhost:\d+\S*|\S+\.vercel\.app\S*/g, '')
      .trim()
    if (/(?:^|\s)0\d\s+[A-Z][^.]{4,70}$/.test(text)) {
      problems.push(
        `page ${pages[i].num} ends with a section heading: "…${text.split(' ').slice(-8).join(' ')}"`
      )
    }
  }
  return problems
}

const browser = await chromium.launch()
const page = await (await browser.newContext()).newPage()
await page.goto('about:blank')
await page.addScriptTag({
  url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
})

/**
 * Fetched in Node and handed to the page as bytes.
 *
 * `about:blank` has no origin, so a fetch from inside it is blocked and every
 * read fails with a bare "Failed to fetch" that looks like the PDF is broken.
 */
async function readPdf(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const b64 = Buffer.from(await response.arrayBuffer()).toString('base64')
  return page.evaluate(async data => {
    const lib = window.pdfjsLib
    lib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    const raw = atob(data)
    const bytes = new Uint8Array(raw.length)
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
    const doc = await lib.getDocument({ data: bytes }).promise
    const out = []
    for (let n = 1; n <= doc.numPages; n++) {
      const content = await (await doc.getPage(n)).getTextContent()
      out.push({
        num: n,
        items: content.items
          .filter(i => i.str.trim())
          .map(i => ({
            s: i.str.trim(),
            x: i.transform[4],
            y: i.transform[5],
            w: i.width,
            h: i.height || 9,
          })),
      })
    }
    return out
  }, b64)
}

let failed = false

// Negative controls, before anything real.
const overlapControl = findOverlaps([
  {
    num: 1,
    items: [
      { s: 'Heading', x: 70, y: 500, w: 100, h: 9 },
      { s: 'Body over it', x: 70, y: 499, w: 100, h: 8 },
    ],
  },
])
const strandedControl = findStranded([
  { num: 1, items: [{ s: 'text 02 How my experience maps' }] },
  { num: 2, items: [{ s: 'A' }] },
])
if (!overlapControl.length || !strandedControl.length) {
  console.error(
    '✗ a negative control did not fire — the checks are not checking'
  )
  process.exit(1)
}

for (const slug of SLUGS) {
  for (const locale of LOCALES) {
    const url = `${BASE}/api/brief/${slug}/pdf?locale=${locale}`
    let pages
    try {
      pages = await readPdf(url)
    } catch (error) {
      console.error(`✗ ${slug}/${locale}: could not read — ${error.message}`)
      failed = true
      continue
    }
    const problems = [...findOverlaps(pages), ...findStranded(pages)]
    if (problems.length) {
      failed = true
      console.error(`✗ ${slug}/${locale} (${pages.length}pp)`)
      problems.forEach(p => console.error(`    ${p}`))
    } else {
      console.log(`  ✓ ${slug}/${locale} — ${pages.length} pages`)
    }
  }
}

await browser.close()
console.log(
  failed ? '\nbrief PDF checks FAILED' : '\nall brief PDF checks passed'
)
process.exit(failed ? 1 : 0)
