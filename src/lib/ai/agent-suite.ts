/**
 * The default provider: Lukáš's own agent suite, backed by Gemini.
 *
 * Runs locally during development (`python3 -m uvicorn api_production:app`) and
 * can later be pointed at a deployed instance by changing one environment
 * variable — the wire contract is identical either way.
 *
 * Why this rather than a hosted model API: the suite already holds the Gemini
 * key pool, usage metering and grounded search, it costs nothing on the free
 * tier, and it keeps job-application material on infrastructure he owns.
 *
 * Division of ownership worth preserving: the suite's `application-writer`
 * agent knows *how* to write application material. Everything about *him* —
 * the career facts, what may be claimed, his voice — is sent per request as
 * `system_extra` from this repository, next to the site content it derives
 * from. Copying the facts into the suite would recreate exactly the drift this
 * design avoids.
 */

import * as z from 'zod/v4'
import {
  type AIProvider,
  type ResearchOptions,
  type StructuredOptions,
  type Usage,
  MalformedOutputError,
  ProviderUnavailableError,
  validateAgainstSchema,
} from './provider'

const DEFAULT_URL = 'http://127.0.0.1:8099'
const AGENT_ID = 'application-writer'
/** Grounded research uses the general assistant — it has search enabled. */
const RESEARCH_AGENT_ID = 'general'
const USER_ID = 'portfolio_engine'
const CALL_TIMEOUT_MS = 300_000

function baseUrl(): string {
  return (process.env.AGENT_SUITE_URL || DEFAULT_URL).replace(/\/$/, '')
}

/* ------------------------------------------------------------------ *
 * Session tokens
 * ------------------------------------------------------------------ */

interface CachedToken {
  token: string
  expiresAt: number
}

let cached: CachedToken | null = null

/**
 * The suite issues anonymous 24-hour session tokens. Cache one per process and
 * refresh a little early, so a long generation can't have its token expire
 * between steps.
 */
async function sessionToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  let res: Response
  try {
    res = await fetch(`${baseUrl()}/api/v1/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    throw new ProviderUnavailableError(
      'agent-suite',
      `Nothing is listening at ${baseUrl()}. Start it with:\n    cd "/Users/lukashosala/Documents/Antigravity AI apps/agent-suite" && ./start-local.sh`
    )
  }

  if (!res.ok) {
    throw new ProviderUnavailableError(
      'agent-suite',
      `Could not get a session token (HTTP ${res.status}). Is the service running at ${baseUrl()}?`
    )
  }

  const data = (await res.json()) as {
    session_token: string
    expires_in?: number
  }
  cached = {
    token: data.session_token,
    expiresAt: Date.now() + (data.expires_in ?? 86400) * 1000 - 300_000,
  }
  return cached.token
}

/* ------------------------------------------------------------------ *
 * Requests
 * ------------------------------------------------------------------ */

interface GenerateBody {
  agent_id: string
  prompt: string
  user_id: string
  system_extra?: string
  schema?: unknown
  grounding?: boolean
  max_output_tokens?: number
  attachments?: { mime_type: string; data: string }[]
}

interface GenerateResult {
  agent_id: string
  model: string
  grounded: boolean
  result: unknown
  usage: { tokens_used: number; cost_usd: number; response_time_ms: number }
}

async function call(body: GenerateBody): Promise<GenerateResult> {
  const token = await sessionToken()

  let res: Response
  try {
    res = await fetch(`${baseUrl()}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      // A generation on gemini-2.5-pro runs 20-90s; five minutes is generous.
      // Without a ceiling a stalled call hangs the pipeline indefinitely, which
      // looks exactly like a crash from the terminal.
      signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
    })
  } catch (error) {
    if ((error as Error)?.name === 'TimeoutError') {
      throw new Error(
        `The agent suite did not respond within ${CALL_TIMEOUT_MS / 1000}s. It is running but the model call stalled — check its terminal window, then retry.`
      )
    }
    throw new ProviderUnavailableError(
      'agent-suite',
      `Could not reach ${baseUrl()}. Start it with:\n    cd "/Users/lukashosala/Documents/Antigravity AI apps/agent-suite" && ./start-local.sh`
    )
  }

  if (!res.ok) {
    const detail = await res
      .json()
      .then((d: { detail?: string }) => d.detail)
      .catch(() => null)

    // 502 is the suite's signal for malformed or truncated model output, which
    // is worth retrying; everything else is a real configuration problem.
    if (res.status === 502) {
      throw new MalformedOutputError(
        detail || 'The model returned malformed JSON.',
        ''
      )
    }
    throw new Error(detail || `Agent suite returned HTTP ${res.status}`)
  }

  return (await res.json()) as GenerateResult
}

/**
 * The suite reports one token count rather than an input/output split, so
 * attribute it to input — the figure is only used for a rough cost readout, and
 * over-reporting input is the conservative direction.
 */
function toUsage(usage: GenerateResult['usage']): Usage {
  return {
    inputTokens: usage.tokens_used,
    outputTokens: 0,
    costUsd: usage.cost_usd,
  }
}

export const agentSuiteProvider: AIProvider = {
  name: 'agent-suite',

  isConfigured() {
    // No API key of its own — availability is whether the service answers,
    // which `call` reports with an actionable message when it does not.
    return true
  },

  /** Fast preflight so the CLI fails in seconds, not minutes. */
  async healthCheck(): Promise<{ ok: boolean; detail: string }> {
    try {
      const res = await fetch(`${baseUrl()}/api/v1/health`, {
        signal: AbortSignal.timeout(5_000),
      })
      if (!res.ok) {
        return { ok: false, detail: `responded HTTP ${res.status}` }
      }
      return { ok: true, detail: baseUrl() }
    } catch {
      return { ok: false, detail: `nothing listening at ${baseUrl()}` }
    }
  },

  configurationHint() {
    return `Expected the agent suite at ${baseUrl()}. Set AGENT_SUITE_URL to change it.`
  },

  async generateStructured<S extends z.ZodType>({
    schema,
    system,
    prompt,
    attachments,
    maxTokens = 32768,
  }: StructuredOptions<S>) {
    // Gemini takes a plain JSON Schema; zod v4 emits one directly.
    const jsonSchema = z.toJSONSchema(schema, { io: 'output' })

    const attempt = async (extraInstruction?: string) => {
      const response = await call({
        agent_id: AGENT_ID,
        prompt: extraInstruction ? `${prompt}\n\n${extraInstruction}` : prompt,
        user_id: USER_ID,
        system_extra: system,
        schema: jsonSchema,
        max_output_tokens: maxTokens,
        attachments: attachments?.map(a => ({
          mime_type: a.mimeType,
          data: a.data,
        })),
      })

      const raw =
        typeof response.result === 'string'
          ? response.result
          : JSON.stringify(response.result)
      const parsed =
        typeof response.result === 'string' ? JSON.parse(raw) : response.result

      return {
        value: validateAgainstSchema(schema, parsed, raw),
        usage: toUsage(response.usage),
      }
    }

    try {
      return await attempt()
    } catch (error) {
      // Array length bounds are stripped from the schema before it reaches
      // Gemini — its constrained decoder refuses nested bounded arrays — so
      // they are advisory to the model and only enforced here on the way back.
      // That means an occasional violation is expected rather than
      // exceptional: one run returned a single CV bullet where the schema
      // wants two. Retrying once with the exact complaint fixes it far more
      // cheaply than failing a four-minute pipeline.
      if (!(error instanceof MalformedOutputError)) throw error

      return attempt(
        `Your previous response was rejected: ${error.message}\n\nReturn the whole object again, corrected. Pay particular attention to any stated minimum and maximum item counts — they are enforced.`
      )
    }
  },

  async research({ system, prompt, maxTokens = 8192 }: ResearchOptions) {
    const response = await call({
      agent_id: RESEARCH_AGENT_ID,
      prompt,
      user_id: USER_ID,
      system_extra: system,
      grounding: true,
      max_output_tokens: maxTokens,
    })

    return {
      text: String(response.result ?? ''),
      usage: toUsage(response.usage),
    }
  },
}
