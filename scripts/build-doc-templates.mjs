/**
 * Builds the provisional CV and cover-letter .docx templates.
 *
 * A .docx is a zip of XML, so the template is generated from this script rather
 * than committed as an opaque binary nobody can diff. The script is the
 * readable source; `templates/*.docx` is its build output.
 *
 * These are PROVISIONAL. The plan is to replace them with a template derived
 * from Lukáš's own example CVs — his previous applications plus the ones from
 * friends that got interviews. When that happens, either regenerate from this
 * script with the new layout, or drop his .docx in and mark it up with the same
 * placeholder names. The placeholder set is the contract with
 * `src/lib/documents/schema.ts`; keep them in step.
 *
 * Run: node scripts/build-doc-templates.mjs
 */

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  INK,
  PAGE,
  TYPE,
  p,
  run,
  loop,
  writeDocx,
  statBand,
} from './doc-kit.mjs'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'templates')

/* ------------------------------------------------------------------ *
 * Layout
 *
 * The OOXML machinery, the type stack and the package assembly all live in
 * `doc-kit.mjs`, which `build-doc-variants.mjs` shares. They used to be
 * duplicated here, which meant the typeface was hardcoded in two places and
 * this template silently kept Calibri when the variants moved to Geist.
 * ------------------------------------------------------------------ */

/** A section heading with a rule under it. */
const heading = text =>
  p(run(text, { bold: true, size: 20, caps: true, color: INK.ink }), {
    style: 'Heading',
    keepNext: true,
    before: 240,
    after: 80,
    border: { bottom: { sz: 4, color: 'C8C8CE', space: 2 } },
  })

/** A bullet, drawn from `numbering.xml` rather than a literal glyph. */
const bullet = runs =>
  p(runs, { numbered: true, after: 60, ind: { left: 284, hanging: 284 } })

const cvBody = [
  p(run('{fullName}', { font: TYPE.display, bold: true, size: 40 }), {
    style: 'Name',
    after: 30,
  }),
  p(run('{headline}', { size: 21, color: '4A4A55' }), { after: 30 }),
  p(run('{contactLine}', { size: 18, color: '4A4A55' }), { after: 140 }),

  // The stat band in ink — classic has no accent. Same tab grid as the other
  // designs, so an ATS reads two ordinary lines.
  statBand(PAGE.contentTwips, {
    value: { font: TYPE.display, size: 32, bold: true, track: -10 },
    label: { size: 15, caps: true, track: 24, color: INK.tertiary },
    rule: 'C8C8CE',
  }),

  heading('Summary'),
  p(run('{summary}')),

  heading('Skills'),
  loop('{#skills}'),
  p(`${run('{group}: ', { bold: true })}${run('{itemsLine}')}`, {
    after: 60,
  }),
  loop('{/skills}'),

  heading('Work Experience'),
  loop('{#roles}'),
  p(`${run('{title}', { bold: true })}${run('  ·  ')}${run('{company}')}`, {
    after: 20,
  }),
  p(run('{period}  |  {location}', { size: 18, color: '4A4A55' }), {
    after: 70,
  }),
  loop('{#bullets}'),
  // The bold lead-in label is the one device carried over from the CVs that
  // actually landed interviews: a recruiter reads the labels down the left
  // edge first, and only then the sentence. `label` is optional — a bullet
  // without one renders as plain text.
  bullet(`${run('{label}', { bold: true })}${run('{text}')}`),
  loop('{/bullets}'),
  p(run(''), { after: 70 }),
  loop('{/roles}'),

  heading('Education'),
  loop('{#education}'),
  p(
    `${run('{qualification}', { bold: true })}${run(' — ')}${run('{institution}')}${run('{detailSuffix}', { color: '4A4A55' })}`,
    { after: 50 }
  ),
  loop('{/education}'),

  heading('Certifications & Training'),
  loop('{#certifications}'),
  p(`${run('{year}', { bold: true })}${run('{entry}')}`, { after: 50 }),
  loop('{/certifications}'),

  heading('Languages'),
  p(run('{languagesLine}')),
].join('')

/* ------------------------------------------------------------------ *
 * Cover letter
 * ------------------------------------------------------------------ */

const letterBody = [
  p(run('{fullName}', { font: TYPE.display, bold: true, size: 32 }), {
    style: 'Name',
    after: 40,
  }),
  p(run('{contactLine}', { size: 19, color: '4A4A55' }), { after: 320 }),

  p(run('{date}', { size: 19, color: '4A4A55' }), { after: 240 }),
  p(run('{recipient}'), { after: 240 }),
  p(run('{subject}', { bold: true }), { after: 240 }),

  p(run('{greeting}'), { after: 180 }),
  loop('{#paragraphs}'),
  p(run('{text}'), { after: 180 }),
  loop('{/paragraphs}'),

  p(run('{closing}'), { after: 60 }),
  p(run('{signature}')),
].join('')

for (const [file, body] of [
  ['cv-template.docx', cvBody],
  ['cover-letter-template.docx', letterBody],
]) {
  console.log(`wrote ${writeDocx({ path: join(outDir, file), body })}`)
}
