import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Heart, X, Clock } from 'lucide-react'
import { getDepartures } from '../api/resrobot'
import { formatTime } from '../utils/formatTime'

export default function StopDetails({ stop, onClose, savedStops, onSave, onDelete }) {
  const [departures, setDepartures] = useState([])
  const [loading, setLoading] = useState(true)

  const savedEntry = savedStops.find(
    s => s.stopId === (stop.id || stop.extId) || s.stopExtId === stop.extId
  )

  useEffect(() => {
    getDepartures(stop.extId || stop.id)
      .then(setDepartures)
      .catch(() => setDepartures([]))
      .finally(() => setLoading(false))
  }, [stop])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '20px' }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
        style={{ backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '500px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}
      >
        <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => savedEntry ? onDelete(savedEntry.id) : onSave(stop)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              title={savedEntry ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={24} fill={savedEntry ? 'var(--accent)' : 'none'} color={savedEntry ? 'var(--accent)' : 'var(--text-dim)'} />
            </button>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.5px' }}>{stop.name}</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Real-time departures</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px 32px 40px 32px', maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>Laddar avgångar...</p>
          ) : departures.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '20px' }}>Inga avgångar hittades.</p>
          ) : departures.slice(0, 8).map((dep, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ width: '42px', height: '42px', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', marginRight: '16px', flexShrink: 0 }}>
                {dep.lineNumber}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '500' }}>{dep.direction}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  {dep.realtimeTime && <div style={{ width: '6px', height: '6px', backgroundColor: '#00ff88', borderRadius: '50%', boxShadow: '0 0 8px #00ff88' }} />}
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{dep.realtimeTime ? 'Live' : 'Planerad'}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: dep.minutesUntilDeparture === 0 ? '#00ff88' : 'white' }}>
                  {formatTime(dep)}
                </div>
                <Clock size={12} style={{ color: 'var(--text-dim)', marginTop: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
