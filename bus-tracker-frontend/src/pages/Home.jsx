import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Heart, Search, MapPin, LogOut, ArrowRight, AlertTriangle, Trash2, Clock, Bus, Wind, Shield, Calendar } from 'lucide-react'
import Logo from '../components/Logo'
import { logout } from '../api/auth'
import { isAdmin } from '../utils/jwt'
import { searchStops, getDepartures } from '../api/resrobot'
import { getSavedStops, addSavedStop, deleteSavedStop } from '../api/savedStops'
import { getWeather } from '../api/weather'
import { formatTime } from '../utils/formatTime'
import { notifications } from '../utils/notifications'
import DeparturePanel from '../components/DeparturePanel'

import { checkWatchedBuses } from '../utils/watchedBuses'



export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedStop, setSelectedStop] = useState(null)
  const [searching, setSearching] = useState(false)
  const [savedStops, setSavedStops] = useState([])
  const [weather, setWeather] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')

  const overviewRef = useRef(null)
  const myStopsRef = useRef(null)
  const alertsRef = useRef(null)

  useEffect(() => {
    getSavedStops().then(setSavedStops).catch(() => {})
    getWeather().then(setWeather).catch(() => {})

    const interval = setInterval(() => {
      const toNotify = checkWatchedBuses()
      toNotify.forEach(bus => {
        notifications.busNearby(bus.busLine, 5)
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      try { setSearchResults((await searchStops(searchTerm)) || []) }
      catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSave = async (stop) => {
    try {
      const saved = await addSavedStop(stop)
      setSavedStops(prev => [...prev, saved])
      notifications.routeSaved(stop.name, '')
    } catch (e) { console.error(e); notifications.error('Failed to save stop') }
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
    setSearchTerm('')
    setSearchResults([])
    setActiveSection('overview')
    overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navItems = [
    { id: 'overview', label: 'Översikt', ref: overviewRef },
    { id: 'mystops', label: 'Mina hållplatser', ref: myStopsRef },
    { id: 'alerts', label: 'Trafikstörningar', ref: alertsRef },
    { id: 'events', label: 'Evenemang', ref: null, href: '/events' },
  ]

  return (
    <div className="app-wrapper dashboard-wrapper">
      <aside className="sidebar">
        <div className="logo-section">
          <Logo subtitle="RESEPLANERAREN • 2026" />
        </div>

        <nav style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => { if (item.href) { window.location.href = item.href; return; } setActiveSection(item.id); item.ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
              style={{ background: activeSection === item.id ? 'rgba(45,99,237,0.1)' : 'transparent', border: 'none', padding: '12px 16px', borderRadius: '10px', color: activeSection === item.id ? 'white' : 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }}>
              {activeSection === item.id && <div style={{ width: '4px', height: '14px', background: 'var(--accent)', borderRadius: '2px' }} />}
              {item.label}
            </button>
          ))}
        </nav>

        {weather && (
          <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'var(--text-dim)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>Göteborg</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{weather.icon}</span>
              <div>
                <div style={{ fontSize: '28px', fontWeight: '700', lineHeight: 1 }}>{weather.temp}°</div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>{weather.label}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', color: 'var(--text-dim)', fontSize: '12px' }}>
              <Wind size={13} /> {weather.wind} m/s
            </div>
          </div>
        )}

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {isAdmin() && (
            <button onClick={() => window.location.href = '/admin'}
              style={{ background: 'rgba(45,99,237,0.1)', border: '1px solid rgba(45,99,237,0.2)', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', width: '100%', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
              <Shield size={16} /> Admin Panel
            </button>
          )}
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', width: '100%', justifyContent: 'center', fontSize: '13px' }}>
            <LogOut size={16} /> Logga ut
          </button>
        </div>
      </aside>

      <nav className="mobile-nav">
        {navItems.map(item => (
          <button key={item.id} className={`mobile-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => { setActiveSection(item.id); item.ref?.current?.scrollIntoView({ behavior: 'smooth' }) }}>
            {item.id === 'overview' && <Search size={22} />}
            {item.id === 'mystops' && <Heart size={22} />}
            {item.id === 'alerts' && <AlertTriangle size={22} />}
            <span>{item.label}</span>
          </button>
        ))}
        <button className="mobile-nav-item" onClick={handleLogout}><LogOut size={22} /><span>Logga ut</span></button>
      </nav>

      <main className="auth-main" style={{ justifyContent: 'flex-start', paddingTop: '40px', paddingBottom: '40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Overview */}
          <div ref={overviewRef}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '16px' }}>Översikt</p>

            <section style={{ position: 'relative', zIndex: 100, marginBottom: '24px' }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', opacity: 0.5 }} size={20} />
                <input type="text" placeholder="Sök hållplats (t.ex. Brunnsparken, Korsvägen)..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '20px 20px 20px 56px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'var(--card-bg)', color: 'white', fontSize: '16px', outline: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}
                />
              </div>
              <AnimatePresence>
                {searchTerm && (searchResults.length > 0 || searching) && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--card-bg)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', zIndex: 200, overflow: 'hidden' }}
                  >
                    {searching ? <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>Söker...</div>
                      : searchResults.map((stop, i) => (
                        <button key={i} onClick={() => selectStop(stop)}
                          style={{ width: '100%', textAlign: 'left', padding: '18px 24px', background: 'none', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <MapPin size={20} color="var(--accent)" />
                            <span style={{ fontSize: '15px' }}>{stop.name}</span>
                          </div>
                          <ArrowRight size={18} color="var(--text-dim)" />
                        </button>
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <AnimatePresence mode="wait">
              {selectedStop && (
                <DeparturePanel key={selectedStop.id || selectedStop.extId} stop={selectedStop}
                  savedStops={savedStops} onSave={handleSave} onDelete={handleDelete} />
              )}
            </AnimatePresence>
          </div>

          {/* My Stops */}
          <div ref={myStopsRef}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '16px' }}>Mina hållplatser</p>
            <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ padding: '24px 28px', borderBottom: savedStops.length > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(45,99,237,0.1)', padding: '8px', borderRadius: '10px' }}>
                  <Heart size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Mina sparade hållplatser</h3>
              </div>
              {savedStops.length === 0 ? (
                <div style={{ padding: '40px 28px', textAlign: 'center' }}>
                  <Bus size={28} color="var(--text-dim)" opacity={0.3} style={{ marginBottom: '12px' }} />
                  <p style={{ color: 'var(--text-dim)', fontSize: '14px', fontStyle: 'italic' }}>Sök en hållplats och klicka på "Spara" för att lägga till den här.</p>
                </div>
              ) : savedStops.map((stop, i) => (
                <div key={stop.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderBottom: i < savedStops.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', cursor: 'pointer', background: selectedStop?.name === stop.stopName ? 'rgba(45,99,237,0.06)' : 'transparent', transition: 'background 0.15s' }}
                  onClick={() => selectStop({ id: stop.stopId, extId: stop.stopExtId, name: stop.stopName })}
                  onMouseEnter={(e) => { if (selectedStop?.name !== stop.stopName) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { if (selectedStop?.name !== stop.stopName) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <MapPin size={18} color={selectedStop?.name === stop.stopName ? 'var(--accent)' : 'var(--text-dim)'} />
                    <span style={{ fontSize: '15px', fontWeight: '500' }}>{stop.stopName}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(stop.id) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-dim)', opacity: 0.4 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Alerts */}
          <div ref={alertsRef}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '16px' }}>Trafikstörningar</p>
            <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,160,0,0.1)', padding: '8px', borderRadius: '10px' }}>
                  <AlertTriangle size={18} style={{ color: '#ffa500' }} />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Trafikstörningar</h3>
              </div>
              {selectedStop ? (
                <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
                  {selectedStop.name} — välj en hållplats ovan för att se eventuella förseningar i realtid.
                  Försenade avgångar markeras i <span style={{ color: '#ffa500' }}>orange</span> i avståndspanelen.
                </p>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px', background: 'rgba(0,255,136,0.05)', borderRadius: '12px', border: '1px solid rgba(0,255,136,0.1)' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#00ff88', borderRadius: '50%', boxShadow: '0 0 8px #00ff88', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: '#00ff88' }}>Inga störningar just nu — välj en hållplats för att se live-status.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
