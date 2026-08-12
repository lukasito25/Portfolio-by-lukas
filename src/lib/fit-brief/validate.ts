/**
 * Post-generation checks.
 *
 * The model is instructed to cite a fact id for every claim, but instructions
 * are not a guarantee. This module verifies what actually came back and turns
 * anything questionable into a warning the review screen shows before you
 * publish — the point is that a doubtful claim is visible, not that it is
 * silently dropped.
 */

import { partitionCitations, getFact } from '@/lib/career-facts'
import type { BriefWarning, FitBriefContent, Brand } from './schema'
import { isHexColor } from './schema'
import type { CvContent, CoverLetterContent } from '@/lib/documents/schema'

/* ------------------------------------------------------------------ *
 * Contrast
 * ------------------------------------------------------------------ */

/** The site's own surface colours, from globals.css. */
const LIGHT_BG = '#fafafc'
const DARK_BG = '#07070d'
const AA_NORMAL = 4.5

function srgbToLinear(channel: number): number {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  )
}

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [light, dark] = la > lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

export function checkBrand(brand: Brand): BriefWarning[] {
  const warnings: BriefWarning[] = []

  for (const [key, bg, mode] of [
    ['accentLight', LIGHT_BG, 'light'],
    ['accentDark', DARK_BG, 'dark'],
  ] as const) {
    const value = brand[key]
    if (!value || !isHexColor(value)) {
      warnings.push({
        code: 'schema',
        severity: 'blocker',
        message: `brand.${key} is not a #rrggbb colour, so the page would fall back to the site accent.`,
        path: `brand.${key}`,
      })
      continue
    }
    const ratio = contrastRatio(value, bg)
    if (ratio < AA_NORMAL) {
      warnings.push({
        code: 'contrast',
        severity: 'review',
        message: `The ${mode}-mode accent ${value} only reaches ${ratio.toFixed(2)}:1 against the ${mode} background — WCAG AA needs 4.5:1. Accent text and badges will be hard to read.`,
        path: `brand.${key}`,
      })
    }
  }

  return warnings
}

/* ------------------------------------------------------------------ *
 * Traceability
 * ------------------------------------------------------------------ */

interface Citation {
  path: string
  ids: string[]
  /** The text the citation is meant to support, for the warning message. */
  text: string
}

function collectBriefCitations(content: FitBriefContent): Citation[] {
  const out: Citation[] = []

  content.hero.stats.forEach((stat, i) => {
    out.push({
      path: `hero.stats[${i}]`,
      ids: stat.factIds,
      text: `${stat.value} — ${stat.label}`,
    })
  })

  content.roleMapSection.items.forEach((item, i) => {
    out.push({
      path: `roleMapSection.items[${i}]`,
      ids: item.factIds,
      text: item.title,
    })
  })

  content.profileMatchSection.panels.forEach((panel, p) => {
    panel.rows.forEach((row, r) => {
      out.push({
        path: `profileMatchSection.panels[${p}].rows[${r}]`,
        ids: row.factIds,
        text: row.requirement,
      })
    })
  })

  content.spotlight.pillars.forEach((pillar, i) => {
    out.push({
      path: `spotlight.pillars[${i}]`,
      ids: pillar.factIds,
      text: pillar.title,
    })
  })

  return out
}

function collectCvCitations(cv: CvContent): Citation[] {
  const out: Citation[] = []
  cv.roles.forEach((role, r) => {
    role.bullets.forEach((bullet, b) => {
      out.push({
        path: `cv.roles[${r}].bullets[${b}]`,
        ids: bullet.factIds,
        text: bullet.text,
      })
    })
  })
  return out
}

function collectLetterCitations(letter: CoverLetterContent): Citation[] {
  return letter.paragraphs.map((p, i) => ({
    path: `coverLetter.paragraphs[${i}]`,
    ids: p.factIds,
    text: p.text.slice(0, 80),
  }))
}

function auditCitations(
  citations: Citation[],
  locale?: string
): BriefWarning[] {
  const warnings: BriefWarning[] = []

  for (const citation of citations) {
    const { invalid } = partitionCitations(citation.ids)

    if (invalid.length) {
      warnings.push({
        code: 'unknown-fact-id',
        severity: 'blocker',
        message: `Cites ${invalid.map(id => `"${id}"`).join(', ')}, which ${invalid.length === 1 ? 'is not a fact' : 'are not facts'} in the corpus. The claim cannot be checked: “${citation.text}”`,
        path: citation.path,
        locale,
      })
      continue
    }

    if (citation.ids.length === 0) {
      warnings.push({
        code: 'untraceable-claim',
        severity: 'review',
        message: `No fact cited for “${citation.text}”. Confirm it is defensible or remove it.`,
        path: citation.path,
        locale,
      })
    }

    // The Sprinklr licence figure is published, but it has been queried as
    // potentially NDA-sensitive. Flag it every time so it stays a decision.
    if (citation.ids.includes('adidas.sprinklr')) {
      warnings.push({
        code: 'nda-sensitive',
        severity: 'review',
        message:
          'Uses the €1M Sprinklr licence figure. It is published on the portfolio, but has previously been flagged as possibly NDA-sensitive — your call whether it stays.',
        path: citation.path,
        locale,
      })
    }
  }

  return warnings
}

/* ------------------------------------------------------------------ *
 * Language-proficiency claims
 * ------------------------------------------------------------------ */

/**
 * The levels he actually states, on his own CV.
 *
 * An earlier version of this check blocked every CEFR level on the assumption
 * that none had ever been stated. Reading his real CV disproved that: it says
 * "Slovak (Native) | English (Fluent, C2) | Italian (Professional, B2)", and
 * the check was rejecting his own truthful line.
 *
 * The real rule was always "do not invent a level", so that is what this now
 * enforces: his stated levels pass, anything else is flagged.
 */
const STATED_LEVELS: Record<string, string> = {
  slovak: 'native',
  english: 'c2',
  italian: 'b2',
}

/** A language mentioned with a CEFR level or a fluency word. */
const LEVEL_CLAIM =
  /\b(slovak|slowakisch|slovacco|english|englisch|inglese|italian|italienisch|italiano|german|deutsch|tedesco|spanish|french|dutch|nederlands)\b[^.;|\n]{0,40}?\b([ABC][12]|native|fluent|mother ?tongue|native speaker|bilingual|muttersprach\w*|madrelingua|fließend|fluente|verhandlungssicher|business (?:level|proficien\w*)|professional working proficiency)\b/gi

/**
 * Flags an invented or upgraded language claim.
 *
 * Passes his stated levels. Flags a level for a language he has never rated
 * (German is the live risk — three years in Vienna, no level ever claimed) and
 * any level that does not match what his CV says.
 */
export function checkLanguageClaims(
  text: string,
  path: string,
  locale?: string
): BriefWarning[] {
  const warnings: BriefWarning[] = []

  for (const match of text.matchAll(LEVEL_CLAIM)) {
    const language = match[1].toLowerCase()
    const level = match[2].toLowerCase()

    // Normalise the language name to its English key.
    const key = language.startsWith('slov')
      ? 'slovak'
      : language.startsWith('eng') || language.startsWith('ingl')
        ? 'english'
        : language.startsWith('ital')
          ? 'italian'
          : language

    const stated = STATED_LEVELS[key]

    if (!stated) {
      warnings.push({
        code: 'language-claim',
        severity: 'blocker',
        message: `Claims a level for ${match[1]}, which he has never rated on any CV. Working in a country is not a proficiency claim — if the posting needs it, put it in the gap section instead.`,
        path,
        locale,
      })
      continue
    }

    // "Fluent" is how his CV labels C2 English, so accept it there.
    const acceptable =
      level === stated ||
      (stated === 'c2' && ['fluent', 'c2'].includes(level)) ||
      (stated === 'native' &&
        ['native', 'mother tongue', 'mothertongue', 'native speaker'].includes(
          level
        ))

    if (!acceptable) {
      warnings.push({
        code: 'language-claim',
        severity: 'blocker',
        message: `States ${match[1]} as "${match[2]}", but his CV says ${stated.toUpperCase()}. Do not upgrade a level.`,
        path,
        locale,
      })
    }
  }

  return warnings
}

/* ------------------------------------------------------------------ *
 * AI overclaiming
 * ------------------------------------------------------------------ */

/**
 * Phrases that drift toward "he built the AI".
 *
 * The single most-repeated correction he has made: he builds AI solutions on a
 * managed suite, and does not author model architectures or do research-level
 * ML. The traceability check does not catch this, because the sentence can cite
 * a perfectly good fact and still be phrased in a way that overclaims — a
 * generated CV bullet read "designed and built the core AI-powered scoring
 * engine", which is cited, defensible on a generous reading, and still exactly
 * the wording he has asked to avoid.
 */
const AI_OVERCLAIM_PATTERNS: [RegExp, string][] = [
  // "built the AI" overclaims; "built AI solutions" is the approved framing,
  // so the negative lookahead is load-bearing rather than defensive.
  [
    /\b(built|created|developed|designed)\s+(the\s+)?(AI|ML|machine[- ]learning)\b(?!\s+(solution|suite|tool|product|feature|workflow))/i,
    'implies he built the AI itself',
  ],
  [
    /\bAI[- ]powered\b/i,
    'reads as a claim about the technology rather than what he did',
  ],
  [
    /\b(model|neural|deep[- ]learning)\s+architectur/i,
    'implies model architecture work',
  ],
  [/\bproprietary\s+(AI|ML|model|algorithm)/i, 'implies original model work'],
  [
    /\b(trained|built)\s+(a|the|our)\s+(model|LLM|neural)/i,
    'implies training a model from scratch',
  ],
]

export function checkAiFraming(
  text: string,
  path: string,
  locale?: string
): BriefWarning[] {
  for (const [pattern, why] of AI_OVERCLAIM_PATTERNS) {
    if (pattern.test(text)) {
      return [
        {
          code: 'ai-overclaim',
          severity: 'review',
          message: `Phrasing ${why}. He builds AI solutions on Google AI Studio and Vertex AI — including training, tuning and evaluating models — but does not author architectures. Reword before sending.`,
          path,
          locale,
        },
      ]
    }
  }
  return []
}

/* ------------------------------------------------------------------ *
 * Entry points
 * ------------------------------------------------------------------ */

export function validateBriefContent(
  content: FitBriefContent,
  locale: string
): BriefWarning[] {
  const warnings = auditCitations(collectBriefCitations(content), locale)

  // Free text that could carry an invented proficiency claim.
  const textFields: [string, string][] = [
    ['hero.description', content.hero.description],
    ['gap.body', content.gap.body],
    ['closing.body', content.closing.body],
    ['spotlight.lede', content.spotlight.lede],
    ...content.roleMapSection.items.map(
      (item, i) =>
        [`roleMapSection.items[${i}].body`, item.body] as [string, string]
    ),
  ]
  for (const [path, text] of textFields) {
    warnings.push(...checkLanguageClaims(text, path, locale))
    warnings.push(...checkAiFraming(text, path, locale))
  }

  for (const [p, panel] of content.profileMatchSection.panels.entries()) {
    for (const [r, row] of panel.rows.entries()) {
      warnings.push(
        ...checkAiFraming(
          row.proof,
          `profileMatchSection.panels[${p}].rows[${r}].proof`,
          locale
        )
      )
    }
  }

  return warnings
}

export function validateDocuments(
  cv: CvContent,
  letter: CoverLetterContent,
  locale: string
): BriefWarning[] {
  const warnings = [
    ...auditCitations(collectCvCitations(cv), locale),
    ...auditCitations(collectLetterCitations(letter), locale),
  ]

  warnings.push(...checkLanguageClaims(cv.summary, 'cv.summary', locale))
  warnings.push(...checkAiFraming(cv.summary, 'cv.summary', locale))
  warnings.push(...checkAiFraming(cv.headline, 'cv.headline', locale))
  cv.roles.forEach((role, r) => {
    role.bullets.forEach((bullet, b) => {
      warnings.push(
        ...checkAiFraming(bullet.text, `cv.roles[${r}].bullets[${b}]`, locale)
      )
    })
  })
  cv.languages.forEach((line, i) => {
    warnings.push(...checkLanguageClaims(line, `cv.languages[${i}]`, locale))
  })
  letter.paragraphs.forEach((p, i) => {
    warnings.push(
      ...checkLanguageClaims(p.text, `coverLetter.paragraphs[${i}]`, locale)
    )
    warnings.push(
      ...checkAiFraming(p.text, `coverLetter.paragraphs[${i}]`, locale)
    )
  })

  // The coaching domain must never appear as the portfolio.
  cv.links.forEach((link, i) => {
    if (link.includes('lukashosala.com')) {
      warnings.push({
        code: 'schema',
        severity: 'blocker',
        message:
          'Links to lukashosala.com, which is the separate football-coaching site. The portfolio is portfolio-by-lukas.vercel.app.',
        path: `cv.links[${i}]`,
        locale,
      })
    }
  })

  return warnings
}

/** Human-readable expansion of a fact id, for the review screen. */
export function describeFact(id: string): string {
  return getFact(id)?.claim ?? `Unknown fact "${id}"`
}

/** Blockers first — that is the order the review screen should show them in. */
export function sortWarnings(warnings: BriefWarning[]): BriefWarning[] {
  const rank = (w: BriefWarning) => (w.severity === 'blocker' ? 0 : 1)
  return [...warnings].sort((a, b) => rank(a) - rank(b))
}
