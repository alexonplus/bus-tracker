const STORAGE_KEY = 'bus_tracker_search_history'
const MAX_HISTORY = 10

export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY)
    return history ? JSON.parse(history) : []
  } catch (e) {
    return []
  }
}

export const addToHistory = (query) => {
  if (!query || !query.trim()) return

  const history = getSearchHistory()
  const filtered = history.filter(item => item !== query.trim())
  const updated = [query.trim(), ...filtered].slice(0, MAX_HISTORY)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY)
}

export const removeFromHistory = (query) => {
  const history = getSearchHistory()
  const updated = history.filter(item => item !== query)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}
