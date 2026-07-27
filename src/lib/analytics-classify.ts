import { UAParser } from 'ua-parser-js'
import { isAIBot, isBot } from 'ua-parser-js/helpers'
import {
  Bots,
  CLIs,
  Crawlers,
  Emails,
  Fetchers,
  Libraries,
} from 'ua-parser-js/extensions'

/**
 * Server-side classification of a page view.
 *
 * Tracking happens in middleware (server-side), so anything that issues an HTTP
 * request gets recorded — CLI tools, crawlers, uptime monitors and email link
 * scanners included. At one point 34% of stored rows were automated. This module
 * is the single place those rules live so they can be tested and tuned.
 *
 * Note this is deliberately NOT imported by middleware.ts: that bundle is edge
 * runtime and already ~56 kB. Classification runs in the /api/analytics route
 * (Node), which already receives the user agent in its payload.
 */

/** Why a view was flagged. Surfaced in the dashboard so filtering is auditable. */
export type BotReason =
  | 'cli'
  | 'crawler'
  | 'ai-bot'
  | 'fetcher'
  | 'email-scanner'
  | 'headless'
  | 'empty-ua'
  | 'unknown-ua'

export interface UaClassification {
  isBot: boolean
  botReason: BotReason | null
  browser: string
  os: string
  deviceType: string
}

/* A parser primed with the extension lists. `isBot()` alone misses CLI tools and
   headless browsers; these give both detection and a readable name. */
const extendedParser = new UAParser({
  ...CLIs,
  ...Crawlers,
  ...Fetchers,
  ...Libraries,
  ...Emails,
  ...Bots,
})

/** Extension-matched names that identify the *kind* of automation. */
const REASON_HINTS: [RegExp, BotReason][] = [
  [/curl|wget|httpie|powershell/i, 'cli'],
  [/python|axios|node-fetch|go-http|java|okhttp|guzzle|libwww|urllib/i, 'cli'],
  [/headless|phantom|puppeteer|playwright|selenium/i, 'headless'],
  [
    /preview|safelink|outlook|thunderbird|mail|proofpoint|barracuda/i,
    'email-scanner',
  ],
  [
    /slack|discord|whatsapp|telegram|facebookexternalhit|twitterbot|linkedin|embed|unfurl/i,
    'fetcher',
  ],
  [
    /gptbot|claudebot|anthropic|ccbot|perplexity|oai-searchbot|bytespider/i,
    'ai-bot',
  ],
]

/**
 * Classify a user agent into bot status plus browser/OS/device.
 *
 * Verified against the user agents actually present in this project's data:
 * curl, python-requests, GPTBot, Googlebot, Slackbot and Outlook SafeLinks
 * (BingPreview) all flag as bots; a real Chrome UA does not and resolves to
 * Chrome / macOS / desktop.
 */
export function classifyUserAgent(ua?: string | null): UaClassification {
  const agent = (ua || '').trim()

  if (!agent) {
    return {
      isBot: true,
      botReason: 'empty-ua',
      browser: '',
      os: '',
      deviceType: '',
    }
  }

  const base = new UAParser(agent).getResult()
  const extended = extendedParser.setUA(agent).getResult()

  // Prefer the extension-matched name — it identifies "curl" or "Chrome
  // Headless" where the base parser only sees a generic browser.
  const name = extended.browser.name || base.browser.name || ''

  // An unidentifiable user agent is itself the signal: every mainstream browser
  // resolves to a known name, so a string nothing recognises is a script with a
  // custom UA. Caught in production when a hand-rolled "curl-selfcheck" agent
  // slipped past the pattern lists.
  const unknown = name === ''

  const flagged = isBot(agent) || /headless|phantomjs/i.test(name) || unknown

  let botReason: BotReason | null = null
  if (flagged) {
    if (isAIBot(agent)) {
      botReason = 'ai-bot'
    } else {
      botReason =
        REASON_HINTS.find(([pattern]) => pattern.test(name))?.[1] ??
        REASON_HINTS.find(([pattern]) => pattern.test(agent))?.[1] ??
        (unknown ? 'unknown-ua' : 'crawler')
    }
  }

  return {
    isBot: flagged,
    botReason,
    browser: flagged ? name : base.browser.name || '',
    os: flagged ? '' : base.os.name || '',
    // ua-parser leaves device.type undefined for desktops.
    deviceType: flagged ? '' : base.device.type || 'desktop',
  }
}

/**
 * Normalise a referrer into a groupable source host.
 *
 * Self-referrals collapse to 'direct' so in-site movement doesn't masquerade as
 * an acquisition channel, and `www.` is stripped so linkedin.com and
 * www.linkedin.com aggregate together.
 */
export function refHost(
  referrer?: string | null,
  selfHost?: string | null
): string {
  const raw = (referrer || '').trim()
  if (!raw) return 'direct'
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '')
    if (!host) return 'direct'
    if (selfHost && host === selfHost.replace(/^www\./, '')) return 'direct'
    return host.slice(0, 120)
  } catch {
    return 'direct'
  }
}
