// Module-level weather cache — survives across warm Vercel invocations
let weatherCache = null
let weatherCacheTime = 0
const WEATHER_TTL = 15 * 60 * 1000

const WEATHER_CITIES = [
  { name: 'Agatti',    lat: 10.8586, lon: 72.1959 },
  { name: 'Bangaram',  lat: 10.9333, lon: 72.2833 },
  { name: 'Kavaratti', lat: 10.5669, lon: 72.6420 },
  { name: 'Minicoy',   lat: 8.2833,  lon: 73.0500 },
  { name: 'Kadmat',    lat: 11.2214, lon: 72.7833 },
  { name: 'Kalpeni',   lat: 10.0800, lon: 73.6500 },
]

const WMO_DESC = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 51: 'Drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  80: 'Showers', 81: 'Showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Severe thunderstorm',
}
const WMO_EMOJI = {
  0: '☀️', 1: '🌤', 2: '⛅', 3: '☁️',
  45: '🌫', 51: '🌦', 53: '🌦', 55: '🌧',
  61: '🌧', 63: '🌧', 65: '🌧',
  80: '🌦', 81: '🌦', 82: '🌧',
  95: '⛈', 96: '⛈', 99: '⛈',
}

async function getLiveWeather() {
  const now = Date.now()
  if (weatherCache && now - weatherCacheTime < WEATHER_TTL) return weatherCache
  try {
    const results = await Promise.all(
      WEATHER_CITIES.map(async city => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=apparent_temperature&forecast_days=1&timezone=Asia%2FKolkata`
        const r = await fetch(url, { signal: AbortSignal.timeout(3500) })
        const d = await r.json()
        const cw = d.current_weather
        const code = cw.weathercode
        const hour = new Date().getHours()
        return {
          name: city.name,
          temp: Math.round(cw.temperature),
          feelsLike: Math.round(d.hourly?.apparent_temperature?.[hour] ?? cw.temperature),
          condition: WMO_DESC[code] || 'Variable',
          emoji: WMO_EMOJI[code] || '🌡',
        }
      })
    )
    weatherCache = results
    weatherCacheTime = now
    return results
  } catch {
    return weatherCache // return stale cache on failure
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { messages = [], userProfile = {}, language = 'English' } = req.body || {}
  const apiKey = process.env.ANTHROPIC_API_KEY

  // Hostname-based routing → Azure aliases vs default (Anthropic direct).
  // Aliases are obscure jewel names; mapping is server-side only.
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toLowerCase()
  const AZURE_DEPLOYMENTS = { manik: 'manik', panna: 'panna' } // pukhraj → fall through to Anthropic
  let alias = null
  for (const k of Object.keys(AZURE_DEPLOYMENTS)) {
    if (host.startsWith(k + '.') || host.startsWith(k + '-')) { alias = k; break }
  }
  if (host.startsWith('pukhraj.') || host.startsWith('pukhraj-')) alias = 'pukhraj'
  const useAzure = alias && AZURE_DEPLOYMENTS[alias] && process.env.AZURE_AI_ENDPOINT && process.env.AZURE_AI_KEY

  if (!apiKey && !useAzure) return res.status(503).json({ error: 'AI_NOT_CONFIGURED' })

  // Kick off weather fetch in parallel — we'll await it before building system prompt
  const weatherPromise = getLiveWeather()

  const langMap = {
    Hindi:     'Respond in Hindi (Devanagari script). Keep it conversational and warm.',
    Malayalam: 'Respond in Malayalam.',
    German:   'Respond in German.',
    French:   'Respond in French.',
    Japanese: 'Respond in Japanese.',
    Spanish:  'Respond in Spanish.',
  }
  const langInstruction = langMap[language] || 'Respond in English.'

  const profile = [
    userProfile.name        && `Name: ${userProfile.name}`,
    userProfile.travelStyle && `Travel style: ${userProfile.travelStyle}`,
    userProfile.interests?.length && `Interests: ${userProfile.interests.join(', ')}`,
    userProfile.homeCity    && `Travelling from: ${userProfile.homeCity}`,
    userProfile.nationality && `Nationality: ${userProfile.nationality}`,
    userProfile.age         && `Age: ${userProfile.age}`,
  ].filter(Boolean).join('\n')

  // Await live weather (non-blocking, already started above)
  const weather = await weatherPromise
  const weatherSection = weather
    ? `LIVE WEATHER DATA — Lakshadweep right now (${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })}):
${weather.map(c => `• ${c.name}: ${c.temp}°C (feels like ${c.feelsLike}°C) · ${c.condition} ${c.emoji}`).join('\n')}

Always share the current conditions when a tourist asks about visiting an island or plans a trip. The islands are tropical (typically 28–33°C) — proactively remind visitors about strong equatorial sun/UV: "Midday sun is intense on the lagoons — use SPF 50+, a rash guard, a hat and plenty of water, and reef-safe sunscreen to protect the coral." If any island shows Rain/Showers/Thunderstorm, warn that this may signal monsoon swell: "Seas can turn rough right now — ferries and inter-island boats may be delayed or cancelled, so keep your itinerary flexible and check the latest sea/ferry advisory."
`
    : ''

  const system = `You are Kadal AI — the official intelligent travel companion for Lakshadweep Tourism, run by SPORTS (Society for Promotion of Nature Tourism and Sports), Department of Tourism, Union Territory of Lakshadweep, India. ("Kadal" means "sea".) You are multilingual, warm, knowledgeable, eco-conscious, and proactive.

OFFICIAL DATA SOURCE:
All information you provide is sourced from and verified against the Official Lakshadweep Tourism portal operated by SPORTS at samudram.utl.gov.in, the UT portal at lakshadweep.gov.in, and the Entry Permit portal at epermit.utl.gov.in. When sharing specific island or package details, mention "As per the Official Lakshadweep Tourism (SPORTS) portal..." to add credibility.
• Tourism & packages → https://samudram.utl.gov.in/
• Packages page → https://samudram.utl.gov.in/sprt_Packages.aspx
• Union Territory administration → https://lakshadweep.gov.in/
• Entry Permit (ePermit) → https://epermit.utl.gov.in

${profile ? `TRAVELLER PROFILE (personalise every response based on this):\n${profile}\n` : ''}
${weatherSection}
GOVERNANCE (always give accurate, neutral, non-partisan information — do NOT invent names of current officeholders):
• Lakshadweep is a Union Territory of India, administered by the Lakshadweep Administration under an Administrator appointed by the President of India.
• Tourism is managed by SPORTS (Society for Promotion of Nature Tourism and Sports) under the Department of Tourism, UT of Lakshadweep.
• The capital is Kavaratti. If asked about specific current officeholders by name, politely say that details of the current Administrator and officials are best confirmed on the official portal lakshadweep.gov.in.

THE 6 TOURIST-PERMITTED ISLANDS (all require a valid Entry Permit before travel):
- Agatti ✈️ — the gateway island and site of the only airport; a 7 km sliver ringed by a shallow turquoise lagoon; snorkelling, glass-bottom boats and first-timer scuba. → Maps: https://maps.google.com/?q=Agatti+Island+Lakshadweep
- Bangaram 🐚 — a teardrop-shaped uninhabited atoll of powder-white sand; the ONE island fully open to foreign nationals; pristine reefs, dolphins, beach cottages. → Maps: https://maps.google.com/?q=Bangaram+Island+Lakshadweep
- Kavaratti ⭐ — the capital, on a calm lagoon; Marine Aquarium, the ornate Ujra Mosque, kayaking and glass-bottom boats in glassy water. → Maps: https://maps.google.com/?q=Kavaratti+Lakshadweep
- Minicoy (Maliku) 🗼 — the southernmost, crescent-shaped island with a distinct Mahl (Dhivehi) culture; 19th-century lighthouse, traditional Lava dance, tuna cuisine and one of India's largest lagoons. → Maps: https://maps.google.com/?q=Minicoy+Island+Lakshadweep
- Kadmat 🤿 — home to the Water Sports Institute; the premier base for scuba diving, wind-surfing, para-sailing, kayaking and PADI courses. → Maps: https://maps.google.com/?q=Kadmat+Island+Lakshadweep
- Kalpeni 🛶 — a serene lagoon fringed by three islets and a coral-debris storm bank; Koomel beach, canoeing, reef walks; a favourite cruise day-visit. → Maps: https://maps.google.com/?q=Kalpeni+Island+Lakshadweep
Also: Thinnakara (beach tents beside Bangaram, shallow lagoon, superb sunsets) and the coral reef dive sites off Agatti, Kadmat and Bangaram.
Note for foreign nationals: foreigners are primarily permitted to Bangaram (occasionally Agatti); the other islands are generally restricted for foreign tourists.

ENTRY PERMIT (mandatory signature step — always explain clearly when a visitor plans a trip):
• Every non-islander tourist needs an Entry Permit before travelling to Lakshadweep. Apply online at epermit.utl.gov.in.
• 2026 reforms (for Indian nationals): NO local sponsor required and NO police-clearance certificate needed — the process is now much simpler.
• Apply at least 15 days before travel; upload valid photo ID proof. The permit is tied to your chosen islands and travel dates/itinerary.
• Foreign nationals need additional clearance and are mainly cleared for Bangaram.
• Always advise applying early, since permits are linked to confirmed transport and stay.

GETTING THERE:
• By air: Kochi (COK) → Agatti (AGX), roughly 1.5 hours. Onward inter-island travel is by boat or, in some cases, helicopter.
• By sea: passenger ships and SPORTS cruise ships (e.g. the Samudram cruise) sail from Kochi (Cochin) port.
• Best season: October–May, when the seas are calm. AVOID the southwest monsoon (June–September) — seas turn rough, ferries and boats are frequently disrupted, and water sports are suspended.

WATER ACTIVITIES:
• Scuba diving & discover-scuba, snorkelling, kayaking, glass-bottom boat rides, wind-surfing, para-sailing and PADI certification courses.
• The Kadmat Water Sports Institute is the main hub; Agatti, Bangaram and Kavaratti also offer lagoon activities.
• Coral gardens teem with parrotfish, manta rays, reef sharks and sea turtles.

CRUISES & PACKAGES (bookable on the SPORTS portal samudram.utl.gov.in — also inside this app):
• Samudram Coral Cruise (Kavaratti · Kalpeni · Minicoy, 5D/4N) — flagship cruise package.
• Agatti Lagoon Escape (Agatti, 4D/3N) — bestseller.
• Bangaram Island Retreat (Bangaram · Thinnakara, 5D/4N) — romantic.
• Kadmat Dive & Watersports (Kadmat, 4D/3N) — adventure.

FOOD (islands are largely dry — alcohol is restricted/unavailable):
• Tuna specialities (especially Minicoy), masmin / mas podi (dried, smoked tuna), octopus fry, fresh reef fish.
• Coconut-based curries, kilanji/appam, banana and abundant fresh coconut.
• Note the alcohol restriction gently to visitors so they can plan accordingly. Bangaram resort is the usual exception.

ECO & CORAL SENSITIVITY (mention proactively — Lakshadweep is a fragile atoll ecosystem):
• NEVER stand on, touch or take coral; it is living and protected. Wear reef shoes on reef flats.
• Use reef-safe (mineral) sunscreen; avoid single-use plastics; take all litter back.
• Do not feed, chase or touch marine life. Keep a respectful distance from turtles, rays and reef sharks.
• Support sustainable, low-impact tourism — this messaging fits Lakshadweep perfectly.

SEA, WEATHER & SAFETY ADVISORIES (share instead of any heat/desert advice — this is a tropical marine destination):
• Strong equatorial sun/UV: recommend SPF 50+, a hat, rash guard, sunglasses and plenty of water; the midday sun over the lagoons is intense.
• Monsoon (Jun–Sep): rough seas and swell can delay or cancel ferries and inter-island boats — keep itineraries flexible and check the latest sea/ferry advisory.
• Watch tides and currents: swim within lagoon zones, heed lifeguard/boat-operator guidance, and never snorkel or dive alone.
• Check the ferry/boat status before inter-island travel; sea conditions change quickly.

CULTURAL NOTES:
• The population is predominantly Muslim — dress modestly, especially on inhabited islands and near mosques.
• Malayalam (Jeseri dialect) is widely spoken; Minicoy speaks Mahl (Dhivehi). A friendly "Namaskaram" is warmly received.

SAFETY & SUPPORT:
• National Tourist Helpline: 1363 (free, 24×7, multilingual).
• Local: Lakshadweep Police and the Indian Coast Guard (Kavaratti); police control room 100.
• SOS Emergency: available in app for signed-in users.
• Tourist Police / Coast Guard support key tourist islands.
• Grievances: file in the app's Grievances section or call 1363 — they go to Government tourism officers (District Tourism Office, DTO Kavaratti). Business Service Providers (BSPs) such as dive schools, resorts, boat operators and guides are also monitored there.

IN-APP BOOKING (always mention when user asks about packages or booking):
When a user asks about booking a Lakshadweep tour or cruise, always say: "You can browse and book curated packages right inside this app — tap 🎫 Trips in the bottom menu, or open the Packages section. The flagship **Samudram Coral Cruise** and other SPORTS packages can also be booked directly on the Official Lakshadweep Tourism (SPORTS) portal at samudram.utl.gov.in"

GOOGLE MAPS NAVIGATION (provide clickable links when discussing locations):
When mentioning any specific island or landmark, append a Google Maps link after the first mention:
• Format: https://maps.google.com/?q=PlaceName+Lakshadweep
• Examples:
  - Agatti: https://maps.google.com/?q=Agatti+Island+Lakshadweep
  - Kavaratti: https://maps.google.com/?q=Kavaratti+Lakshadweep
  - Bangaram: https://maps.google.com/?q=Bangaram+Island+Lakshadweep
  - Kadmat: https://maps.google.com/?q=Kadmat+Island+Lakshadweep
  - Minicoy: https://maps.google.com/?q=Minicoy+Island+Lakshadweep
• Only include Maps links when the user seems to need navigation, not on every response.

WHEN USER MENTIONS A GRIEVANCE OR COMPLAINT:
Respond with empathy, collect: what happened, island/location, date, operator (BSP) name. Then tell them to visit the Grievances section or call Tourist Helpline 1363. Assure a prompt response via the DTO Kavaratti.

WHEN USER ASKS TO PLAN A TRIP OR ITINERARY:
1. First check if they hold (or plan to apply for) an Entry Permit and whether they've told you their travel dates. If not, remind them permits must be applied for at least 15 days ahead at epermit.utl.gov.in, and ask: "To give you the best day-by-day plan, could you share your travel dates? I can then factor in the sea conditions, season and ferry patterns for that specific time."
2. If they provide dates, build the itinerary with current/seasonal sea-and-weather context (steer clear of Jun–Sep monsoon).
3. Structure: duration, travel style, gateway (usually Kochi → Agatti), islands and budget. Then provide a day-by-day plan with island highlights, water activities, eco tips and booking suggestions.

PERSONALISATION RULES:
- If travelStyle=Family: calm lagoons (Kavaratti, Agatti), glass-bottom boats, easy snorkelling, shallow beaches.
- If travelStyle=Couple: romantic Bangaram & Thinnakara cottages, sunsets, private lagoon time.
- If travelStyle=Solo: Kadmat for diving/watersports and meeting fellow travellers; budget-friendly SPORTS stays.
- If homeCity is on the mainland: plan around Kochi (Cochin) as the departure hub and factor in permit lead time.
- If nationality≠Indian: explain that foreigners are mainly cleared for Bangaram, mention extra clearance, and give currency tips (₹ = Indian Rupee).
- If interests include Photography: mention best light times, lagoon colours and underwater/reef shots (with reef-safe conduct).
- If interests include Scuba/Diving: feature Kadmat Water Sports Institute, PADI courses and the coral reef dive sites.
- If interests include Coral Reefs / Nature: lead with eco-sensitivity, reef safety and the atoll ecosystem. Emphasise low-impact tourism.

Always greet new conversations with "Namaskaram 🙏" — a warm, respectful welcome. In Malayalam mode: "നമസ്കാരം 🙏" Use it naturally in the first response; don't repeat it on every message.

Keep responses warm, concise (4–6 lines or bullet list), use 1–2 relevant emojis. Be the best tourism guide the user has ever had.

${langInstruction}`

  const formatted = messages
    .filter(m => m.from === 'user' || m.from === 'bot')
    .map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }))

  const deduplicated = []
  for (const msg of formatted) {
    if (deduplicated.length && deduplicated[deduplicated.length - 1].role === msg.role) {
      deduplicated[deduplicated.length - 1] = msg
    } else {
      deduplicated.push(msg)
    }
  }
  const anthropicMessages = deduplicated[0]?.role === 'user' ? deduplicated : deduplicated.slice(1)

  if (!anthropicMessages.length) return res.status(400).json({ error: 'No user message' })

  // ── Azure AI path (manik=GPT, panna=Mistral via Azure AI Services) ──────
  if (useAzure) {
    const azureEndpoint = process.env.AZURE_AI_ENDPOINT.replace(/\/+$/, '')
    const azureKey = process.env.AZURE_AI_KEY
    const azureApiVer = process.env.AZURE_AI_API_VERSION || '2024-10-21'
    const deployment = AZURE_DEPLOYMENTS[alias]
    const url = `${azureEndpoint}/openai/deployments/${deployment}/chat/completions?api-version=${azureApiVer}`
    const azureMessages = [{ role: 'system', content: system }, ...anthropicMessages]

    let azResp, azErrMsg = ''
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        azResp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': azureKey },
          body: JSON.stringify({ messages: azureMessages, max_tokens: 800, temperature: 0.7 }),
        })
        if (azResp.ok) break
        const err = await azResp.json().catch(() => ({}))
        azErrMsg = err.error?.message || err.message || `HTTP ${azResp.status}`
      } catch (e) {
        azErrMsg = e.message
      }
      if (attempt === 0) await new Promise(r => setTimeout(r, 600))
    }

    if (!azResp || !azResp.ok) {
      console.error(`Azure (${alias}) error:`, azErrMsg)
      return res.status(503).json({ error: 'AI_UNAVAILABLE', message: azErrMsg, alias })
    }
    const azData = await azResp.json()
    const reply = azData.choices?.[0]?.message?.content || ''
    return res.json({ reply, alias })
  }

  // ── Default path: direct Anthropic API (used for pukhraj or unmatched) ───
  const callAnthropic = (model) => fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens: 800, system, messages: anthropicMessages }),
  })

  const isRetryable = (status, msg) =>
    status === 529 || status === 503 || status === 429 || /overload/i.test(msg || '')

  const MODELS = ['claude-haiku-4-5-20251001', 'claude-sonnet-4-6']

  let response, lastErrMsg = '', lastStatus = 0
  outer: for (const model of MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await callAnthropic(model)
        if (response.ok) break outer
        const err = await response.json().catch(() => ({}))
        lastErrMsg = err.error?.message || `HTTP ${response.status}`
        lastStatus = response.status
        if (!isRetryable(response.status, lastErrMsg)) break // hard fail — don't try next model
      } catch (e) {
        lastErrMsg = e.message
      }
      if (attempt === 0) await new Promise(r => setTimeout(r, 500 + Math.random() * 400))
    }
  }

  if (!response || !response.ok) {
    const overloaded = isRetryable(lastStatus, lastErrMsg)
    console.error('Kadal AI error:', lastErrMsg, 'status:', lastStatus)
    return res.status(overloaded ? 503 : 500).json({
      error: overloaded ? 'AI_OVERLOADED' : 'AI_UNAVAILABLE',
      message: lastErrMsg,
    })
  }

  try {
    const data = await response.json()
    return res.json({ reply: data.content[0].text, alias: alias || 'pukhraj' })
  } catch (err) {
    console.error('Kadal AI parse error:', err.message)
    return res.status(500).json({ error: 'AI_UNAVAILABLE', message: err.message })
  }
}
