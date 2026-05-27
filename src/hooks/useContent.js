import { useState, useEffect, useCallback } from 'react'

export function useContent() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/content')
      const data = await res.json()
      setItems(data.items || [])
      setError(null)
    } catch (e) {
      setError('Failed to load content data: ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const persist = useCallback(async (newItems) => {
    try {
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems }),
      })
      setItems(newItems)
    } catch (e) {
      setError('Failed to save: ' + e.message)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addItem = useCallback((item) => {
    persist([...items, { ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }])
  }, [items, persist])

  const updateItem = useCallback((id, updates) => {
    const next = items.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
    )
    persist(next)
  }, [items, persist])

  const deleteItem = useCallback((id) => {
    persist(items.filter((item) => item.id !== id))
  }, [items, persist])

  return { items, loading, error, addItem, updateItem, deleteItem, reload: load }
}
