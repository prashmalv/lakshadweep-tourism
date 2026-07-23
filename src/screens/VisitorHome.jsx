import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'
import LanguageSelector from '../components/LanguageSelector'
import { destinations, useApp } from '../context/AppContext'
import { useT } from '../i18n'

const HERO_ISLANDS = [
  { name: 'Agatti', tagline: 'The Gateway Lagoon', emoji: '🏝️', visitors: '2,140', color: '#0E9AAB', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=82' },
  { name: 'Bangaram', tagline: 'The Teardrop Atoll', emoji: '🐚', visitors: '1,320', color: '#0C5FA8', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=82' },
  { name: 'Kavaratti', tagline: 'The Capital Isle', emoji: '🕌', visitors: '1,880', color: '#0A6E7C', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82' },
  { name: 'Minicoy', tagline: 'The Lighthouse Island', emoji: '🗼', visitors: '960', color: '#F0654A', img: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200&q=82' },
  { name: 'Kadmat', tagline: 'The Dive Capital', emoji: '🤿', visitors: '1,150', color: '#22C3C3', img: 'https://images.unsplash.com/photo-1502209524164-acea936639a2?auto=format&fit=crop&w=1200&q=82' },
]

const ISLAND_GRID = [
  { name: 'Agatti', tagline: 'The Gateway Lagoon', emoji: '🏝️', bg: '#E4F5F6', color: '#0E9AAB', img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=82', dest: 1 },
  { name: 'Bangaram', tagline: 'The Teardrop Atoll', emoji: '🐚', bg: '#E1ECF7', color: '#0C5FA8', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=82', dest: 2 },
  { name: 'Kavaratti', tagline: 'Capital of Lakshadweep', emoji: '🕌', bg: '#D6F3F5', color: '#0A6E7C', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=82', dest: 3 },
  { name: 'Minicoy', tagline: 'The Lighthouse Island', emoji: '🗼', bg: '#FCEAE2', color: '#E85D3D', img: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=800&q=82', dest: 4 },
  { name: 'Kadmat', tagline: 'Scuba & Water Sports', emoji: '🤿', bg: '#D6F3F5', color: '#22C3C3', img: 'https://images.unsplash.com/photo-1502209524164-acea936639a2?auto=format&fit=crop&w=800&q=82', dest: 5 },
  { name: 'Kalpeni', tagline: 'The Calm Lagoon', emoji: '🛶', bg: '#E4F5F6', color: '#0E9AAB', img: 'https://images.unsplash.com/photo-1518606371321-e3b1f46b5d5b?auto=format&fit=crop&w=800&q=82', dest: 6 },
]


export default function VisitorHome() {
  const navigate = useNavigate()
  const { appLanguage } = useApp()
  const t = useT(appLanguage)
  const [heroIdx, setHeroIdx] = useState(0)
  const [aiInput, setAiInput] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [cityWeather, setCityWeather] = useState({})
  const inputRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true)
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % HERO_ISLANDS.length)
        setTransitioning(false)
      }, 300)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetch('/api/weather')
      .then(r => r.json())
      .then(d => {
        const map = {}
        d.cities?.forEach(c => { map[c.name] = c })
        setCityWeather(map)
      })
      .catch(() => {})
  }, [])

  const city = HERO_ISLANDS[heroIdx]

  const handleAsk = (q) => {
    const query = (q || aiInput).trim()
    // Guests go to login first; logged-in users go straight to chat
    navigate('/login', { state: { aiRedirect: true, initialMsg: query || undefined } })
  }

  return (
    <div className="app-shell" style={{ background: 'var(--bg)' }}>
      <StatusBar light />

      {/* ── HERO CAROUSEL ── */}
      <div style={{ height: 260, position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
        {/* Background image */}
        <img
          key={city.name}
          src={city.img}
          alt={city.name}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.35s ease',
          }}
          onError={e => { e.target.style.display = 'none' }}
        />
        {/* Dark gradient for readability */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.72) 100%)' }} />

        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '6px 10px', borderRadius: 14 }}>
            <span style={{ fontSize: 14 }}>🏝️</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 0.3 }}>LAKSHADWEEP TOURISM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LanguageSelector light />
          </div>
        </div>

        {/* Island info */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 3,
          opacity: transitioning ? 0 : 1, transition: 'opacity 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 8, letterSpacing: 0.5 }}>
              👥 {city.visitors} visiting today
            </span>
            <span style={{ background: city.color, color: '#fff', fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 8, letterSpacing: 0.3 }}>
              LIVE
            </span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -0.5, textShadow: '0 2px 12px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>
            {city.emoji} {city.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
              {city.tagline}
            </div>
            {cityWeather[city.name] && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '3px 8px' }}>
                <span style={{ fontSize: 13 }}>{cityWeather[city.name].emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{cityWeather[city.name].temp}°C</span>
                <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{cityWeather[city.name].condition}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ position: 'absolute', bottom: 10, right: 16, display: 'flex', gap: 5, zIndex: 4 }}>
          {HERO_ISLANDS.map((_, i) => (
            <div
              key={i}
              onClick={() => setHeroIdx(i)}
              style={{ width: i === heroIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === heroIdx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }}
            />
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="screen-scroll">
        <div className="content" style={{ paddingTop: 12 }}>

          {/* ── AI CHAT BAR ── */}
          <div style={{ background: 'linear-gradient(135deg, #0E9AAB0A, #FF7A590A)', border: '1.5px solid var(--primary)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 24px rgba(14,154,171,0.12)' }}>

            {/* Bot header */}
            <div style={{ padding: '14px 14px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, position: 'relative' }}>
                🤖
                <span style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, background: '#10B981', border: '2px solid #fff', borderRadius: '50%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--primary-dark)' }}>Kadal AI — your Lakshadweep guide</div>
                <div style={{ fontSize: 10, color: 'var(--ink-mute)' }}>Multilingual · Personalised · Available 24×7</div>
              </div>
            </div>

            {/* Main invite */}
            <div style={{ margin: '0 14px', background: '#fff', border: '1px solid var(--primary-ghost)', borderRadius: 12, padding: '11px 13px' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary-dark)', marginBottom: 4 }}>
                🙏 സ്വാഗതം — Welcome to the Islands
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.65 }}>
                Ask me anything about Lakshadweep — entry permits, island packages, scuba & snorkelling, lagoon activities, ferries & flights, best season — all in one place, in your language.
              </div>
            </div>

            {/* Sign-in benefits */}
            <div style={{ margin: '10px 14px 0', background: 'linear-gradient(135deg,#ECFEFF,#FFF7ED)', border: '1px solid #A5F0F0', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#0A6E7C', marginBottom: 7 }}>📲 Sign in to unlock more:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  ['🪪', 'Apply & track your Entry Permit — required for all island visits'],
                  ['🗺', 'Personalised island itinerary by travel style & interests'],
                  ['🌊', 'Sea & weather advisories — ferry status and lagoon conditions'],
                  ['📢', 'Grievance filing → goes directly to Govt. tourism officers'],
                ].map(([ico, txt]) => (
                  <div key={txt} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{ico}</span>
                    <span style={{ fontSize: 10.5, color: '#0A6E7C', lineHeight: 1.5 }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA button */}
            <div style={{ padding: '12px 14px 14px' }}>
              <button
                onClick={() => handleAsk()}
                style={{ width: '100%', background: 'var(--grad-hero)', border: 'none', borderRadius: 14, padding: '13px 0', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 3px 12px rgba(14,154,171,0.4)', letterSpacing: 0.2 }}
              >
                <span>🚀</span>
                <span>Start My Personalised Journey</span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
            </div>
          </div>

          {/* ── STATS BAR ── */}
          <div style={{ background: 'linear-gradient(135deg, var(--primary-darker), #0C5FA8)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {[['36', 'Coral Islands'], ['6', 'Tourist Isles'], ['4,200', 'km² Lagoon'], ['32', 'km² Land']].map(([val, label], i, arr) => (
                <div key={label} style={{ flex: 1, textAlign: 'center', padding: '10px 4px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: -0.3 }}>{val}</div>
                  <div style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginTop: 1 }}>{label}</div>
                </div>
              ))}
            </div>
            <div
              style={{ borderTop: '1px solid rgba(255,255,255,0.15)', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer' }}
              onClick={() => window.open('https://samudram.utl.gov.in/', '_blank')}
            >
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>🏛 Data source: Lakshadweep Tourism (SPORTS) · samudram.utl.gov.in</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>↗</span>
            </div>
          </div>

          {/* ── ISLAND GRID WITH TAGLINES ── */}
          <div>
            <div className="sec-head" style={{ marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800 }}>Explore the Islands</h3>
              <span className="more" onClick={() => navigate('/explore')}>{t.viewAll}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {ISLAND_GRID.map(c => (
                <div
                  key={c.name}
                  onClick={() => c.dest ? navigate(`/destination/${c.dest}`) : navigate('/explore')}
                  style={{ borderRadius: 14, overflow: 'hidden', cursor: 'pointer', position: 'relative', height: 120, background: c.bg, border: `1.5px solid ${c.color}22`, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}
                >
                  <img src={c.img} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10, zIndex: 2 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{c.emoji} {c.name}</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginTop: 1 }}>{c.tagline}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8, background: c.color, borderRadius: 6, padding: '2px 6px', fontSize: 8, fontWeight: 800, color: '#fff', zIndex: 2 }}>
                    EXPLORE
                  </div>
                  {cityWeather[c.name] && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)', borderRadius: 6, padding: '2px 6px', fontSize: 9, fontWeight: 700, color: '#fff', zIndex: 2, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <span>{cityWeather[c.name].emoji}</span>
                      <span>{cityWeather[c.name].temp}°C</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── ENTRY PERMIT CTA ── */}
          <div
            onClick={() => navigate('/login', { state: { permitRedirect: true } })}
            style={{ background: 'linear-gradient(135deg, #ECFEFF, #D6F3F5)', border: '1.5px solid var(--primary)', borderRadius: 14, padding: '14px 16px', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 30 }}>🪪</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 2 }}>Entry Permit required for all islands</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>Apply online in minutes · No sponsor needed (2026 rules) · Track status here</div>
              </div>
              <span style={{ fontSize: 18, color: 'var(--primary)' }}>→</span>
            </div>
          </div>

          {/* ── GUEST CTA ── */}
          <div style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', border: '1.5px solid #86EFAC', borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 30 }}>🔓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#14532D', marginBottom: 2 }}>{t.signInUnlock}</div>
                <div style={{ fontSize: 10.5, color: '#166534', lineHeight: 1.4 }}>Book packages · Entry permits · AI guide · File grievances</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              <button className="btn-sec" style={{ fontSize: 11.5, padding: '8px 0' }} onClick={() => navigate('/login')}>
                📱 Mobile / Email
              </button>
              <button className="btn-pri" style={{ fontSize: 11.5, padding: '8px 0' }} onClick={() => navigate('/signup')}>
                ✨ Sign Up Free
              </button>
            </div>
          </div>

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
