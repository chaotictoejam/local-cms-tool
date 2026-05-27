import { buildSystemPrompt } from './promptBuilder'

export async function generateDrafts({ sourceMaterial, config, selectedPlatforms, contentType, apiKey }) {
  if (!apiKey) throw new Error('No API key set. Add your Anthropic API key in Settings.')

  const systemPrompt = buildSystemPrompt(config, selectedPlatforms, contentType)

  const response = await fetch('/anthropic/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate platform-specific content drafts from this source material:\n\n${sourceMaterial}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    let message = `API error ${response.status}`
    try {
      const err = await response.json()
      message = err.error?.message || message
    } catch { /* ignore parse errors */ }
    throw new Error(message)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Claude returned an unexpected format. Try again.')

  return JSON.parse(jsonMatch[0])
}
