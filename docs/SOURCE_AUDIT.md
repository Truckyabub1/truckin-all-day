# Source Audit: Truckin all Day

## Application Structure
- **Frontend:** Vanilla HTML, CSS, JavaScript (Vite build system)
- **Deployment:** Vercel (https://truckin-all-day.vercel.app/) / Netlify
- **App Name:** Truckin all Day • Official Label Platform & Artist Arcade
- **Primary Features:**
  - Artist Roster & Profiles (Clockwork Hare, Keep on Truckin 24/7, Iron Stallion Mining Music, etc.)
  - Streaming Previews (Spotify Iframes, Apple Music deep links)
  - Official Merchandise Store (Fourthwall Integration)
  - Interactive Arcade Games (HTML5 Canvas built in vanilla JS)

## Pages and Routing
- Single Page / Multi-page hybrid approach
- `index.html`: Main landing page, Artist Profiles, Arcade Entry
- `store.html`: Official Merchandise

## Data and State
- Uses local data structure inside `src/data/` or hardcoded HTML.
- No complex backend database detected in the source directly, likely reads from static JSON or minimal backend API. No sensitive data exposed.

## Visual Identity
- Theme Color: `#090a0f` (Dark Mode default)
- Typography: Inter, Outfit, Space Mono, Syne
- Accent Colors: Cyan (`var(--cyan-primary)`), Amber (`var(--amber-primary)`), Green
- Custom styling using `main.css`, `arcade.css`, `merch.css`
