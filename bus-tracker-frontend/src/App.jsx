import { useState, useEffect } from 'react'
import StopSearch from './components/StopSearch'
import DepartureList from './components/DepartureList'
import { useDepartures } from './hooks/useDepartures'

const DEFAULT_STOP = {
  extId: '740059794',
  name: 'Flöjelbergsgatan (Mölndal kn)',
  latitude: 57.66483,
  longitude: 12.019638
}

export default function App() {
  const [selectedStop, setSelectedStop] = useState(DEFAULT_STOP)
  const { departures, loading, error, lastUpdated, refresh } = useDepartures(selectedStop?.extId)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-icon">🚌</div>
            <h1>Bus Tracker</h1>
          </div>
          <span className="header-time">
            {time.toLocaleTimeString('sv-SE')}
          </span>
        </div>
        <StopSearch currentStop={selectedStop} onSelectStop={setSelectedStop} />
      </header>

      <main>
        <div className="section-header">
          <span className="section-title">Nästa avgångar</span>
          <button
            className={`refresh-btn ${loading ? 'spinning' : ''}`}
            onClick={refresh}
            disabled={loading}
          >
            ↻
          </button>
        </div>
        <DepartureList
          departures={departures}
          loading={loading}
          error={error}
          lastUpdated={lastUpdated}
        />
      </main>
    </div>
  )
}
