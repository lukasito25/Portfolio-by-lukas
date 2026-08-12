/**
 * Strip anything invisible from model output before it is stored.
 *
 * Everything this engine produces is sent to a recruiter under Lukáš's name —
 * a CV through an ATS, a cover letter opened in Word, a page a hiring manager
 * reads. Text that carries hidden characters is a genuine risk in that setting:
 * an applicant-tracking system or an AI-detection tool that finds zero-width
 * characters or Unicode tag characters does not conclude "a model wrote this",
 * it concludes "someone is hiding something", and that is a far worse outcome
 * than being thought to have used AI at all.
 *
 * A scan of the first real application (aspaara — CV, cover letter and brief,
 * ~40k characters) found none of this. But one clean sample says nothing about
 * the next generation: model output varies, providers change, and nobody is
 * going to hex-dump every document before sending it. Cheap and total beats
 * spot-checked, so this runs over every structured generation regardless of
 * provider.
 *
 * What is deliberately NOT touched: em dashes, en dashes and curly quotes.
 * They are visible, they are correct typography — the en dashes in this CV are
 * all date ranges — and stripping them would damage real prose to chase a
 * stylistic heuristic. The generated CV puts em dashes only in structural
 * separators (education lines, language lists) and none in the bullets, which
 * is where the tell would actually matter.
 */

/**
 * Codepoints that render as nothing, and therefore have no honest business in
 * a document. Each range is here for a reason:
 *
 *   U+00AD          soft hyphen — invisible until it lands at a line break
 *   U+200B–U+200F   zero-width space/joiners and directional marks
 *   U+202A–U+202E   bidi overrides, which can reorder displayed text
 *   U+2060–U+2064   word joiner and the invisible math operators
 *   U+2066–U+2069   bidi isolates
 *   U+FEFF          zero-width no-break space, a stray BOM
 *   U+FFF9–U+FFFB   interlinear annotation marks
 *   U+E0000–U+E007F Unicode tag characters — the standard way text is
 *                   watermarked, since a whole message can be encoded in them
 *                   and no renderer shows any of it
 */
const INVISIBLE = /[­​-‏‪-‮⁠-⁤⁦-⁩﻿￹-￻]|[\u{E0000}-\u{E007F}]/gu

/**
 * Cyrillic and Greek letters that are visually identical to Latin ones.
 *
 * These are not invisible, but they are worse than a hidden character in one
 * respect: a recruiter searching the CV for "Product" fails to find it, and an
 * ATS may index the word as gibberish. Mapped back rather than deleted.
 */
const HOMOGLYPHS: Record<string, string> = {
  А: 'A',
  В: 'B',
  Е: 'E',
  К: 'K',
  М: 'M',
  Н: 'H',
  О: 'O',
  Р: 'P',
  С: 'C',
  Т: 'T',
  Х: 'X',
  а: 'a',
  е: 'e',
  о: 'o',
  р: 'p',
  с: 'c',
  х: 'x',
  у: 'y',
  Ι: 'I',
  Ο: 'O',
  Α: 'A',
  Β: 'B',
  Ε: 'E',
  Ζ: 'Z',
  Η: 'H',
  Κ: 'K',
  Μ: 'M',
  Ν: 'N',
  Ρ: 'P',
  Τ: 'T',
  Υ: 'Y',
  Χ: 'X',
  ο: 'o',
  ν: 'v',
}

const HOMOGLYPH_RE = new RegExp(`[${Object.keys(HOMOGLYPHS).join('')}]`, 'g')

/** Non-breaking and exotic spaces → a normal space. ATS parsers split on it. */
const ODD_SPACES = /[  -   　]/g

export function sanitizeText(value: string): string {
  return value
    .replace(INVISIBLE, '')
    .replace(HOMOGLYPH_RE, ch => HOMOGLYPHS[ch] ?? ch)
    .replace(ODD_SPACES, ' ')
}

/**
 * Apply `sanitizeText` to every string in a parsed structure.
 *
 * Runs after schema validation rather than before, so a value can never be
 * cleaned into a different shape than the one the schema approved. Objects and
 * arrays are rebuilt rather than mutated — the input may be shared.
 */
export function sanitizeDeep<T>(value: T): T {
  if (typeof value === 'string') return sanitizeText(value) as T
  if (Array.isArray(value)) return value.map(sanitizeDeep) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, inner] of Object.entries(value)) {
      out[key] = sanitizeDeep(inner)
    }
    return out as T
  }
  return value
}
