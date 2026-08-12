/**
 * Step 1 of the application engine: read a job posting into a JobSpec.
 *
 * Four input kinds, each taking the shortest reliable path to the text:
 *
 * - `url`   → a deterministic ATS lookup first (Greenhouse, Lever, Ashby and
 *             Personio all publish posting JSON), falling back to a grounded
 *             research pass. Postings live on platforms that render
 *             client-side, so fetching the HTML server-side usually returns an
 *             empty shell — that is what happened with the ABB posting.
 * - `pdf`   → sent as an attachment; no text-extraction library involved.
 * - `image` → same, for a screenshot of a posting.
 * - `text`  → pasted straight in.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  getProvider,
  addUsage,
  emptyUsage,
  estimateCostUsd,
  type GenerationAttachment,
} from '@/lib/ai'
import { JobSpecSchema } from '@/lib/fit-brief/schema'
import {
  EXTRACT_SYSTEM,
  EXTRACT_FROM_RESEARCH_PROMPT,
  extractResearchPrompt,
} from '@/lib/fit-brief/prompts'
import { fetchAtsPosting, describeAtsPosting } from '@/lib/fit-brief/ats'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

/** Vercel caps the request body at 4.5 MB; stay clear of it. */
const MAX_FILE_BYTES = 4 * 1024 * 1024

const SUPPORTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const provider = getProvider()
    const body = await request.json()
    const kind = String(body.kind || '')

    let usage = emptyUsage()
    let prompt: string
    let attachments: GenerationAttachment[] | undefined
    let sourceUrl: string | null = null
    let extractionPath = kind

    if (kind === 'url') {
      const url = String(body.url || '').trim()
      if (!/^https?:\/\//i.test(url)) {
        return NextResponse.json(
          { error: 'Enter a full http(s) URL.' },
          { status: 400 }
        )
      }
      sourceUrl = url

      // Ask the ATS directly before asking a model to read a web page.
      const posting = await fetchAtsPosting(url)

      if (posting) {
        extractionPath = `ats:${posting.source}`
        prompt = `${EXTRACT_FROM_RESEARCH_PROMPT}\n\nPOSTING (retrieved directly from the ${posting.source} API — this is the authoritative text)\n${describeAtsPosting(posting)}`
      } else {
        const research = await provider.research({
          system: EXTRACT_SYSTEM,
          prompt: extractResearchPrompt(url),
        })
        usage = addUsage(usage, research.usage)
        extractionPath = 'grounded-research'
        prompt = `${EXTRACT_FROM_RESEARCH_PROMPT}\n\nRESEARCH\n${research.text}`
      }
    } else if (kind === 'pdf' || kind === 'image') {
      const data = String(body.data || '')
      const mediaType = String(body.mediaType || '')

      if (!data) {
        return NextResponse.json(
          { error: 'No file data received.' },
          { status: 400 }
        )
      }
      // base64 inflates by ~4/3; compare against the decoded size.
      if ((data.length * 3) / 4 > MAX_FILE_BYTES) {
        return NextResponse.json(
          {
            error:
              'That file is over 4 MB. Export a smaller PDF, or paste the text instead.',
          },
          { status: 413 }
        )
      }

      if (kind === 'pdf' && mediaType !== 'application/pdf') {
        return NextResponse.json({ error: 'Expected a PDF.' }, { status: 400 })
      }
      if (kind === 'image' && !SUPPORTED_IMAGE_TYPES.includes(mediaType)) {
        return NextResponse.json(
          { error: 'Supported image types are PNG, JPEG, WebP and GIF.' },
          { status: 400 }
        )
      }

      attachments = [{ mimeType: mediaType, data }]
      prompt =
        kind === 'pdf'
          ? 'Structure the job posting in the attached PDF.'
          : 'Structure the job posting shown in the attached image. Read every visible line.'
    } else if (kind === 'text') {
      const text = String(body.text || '').trim()
      if (text.length < 80) {
        return NextResponse.json(
          {
            error:
              'That looks too short to be a job posting. Paste the full text.',
          },
          { status: 400 }
        )
      }
      prompt = `Structure this job posting.\n\n${text}`
    } else {
      return NextResponse.json(
        { error: 'kind must be one of: url, pdf, image, text' },
        { status: 400 }
      )
    }

    const { value: jobSpec, usage: structureUsage } =
      await provider.generateStructured({
        schema: JobSpecSchema,
        system: EXTRACT_SYSTEM,
        prompt,
        attachments,
        maxTokens: 16000,
      })
    usage = addUsage(usage, structureUsage)

    return NextResponse.json({
      jobSpec,
      sourceUrl,
      sourceKind: kind,
      extractionPath,
      provider: provider.name,
      usage,
      costUsd: estimateCostUsd(usage),
    })
  } catch (error) {
    return generationError(error)
  }
}
