/**
 * What changed in a CV or cover letter, as training pairs.
 *
 * The brief has had this since the engine was built (`diffBriefContent`), and
 * the documents did not — so a CV edited by hand was saved correctly and taught
 * the generator nothing. That is the wrong way round: the CV and the letter are
 * the documents he actually sends, and they are the ones he rewrites hardest.
 *
 * Only prose is compared. A changed `period`, a reordered skill or a corrected
 * email says nothing about voice, and mixing those in would dilute the examples
 * that do — twelve pairs are shown to the model, and they should all be
 * sentences.
 *
 * Items are matched by identity where one exists (a role's `roleId`) rather
 * than by position, so deleting the second of four roles does not report the
 * remaining two as rewritten.
 */

import type { EditPair } from '@/lib/style/learning'
import type { CoverLetterContent, CvContent } from './schema'

/** A field is worth learning from when both sides are prose and they differ. */
function compare(
  pairs: EditPair[],
  kind: EditPair['kind'],
  locale: string,
  path: string,
  before: unknown,
  after: unknown
) {
  if (typeof before !== 'string' || typeof after !== 'string') return
  if (!before.trim() || !after.trim()) return
  if (before.trim() === after.trim()) return
  pairs.push({ kind, locale, path, before, after })
}

export function diffCvContent(
  before: CvContent | undefined,
  after: CvContent | undefined,
  locale: string
): EditPair[] {
  if (!before || !after) return []

  const pairs: EditPair[] = []

  compare(pairs, 'cv', locale, 'headline', before.headline, after.headline)
  compare(pairs, 'cv', locale, 'summary', before.summary, after.summary)

  // Roles are matched on roleId. Position would be wrong the moment one is
  // dropped for a posting, which is a normal thing to do.
  for (const beforeRole of before.roles) {
    const afterRole = after.roles.find(r => r.roleId === beforeRole.roleId)
    if (!afterRole) continue

    beforeRole.bullets.forEach((bullet, index) => {
      const match = afterRole.bullets[index]
      if (!match) return
      const base = `roles.${beforeRole.roleId}.bullets[${index}]`
      compare(pairs, 'cv', locale, `${base}.text`, bullet.text, match.text)
      // The bold lead-in is three words and carries real signal about how he
      // frames an achievement, so it is learned from too.
      compare(pairs, 'cv', locale, `${base}.label`, bullet.label, match.label)
    })
  }

  return pairs
}

export function diffCoverLetter(
  before: CoverLetterContent | undefined,
  after: CoverLetterContent | undefined,
  locale: string
): EditPair[] {
  if (!before || !after) return []

  const pairs: EditPair[] = []

  compare(pairs, 'letter', locale, 'subject', before.subject, after.subject)
  compare(pairs, 'letter', locale, 'greeting', before.greeting, after.greeting)

  before.paragraphs.forEach((paragraph, index) => {
    const match = after.paragraphs[index]
    if (!match) return
    compare(
      pairs,
      'letter',
      locale,
      `paragraphs[${index}].text`,
      paragraph.text,
      match.text
    )
  })

  compare(pairs, 'letter', locale, 'closing', before.closing, after.closing)

  return pairs
}
