/**
 * Fills the .docx templates with generated content.
 *
 * Documents are rendered on demand rather than stored: the content JSON is the
 * artefact, the .docx is a view of it. That keeps edits in the review screen
 * immediately reflected in the download and means there is no file storage to
 * manage or clean up.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import type { CvContent, CoverLetterContent } from './schema'
import {
  DEFAULT_DOC_VARIANT,
  defaultVariantFor,
  templateFile,
  type DocVariant,
} from './variants'
import type { Locale } from '@/lib/fit-brief/guardrails'

const TEMPLATE_DIR = join(process.cwd(), 'templates')

/**
 * Templates are small and immutable at runtime, so read once per process.
 * `standalone: true` in next.config.ts traces this directory into the Vercel
 * bundle because the path is resolved from `process.cwd()` at request time —
 * see the note in ADMIN.md if a template ever goes missing in production.
 */
const cache = new Map<string, Buffer>()

function loadTemplate(name: string): Buffer {
  const cached = cache.get(name)
  if (cached) return cached
  const buffer = readFileSync(join(TEMPLATE_DIR, name))
  cache.set(name, buffer)
  return buffer
}

const NBSP = '\u00a0'

/**
 * Bind a figure to the word it measures, so a line break cannot separate them.
 *
 * "led 13 / people across three countries" with the number stranded at the end
 * of a line is the sort of thing that reads as unproofed. Length-guarded,
 * because an unbreakable run that is too long is worse than the break it
 * prevents — especially inside the narrow rail of the two-column design.
 *
 * This deliberately reintroduces U+00A0, which `src/lib/ai/sanitize.ts`
 * normalises away. There is no contradiction: sanitize strips odd spaces from
 * *model output*, where they arrive unexplained. This adds one back at render
 * time, in one known place, as typography. A non-breaking space is visible as a
 * space and is not a watermarking channel — unlike the zero-width and tag
 * characters sanitize exists to remove.
 */
function bindFigures(text: string): string {
  return text.replace(
    /(\d[\d.,]*[%+]?)\s+(\p{L}[\p{L}-]*)/gu,
    (match, figure: string, word: string) =>
      `${figure}${NBSP}${word}`.length <= 18 ? `${figure}${NBSP}${word}` : match
  )
}

/**
 * The contact block as two lines: where and how to reach him, then the links.
 *
 * One line was fine until the phone joined it; with five items Word wraps,
 * and it wraps a URL at its hyphens — "portfolio-by-" / "lukas.vercel.app" —
 * which reads as a broken address. Two lines with a hard break keep every
 * item whole. `linebreaks: true` on docxtemplater turns the newline into
 * `<w:br/>` inside the run, so the template's single placeholder still holds.
 */
function contactLines(
  cv: Pick<CvContent, 'location' | 'phone' | 'email' | 'links'>
): string {
  const reach = [cv.location, cv.phone, cv.email].filter(Boolean).join('  ·  ')
  const links = cv.links.filter(Boolean).join('  ·  ')
  return [reach, links].filter(Boolean).join('\n')
}

/**
 * Document metadata.
 *
 * A `.docx` carrying no `docProps` at all is unusual enough to tell anyone who
 * unzips it that a script produced the file, so the author is stated here.
 * There is deliberately no `docProps/app.xml`: that part declares
 * `<Application>Microsoft Office Word</Application>`, and claiming that would
 * be untrue.
 */
function coreProperties(author: string, title: string): string {
  const esc = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
 xmlns:dc="http://purl.org/dc/elements/1.1/">
<dc:title>${esc(title)}</dc:title>
<dc:creator>${esc(author)}</dc:creator>
<cp:lastModifiedBy>${esc(author)}</cp:lastModifiedBy>
</cp:coreProperties>`
}

function render(
  templateName: string,
  data: Record<string, unknown>,
  meta: { author: string; title: string }
): Buffer {
  const zip = new PizZip(loadTemplate(templateName))
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    // A missing value should be a visible blank, not the literal "undefined".
    nullGetter: () => '',
  })

  doc.render(data)

  const out = doc.getZip()
  out.file('docProps/core.xml', coreProperties(meta.author, meta.title))

  return out.generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  }) as Buffer
}

/* ------------------------------------------------------------------ *
 * CV
 * ------------------------------------------------------------------ */

export function renderCv(
  cv: CvContent,
  variant: DocVariant = DEFAULT_DOC_VARIANT
): Buffer {
  const contactLine = contactLines(cv)

  return render(
    templateFile('cv', variant),
    {
      fullName: cv.fullName,
      headline: cv.headline,
      contactLine,
      summary: bindFigures(cv.summary),
      // The stat band is one paragraph of tab-separated runs, and a docxtemplater
      // loop cannot run inside a paragraph — so the metrics go in as four fixed
      // slots rather than a list. Wrapping them in a single-iteration section
      // lets `{#hasHighlights}` drop the whole band, rule included, for a CV
      // generated before the field existed.
      hasHighlights: cv.highlights.length
        ? [
            Object.fromEntries(
              [0, 1, 2, 3].flatMap(i => [
                [`h${i + 1}value`, cv.highlights[i]?.value ?? ''],
                [`h${i + 1}label`, cv.highlights[i]?.label ?? ''],
              ])
            ),
          ]
        : [],
      roles: cv.roles.map(role => ({
        title: role.title,
        company: role.company,
        period: role.period,
        location: role.location,
        bullets: role.bullets.map(b => ({
          // Trailing separator lives here so a label-less bullet has no stray
          // punctuation in the rendered document.
          label: b.label ? `${b.label}: ` : '',
          text: bindFigures(b.text),
        })),
      })),
      skills: cv.skills.map(group => ({
        group: group.group,
        itemsLine: group.items.join(' · '),
      })),
      education: cv.education.map(entry => ({
        qualification: entry.qualification,
        institution: entry.institution,
        // Rendered inline after the institution, so carry its own separator.
        detailSuffix: entry.detail ? ` — ${entry.detail}` : '',
      })),
      certifications: (cv.certifications ?? []).map(c => ({
        year: c.year ? `${c.year} — ` : '',
        entry: c.entry,
      })),
      languagesLine: cv.languages.join('  ·  '),
    },
    { author: cv.fullName, title: `${cv.fullName} — CV` }
  )
}

/* ------------------------------------------------------------------ *
 * Cover letter
 * ------------------------------------------------------------------ */

const DATE_LOCALES: Record<Locale, string> = {
  en: 'en-GB',
  it: 'it-IT',
  de: 'de-DE',
}

export function renderCoverLetter(
  letter: CoverLetterContent,
  cv: CvContent | undefined,
  locale: Locale,
  variant: DocVariant = DEFAULT_DOC_VARIANT
): Buffer {
  const date = new Date().toLocaleDateString(DATE_LOCALES[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const contactLine = cv ? contactLines(cv) : ''

  const author = cv?.fullName ?? letter.signature

  return render(
    templateFile('cover-letter', variant),
    {
      fullName: author,
      // The letterhead is the CV's, verbatim, so the two documents in one
      // application open with the same block rather than two near-misses.
      headline: cv?.headline ?? '',
      contactLine,
      date,
      recipient: letter.recipient,
      subject: letter.subject,
      greeting: letter.greeting,
      paragraphs: letter.paragraphs.map(p => ({ text: bindFigures(p.text) })),
      closing: letter.closing,
      signature: letter.signature,
    },
    { author, title: `${author} — Cover Letter` }
  )
}

/* ------------------------------------------------------------------ *
 * Filenames
 * ------------------------------------------------------------------ */

/** ASCII-safe, so the Content-Disposition header needs no encoding dance. */
function filenamePart(value: string): string {
  return (
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/^_|_$/g, '') || 'Document'
  )
}

export function documentFilename(
  kind: 'cv' | 'cover-letter',
  companyName: string,
  locale: Locale,
  variant: DocVariant = DEFAULT_DOC_VARIANT,
  format: 'docx' | 'pdf' = 'docx'
): string {
  const prefix = kind === 'cv' ? 'CV' : 'Cover_Letter'
  // The format's own default leaves no trace in the name; any other design is
  // named, so two downloads of one application do not overwrite each other in
  // the downloads folder.
  const suffix =
    variant === defaultVariantFor(format) ? '' : `_${filenamePart(variant)}`
  return `${prefix}_Lukas_Hosala_${filenamePart(companyName)}_${locale.toUpperCase()}${suffix}.${format}`
}
