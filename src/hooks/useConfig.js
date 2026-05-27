import { useState, useEffect } from 'react'

const EMPTY_CONFIG = {
  creator: { name: '', tagline: '', voice: { dos: [], donts: [], neverStart: [] }, sites: {} },
  platforms: {},
  contentTypes: [],
  platformRules: {},
}

export function useConfig() {
  const [config, setConfig] = useState(EMPTY_CONFIG)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = async () => {
    setLoading(true)
    try {
      const res = await fetch('/config.json')
      const data = await res.json()
      if (data.error) {
        setError(data.message || data.error)
        setConfig(EMPTY_CONFIG)
      } else {
        setConfig(data)
        setError(null)
      }
    } catch (e) {
      setError('Could not load config.json: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { reload() }, [])

  const enabledPlatforms = Object.entries(config.platforms || {})
    .filter(([, v]) => v?.enabled)
    .map(([k]) => k)

  return { config, loading, error, enabledPlatforms, reload }
}
