import { useState, useEffect, useCallback } from 'react'
import { getDepartures } from '../api/resrobot'

export function useDepartures(stopId, intervalMs = 30000) {
  const [departures, setDepartures] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetch = useCallback(async () => {
    if (!stopId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getDepartures(stopId)
      setDepartures(data)
      setLastUpdated(new Date())
    } catch (e) {
      setError('Kunde inte hämta avgångar')
    } finally {
      setLoading(false)
    }
  }, [stopId])

  useEffect(() => {
    fetch()
    const interval = setInterval(fetch, intervalMs)
    return () => clearInterval(interval)
  }, [fetch, intervalMs])

  return { departures, loading, error, lastUpdated, refresh: fetch }
}
