import { useState } from 'react'

const KEY = 'anthropic_api_key'

export function useSettings() {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem(KEY) || '')

  const setApiKey = (key) => {
    if (key) {
      localStorage.setItem(KEY, key)
    } else {
      localStorage.removeItem(KEY)
    }
    setApiKeyState(key)
  }

  return { apiKey, setApiKey }
}
