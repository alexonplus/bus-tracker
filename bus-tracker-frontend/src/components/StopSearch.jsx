import { useState, useEffect, useRef } from 'react'
import { useStopSearch } from '../hooks/useStopSearch'

export default function StopSearch({ onSelectStop, currentStop }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const { results, loading, search, setResults } = useStopSearch()
  const timeoutRef = useRef(null)

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => search(query), 300)
    return () => clearTimeout(timeoutRef.current)
  }, [query, search])

  const handleSelect = (stop) => {
    onSelectStop(stop)
    setQuery('')
    setResults([])
    setOpen(false)
  }

  return (
    <div className="stop-search">
      <div className="stop-search-header">
        <span className="stop-icon">📍</span>
        <div className="stop-search-input-wrap">
          {open ? (
            <input
              autoFocus
              className="stop-input"
              placeholder="Sök hållplats..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
            />
          ) : (
            <button className="stop-name-btn" onClick={() => setOpen(true)}>
              {currentStop?.name ?? 'Välj hållplats'}
              <span className="edit-icon">✏️</span>
            </button>
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <ul className="stop-results">
          {loading && <li className="stop-loading">Söker...</li>}
          {results.map(stop => (
            <li
              key={stop.extId}
              className="stop-result-item"
              onMouseDown={() => handleSelect(stop)}
            >
              <span className="result-icon">🚏</span>
              {stop.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
