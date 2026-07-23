import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBar from '../components/StatusBar'

const PLACES_DB = {
  ujra:       { name: 'Ujra Mosque, Kavaratti', emoji: '🕌', city: 'Kavaratti', type: 'Heritage Mosque', rating: '4.8 ⭐', famous: 'One of the oldest and most ornate mosques in Lakshadweep, famed for its intricately carved driftwood ceiling and a well whose water is believed to have healing properties.', history: 'Built centuries ago on the capital island of Kavaratti, the Ujra (Jamath) Mosque is a masterpiece of coral-stone and carved-timber craftsmanship. Its beams were reportedly shaped from a single piece of driftwood that washed ashore.', entry: 'Free · Modest dress required', time: '6 AM – 8 PM (outside prayer times)', tips: 'Dress modestly and remove footwear. Non-Muslims may view the exterior and courtyard; ask permission before photographing inside.' },
  minicoy:    { name: 'Minicoy Lighthouse', emoji: '🗼', city: 'Minicoy', type: 'Colonial-era Landmark', rating: '4.9 ⭐', famous: 'A 19th-century lighthouse on the southernmost island of Lakshadweep — climb its spiral staircase for a sweeping view over one of India\'s largest lagoons.', history: 'Commissioned by the British in the 1880s to guide ships through the reef-lined channel, the lighthouse still stands guard over Minicoy (Maliku), an island with a distinct Mahl (Dhivehi) culture and the traditional Lava dance.', entry: '₹20 · Camera extra', time: '9 AM – 5 PM', tips: 'Climb early to beat the heat. Pair it with a visit to a Minicoy tuna-canning unit and a lagoon boat ride.' },
  reef:       { name: 'Coral Reef & Reef Fish', emoji: '🐠', city: 'Agatti · Kadmat', type: 'Marine Ecosystem', rating: '4.9 ⭐', famous: 'Lakshadweep\'s living coral gardens teem with parrotfish, butterflyfish, manta rays, reef sharks and sea turtles — among the most pristine reefs in India.', history: 'These atolls are the exposed tips of ancient coral formations built over millennia. The eco-sensitive reef supports hundreds of fish species and is protected as part of a fragile marine ecosystem.', entry: 'Snorkel free at shore · Dive ₹3,500', time: 'Best 8 AM – 2 PM (calm seas)', tips: 'Never touch or stand on coral. Wear reef shoes, use reef-safe sunscreen, and always snorkel or dive with a SPORTS-registered operator.' },
  agatti:     { name: 'Agatti Lagoon', emoji: '🏝️', city: 'Agatti', type: 'Turquoise Lagoon', rating: '4.8 ⭐', famous: 'A dazzling shallow lagoon ringed around the 7 km gateway island — impossibly clear turquoise water perfect for snorkelling, glass-bottom boats and first-timer scuba.', history: 'Agatti is the only island in Lakshadweep with an airport, making its lagoon the first sight most visitors get. The reef flat protects a calm, waist-deep lagoon that glows every shade of blue.', entry: 'Free · Entry Permit required', time: 'Sunrise to Sunset', tips: 'Low tide reveals reef pools full of fish. Sunset from the airstrip end of the lagoon is unforgettable.' },
  bangaram:   { name: 'Bangaram Atoll', emoji: '🐚', city: 'Bangaram', type: 'Uninhabited Coral Atoll', rating: '4.9 ⭐', famous: 'A teardrop-shaped atoll of powder-white sand and coconut palms — the one island in Lakshadweep fully open to foreign nationals, famed for dolphins and untouched reefs.', history: 'Uninhabited but for a single beach resort, Bangaram sits on a coral atoll shared with the tiny sandbank of Thinnakara. Its surrounding reefs and deep drop-offs make it a prized diving destination.', entry: 'Resort/permit based', time: 'Day visits & overnight stays', tips: 'Wade across to Thinnakara at low tide. Dolphin-spotting boat trips run at dawn. Foreign nationals can stay here with the right clearance.' },
}

const TRANSLATE_DB = {
  welcome:  { original: 'സ്വാഗതം', meaning: '"Welcome"', language: 'Malayalam / Jeseri', context: 'The Malayalam greeting "Swagatham" welcomes visitors to Lakshadweep. Locals speak the Jeseri dialect of Malayalam (and Mahl/Dhivehi on Minicoy). You\'ll see this word on tourism signboards across the islands.' },
  hours:    { original: 'ബോട്ട് സമയം: രാവിലെ ७:೦೦ മുതൽ വൈകുന്നേരം ५:೦೦ വരെ · കടൽ ക്ഷോഭം ഉള്ളപ്പോൾ റദ്ദാക്കാം', meaning: 'Ferry Timings: Morning 7:00 AM to Evening 5:00 PM · May be cancelled during rough seas', language: 'Malayalam', context: 'A typical inter-island ferry/jetty notice. Boat services connect the islands and are weather-dependent — sailings are often suspended during the SW monsoon (Jun–Sep) when seas are rough.' },
  entry:    { original: 'എൻട്രി പെർമിറ്റ് നിർബന്ധം · ദ്വീപ് പ്രവേശന ഫീസ്: ഇന്ത്യൻ പൗരന്മാർ ₹50 | റീഫ് ഫീസ്: ₹100', meaning: 'Entry Permit mandatory · Island Entry Fee: Indian Citizens ₹50 | Reef Fee: ₹100', language: 'Malayalam', context: 'A standard notice at island jetties. Every non-islander tourist needs a valid Entry Permit (apply at epermit.utl.gov.in) before travel, plus small island-entry and reef-conservation fees managed by the UT administration.' },
}

const DEMO_RESULTS = [
  { mode: 'identify', place: 'ujra' },
  { mode: 'identify', place: 'minicoy' },
  { mode: 'identify', place: 'bangaram' },
  { mode: 'translate', key: 'welcome' },
  { mode: 'translate', key: 'hours' },
]

export default function VisualAI() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [mode, setMode] = useState('identify')
  const [analyzing, setAnalyzing] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [result, setResult] = useState(null)
  const [targetLang, setTargetLang] = useState(user?.language || 'English')
  const fileRef = useRef(null)

  const runDemo = () => {
    setImagePreview('demo')
    setResult(null)
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      const keys = Object.keys(PLACES_DB)
      const translateKeys = Object.keys(TRANSLATE_DB)
      if (mode === 'identify') {
        setResult({ type: 'place', data: PLACES_DB[keys[Math.floor(Math.random() * keys.length)]] })
      } else {
        setResult({ type: 'translate', data: TRANSLATE_DB[translateKeys[Math.floor(Math.random() * translateKeys.length)]] })
      }
    }, 2400)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImagePreview(ev.target.result)
      setResult(null)
      setAnalyzing(true)
      setTimeout(() => {
        setAnalyzing(false)
        const keys = Object.keys(PLACES_DB)
        const translateKeys = Object.keys(TRANSLATE_DB)
        if (mode === 'identify') {
          setResult({ type: 'place', data: PLACES_DB[keys[Math.floor(Math.random() * keys.length)]] })
        } else {
          setResult({ type: 'translate', data: TRANSLATE_DB[translateKeys[Math.floor(Math.random() * translateKeys.length)]] })
        }
      }, 2400)
    }
    reader.readAsDataURL(file)
  }

  const reset = () => { setImagePreview(null); setResult(null); setAnalyzing(false) }

  const switchMode = (m) => { setMode(m); reset() }

  return (
    <div className="app-shell">
      <StatusBar light />
      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 0', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.25 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <button style={{ fontSize: 18, color: '#fff', background: 'none' }} onClick={() => navigate(-1)}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800 }}>Visual AI</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Identify places · Translate text</div>
            </div>
            <span className="chip chip-white">🤖 AI Powered</span>
          </div>
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: 0, background: 'rgba(0,0,0,0.2)', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
            {[['identify', '📸 Identify Place'], ['translate', '🗣 Translate Text']].map(([val, lbl]) => (
              <button key={val} onClick={() => switchMode(val)} style={{ flex: 1, padding: '10px 8px', fontSize: 12, fontWeight: 700, color: mode === val ? 'var(--primary-dark)' : 'rgba(255,255,255,0.8)', background: mode === val ? '#fff' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">

          {/* Upload area (when no image) */}
          {!imagePreview && !analyzing && (
            <>
              {mode === 'translate' && (
                <div className="fld">
                  <label>Translate Into</label>
                  <div className="input">
                    <span className="ic">🌐</span>
                    <select style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, color: 'var(--ink)', fontWeight: 600, outline: 'none' }} value={targetLang} onChange={e => setTargetLang(e.target.value)}>
                      {['English', 'Hindi', 'German', 'French', 'Japanese', 'Spanish', 'Chinese', 'Korean', 'Arabic'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed var(--primary)', borderRadius: 16, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: 'var(--primary-ghost)', transition: 'all 0.2s' }}>
                <div style={{ fontSize: 44 }}>{mode === 'identify' ? '📸' : '🖼️'}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary-dark)', marginTop: 10 }}>Tap to Upload Photo</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>
                  {mode === 'identify' ? 'Islands, reefs, marine life, landmarks — AI recognises 500+ island sites' : 'Malayalam, Hindi, Mahl sign or menu board'}
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <span className="chip chip-neutral">📱 Camera</span>
                  <span className="chip chip-neutral">🖼 Gallery</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} style={{ display: 'none' }} />

              <button className="btn-sec" onClick={runDemo}>✨ Try Demo — See AI in Action</button>

              <div className="ai-box">
                <div className="bold" style={{ fontSize: 12, color: 'var(--ink)' }}>
                  {mode === 'identify' ? '🏯 How Place Identification Works' : '🌍 For Foreign Tourists'}
                </div>
                <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 3 }}>
                  {mode === 'identify'
                    ? 'Upload any photo of a Lakshadweep island, reef, marine life or landmark. AI matches it against a database of 500+ island sites and instantly tells you its name, history, fees, visiting hours, and local tips.'
                    : 'Photograph any Malayalam, Hindi or Mahl sign, menu, jetty notice, or information board. AI detects the script, translates to your preferred language, and provides cultural context to help you understand the meaning.'}
                </div>
              </div>
            </>
          )}

          {/* Image preview */}
          {imagePreview && (
            <div style={{ position: 'relative' }}>
              {imagePreview === 'demo' ? (
                <div style={{ width: '100%', height: 190, borderRadius: 16, background: mode === 'identify' ? 'var(--grad-hero)' : 'linear-gradient(135deg,#F0F9FF,#BAE6FD)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, flexShrink: 0 }}>
                  {mode === 'identify' ? '🏯' : '📜'}
                </div>
              ) : (
                <img src={imagePreview} alt="Uploaded" style={{ width: '100%', borderRadius: 16, maxHeight: 220, objectFit: 'cover', display: 'block' }} />
              )}
              {!analyzing && <button onClick={reset} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: '50%', width: 30, height: 30, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>✕</button>}
            </div>
          )}

          {/* Analyzing loader */}
          {analyzing && (
            <div style={{ textAlign: 'center', padding: '14px 0' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid var(--primary)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>🤖 AI Analyzing...</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>
                {mode === 'identify' ? 'Matching against 500+ Lakshadweep island sites...' : 'Detecting script · Running OCR · Translating...'}
              </div>
            </div>
          )}

          {/* Place identification result */}
          {result?.type === 'place' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: '#10B981', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>✓ IDENTIFIED</span>
                <span style={{ fontSize: 10.5, color: 'var(--ink-mute)', fontWeight: 700 }}>{result.data.type}</span>
              </div>
              <div style={{ border: '2px solid var(--primary)', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ background: 'var(--primary)', padding: '12px 14px', color: '#fff' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 32 }}>{result.data.emoji}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800 }}>{result.data.name}</div>
                      <div style={{ fontSize: 11, opacity: 0.9 }}>📍 {result.data.city} · {result.data.rating}</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: 3 }}>⭐ Why Famous</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{result.data.famous}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--primary-dark)', textTransform: 'uppercase', marginBottom: 3 }}>📜 History</div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{result.data.history}</div>
                  </div>
                  <div className="grid-2">
                    <div style={{ background: 'var(--soft)', borderRadius: 10, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontWeight: 700 }}>Entry Fee</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 800, marginTop: 2, lineHeight: 1.4 }}>{result.data.entry}</div>
                    </div>
                    <div style={{ background: 'var(--soft)', borderRadius: 10, padding: '8px 10px' }}>
                      <div style={{ fontSize: 10, color: 'var(--ink-mute)', fontWeight: 700 }}>Timings</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink)', fontWeight: 800, marginTop: 2, lineHeight: 1.4 }}>{result.data.time}</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, padding: '10px 12px' }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--accent-dark)', marginBottom: 3 }}>💡 Local Tips</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{result.data.tips}</div>
                  </div>
                </div>
              </div>
              <div className="grid-2">
                <button className="btn-sec" onClick={reset}>📸 Try Another</button>
                <button className="btn-pri" onClick={() => navigate('/ai-chat')}>💬 Ask AI More</button>
              </div>
            </div>
          )}

          {/* Translation result */}
          {result?.type === 'translate' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ background: 'var(--accent)', color: '#3D1F00', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 6 }}>✓ TRANSLATED</span>
                <span style={{ fontSize: 10.5, color: 'var(--ink-mute)', fontWeight: 700 }}>Detected: {result.data.language}</span>
              </div>
              <div style={{ border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ background: '#F0F9FF', borderBottom: '1px solid #BAE6FD', padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', marginBottom: 5 }}>Original · {result.data.language}</div>
                  <div style={{ fontSize: 15, color: '#0C4A6E', fontWeight: 600, lineHeight: 1.6, fontFamily: '"Noto Sans Devanagari", sans-serif' }}>{result.data.original}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg,var(--primary-ghost),var(--soft))', borderBottom: '1px solid var(--border)', padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, color: 'var(--primary-dark)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 5 }}>Translation → {targetLang}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 700, lineHeight: 1.6 }}>{result.data.meaning}</div>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ink-mute)', textTransform: 'uppercase', marginBottom: 4 }}>📖 Context & Meaning</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{result.data.context}</div>
                </div>
              </div>
              <div className="grid-2">
                <button className="btn-sec" onClick={reset}>🔄 Translate Another</button>
                <button className="btn-pri" onClick={() => navigate('/ai-chat')}>💬 Ask AI</button>
              </div>
            </div>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
