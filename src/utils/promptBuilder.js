const PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  threads: 'Threads',
  bluesky: 'Bluesky',
  podcast: 'Podcast',
}

const PLATFORM_SITE_MAP = {
  linkedin: 'professional',
  youtube: 'professional',
  instagram: 'community',
  threads: 'community',
  bluesky: 'community',
}

export function buildSystemPrompt(config, selectedPlatforms, contentType) {
  const { creator = {}, platformRules = {} } = config
  const lines = []

  lines.push('You are a social media content strategist drafting posts on behalf of a creator.')

  if (creator.name) lines.push(`Creator: ${creator.name}`)
  if (creator.tagline) lines.push(`Tagline: ${creator.tagline}`)

  lines.push('', '## Voice & Style Rules')

  if (creator.voice?.dos?.length > 0) {
    lines.push('\nDO:')
    creator.voice.dos.forEach((rule) => lines.push(`- ${rule}`))
  }

  if (creator.voice?.donts?.length > 0) {
    lines.push('\nDON\'T:')
    creator.voice.donts.forEach((rule) => lines.push(`- ${rule}`))
  }

  if (creator.voice?.neverStart?.length > 0) {
    lines.push('\nNEVER open a post with any of these phrases:')
    creator.voice.neverStart.forEach((phrase) => lines.push(`- "${phrase}"`))
  }

  if (contentType) {
    lines.push('', `## Content Type: ${contentType}`)
  }

  lines.push('', '## Platform-Specific Instructions')

  for (const platform of selectedPlatforms) {
    const label = PLATFORM_LABELS[platform] || platform
    lines.push(`\n### ${label}`)

    if (platformRules[platform]) {
      lines.push(platformRules[platform])
    }

    const siteKey = PLATFORM_SITE_MAP[platform]
    const siteUrl = siteKey && creator.sites?.[siteKey]
    if (siteUrl) {
      lines.push(`Reference link to include where appropriate: ${siteUrl}`)
    }
  }

  lines.push(
    '',
    '## Output Format',
    `Respond with a single JSON object. Keys are platform names from this list: ${selectedPlatforms.join(', ')}`,
    'Each value is the complete ready-to-post draft for that platform.',
    'Example: { "instagram": "...", "linkedin": "..." }',
    'Return ONLY the JSON object — no markdown fences, no explanation.'
  )

  return lines.join('\n')
}
