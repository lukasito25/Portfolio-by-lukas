/**
 * List every generated brief, for the admin panel's index.
 */

import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const briefs = await dataService.listBriefs()
    return NextResponse.json({ briefs })
  } catch (error) {
    console.error('[application-engine] list failed:', error)
    return NextResponse.json(
      { error: 'Could not load briefs.' },
      { status: 500 }
    )
  }
}
