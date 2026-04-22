import { useCountdown } from '../hooks/useCountdown'

export default function DepartureCard({ departure, index }) {
  const { minutes, seconds } = useCountdown(departure.departureTime)

  const isNow = minutes === 0 && seconds < 30
  const isSoon = minutes < 3 && !isNow
  const isUrgent = minutes < 7 && !isNow && !isSoon

  const categoryIcon = {
    BUS: '🚌', TRAM: '🚋', TRAIN: '🚆', FERRY: '⛴️',
  }[departure.transportCategory] ?? '🚌'

  return (
    <div className={`departure-card ${departure.isDelayed ? 'delayed' : ''} ${isNow ? 'now-card' : ''}`}>
      <div className="card-left">
        <span className="line-badge">{departure.lineNumber || '?'}</span>
        <span className="transport-icon">{categoryIcon}</span>
      </div>

      <div className="card-middle">
        <div className="departure-direction">{departure.direction}</div>
        <div className="departure-times">
          <span className="scheduled-time">
            {new Date(departure.scheduledTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
          </span>
          {departure.isDelayed && (
            <span className="realtime-badge">
              +{Math.round((new Date(departure.departureTime) - new Date(departure.scheduledTime)) / 60000)} min
            </span>
          )}
        </div>
      </div>

      <div className={`countdown ${isNow ? 'urgent' : isSoon ? 'soon' : ''}`}>
        {isNow ? (
          <span className="now-label">Nu!</span>
        ) : minutes === 0 ? (
          <>
            <div className="countdown-value">{seconds}</div>
            <div className="countdown-unit">sek</div>
          </>
        ) : (
          <>
            <div className="countdown-value">{minutes}</div>
            <div className="countdown-unit">min</div>
          </>
        )}
      </div>
    </div>
  )
}
