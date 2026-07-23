# Lakshadweep Tourism App — Developer Setup Guide

Welcome! This guide gets a new developer from **zero → running app** in ~10 minutes.

---

## 1. Prerequisites

| Tool | Version | Install |
|---|---|---|
| **Node.js** | 20.x LTS or newer | https://nodejs.org (or via nvm) |
| **npm** | 10.x+ (comes with Node) | — |
| **Git** | any recent | https://git-scm.com |
| **VS Code / Cursor** (or any editor) | latest | https://code.visualstudio.com |

Verify:
```bash
node -v   # → v20.x.x or newer
npm -v
```

---

## 2. First-time setup (5 min)

### Step 1 — Unzip / clone
Unzip the handover package to your workspace, e.g. `~/projects/lakshadweep-tourism/`

### Step 2 — Install dependencies
```bash
cd lakshadweep-tourism # or whatever folder you unzipped into
npm install
```
This installs React, Vite, Express, and dev dependencies (~100 MB in `node_modules/`).

### Step 3 — Configure environment variables
```bash
cp .env.example .env
```
Then open `.env` in your editor and paste your Anthropic API key:
```
ANTHROPIC_API_KEY="sk-ant-api03-...your-real-key..."
```

> **Get an Anthropic key**: sign up at https://console.anthropic.com → Settings → API Keys. Add a $5–10 spend cap while developing.

### Step 4 — Run in development mode
```bash
npm run dev
```
Vite dev server starts on http://localhost:5173 with hot-reload. Open in browser.

> **Note**: The dev server does NOT run the API endpoints (`/api/*`). Those need the Express server. See "Running with AI backend" below.

---

## 3. Running with AI backend (Express + Vite together)

For full local testing including AI chat, run two processes:

**Terminal 1 — API server (Express, port 3000):**
```bash
npm run build     # first-time only, or after src/ changes
npm start         # starts server.js on :3000
```

**Terminal 2 — Vite dev server (with proxy):**
```bash
npm run dev       # :5173, proxies /api/* to :3000 automatically
```

Alternatively, do **one-shot testing**: `npm run build && npm start` — served at http://localhost:3000 with the built UI (no hot-reload).

---

## 4. Project Structure

```
lakshadweep-tourism/
├── api/                    # Serverless API handlers (Vercel-format, also Express-compatible)
│   ├── chat.js             # Main AI chat endpoint — /api/chat
│   ├── weather.js          # Live weather from Open-Meteo — /api/weather
│   └── official-data.js    # Cached tourism portal data — /api/official-data
│
├── src/                    # React frontend
│   ├── main.jsx            # Entry
│   ├── App.jsx             # Router + routes
│   ├── context/
│   │   └── AppContext.jsx  # Global state (user, cart, destinations, packages)
│   ├── screens/            # All screens (23 files)
│   │   ├── Splash.jsx
│   │   ├── VisitorHome.jsx / TouristHome.jsx
│   │   ├── PadharoAI.jsx   # AI chat with Kadal AI
│   │   ├── OfficerDashboard.jsx  # Govt portal (biggest file)
│   │   ├── CityAttractions.jsx
│   │   └── ... etc
│   ├── components/         # Reusable components
│   │   ├── NearbySearch.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── BottomNav.jsx
│   │   └── StatusBar.jsx
│   ├── i18n.js             # 6-language translation strings
│   └── style.css           # Global styles + design tokens
│
├── public/                 # Static assets served at web root
│   ├── images/fort.png     # Island icon for chip
│   ├── banner1.jpeg
│   └── staticwebapp.config.json
│
├── server.js               # Express server wrapping api/ handlers (for VM deploy)
├── ecosystem.config.cjs    # PM2 config (production VM)
├── vite.config.js
├── vercel.json             # Vercel routing config
├── package.json
├── .env.example            # Template — copy to .env
├── .gitignore
└── DEV_SETUP.md            # ← you are here
```

---

## 5. Key concepts

### 5.1 The two portals
The app has **two personas** sharing one codebase:
1. **Tourist side**: `/`, `/visitor`, `/home`, `/ai-chat`, `/attractions`, etc.
2. **Officer side**: `/officer-login` → `/officer-dashboard` (dark theme + light theme toggle)

### 5.2 AI chat routing
The chat handler at `api/chat.js` supports 3 hostname-based aliases (for the Azure deployment). On localhost, all requests fall through to Anthropic direct — that's fine for dev.

### 5.3 State management
No Redux. Uses React Context (`src/context/AppContext.jsx`). All app-wide state (user, cart, destinations, appLanguage, theme) lives there.

### 5.4 Multilingual
`src/i18n.js` has English + Hindi + Malayalam + German + French + Japanese + Spanish translations for UI chrome. Dynamic content stays English in demo mode.

### 5.5 Weather data
Live via Open-Meteo API (free, no key). Cached 15 min server-side in `api/weather.js`.

---

## 6. Common tasks

| Task | Command |
|---|---|
| Run dev server (with hot-reload) | `npm run dev` |
| Run production build + Express server | `npm run build && npm start` |
| Build only | `npm run build` |
| Preview production build (Vite) | `npm run preview` |
| Install a new package | `npm install <name>` |

---

## 7. Making changes

### To fix a bug in a screen
Edit `src/screens/<ScreenName>.jsx` — save → Vite hot-reloads instantly.

### To change AI behaviour
Edit `api/chat.js` — the `system` prompt is where domain knowledge lives (~200 lines). After edits, restart the Express server (`npm start`).

### To add a new language
1. Add a new object under `src/i18n.js` with all keys translated
2. Add the language to the picker in `src/components/LanguageSelector.jsx`
3. Add matching `langMap` entry in `api/chat.js` line ~73

### To add a new screen
1. Create `src/screens/NewScreen.jsx`
2. Register the route in `src/App.jsx`
3. Add a link/button that navigates to it from another screen

---

## 8. Deployment (informational — you don't run these locally)

The app is deployed in two places:
- **Vercel** — serverless, backup URL: `https://lakshadweep-tourism.vercel.app`
- **Azure VM** (Central India) — primary org-hosted URL: `https://lakshadweep-tourism.centralindia.cloudapp.azure.com`

Both auto-deploy on `git push` to `main` if the GitHub secrets are set up in your repo:
- `AZURE_VM_HOST`, `AZURE_VM_USER`, `AZURE_VM_SSH_KEY`

If you're forking or moving to a new repo, you'll need to set those up yourself (or ignore Azure deploy and stick with Vercel).

---

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| `Cannot find module 'express'` | `npm install` |
| Port 3000 already in use | `PORT=3456 npm start` (or kill the process on 3000) |
| AI chat returns `AI_NOT_CONFIGURED` | Check `.env` has `ANTHROPIC_API_KEY` set. Restart Express after change. |
| AI chat returns `AI_OVERLOADED` | Anthropic is transiently overloaded — retry. Or app will fall back to a rich offline response. |
| Weather returns null | Open-Meteo might be temporarily down — safe to ignore, the app has cached fallback. |
| Blank white screen in browser | Check browser console for JS error. Usually a missing import or syntax error in your recent edit. |
| Hot-reload not working | Restart `npm run dev`. Vite occasionally needs a hard restart after big changes. |
| Build succeeds locally but Vercel deploy fails | Check `vercel.json` — the `rewrites` rule routes non-`/api/` to `index.html`. |

---

## 10. Contributing

- **Branching**: work on feature branches, merge to `main` via PR
- **Code style**: match existing patterns — inline styles for one-off elements, `style.css` for shared tokens
- **No lint step configured** — code review acts as lint. Prefer readability over cleverness.
- **AI prompt changes**: test with multiple query types before pushing (planning, factual, complaint, multilingual)

---

## 11. Support / questions

- **Original architect**: Prashant Malviya · prashant.malviya@uneecops.in
- **Repo**: (add your team's repo URL here after cloning)
- **Live URLs**:
  - Prod: https://lakshadweep-tourism.centralindia.cloudapp.azure.com
  - Backup: https://lakshadweep-tourism.vercel.app

Happy coding! 🏝️
