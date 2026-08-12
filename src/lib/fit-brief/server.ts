/**
 * Shared server helpers for the application-engine routes.
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  ProviderUnavailableError,
  RefusalError,
  MalformedOutputError,
} from '@/lib/ai'

/**
 * Every route in the engine is admin-only. Returns null when the caller is
 * authenticated, or the 401 response to return when they are not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}

/**
 * Turn a generation failure into something the admin panel can display.
 * Generation runs for minutes, so a bare 500 with no explanation is expensive
 * — the message needs to say what to do next.
 */
export function generationError(error: unknown): NextResponse {
  if (error instanceof ProviderUnavailableError) {
    return NextResponse.json(
      { error: error.message, code: 'provider-unavailable' },
      { status: 503 }
    )
  }

  if (error instanceof RefusalError) {
    return NextResponse.json(
      { error: error.message, code: 'refusal' },
      { status: 422 }
    )
  }

  if (error instanceof MalformedOutputError) {
    console.error(
      '[application-engine] malformed output:',
      error.raw.slice(0, 2000)
    )
    return NextResponse.json(
      { error: error.message, code: 'malformed-output' },
      { status: 502 }
    )
  }

  console.error('[application-engine]', error)
  const message =
    error instanceof Error ? error.message : 'Generation failed unexpectedly.'
  return NextResponse.json({ error: message, code: 'unknown' }, { status: 500 })
}

/**
 * Company name → URL slug. Collisions are resolved by the caller against the
 * existing briefs, because a second application to the same company is normal.
 */
export function slugify(input: string): string {
  return (
    input
      .normalize('NFD')
      // Strip diacritics so "Union Bancaire Privée" becomes "union-bancaire-privee".
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'brief'
  )
}

/** A ref tag must never identify a person — see /privacy. */
const NAME_LIKE = /^[a-z]+[-.]?[a-z]+$/i
const ALLOWED_REFS = new Set([
  'recruiter',
  'application',
  'linkedin',
  'linkedin-post',
  'email',
  'referral',
  'direct',
])

export function isSafeRef(ref: string): boolean {
  const value = ref.trim().toLowerCase()
  if (!value) return false
  if (ALLOWED_REFS.has(value)) return true
  // A company name is fine; a two-part word pair that looks like a person's
  // name is not, because /privacy states these tags do not identify people.
  if (NAME_LIKE.test(value) && value.includes('-')) return false
  return /^[a-z0-9-]+$/.test(value)
}

/** URL-safe random token for draft previews. */
export function previewToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}
