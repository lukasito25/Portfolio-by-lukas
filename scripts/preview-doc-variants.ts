/**
 * Renders every document variant with a realistic sample, so the designs can be
 * compared as files rather than as descriptions.
 *
 * It goes through `renderCv` / `renderCoverLetter` rather than driving
 * docxtemplater directly: a prototype that looked right here and broke in the
 * download would be worth nothing. What this writes is byte-for-byte what
 * `/api/admin/brief/<id>/document` writes for the same content.
 *
 * The sample is drawn from `src/lib/career-facts.ts` — real roles, real
 * figures — because a design decision made on lorem ipsum is a decision about
 * lorem ipsum. The posting it is aimed at is invented.
 *
 * Run: npx tsx scripts/preview-doc-variants.ts [outDir]
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import {
  renderCv,
  renderCoverLetter,
  documentFilename,
} from '../src/lib/documents/render'

import { DOC_VARIANTS } from '../src/lib/documents/variants'
import { cv, letter } from './sample-cv'

const outDir = resolve(process.argv[2] ?? 'doc-previews')
mkdirSync(outDir, { recursive: true })

// Every preview carries its variant in the name, including the default —
// `documentFilename` drops the suffix for the default, and the gates
// (`check-doc-text.mjs`, `check-doc-clean.mjs`) look each design up by name.
const previewName = (kind: 'cv' | 'cover-letter', variant: string) =>
  documentFilename(kind, 'Northbound', 'en').replace(
    '.docx',
    `_${variant}.docx`
  )

for (const variant of DOC_VARIANTS) {
  const cvPath = join(outDir, previewName('cv', variant))
  writeFileSync(cvPath, renderCv(cv, variant))

  const letterPath = join(outDir, previewName('cover-letter', variant))
  writeFileSync(letterPath, renderCoverLetter(letter, cv, 'en', variant))

  console.log(`${variant.padEnd(8)} ${cvPath}\n${''.padEnd(9)}${letterPath}`)
}
