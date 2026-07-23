const OFFICIAL_BASE = 'https://samudram.utl.gov.in'

// Official URLs from the Lakshadweep Tourism (SPORTS) portal — samudram.utl.gov.in
// Attraction ids mirror src/context/AppContext.jsx (Agatti, Bangaram, Kavaratti,
// Minicoy, Kadmat, Kalpeni, Thinnakara, Coral Reef Dive Sites).
const OFFICIAL_ATTRACTIONS = {
  1: { slug: 'agatti',        url: '/sprt_Destinations.aspx?island=agatti' },
  2: { slug: 'bangaram',      url: '/sprt_Destinations.aspx?island=bangaram' },
  3: { slug: 'kavaratti',     url: '/sprt_Destinations.aspx?island=kavaratti' },
  4: { slug: 'minicoy',       url: '/sprt_Destinations.aspx?island=minicoy' },
  5: { slug: 'kadmat',        url: '/sprt_Destinations.aspx?island=kadmat' },
  6: { slug: 'kalpeni',       url: '/sprt_Destinations.aspx?island=kalpeni' },
  7: { slug: 'thinnakara',    url: '/sprt_Destinations.aspx?island=thinnakara' },
  8: { slug: 'coral-reef-dive-sites', url: '/sprt_Packages.aspx' },
}

const OFFICIAL_CITIES = {
  agatti:    '/sprt_Destinations.aspx?island=agatti',
  bangaram:  '/sprt_Destinations.aspx?island=bangaram',
  kavaratti: '/sprt_Destinations.aspx?island=kavaratti',
  minicoy:   '/sprt_Destinations.aspx?island=minicoy',
  kadmat:    '/sprt_Destinations.aspx?island=kadmat',
  kalpeni:   '/sprt_Destinations.aspx?island=kalpeni',
  thinnakara:'/sprt_Destinations.aspx?island=thinnakara',
}

const OFFICIAL_CATEGORIES = {
  islands:     '/sprt_Destinations.aspx',
  watersports: '/sprt_Packages.aspx?category=watersports',
  lagoons:     '/sprt_Destinations.aspx?category=lagoons',
  beaches:     '/sprt_Destinations.aspx?category=beaches',
  diving:      '/sprt_Packages.aspx?category=diving',
  coral:       '/sprt_Destinations.aspx?category=coral',
  cruises:     '/sprt_Packages.aspx?category=cruises',
  packages:    '/sprt_Packages.aspx',
}

// Simple in-memory cache (survives warm serverless invocations)
let pingCache = null
let pingCacheTs = 0
const PING_TTL = 5 * 60 * 1000 // 5 minutes

async function checkOfficialPortalLive() {
  if (pingCache !== null && Date.now() - pingCacheTs < PING_TTL) {
    return pingCache
  }
  try {
    const ctrl = new AbortController()
    const timeout = setTimeout(() => ctrl.abort(), 5000)
    const res = await fetch(OFFICIAL_BASE, {
      method: 'HEAD',
      signal: ctrl.signal,
      headers: { 'User-Agent': 'Lakshadweep Tourism App / Data Sync' },
    })
    clearTimeout(timeout)
    pingCache = res.ok
  } catch {
    pingCache = false
  }
  pingCacheTs = Date.now()
  return pingCache
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const isLive = await checkOfficialPortalLive()

  const attractions = Object.entries(OFFICIAL_ATTRACTIONS).map(([id, info]) => ({
    id: parseInt(id),
    officialUrl: OFFICIAL_BASE + info.url,
    slug: info.slug,
  }))

  const cities = Object.entries(OFFICIAL_CITIES).map(([key, path]) => ({
    city: key,
    officialUrl: OFFICIAL_BASE + path,
  }))

  const categories = Object.entries(OFFICIAL_CATEGORIES).map(([key, path]) => ({
    category: key,
    officialUrl: OFFICIAL_BASE + path,
  }))

  return res.json({
    official: true,
    portalUrl: OFFICIAL_BASE,
    portalName: 'Lakshadweep Tourism — SPORTS, UT of Lakshadweep',
    liveStatus: isLive ? 'online' : 'unreachable',
    checkedAt: new Date().toISOString(),
    attractions,
    cities,
    categories,
    notice: 'Data displayed in this app is sourced from and verified against the Official Lakshadweep Tourism portal operated by SPORTS, Department of Tourism, Union Territory of Lakshadweep.',
  })
}
