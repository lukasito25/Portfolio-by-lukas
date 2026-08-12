/**
 * Can this environment generate?
 *
 * Generation needs the agent suite. Where that suite lives decides what the
 * panel should say when it cannot be reached, and the two cases want opposite
 * advice: a loopback suite that is down should be started, a Cloud Run one that
 * is down is an outage and no local command will help. So the answer carries
 * `remote` alongside the verdict.
 *
 * The panel asks this on load and, when the answer is no, replaces the Generate
 * form with whichever recovery actually applies — rather than offering a button
 * that returns 503 and looks like a broken feature.
 */

import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/ai'
import { isRemote } from '@/lib/ai/agent-suite'
import { requireAdmin } from '@/lib/fit-brief/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const provider = getProvider()

  // Vercel sets this; a local `next dev` does not.
  const isServerless = Boolean(process.env.VERCEL)

  // Only the agent suite has a notion of "somewhere else"; every other provider
  // is an API call and is remote by definition.
  const remote = provider.name === 'agent-suite' ? isRemote() : true

  if (!provider.healthCheck) {
    return NextResponse.json({
      canGenerate: provider.isConfigured(),
      provider: provider.name,
      detail: provider.isConfigured() ? 'ready' : provider.configurationHint(),
      isServerless,
      remote,
    })
  }

  const health = await provider.healthCheck()

  return NextResponse.json({
    canGenerate: health.ok,
    provider: provider.name,
    detail: health.detail,
    isServerless,
    remote,
  })
}
