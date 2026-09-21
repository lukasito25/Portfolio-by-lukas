/**
 * Asserts that page breaks in every PDF design fall where a reader would put
 * them.
 *
 * A production download once ended page one with a lone "•" and began page
 * two with its sentence. Nothing in a preview shows that: the sample CV breaks
 * in one place, and a rule that holds there says nothing about the next CV.
 * So this renders a CV three times longer than the sample, in every design,
 * at four different bullet counts — which moves the break to a different
 * place each time — and reads every page boundary.
 *
 * Three things may never happen at a boundary:
 *
 *   - a page ends with a bullet glyph and nothing after it (a split bullet)
 *   - a page ends with a section heading (a stranded heading)
 *   - a page begins with a lowercase word (a split sentence)
 *
 * Renders in-process rather than reading previews, because the whole point is
 * to render something the previews do not. Runs under plain Node for the
 * reason in `preview-cv-pdf.mjs`.
 *
 * Run: node scripts/check-pdf-pagination.mjs
 */

import { build } from 'esbuild'
import { existsSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFParse } from 'pdf-parse'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bundle = resolve(root, 'doc-previews/.pagination-entry.mjs')

await build({
  stdin: {
    contents: `
      import { renderCvPdf } from './src/lib/documents/pdf/cv'
      import { cv } from './scripts/sample-cv'
      export { renderCvPdf, cv }
    `,
    resolveDir: root,
    loader: 'tsx',
  },
  jsx: 'automatic',
  bundle: true,
  packages: 'external',
  format: 'esm',
  platform: 'node',
  outfile: bundle,
  logLevel: 'warning',
})
const { renderCvPdf, cv } = await import(bundle)
rmSync(bundle, { force: true })

const photoPath = join(root, 'templates/photo.jpg')
const photo = existsSync(photoPath)
  ? { data: readFileSync(photoPath), format: 'jpg' }
  : null

const DESIGNS = ['classic', 'rule', 'panel', 'field', 'dossier', 'column']
const HEADINGS =
  /^(SUMMARY|SKILLS|WORK EXPERIENCE|EDUCATION|LANGUAGES|CERTIFICATIONS & TRAINING|CONTACT)$/

/** The sample's roles three times over, each with `extra` bullets more. */
const longer = extra => ({
  ...cv,
  roles: [...cv.roles, ...cv.roles, ...cv.roles].map((role, i) => ({
    ...role,
    roleId: `${role.roleId}-${i}`,
    bullets: [...role.bullets, ...role.bullets.slice(0, extra)],
  })),
})

function boundaryProblems(pages) {
  const problems = []
  for (const page of pages) {
    const lines = page.text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
    const first = lines[0] ?? ''
    const last = lines[lines.length - 1] ?? ''
    if (/^•$/.test(last))
      problems.push(`page ${page.num} ends with a lone bullet`)
    if (HEADINGS.test(last))
      problems.push(`page ${page.num} ends with the heading "${last}"`)
    if (page.num > 1 && /^[a-z]/.test(first))
      problems.push(
        `page ${page.num} begins mid-sentence: "${first.slice(0, 40)}"`
      )
  }
  return problems
}

let failed = false
let renders = 0
console.log('')

for (const design of DESIGNS) {
  const found = []
  for (const extra of [0, 1, 2, 3]) {
    const buffer = await renderCvPdf(longer(extra), { variant: design, photo })
    renders++
    const parser = new PDFParse({ data: buffer })
    const { pages } = await parser.getText()
    await parser.destroy()
    for (const problem of boundaryProblems(pages)) {
      found.push(`+${extra} bullets: ${problem}`)
    }
  }
  if (found.length) {
    failed = true
    console.log(`  ✗ ${design}`)
    for (const f of found) console.log(`      ${f}`)
  } else {
    console.log(`  ✓ ${design} — clean boundaries at four break positions`)
  }
}

// Negative control: the checks must catch each shape of break, or a check
// that has stopped checking passes forever.
const controls = [
  [
    'a split bullet',
    [
      { num: 1, text: 'text\n•' },
      { num: 2, text: 'Rest.' },
    ],
  ],
  [
    'a stranded heading',
    [
      { num: 1, text: 'x\nSKILLS' },
      { num: 2, text: 'A' },
    ],
  ],
  [
    'a split sentence',
    [
      { num: 1, text: 'One' },
      { num: 2, text: 'and two' },
    ],
  ],
]
for (const [label, pages] of controls) {
  if (boundaryProblems(pages).length === 0) {
    failed = true
    console.log(`      negative control did not fail: ${label}`)
  }
}

console.log('')
if (failed) {
  console.log('PDF pagination checks FAILED')
  process.exit(1)
}
console.log(`all PDF pagination checks passed (${renders} renders)`)
