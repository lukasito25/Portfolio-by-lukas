/**
 * Renders the sample CV and cover letter as PDFs, in every PDF design.
 *
 * The `column` design takes a photo. `doc-previews/photo.jpg` is used when it
 * exists (a headshot for the preview, git-ignored with the rest of the folder);
 * otherwise the rail renders without one, which is also what the download does
 * until a `templates/photo.jpg` is put in place.
 *
 * A separate script, and running under plain Node rather than tsx, for one
 * concrete reason: `tsx` cannot resolve the wildcard subpath exports that
 * `@react-pdf/renderer` relies on (`@react-pdf/hyphenate/en-us` resolves
 * through an `"./*"` pattern), and fails with ERR_PACKAGE_PATH_NOT_EXPORTED.
 * Node's own resolver handles it, and so does the Next bundler — which is what
 * actually serves the download — so this is a limitation of one dev tool
 * rather than a problem with the renderer.
 *
 * esbuild transpiles the JSX and leaves every package external, so what runs is
 * the real component against the real library.
 *
 * Run: node scripts/preview-cv-pdf.mjs [outDir]
 */

import { build } from 'esbuild'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(process.argv[2] ?? 'doc-previews')
const bundle = join(outDir, '.pdf-entry.mjs')

mkdirSync(outDir, { recursive: true })

await build({
  stdin: {
    contents: `
      import { renderCvPdf, renderCoverLetterPdf } from './src/lib/documents/pdf/cv'
      import { cv, letter } from './scripts/sample-cv'
      export { renderCvPdf, renderCoverLetterPdf, cv, letter }
    `,
    resolveDir: root,
    loader: 'tsx',
  },
  // The automatic runtime, matching the project's tsconfig. esbuild's default
  // is the classic transform, which emits `React.createElement` against a
  // global the component never imports.
  jsx: 'automatic',
  bundle: true,
  packages: 'external',
  format: 'esm',
  platform: 'node',
  outfile: bundle,
  logLevel: 'warning',
})

const { renderCvPdf, renderCoverLetterPdf, cv, letter } = await import(bundle)
rmSync(bundle, { force: true })

const photoPath = join(outDir, 'photo.jpg')
const photo = existsSync(photoPath)
  ? { data: readFileSync(photoPath), format: 'jpg' }
  : null

const designs = ['classic', 'rule', 'panel', 'field', 'dossier', 'column']

for (const variant of designs) {
  const suffix = `_${variant}`
  const options = { variant, photo }
  const cvPath = join(outDir, `CV_Lukas_Hosala_Northbound_EN${suffix}.pdf`)
  writeFileSync(cvPath, await renderCvPdf(cv, options))
  console.log(`wrote ${cvPath}`)

  const letterPath = join(
    outDir,
    `Cover_Letter_Lukas_Hosala_Northbound_EN${suffix}.pdf`
  )
  writeFileSync(
    letterPath,
    await renderCoverLetterPdf(letter, cv, 'en', options)
  )
  console.log(`wrote ${letterPath}`)
}
