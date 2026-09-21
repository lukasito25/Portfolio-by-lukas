/**
 * The CV and cover letter as typeset PDFs — the entry point.
 *
 * The `.docx` is the artifact an applicant tracking system reads, and it is
 * deliberately conservative: single column, no text boxes, whatever Word
 * decides to render on the reader's machine. This is the other half — the file
 * that goes to a person. A PDF embeds its fonts by definition and lays out
 * identically everywhere, so the design does not have to survive a negotiation
 * with someone else's word processor.
 *
 * Which to send is a real decision, not a preference. Independent 2026 parser
 * testing puts single-column .docx at 97.4% field extraction and two-column
 * PDF at 71.2%; Greenhouse, Lever and Workday parse text PDFs as cleanly as
 * .docx, while older Taleo and iCIMS instances do not. Portal upload gets the
 * .docx. A hiring manager gets this.
 *
 * Every design renders from the same `CvContent` as the .docx, so the two can
 * never disagree about what they say. The six ids in `variants.ts` select the
 * PDF design as they select the .docx one: five single-column treatments in
 * `single.tsx`, and the two-column dark-rail page in `column.tsx`.
 *
 * `tsx` cannot run this module — it fails to resolve `@react-pdf/hyphenate`
 * through a `"./*"` export pattern. Node and the Next bundler both can, which
 * is why `scripts/preview-cv-pdf.mjs` esbuild-bundles and runs under Node.
 */

import { Font, renderToBuffer } from '@react-pdf/renderer'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { CvContent, CoverLetterContent } from '../schema'
import type { Locale } from '@/lib/fit-brief/guardrails'
import { DEFAULT_PDF_VARIANT, type DocVariant } from '../variants'
import { SingleCv, SingleLetter } from './single'
import { ColumnCv, ColumnLetter, type Photo } from './column'

const TEMPLATE_DIR = join(process.cwd(), 'templates')
const FONT_DIR = join(TEMPLATE_DIR, 'fonts')

/**
 * Registered once per process.
 *
 * The same subsetted files the .docx embeds, so the two documents are set in
 * the same type. `Font.registerHyphenationCallback` is disabled deliberately:
 * react-pdf hyphenates by default, and a hyphenated CV bullet looks like a
 * newspaper column rather than a document someone wrote.
 */
let registered = false
function registerFonts() {
  if (registered) return
  Font.register({
    family: 'Geist',
    fonts: [
      { src: join(FONT_DIR, 'Geist-Regular.ttf'), fontWeight: 400 },
      { src: join(FONT_DIR, 'Geist-SemiBold.ttf'), fontWeight: 600 },
      // The heavier cuts are used by `column` alone; registering a font is
      // lazy, so the single-column designs never pay for them.
      { src: join(FONT_DIR, 'Geist-Bold.ttf'), fontWeight: 700 },
      { src: join(FONT_DIR, 'Geist-Black.ttf'), fontWeight: 900 },
    ],
  })
  Font.registerHyphenationCallback(word => [word])
  registered = true
}

export interface PdfOptions {
  /** Which design; defaults to `DEFAULT_PDF_VARIANT`. */
  variant?: DocVariant
  /**
   * The photo for the `column` rail. Omitted, `templates/` is checked; `null`
   * means no photo even if one is there.
   */
  photo?: Photo | null
}

/**
 * The headshot the `column` design carries, if one has been put in place.
 *
 * `templates/photo.jpg` (or `.png`) is read at render time and never required:
 * the repository ships no photo, and whether a CV should carry one differs by
 * country and by recruiter. Copy one in and every `column` PDF picks it up;
 * leave it out and the rail simply has no photo.
 */
export function templatePhoto(): Photo | undefined {
  for (const format of ['jpg', 'png'] as const) {
    const path = join(TEMPLATE_DIR, `photo.${format}`)
    if (existsSync(path)) return { data: readFileSync(path), format }
  }
  return undefined
}

function resolvePhoto(options: PdfOptions): Photo | undefined {
  if (options.photo === null) return undefined
  return options.photo ?? templatePhoto()
}

export async function renderCvPdf(
  cv: CvContent,
  options: PdfOptions = {}
): Promise<Buffer> {
  registerFonts()
  const variant = options.variant ?? DEFAULT_PDF_VARIANT
  if (variant === 'column') {
    return renderToBuffer(<ColumnCv cv={cv} photo={resolvePhoto(options)} />)
  }
  return renderToBuffer(<SingleCv cv={cv} variant={variant} />)
}

export async function renderCoverLetterPdf(
  letter: CoverLetterContent,
  cv: CvContent | undefined,
  locale: Locale,
  options: PdfOptions = {}
): Promise<Buffer> {
  registerFonts()
  const variant = options.variant ?? DEFAULT_PDF_VARIANT
  if (variant === 'column') {
    return renderToBuffer(
      <ColumnLetter
        letter={letter}
        cv={cv}
        locale={locale}
        photo={resolvePhoto(options)}
      />
    )
  }
  return renderToBuffer(
    <SingleLetter letter={letter} cv={cv} locale={locale} variant={variant} />
  )
}
