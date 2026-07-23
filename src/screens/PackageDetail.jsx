import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp, packages } from '../context/AppContext'

const TESTIMONIALS = {
  1: [
    { name: 'Rahul M.', city: 'Delhi', rating: 5, text: 'Absolutely magical! The cruise covered everything perfectly. The Kavaratti lagoon at sunrise was breathtaking — worth every rupee.' },
    { name: 'Priya S.', city: 'Mumbai', rating: 5, text: 'The reef walk at Kalpeni was stunning. The glassy turquoise lagoon from the deck felt like a painting. Highly recommend for couples!' },
    { name: 'James W.', city: 'London', rating: 4, text: 'Well organised, great crew. Minicoy was the highlight — the 19th-century lighthouse, the Lava dance and sunrise at sea were unforgettable.' },
    { name: 'Kavita R.', city: 'Bangalore', rating: 5, text: 'Travelled as a family with elderly parents. The pace was perfect and the glass-bottom boat rides were gentle and easy. Loved it!' },
  ],
  2: [
    { name: 'Ankit J.', city: 'Ahmedabad', rating: 5, text: 'The Agatti lagoon was out of this world! Snorkelling over the coral with our beach cottage steps from the water — island glamping at its best.' },
    { name: 'Sunita P.', city: 'Pune', rating: 4, text: 'The house-reef snorkelling off Agatti was incredible. The guide was very knowledgeable and the glass-bottom boat ride was thrilling!' },
    { name: 'Vikram T.', city: 'Delhi', rating: 5, text: 'Short but perfectly packed trip. The sunset beach walk was my favourite, and the village stroll and coral-point picnic were memorable.' },
  ],
  3: [
    { name: 'Rohan D.', city: 'Hyderabad', rating: 5, text: 'Romantic trip with my wife — Bangaram exceeded all expectations. Spotting dolphins on the reef trip was a joyful bonus we didn\'t expect!' },
    { name: 'Meera K.', city: 'Chennai', rating: 5, text: 'The Thinnakara lagoon at sunset is pure magic — you can wade across at low tide. The beach cottage had stunning ocean views. Perfect honeymoon package!' },
    { name: 'Amit G.', city: 'Kolkata', rating: 4, text: 'Thinnakara was unexpectedly beautiful. Stargazing on the sandbank and morning reef snorkelling were deeply peaceful experiences.' },
  ],
  4: [
    { name: 'Neha B.', city: 'Delhi', rating: 5, text: 'The scuba sessions at Kadmat were phenomenal — reef sharks, turtles and parrotfish on every dive. The instructors were patient with first-timers.' },
    { name: 'Karan V.', city: 'Mumbai', rating: 4, text: 'Wind-surfing and para-sailing over the lagoon were a rush. The Water Sports Institute is well run and the cottage stay was comfortable.' },
    { name: 'Sanjay M.', city: 'Pune', rating: 5, text: 'Did my first PADI dive here and finished with a night snorkel over glowing plankton — a bucket-list adventure I\'ll never forget.' },
  ],
}

const INCLUDE_INFO = {
  'Cruise Cabin': {
    icon: '🚢', title: 'Getting There',
    items: [
      { label: '✈️ By Air', detail: 'Fly Kochi (COK) → Agatti (AGX) · ~1.5h · Onward inter-island transfers by boat or helicopter' },
      { label: '🚢 By Sea', detail: 'SPORTS cruise ships & passenger vessels sail from Kochi (Cochin) port to the islands · 14–20h' },
      { label: '⛴ Inter-island', detail: 'Speed boats and ferries connect Agatti, Kavaratti, Kadmat, Kalpeni & Minicoy — arranged by SPORTS' },
      { label: '🛏 Cruise Cabin', detail: 'Comfortable air-conditioned cabin aboard the Samudram cruise · All lagoon excursions run from the ship' },
    ],
  },
  Meals: {
    icon: '🍽', title: 'Cuisine Highlights',
    items: [
      { label: '🐟 Tuna Specialities', detail: 'Fresh tuna curries and grills — the signature catch of Minicoy and the islands. Included at select meals.' },
      { label: '🍢 Masmin (Mas Podi)', detail: 'Traditional smoked & dried tuna, a Lakshadweep staple — served with rice and coconut chutney.' },
      { label: '🐙 Octopus Fry', detail: 'Freshly caught octopus tossed with coconut, curry leaves and island spices — a local delicacy.' },
      { label: '🥥 Coconut Curry & Appam', detail: 'Soft kilanji/appam with mild coconut-based curries and fresh reef fish. Tender coconut water served daily.' },
    ],
  },
  'All Meals': {
    icon: '🍽', title: 'Cuisine Highlights',
    items: [
      { label: '🐟 Tuna Specialities', detail: 'Fresh tuna curries and grills — the signature catch of Minicoy and the islands. Included at every dinner.' },
      { label: '🍢 Masmin (Mas Podi)', detail: 'Traditional smoked & dried tuna, a Lakshadweep staple — served with rice and coconut chutney.' },
      { label: '🐙 Octopus Fry', detail: 'Freshly caught octopus tossed with coconut, curry leaves and island spices — a local delicacy.' },
      { label: '🥥 Coconut Curry & Appam', detail: 'Soft kilanji/appam with mild coconut-based curries and fresh reef fish. Tender coconut water served daily.' },
    ],
  },
  Breakfast: {
    icon: '☕', title: 'Daily Breakfast',
    items: [
      { label: '🥐 Continental', detail: 'Eggs, toast, fresh fruit, juice, tea/coffee — served lagoon-side at the cottage restaurant daily' },
      { label: '🍛 Island Option', detail: 'Appam, puttu, kadala curry and fresh banana — authentic Malayali morning fare available on request' },
      { label: '🥥 Tender Coconut', detail: 'Chilled tender coconut water and fresh reef-fish cutlets — the island breakfast ritual, served 7–9 AM' },
    ],
  },
  'Permit Assist': {
    icon: '🪪', title: 'Entry Permit Assistance',
    items: [
      { label: '🪪 Entry Permit', detail: 'All non-islander tourists need a valid Entry Permit — SPORTS assists your application on epermit.utl.gov.in' },
      { label: '🗓 Apply Early', detail: 'Submit at least 15 days before travel with a valid ID proof · Permit is tied to your islands & dates' },
      { label: '🌊 Marine Aquarium, Kavaratti', detail: 'Small permit/entry fee at the aquarium — reef fish, corals & marine displays. Covered in package.' },
      { label: '🌍 Foreign Nationals', detail: 'Additional clearance required · foreigners are primarily permitted for Bangaram (sometimes Agatti)' },
    ],
  },
  'Lagoon Excursions': {
    icon: '🏝️', title: 'Lagoon Excursions',
    items: [
      { label: '🌊 Marine Aquarium, Kavaratti', detail: 'Reef fish, live corals and marine displays beside the capital\'s calm lagoon — a family favourite.' },
      { label: '🗼 Minicoy Lighthouse', detail: 'Climb the 19th-century lighthouse for sweeping views over one of India\'s largest lagoons.' },
      { label: '🐠 Coral Dive Sites', detail: 'Guided reef excursions over coral gardens teeming with parrotfish, rays and turtles (permit, not tickets).' },
      { label: '🛶 Kalpeni Islets', detail: 'Koomel beach, reef walks and canoeing across a serene three-islet lagoon on the cruise itinerary.' },
    ],
  },
  'Beach Cottage': {
    icon: '🏖️', title: 'Stay Details',
    items: [
      { label: '🏖 SPORTS Beach Cottage', detail: 'Sea-facing SPORTS cottages steps from the lagoon · fan/AC, attached bath, breezy verandah' },
      { label: '🐚 Bangaram Cottages', detail: 'Palm-shaded beach cottages on the uninhabited atoll · powder-white sand & reef right offshore' },
      { label: '⛺ Thinnakara Tents', detail: 'Beach tents on a tiny sandbank beside Bangaram · vast shallow lagoon, superb sunsets & stargazing' },
      { label: '🛖 Kadmat Huts', detail: 'Cosy island huts near the Water Sports Institute · lagoons on both sides of the island' },
    ],
  },
  'Cottage Stay': {
    icon: '🛖', title: 'Stay Details',
    items: [
      { label: '🛖 Kadmat Huts', detail: 'Cosy island huts near the Water Sports Institute · lagoons on both sides of the island' },
      { label: '🏖 SPORTS Beach Cottage', detail: 'Sea-facing SPORTS cottages steps from the lagoon · fan/AC, attached bath, breezy verandah' },
      { label: '📸 Photo Ops', detail: 'Turquoise water, coconut palms and white sand — every corner is a postcard waiting to happen' },
    ],
  },
  Snorkelling: {
    icon: '🤿', title: 'Snorkelling & Reef',
    items: [
      { label: '🤿 House Reef', detail: 'Snorkel straight off the beach over live coral, clownfish and reef sharks in crystal-clear lagoon water' },
      { label: '🐢 Marine Life', detail: 'Spot parrotfish, rays, sea turtles and shoals of fusiliers on the shallow coral gardens' },
      { label: '⛵ Glass-bottom Boat', detail: 'Prefer to stay dry? Glass-bottom boat rides reveal the reef without getting in the water' },
      { label: '💡 Reef Safety', detail: 'Wear reef shoes, never touch or stand on coral — the reef is a protected, living ecosystem' },
    ],
  },
  'Glass-bottom Boat': {
    icon: '⛵', title: 'Glass-bottom Boat',
    items: [
      { label: '⛵ Duration', detail: '45-min guided ride over the lagoon reef · morning & late-afternoon slots available' },
      { label: '🐠 What You\'ll See', detail: 'Live coral, clownfish, parrotfish and the occasional turtle — all through the glass floor, no swimming needed' },
      { label: '👨‍👩‍👧 Family Friendly', detail: 'Perfect for children and non-swimmers · calm, shallow lagoon water throughout' },
      { label: '🎫 Included', detail: 'Ride fully included in package · Private boat charter available on request' },
    ],
  },
  'Dolphin Trip': {
    icon: '🐬', title: 'Dolphin Trip',
    items: [
      { label: '🐬 Spinner Dolphins', detail: 'Boat trip off Bangaram to spot pods of spinner dolphins leaping in the open water at sunrise' },
      { label: '⏰ Best Time', detail: 'Early morning excursions offer the calmest seas and the best sightings' },
      { label: '🐢 Bonus Wildlife', detail: 'Flying fish, sea turtles and reef sharks are often seen on the same trip' },
      { label: '💡 Tips', detail: 'Carry sunscreen, water and a hat · sightings are wild and not guaranteed, but very common Oct–May' },
    ],
  },
  'Kayak & Snorkel': {
    icon: '🛶', title: 'Kayak & Snorkel',
    items: [
      { label: '🛶 Lagoon Kayaking', detail: 'Paddle across the still, shallow Bangaram–Thinnakara lagoon — you can even wade parts at low tide' },
      { label: '🤿 Reef Snorkel', detail: 'Anchor over the coral garden and snorkel among clownfish, corals and reef fish' },
      { label: '🌅 Sunset Lagoon', detail: 'Golden-hour paddle followed by stargazing on the Thinnakara sandbank — away from all crowds' },
      { label: '💡 Reef Safety', detail: 'Wear reef shoes and a rash guard, never touch coral · life jackets provided' },
    ],
  },
  'Scuba Sessions': {
    icon: '🤿', title: 'Scuba Diving',
    items: [
      { label: '🤿 Discover Scuba', detail: 'No experience needed — certified instructors take first-timers on a guided shallow reef dive' },
      { label: '🎓 PADI Courses', detail: 'The Kadmat Water Sports Institute runs full PADI certification courses over multiple days' },
      { label: '🐠 Dive Sites', detail: 'Coral walls and gardens with reef sharks, turtles, manta rays and vibrant fish life' },
      { label: '💡 Safety', detail: 'All dives are supervised · medical self-declaration required · never dive within 24h of flying' },
    ],
  },
  'Water Sports Institute': {
    icon: '🏄', title: 'Water Sports',
    items: [
      { label: '🏄 Wind-surfing', detail: 'The Kadmat institute offers wind-surfing across a flat, protected lagoon — great for beginners' },
      { label: '🪂 Para-sailing', detail: 'Soar above the turquoise lagoon on a tow-boat para-sail for aerial views of the reef' },
      { label: '🛶 Kayaking & Canoeing', detail: 'Explore the calm lagoons on both sides of the island by kayak, canoe or pedal boat' },
      { label: '🌙 Night Snorkel', detail: 'Guided night snorkel over the reef to see nocturnal marine life and glowing plankton' },
    ],
  },
}

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const pkg = packages.find(p => p.id === parseInt(id)) || packages[0]
  const [activeInclude, setActiveInclude] = useState(null)
  const [showReviews, setShowReviews] = useState(false)

  const reviews = TESTIMONIALS[pkg.id] || []

  const getIncludeIcon = (inc) => {
    if (inc.includes('Cabin')) return '🚢'
    if (inc.includes('Cottage') || inc.includes('Stay') || inc.includes('Hut')) return '🏖️'
    if (inc.includes('Meal') || inc.includes('Breakfast')) return '🍽'
    if (inc.includes('Permit')) return '🪪'
    if (inc.includes('Lagoon')) return '🏝️'
    if (inc.includes('Dolphin')) return '🐬'
    if (inc.includes('Scuba') || inc.includes('Dive')) return '🤿'
    if (inc.includes('Snorkel') || inc.includes('Kayak')) return '🤿'
    if (inc.includes('Water Sports') || inc.includes('Watersports')) return '🏄'
    if (inc.includes('Boat')) return '⛵'
    return '✓'
  }

  return (
    <div className="app-shell">
      {/* Hero image */}
      <div style={{ height: 200, position: 'relative', flexShrink: 0, overflow: 'hidden', background: 'var(--grad-hero)' }}>
        <img
          src={pkg.imgUrl}
          alt={pkg.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.45) 0%,transparent 40%,rgba(0,0,0,0.72))', zIndex: 2 }} />
        <div style={{ position: 'absolute', top: 14, left: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, zIndex: 3, cursor: 'pointer' }} onClick={() => navigate(-1)}>←</div>
        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14, color: '#fff', zIndex: 3 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
            <span className="chip chip-accent">{pkg.badge}</span>
            <span style={{ background: 'rgba(0,0,0,0.55)', borderRadius: 8, padding: '3px 8px', fontSize: 9.5, fontWeight: 700, color: '#fff' }}>🔥 {pkg.booked.toLocaleString()} booked</span>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{pkg.name}</div>
          <div style={{ fontSize: 11, opacity: 0.95 }}>{pkg.cities}</div>
        </div>
      </div>

      <div className="screen-scroll">
        <div className="content">
          {/* Price & rating */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{pkg.days} Days · {pkg.nights} Nights · From</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-dark)' }}>₹{pkg.price.toLocaleString()}<span style={{ fontSize: 12, color: 'var(--ink-mute)', fontWeight: 600 }}>/person</span></div>
            </div>
            <div
              style={{ textAlign: 'right', cursor: 'pointer' }}
              onClick={() => setShowReviews(v => !v)}
            >
              <div style={{ fontSize: 15, color: 'var(--accent-dark)', fontWeight: 700 }}>⭐ {pkg.rating}</div>
              <div style={{ fontSize: 10.5, color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>
                {pkg.reviews} reviews {showReviews ? '▲' : '▼'}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          {showReviews && reviews.length > 0 && (
            <div style={{ background: 'var(--soft)', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>💬 Traveller Reviews</div>
              {reviews.map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '10px 12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>{r.name}</span>
                      <span style={{ fontSize: 10, color: 'var(--ink-mute)', marginLeft: 6 }}>📍 {r.city}</span>
                    </div>
                    <span style={{ fontSize: 11, color: '#F59E0B', fontWeight: 700 }}>{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-soft)', lineHeight: 1.55, fontStyle: 'italic' }}>"{r.text}"</div>
                </div>
              ))}
            </div>
          )}

          {/* Includes — tappable */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-mute)', marginBottom: 6 }}>Tap to explore what's included:</div>
            <div className="grid-4">
              {pkg.includes.map(inc => {
                const isActive = activeInclude === inc
                return (
                  <div
                    key={inc}
                    onClick={() => setActiveInclude(isActive ? null : inc)}
                    style={{
                      padding: '8px 4px', background: isActive ? 'var(--primary-ghost)' : 'var(--soft)',
                      border: `${isActive ? 2 : 1}px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 8, textAlign: 'center', cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontSize: 16 }}>{getIncludeIcon(inc)}</div>
                    <div style={{ fontSize: 9.5, fontWeight: 700, marginTop: 2, color: isActive ? 'var(--primary-dark)' : 'var(--ink)' }}>{inc}</div>
                  </div>
                )
              })}
            </div>

            {/* Include detail panel */}
            {activeInclude && INCLUDE_INFO[activeInclude] && (
              <div style={{ background: 'var(--soft)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px', marginTop: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', marginBottom: 10 }}>
                  {INCLUDE_INFO[activeInclude].icon} {INCLUDE_INFO[activeInclude].title}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {INCLUDE_INFO[activeInclude].items.map((item, i) => (
                    <div key={i} style={{ background: '#fff', borderRadius: 8, padding: '8px 10px', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Itinerary */}
          <div>
            <div className="bold" style={{ fontSize: 13, marginBottom: 8 }}>Itinerary</div>
            <div className="timeline">
              {pkg.itinerary.map((item, i) => (
                <div key={i} className={`tl-item ${i < pkg.itinerary.length - 1 ? 'done' : 'active'}`}>
                  <div className="tl-dot" />
                  <div className="tl-title">{item.day} — {item.title}</div>
                  <div className="tl-time">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI tip */}
          <div className="ai-box">
            <div className="bold" style={{ fontSize: 12, color: 'var(--ink)', marginBottom: 3 }}>💡 Best time to book</div>
            <div className="text-xs" style={{ color: 'var(--ink-soft)', lineHeight: 1.55 }}>Book at least 30 days in advance and apply for your Entry Permit early. Peak season (Oct–May) fills up fast — especially cruise cabins and Bangaram beach cottages. Avoid the SW monsoon (Jun–Sep) when seas are rough.</div>
          </div>

          <button className="btn-pri" onClick={() => navigate('/payment')}>Book This Package →</button>
          <div style={{ height: 8 }} />
        </div>
      </div>
    </div>
  )
}
