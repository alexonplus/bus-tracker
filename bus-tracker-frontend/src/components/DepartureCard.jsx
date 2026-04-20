import { useCountdown } from '../hooks/useCountdown'

export default function DepartureCard({ departure }) {
  const { minutes, seconds } = useCountdown(departure.departureTime)

  const isNow = minutes === 0 && seconds < 60
  const isSoon = minutes < 5

  const categoryIcon = {
    BUS: '🚌',
    TRAM: '🚋',
    TRAIN: '🚆',
    FERRY: '⛴️',
  }[departure.transportCategory] ?? '🚌'

  return (
    <div className={`departure-card ${departure.isDelayed ? 'delayed' : ''} ${isNow ? 'now' : ''}`}>
      <div className="departure-line">
        <span className="line-badge">{departure.lineNumber}</span>
        <span className="category-icon">{categoryIcon}</span>
      </div>
      <div className="departure-direction">{departure.direction}</div>
      <div className="departure-times">
        <span className="scheduled-time">
          {new Date(departure.scheduledTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
        </span>
        {departure.isDelayed && (
          <span className="realtime-time">
            {new Date(departure.departureTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
      <div className={`countdown ${isSoon ? 'soon' : ''}`}>
        {minutes === 0 && seconds < 30
          ? <span className="now-label">Nu!</span>
          : minutes === 0
          ? `${seconds}s`
          : `${minutes} min`
        }
      </div>
    </div>
  )
}
