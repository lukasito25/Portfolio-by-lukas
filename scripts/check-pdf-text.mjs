/**
 * Asserts what an applicant tracking system reads out of each PDF design.
 *
 * The .docx gate (`check-doc-text.mjs`) exists because a layout regression is
 * invisible in every preview. The PDF has the same problem with one extra
 * hazard: a PDF has no columns, only a drawing order, and a parser reads the
 * text in the order it was drawn. A two-column page whose rail is drawn last
 * extracts the name in the middle of the skills list. So this checks the
 * order, not just the words.
 *
 * Three promises, one per layout plus one shared:
 *
 *   both      Every word of the source CV is present. The name is the first
 *             line. Every section heading survives as a line of its own. The
 *             email address appears exactly once — a rail that repeated per
 *             page would put it there twice.
 *   single    classic, rule, panel, field and dossier read in the single-column
 *             order: Summary → Skills → Work Experience → Education → Languages.
 *   column    Reading order is a parser's: name → Contact → Education →
 *             Skills → Languages → Summary → Work Experience. Reference
 *             material before the body, never interleaved with it.
 *
 * Reads the PDFs `preview-cv-pdf.mjs` writes; run that first. The source text
 * comes from the same `scripts/sample-cv.ts` the previews render, bundled the
 * same way and for the same reason (see the header of `preview-cv-pdf.mjs`).
 *
 * Run: node scripts/check-pdf-text.mjs [previewDir]
 */

import { build } from 'esbuild'
import { readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFParse } from 'pdf-parse'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = resolve(process.argv[2] ?? 'doc-previews')

/* ---- the source ---------------------------------------------------- */

const bundle = join(dir, '.check-entry.mjs')
await build({
  stdin: {
    contents: `export { cv } from './scripts/sample-cv'`,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  packages: 'external',
  format: 'esm',
  platform: 'node',
  outfile: bundle,
  logLevel: 'warning',
})
const { cv } = await import(bundle)
rmSync(bundle, { force: true })

/**
 * Every word the CV contains, as a parser would index it: case folded,
 * separators and trailing punctuation dropped. A label rendered as
 * "Architecture:" is the word "Architecture".
 */
const tokens = s =>
  s
    .normalize('NFC')
    .toLowerCase()
    .replace(/[•·|—–]/g, ' ')
    .split(/\s+/)
    .map(w => w.replace(/^[("'“‘]+|[)"'”’.,:;!?]+$/g, ''))
    .filter(Boolean)

const sourceWords = new Set(
  tokens(
    [
      cv.fullName,
      cv.headline,
      cv.location,
      cv.email,
      ...cv.links,
      cv.summary,
      ...cv.roles.flatMap(r => [
        r.title,
        r.company,
        r.location,
        r.period,
        ...r.bullets.flatMap(b => [b.label, b.text]),
      ]),
      ...cv.skills.flatMap(g => [g.group, ...g.items]),
      ...cv.education.flatMap(e => [e.qualification, e.institution, e.detail]),
      ...cv.certifications.flatMap(c => [c.year, c.entry]),
      ...cv.languages,
    ].join(' ')
  )
)

/* ---- the checks ---------------------------------------------------- */

const SINGLE_ORDER = [
  'SUMMARY',
  'SKILLS',
  'WORK EXPERIENCE',
  'EDUCATION',
  'LANGUAGES',
]

const DESIGNS = [
  ...['classic', 'rule', 'panel', 'field', 'dossier'].map(name => ({
    file: `CV_Lukas_Hosala_Northbound_EN_${name}.pdf`,
    name,
    order: SINGLE_ORDER,
  })),
  {
    file: 'CV_Lukas_Hosala_Northbound_EN_column.pdf',
    name: 'column',
    order: [
      'CONTACT',
      'EDUCATION',
      'SKILLS',
      'LANGUAGES',
      'SUMMARY',
      'WORK EXPERIENCE',
    ],
  },
]

async function extract(path) {
  const parser = new PDFParse({ data: readFileSync(path) })
  const { text, total } = await parser.getText()
  await parser.destroy()
  return { text: text.normalize('NFC'), pages: total }
}

/**
 * The checks as a function of the extracted text, so the same function can be
 * run against a deliberately broken text as a negative control.
 */
function failuresOf(text, design) {
  const failures = []
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)

  // The name is the first thing a parser reads. `dossier` sets it on one line
  // and `column` one word to a line, so accept the first line or the first
  // few lines joined.
  const name = cv.fullName.toUpperCase()
  const nameWords = cv.fullName.split(/\s+/).length
  const leads = [lines[0], lines.slice(0, nameWords).join(' ')].map(l =>
    (l ?? '').toUpperCase()
  )
  if (!leads.includes(name)) {
    failures.push(`first line is "${lines[0]}", not the name`)
  }

  // Headings on lines of their own — a heading glued to the text before it is
  // a heading a parser does not see.
  const positions = design.order.map(h => lines.indexOf(h))
  design.order.forEach((h, i) => {
    if (positions[i] === -1) failures.push(`heading "${h}" missing`)
  })
  const found = positions.filter(p => p !== -1)
  const sorted = [...found].sort((a, b) => a - b)
  if (found.some((p, i) => p !== sorted[i])) {
    const actual = design.order
      .map((h, i) => [h, positions[i]])
      .filter(([, p]) => p !== -1)
      .sort((a, b) => a[1] - b[1])
      .map(([h]) => h)
    failures.push(`section order is ${actual.join(' → ')}`)
  }

  // Contact once, and before the body.
  const emailCount = text.split(cv.email).length - 1
  if (emailCount !== 1) {
    failures.push(`email appears ${emailCount} times, expected once`)
  }
  const summaryAt = lines.indexOf('SUMMARY')
  const emailAt = lines.findIndex(l => l.includes(cv.email))
  if (summaryAt !== -1 && emailAt > summaryAt) {
    failures.push('contact is read after the summary')
  }

  // Nothing lost.
  const extracted = new Set(tokens(text))
  const missing = [...sourceWords].filter(w => !extracted.has(w))
  if (missing.length) {
    failures.push(
      `${missing.length} word(s) missing: ${missing.slice(0, 8).join(', ')}`
    )
  }

  return failures
}

/* ---- run ----------------------------------------------------------- */

let failed = false
console.log('')

for (const design of DESIGNS) {
  const path = join(dir, design.file)
  let extracted
  try {
    extracted = await extract(path)
  } catch (error) {
    console.log(
      `  ✗ ${design.name} — could not read ${design.file}: ${error.message}`
    )
    failed = true
    continue
  }

  const failures = failuresOf(extracted.text, design)
  if (failures.length) {
    failed = true
    console.log(
      `  ✗ ${design.name} (${extracted.pages} page${extracted.pages === 1 ? '' : 's'})`
    )
    for (const f of failures) console.log(`      ${f}`)
  } else {
    console.log(
      `  ✓ ${design.name} (${extracted.pages} page${extracted.pages === 1 ? '' : 's'}) — ${design.order.join(' → ')}`
    )
  }

  // Negative controls: the same checks must fail on a text that breaks each
  // promise, or a check that has silently stopped checking passes forever.
  // The word removed has to occur exactly once, or it survives elsewhere —
  // counted the way the check counts, case folded.
  const counts = tokens(extracted.text).reduce(
    (m, w) => m.set(w, (m.get(w) ?? 0) + 1),
    new Map()
  )
  const once = cv.summary
    .split(/\s+/)
    .find(w => w.length > 5 && counts.get(tokens(w)[0]) === 1)
  const controls = [
    [
      'rail drawn last',
      extracted.text.replace(/CONTACT[\s\S]*?(?=SUMMARY)/, '') +
        '\nCONTACT\n' +
        cv.email,
    ],
    ['contact repeated per page', extracted.text + '\n' + cv.email],
    ['a heading lost', extracted.text.replace('\nSKILLS\n', '\n')],
    ['a word lost', extracted.text.replace(once, '')],
  ]
  for (const [label, broken] of controls) {
    if (failuresOf(broken, design).length === 0) {
      failed = true
      console.log(`      negative control did not fail: ${label}`)
    }
  }
}

console.log('')
if (failed) {
  console.log('PDF text checks FAILED')
  process.exit(1)
}
console.log('all PDF text checks passed')
