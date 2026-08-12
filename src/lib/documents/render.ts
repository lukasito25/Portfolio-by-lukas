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

function render(templateName: string, data: Record<string, unknown>): Buffer {
  const zip = new PizZip(loadTemplate(templateName))
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    // A missing value should be a visible blank, not the literal "undefined".
    nullGetter: () => '',
  })

  doc.render(data)

  return doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  }) as Buffer
}

/* ------------------------------------------------------------------ *
 * CV
 * ------------------------------------------------------------------ */

export function renderCv(cv: CvContent): Buffer {
  const contactLine = [cv.location, cv.email, ...cv.links]
    .filter(Boolean)
    .join('  ·  ')

  return render('cv-template.docx', {
    fullName: cv.fullName,
    headline: cv.headline,
    contactLine,
    summary: cv.summary,
    roles: cv.roles.map(role => ({
      title: role.title,
      company: role.company,
      period: role.period,
      location: role.location,
      bullets: role.bullets.map(b => ({
        // Trailing separator lives here so a label-less bullet has no stray
        // punctuation in the rendered document.
        label: b.label ? `${b.label}: ` : '',
        text: b.text,
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
  })
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
  locale: Locale
): Buffer {
  const date = new Date().toLocaleDateString(DATE_LOCALES[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const contactLine = cv
    ? [cv.location, cv.email, ...cv.links].filter(Boolean).join('  ·  ')
    : ''

  return render('cover-letter-template.docx', {
    fullName: cv?.fullName ?? letter.signature,
    contactLine,
    date,
    recipient: letter.recipient,
    subject: letter.subject,
    greeting: letter.greeting,
    paragraphs: letter.paragraphs.map(p => ({ text: p.text })),
    closing: letter.closing,
    signature: letter.signature,
  })
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
  locale: Locale
): string {
  const prefix = kind === 'cv' ? 'CV' : 'Cover_Letter'
  return `${prefix}_Lukas_Hosala_${filenamePart(companyName)}_${locale.toUpperCase()}.docx`
}
