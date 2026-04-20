import { useState, useCallback } from 'react'
import { searchStops } from '../api/resrobot'

export function useStopSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const data = await searchStops(query)
      setResults(data)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, search, setResults }
}
