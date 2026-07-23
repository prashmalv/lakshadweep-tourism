import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import AppBar from '../components/AppBar'
import BottomNav from '../components/BottomNav'
import { useApp } from '../context/AppContext'

const ISLANDS = ['Agatti', 'Bangaram', 'Kavaratti', 'Minicoy', 'Kadmat', 'Kalpeni']
const ID_TYPES = ['Aadhaar Card', 'Passport', 'Voter ID', 'Driving Licence']

// A demo "already-approved" permit so officers/reviewers can see the tracking view.
const EXISTING_PERMIT = {
  id: 'LEP-2026-018472',
  status: 'approved',
  islands: 'Kavaratti · Kalpeni · Minicoy',
  from: '15 Nov 2026',
  to: '19 Nov 2026',
  applicant: 'Arjun Nair',
  timeline: [
    { status: 'done', title: 'Application submitted', time: '02 Nov 2026 · 10:24 AM', note: 'ID verified · itinerary attached' },
    { status: 'done', title: 'Under review — SPORTS', time: '03 Nov 2026', note: 'Reviewed by Entry Permit Cell, Kavaratti' },
    { status: 'active', title: 'Permit approved ✓', time: '05 Nov 2026', note: 'e-Permit issued · valid for listed islands & dates' },
    { status: '', title: 'Carry at check-in', time: 'Kochi Port / Agatti Airport', note: 'Show QR + original ID at embarkation' },
  ],
}

export default function EntryPermit() {
  const navigate = useNavigate()
  const { showToast } = useApp()

  const [tab, setTab] = useState('active') // 'active' | 'apply'
  const [nationality, setNationality] = useState('Indian')
  const [idType, setIdType] = useState('Aadhaar Card')
  const [idNumber, setIdNumber] = useState('')
  const [island, setIsland] = useState('Agatti')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [idUploaded, setIdUploaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isForeign = nationality === 'Foreign'
  const canSubmit = idNumber.trim() && from && to && idUploaded

  const handleSubmit = () => {
    if (!canSubmit) { showToast('Please complete all fields & upload ID'); return }
    setSubmitted(true)
    showToast('✅ Entry Permit application submitted')
  }

  return (
    <div className="app-shell">
      <div style={{ background: 'var(--grad-hero)', flexShrink: 0 }}>
        <StatusBar light />
      </div>
      <AppBar title="Entry Permit" back variant="grad" />

      {/* Tabs */}
      <div className="chip-scroll" style={{ gap: 8 }}>
        <span className={`chip ${tab === 'active' ? 'chip-primary' : 'chip-neutral'}`} onClick={() => setTab('active')}>🪪 My Permit</span>
        <span className={`chip ${tab === 'apply' ? 'chip-primary' : 'chip-neutral'}`} onClick={() => { setTab('apply'); setSubmitted(false) }}>➕ Apply New</span>
      </div>

      <div className="screen-scroll">
        <div className="content" style={{ paddingTop: 12 }}>

          {/* Info banner */}
          <div className="safety-badge">
            <span style={{ fontSize: 16 }}>ℹ️</span>
            <span style={{ lineHeight: 1.4 }}>
              All visitors need a valid <strong>Entry Permit</strong> for Lakshadweep. Apply
              at least 15 days before travel. <strong>2026 update:</strong> Indian tourists no
              longer need a local sponsor or police-clearance certificate.
            </span>
          </div>

          {/* ── ACTIVE PERMIT VIEW ── */}
          {tab === 'active' && (
            <>
              <div className="booking-card">
                <div style={{ background: 'var(--grad-hero)', padding: '14px 16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
                  <div className="pattern-bg" style={{ opacity: 0.25 }} />
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 10, opacity: 0.85, letterSpacing: 0.5 }}>e-ENTRY PERMIT</div>
                      <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>{EXISTING_PERMIT.applicant}</div>
                      <div style={{ fontSize: 11, opacity: 0.92, marginTop: 3 }}>📍 {EXISTING_PERMIT.islands}</div>
                      <div style={{ fontSize: 11, opacity: 0.92, marginTop: 2 }}>🗓 {EXISTING_PERMIT.from} → {EXISTING_PERMIT.to}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div className="qr-code" style={{ background: '#fff', padding: 4 }} />
                      <span className="chip chip-success" style={{ marginTop: 6, display: 'inline-block' }}>✓ Approved</span>
                    </div>
                  </div>
                </div>
                <div className="booking-card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 10 }}>
                    <span style={{ color: 'var(--ink-mute)' }}>Permit ID</span>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{EXISTING_PERMIT.id}</span>
                  </div>
                  <div className="timeline" style={{ paddingLeft: 4 }}>
                    {EXISTING_PERMIT.timeline.map((item, i) => (
                      <div key={i} className={`tl-item ${item.status}`}>
                        <div className="tl-dot" />
                        <div className="tl-title">{item.title}</div>
                        <div className="tl-time">{item.time}</div>
                        {item.note && <div className="tl-note">{item.note}</div>}
                      </div>
                    ))}
                  </div>
                  <div className="grid-2" style={{ marginTop: 12 }}>
                    <button className="btn-flat" style={{ textAlign: 'center', fontSize: 11 }} onClick={() => showToast('📥 Permit PDF downloaded')}>📄 Download</button>
                    <button className="btn-pri btn-sm" style={{ display: 'block', textAlign: 'center' }} onClick={() => window.open('https://epermit.utl.gov.in', '_blank')}>Official Portal ↗</button>
                  </div>
                </div>
              </div>

              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>💡 Kadal AI note</div>
                <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 4 }}>
                  Carry your original photo ID along with this e-Permit. Permits are checked at
                  Kochi embarkation and again on arrival at the islands.
                </div>
              </div>
            </>
          )}

          {/* ── APPLY VIEW ── */}
          {tab === 'apply' && !submitted && (
            <>
              {/* Nationality */}
              <div className="fld">
                <label>Nationality</label>
                <div className="grid-2">
                  {['Indian', 'Foreign'].map(n => (
                    <button
                      key={n}
                      onClick={() => setNationality(n)}
                      className={n === nationality ? 'btn-pri btn-sm' : 'btn-sec btn-sm'}
                      style={{ display: 'block', textAlign: 'center' }}
                    >{n === 'Indian' ? '🇮🇳 Indian' : '🌐 Foreign'}</button>
                  ))}
                </div>
              </div>

              {isForeign && (
                <div className="safety-badge" style={{ background: 'var(--warning-bg)', borderColor: 'var(--warning)', color: 'var(--warning-text)' }}>
                  <span style={{ fontSize: 16 }}>⚠️</span>
                  <span style={{ lineHeight: 1.4 }}>Foreign nationals are primarily permitted to <strong>Bangaram</strong> (sometimes Agatti). Additional security clearance applies and takes longer.</span>
                </div>
              )}

              {/* ID type */}
              <div className="fld">
                <label>ID Proof Type</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(isForeign ? ['Passport'] : ID_TYPES).map(t => (
                    <span key={t} className={`chip ${t === idType ? 'chip-primary' : 'chip-neutral'}`} style={{ cursor: 'pointer', padding: '6px 10px' }} onClick={() => setIdType(t)}>{t}</span>
                  ))}
                </div>
              </div>

              {/* ID number */}
              <div className="fld">
                <label>{idType} Number</label>
                <div className="input">
                  <span className="ic">🪪</span>
                  <input value={idNumber} onChange={e => setIdNumber(e.target.value)} placeholder={isForeign ? 'Passport number' : 'Enter your ID number'} />
                </div>
              </div>

              {/* Island */}
              <div className="fld">
                <label>Island(s) to Visit</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(isForeign ? ['Bangaram', 'Agatti'] : ISLANDS).map(isl => (
                    <span key={isl} className={`chip ${isl === island ? 'chip-primary' : 'chip-neutral'}`} style={{ cursor: 'pointer', padding: '6px 10px' }} onClick={() => setIsland(isl)}>{isl}</span>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid-2">
                <div className="fld">
                  <label>Arrival Date</label>
                  <div className="input"><span className="ic">🗓</span><input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
                </div>
                <div className="fld">
                  <label>Departure Date</label>
                  <div className="input"><span className="ic">🗓</span><input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
                </div>
              </div>

              {/* Upload */}
              <div className="fld">
                <label>Upload ID Document</label>
                <div
                  onClick={() => setIdUploaded(true)}
                  style={{ border: `1.5px dashed ${idUploaded ? 'var(--success)' : 'var(--primary)'}`, borderRadius: 12, padding: '18px 12px', textAlign: 'center', cursor: 'pointer', background: idUploaded ? 'var(--success-bg)' : 'var(--primary-ghost)' }}
                >
                  <div style={{ fontSize: 26 }}>{idUploaded ? '✅' : '📎'}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: idUploaded ? 'var(--success-text)' : 'var(--primary-dark)', marginTop: 4 }}>
                    {idUploaded ? 'ID uploaded · id-scan.jpg' : 'Tap to upload ID proof (JPG/PDF)'}
                  </div>
                </div>
              </div>

              <button className="btn-pri" onClick={handleSubmit} style={{ opacity: canSubmit ? 1 : 0.6 }}>
                Submit Permit Application →
              </button>
              <div style={{ fontSize: 10, color: 'var(--ink-mute)', textAlign: 'center', lineHeight: 1.5 }}>
                Applications are processed by the Entry Permit Cell, SPORTS, Kavaratti.
                You can also apply at <strong>epermit.utl.gov.in</strong>
              </div>
            </>
          )}

          {/* ── SUBMITTED CONFIRMATION ── */}
          {tab === 'apply' && submitted && (
            <div className="empty-state" style={{ paddingTop: 30 }}>
              <div style={{ fontSize: 60 }}>🪪</div>
              <h3>Application Submitted!</h3>
              <p>
                Your Entry Permit request for <strong>{island}</strong> ({from} → {to}) has been
                received. Reference <strong style={{ fontFamily: 'monospace' }}>LEP-2026-{Math.floor(100000 + Math.random() * 900000)}</strong>.
                <br />Track status under “My Permit”. Typical approval: 3–7 working days.
              </p>
              <button className="btn-pri" style={{ maxWidth: 260 }} onClick={() => setTab('active')}>View My Permit →</button>
              <button className="btn-flat" style={{ textAlign: 'center' }} onClick={() => navigate('/home')}>Back to Home</button>
            </div>
          )}

          <div style={{ height: 12 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
