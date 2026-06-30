import { Shield,LogOut,Wind } from "lucide-react"
import Logo from '../components/Logo'
import {isAdmin} from '../utils/jwt'
import React from "react"


export default function Sider({ weather, navItems, activeSection, onLogout }) {
  return (
    
<aside className="sidebar">
        <div className="logo-section">
          <Logo subtitle="RESEPLANERAREN • 2026" />
        </div>

        <nav style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button key={item.id}
            onClick={item.onClick}
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
          <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', width: '100%', justifyContent: 'center', fontSize: '13px' }}>
            <LogOut size={16} /> Logga ut
          </button>
        </div>

           </aside>

      
  )
}