/**
 * The stored leads behind the Search tab in /admin/applications.
 *
 * Reading is separate from searching on purpose: opening the panel should show
 * what the last search found without spending three model calls to find it
 * again.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { withAlreadyApplied } from '@/lib/job-search/leads'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const states = request.nextUrl.searchParams.get('states')
    const leads = await dataService.listJobLeads({
      states: states ? states.split(',').filter(Boolean) : undefined,
      limit: Number(request.nextUrl.searchParams.get('limit')) || 200,
    })

    // Decoration is optional; the list is not. A brief lookup that fails must
    // not turn "here are your leads" into an error page.
    try {
      return NextResponse.json({ leads: await withAlreadyApplied(leads) })
    } catch (error) {
      console.error('[leads] already-applied decoration failed:', error)
      return NextResponse.json({ leads })
    }
  } catch (error) {
    return generationError(error)
  }
}
