# Lakshadweep Tourism App — Localisation / Brand Reference

This app was adapted from the Rajasthan Tourism reference solution. Use this sheet to
keep every screen consistent. When rebranding, replace ALL Rajasthan-specific content
with the Lakshadweep equivalents below. Preserve all layout, styling, component
structure, and logic — only change copy, data, names, colours-by-token, and URLs.

## Identity
- App name: **Lakshadweep Tourism**
- Governing body: **UT of Lakshadweep · Department of Tourism (SPORTS)**
  - SPORTS = Society for Promotion of Nature Tourism and Sports (nodal tourism agency)
- Local welcome (Malayalam): **സ്വാഗതം** (Swagatham) — "Welcome"
- Greeting used in UI (t.namaste): **Namaskaram 🙏** (Hindi: नमस्कार, Malayalam: നമസ്കാരം)
- AI assistant name: **Kadal AI** (kadal = "sea") — replaces "Rajwada AI" everywhere
  - AI chat screen file stays named PadharoAI.jsx (filename only; UI text = Kadal AI)
- App icon emoji: 🏝️ (replaces 🏰)
- Capital city: **Kavaratti**

## Official URLs (replace all rajasthan.gov.in links)
- Tourism portal / packages: `https://samudram.utl.gov.in/`
- Packages page: `https://samudram.utl.gov.in/sprt_Packages.aspx`
- Admin/UT portal: `https://lakshadweep.gov.in/`
- **Entry Permit portal (ePermit): `https://epermit.utl.gov.in`**
- Portal display name: "Lakshadweep Tourism (SPORTS)" / "samudram.utl.gov.in"

## Theme
- Default theme token is `teal` (Lagoon Teal + Coral). Variants: `teal`, `deep`, `coral`.
- Never reintroduce pink/gold/desert colours. Use CSS variables (var(--primary) etc).

## Languages
- English, Hindi, **Malayalam** (added), German, French, Japanese, Spanish.

## The 6 tourist-permitted islands (all require an Entry Permit)
1. **Agatti** — gateway island, only airport, turquoise lagoon, snorkel/first-time scuba.
2. **Bangaram** — teardrop uninhabited atoll; the ONLY island fully open to foreigners; reefs, dolphins, beach cottages.
3. **Kavaratti** — capital; Marine Aquarium, Ujra Mosque, calm lagoon, kayaking/glass-bottom boats.
4. **Minicoy (Maliku)** — southernmost, crescent; Mahl (Dhivehi) culture, 19th-c lighthouse, Lava dance, tuna, huge lagoon.
5. **Kadmat** — Water Sports Institute; scuba, wind-surfing, para-sailing, PADI courses.
6. **Kalpeni** — serene lagoon, three islets, Koomel beach, coral-debris storm bank, canoeing.
- Also: **Thinnakara** (beach tents near Bangaram), **coral reef dive sites**.
- Foreign nationals: primarily Bangaram (sometimes Agatti); other islands generally restricted for foreigners.

## Categories (replace forts/wildlife/desert/lakes/temples)
Islands · Water Sports · Lagoons · Beaches · Scuba/Diving · Coral Reefs · Cruises · Packages

## Getting there
- Flights: Kochi (COK) → Agatti (AGX), ~1.5h. Onward inter-island by boat/helicopter.
- Ships/cruises: from Kochi (Cochin) port; SPORTS cruise ships (e.g. Samudram cruise).
- Best season: **October–May** (avoid SW monsoon Jun–Sep; seas rough, ferries disrupted).

## Packages (already in AppContext.jsx — mirror these names)
1. Samudram Coral Cruise (Kavaratti · Kalpeni · Minicoy, 5D/4N) — flagship, book on SPORTS portal.
2. Agatti Lagoon Escape (Agatti, 4D/3N) — bestseller.
3. Bangaram Island Retreat (Bangaram · Thinnakara, 5D/4N) — romantic.
4. Kadmat Dive & Watersports (Kadmat, 4D/3N) — adventure.

## Grievances / operators are "BSP" (Business Service Providers) — dive schools, resorts,
   boat operators, guides. Officer portal: DTO Kavaratti. Officer name: Ayesha Koya.

## Safety / SOS
- National Tourist Helpline: **1363** (free, 24×7, multilingual) — keep as-is.
- Local: Lakshadweep Police & Indian Coast Guard (Kavaratti). Police control room: 100.
- Replace "Blue Beret tourist police" references with "Tourist Police / Coast Guard".
- Replace heat advisories with SEA advisories: monsoon swell, high tide, ferry status,
  sun/UV, reef safety (don't touch coral, reef shoes), swimming currents.

## Entry Permit (NEW signature feature) — route `/permit`, screen EntryPermit.jsx
- All non-islander tourists need an Entry Permit before travel.
- 2026 reforms: no local sponsor required for Indians; no police-clearance certificate needed.
- Apply ≥15 days before travel; upload ID proof; permit tied to itinerary/islands & dates.
- Foreign nationals: additional clearance; mainly Bangaram.

## Food (replace Dal Baati / Laal Maas etc.)
- Tuna specialities (Minicoy), Mas Podi/masmin (dried tuna), octopus fry, coconut-based
  curries, kilanji/appam, banana, fresh reef fish. Alcohol restricted; islands are largely dry.

## Cultural notes
- Predominantly Muslim population; dress modestly. Malayalam (Jeseri dialect) spoken; Mahl in Minicoy.
- Eco-sensitive coral ecosystem — sustainable/eco-tourism messaging fits well.

## Tone
Keep the same warm, modern, government-grade product tone as the Rajasthan app.
