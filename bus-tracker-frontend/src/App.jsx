import { useState } from 'react'
import StopSearch from './components/StopSearch'
import DepartureList from './components/DepartureList'
import { useDepartures } from './hooks/useDepartures'

// Default stop: Flöjelbergsgatan, Göteborg
const DEFAULT_STOP = {
  extId: '740059794',
  name: 'Flöjelbergsgatan, Göteborg',
  latitude: 57.6606,
  longitude: 11.9667
}

export default function App() {
  const [selectedStop, setSelectedStop] = useState(DEFAULT_STOP)
  const { departures, loading, error, lastUpdated, refresh } = useDepartures(selectedStop?.extId)

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚌 Bus Tracker</h1>
        <StopSearch
          currentStop={selectedStop}
          onSelectStop={setSelectedStop}
        />
      </header>

      <main className="app-main">
        <div className="section-header">
          <h2>Nästa avgångar</h2>
          <button className="refresh-btn" onClick={refresh} disabled={loading}>
            {loading ? '⏳' : '🔄'}
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
