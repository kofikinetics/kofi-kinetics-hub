import { useState, useCallback } from 'react'

const STORAGE_KEY = 'kk_settings'

const defaultSettings = {
  instagramToken: '',
  instagramUserId: '',
  tiktokToken: '',
  groqApiKey: '',
  handle: '@kofi.kinetics',
  niche: 'online fitness coaching',
  audience: 'males aged 22–30',
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    return { ...defaultSettings, ...JSON.parse(raw) }
  } catch {
    return defaultSettings
  }
}

export function useSettings() {
  const [settings, setSettingsState] = useState(load)

  const saveSettings = useCallback((updates) => {
    setSettingsState(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { settings, saveSettings }
}
