import DepartureCard from './DepartureCard'

export default function DepartureList({ departures, loading, error, lastUpdated }) {
  if (loading && departures.length === 0) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        Hämtar avgångar...
      </div>
    )
  }

  if (error) return <div className="error-state">⚠ {error}</div>
  if (departures.length === 0) return <div className="empty-state">Inga avgångar hittades</div>

  return (
    <div>
      {lastUpdated && (
        <div className="last-updated">
          <span className="live-dot" />
          {lastUpdated.toLocaleTimeString('sv-SE')}
        </div>
      )}
      <div className="cards-grid">
        {departures.map((d, i) => (
          <DepartureCard key={`${d.lineNumber}-${d.scheduledTime}-${i}`} departure={d} index={i} />
        ))}
      </div>
    </div>
  )
}
