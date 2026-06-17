import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Heart, AlertTriangle } from 'lucide-react'
import { getDepartures } from '../api/resrobot'
import { notifications } from '../utils/notifications'
import DepartureList from './DepartureList'

export default function DeparturePanel({ stop, savedStops, onSave, onDelete }) {
  const [departures, setDepartures] = useState([])
  const [loading, setLoading] = useState(true)

  const savedEntry = savedStops.find(
    s => s.stopId === (stop.id || stop.extId) || s.stopExtId === stop.extId
  )

  useEffect(() => {
    setLoading(true)
    setDepartures([])
    getDepartures(stop.extId || stop.id)
      .then(setDepartures)
      .catch(() => setDepartures([]))
      .finally(() => setLoading(false))
  }, [stop.id, stop.extId])

  const delayed = departures.filter(d => d.isDelayed)

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}
    >
      <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.3px' }}>{stop.name}</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Avgångar i realtid</p>
        </div>
        <button
          onClick={() => savedEntry ? onDelete(savedEntry.id) : onSave(stop)}
          style={{ background: savedEntry ? 'rgba(45,99,237,0.15)' : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: savedEntry ? 'var(--accent)' : 'var(--text-dim)', fontSize: '13px', fontWeight: '600' }}
        >
          <Heart size={16} fill={savedEntry ? 'var(--accent)' : 'none'} />
          {savedEntry ? 'Sparad' : 'Spara'}
        </button>
      </div>

      {delayed.length > 0 && (
        <div style={{ padding: '12px 28px', background: 'rgba(255,160,0,0.07)', borderBottom: '1px solid rgba(255,160,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={15} color="#ffa500" />
          <span style={{ fontSize: '13px', color: '#ffa500' }}>
            {delayed.length} avgång{delayed.length > 1 ? 'ar' : ''} är försenad{delayed.length > 1 ? 'e' : ''}
          </span>
        </div>
      )}

      <div style={{ padding: '8px 16px' }}>
        <DepartureList
          departures={departures}
          loading={loading}
          error={null}
          lastUpdated={null}
        />
      </div>
    </motion.div>
  )
}