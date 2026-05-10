import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Calendar, MapPin, Users, Star, ChevronLeft, Bus, ArrowRight, AlertTriangle, CheckCircle, HelpCircle, XCircle, Trash2, Search } from 'lucide-react'
import Logo from '../components/Logo'
import { logout } from '../api/auth'
import { getEvents, setAttendance, deleteEvent } from '../api/events'
import { planTrip } from '../api/trip'
import { getSavedStops } from '../api/savedStops'
import { searchStops } from '../api/resrobot'
import { isAdmin } from '../utils/jwt'
import { savePlan } from '../components/PlanReminderWidget'

const CATEGORY_META = {
  Music:     { icon: '🎵', color: '#9b59b6', label: 'Musik' },
  Gaming:    { icon: '🎮', color: '#2980b9', label: 'Gaming' },
  Fashion:   { icon: '👗', color: '#e91e8c', label: 'Mode' },
  Outdoor:   { icon: '🌿', color: '#27ae60', label: 'Friluftsliv' },
  FoodMarket:{ icon: '🍜', color: '#e67e22', label: 'Matmarknad' },
  Sports:    { icon: '⚽', color: '#e74c3c', label: 'Sport' },
  Culture:   { icon: '🎭', color: '#f39c12', label: 'Kultur' },
  Other:     { icon: '📌', color: '#7f8c8d', label: 'Övrigt' },
}

const STATUS_CONFIG = {
  Going:    { label: 'Jag går!', icon: CheckCircle, color: '#00ff88' },
  Maybe:    { label: 'Kanske',   icon: HelpCircle,  color: '#ffa500' },
  NotGoing: { label: 'Går inte', icon: XCircle,     color: '#ff4d4d' },
}

const HOME_KEY = 'bustrackerHomeStop'

const _coordsCache = {}
async function geocodeStop(stopName, address) {
  const key = `${stopName}|${address}`
  if (key in _coordsCache) return _coordsCache[key]
  try {
    const q = encodeURIComponent(`${stopName} ${address || ''} Göteborg Sverige`)
    const data = await fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`).then(r => r.json())
    _coordsCache[key] = data[0] ? { lat: +data[0].lat, lon: +data[0].lon } : null
  } catch { _coordsCache[key] = null }
  return _coordsCache[key]
}

function kmBetween(lat1, lon1, lat2, lon2) {
  const R = 6371, dL = (lat2 - lat1) * Math.PI / 180, dO = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dL/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dO/2)**2
  return R * 2 * Math.asin(Math.sqrt(a))
}

function EventMap({ stopName, address }) {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    const q = encodeURIComponent(`${stopName} ${address || ''} Göteborg Sverige`)
    fetch(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`)
      .then(r => r.json())
      .then(data => { if (data[0]) setCoords({ lat: data[0].lat, lon: data[0].lon }) })
      .catch(() => {})
  }, [stopName])

  if (!coords) return null

  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(coords.lon)-0.006},${parseFloat(coords.lat)-0.004},${parseFloat(coords.lon)+0.006},${parseFloat(coords.lat)+0.004}&layer=mapnik&marker=${coords.lat},${coords.lon}`

  return (
    <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      <iframe src={url} title="Event map" style={{ width: '100%', height: '180px', border: 'none', display: 'block' }} />
      <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', fontSize: '12px', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={12} color="var(--accent)" /> {stopName}{address && ` · ${address}`}
      </div>
    </div>
  )
}

function PlanReminder({ plan, onDismiss }) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const update = () => {
      const diff = plan.depDateTime - new Date()
      if (diff <= 0) { setTimeLeft('Avgång nu!'); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(h > 0 ? `Om ${h} h ${m} min` : `Om ${m} min`)
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [plan.depDateTime])

  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'rgba(45,99,237,0.12)', border: '1px solid rgba(45,99,237,0.3)', borderRadius: '16px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
    >
      <Bus size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: '180px' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>
          Ta <strong>{plan.lines}</strong> kl {plan.depTimeStr} → {plan.eventStop}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
          {plan.eventTitle} · {new Date(plan.eventDate).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })}
        </div>
      </div>
      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{timeLeft}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px', fontSize: '16px', lineHeight: 1 }}>✕</button>
    </motion.div>
  )
}

function TripPanel({ event, savedStops, onClose, onTripSelected }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [selectedStop, setSelectedStop] = useState(null)
  const [trip, setTrip] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const departTime = new Date(event.eventDate)
  departTime.setMinutes(departTime.getMinutes() - 15)

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

  const selectStop = (stop) => {
    setSelectedStop(stop)
    setSearchTerm(stop.stopName)
    setSearchResults([])
    setError(null)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
    setSelectedStop(null)
    setTrip(null)
    setSelectedTrip(null)
  }

  const handlePlan = async () => {
    if (!selectedStop) return
    if (selectedStop.stopExtId === event.stopExtId) {
      setError('Avgångshållplatsen är samma som evenemangets hållplats. Välj en annan.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await planTrip(selectedStop.stopExtId, event.stopExtId, departTime)
      setTrip(result)
    } catch (err) {
      setError(err.response?.data?.error || 'Kunde inte planera resan. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  const showSavedStops = !searchTerm.trim() && !selectedStop && savedStops.length > 0
  const showSearchResults = !!searchTerm.trim() && !selectedStop

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '20px' }}
    >
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--card-bg)', width: '100%', maxWidth: '520px', maxHeight: '90vh', borderRadius: '28px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '28px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Planera resa till</h3>
              <p style={{ color: 'var(--accent)', fontSize: '14px', marginTop: '4px' }}>{event.title}</p>
              <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '2px' }}>
                Ankomst senast: {departTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
          </div>
          <EventMap stopName={event.stopName} address={event.address} />
        </div>

        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>
            Från hållplats
          </label>

          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', opacity: 0.5 }} size={16} />
            <input value={searchTerm} onChange={handleInputChange}
              placeholder={savedStops.length > 0 ? 'Sök eller välj sparad hållplats...' : 'Sök hållplats...'}
              style={{ width: '100%', padding: '12px 12px 12px 40px', background: selectedStop ? 'rgba(45,99,237,0.08)' : 'rgba(255,255,255,0.05)', border: `1px solid ${selectedStop ? 'rgba(45,99,237,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: 'white', fontSize: '14px', outline: 'none' }}
            />
            {(showSavedStops || showSearchResults) && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '6px', zIndex: 10, overflow: 'hidden' }}>
                {showSavedStops && (
                  <>
                    <div style={{ padding: '8px 16px 4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Sparade hållplatser</div>
                    {savedStops.map((s, i) => (
                      <button key={s.id} onClick={() => selectStop({ stopExtId: s.stopExtId, stopName: s.stopName })}
                        style={{ width: '100%', textAlign: 'left', padding: '11px 16px', background: 'none', border: 'none', borderBottom: i < savedStops.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <MapPin size={13} color="#ffa500" /> {s.stopName}
                      </button>
                    ))}
                  </>
                )}
                {showSearchResults && (
                  searching
                    ? <div style={{ padding: '12px 16px', color: 'var(--text-dim)', fontSize: '13px' }}>Söker...</div>
                    : searchResults.slice(0, 5).map((stop, i) => (
                      <button key={i} onClick={() => selectStop({ stopExtId: stop.extId, stopName: stop.name })}
                        style={{ width: '100%', textAlign: 'left', padding: '11px 16px', background: 'none', border: 'none', borderBottom: i < Math.min(searchResults.length, 5) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <MapPin size={13} color="var(--accent)" /> {stop.name}
                      </button>
                    ))
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
            <MapPin size={14} color="var(--text-dim)" />
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>→ {event.stopName}{event.address && ` · ${event.address}`}</div>
          </div>

          <button onClick={handlePlan} disabled={loading || !selectedStop}
            style={{ width: '100%', padding: '16px', background: selectedStop ? 'var(--accent)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '600', cursor: (loading || !selectedStop) ? 'not-allowed' : 'pointer', opacity: (loading || !selectedStop) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            <Bus size={18} /> {loading ? 'Söker resa...' : 'Hitta resa'}
          </button>

          {error && <p style={{ color: '#ff4d4d', fontSize: '13px', marginTop: '16px' }}>{error}</p>}

          {trip && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '12px' }}>Reseförslag</p>
              {selectedTrip !== null && (() => {
                const t = (trip.Trip || trip.trips || [])[selectedTrip]
                if (!t) return null
                const legSource = t.LegList?.Leg || t.Leg || []
                const arr = Array.isArray(legSource) ? legSource : [legSource]
                const depTime = (arr[0]?.Origin?.time || '').slice(0, 5)
                const arrTime = (arr[arr.length-1]?.Destination?.time || '').slice(0, 5)
                const lines = arr.filter(l => l.type !== 'WALK').map(l => (l.name || '').split(' - ').pop()).join(' → ')
                return (
                  <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                    <p style={{ color: '#00ff88', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>✓ Valt resealternativ</p>
                    <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.6' }}>
                      Ta <strong>{lines || 'kollektivtrafik'}</strong> från <strong>{selectedStop?.stopName}</strong> kl <strong>{depTime}</strong> — ankomst till <strong>{event.stopName}</strong> kl <strong>{arrTime}</strong>.
                    </p>
                  </div>
                )
              })()}
              {(trip.Trip || trip.trips || []).slice(0, 3).map((t, i) => {
                const legSource = t.LegList?.Leg || t.legList?.Leg || t.Leg || t.legs || []
                const arr = Array.isArray(legSource) ? legSource : [legSource]
                const isCancelled = arr.some(l => l.cancelled || l.Cancelled)
                const depTime = (arr[0]?.Origin?.time || arr[0]?.origin?.time || '').slice(0, 5)
                const arrTime = (arr[arr.length-1]?.Destination?.time || arr[arr.length-1]?.destination?.time || '').slice(0, 5)
                const lines = arr.filter(l => l.type !== 'WALK').map(l => (l.name || '').split(' - ').pop()).join(' → ')
                return (
                  <div key={i}
                    onClick={() => {
                      if (isCancelled) return
                      onTripSelected({ eventTitle: event.title, eventStop: event.stopName, eventDate: event.eventDate, lines: lines || 'Kollektivtrafik', depTimeStr: depTime, arrTimeStr: arrTime })
                    }}
                    style={{ padding: '14px 16px', background: selectedTrip === i ? 'rgba(0,255,136,0.06)' : isCancelled ? 'rgba(255,77,77,0.07)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '8px', border: `1px solid ${selectedTrip === i ? 'rgba(0,255,136,0.3)' : isCancelled ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.05)'}`, cursor: isCancelled ? 'default' : 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (!isCancelled && selectedTrip !== i) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (!isCancelled && selectedTrip !== i) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  >
                    {isCancelled && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4d4d', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
                        <AlertTriangle size={13} /> INSTÄLLD
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {arr.map((leg, j) => {
                        const raw = leg.name || leg.Name || leg.transportNumber || '?'
                        const short = raw.split(' - ').pop()
                        return (
                          <span key={j} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ background: leg.type === 'WALK' ? 'rgba(255,255,255,0.1)' : isCancelled ? '#ff4d4d' : 'var(--accent)', color: 'white', padding: '3px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: '700', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                              {leg.type === 'WALK' ? '🚶 Gång' : short}
                            </span>
                            {j < arr.length - 1 && <ArrowRight size={12} color="var(--text-dim)" />}
                          </span>
                        )
                      })}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
                      Avgång: <span style={{ color: 'white', fontWeight: '600' }}>{depTime || '—'}</span>
                      {' → '}
                      Ankomst: <span style={{ color: 'white', fontWeight: '600' }}>{arrTime || '—'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange(n)} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
          <Star size={18} fill={(hover || value) >= n ? '#ffa500' : 'none'} color={(hover || value) >= n ? '#ffa500' : 'var(--text-dim)'} />
        </button>
      ))}
    </div>
  )
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [savedStops, setSavedStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Alla')
  const [view, setView] = useState('upcoming')
  const [tripEvent, setTripEvent] = useState(null)
  const [ratings, setRatings] = useState({})
  const admin = isAdmin()

  useEffect(() => {
    Promise.all([
      getEvents().then(setEvents),
      getSavedStops().then(setSavedStops)
    ]).finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const upcoming = events.filter(e => new Date(e.eventDate) >= now)
  const past = events.filter(e => new Date(e.eventDate) < now)
  const base = view === 'upcoming' ? upcoming : past
  const categories = ['Alla', ...Object.keys(CATEGORY_META)]
  const filtered = activeCategory === 'Alla' ? base : base.filter(e => e.category === activeCategory)

  const handleAttend = async (eventId, status, lookingForCompany = null) => {
    const rating = ratings[eventId] || null
    const event = events.find(e => e.id === eventId)
    const lfc = lookingForCompany !== null ? lookingForCompany : (event?.myLookingForCompany ?? false)
    await setAttendance(eventId, status, rating, lfc)
    const updated = await getEvents()
    setEvents(updated)
  }

  const handleToggleLooking = async (event) => {
    if (!event.myStatus) return
    await setAttendance(event.id, event.myStatus, ratings[event.id] || event.myRating || null, !event.myLookingForCompany)
    const updated = await getEvents()
    setEvents(updated)
  }

  const handleDelete = async (id) => {
    await deleteEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  const handleTripSelected = ({ eventTitle, eventStop, eventDate, lines, depTimeStr, arrTimeStr }) => {
    const d = new Date(eventDate)
    const [h, m] = depTimeStr.split(':').map(n => parseInt(n, 10))
    savePlan({ eventTitle, eventStop, eventDate, lines, depTimeStr, arrTimeStr, depDateTime: new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m) })
    setTripEvent(null)
  }

  // User's top categories from attendance
  const myTopCategories = Object.entries(
    events
      .filter(e => e.myStatus === 'Going' || e.myStatus === 'Maybe')
      .reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div className="logo-section"><Logo subtitle="EVENTS" /></div>
        <nav style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={() => window.location.href = '/'} style={{ background: 'transparent', border: 'none', padding: '12px 16px', borderRadius: '10px', color: 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChevronLeft size={16} /> Tillbaka
          </button>
          {admin && (
            <button onClick={() => window.location.href = '/admin/events'} style={{ background: 'rgba(45,99,237,0.1)', border: 'none', padding: '12px 16px', borderRadius: '10px', color: 'var(--accent)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
              + Skapa event
            </button>
          )}
        </nav>

        {myTopCategories.length > 0 && (
          <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '14px' }}>Dina favoriter</p>
            {myTopCategories.map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>{CATEGORY_META[cat]?.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>{CATEGORY_META[cat]?.label || cat}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{count} evenemang</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sidebar-footer">
          <button onClick={() => { logout(); window.location.href = '/login' }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', width: '100%', justifyContent: 'center', fontSize: '13px' }}>
            Logga ut
          </button>
        </div>
      </aside>

      <main className="auth-main" style={{ justifyContent: 'flex-start', paddingTop: '40px', paddingBottom: '40px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px' }}>Evenemang</h2>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {[{ id: 'upcoming', label: `Kommande (${upcoming.length})` }, { id: 'past', label: `Tidigare (${past.length})` }].map(tab => (
                <button key={tab.id} onClick={() => { setView(tab.id); setActiveCategory('Alla') }}
                  style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', background: view === tab.id ? 'var(--accent)' : 'rgba(255,255,255,0.06)', color: view === tab.id ? 'white' : 'var(--text-dim)', cursor: 'pointer', fontSize: '14px', fontWeight: view === tab.id ? '600' : '400', transition: 'all 0.2s' }}
                >{tab.label}</button>
              ))}
            </div>
          </header>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: '8px 16px', borderRadius: '20px', border: `1px solid ${activeCategory === cat ? CATEGORY_META[cat]?.color || 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, background: activeCategory === cat ? `${CATEGORY_META[cat]?.color || 'var(--accent)'}22` : 'transparent', color: activeCategory === cat ? 'white' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {cat !== 'Alla' && CATEGORY_META[cat]?.icon} {cat === 'Alla' ? 'Alla' : (CATEGORY_META[cat]?.label || cat)}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>Laddar evenemang...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
              <Calendar size={40} opacity={0.3} style={{ marginBottom: '16px' }} />
              <p>Inga kommande evenemang.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map(event => {
                const meta = CATEGORY_META[event.category] || CATEGORY_META.Other
                const eventDate = new Date(event.eventDate)
                const isPast = eventDate < new Date()
                const totalAttending = event.goingCount + event.maybeCount

                return (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}
                  >
                    {/* Header strip with category color */}
                    <div style={{ height: '4px', background: meta.color }} />

                    <div style={{ padding: '24px 28px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '28px' }}>{meta.icon}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{event.title}</h3>
                              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: `${meta.color}22`, color: meta.color, fontWeight: '600' }}>{meta.label || event.category}</span>
                            </div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '13px', marginTop: '4px' }}>{event.description}</p>
                          </div>
                        </div>
                        {admin && (
                          <button onClick={() => handleDelete(event.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', opacity: 0.5, padding: '4px' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '13px' }}>
                          <Calendar size={14} />
                          {eventDate.toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' })} kl {eventDate.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)', fontSize: '13px' }}>
                          <MapPin size={14} /> {event.stopName} {event.address && `· ${event.address}`}
                        </div>
                      </div>

                      {/* Seeking company */}
                      {event.seekingCompany?.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', padding: '8px 14px', background: 'rgba(0,188,212,0.07)', borderRadius: '10px', border: '1px solid rgba(0,188,212,0.2)' }}>
                          <span style={{ fontSize: '14px' }}>👥</span>
                          <span style={{ fontSize: '12px', color: '#00bcd4' }}>
                            <strong>{event.seekingCompany.join(', ')}</strong> söker sällskap
                          </span>
                        </div>
                      )}

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', color: '#00ff88' }}>✓ {event.goingCount} går</span>
                        <span style={{ fontSize: '13px', color: '#ffa500' }}>? {event.maybeCount} kanske</span>
                        <span style={{ fontSize: '13px', color: '#ff4d4d' }}>✕ {event.notGoingCount} går inte</span>
                        {event.averageRating && (
                          <span style={{ fontSize: '13px', color: '#ffa500' }}>⭐ {event.averageRating}/5</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {/* RSVP buttons */}
                        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
                          <button key={status} onClick={() => handleAttend(event.id, status)}
                            style={{ padding: '8px 14px', borderRadius: '10px', border: `1px solid ${event.myStatus === status ? cfg.color : 'rgba(255,255,255,0.1)'}`, background: event.myStatus === status ? `${cfg.color}22` : 'transparent', color: event.myStatus === status ? cfg.color : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px', fontWeight: event.myStatus === status ? '700' : '400', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                          >
                            <cfg.icon size={14} /> {cfg.label}
                          </button>
                        ))}

                        {/* Rating (if past or going) */}
                        {(isPast || event.myStatus === 'Going') && (
                          <StarRating value={ratings[event.id] || event.myRating || 0} onChange={v => setRatings(prev => ({ ...prev, [event.id]: v }))} />
                        )}

                        {/* Looking for company toggle */}
                        {event.myStatus && event.myStatus !== 'NotGoing' && (
                          <button onClick={() => handleToggleLooking(event)}
                            style={{ padding: '8px 14px', borderRadius: '10px', border: `1px solid ${event.myLookingForCompany ? '#00bcd4' : 'rgba(255,255,255,0.1)'}`, background: event.myLookingForCompany ? 'rgba(0,188,212,0.12)' : 'transparent', color: event.myLookingForCompany ? '#00bcd4' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                          >
                            👥 Söker sällskap
                          </button>
                        )}

                        {/* Plan trip */}
                        {!isPast && (
                          <button onClick={() => setTripEvent(event)}
                            style={{ marginLeft: 'auto', padding: '8px 16px', background: 'var(--accent)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Bus size={14} /> Planera resa
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {tripEvent && <TripPanel event={tripEvent} savedStops={savedStops} onClose={() => setTripEvent(null)} onTripSelected={handleTripSelected} />}
      </AnimatePresence>
    </div>
  )
}
