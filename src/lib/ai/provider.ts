/**
 * The AI provider interface the application engine is written against.
 *
 * Two implementations: the agent suite (Gemini, self-hosted, the default) and
 * Anthropic (kept as a fallback). Both expose the same two operations because
 * every provider we care about has the same constraint — a grounded web-search
 * call and a schema-constrained call cannot be the same request:
 *
 *   - Gemini rejects `response_schema` alongside the `google_search` tool
 *     outright: 400 "Tool use with a response mime type is unsupported".
 *   - Anthropic permits it, but the two-pass shape is more reliable there too.
 *
 * So the pipeline always researches first and structures second, and that
 * sequencing is baked into the interface rather than left to each caller.
 */

import type * as z from 'zod/v4'
import { sanitizeDeep } from './sanitize'

export interface GenerationAttachment {
  /** e.g. "application/pdf", "image/png" */
  mimeType: string
  /** Base64, without a data: prefix. */
  data: string
}

export interface Usage {
  inputTokens: number
  outputTokens: number
  /** What the provider itself reported, when it reports one. */
  costUsd?: number
}

export interface StructuredOptions<S extends z.ZodType> {
  schema: S
  system: string
  prompt: string
  attachments?: GenerationAttachment[]
  maxTokens?: number
}

export interface ResearchOptions {
  system: string
  prompt: string
  maxTokens?: number
}

export interface AIProvider {
  readonly name: string
  /** Whether the environment is configured to use this provider. */
  isConfigured(): boolean
  /** Explains what is missing when `isConfigured()` is false. */
  configurationHint(): string
  /** Optional fast reachability probe, for a CLI preflight. */
  healthCheck?(): Promise<{ ok: boolean; detail: string }>
  /** A schema-constrained generation. Throws on malformed output. */
  generateStructured<S extends z.ZodType>(
    options: StructuredOptions<S>
  ): Promise<{ value: z.infer<S>; usage: Usage }>
  /** A grounded web-search pass returning prose. */
  research(options: ResearchOptions): Promise<{ text: string; usage: Usage }>
}

/* ------------------------------------------------------------------ *
 * Shared errors
 * ------------------------------------------------------------------ */

export class ProviderUnavailableError extends Error {
  constructor(providerName: string, hint: string) {
    super(`The ${providerName} provider is not available. ${hint}`)
    this.name = 'ProviderUnavailableError'
  }
}

export class RefusalError extends Error {
  constructor(public category: string | null) {
    super(
      `The model declined this request${category ? ` (${category})` : ''}. Check the source material and try again.`
    )
    this.name = 'RefusalError'
  }
}

export class MalformedOutputError extends Error {
  constructor(
    message: string,
    public raw: string
  ) {
    super(message)
    this.name = 'MalformedOutputError'
  }
}

/* ------------------------------------------------------------------ *
 * Helpers shared by implementations
 * ------------------------------------------------------------------ */

export const emptyUsage = (): Usage => ({ inputTokens: 0, outputTokens: 0 })

export const addUsage = (a: Usage, b: Usage): Usage => ({
  inputTokens: a.inputTokens + b.inputTokens,
  outputTokens: a.outputTokens + b.outputTokens,
  costUsd:
    a.costUsd !== undefined || b.costUsd !== undefined
      ? (a.costUsd ?? 0) + (b.costUsd ?? 0)
      : undefined,
})

/**
 * Recover JSON from a response that wrapped it in a fence or a sentence.
 * Both providers are asked for bare JSON; neither always obliges.
 */
export function extractJson(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return trimmed

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced?.[1]) return fenced[1].trim()

  const firstBrace = trimmed.indexOf('{')
  const lastBrace = trimmed.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1)
  }
  return trimmed
}

/** Validate a parsed object against the schema, with a readable failure. */
export function validateAgainstSchema<S extends z.ZodType>(
  schema: S,
  parsed: unknown,
  raw: string
): z.infer<S> {
  const result = schema.safeParse(parsed)
  if (!result.success) {
    throw new MalformedOutputError(
      `The output did not match the expected shape: ${result.error.issues
        .slice(0, 3)
        .map(issue => `${issue.path.join('.')} ${issue.message}`)
        .join('; ')}`,
      raw
    )
  }
  // Every provider funnels through here, which makes it the one place that can
  // promise no generated text carries hidden characters into a document a
  // recruiter opens. See sanitize.ts for why that matters more than it sounds.
  return sanitizeDeep(result.data) as z.infer<S>
}
