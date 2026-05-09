import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Users, Shield, LogOut, ChevronLeft } from 'lucide-react'
import Logo from '../components/Logo'
import { logout } from '../api/auth'
import { getUsers, updateUserRole } from '../api/admin'

const ROLE_LABELS = { 0: 'User', 1: 'Admin' }
const ROLE_COLORS = { 0: 'var(--text-dim)', 1: 'var(--accent)' }

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }, [])

  const toggleRole = async (user) => {
    const newRole = user.role === 0 ? 1 : 0
    setUpdating(user.id)
    try {
      const updated = await updateUserRole(user.id, newRole)
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="app-wrapper" style={{ background: 'var(--bg)' }}>
      <aside className="sidebar">
        <div className="logo-section">
          <Logo subtitle="ADMIN PANEL" />
        </div>
        <nav style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{ background: 'transparent', border: 'none', padding: '12px 16px', borderRadius: '10px', color: 'var(--text-dim)', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <ChevronLeft size={16} /> Back to App
          </button>
          <button
            style={{ background: 'rgba(45,99,237,0.1)', border: 'none', padding: '12px 16px', borderRadius: '10px', color: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <div style={{ width: '4px', height: '14px', background: 'var(--accent)', borderRadius: '2px' }} />
            <Users size={15} /> Users
          </button>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => { logout(); window.location.href = '/login' }}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', width: '100%', justifyContent: 'center', fontSize: '13px' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="auth-main" style={{ justifyContent: 'flex-start', paddingTop: '40px', alignItems: 'flex-start' }}>
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <header style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ background: 'rgba(45,99,237,0.1)', padding: '10px', borderRadius: '12px' }}>
                <Shield size={20} color="var(--accent)" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>User Management</h2>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
              Manage user roles. Click the role badge to toggle between User and Admin.
            </p>
          </header>

          <div style={{ background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>All Users</span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)' }}>{users.length} total</span>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading users...</div>
            ) : users.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>No users found.</div>
            ) : users.map((user, i) => (
              <motion.div key={user.id}
                style={{ display: 'flex', alignItems: 'center', padding: '18px 28px', borderBottom: i < users.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(45,99,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px', marginRight: '16px', flexShrink: 0, color: 'var(--accent)' }}>
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: '600' }}>{user.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-dim)', marginTop: '2px' }}>{user.email}</div>
                </div>
                <button
                  onClick={() => toggleRole(user)}
                  disabled={updating === user.id}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${ROLE_COLORS[user.role]}`,
                    background: user.role === 1 ? 'rgba(45,99,237,0.1)' : 'rgba(255,255,255,0.03)',
                    color: ROLE_COLORS[user.role],
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: updating === user.id ? 'not-allowed' : 'pointer',
                    opacity: updating === user.id ? 0.5 : 1,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {user.role === 1 && <Shield size={13} />}
                  {updating === user.id ? '...' : ROLE_LABELS[user.role]}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
