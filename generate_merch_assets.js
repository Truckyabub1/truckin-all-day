import fs from 'fs';
import path from 'path';

const outDir = path.resolve('/Users/mufasa/truckin-all-day/public/images/merch-assets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const assets = [
  {
    filename: 'clockwork-hare-print.svg',
    title: 'CLOCKWORK HARE - GEAR RUNNER',
    svg: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow-cwh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#00f2fe" flood-opacity="0.6"/>
    </filter>
  </defs>
  <!-- Outer Gear Ring -->
  <circle cx="500" cy="460" r="340" fill="none" stroke="#00f2fe" stroke-width="20" stroke-dasharray="60 30" filter="url(#glow-cwh)"/>
  <circle cx="500" cy="460" r="280" fill="#10141d" stroke="#c59d5f" stroke-width="16"/>
  <!-- Internal Brass Escapement Cogs -->
  <path d="M430 310 L500 210 L570 310 L650 310 L585 390 L650 480 L550 510 L500 610 L450 510 L350 480 L415 390 L350 310 Z" fill="#c59d5f" opacity="0.95"/>
  <!-- Central Rabbit Silhouette with Wings -->
  <path d="M450 440 C380 320, 410 240, 460 270 C500 300, 520 380, 520 440 C520 380, 570 300, 610 270 C660 240, 690 320, 620 440 C660 500, 640 590, 500 600 C360 590, 340 500, 450 440 Z" fill="#00f2fe" filter="url(#glow-cwh)"/>
  <circle cx="480" cy="430" r="16" fill="#10141d"/>
  <circle cx="520" cy="430" r="16" fill="#10141d"/>
  <!-- Typography -->
  <text x="500" y="850" font-family="'Syne', 'Outfit', sans-serif" font-size="64" fill="#00f2fe" font-weight="900" letter-spacing="14" text-anchor="middle">CLOCKWORK HARE</text>
  <text x="500" y="910" font-family="'Space Mono', monospace" font-size="32" fill="#c59d5f" font-weight="700" letter-spacing="10" text-anchor="middle">GEAR RUNNER // SPEED DIVISION</text>
</svg>`
  },
  {
    filename: 'keep-on-truckin-print.svg',
    title: 'KEEP ON TRUCKIN 24 7 - HIGHWAY HEADLINER',
    svg: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <!-- Eagle Highway Crest Wings -->
  <path d="M150 380 Q500 240 850 380 L800 440 Q500 320 200 440 Z" fill="url(#goldGrad)"/>
  <!-- 18-Wheeler Radiator Grille -->
  <rect x="330" y="360" width="340" height="260" rx="24" fill="#0b0d13" stroke="#f59e0b" stroke-width="16"/>
  <!-- Chrome Slats -->
  <line x1="370" y1="410" x2="630" y2="410" stroke="#f3f4f6" stroke-width="12" stroke-linecap="round"/>
  <line x1="370" y1="460" x2="630" y2="460" stroke="#f3f4f6" stroke-width="12" stroke-linecap="round"/>
  <line x1="370" y1="510" x2="630" y2="510" stroke="#f3f4f6" stroke-width="12" stroke-linecap="round"/>
  <line x1="370" y1="560" x2="630" y2="560" stroke="#f3f4f6" stroke-width="12" stroke-linecap="round"/>
  <!-- Dual High-Intensity Headlights -->
  <circle cx="390" cy="580" r="28" fill="#00f2fe"/>
  <circle cx="610" cy="580" r="28" fill="#00f2fe"/>
  <!-- Typography -->
  <text x="500" y="760" font-family="'Syne', sans-serif" font-size="64" fill="#f59e0b" font-weight="900" letter-spacing="8" text-anchor="middle">KEEP ON TRUCKIN'</text>
  <text x="500" y="830" font-family="'Space Mono', monospace" font-size="38" fill="#f3f4f6" font-weight="700" letter-spacing="12" text-anchor="middle">24 / 7 ROAD REPUTATION</text>
  <text x="500" y="880" font-family="'Inter', sans-serif" font-size="22" fill="#9ca3af" letter-spacing="6" text-anchor="middle">OUTLAW COUNTRY • SOUTHERN ROCK</text>
</svg>`
  },
  {
    filename: 'iron-stallion-print.svg',
    title: 'IRON STALLION - SUBTERRANEAN MINING MUSIC',
    svg: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <!-- Radial Spoke Crest -->
  <circle cx="500" cy="450" r="300" fill="none" stroke="#6b7280" stroke-width="14" stroke-dasharray="30 20"/>
  <!-- Cross Pickaxes -->
  <path d="M280 230 L720 670" stroke="#f59e0b" stroke-width="32" stroke-linecap="round"/>
  <path d="M380 670 L620 230" stroke="#f59e0b" stroke-width="32" stroke-linecap="round"/>
  <!-- Steel Pick Heads -->
  <path d="M220 270 Q280 160 390 120" fill="none" stroke="#f3f4f6" stroke-width="26" stroke-linecap="round"/>
  <path d="M780 270 Q720 160 610 120" fill="none" stroke="#f3f4f6" stroke-width="26" stroke-linecap="round"/>
  <!-- Heavy Ore Cart -->
  <polygon points="360,510 640,510 610,630 390,630" fill="#1a1c23" stroke="#f59e0b" stroke-width="14"/>
  <circle cx="420" cy="650" r="28" fill="#4b5563" stroke="#f59e0b" stroke-width="6"/>
  <circle cx="580" cy="650" r="28" fill="#4b5563" stroke="#f59e0b" stroke-width="6"/>
  <!-- Typography -->
  <text x="500" y="780" font-family="'Syne', sans-serif" font-size="64" fill="#f3f4f6" font-weight="900" letter-spacing="10" text-anchor="middle">IRON STALLION</text>
  <text x="500" y="850" font-family="'Space Mono', monospace" font-size="34" fill="#f59e0b" font-weight="700" letter-spacing="8" text-anchor="middle">SUBTERRANEAN MINING ROOTS</text>
</svg>`
  },
  {
    filename: 'harlan-echo-print.svg',
    title: 'HARLAN ECHO - APPALACHIAN NOIR',
    svg: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <!-- Mountain Hollow Crest -->
  <circle cx="500" cy="440" r="290" fill="#0f1915" stroke="#10b981" stroke-width="14"/>
  <!-- Silver Moon -->
  <circle cx="610" cy="340" r="70" fill="#dedcd4" opacity="0.9"/>
  <!-- Pine Peaks Silhouette -->
  <polygon points="500,230 400,470 600,470" fill="#253b34"/>
  <polygon points="390,320 280,530 500,530" fill="#1b2b25"/>
  <polygon points="610,310 500,540 720,540" fill="#1b2b25"/>
  <polygon points="500,410 330,620 670,620" fill="#131e1a"/>
  <!-- Typography -->
  <text x="500" y="780" font-family="'Syne', sans-serif" font-size="68" fill="#dedcd4" font-weight="900" letter-spacing="14" text-anchor="middle">HARLAN ECHO</text>
  <text x="500" y="850" font-family="'Space Mono', monospace" font-size="32" fill="#10b981" font-weight="700" letter-spacing="10" text-anchor="middle">APPALACHIAN NOIR // GHOST PINES</text>
</svg>`
  },
  {
    filename: 'subzero-pulsewavez-print.svg',
    title: 'SUBZERO PULSEWAVEZ - CYBER RETROWAVE',
    svg: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="szpSun" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ff6bfd"/>
      <stop offset="100%" stop-color="#00f2fe"/>
    </linearGradient>
  </defs>
  <!-- Retrowave Sun -->
  <circle cx="500" cy="400" r="240" fill="url(#szpSun)"/>
  <!-- CRT Sun Slices -->
  <line x1="280" y1="360" x2="720" y2="360" stroke="#090a0f" stroke-width="14"/>
  <line x1="290" y1="410" x2="710" y2="410" stroke="#090a0f" stroke-width="18"/>
  <line x1="310" y1="465" x2="690" y2="465" stroke="#090a0f" stroke-width="24"/>
  <line x1="350" y1="525" x2="650" y2="525" stroke="#090a0f" stroke-width="30"/>
  <!-- Perspective Interceptor Supercar -->
  <polygon points="320,620 680,620 620,540 380,540" fill="#090a0f" stroke="#00f2fe" stroke-width="12"/>
  <polygon points="410,540 590,540 560,500 440,500" fill="#090a0f" stroke="#ff6bfd" stroke-width="8"/>
  <!-- Neon Taillights -->
  <rect x="350" y="590" width="300" height="14" rx="6" fill="#ff6bfd"/>
  <!-- Typography -->
  <text x="500" y="780" font-family="'Syne', sans-serif" font-size="60" fill="#00f2fe" font-weight="900" letter-spacing="10" text-anchor="middle">SUBZERO PULSEWAVEZ</text>
  <text x="500" y="850" font-family="'Space Mono', monospace" font-size="34" fill="#ff6bfd" font-weight="700" letter-spacing="12" text-anchor="middle">HIGHWAY 120 MPH // SYNTHWAVE</text>
</svg>`
  },
  {
    filename: 'purple-vixon-flagship-print.svg',
    title: 'THE PURPLE VIXON - ROYAL ROAD COUTURE',
    svg: `<svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vixonGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="50%" stop-color="#ff6bfd"/>
      <stop offset="100%" stop-color="#9333ea"/>
    </linearGradient>
  </defs>
  <!-- Opulent Ring -->
  <circle cx="500" cy="440" r="300" fill="#170c24" stroke="url(#vixonGrad)" stroke-width="20"/>
  <!-- Monarch Crown -->
  <polygon points="350,240 400,340 500,280 600,340 650,240 580,380 420,380" fill="url(#vixonGrad)"/>
  <!-- Geometric Royal Fox Mask -->
  <polygon points="500,410 320,320 410,560 500,640 590,560 680,320" fill="#7e22ce" stroke="#ff6bfd" stroke-width="14"/>
  <!-- Piercing Cyan Eyes -->
  <circle cx="440" cy="470" r="20" fill="#00f2fe"/>
  <circle cx="560" cy="470" r="20" fill="#00f2fe"/>
  <!-- Typography -->
  <text x="500" y="790" font-family="'Syne', sans-serif" font-size="64" fill="#ff6bfd" font-weight="900" letter-spacing="12" text-anchor="middle">THE PURPLE VIXON</text>
  <text x="500" y="860" font-family="'Space Mono', monospace" font-size="34" fill="#f59e0b" font-weight="700" letter-spacing="10" text-anchor="middle">ROYAL ROAD COLLECTIVE // LUXE</text>
</svg>`
  }
];

assets.forEach(a => {
  fs.writeFileSync(path.join(outDir, a.filename), a.svg.trim(), 'utf8');
  console.log('Generated print asset:', a.filename);
});
