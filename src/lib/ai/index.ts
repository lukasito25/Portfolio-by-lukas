/**
 * Provider selection.
 *
 * Default is the agent suite: it costs nothing on its free tier, keeps
 * application material on infrastructure Lukáš owns, and has grounded search
 * built in. Set AI_PROVIDER=anthropic to use Anthropic instead.
 */

import { agentSuiteProvider } from './agent-suite'
import { anthropicProvider } from './anthropic'
import type { AIProvider } from './provider'

export * from './provider'

const PROVIDERS: Record<string, AIProvider> = {
  'agent-suite': agentSuiteProvider,
  anthropic: anthropicProvider,
}

export function getProvider(): AIProvider {
  const requested = (process.env.AI_PROVIDER || 'agent-suite').toLowerCase()
  const provider = PROVIDERS[requested]

  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER "${requested}". Valid values: ${Object.keys(PROVIDERS).join(', ')}`
    )
  }

  return provider
}

/** Rough spend for the cost readout, using whatever the provider reported. */
export function estimateCostUsd(usage: {
  inputTokens: number
  outputTokens: number
  costUsd?: number
}): number {
  if (usage.costUsd !== undefined) return usage.costUsd

  // Anthropic list prices, used only when the provider reports no cost itself.
  const INPUT_PER_MTOK = 5
  const OUTPUT_PER_MTOK = 25
  return (
    (usage.inputTokens / 1_000_000) * INPUT_PER_MTOK +
    (usage.outputTokens / 1_000_000) * OUTPUT_PER_MTOK
  )
}
