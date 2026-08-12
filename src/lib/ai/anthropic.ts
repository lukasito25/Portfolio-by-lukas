/**
 * Fallback provider: Anthropic.
 *
 * Not the default. It is kept because it needs no local service running, which
 * makes it the sensible choice if the engine is ever driven from a deployed
 * environment before the agent suite is deployed alongside it.
 *
 * Selected with AI_PROVIDER=anthropic; requires ANTHROPIC_API_KEY.
 */

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import type * as z from 'zod/v4'
import {
  type AIProvider,
  type ResearchOptions,
  type StructuredOptions,
  type Usage,
  addUsage,
  emptyUsage,
  extractJson,
  MalformedOutputError,
  ProviderUnavailableError,
  RefusalError,
  validateAgainstSchema,
} from './provider'

const MODEL = 'claude-opus-5'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ProviderUnavailableError(
      'anthropic',
      anthropicProvider.configurationHint()
    )
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

function textOf(message: Anthropic.Messages.Message): string {
  return message.content
    .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('\n')
}

export const anthropicProvider: AIProvider = {
  name: 'anthropic',

  isConfigured() {
    return Boolean(process.env.ANTHROPIC_API_KEY)
  },

  configurationHint() {
    return 'Set ANTHROPIC_API_KEY, or use the default agent-suite provider instead.'
  },

  async generateStructured<S extends z.ZodType>({
    schema,
    system,
    prompt,
    attachments,
    maxTokens = 32000,
  }: StructuredOptions<S>) {
    const anthropic = getClient()

    const content: Anthropic.Messages.ContentBlockParam[] = []
    for (const attachment of attachments ?? []) {
      if (attachment.mimeType === 'application/pdf') {
        content.push({
          type: 'document',
          source: {
            type: 'base64',
            media_type: 'application/pdf',
            data: attachment.data,
          },
        })
      } else {
        content.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: attachment.mimeType as 'image/png',
            data: attachment.data,
          },
        })
      }
    }
    content.push({ type: 'text', text: prompt })

    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: maxTokens,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high', format: zodOutputFormat(schema) },
      system,
      messages: [{ role: 'user', content }],
    })

    const message = await stream.finalMessage()

    if (message.stop_reason === 'refusal') {
      throw new RefusalError(message.stop_details?.category ?? null)
    }

    const raw = textOf(message)

    if (message.stop_reason === 'max_tokens') {
      throw new MalformedOutputError(
        'The response hit the token ceiling before it was complete. Try again, or shorten the source material.',
        raw
      )
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(extractJson(raw))
    } catch {
      throw new MalformedOutputError(
        'The model did not return valid JSON.',
        raw
      )
    }

    return {
      value: validateAgainstSchema(schema, parsed, raw),
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      } satisfies Usage,
    }
  },

  async research({ system, prompt, maxTokens = 16000 }: ResearchOptions) {
    const anthropic = getClient()
    const messages: Anthropic.Messages.MessageParam[] = [
      { role: 'user', content: prompt },
    ]

    let usage = emptyUsage()
    let collected = ''

    // The server-side tool loop can pause; re-send with the assistant turn
    // appended and it resumes where it left off.
    for (let attempt = 0; attempt <= 4; attempt++) {
      const stream = anthropic.messages.stream({
        model: MODEL,
        max_tokens: maxTokens,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'high' },
        system,
        messages,
        tools: [
          { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 5 },
          { type: 'web_search_20260209', name: 'web_search', max_uses: 5 },
        ],
      })

      const message = await stream.finalMessage()
      usage = addUsage(usage, {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      })

      if (message.stop_reason === 'refusal') {
        throw new RefusalError(message.stop_details?.category ?? null)
      }

      collected = textOf(message)

      if (message.stop_reason === 'pause_turn') {
        messages.push({
          role: 'assistant',
          content: message.content as Anthropic.Messages.ContentBlockParam[],
        })
        continue
      }
      break
    }

    return { text: collected, usage }
  },
}
