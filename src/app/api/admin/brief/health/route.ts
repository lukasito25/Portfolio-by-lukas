/**
 * Can this environment generate?
 *
 * Generation needs the agent suite, which runs on Lukáš's machine. On Vercel
 * `127.0.0.1:8099` resolves to the serverless container's own loopback, so the
 * call fails with a 503 no matter how healthy the suite is at home.
 *
 * The panel asks this on load and, when the answer is no, replaces the
 * Generate form with the terminal command that does work — rather than
 * offering a button that returns 503 and looks like a broken feature.
 */

import { NextResponse } from 'next/server'
import { getProvider } from '@/lib/ai'
import { requireAdmin } from '@/lib/fit-brief/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const provider = getProvider()

  // Vercel sets this; a local `next dev` does not.
  const isServerless = Boolean(process.env.VERCEL)

  if (!provider.healthCheck) {
    return NextResponse.json({
      canGenerate: provider.isConfigured(),
      provider: provider.name,
      detail: provider.isConfigured() ? 'ready' : provider.configurationHint(),
      isServerless,
    })
  }

  const health = await provider.healthCheck()

  return NextResponse.json({
    canGenerate: health.ok,
    provider: provider.name,
    detail: health.detail,
    isServerless,
  })
}
