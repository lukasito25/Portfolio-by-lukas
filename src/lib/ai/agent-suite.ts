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

/**
 * Cloud Run scales this service to zero, so the first request after an idle
 * period pays for a container boot: the suite imports eighteen agents plus the
 * Firestore client before it can answer. Measured cold start is well under this
 * budget, but a tight timeout here would report a healthy service as missing.
 */
const COLD_START_BUDGET_MS = 45_000
/** A warm service answers instantly; only the boot case needs patience. */
const WARM_TIMEOUT_MS = 8_000

function baseUrl(): string {
  return (process.env.AGENT_SUITE_URL || DEFAULT_URL).replace(/\/$/, '')
}

function clientKey(): string | undefined {
  return process.env.AGENT_SUITE_KEY?.trim() || undefined
}

/**
 * Is the suite somewhere other than this machine?
 *
 * Worth distinguishing because the two cases fail differently and need
 * different advice: a local suite that is down should be started, a remote one
 * that is down is an outage or a bad URL and no amount of `start-local.sh` will
 * help. Telling someone to run a command that cannot possibly fix their problem
 * is how a 503 turns into an afternoon.
 */
export function isRemote(): boolean {
  try {
    const { hostname } = new URL(baseUrl())
    return (
      hostname !== '127.0.0.1' && hostname !== 'localhost' && hostname !== '::1'
    )
  } catch {
    return false
  }
}

function unavailable(reason: string): ProviderUnavailableError {
  const advice = isRemote()
    ? `The suite is deployed at ${baseUrl()}. Check the service is up:\n    gcloud run services describe agent-suite --region us-central1 --project ai-agent-suite`
    : `Start it with:\n    cd "/Users/lukashosala/Documents/Antigravity AI apps/agent-suite" && ./start-local.sh`
  return new ProviderUnavailableError('agent-suite', `${reason}\n\n${advice}`)
}

/* ------------------------------------------------------------------ *
 * Authorisation
 * ------------------------------------------------------------------ */

interface CachedToken {
  token: string
  expiresAt: number
}

let cached: CachedToken | null = null

/**
 * What goes in the Authorization header.
 *
 * Two paths, and the reason for the split is Cloud Run rather than the suite.
 *
 * The suite's own scheme is a 24-hour JWT from `/api/v1/auth/session`. Sending
 * one of those to Cloud Run turned out to be a bad idea: its front end sometimes
 * tries to verify a bearer JWT as a Google-issued ID token and rejects the
 * request before it ever reaches the container —
 *
 *   The request was not authorized to invoke this service.
 *   The access token could not be verified.
 *
 * — which arrives as an HTML 401 that looks nothing like anything the app can
 * produce. It reproduced once during deployment verification and not on retry,
 * and an intermittent production-only 401 is the worst kind of bug to leave in
 * a pipeline that runs for minutes at a time.
 *
 * So when a shared key is configured we send *that* instead. It is an opaque
 * `token_urlsafe` string with no dots, so nothing upstream can mistake it for a
 * JWT, and the suite already accepts it directly. It also removes a round trip
 * per pipeline step. The session flow stays for the loopback case, where there
 * is no key and no Google front end in the path.
 */
async function authToken(): Promise<string> {
  const key = clientKey()
  if (key) return key

  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token

  let res: Response
  try {
    res = await fetch(`${baseUrl()}/api/v1/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(COLD_START_BUDGET_MS),
    })
  } catch {
    throw unavailable(`Nothing answered at ${baseUrl()}.`)
  }

  if (res.status === 401 || res.status === 403) {
    throw unavailable(
      `${baseUrl()} requires a key and AGENT_SUITE_KEY is not set.`
    )
  }

  if (!res.ok) {
    throw unavailable(`Could not get a session token (HTTP ${res.status}).`)
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
  const token = await authToken()

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
        `The agent suite did not respond within ${CALL_TIMEOUT_MS / 1000}s. It is up but the model call stalled — retry, and if it repeats check the service logs.`
      )
    }
    throw unavailable(`Could not reach ${baseUrl()}.`)
  }

  if (!res.ok) {
    const detail = await res
      .json()
      .then((d: { detail?: string }) => d.detail)
      .catch(() => null)

    if (res.status === 401 || res.status === 403) {
      throw unavailable(
        `${baseUrl()} rejected the key in AGENT_SUITE_KEY. It must match the API_SECRET_KEY the service was deployed with:\n    gcloud secrets versions access latest --secret=agent-suite-api-key --project=ai-agent-suite`
      )
    }

    // 429 is the suite's own daily cap, not a fault. Say so plainly — the
    // alternative is a bare "HTTP 429" that reads like an outage.
    if (res.status === 429) {
      throw new Error(
        detail || 'The agent suite has hit its daily call limit for this user.'
      )
    }

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
    // A loopback suite needs no key. A deployed one does, and saying so here
    // beats letting the panel offer a button that 401s.
    return !isRemote() || Boolean(clientKey())
  },

  /**
   * Preflight: can this environment actually generate?
   *
   * Two questions, because they fail differently and the panel gives different
   * advice for each — is the service reachable, and will it accept our key. A
   * check that only answered the first would light up the Generate button on a
   * deployment whose key was wrong, and the user would find out four minutes
   * into a run.
   */
  async healthCheck(): Promise<{ ok: boolean; detail: string }> {
    const remote = isRemote()

    if (remote && !clientKey()) {
      return {
        ok: false,
        detail: `AGENT_SUITE_KEY is not set, and ${baseUrl()} requires it`,
      }
    }

    const reachable = async (timeout: number) => {
      const res = await fetch(`${baseUrl()}/api/v1/health`, {
        signal: AbortSignal.timeout(timeout),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
    }

    try {
      await reachable(WARM_TIMEOUT_MS)
    } catch (error) {
      // Scale-to-zero means the first probe after an idle spell is a wake-up
      // call, not a failure. Locally there is nothing to wake, so one attempt
      // is the whole answer.
      if (!remote) {
        return { ok: false, detail: `nothing listening at ${baseUrl()}` }
      }
      try {
        await reachable(COLD_START_BUDGET_MS)
      } catch {
        return {
          ok: false,
          detail: `${baseUrl()} did not respond (${(error as Error).message})`,
        }
      }
    }

    if (!remote) return { ok: true, detail: baseUrl() }

    // Reachable. Now prove the key is the right one, because "up" and "will
    // accept us" are different facts and only the second one lets the panel
    // honestly offer a Generate button. `/costs` is the cheapest endpoint that
    // demands the key — it reads the meter and calls no model.
    try {
      const res = await fetch(`${baseUrl()}/api/v1/costs`, {
        headers: { Authorization: `Bearer ${clientKey()}` },
        signal: AbortSignal.timeout(WARM_TIMEOUT_MS),
      })
      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          detail: `${baseUrl()} rejected AGENT_SUITE_KEY`,
        }
      }
      if (!res.ok) {
        return { ok: false, detail: `${baseUrl()} answered HTTP ${res.status}` }
      }
    } catch {
      return {
        ok: false,
        detail: `${baseUrl()} did not complete the key check`,
      }
    }

    return { ok: true, detail: baseUrl() }
  },

  configurationHint() {
    if (isRemote() && !clientKey()) {
      return `${baseUrl()} requires a shared key. Set AGENT_SUITE_KEY to the API_SECRET_KEY the service was deployed with.`
    }
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
