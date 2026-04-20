import DepartureCard from './DepartureCard'

export default function DepartureList({ departures, loading, error, lastUpdated }) {
  if (loading && departures.length === 0) {
    return <div className="loading">Hämtar avgångar...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (departures.length === 0) {
    return <div className="empty">Inga avgångar hittades</div>
  }

  return (
    <div className="departure-list">
      {lastUpdated && (
        <div className="last-updated">
          Uppdaterad {lastUpdated.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      )}
      <div className="cards-grid">
        {departures.map((d, i) => (
          <DepartureCard key={`${d.lineNumber}-${d.scheduledTime}-${i}`} departure={d} />
        ))}
      </div>
    </div>
  )
}
