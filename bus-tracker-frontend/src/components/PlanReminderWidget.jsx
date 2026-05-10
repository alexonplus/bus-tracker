import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Bus } from 'lucide-react'

const STORAGE_KEY = 'bustrackerPlan'

export function savePlan(plan) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
  window.dispatchEvent(new Event('bustrackerPlanUpdated'))
}

export function clearPlan() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('bustrackerPlanUpdated'))
}

function loadPlan() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const p = JSON.parse(raw)
  p.depDateTime = new Date(p.depDateTime)
  return p
}

export default function PlanReminderWidget() {
  const [plan, setPlan] = useState(loadPlan)
  const [timeLeft, setTimeLeft] = useState('')
  const [rainExpected, setRainExpected] = useState(false)

  useEffect(() => {
    const onUpdate = () => setPlan(loadPlan())
    window.addEventListener('bustrackerPlanUpdated', onUpdate)
    return () => window.removeEventListener('bustrackerPlanUpdated', onUpdate)
  }, [])

  useEffect(() => {
    setRainExpected(false)
    if (!plan) return
    const eventDate = new Date(plan.eventDate)
    const diffDays = Math.floor((eventDate - new Date()) / 86400000)
    if (diffDays < 0 || diffDays > 6) return
    fetch('https://api.open-meteo.com/v1/forecast?latitude=57.70&longitude=11.97&daily=precipitation_sum&timezone=Europe%2FStockholm&forecast_days=7')
      .then(r => r.json())
      .then(data => {
        const dateStr = eventDate.toISOString().split('T')[0]
        const idx = data.daily?.time?.indexOf(dateStr)
        if (idx !== -1 && idx !== undefined) setRainExpected((data.daily.precipitation_sum[idx] ?? 0) > 0)
      })
      .catch(() => {})
  }, [plan])

  useEffect(() => {
    if (!plan) return
    const update = () => {
      const diff = plan.depDateTime - new Date()
      if (diff < -7200000) { clearPlan(); return }
      if (diff < 0) { setTimeLeft('Nu!'); return }
      const totalH = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      if (totalH >= 24) {
        const days = Math.floor(totalH / 24)
        setTimeLeft(`${days} dygn`)
      } else if (totalH > 0) {
        setTimeLeft(`${totalH} h ${m} min`)
      } else {
        setTimeLeft(`${m} min`)
      }
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [plan])

  if (!plan) return null

  const isToday = plan.depDateTime.toDateString() === new Date().toDateString()
  const accent = isToday ? '#ff6b6b' : '#2d63ed'
  const bg = isToday ? 'rgba(255,107,107,0.12)' : 'rgba(45,99,237,0.12)'
  const border = isToday ? 'rgba(255,107,107,0.35)' : 'rgba(45,99,237,0.35)'

  return (
    <AnimatePresence>
      <motion.div
        key="plan-reminder"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={
          isToday
            ? { opacity: 1, y: 0, scale: [1, 1.015, 1], boxShadow: ['0 4px 24px rgba(255,107,107,0.1)', '0 4px 28px rgba(255,107,107,0.35)', '0 4px 24px rgba(255,107,107,0.1)'] }
            : { opacity: 1, y: 0, scale: 1, boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }
        }
        transition={
          isToday
            ? { duration: 2.8, repeat: Infinity, ease: 'easeInOut', opacity: { duration: 0.3 }, y: { duration: 0.3 } }
            : { duration: 0.3 }
        }
        style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, background: bg, border: `1px solid ${border}`, borderRadius: '16px', padding: '12px 14px', width: '240px', cursor: 'default' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Bus size={15} color={accent} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {plan.lines} · kl {plan.depTimeStr}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {plan.eventTitle}
            </div>
            <div style={{ fontSize: '12px', color: accent, fontWeight: '600', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isToday ? 'Idag · ' : ''}{timeLeft ? `Om ${timeLeft}` : ''}
              {rainExpected && <span title="Regn väntas" style={{ fontSize: '13px', opacity: 0.85 }}>☂</span>}
            </div>
          </div>
          <button
            onClick={clearPlan}
            style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: '4px 7px', borderRadius: '6px', fontSize: '13px', lineHeight: 1, flexShrink: 0 }}
          >✕</button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
