/**
 * Embedding the document typefaces into a `.docx`.
 *
 * A Word document normally only *names* a font and hopes the reader has it.
 * OOXML also lets the font travel inside the package, which is what makes it
 * possible to set these CVs in the site's own Geist and Space Grotesk instead
 * of in Calibri.
 *
 * Two things this file exists to get right:
 *
 * 1. **The obfuscation.** Embedded fonts are not stored as plain TrueType.
 *    ECMA-376 §17.8.1 requires the first 32 bytes to be XORed with a key
 *    derived from a GUID, and the GUID is recorded in `fontTable.xml` as
 *    `w:fontKey`. It is not encryption and protects nothing — it exists so a
 *    font cannot be trivially extracted and installed — but get the byte order
 *    wrong and Word silently ignores the font rather than reporting an error.
 *
 * 2. **The fallback.** Word for Windows honours embedded fonts. Word for **Mac**
 *    never reached parity and may ignore them. So every font also declares
 *    `w:altName`, which is what turns "the reader's Word picks something
 *    arbitrary" into "the reader's Word picks what we chose".
 *
 *    The fallback is Arial, and that is not a guess: Next.js generates a
 *    metric-matched fallback for Geist against Arial at `size-adjust: 104.76%`
 *    (Space Grotesk at 109.69%) — the framework's own judgement about the
 *    closest widely-installed face. It is also the right genre, since Geist is
 *    a neutral grotesque and Calibri is a humanist.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const fontDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'templates',
  'fonts'
)

/**
 * The type stack.
 *
 * Body is Geist at two weights; `bold` is the SemiBold instance rather than
 * Bold because the bullet lead-in labels are set in it and repeat down the
 * whole page — true Bold at 10.5pt turns that column into a row of black bars.
 * Space Grotesk appears only where the site uses it: the name.
 */
export const TYPE = {
  body: 'Geist',
  /**
   * The display face is Geist too, and that is a decision rather than a
   * shortcut.
   *
   * The site's display face is Space Grotesk, and it was tried here first. The
   * only source that ships it in a form OOXML can embed is a woff2 that has to
   * be decompressed back to TrueType, and the result — which Chrome's font
   * sanitiser accepts, and which fontkit parses — would not paint. An
   * unexplained failure is not something to put in a document going to an
   * employer, and Google Fonts serves EOT rather than TTF for the static
   * weights, so there was no clean second source.
   *
   * `globals.css` already names Geist as the display fallback
   * (`.font-display: var(--font-display), var(--font-geist-sans)`), so this is
   * the site's own second choice rather than an invention. The display voice
   * comes from size, weight and tight tracking, which is what Space Grotesk was
   * doing at that size anyway.
   */
  display: 'Geist',
  /** Named in `w:altName`, and used verbatim if a reader ignores the embed. */
  fallback: 'Arial',
}

const FAMILIES = [
  {
    name: TYPE.body,
    regular: 'Geist-Regular.ttf',
    bold: 'Geist-SemiBold.ttf',
  },
]

/**
 * Deterministic GUIDs.
 *
 * A random key per build would make every rebuild of an unchanged template
 * produce a different file, which turns the templates into unreviewable
 * binaries. The key protects nothing, so there is no reason for it to be
 * unpredictable.
 */
const fontKey = index =>
  `{${'A1B2C3D4'}-0000-4000-8000-${String(index).padStart(12, '0')}}`

/**
 * ECMA-376 §17.8.1.
 *
 * The 32 hex digits of the GUID are read as 16 bytes **from the last pair
 * backwards**, and that key is applied twice over the first 32 bytes of the
 * font. Reading them forwards produces a file Word accepts into the package
 * and then quietly refuses to use.
 */
export function obfuscate(ttf, guid) {
  const hex = guid.replace(/[{}-]/g, '')
  const key = Buffer.from(
    Array.from({ length: 16 }, (_, i) =>
      parseInt(hex.slice(30 - i * 2, 32 - i * 2), 16)
    )
  )

  const out = Buffer.from(ttf)
  for (let i = 0; i < 32 && i < out.length; i++) {
    out[i] ^= key[i % 16]
  }
  return out
}

/**
 * Everything a package needs to carry its own type.
 *
 * Returns the parts to add plus the `fontTable.xml` that references them, so
 * `writeDocx` stays the single place that knows how a package is assembled.
 */
export function buildFontParts(startRelId) {
  const parts = []
  const rels = []
  const entries = []

  let relIndex = startRelId
  for (const family of FAMILIES) {
    const slots = []

    for (const [slot, file] of [
      ['embedRegular', family.regular],
      ['embedBold', family.bold],
    ]) {
      const relId = `rId${relIndex}`
      const target = `fonts/font${relIndex}.odttf`
      const guid = fontKey(relIndex)

      parts.push({
        path: `word/${target}`,
        data: obfuscate(readFileSync(join(fontDir, file)), guid),
      })
      rels.push({ id: relId, target })
      slots.push(
        `<w:${slot} r:id="${relId}" w:fontKey="${guid}" w:subsetted="1"/>`
      )
      relIndex++
    }

    entries.push(
      `<w:font w:name="${family.name}">` +
        `<w:altName w:val="${TYPE.fallback}"/>` +
        `<w:charset w:val="00"/>` +
        `<w:family w:val="swiss"/>` +
        `<w:pitch w:val="variable"/>` +
        slots.join('') +
        `</w:font>`
    )
  }

  // The fallback is declared too, so a reader that drops the embed still knows
  // what it is substituting rather than guessing from the name alone.
  entries.push(
    `<w:font w:name="${TYPE.fallback}">` +
      `<w:charset w:val="00"/><w:family w:val="swiss"/><w:pitch w:val="variable"/>` +
      `</w:font>`
  )

  const fontTable =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    entries.join('') +
    `</w:fonts>`

  return { parts, rels, fontTable, nextRelId: relIndex }
}
