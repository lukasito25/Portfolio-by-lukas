/**
 * CV and cover-letter content schemas.
 *
 * The field names here ARE the docx template placeholders. If you rename a
 * field, rename it in `templates/cv-template.docx` in the same commit — that
 * pairing is the only thing keeping the model's output and the rendered
 * document in step.
 */

import * as z from 'zod/v4'

const factIds = (what: string) =>
  z
    .array(z.string())
    .describe(
      `Fact ids from the career facts corpus backing ${what}. Every id must exist in the corpus.`
    )

/* ------------------------------------------------------------------ *
 * CV
 * ------------------------------------------------------------------ */

export const CvBulletSchema = z.object({
  label: z
    .string()
    .describe(
      'Two or three words naming what this bullet is about, e.g. "Pipeline Architecture", "Risk Mitigation", "Team Leadership". Rendered in bold before the sentence so a recruiter can scan the left edge. Empty string for no label.'
    ),
  text: z
    .string()
    .describe(
      'One achievement line. Lead with what changed, then how. A single sentence where possible.'
    ),
  factIds: factIds('this bullet'),
})

export const CvRoleSchema = z.object({
  roleId: z
    .string()
    .describe(
      'The id of the matching role record: playergrade, stagstrat, runtastic, adidas-pm or adidas-po.'
    ),
  title: z.string(),
  company: z.string(),
  location: z.string(),
  period: z.string(),
  bullets: z
    .array(CvBulletSchema)
    .min(2)
    .max(5)
    .describe('Selected and ordered for this specific posting.'),
})

export const CvSkillGroupSchema = z.object({
  group: z.string().describe('e.g. "Product", "Technical", "Leadership".'),
  items: z.array(z.string()).min(3).max(10),
})

/**
 * One number for the band at the top of the CV.
 *
 * The same device as the fit-brief pages' stat band (`HeroStatSchema` in
 * `src/lib/fit-brief/schema.ts`), and deliberately the same shape — it is the
 * one thing a hiring manager reads before deciding whether to read the rest.
 */
export const CvHighlightSchema = z.object({
  value: z
    .string()
    .describe(
      'Short, and leads with the number. e.g. "165M+", "13", "€1M", "Zero", "80%".'
    ),
  label: z
    .string()
    .describe(
      'What the number counts, max ~24 characters. e.g. "registered users", "people led".'
    ),
  factIds: factIds('this highlight'),
})

export const CvEducationSchema = z.object({
  qualification: z.string(),
  institution: z.string(),
  detail: z
    .string()
    .describe(
      'Years, or a thesis title. Empty string when there is nothing to add.'
    ),
})

export const CvCertificationSchema = z.object({
  year: z.string().describe('e.g. "2022". Empty string if undated.'),
  entry: z.string().describe('The certification or training.'),
})

export const CvContentSchema = z.object({
  fullName: z.string(),
  headline: z
    .string()
    .describe(
      'One line under the name, tuned to the posting. Not a slogan — a description.'
    ),
  location: z.string(),
  email: z.string(),
  links: z
    .array(z.string())
    .max(3)
    .describe('Portfolio and LinkedIn URLs. Never the coaching domain.'),
  summary: z
    .string()
    .describe(
      '2–4 sentences positioning him for this specific role. No "passionate", no "seasoned".'
    ),
  roles: z
    .array(CvRoleSchema)
    .min(3)
    .max(5)
    .describe(
      'Most recent first. Include every role; tailor the bullets, not the history.'
    ),
  skills: z.array(CvSkillGroupSchema).min(2).max(4),
  // Defaulted rather than required: every CV generated before this field
  // existed still has to parse. Five call sites `safeParse` a stored CV, and
  // two of them fail silently — a required field would stop warnings being
  // recomputed and drop the edit-learning training pair with no error anywhere.
  highlights: z
    .array(CvHighlightSchema)
    .max(4)
    .default([])
    .describe(
      'Three or four headline metrics for the band at the top, ordered by force. Vary the kind — scale, money, change, time — and never repeat a figure the summary already states.'
    ),
  education: z.array(CvEducationSchema).min(1).max(4),
  certifications: z
    .array(CvCertificationSchema)
    .max(6)
    .describe(
      'Certifications and training, most recent first. Dated entries read as continuous development rather than a static list.'
    ),
  languages: z
    .array(z.string())
    .max(5)
    .describe(
      'Statements about languages, never proficiency levels. e.g. "Slovak — first language", "English — working language since 2016". No CEFR levels.'
    ),
})

export type CvContent = z.infer<typeof CvContentSchema>
export type CvRole = z.infer<typeof CvRoleSchema>
export type CvBullet = z.infer<typeof CvBulletSchema>

/* ------------------------------------------------------------------ *
 * Cover letter
 * ------------------------------------------------------------------ */

export const CoverLetterParagraphSchema = z.object({
  text: z.string().describe('One paragraph, 2–5 sentences.'),
  factIds: factIds('this paragraph'),
})

export const CoverLetterSchema = z.object({
  recipient: z
    .string()
    .describe(
      'Company and team as addressed, e.g. "ABB — Electrification Product Team". Never an individual’s name.'
    ),
  subject: z
    .string()
    .describe('Subject line, e.g. "Application — Senior Product Manager".'),
  greeting: z
    .string()
    .describe('e.g. "Dear Hiring Team," — never a guessed personal name.'),
  paragraphs: z
    .array(CoverLetterParagraphSchema)
    .min(3)
    .max(5)
    .describe(
      'Opening (why this role, specifically), the evidence, the honest limit, and the close. Whole letter under one page.'
    ),
  closing: z.string().describe('e.g. "Best regards,"'),
  signature: z.string(),
})

export type CoverLetterContent = z.infer<typeof CoverLetterSchema>

/* ------------------------------------------------------------------ *
 * Combined document payload (one generation call produces both)
 * ------------------------------------------------------------------ */

export const DocumentBundleSchema = z.object({
  cv: CvContentSchema,
  coverLetter: CoverLetterSchema,
})

export type DocumentBundle = z.infer<typeof DocumentBundleSchema>
