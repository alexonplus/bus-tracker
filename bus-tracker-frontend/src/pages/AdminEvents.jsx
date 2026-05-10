import { useState } from 'react'
import { ChevronLeft, Calendar, MapPin, Search } from 'lucide-react'
import Logo from '../components/Logo'
import { createEvent } from '../api/events'
import { searchStops } from '../api/resrobot'
import { logout } from '../api/auth'

const CATEGORIES = ['Music','Gaming','Fashion','Outdoor','FoodMarket','Sports','Culture','Other']
const CATEGORY_ICONS = { Music:'🎵', Gaming:'🎮', Fashion:'👗', Outdoor:'🌿', FoodMarket:'🍜', Sports:'⚽', Culture:'🎭', Other:'📌' }

export default function AdminEvents() {
  const [form, setForm] = useState({
    title: '', description: '', eventDate: '', address: '', category: 'Other',
    stopId: '', stopExtId: '', stopName: ''
  })
  const [stopSearch, setStopSearch] = useState('')
  const [stopResults, setStopResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState([])

  const handleStopSearch = async (q) => {
    setStopSearch(q)
    if (!q.trim()) { setStopResults([]); return }
    setSearching(true)
    try { setStopResults((await searchStops(q)) || []) }
    catch { setStopResults([]) }
    finally { setSearching(false) }
  }

  const selectStop = (stop) => {
    setForm(f => ({ ...f, stopId: stop.id, stopExtId: stop.extId, stopName: stop.name }))
    setStopSearch(stop.name)
    setStopResults([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    if (!form.stopExtId) {
      setErrors(['Välj en hållplats från sökresultaten.'])
      return
    }
    setSaving(true)
    try {
      await createEvent({ ...form, eventDate: new Date(form.eventDate).toISOString() })
      setSuccess(true)
      setForm({ title:'', description:'', eventDate:'', address:'', category:'Other', stopId:'', stopExtId:'', stopName:'' })
      setStopSearch('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setErrors(Object.values(data.errors).flat().map(String))
      } else if (typeof data === 'string') {
        setErrors([data])
      } else {
        setErrors(['Något gick fel. Försök igen.'])
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="app-wrapper">
      <aside className="sidebar">
        <div className="logo-section"><Logo subtitle="ADMIN PANEL" /></div>
        <nav style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button onClick={() => window.location.href = '/admin'} style={{ background: 'transparent', border: 'none', padding: '12px 16px', borderRadius: '10px', color: 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ChevronLeft size={16} /> Admin panel
          </button>
          <button onClick={() => window.location.href = '/events'} style={{ background: 'transparent', border: 'none', padding: '12px 16px', borderRadius: '10px', color: 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={15} /> Visa evenemang
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => { logout(); window.location.href = '/login' }} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', width: '100%', justifyContent: 'center', fontSize: '13px' }}>
            Logga ut
          </button>
        </div>
      </aside>

      <main className="auth-main" style={{ justifyContent: 'flex-start', paddingTop: '40px' }}>
        <div style={{ width: '100%', maxWidth: '620px', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '700' }}>Skapa evenemang</h2>
            <p style={{ color: 'var(--text-dim)', marginTop: '8px' }}>Fyll i detaljer. Användare ser hur de tar sig dit.</p>
          </header>

          {success && (
            <div style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', padding: '14px 18px', color: '#00ff88', fontSize: '14px', marginBottom: '20px' }}>
              ✓ Evenemang skapat!
            </div>
          )}

          {errors.length > 0 && (
            <div style={{ background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px' }}>
              {errors.map((e, i) => <p key={i} style={{ color: '#ff4d4d', fontSize: '14px' }}>⚠ {e}</p>)}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Category */}
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Kategori</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat} type="button" onClick={() => setForm(f => ({ ...f, category: cat }))}
                      style={{ padding: '8px 14px', borderRadius: '10px', border: `1px solid ${form.category === cat ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, background: form.category === cat ? 'rgba(45,99,237,0.15)' : 'transparent', color: form.category === cat ? 'white' : 'var(--text-dim)', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}
                    >
                      {CATEGORY_ICONS[cat]} {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Titel *</label>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="t.ex. Göteborg Electronic Festival" style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none' }} />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Beskrivning</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Kort beskrivning av evenemanget..." style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none', resize: 'vertical' }} />
              </div>

              {/* Date */}
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Datum & tid *</label>
                <input required type="datetime-local" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none', colorScheme: 'dark' }} />
              </div>

              {/* Stop search */}
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Hållplats vid evenemanget *</label>
                <div style={{ position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', opacity: 0.5 }} size={16} />
                  <input value={stopSearch} onChange={e => handleStopSearch(e.target.value)} placeholder="Sök hållplats..." required={!form.stopExtId}
                    style={{ width: '100%', padding: '14px 14px 14px 42px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${form.stopExtId ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none' }} />
                </div>
                {stopResults.length > 0 && (
                  <div style={{ background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', marginTop: '8px', overflow: 'hidden' }}>
                    {stopResults.slice(0, 5).map((stop, i) => (
                      <button key={i} type="button" onClick={() => selectStop(stop)}
                        style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        <MapPin size={14} color="var(--accent)" /> {stop.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>Adress (valfri)</label>
                <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="t.ex. Avenyn 1, Göteborg" style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', fontSize: '15px', outline: 'none' }} />
              </div>

              <button type="submit" disabled={saving}
                style={{ padding: '16px', background: 'var(--accent)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <Calendar size={18} /> {saving ? 'Sparar...' : 'Skapa evenemang'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
