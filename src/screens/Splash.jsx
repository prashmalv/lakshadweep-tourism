import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BG = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85'

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/visitor'), 3200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      onClick={() => navigate('/visitor')}
      style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '100%', background: '#064652', cursor: 'pointer' }}
    >
      {/* Background photo */}
      <img
        src={BG}
        alt="Lakshadweep"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 1 }}
      />

      {/* Ocean gradient overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(6,70,82,0.5) 0%,rgba(14,154,171,0.15) 30%,rgba(14,154,171,0.2) 55%,rgba(6,70,82,0.85) 100%)', zIndex: 2 }} />

      {/* Top wave decoration */}
      <svg viewBox="0 0 420 100" width="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 3 }} preserveAspectRatio="none">
        <path d="M0,0 L0,55 Q70,25 140,48 Q210,70 280,45 Q350,22 420,50 L420,0 Z" fill="rgba(14,154,171,0.45)" />
        <path d="M0,0 L0,38 Q70,12 140,32 Q210,50 280,28 Q350,8 420,34 L420,0 Z" fill="rgba(34,195,195,0.3)" />
        {/* Sun / shell accents */}
        <circle cx="60" cy="46" r="3" fill="rgba(255,122,89,0.6)" />
        <circle cx="360" cy="46" r="3" fill="rgba(255,122,89,0.6)" />
      </svg>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '80px 24px 100px', textAlign: 'center' }}>

        {/* App icon */}
        <div style={{
          width: 88, height: 88, borderRadius: 22,
          background: 'linear-gradient(135deg,#0E9AAB,#0A6E7C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, marginBottom: 18,
          boxShadow: '0 12px 36px rgba(0,0,0,0.5), 0 0 0 3px rgba(255,255,255,0.25)',
          border: '2px solid rgba(255,255,255,0.3)',
        }}>🏝️</div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: -0.5, marginBottom: 6, textShadow: '0 3px 12px rgba(0,0,0,0.55)', lineHeight: 1.1 }}>
          Lakshadweep Tourism
        </h1>

        <div style={{ fontSize: 24, fontWeight: 700, color: '#FFB59E', marginBottom: 4, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          സ്വാഗതം
        </div>

        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', letterSpacing: 0.8, marginBottom: 36 }}>
          Coral Paradise · Welcome to our Islands
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[0, 0.22, 0.44].map((delay, i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF7A59', animation: `bounce 1.4s infinite ${delay}s`, boxShadow: '0 2px 6px rgba(0,0,0,0.3)', display: 'block' }} />
          ))}
        </div>
      </div>

      {/* Bottom lagoon waves */}
      <svg viewBox="0 0 420 90" width="100%" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 4 }} preserveAspectRatio="none">
        <path d="M0,45 Q55,15 110,40 Q165,65 220,35 Q275,8 330,38 Q375,60 420,42 L420,90 L0,90 Z" fill="rgba(6,70,82,0.72)" />
        <path d="M0,58 Q70,32 140,55 Q210,76 280,50 Q340,28 420,56 L420,90 L0,90 Z" fill="rgba(14,154,171,0.6)" />
        <path d="M0,70 Q90,54 180,67 Q270,80 360,63 Q395,55 420,70 L420,90 L0,90 Z" fill="rgba(34,195,195,0.5)" />
      </svg>

      {/* Govt branding */}
      <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, zIndex: 6, textAlign: 'center' }}>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, letterSpacing: 0.3 }}>
          <strong>UT of Lakshadweep</strong> · Department of Tourism (SPORTS)<br />
          DPDP Act 2023 Compliant · MeitY Certified · v1.0
        </div>
      </div>
    </div>
  )
}
