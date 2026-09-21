/**
 * Asserts what an applicant tracking system reads out of each document design.
 *
 * The designs differ in shading, borders, tab stops and — in one case — a
 * table. A regression in what that does to the text would be invisible in every
 * preview: the document would look right and parse wrong, which is the worst
 * failure this repo can ship. So the invariant is checked rather than asserted
 * in a comment.
 *
 * "The same text" means **words**, not runs. Where a run boundary falls is a
 * formatting detail — `classic` emits "{period}  |  {location}" as a single
 * run, the rail layouts split them either side of a tab stop — and a separator
 * glyph like "·" or "|" is not something an ATS indexes. Everything is
 * normalised to a token sequence before comparison: entities decoded,
 * separators dropped, whitespace collapsed.
 *
 * Three different promises are checked, because the designs make three
 * different ones:
 *
 *   rule, panel, field   Identical token sequence to classic. These changed
 *                        only how the page looks.
 *   dossier              Same words plus the stat band, same section order.
 *                        Within a role the four header fields are reordered —
 *                        title and dates on one line, company and location on
 *                        the next — which is a mainstream CV layout, not a loss.
 *   column               Same words plus the stat band, section order changed.
 *                        A parser walks table cells row-major, so the rail is
 *                        read before the main column. Reported, not hidden.
 *
 * Run: node scripts/check-doc-text.mjs [previewDir]
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import PizZip from 'pizzip'

const dir = process.argv[2] ?? 'doc-previews'

const SECTIONS = [
  'Summary',
  'Skills',
  'Work Experience',
  'Education',
  'Certifications & Training',
  'Languages',
]

const decode = s =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')

/** Everything a parser reads, in document order, from every part of the file. */
function textOf(path) {
  const zip = new PizZip(readFileSync(path))
  const parts = Object.keys(zip.files)
    .filter(n => n.endsWith('.xml') && !n.includes('_rels'))
    .sort()

  const lines = []
  for (const name of parts) {
    const xml = zip.file(name).asText()
    for (const m of xml.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)) {
      lines.push({ part: name, text: decode(m[1]).trim() })
    }
  }
  return lines
}

/** The word sequence a parser would index: run boundaries and separators gone. */
const tokens = lines =>
  lines
    .map(l => l.text)
    .join(' ')
    .replace(/[·|]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)

/** Section headings in the order they would be extracted. */
const sectionOrder = lines =>
  lines.map(l => l.text).filter(t => SECTIONS.includes(t))

const bag = list => {
  const m = new Map()
  list.forEach(t => m.set(t, (m.get(t) ?? 0) + 1))
  return m
}

/** Words classic has that `list` does not, with counts. Empty means nothing lost. */
const dropped = (list, base) => {
  const have = bag(list)
  return [...bag(base)]
    .filter(([t, n]) => (have.get(t) ?? 0) < n)
    .map(([t, n]) => `${t}×${n - (have.get(t) ?? 0)}`)
}

const fail = []
const note = m => console.log(`  ${m}`)

const cvs = readdirSync(dir).filter(
  f => f.startsWith('CV_') && f.endsWith('.docx')
)
const variantOf = f => f.replace(/^.*_EN_?/, '').replace(/\.docx$/, '')

const streams = Object.fromEntries(
  cvs.map(f => [variantOf(f), textOf(join(dir, f))])
)

if (!streams.classic) {
  console.error(
    `No classic CV in ${dir}/. Run: npx tsx scripts/preview-doc-variants.ts ${dir}`
  )
  process.exit(1)
}

const baseline = tokens(streams.classic)
const baseSections = sectionOrder(streams.classic)

/* ------------------------------------------------------------------ *
 * 1. Nothing readable in a header
 *
 * The page artwork lives in a header because that is the only place Word will
 * paint behind the text on every page. Text there is invisible to a good share
 * of applicant tracking systems, so there must never be any.
 * ------------------------------------------------------------------ */

console.log('\nheaders carry no text')
for (const [variant, lines] of Object.entries(streams)) {
  const inHeader = lines.filter(l => /header\d*\.xml$/.test(l.part) && l.text)
  if (inHeader.length) {
    fail.push(`${variant}: ${inHeader.length} text run(s) in a header`)
    note(`✗ ${variant} — ${inHeader.map(l => l.text).join(' / ')}`)
  } else {
    note(`✓ ${variant}`)
  }
}

/* ------------------------------------------------------------------ *
 * 2. The three designs that only restyled: identical token sequence
 * ------------------------------------------------------------------ */

console.log('\ntoken sequence identical to classic')
for (const variant of ['rule', 'panel', 'field']) {
  if (!streams[variant]) continue
  const actual = tokens(streams[variant])
  if (JSON.stringify(actual) === JSON.stringify(baseline)) {
    note(`✓ ${variant}`)
  } else {
    fail.push(`${variant}: token sequence diverged from classic`)
    const at = actual.findIndex((t, i) => t !== baseline[i])
    note(`✗ ${variant} — diverges at token ${at}`)
    note(`    ${variant}: ${JSON.stringify(actual.slice(at, at + 8))}`)
    note(`    classic: ${JSON.stringify(baseline.slice(at, at + 8))}`)
  }
}

/* ------------------------------------------------------------------ *
 * 3. The restructured designs: nothing lost, section order stated
 * ------------------------------------------------------------------ */

console.log('\nrestructured designs — nothing lost')
for (const variant of ['dossier', 'column']) {
  if (!streams[variant]) continue
  const actual = tokens(streams[variant])
  const lost = dropped(actual, baseline)
  const added = actual.length - baseline.length

  if (lost.length) {
    fail.push(`${variant}: ${lost.length} word(s) missing entirely`)
    note(`✗ ${variant} — dropped ${JSON.stringify(lost.slice(0, 8))}`)
  } else {
    note(
      `✓ ${variant} — every word classic has is present (+${added} for the stat band)`
    )
  }

  const order = sectionOrder(streams[variant])
  const sameOrder = JSON.stringify(order) === JSON.stringify(baseSections)
  if (order.length !== SECTIONS.length) {
    fail.push(
      `${variant}: only ${order.length}/${SECTIONS.length} section headings found`
    )
    note(`✗ ${variant} — sections: ${order.join(' → ')}`)
  } else if (sameOrder) {
    note(`  ${variant} sections in classic order`)
  } else {
    // Expected for `column` and only for `column`.
    if (variant !== 'column') {
      fail.push(`${variant}: section order changed unexpectedly`)
      note(`✗ ${variant} — sections: ${order.join(' → ')}`)
    } else {
      note(`  ${variant} sections: ${order.join(' → ')}`)
      note(
        '    a parser walks table cells row-major, so the rail is read first — the cost this design exists to measure'
      )
    }
  }
}

/* ------------------------------------------------------------------ */

if (fail.length) {
  console.error(`\n${fail.length} failure(s):`)
  fail.forEach(f => console.error(`  - ${f}`))
  process.exit(1)
}
console.log('\nall document text checks passed\n')
