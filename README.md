# Truckin all Day • Official Label Platform & Artist Arcade

High-impact country-meets-rock music label platform, interactive cartoon arcade games, artist showcases, and official merchandise supply.

- **Live URL:** [https://truckinallday.netlify.app](https://truckinallday.netlify.app)
- **Tech Stack:** Vanilla JavaScript (ES Modules), HTML5 Canvas, Web Audio API, Modern CSS, Vite, Netlify

---

## Features

1. **Official Artist Roster & Streaming**
   - 5 Signature artists: **CLOCKWORK HARE**, **Keep on Truckin' 24 7**, **Iron Stallion Mining Music**, **Harlan Echo**, and **Subzero Pulsewavez**.
   - Lazy-loaded embedded Spotify players and direct links to Spotify, Apple Music, YouTube Music, Amazon Music, and Deezer.
   - Genre filtering (Southern Rock, Steampunk/Synth, Mining/Americana).

2. **5-Artist Custom Vector Arcade Platform**
   - **Gear Runner (CLOCKWORK HARE):** Steampunk rabbit platformer with cog hopping, brass carrot collecting, and helicopter hover mechanics.
   - **Heavy Dirt Hauler (Keep on Truckin' 24 7):** Construction convoy snake game with highway semi steering and trailer hitching.
   - **Ore Drill Rush (Iron Stallion Mining Music):** Subterranean 3-track rail drill cart, mining ore chunks with spark physics while dodging stalactites.
   - **Timber Hollow Trail (Harlan Echo):** Appalachian night drive in a vintage 1970s pickup truck with dynamic headlights, dodging fallen timber and collecting vinyl records.
   - **Neon Highway 120 (Subzero Pulsewavez):** 120 MPH synthwave speeder with wireframe perspective horizon, neon sun, cyber interceptor, pulse energy gates, and traffic dodging.
   - **Universal Vector Engine:** 100% procedural 2D vector graphics (0 emoji font bugs) with HiDPI Retina scaling, procedural Web Audio synthesizer, touch swipe, virtual D-pad, and localStorage high score tracking.

3. **Official Fourthwall Storefront Showcase**
   - Direct integration pointing to official merchandise supply: `https://the-purple-vixon-shop.fourthwall.com`.
   - Worldwide shipping, tour apparel, vinyl pressings, and accessories.

---

## Getting Started

### Prerequisites

- Node.js `>=20.0.0`
- npm `>=9.0.0`

### Installation

```bash
git clone <repo-url>
cd truckin-all-day
npm install
```

### Environment Configuration

Copy the sample environment configuration:

```bash
cp .env.example .env
```

Available variables:
- `VITE_SITE_URL`: Deployed site URL (default: `https://truckinallday.netlify.app`)
- `VITE_STORE_CHECKOUT_URL`: External merchandise checkout destination
- `VITE_NEWSLETTER_ENDPOINT`: Optional custom newsletter webhook

### Local Development

Start the local Vite development server:

```bash
npm run dev
```

Server defaults to `http://localhost:5173`.

### Production Build

Compile static production assets into `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment to Netlify

The repository includes `netlify.toml` pre-configured for automated continuous deployment:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** `22`
- **Headers & Security:** Includes Content Security Policy (CSP), strict referrer policies, nosniff, and asset caching headers.

### Netlify CLI Manual Deploy

```bash
# Link repository
netlify link

# Deploy draft preview
netlify deploy --build

# Deploy to production
netlify deploy --prod --build
```

