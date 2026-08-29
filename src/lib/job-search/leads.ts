/**
 * Lead helpers shared by the search route and the leads routes.
 *
 * Lives here rather than next to a handler because a Next.js route file may
 * only export HTTP methods and the segment config — anything else is a build
 * error, and it would be a build error that only shows up on the deploy.
 */

import { dataService } from '@/lib/data-service'
import { normalizeUrl } from './verify'

/**
 * Flag leads at companies he has already written an application for.
 *
 * Matched on the normalised source URL first, then on the company name, because
 * a second posting at the same company is worth knowing about even though it is
 * not the same posting — "you already applied to Qonto in June" changes how he
 * reads the row.
 *
 * Computed per request rather than stored: a brief written after the lead was
 * saved still has to show up here, and a stored flag would go stale silently.
 */
export async function withAlreadyApplied<
  T extends { url: string; companyName?: string },
>(leads: T[]): Promise<(T & { alreadyApplied: boolean })[]> {
  const briefs = (await dataService.listBriefs()) as {
    sourceUrl?: string | null
    companyName?: string
  }[]

  const urls = new Set(
    briefs
      .map(brief => (brief.sourceUrl ? normalizeUrl(brief.sourceUrl) : ''))
      .filter(Boolean)
  )
  const companies = new Set(
    briefs
      .map(brief => (brief.companyName ?? '').trim().toLowerCase())
      .filter(Boolean)
  )

  return leads.map(lead => ({
    ...lead,
    alreadyApplied:
      urls.has(normalizeUrl(lead.url)) ||
      companies.has((lead.companyName ?? '').trim().toLowerCase()),
  }))
}
