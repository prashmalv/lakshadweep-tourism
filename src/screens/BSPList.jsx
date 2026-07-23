import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { useApp } from '../context/AppContext'

const BSP_DATA = [
  { id: 'BSP-4521', name: 'Kadmat Dive School', location: 'Kadmat', type: 'Dive Operator', rating: 4.9, reviews: 892, status: 'verified', price: '₹3,500/dive', badge: '🤿' },
  { id: 'BSP-3891', name: 'Bangaram Beach Resort', location: 'Bangaram', type: 'Resort', rating: 4.8, reviews: 1240, status: 'verified', price: '₹9,500/night', badge: '🏝️' },
  { id: 'BSP-2211', name: 'Agatti Lagoon Cottages', location: 'Agatti', type: 'Resort', rating: 4.6, reviews: 567, status: 'verified', price: '₹3,500/night', badge: '🐚' },
  { id: 'BSP-1104', name: 'Kavaratti Watersports Centre', location: 'Kavaratti', type: 'Water Sports', rating: 4.9, reviews: 2340, status: 'verified', price: '₹1,500/person', badge: '⛵' },
  { id: 'BSP-0890', name: 'Certified Island Guides', location: 'Agatti', type: 'Guide', rating: 4.7, reviews: 1890, status: 'verified', price: '₹800/day', badge: '👤' },
]

export default function BSPList() {
  const navigate = useNavigate()
  const { showToast } = useApp()
  const [filter, setFilter] = useState('All')

  return (
    <div className="app-shell">
      <StatusBar />
      <AppBar title="Service Providers (BSP)" back />

      <div className="chip-scroll">
        {['All', 'Dive Operators', 'Resorts', 'Water Sports', 'Guides'].map(f => (
          <span key={f} className={`chip ${filter === f ? 'chip-primary' : 'chip-neutral'}`} style={{ cursor: 'pointer' }} onClick={() => setFilter(f)}>{f}</span>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content">
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>🛡 All verified by SPORTS · Lakshadweep Tourism</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 3 }}>All listed BSPs are government-registered, background-verified, and DPDP compliant. File a complaint if you face any issue.</div>
          </div>

          {BSP_DATA.map(bsp => (
            <div key={bsp.id} className="list-card" style={{ cursor: 'pointer' }} onClick={() => showToast('BSP detail coming soon')}>
              <div className="lc-thumb" style={{ background: 'var(--grad-hero)', fontSize: 24 }}>{bsp.badge}</div>
              <div className="lc-info">
                <div className="lc-title">{bsp.name}</div>
                <div className="lc-sub">
                  <span>📍 {bsp.location}</span>
                  <span>⭐ {bsp.rating}</span>
                  <span className="chip chip-success" style={{ fontSize: 9, padding: '1px 5px' }}>✓ Verified</span>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>{bsp.type} · {bsp.reviews} reviews</div>
              </div>
              <div>
                <div className="lc-price">{bsp.price}</div>
              </div>
            </div>
          ))}
          <div style={{ height: 8 }} />
        </div>
      </div>

      <div className="chat-fab" onClick={() => navigate('/ai-chat')}>💬<span className="fab-badge" /></div>
      <BottomNav />
    </div>
  )
}
