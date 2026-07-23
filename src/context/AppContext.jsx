import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

// Representative imagery for Lakshadweep islands & lagoons (public sources)
const imgs = {
  agatti:    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Agatti_Island%2C_Lakshadweep.jpg/1200px-Agatti_Island%2C_Lakshadweep.jpg',
  bangaram:  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=82',
  kavaratti: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82',
  minicoy:   'https://images.unsplash.com/photo-1590523278191-995cbcda646b?auto=format&fit=crop&w=1200&q=82',
  kadmat:    'https://images.unsplash.com/photo-1502209524164-acea936639a2?auto=format&fit=crop&w=1200&q=82',
  kalpeni:   'https://images.unsplash.com/photo-1518606371321-e3b1f46b5d5b?auto=format&fit=crop&w=1200&q=82',
  scuba:     'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=82',
  lagoon:    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=82',
}

// 6 tourist-permitted islands + signature marine experiences.
// All island visits require a valid Entry Permit (epermit.utl.gov.in).
export const destinations = [
  { id: 1, name: 'Agatti Island', city: 'Agatti', rating: 4.8, reviews: 9240, category: 'Islands', price: 'Permit reqd', fee: 0, img: '🏝️', imgUrl: imgs.agatti, desc: 'The gateway to Lakshadweep and home to the islands’ only airport. A dazzling 7 km sliver ringed by a shallow turquoise lagoon, ideal for snorkelling, glass-bottom boat rides and first-timer scuba.', badge: '✈️ Gateway Island', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 2, name: 'Bangaram Atoll', city: 'Bangaram', rating: 4.9, reviews: 6120, category: 'Islands', price: '₹Resort', fee: 0, img: '🐚', imgUrl: imgs.bangaram, desc: 'A teardrop-shaped uninhabited atoll of powder-white sand and coconut palms — the one island fully open to foreign nationals. Famous for pristine reefs, dolphins and unspoilt beach cottages.', badge: '🌊 Foreigner-friendly', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 3, name: 'Kavaratti', city: 'Kavaratti', rating: 4.7, reviews: 8010, category: 'Islands', price: 'Permit reqd', fee: 0, img: '🕌', imgUrl: imgs.kavaratti, desc: 'The capital of Lakshadweep, set on a calm lagoon. Visit the Marine Aquarium, the ornately carved Ujra Mosque, and enjoy kayaking, snorkelling and glass-bottom boats in still, glassy water.', badge: '⭐ Capital', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 4, name: 'Minicoy (Maliku)', city: 'Minicoy', rating: 4.8, reviews: 4360, category: 'Islands', price: 'Permit reqd', fee: 0, img: '🗼', imgUrl: imgs.minicoy, desc: 'The southernmost, crescent-shaped island with a distinct Mahl (Dhivehi) culture. Climb the 19th-century lighthouse, watch the traditional Lava dance, and explore one of India’s largest lagoons.', badge: '🚨 Lighthouse Isle', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 5, name: 'Kadmat Island', city: 'Kadmat', rating: 4.8, reviews: 5580, category: 'Water Sports', price: '₹1,500+', fee: 1500, img: '🤿', imgUrl: imgs.kadmat, desc: 'Home to a full-fledged Water Sports Institute. A long, narrow island with lagoons on both sides — the premier base for scuba diving, wind-surfing, para-sailing and PADI courses.', badge: '🤿 Dive Hub', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 6, name: 'Kalpeni', city: 'Kalpeni', rating: 4.6, reviews: 3720, category: 'Lagoons', price: 'Permit reqd', fee: 0, img: '🛶', imgUrl: imgs.kalpeni, desc: 'A serene lagoon fringed by three islets and a storm-bank of coral debris. Koomel beach offers calm waters for canoeing, reef walks and pedal boats — a favourite day-visit on cruise itineraries.', badge: '🛶 Calm Lagoon', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 7, name: 'Thinnakara Lagoon', city: 'Bangaram', rating: 4.7, reviews: 2890, category: 'Lagoons', price: '₹Tents', fee: 0, img: '⛺', imgUrl: imgs.lagoon, desc: 'A tiny sandbank island beside Bangaram with beach tents and a vast shallow lagoon you can wade across at low tide. Superb sunsets, kayaking and stargazing away from the crowds.', badge: '⛺ Beach Camp', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
  { id: 8, name: 'Coral Reef Dive Sites', city: 'Agatti · Kadmat', rating: 4.9, reviews: 7150, category: 'Marine Life', price: '₹3,500 dive', fee: 3500, img: '🐠', imgUrl: imgs.scuba, desc: 'Lakshadweep’s coral gardens teem with parrotfish, manta rays, reef sharks and sea turtles. Certified dives and discover-scuba sessions run daily from Agatti, Kadmat and Bangaram.', badge: '🐠 Coral Gardens', bestTime: 'Oct–May', officialUrl: 'https://samudram.utl.gov.in/' },
]

export const packages = [
  {
    id: 1, name: 'Samudram Coral Cruise', cities: 'Kavaratti · Kalpeni · Minicoy',
    days: 5, nights: 4, price: 41500, rating: 5.0, reviews: 316, booked: 742,
    img: '🚢',
    imgUrl: imgs.minicoy,
    badge: '👑 Flagship Cruise',
    bookingUrl: 'https://samudram.utl.gov.in/sprt_Packages.aspx',
    includes: ['Cruise Cabin', 'All Meals', 'Lagoon Excursions', 'Permit Assist'],
    itinerary: [
      { day: 'Day 1', title: 'Embark at Kochi', desc: 'Board cruise · Sail overnight to the islands' },
      { day: 'Day 2', title: 'Kavaratti', desc: 'Marine Aquarium · Ujra Mosque · Lagoon watersports' },
      { day: 'Day 3', title: 'Kalpeni', desc: 'Koomel beach · Reef walk · Canoeing & snorkelling' },
      { day: 'Day 4', title: 'Minicoy', desc: 'Lighthouse climb · Lava dance · Tuna canning tour' },
      { day: 'Day 5', title: 'Return to Kochi', desc: 'Sunrise at sea · Disembark' },
    ]
  },
  {
    id: 2, name: 'Agatti Lagoon Escape', cities: 'Agatti',
    days: 4, nights: 3, price: 27999, rating: 4.8, reviews: 512, booked: 968,
    img: '🏝️', imgUrl: imgs.agatti, badge: '⭐ Bestseller',
    includes: ['Beach Cottage', 'Snorkelling', 'Glass-bottom Boat', 'Breakfast'],
    itinerary: [
      { day: 'Day 1', title: 'Fly to Agatti', desc: 'Flight from Kochi · Lagoon-side check-in · Sunset beach' },
      { day: 'Day 2', title: 'Reef Day', desc: 'Snorkelling · Glass-bottom boat · Discover scuba' },
      { day: 'Day 3', title: 'Island Life', desc: 'Kayaking · Village walk · Coral point picnic' },
      { day: 'Day 4', title: 'Departure', desc: 'Morning swim · Flight back to Kochi' },
    ]
  },
  {
    id: 3, name: 'Bangaram Island Retreat', cities: 'Bangaram · Thinnakara',
    days: 5, nights: 4, price: 52999, rating: 4.9, reviews: 288, booked: 421,
    img: '🐚', imgUrl: imgs.bangaram, badge: '💑 Romantic',
    includes: ['Beach Cottage', 'All Meals', 'Dolphin Trip', 'Kayak & Snorkel'],
    itinerary: [
      { day: 'Day 1-2', title: 'Bangaram', desc: 'Beach cottages · Reef snorkelling · Dolphin spotting' },
      { day: 'Day 3', title: 'Thinnakara', desc: 'Wade-across lagoon · Beach tents · Sunset & stargazing' },
      { day: 'Day 4-5', title: 'Bangaram', desc: 'Scuba dive · Island picnic · Return via Agatti' },
    ]
  },
  {
    id: 4, name: 'Kadmat Dive & Watersports', cities: 'Kadmat',
    days: 4, nights: 3, price: 31500, rating: 4.8, reviews: 447, booked: 683,
    img: '🤿', imgUrl: imgs.scuba, badge: '🤿 Adventure',
    includes: ['Water Sports Institute', 'Scuba Sessions', 'Cottage Stay', 'Meals'],
    itinerary: [
      { day: 'Day 1', title: 'Arrive Kadmat', desc: 'Transfer from Agatti · Lagoon orientation' },
      { day: 'Day 2', title: 'Dive Day', desc: 'Discover scuba · Reef dive · Wind-surfing' },
      { day: 'Day 3', title: 'Watersports', desc: 'Para-sailing · Kayaking · Night snorkel' },
      { day: 'Day 4', title: 'Departure', desc: 'Final dive · Return transfer' },
    ]
  },
]

export const grievances = [
  { id: 'GRV-2026-04812', title: 'Overcharging on scuba package', location: 'Agatti', status: 'in_progress', priority: 'high', category: 'Overcharging', date: 'Apr 22', icon: '💰', color: '#FFE7DF', days: 1, officer: 'Ayesha Koya', comments: [{ who: 'You', msg: 'Dive operator at Agatti quoted ₹3,500 per dive but charged ₹6,000 each with no PADI receipt.', time: 'Apr 22, 2:14 PM' }, { who: 'Officer Ayesha Koya', msg: 'Contacted the SPORTS-registered operator. Awaiting receipts by EOD.', time: 'Apr 23, 11 AM' }] },
  { id: 'GRV-2026-04657', title: 'Jetty pontoon damaged — Kavaratti', location: 'Kavaratti', status: 'resolved', priority: 'medium', category: 'Infrastructure', date: 'Apr 15', icon: '🚧', color: '#D1FAE5', rating: 4, officer: 'Mohammed Sherif' },
  { id: 'GRV-2026-04598', title: 'Misleading beach-cottage listing', location: 'Bangaram', status: 'open', priority: 'medium', category: 'BSP / Operator', date: 'Apr 10', icon: '🏨', color: '#D6F3F5', officer: null },
]

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('teal')
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cart, setCart] = useState(null)
  const [toast, setToast] = useState(null)
  const [appLanguage, setAppLanguage] = useState('English')

  const login = (userData) => {
    const u = userData || { name: 'Arjun Nair', initials: 'AN', mobile: '+91 98470•••231', tier: 'Gold', trips: 3, points: 2640 }
    setUser(u)
    setIsLoggedIn(true)
    if (u.language) setAppLanguage(u.language)
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <AppContext.Provider value={{ theme, setTheme, user, isLoggedIn, login, logout, cart, setCart, toast, showToast, destinations, packages, grievances, appLanguage, setAppLanguage }}>
      <div data-theme={theme}>
        {children}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
