import { motion } from 'motion/react'

export default function Logo({ subtitle }) {
  return (
    <div className="custom-logo">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ position: 'relative', width: '42px', height: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 0' }}>
          <div style={{ position: 'relative', width: '100%', height: '2px', background: 'rgba(0, 172, 233, 0.2)', borderRadius: '2px' }}>
            <motion.div animate={{ x: [-20, 60] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', width: '15px', height: '100%', background: 'linear-gradient(90deg, transparent, #00ACE9, transparent)', boxShadow: '0 0 10px #00ACE9' }} />
          </div>
          <div style={{ position: 'relative', width: '100%', height: '2px', background: 'rgba(0, 172, 233, 0.2)', borderRadius: '2px' }}>
            <motion.div animate={{ x: [-20, 60] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              style={{ position: 'absolute', width: '15px', height: '100%', background: 'linear-gradient(90deg, transparent, #00ACE9, transparent)', boxShadow: '0 0 10px #00ACE9' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.8px', color: 'white', lineHeight: '1', textTransform: 'uppercase' }}>
            Buss-Event
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '1.5px', color: 'var(--accent)', fontWeight: '600', marginTop: '5px', textTransform: 'uppercase' }}>
            {subtitle || 'Göteborg'}
          </span>
        </div>
      </div>
    </div>
  )
}
