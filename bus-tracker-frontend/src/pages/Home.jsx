import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { Heart, AlertTriangle, Trash2, Bus } from 'lucide-react'
import { logout } from '../api/auth'
import { getSavedStops, addSavedStop, deleteSavedStop } from '../api/savedStops'
import { getWeather } from '../api/weather'
import { notifications } from '../utils/notifications'
import DeparturePanel from '../components/DeparturePanel'
import Sider from './Sider'
import StopSearch from '../components/StopSearch'
import { checkWatchedBuses } from '../utils/watchedBuses'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [selectedStop, setSelectedStop] = useState(null)
  const [savedStops, setSavedStops] = useState([])
  const [weather, setWeather] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')

  const overviewRef = useRef(null)
  const myStopsRef = useRef(null)
  const alertsRef = useRef(null)

  useEffect(() => {
    getSavedStops().then(setSavedStops).catch(() => {})
    getWeather().then(setWeather).catch(() => {})
  }, [])

  const handleSave = async (stop) => {
    try {
      const saved = await addSavedStop(stop)
      setSavedStops(prev => [...prev, saved])
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteSavedStop(id)
      setSavedStops(prev => prev.filter(s => s.id !== id))
    } catch (e) { console.error(e) }
  }

  const handleLogout = () => { logout(); window.location.href = '/login' }

  const selectStop = (stop) => {
    setSelectedStop(stop)
    setActiveSection('overview')
  }

  

  // check for watched buses and show notifications
  const handleNavClick = (id, ref) => {
    setActiveSection(id)
    ref?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // function to check for watched buses and show notifications
  const navItems = [
    { 
      id: 'overview', 
      label: 'Översikt', 
      onClick: () => handleNavClick('overview', overviewRef) 
    },
    { 
      id: 'mystops', 
      label: 'Mina hållplatser', 
      onClick: () => handleNavClick('mystops', myStopsRef) 
    },
    { 
      id: 'alerts', 
      label: 'Trafikstörningar', 
      onClick: () => handleNavClick('alerts', alertsRef) 
    }
  ]


  return (
    <div className="app-wrapper dashboard-wrapper">
      <Sider weather={weather} navItems={navItems} activeSection={activeSection} onLogout={handleLogout} />
      <main className="auth-main">
        <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div ref={overviewRef}>
            <p className={styles.sectionLabel}>Översikt</p>
            <StopSearch onSelectStop={selectStop} currentStop={selectedStop} />
            <AnimatePresence mode="wait">
              {selectedStop && <DeparturePanel key={selectedStop.id} stop={selectedStop} savedStops={savedStops} onSave={handleSave} onDelete={handleDelete} />}
            </AnimatePresence>
          </div>

          <div ref={myStopsRef}>
            <p className={styles.sectionLabel}>Mina hållplatser</p>
            <div className={styles.card}>
              {savedStops.map((stop) => (
                <div key={stop.id} className={styles.stopItem} onClick={() => selectStop({ id: stop.stopId, name: stop.stopName })}>
                  {stop.stopName}
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(stop.id) }}><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>

          <div ref={alertsRef}>
            <p className={styles.sectionLabel}>Trafikstörningar</p>
            <div className={styles.alertCard}>
              <div className={styles.header}>
                <AlertTriangle size={18} />
                <h3>Trafikstörningar</h3>
              </div>
              {selectedStop ? <p>{selectedStop.name} — välj en hållplats för att se förseningar.</p> : <div>Inga störningar.</div>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}