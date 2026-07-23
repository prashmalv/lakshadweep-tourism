import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBar from '../components/StatusBar'
import BottomNav from '../components/BottomNav'

const CITIES = [
  { code: 'agatti',    name: 'Agatti',    emoji: '✈️', tagline: 'The Gateway Isle' },
  { code: 'kavaratti', name: 'Kavaratti', emoji: '🕌', tagline: 'The Capital Lagoon' },
  { code: 'minicoy',   name: 'Minicoy',   emoji: '🗼', tagline: 'The Lighthouse Isle' },
  { code: 'kadmat',    name: 'Kadmat',    emoji: '🤿', tagline: 'Water Sports Hub' },
  { code: 'kalpeni',   name: 'Kalpeni',   emoji: '🛶', tagline: 'Serene Lagoon' },
  { code: 'bangaram',  name: 'Bangaram',  emoji: '🐚', tagline: 'Teardrop Atoll' },
]

const DATA = {
  agatti: {
    mustVisit: [
      { name: 'Agatti Turquoise Lagoon', fee: 'Permit reqd', hours: 'Daylight (calm AM best)', type: 'outdoor', tag: 'Iconic',
        note: 'Shallow, glassy lagoon ringing the island. Glass-bottom boat rides run 8–10 AM when visibility peaks.' },
      { name: 'Agatti House Reef', fee: '₹1,500 snorkel', hours: '8 AM – 4 PM', type: 'outdoor', tag: 'Reef',
        note: 'Live coral garden metres from shore — parrotfish, clownfish and turtles. Reef shoes advised; never touch coral.' },
      { name: 'Discover Scuba · Agatti', fee: '₹3,500 dive', hours: 'Morning slots', type: 'outdoor', tag: 'Scuba',
        note: 'Perfect first-timer dive in sheltered water. No certification needed for the intro dive.' },
      { name: 'Agatti Airport Sandbar View', fee: 'Free', hours: 'Anytime', type: 'outdoor', tag: 'Photo',
        note: 'The runway sits on a spit between two lagoons — stunning aerial-style views on approach and from the jetty road.' },
      { name: 'Agatti Village & Jetty', fee: 'Free', hours: 'Anytime (morning best)', type: 'outdoor', tag: 'Culture',
        note: 'Quiet coral-stone lanes, coir workshops and tuna boats. Dress modestly; the island is largely dry.' },
    ],
    activities: [
      { name: 'Glass-bottom boat over coral', type: 'outdoor', price: '₹700/person', icon: '🚤' },
      { name: 'Guided reef snorkel tour', type: 'outdoor', price: '₹1,500/person', icon: '🤿' },
      { name: 'Lagoon kayaking at sunset', type: 'outdoor', price: '₹600/person', icon: '🛶' },
      { name: 'Coir & coconut craft demo', type: 'indoor', price: '₹300/person', icon: '🥥' },
      { name: 'Tuna & reef-fish seafood tasting', type: 'indoor', price: '₹800/person', icon: '🐟' },
    ],
    events: [
      { name: 'Samudram Cruise Boarding · Agatti Leg', date: 'Oct 2026 – May 2027', venue: 'Agatti Jetty', price: '₹41,500 pkg', booking: 'https://samudram.utl.gov.in/sprt_Packages.aspx' },
      { name: 'Lagoon Snorkel & Reef Walk (daily)', date: 'Running · Oct–May', venue: 'Agatti House Reef', price: '₹1,500', booking: 'https://samudram.utl.gov.in/' },
      { name: 'Sunset Dolphin Boat Ride', date: 'Running (sea permitting)', venue: 'Agatti Lagoon', price: '₹900', booking: 'https://samudram.utl.gov.in/' },
    ],
  },
  kavaratti: {
    mustVisit: [
      { name: 'Marine Aquarium', fee: '₹50 / ₹100', hours: '9 AM – 5 PM', type: 'indoor', tag: 'Museum',
        note: 'Displays of live reef fish, corals and preserved marine specimens from the archipelago. Great for families.' },
      { name: 'Ujra Mosque', fee: 'Free', hours: 'Outside prayer times', type: 'indoor', tag: 'Heritage',
        note: 'Ornately carved mosque said to have a well of sweet water. Dress modestly; remove footwear.' },
      { name: 'Kavaratti Lagoon watersports', fee: '₹500 onward', hours: '8 AM – 5 PM', type: 'outdoor', tag: 'Iconic',
        note: 'Still, glassy lagoon for kayaking, snorkelling and glass-bottom boats right off the beach.' },
      { name: 'Dolphin Dive Centre', fee: '₹3,500 dive', hours: 'Morning slots', type: 'outdoor', tag: 'Scuba',
        note: 'Guided reef dives and discover-scuba sessions in the sheltered lagoon.' },
    ],
    activities: [
      { name: 'Glass-bottom boat · lagoon coral', type: 'outdoor', price: '₹700/person', icon: '🚤' },
      { name: 'Kayaking in the calm lagoon', type: 'outdoor', price: '₹500/person', icon: '🛶' },
      { name: 'Coconut-curry cooking demo', type: 'indoor', price: '₹900/person', icon: '🍳' },
      { name: 'Marine Aquarium guided tour', type: 'indoor', price: '₹150/person', icon: '🐠' },
    ],
    events: [
      { name: 'Samudram Coral Cruise · Kavaratti Leg', date: 'Oct 2026 – May 2027', venue: 'Kavaratti Jetty', price: '₹41,500 pkg', booking: 'https://samudram.utl.gov.in/sprt_Packages.aspx' },
      { name: 'Minicoy Festival & Cultural Evening', date: 'Dec 2026', venue: 'Kavaratti (Capital)', price: 'Free entry', booking: 'https://samudram.utl.gov.in/' },
      { name: 'Lagoon Watersports Carnival', date: 'Jan 2027', venue: 'Kavaratti Lagoon', price: 'Free entry · ticketed rides', booking: 'https://samudram.utl.gov.in/' },
    ],
  },
  minicoy: {
    mustVisit: [
      { name: 'Minicoy Lighthouse', fee: '₹25', hours: '9 AM – 5 PM', type: 'outdoor', tag: 'Iconic',
        note: '19th-century British-era lighthouse. Climb the spiral stairs for sweeping views of the crescent lagoon.' },
      { name: 'Minicoy Lagoon', fee: 'Permit reqd', hours: 'Daylight (calm AM best)', type: 'outdoor', tag: 'Lagoon',
        note: 'One of India\'s largest lagoons — vast, sheltered turquoise water ideal for snorkelling and boating.' },
      { name: 'Lava Dance performance', fee: '₹200 show', hours: 'Evening slots', type: 'indoor', tag: 'Culture',
        note: 'Traditional Mahl (Dhivehi) dance performed by island villages in colourful costume — a Minicoy signature.' },
      { name: 'Tuna Canning Factory tour', fee: 'Free', hours: '10 AM – 4 PM', type: 'indoor', tag: 'Heritage',
        note: 'See how the island\'s famous tuna and masmin (dried tuna) are processed. A window into Minicoy life.' },
    ],
    activities: [
      { name: 'Lighthouse climb & photo point', type: 'outdoor', price: '₹25/person', icon: '🗼' },
      { name: 'Lava dance cultural evening', type: 'indoor', price: '₹200/person', icon: '🎭' },
      { name: 'Tuna & masmin tasting', type: 'indoor', price: '₹600/person', icon: '🐟' },
      { name: 'Lagoon snorkel excursion', type: 'outdoor', price: '₹1,500/person', icon: '🤿' },
    ],
    events: [
      { name: 'Samudram Coral Cruise · Minicoy Leg', date: 'Oct 2026 – May 2027', venue: 'Minicoy Jetty', price: '₹41,500 pkg', booking: 'https://samudram.utl.gov.in/sprt_Packages.aspx' },
      { name: 'Minicoy Traditional Boat Race', date: 'Dec 2026', venue: 'Minicoy Lagoon', price: 'Free entry', booking: 'https://samudram.utl.gov.in/' },
      { name: 'Lava Dance Cultural Night', date: 'Running (on cruise arrivals)', venue: 'Minicoy Village', price: '₹200', booking: 'https://samudram.utl.gov.in/' },
    ],
  },
  kadmat: {
    mustVisit: [
      { name: 'Water Sports Institute', fee: '₹1,500 onward', hours: '8 AM – 5 PM', type: 'outdoor', tag: 'Iconic',
        note: 'SPORTS-run hub for scuba, wind-surfing, para-sailing and kayaking on a long, twin-lagoon island.' },
      { name: 'Kadmat Dive Sites', fee: '₹3,500 dive', hours: 'Morning slots', type: 'outdoor', tag: 'Scuba',
        note: 'PADI courses and reef dives on some of Lakshadweep\'s richest coral walls. Manta rays and reef sharks.' },
      { name: 'Kadmat Lagoon (both shores)', fee: 'Permit reqd', hours: 'Daylight', type: 'outdoor', tag: 'Lagoon',
        note: 'Lagoons on both sides of the narrow island — one calm for beginners, one for wind-surfing.' },
      { name: 'Coral Beach & Sandbar', fee: 'Free', hours: 'Anytime (sunset best)', type: 'outdoor', tag: 'Photo',
        note: 'Powder-soft sand and shallow shelving water. Beautiful low-tide sandbar walks.' },
    ],
    activities: [
      { name: 'Discover scuba dive', type: 'outdoor', price: '₹3,500/person', icon: '🤿' },
      { name: 'Wind-surfing lesson', type: 'outdoor', price: '₹2,000/person', icon: '🏄' },
      { name: 'Para-sailing over the lagoon', type: 'outdoor', price: '₹1,800/person', icon: '🪂' },
      { name: 'Night snorkel with guide', type: 'outdoor', price: '₹1,200/person', icon: '🔦' },
    ],
    events: [
      { name: 'Kadmat Dive & Watersports Package', date: 'Oct 2026 – May 2027', venue: 'Kadmat Institute', price: '₹31,500 pkg', booking: 'https://samudram.utl.gov.in/sprt_Packages.aspx' },
      { name: 'PADI Open Water Course (batch)', date: 'Monthly · Oct–May', venue: 'Kadmat Water Sports Institute', price: '₹28,000', booking: 'https://samudram.utl.gov.in/' },
      { name: 'Wind-surfing Regatta', date: 'Feb 2027', venue: 'Kadmat Lagoon', price: 'Free entry', booking: 'https://samudram.utl.gov.in/' },
    ],
  },
  kalpeni: {
    mustVisit: [
      { name: 'Koomel Beach', fee: 'Free', hours: 'Anytime (calm AM best)', type: 'outdoor', tag: 'Iconic',
        note: 'Sheltered, shallow bay with calm water for canoeing, pedal boats and reef walks — a cruise day-visit favourite.' },
      { name: 'Kalpeni Lagoon & Islets', fee: 'Permit reqd', hours: 'Daylight', type: 'outdoor', tag: 'Lagoon',
        note: 'Serene lagoon fringed by three islets — Cheriyam, Tilakkam and Pitti. Glass-clear water for snorkelling.' },
      { name: 'Coral Debris Storm Bank', fee: 'Free', hours: 'Anytime', type: 'outdoor', tag: 'Heritage',
        note: 'A dramatic bank of coral rubble thrown up by a historic storm — a reminder of the reef\'s living power.' },
      { name: 'Kalpeni Village Walk', fee: 'Free', hours: 'Morning best', type: 'outdoor', tag: 'Culture',
        note: 'Coir-making, coconut groves and friendly island life. Dress modestly; the island is largely dry.' },
    ],
    activities: [
      { name: 'Canoeing in Koomel bay', type: 'outdoor', price: '₹500/person', icon: '🛶' },
      { name: 'Reef walk & snorkel', type: 'outdoor', price: '₹1,500/person', icon: '🤿' },
      { name: 'Pedal-boat lagoon ride', type: 'outdoor', price: '₹400/person', icon: '🚣' },
      { name: 'Coconut-curry & appam tasting', type: 'indoor', price: '₹700/person', icon: '🥥' },
    ],
    events: [
      { name: 'Samudram Coral Cruise · Kalpeni Leg', date: 'Oct 2026 – May 2027', venue: 'Kalpeni / Koomel Beach', price: '₹41,500 pkg', booking: 'https://samudram.utl.gov.in/sprt_Packages.aspx' },
      { name: 'Koomel Beach Day Picnic', date: 'Running (on cruise arrivals)', venue: 'Koomel Beach', price: 'Included in cruise', booking: 'https://samudram.utl.gov.in/' },
      { name: 'Lagoon Canoe Race', date: 'Jan 2027', venue: 'Kalpeni Lagoon', price: 'Free entry', booking: 'https://samudram.utl.gov.in/' },
    ],
  },
  bangaram: {
    mustVisit: [
      { name: 'Bangaram Beach', fee: '₹Resort', hours: 'Anytime', type: 'outdoor', tag: 'Iconic',
        note: 'Powder-white sand on a teardrop atoll — the one island fully open to foreign nationals. Beach cottages only.' },
      { name: 'Thinnakara Sandbank', fee: '₹Tents', hours: 'Anytime (sunset best)', type: 'outdoor', tag: 'Beaches',
        note: 'A tiny sandbank beside Bangaram with beach tents. Wade across the shallow lagoon at low tide.' },
      { name: 'Bangaram Reef & Dive Sites', fee: '₹3,500 dive', hours: 'Morning slots', type: 'outdoor', tag: 'Scuba',
        note: 'Pristine reefs with dolphins, turtles and reef sharks. Discover-scuba and certified dives daily.' },
      { name: 'Stargazing Point', fee: 'Free', hours: 'After dark', type: 'outdoor', tag: 'Photo',
        note: 'No light pollution on this uninhabited atoll — dazzling night skies over the lagoon.' },
    ],
    activities: [
      { name: 'Dolphin-spotting boat trip', type: 'outdoor', price: '₹1,200/person', icon: '🐬' },
      { name: 'Reef snorkel & dive', type: 'outdoor', price: '₹1,500/person', icon: '🤿' },
      { name: 'Kayak to Thinnakara', type: 'outdoor', price: '₹800/person', icon: '🛶' },
      { name: 'Beach-tent stay & stargazing', type: 'outdoor', price: '₹Tents', icon: '⛺' },
    ],
    events: [
      { name: 'Bangaram Island Retreat Package', date: 'Oct 2026 – May 2027', venue: 'Bangaram · Thinnakara', price: '₹52,999 pkg', booking: 'https://samudram.utl.gov.in/sprt_Packages.aspx' },
      { name: 'Thinnakara Sunset & Stargazing Night', date: 'Running · Oct–May', venue: 'Thinnakara Sandbank', price: 'Included in stay', booking: 'https://samudram.utl.gov.in/' },
      { name: 'Dolphin Watch Boat Trip', date: 'Running (sea permitting)', venue: 'Bangaram Lagoon', price: '₹1,200', booking: 'https://samudram.utl.gov.in/' },
    ],
  },
}

export default function CityAttractions() {
  const navigate = useNavigate()
  const [activeCity, setActiveCity] = useState('agatti')
  const [tab, setTab] = useState('attractions')

  const city = DATA[activeCity]
  const cityMeta = CITIES.find(c => c.code === activeCity)

  return (
    <div className="app-shell">
      <StatusBar light />

      {/* Header */}
      <div style={{ background: 'var(--grad-hero)', padding: '12px 16px 14px', color: '#fff', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <div className="pattern-bg" style={{ opacity: 0.3 }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ fontSize: 18, color: '#fff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => navigate(-1)}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>🎟 Things to Do</div>
              <div style={{ fontSize: 10.5, opacity: 0.9 }}>Attractions, activities & live events</div>
            </div>
          </div>

          {/* City selector */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginTop: 12, paddingBottom: 2 }} className="hide-scrollbar">
            {CITIES.map(c => (
              <button
                key={c.code}
                onClick={() => setActiveCity(c.code)}
                style={{
                  flexShrink: 0, padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: activeCity === c.code ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: activeCity === c.code ? 'var(--primary-dark)' : '#fff',
                  border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {[['attractions', '🏛 Must Visit'], ['activities', '🎨 Activities'], ['events', '🎤 Events']].map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setTab(val)}
            style={{
              flex: 1, padding: '10px 4px', fontSize: 11.5, fontWeight: 700,
              color: tab === val ? 'var(--primary)' : 'var(--ink-mute)',
              background: 'none', border: 'none',
              borderBottom: tab === val ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            {lbl}
          </button>
        ))}
      </div>

      <div className="screen-scroll">
        <div className="content">
          <div style={{ fontSize: 11, color: 'var(--ink-mute)', fontWeight: 700 }}>
            {cityMeta.emoji} {cityMeta.name} · {cityMeta.tagline}
          </div>

          {tab === 'attractions' && city.mustVisit.map(a => (
            <div
              key={a.name}
              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(a.name + ' ' + cityMeta.name + ' Lakshadweep')}`, '_blank')}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--ink)' }}>{a.name}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>⏰ {a.hours}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 6, background: a.type === 'outdoor' ? '#FEF3C7' : '#DBEAFE', color: a.type === 'outdoor' ? '#92400E' : '#1E40AF' }}>
                  {a.type === 'outdoor' ? '☀️ Outdoor' : '🏛 Indoor'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <span className="chip chip-primary" style={{ fontSize: 10 }}>🎫 {a.fee}</span>
                <span className="chip chip-neutral" style={{ fontSize: 10 }}>{a.tag}</span>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>💡 {a.note}</div>
              <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700, marginTop: 6 }}>📍 Tap to open in Google Maps →</div>
            </div>
          ))}

          {tab === 'activities' && city.activities.map(a => (
            <div key={a.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink)' }}>{a.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 9.5, fontWeight: 800, padding: '2px 6px', borderRadius: 5, background: a.type === 'outdoor' ? '#FEF3C7' : '#DBEAFE', color: a.type === 'outdoor' ? '#92400E' : '#1E40AF' }}>
                    {a.type === 'outdoor' ? '☀️ Outdoor' : '🏛 Indoor'}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>{a.price}</span>
                </div>
              </div>
            </div>
          ))}

          {tab === 'events' && (
            <>
              <div style={{ background: 'linear-gradient(135deg,#FEF3C7,#FDE68A)', border: '1px solid #F59E0B', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 22 }}>🎤</span>
                <div style={{ fontSize: 11, color: '#78350F', lineHeight: 1.5, fontWeight: 600 }}>
                  Cruise legs, dive courses, regattas & island festivals — booking via the <strong>SPORTS</strong> portal & official operators.
                </div>
              </div>

              {city.events.map(e => (
                <div key={e.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)' }}>{e.name}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 2 }}>📅 {e.date}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-mute)', marginTop: 1 }}>📍 {e.venue}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 6, background: '#FEE2E2', color: '#991B1B', flexShrink: 0 }}>
                      {e.price}
                    </span>
                  </div>
                  <button
                    onClick={() => window.open(e.booking, '_blank')}
                    className="btn-pri btn-sm"
                    style={{ width: '100%', marginTop: 6, fontSize: 11.5, padding: '8px 0' }}
                  >
                    🎟 Book Tickets →
                  </button>
                </div>
              ))}

              <div style={{ background: 'var(--primary-ghost)', borderRadius: 10, padding: '10px 12px', fontSize: 10.5, color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                💡 Disclaimer: Event dates & prices are illustrative. Final booking always via official partner. We do not handle payments — you are redirected to the operator.
              </div>
            </>
          )}

          <div style={{ height: 8 }} />
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
