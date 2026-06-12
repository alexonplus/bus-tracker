import { useState, useEffect } from 'react'
import { getSearchHistory, addToHistory, removeFromHistory, clearHistory } from '../utils/searchHistory'

export default function SearchHistory({ onSelect, onClose }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    setHistory(getSearchHistory())
  }, [])

  const handleSelect = (query) => {
    addToHistory(query)
    onSelect(query)
    onClose?.()
  }

  const handleRemove = (e, query) => {
    e.stopPropagation()
    removeFromHistory(query)
    setHistory(getSearchHistory())
  }

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  if (history.length === 0) {
    return (
      <div className="search-history empty">
        <p>No search history yet</p>
      </div>
    )
  }

  return (
    <div className="search-history">
      <div className="history-header">
        <h3>Recent searches</h3>
        <button onClick={handleClear} className="clear-btn">Clear all</button>
      </div>
      <ul className="history-list">
        {history.map((query, idx) => (
          <li key={idx} onClick={() => handleSelect(query)} className="history-item">
            <span className="history-text">🕐 {query}</span>
            <button
              onClick={(e) => handleRemove(e, query)}
              className="remove-btn"
              title="Remove from history"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
