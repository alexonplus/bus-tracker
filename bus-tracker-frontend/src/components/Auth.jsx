import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import Logo from './Logo'
import { login, register } from '../api/auth'
import '../Auth.css'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const getPasswordStrength = (pass) => {
    if (!pass) return 0
    let s = 0
    if (pass.length > 6) s++
    if (pass.length > 10) s++
    if (/[A-Z]/.test(pass)) s++
    if (/[0-9]/.test(pass)) s++
    if (/[^A-Za-z0-9]/.test(pass)) s++
    return Math.min(s, 4)
  }

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = ['#ff4d4d', '#ffa500', '#ffcc00', '#00cc66', '#00ff88']
  const passwordStrength = getPasswordStrength(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.response?.data || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrapper" id="auth-page">
      <aside className="sidebar">
        <div className="logo-section">
          <Logo />
        </div>
        <div className="visual-text">
          <h2>Your journey through the Nordic heart, simplified.</h2>
        </div>
        <div className="footer-credits">
          © 2026 Bus Tracker Sweden AB.<br />
          Real-time data provided by Västtrafik & SL API.
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="tabs">
            <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(null) }}>Login</button>
            <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(null) }}>Register</button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {typeof error === 'string' ? error : 'Authentication failed.'}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" placeholder="namn@exempel.se" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {mode === 'register' && password && (
                <div className="strength-meter">
                  <div className="strength-bars">
                    {[0, 1, 2, 3].map((step) => (
                      <div key={step} className="strength-step" style={{ backgroundColor: passwordStrength > step ? strengthColors[passwordStrength] : '' }} />
                    ))}
                  </div>
                  <span className="strength-text" style={{ color: strengthColors[passwordStrength] }}>{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  {mode === 'login' ? 'Sign in to departures' : 'Create Account'}
                  <ArrowRight size={18} />
                </div>
              )}
            </button>
          </form>

          <p className="social-hint">Track your favorites, anywhere in Sweden.</p>
        </div>
      </main>
    </div>
  )
}
