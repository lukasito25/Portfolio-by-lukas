/**
 * Schemas for the application engine.
 *
 * These are deliberately doing double duty: they are the structured-output
 * contract handed to the model AND the contract the renderer reads. One
 * definition means generated content and the scaffold cannot drift apart.
 *
 * Written against `zod/v4` because that is what `@anthropic-ai/sdk`'s
 * `zodOutputFormat` helper expects. The rest of the app uses the classic v3
 * import from `zod`; both resolve from the same installed package.
 */

import * as z from 'zod/v4'

/* ------------------------------------------------------------------ *
 * Job spec — the structured reading of a posting
 * ------------------------------------------------------------------ */

export const RequirementSchema = z.object({
  text: z.string().describe('The requirement, condensed to one line.'),
  kind: z
    .enum(['must', 'nice'])
    .describe('Whether the posting frames this as essential or desirable.'),
})

export const JobSpecSchema = z.object({
  companyName: z.string(),
  roleTitle: z.string(),
  location: z
    .string()
    .describe('City and country as written in the posting, or "Remote".'),
  countryCode: z
    .string()
    .describe(
      'ISO 3166-1 alpha-2 country code for the role location, uppercase. Empty string if fully remote with no country given.'
    ),
  workModel: z.enum(['onsite', 'hybrid', 'remote', 'unspecified']),
  seniority: z
    .string()
    .describe(
      'Seniority as the posting frames it, e.g. "Senior", "Staff", "Head of".'
    ),
  postingLanguage: z
    .enum(['en', 'it', 'de', 'other'])
    .describe('The language the posting itself is written in.'),
  companyContext: z
    .array(z.string())
    .max(6)
    .describe(
      'What the company does and any recent context worth referencing. Facts about the company only — never about the candidate.'
    ),
  responsibilities: z.array(z.string()).max(12),
  requirements: z.array(RequirementSchema).max(16),
  domainKeywords: z
    .array(z.string())
    .max(12)
    .describe(
      'The vocabulary this posting lives in, for the marquee and chips.'
    ),
  sourceQuotes: z
    .array(z.string())
    .max(8)
    .describe(
      'Short verbatim lines from the posting, so later steps can be checked against what was actually written.'
    ),
  brandColorGuess: z
    .string()
    .describe(
      'The company brand colour as a #rrggbb hex if confidently known from the careers site, otherwise an empty string.'
    ),
})

export type JobSpec = z.infer<typeof JobSpecSchema>
export type Requirement = z.infer<typeof RequirementSchema>

/* ------------------------------------------------------------------ *
 * Fit brief content — one locale
 * ------------------------------------------------------------------ */

const factIds = (what: string) =>
  z
    .array(z.string())
    .describe(
      `Fact ids from the career facts corpus backing ${what}. Every id must exist in the corpus. Empty only when the text makes no factual claim about him.`
    )

export const HeroStatSchema = z.object({
  value: z
    .string()
    .describe(
      'Short value; a leading number animates on scroll. e.g. "165M+", "13", "Zero".'
    ),
  label: z.string().describe('Max ~34 characters.'),
  factIds: factIds('this statistic'),
})

export const RoleMapItemSchema = z.object({
  id: z.string().describe('Short kebab-case key, unique within the brief.'),
  tag: z.string().describe('1–3 word chip label.'),
  title: z.string().describe('Max ~90 characters.'),
  body: z.string().describe('2–4 sentences.'),
  factIds: factIds('this item'),
})

export const ProfileRowSchema = z.object({
  requirement: z
    .string()
    .describe('The posting requirement, in the posting’s own terms.'),
  isMatch: z
    .boolean()
    .describe(
      'true = direct match with demonstrable experience. false = transferable but not the same thing. Be honest; a page of all-true reads as a sales sheet.'
    ),
  tierLabel: z
    .string()
    .describe('Short badge text, e.g. "Direct match" / "Transferable".'),
  proof: z.string().describe('One or two sentences of concrete evidence.'),
  factIds: factIds('this proof'),
})

export const ProfilePanelSchema = z.object({
  title: z.string(),
  rows: z.array(ProfileRowSchema).min(3).max(6),
})

export const PillarSchema = z.object({
  title: z.string(),
  body: z.string().describe('1–3 sentences.'),
  factIds: factIds('this pillar'),
})

export const FitBriefContentSchema = z.object({
  hero: z.object({
    eyebrow: z
      .string()
      .describe('Company · location · role title, separated by middots.'),
    headlineLead: z.string().describe('One sentence, max ~110 characters.'),
    headlineGradient: z
      .string()
      .describe(
        'The follow-on clause, max ~90 characters. Rendered in the accent colour.'
      ),
    description: z
      .string()
      .describe('3–5 sentences setting up the whole page.'),
    chips: z.array(z.string()).min(4).max(6),
    stats: z.array(HeroStatSchema).length(4),
  }),
  roleMapSection: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    hint: z
      .string()
      .describe('Short interaction hint, e.g. "Swipe or use the arrows".'),
    items: z.array(RoleMapItemSchema).min(5).max(7),
  }),
  profileMatchSection: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    matchLabel: z.string().describe('Filter button label for direct matches.'),
    transferLabel: z
      .string()
      .describe('Filter button label for transferable experience.'),
    panels: z.array(ProfilePanelSchema).min(2).max(3),
  }),
  spotlight: z.object({
    chip: z.string(),
    statusBadge: z
      .string()
      .describe('Short live-status text, e.g. "In beta with 4 clubs".'),
    heading: z.string(),
    lede: z.string().describe('2–3 sentences.'),
    pillars: z.array(PillarSchema).length(4),
    credentials: z.array(z.string()).min(3).max(6),
    closingLine: z.string(),
  }),
  gap: z.object({
    chip: z.string(),
    heading: z.string(),
    body: z
      .string()
      .describe(
        'Where his experience stops short of this posting. Plain, undefended, no disguised strengths.'
      ),
  }),
  closing: z.object({
    eyebrow: z.string(),
    heading: z.string(),
    body: z.string().describe('2–4 sentences.'),
    credentials: z.array(z.string()).min(3).max(5),
    signature: z.string(),
  }),
})

export type FitBriefContent = z.infer<typeof FitBriefContentSchema>
export type HeroStat = z.infer<typeof HeroStatSchema>
export type RoleMapItem = z.infer<typeof RoleMapItemSchema>
export type ProfileRow = z.infer<typeof ProfileRowSchema>
export type ProfilePanel = z.infer<typeof ProfilePanelSchema>
export type Pillar = z.infer<typeof PillarSchema>

/* ------------------------------------------------------------------ *
 * Brand + motif
 * ------------------------------------------------------------------ */

export const HERO_MOTIFS = [
  'circuit',
  'mesh',
  'waveform',
  'topography',
  'orbit',
] as const
export type HeroMotif = (typeof HERO_MOTIFS)[number]

const HEX = /^#[0-9a-fA-F]{6}$/

export const BrandSchema = z.object({
  accentLight: z
    .string()
    .describe(
      'Accent for light mode as #rrggbb. Must reach WCAG AA (4.5:1) against a near-white background, so pick a darker tone than the raw brand colour if needed.'
    ),
  accentDark: z
    .string()
    .describe(
      'Accent for dark mode as #rrggbb. Must reach WCAG AA against a near-black background, so usually a lighter tone.'
    ),
  motif: z
    .enum(HERO_MOTIFS)
    .describe(
      'Hero background motif. circuit = hardware/embedded, mesh = platform/network, waveform = data/finance/audio, topography = logistics/geo/retail, orbit = research/AI/space.'
    ),
})

export type Brand = z.infer<typeof BrandSchema>

export function isHexColor(value: string): boolean {
  return HEX.test(value)
}

/* ------------------------------------------------------------------ *
 * Warnings — what the review screen shows
 * ------------------------------------------------------------------ */

export type WarningCode =
  | 'untraceable-claim'
  | 'unknown-fact-id'
  | 'contrast'
  | 'nda-sensitive'
  | 'language-claim'
  | 'ai-overclaim'
  | 'schema'
  | 'source'

export interface BriefWarning {
  code: WarningCode
  severity: 'blocker' | 'review'
  message: string
  /** Dotted path into the content, when the warning points at one field. */
  path?: string
  locale?: string
}

/* ------------------------------------------------------------------ *
 * The stored record
 * ------------------------------------------------------------------ */

export type BriefStatus = 'draft' | 'published' | 'archived'

export interface GeneratedBrief {
  id: string
  slug: string
  companyName: string
  roleTitle: string
  sourceUrl: string | null
  sourceKind: 'url' | 'pdf' | 'image' | 'text'
  status: BriefStatus
  previewToken: string
  jobSpec: JobSpec
  content: Partial<Record<'en' | 'it' | 'de', FitBriefContent>>
  cvContent: Partial<Record<'en' | 'it' | 'de', unknown>>
  coverLetter: Partial<Record<'en' | 'it' | 'de', unknown>>
  brand: Brand
  warnings: BriefWarning[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
}
