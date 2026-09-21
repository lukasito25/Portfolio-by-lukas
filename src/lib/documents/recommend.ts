/**
 * Which document to send for this posting.
 *
 * Six designs and two formats is a choice to make per application, and the
 * evidence for it is already on the brief: where the posting was found, which
 * country the role is in, what kind of company it is, how the posting talks.
 * This turns that evidence into one recommendation and the reasons for it, so
 * the picker in the panel opens on the right design instead of on whatever was
 * chosen last time.
 *
 * Deliberately rule-based rather than a model call. The inputs are a handful
 * of signals a recruiter would recognise, the rules are the ones written down
 * in `CUSTOM_RECRUITER_PAGES.md` ("Two formats, two readers"), and a rule can
 * be audited: when the recommendation is wrong the reason it gives says which
 * signal misfired. A model would give a feeling and a paragraph.
 *
 * What the signals decide:
 *
 * - **Where it was found → who reads it first.** A posting on Greenhouse,
 *   Lever, Workday or Taleo goes through a parser before a person. That sets
 *   the format: `.docx` for the upload, because single-column .docx extracts
 *   97.4% of fields in 2026 parser testing against 71.2% for two-column PDF,
 *   and it keeps the two-column `column` page for the person, not the portal.
 * - **Which parser → how conservative.** Greenhouse, Lever, Ashby, Workday and
 *   SmartRecruiters read a text PDF as well as a .docx; older Taleo, iCIMS and
 *   SuccessFactors do not. The recommendation says so, because on the modern
 *   ones the PDF is a safe upload when the portal demands one.
 * - **Country → photo.** A photo is conventional in the DACH countries, Italy,
 *   France and most of central Europe, and discouraged — sometimes discarded
 *   on sight for bias reasons — in the UK, Ireland, the US, Canada and the
 *   Nordics. The PDF default, `column`, carries one; where a photo is a risk
 *   the reasons say so and how to send it without.
 * - **Sector → restraint.** Banking, insurance, consulting, the public sector,
 *   pharma and legal read a designed CV as a warning sign. `rule` — the
 *   typographic design, no hero, no photo — replaces both defaults there.
 * - **Company size → channel.** A startup or scale-up with no ATS reads
 *   applications by hand, usually from an email. That is the case for
 *   attaching the PDF first.
 *
 * The result is a design per format — both are always downloadable — plus
 * which format to attach. The defaults it starts from are `classic` for .docx
 * and `column` for PDF (`variants.ts`).
 */

import type { JobSpec } from '@/lib/fit-brief/schema'
import {
  DEFAULT_DOC_VARIANT,
  DEFAULT_PDF_VARIANT,
  type DocFormat,
  type DocVariant,
} from './variants'

export type { DocFormat }

export interface DocumentChoice {
  variant: DocVariant
  format: DocFormat
}

export interface DocumentRecommendation {
  /** The design for each format. Both are always available to download. */
  byFormat: Record<DocFormat, DocVariant>
  /** Which format to attach to the application. */
  attach: DocFormat
  /** What to attach — `byFormat[attach]`. */
  primary: DocumentChoice
  /** The other format, for the person after the portal or when asked for. */
  alternative: DocumentChoice
  /** Who reads it first. */
  reader: 'parser' | 'person' | 'unknown'
  /** The tracking system the posting sits on, when recognisable. */
  ats: AtsProfile | null
  /** Why. In the order the rules fired; the first is the decisive one. */
  reasons: string[]
  /** How much the evidence supports the call. */
  confidence: 'high' | 'medium' | 'low'
}

export interface AtsProfile {
  vendor: string
  /** Reads a text PDF as cleanly as a .docx. */
  modernParser: boolean
}

/* ------------------------------------------------------------------ *
 * Signals
 * ------------------------------------------------------------------ */

/**
 * The tracking systems by hostname. `modernParser` is from the 2026 parser
 * testing cited in the docs; the legacy three are the ones that still lose
 * columns and headers in text PDFs.
 */
const ATS_HOSTS: { pattern: RegExp; vendor: string; modernParser: boolean }[] =
  [
    { pattern: /greenhouse\.io/i, vendor: 'Greenhouse', modernParser: true },
    { pattern: /lever\.co/i, vendor: 'Lever', modernParser: true },
    { pattern: /ashbyhq\.com/i, vendor: 'Ashby', modernParser: true },
    {
      pattern: /myworkdayjobs\.com|workday\.com/i,
      vendor: 'Workday',
      modernParser: true,
    },
    {
      pattern: /smartrecruiters\.com/i,
      vendor: 'SmartRecruiters',
      modernParser: true,
    },
    { pattern: /teamtailor\.com/i, vendor: 'Teamtailor', modernParser: true },
    { pattern: /recruitee\.com/i, vendor: 'Recruitee', modernParser: true },
    { pattern: /workable\.com/i, vendor: 'Workable', modernParser: true },
    { pattern: /bamboohr\.com/i, vendor: 'BambooHR', modernParser: true },
    { pattern: /jobvite\.com/i, vendor: 'Jobvite', modernParser: true },
    { pattern: /personio\.(de|com)/i, vendor: 'Personio', modernParser: true },
    { pattern: /join\.com/i, vendor: 'JOIN', modernParser: true },
    { pattern: /taleo\.net/i, vendor: 'Taleo', modernParser: false },
    { pattern: /icims\.com/i, vendor: 'iCIMS', modernParser: false },
    {
      pattern: /successfactors\.(com|eu)/i,
      vendor: 'SAP SuccessFactors',
      modernParser: false,
    },
    {
      pattern: /brassring\.com/i,
      vendor: 'Kenexa BrassRing',
      modernParser: false,
    },
  ]

export function detectAts(
  sourceUrl: string | null | undefined
): AtsProfile | null {
  if (!sourceUrl) return null
  const hit = ATS_HOSTS.find(a => a.pattern.test(sourceUrl))
  return hit ? { vendor: hit.vendor, modernParser: hit.modernParser } : null
}

/** Countries where a photo on a CV is the convention rather than a risk. */
const PHOTO_COUNTRIES = new Set([
  'DE',
  'AT',
  'CH',
  'IT',
  'FR',
  'ES',
  'PT',
  'BE',
  'LU',
  'PL',
  'CZ',
  'SK',
  'HU',
  'RO',
  'BG',
  'HR',
  'SI',
  'GR',
  'TR',
])

/** Countries where a photo is discouraged, and sometimes screened out. */
const NO_PHOTO_COUNTRIES = new Set([
  'GB',
  'UK',
  'IE',
  'US',
  'CA',
  'AU',
  'NZ',
  'NL',
  'SE',
  'DK',
  'NO',
  'FI',
])

const CONSERVATIVE = [
  /\bbank(ing)?\b/i,
  /\binsur(ance|er)\b/i,
  /\basset management\b/i,
  /\bwealth\b/i,
  /\bprivate bank/i,
  /\bconsult(ing|ancy)\b/i,
  /\bpublic sector\b/i,
  /\bgovernment\b/i,
  /\bministry\b/i,
  /\bpharma(ceutical)?\b/i,
  /\blegal\b|\blaw firm\b/i,
  /\bdefen[cs]e\b/i,
  /\butilit(y|ies)\b/i,
  /\bregulated\b/i,
  /\baudit\b/i,
  /\bactuar/i,
]

const DESIGN_LED = [
  /\bdesign-led\b|\bdesign led\b/i,
  /\bbrand\b/i,
  /\bagency\b/i,
  /\bcreative\b/i,
  /\bconsumer app\b/i,
  /\bfashion\b|\bsportswear\b|\blifestyle\b/i,
  /\bgaming\b|\bgames?\b/i,
  /\bmedia\b|\bentertainment\b/i,
]

const SMALL_COMPANY = [
  /\bstart-?up\b/i,
  /\bscale-?up\b/i,
  /\bseed\b|\bseries [a-c]\b/i,
  /\bfounding\b|\bfounder/i,
  /\bearly[- ]stage\b/i,
  /\bsmall team\b|\bteam of \d+\b/i,
  /\bbootstrapped\b/i,
]

const LARGE_COMPANY = [
  /\benterprise\b/i,
  /\bmultinational\b/i,
  /\bfortune 500\b/i,
  /\bglobal (leader|company|organisation|organization)\b/i,
  /\b\d{1,3}[,.]?\d{3}\+? (employees|people|colleagues)\b/i,
  /\bpublicly (listed|traded)\b/i,
  /\bgroup\b/i,
]

const any = (patterns: RegExp[], text: string) =>
  patterns.some(p => p.test(text))

/* ------------------------------------------------------------------ *
 * The recommendation
 * ------------------------------------------------------------------ */

export interface RecommendInput {
  jobSpec: Partial<
    Pick<
      JobSpec,
      | 'companyName'
      | 'roleTitle'
      | 'countryCode'
      | 'companyContext'
      | 'domainKeywords'
      | 'workModel'
    >
  >
  sourceUrl?: string | null
  sourceKind?: 'url' | 'pdf' | 'image' | 'text' | string | null
}

export function recommendDocument(
  input: RecommendInput
): DocumentRecommendation {
  const spec = input.jobSpec
  const reasons: string[] = []
  const country = (spec.countryCode ?? '').toUpperCase()
  const text = [
    spec.companyName,
    spec.roleTitle,
    ...(spec.companyContext ?? []),
    ...(spec.domainKeywords ?? []),
  ]
    .filter(Boolean)
    .join(' \n ')

  const ats = detectAts(input.sourceUrl)
  const conservative = any(CONSERVATIVE, text)
  const designLed = any(DESIGN_LED, text)
  const small = any(SMALL_COMPANY, text)
  const large = any(LARGE_COMPANY, text)
  const photoCountry = PHOTO_COUNTRIES.has(country)
  const noPhotoCountry = NO_PHOTO_COUNTRIES.has(country)

  // 1. Who reads it first.
  let reader: DocumentRecommendation['reader'] = 'unknown'
  if (ats) {
    reader = 'parser'
    reasons.push(
      `Posting sits on ${ats.vendor}, so a parser reads it before a person${
        ats.modernParser
          ? ' — a modern one that reads a text PDF as cleanly as a .docx'
          : ' — an older one that loses columns and headers in PDFs, so upload the .docx'
      }.`
    )
  } else if (large && !small) {
    reader = 'parser'
    reasons.push(
      'Reads as a large organisation; assume an applicant tracking system even though the posting was not found on one.'
    )
  } else if (small) {
    reader = 'person'
    reasons.push(
      'Reads as a startup or scale-up with no tracking system detected — applications are most likely read by a person, from an email.'
    )
  } else if (input.sourceKind && input.sourceKind !== 'url') {
    reasons.push(
      'Posting came in as a file or pasted text, so where it will be submitted is unknown — the safe default is the upload-ready .docx.'
    )
  }

  // 2. Which design, per format. The defaults are the starting point — the
  //    plain `classic` for the upload, the `column` page with the photo for a
  //    person — and a conservative sector pulls both back to `rule`.
  const byFormat: Record<DocFormat, DocVariant> = {
    docx: DEFAULT_DOC_VARIANT,
    pdf: DEFAULT_PDF_VARIANT,
  }
  if (conservative) {
    byFormat.docx = 'rule'
    byFormat.pdf = 'rule'
    reasons.push(
      'Sector reads as conservative (banking, insurance, consulting, public sector or similar) — rule for both formats: the typographic design, no hero, no photo.'
    )
  } else {
    reasons.push(
      'Upload the plain classic .docx — nothing in a parser has ever mis-read it; send the column PDF, the page with the photo, to a person.'
    )
    if (noPhotoCountry) {
      reasons.push(
        `${country} discourages a photo on a CV and some screeners discard one on sight — send the column PDF without a photo (leave templates/photo.jpg out) or choose dossier from the picker.`
      )
    } else if (photoCountry) {
      reasons.push(
        `${country} expects a photo on a CV, which the column PDF carries.`
      )
    }
    if (designLed) {
      reasons.push(
        'Company reads as design-led; the designed page is the right first impression for the person who opens it.'
      )
    }
  }

  // 3. Which format to attach.
  const attach: DocFormat = reader === 'person' ? 'pdf' : 'docx'
  if (reader === 'person') {
    reasons.push(
      'Read by a person, so attach the PDF: it embeds its fonts and lays out the same on every screen.'
    )
  } else if (reader === 'parser') {
    reasons.push(
      'Uploaded to a portal, so attach the .docx: single-column .docx extracts 97.4% of fields in 2026 parser testing against 71.2% for a two-column PDF.'
    )
  } else {
    reasons.push(
      'Where it will be submitted is not known, so attach the .docx — the format every parser reads — with the PDF ready for whoever asks.'
    )
  }

  const other: DocFormat = attach === 'pdf' ? 'docx' : 'pdf'
  const primary: DocumentChoice = { variant: byFormat[attach], format: attach }
  const alternative: DocumentChoice = {
    variant: byFormat[other],
    format: other,
  }

  // 5. Confidence: how much of this rests on evidence rather than on defaults.
  const signals = [
    ats,
    conservative,
    designLed,
    small,
    large,
    photoCountry || noPhotoCountry,
  ].filter(Boolean).length
  const confidence: DocumentRecommendation['confidence'] =
    ats && (conservative || photoCountry || noPhotoCountry)
      ? 'high'
      : signals >= 2
        ? 'medium'
        : 'low'

  return {
    byFormat,
    attach,
    primary,
    alternative,
    reader,
    ats,
    reasons,
    confidence,
  }
}

/** Short human label for a choice, for the panel and the terminal. */
export function describeChoice(choice: DocumentChoice): string {
  return `${choice.variant} · .${choice.format}`
}
