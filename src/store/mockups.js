/**
 * Dynamic SVG Mockup Engine for Truckin all Day / Fourthwall Storefront
 * Renders high-fidelity, color-reactive apparel, headwear, vinyl, and accessory mockups.
 */

export function renderProductMockup(product, activeColorHex = null) {
  const color = activeColorHex || (product.colors && product.colors[0]?.hex) || '#1c1c1e';
  const type = product.mockupType || 'tee';
  const artist = product.artistId || 'default';

  switch (type) {
    case 'tee':
      return renderTeeMockup(color, product, artist);
    case 'hoodie':
      return renderHoodieMockup(color, product, artist);
    case 'jacket':
      return renderJacketMockup(color, product, artist);
    case 'hat':
      return renderHatMockup(color, product, artist);
    case 'vinyl':
      return renderVinylMockup(color, product, artist);
    case 'mug':
      return renderMugMockup(color, product, artist);
    case 'pin':
      return renderPinMockup(color, product, artist);
    case 'bag':
      return renderBagMockup(color, product, artist);
    default:
      return renderTeeMockup(color, product, artist);
  }
}

function getArtistGraphics(artist, badgeText = 'OFFICIAL') {
  switch (artist) {
    case 'clockwork-hare':
      return `
        <g transform="translate(150, 150)">
          <!-- Clockwork Gear Motif -->
          <circle cx="0" cy="0" r="38" fill="none" stroke="#00f2fe" stroke-width="2.5" stroke-dasharray="8 4" opacity="0.85" />
          <circle cx="0" cy="0" r="28" fill="#141824" stroke="#c59d5f" stroke-width="2" />
          <path d="M-8 -18 L0 -30 L8 -18 L18 -18 L10 -8 L18 2 L6 6 L0 18 L-6 6 L-18 2 L-10 -8 L-18 -18 Z" fill="#c59d5f" opacity="0.9" />
          <!-- Rabbit Silhouette with Wings -->
          <path d="M-6 -2 C-14 -16, -10 -24, -4 -20 C0 -16, 2 -8, 2 -2 C2 -8, 8 -16, 12 -20 C18 -24, 18 -12, 12 -2 C16 4, 14 14, 0 16 C-14 14, -16 4, -6 -2 Z" fill="#00f2fe" />
          <text x="0" y="44" font-family="'Space Mono', monospace" font-size="7.5" fill="#00f2fe" font-weight="700" letter-spacing="2" text-anchor="middle">CLOCKWORK HARE</text>
          <text x="0" y="54" font-family="'Inter', sans-serif" font-size="5" fill="#c59d5f" letter-spacing="1.5" text-anchor="middle">GEAR RUNNER // SPEED DEPT</text>
        </g>
      `;
    case 'keep-on-truckin':
      return `
        <g transform="translate(150, 155)">
          <!-- Highway 18-Wheeler Truck & Eagle Wings -->
          <path d="M-45 -10 Q0 -28 45 -10 L38 -2 Q0 -18 -38 -2 Z" fill="#f59e0b" opacity="0.9" />
          <rect x="-24" y="-12" width="48" height="34" rx="4" fill="#0c0d12" stroke="#f59e0b" stroke-width="2" />
          <!-- Grille Slats -->
          <line x1="-18" y1="-4" x2="18" y2="-4" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />
          <line x1="-18" y1="2" x2="18" y2="2" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />
          <line x1="-18" y1="8" x2="18" y2="8" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />
          <line x1="-18" y1="14" x2="18" y2="14" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />
          <!-- Dual Headlights -->
          <circle cx="-16" cy="18" r="3.5" fill="#00f2fe" filter="drop-shadow(0 0 4px #00f2fe)" />
          <circle cx="16" cy="18" r="3.5" fill="#00f2fe" filter="drop-shadow(0 0 4px #00f2fe)" />
          <text x="0" y="34" font-family="'Syne', sans-serif" font-size="9" fill="#f59e0b" font-weight="900" letter-spacing="2" text-anchor="middle">KEEP ON TRUCKIN'</text>
          <text x="0" y="44" font-family="'Space Mono', monospace" font-size="6" fill="#f3f4f6" letter-spacing="2" text-anchor="middle">24 / 7 ROAD REPUTATION</text>
        </g>
      `;
    case 'iron-stallion':
      return `
        <g transform="translate(150, 155)">
          <!-- Cross Pickaxes & Ore Mine Cart -->
          <circle cx="0" cy="0" r="36" fill="none" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 4" />
          <path d="M-28 -18 L18 28 M-18 28 L28 -18" stroke="#f59e0b" stroke-width="3.5" stroke-linecap="round" />
          <path d="M-34 -14 Q-28 -28 -14 -34" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
          <path d="M14 -34 Q28 -28 34 -14" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
          <polygon points="-16,8 16,8 12,22 -12,22" fill="#1e2126" stroke="#f59e0b" stroke-width="1.5" />
          <text x="0" y="36" font-family="'Syne', sans-serif" font-size="8" fill="#f3f4f6" font-weight="900" letter-spacing="1.5" text-anchor="middle">IRON STALLION</text>
          <text x="0" y="46" font-family="'Space Mono', monospace" font-size="5.5" fill="#f59e0b" letter-spacing="2" text-anchor="middle">SUBTERRANEAN ROOTS</text>
        </g>
      `;
    case 'harlan-echo':
      return `
        <g transform="translate(150, 155)">
          <!-- Mountain Pines & Moon Silhouette -->
          <circle cx="0" cy="-4" r="32" fill="#141f1c" stroke="#10b981" stroke-width="1.5" />
          <circle cx="12" cy="-14" r="8" fill="#dedcd4" opacity="0.9" />
          <polygon points="0,-16 -12,8 12,8" fill="#253b34" />
          <polygon points="-12,-8 -22,12 -2,12" fill="#1b2b25" />
          <polygon points="10,-6 0,14 20,14" fill="#1b2b25" />
          <text x="0" y="36" font-family="'Syne', sans-serif" font-size="8.5" fill="#dedcd4" font-weight="800" letter-spacing="2" text-anchor="middle">HARLAN ECHO</text>
          <text x="0" y="46" font-family="'Space Mono', monospace" font-size="5.5" fill="#10b981" letter-spacing="1.5" text-anchor="middle">APPALACHIAN NOIR</text>
        </g>
      `;
    case 'subzero-pulsewavez':
      return `
        <g transform="translate(150, 155)">
          <!-- Cyber Wireframe Sun & Neon Interceptor -->
          <defs>
            <linearGradient id="cyberSun" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ff6bfd" />
              <stop offset="100%" stop-color="#00f2fe" />
            </linearGradient>
          </defs>
          <circle cx="0" cy="-6" r="26" fill="url(#cyberSun)" />
          <line x1="-24" y1="-10" x2="24" y2="-10" stroke="#090a0f" stroke-width="1.5" />
          <line x1="-22" y1="-4" x2="22" y2="-4" stroke="#090a0f" stroke-width="2" />
          <line x1="-20" y1="2" x2="20" y2="2" stroke="#090a0f" stroke-width="2.5" />
          <!-- Neon Sports Car Silhouette -->
          <polygon points="-22,16 22,16 16,8 -16,8" fill="#090a0f" stroke="#00f2fe" stroke-width="1.5" />
          <text x="0" y="34" font-family="'Syne', sans-serif" font-size="8" fill="#00f2fe" font-weight="900" letter-spacing="2" text-anchor="middle">SUBZERO PULSEWAVEZ</text>
          <text x="0" y="44" font-family="'Space Mono', monospace" font-size="5.5" fill="#ff6bfd" letter-spacing="2.5" text-anchor="middle">HIGHWAY 120 MPH</text>
        </g>
      `;
    case 'the-purple-vixon':
    default:
      return `
        <g transform="translate(150, 155)">
          <!-- Royal Vixon Fox Mask & Crown Crest -->
          <defs>
            <linearGradient id="vixonGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#f59e0b" />
              <stop offset="100%" stop-color="#ff6bfd" />
            </linearGradient>
          </defs>
          <circle cx="0" cy="0" r="34" fill="#1d1229" stroke="#ff6bfd" stroke-width="2" />
          <!-- Crown -->
          <polygon points="-14,-22 -10,-12 0,-18 10,-12 14,-22 8,-8 -8,-8" fill="url(#vixonGold)" />
          <!-- Fox Mask -->
          <polygon points="0,-4 -16,-12 -8,10 0,16 8,10 16,-12" fill="#9333ea" stroke="#ff6bfd" stroke-width="1.5" />
          <circle cx="-5" cy="0" r="2" fill="#00f2fe" />
          <circle cx="5" cy="0" r="2" fill="#00f2fe" />
          <text x="0" y="34" font-family="'Syne', sans-serif" font-size="8.5" fill="#ff6bfd" font-weight="900" letter-spacing="2" text-anchor="middle">THE PURPLE VIXON</text>
          <text x="0" y="44" font-family="'Space Mono', monospace" font-size="5.5" fill="#f59e0b" letter-spacing="2" text-anchor="middle">ROYAL ROAD COUTURE</text>
        </g>
      `;
  }
}

function renderTeeMockup(color, product, artist) {
  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <defs>
        <radialGradient id="teeShadow" cx="50%" cy="40%" r="60%">
          <stop offset="60%" stop-color="#000" stop-opacity="0" />
          <stop offset="100%" stop-color="#000" stop-opacity="0.45" />
        </radialGradient>
        <linearGradient id="foldHighlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.08" />
          <stop offset="50%" stop-color="#000" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0.05" />
        </linearGradient>
      </defs>

      <!-- Background Floor Shadow -->
      <ellipse cx="150" cy="305" rx="85" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- T-Shirt Body -->
      <path d="
        M 105 32
        C 120 48, 180 48, 195 32
        L 242 58
        C 256 68, 268 84, 276 102
        L 240 126
        C 232 116, 226 106, 220 98
        L 220 285
        C 180 292, 120 292, 80 285
        L 80 98
        C 74 106, 68 116, 60 126
        L 24 102
        C 32 84, 44 68, 58 58
        Z
      " fill="${color}" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

      <!-- Garment Shadow/Highlight Texture Overlay -->
      <path d="
        M 105 32
        C 120 48, 180 48, 195 32
        L 242 58
        C 256 68, 268 84, 276 102
        L 240 126
        L 220 98
        L 220 285
        L 80 285
        L 80 98
        L 60 126
        L 24 102
        L 58 58
        Z
      " fill="url(#teeShadow)" />

      <!-- Fabric Folds -->
      <path d="M 88 110 Q 110 180 88 270" stroke="rgba(0,0,0,0.25)" stroke-width="3" fill="none" />
      <path d="M 212 110 Q 190 180 212 270" stroke="rgba(0,0,0,0.25)" stroke-width="3" fill="none" />
      <path d="M 125 70 Q 150 90 175 70" stroke="rgba(0,0,0,0.18)" stroke-width="2" fill="none" />

      <!-- Crew Collar Ribbing -->
      <path d="M 105 32 C 120 48, 180 48, 195 32 C 182 40, 118 40, 105 32 Z" fill="#121316" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
      <!-- Interior Neck Label -->
      <rect x="135" y="44" width="30" height="12" rx="2" fill="#090a0f" stroke="#00f2fe" stroke-width="0.8" />
      <text x="150" y="52" font-family="'Space Mono', monospace" font-size="4" fill="#00f2fe" text-anchor="middle">TRUCKIN // L</text>

      <!-- Chest Artwork -->
      ${getArtistGraphics(artist)}

      <!-- Blank Tag Bottom Left -->
      <rect x="85" y="270" width="22" height="8" rx="2" fill="#121316" stroke="#f59e0b" stroke-width="0.7" />
      <text x="96" y="276" font-family="'Space Mono', monospace" font-size="3.5" fill="#f59e0b" font-weight="700" text-anchor="middle">240 GSM</text>
    </svg>
  `;
}

function renderHoodieMockup(color, product, artist) {
  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <!-- Floor Shadow -->
      <ellipse cx="150" cy="305" rx="90" ry="12" fill="rgba(0,0,0,0.55)" filter="blur(4px)" />

      <!-- Hood Outer & Opening -->
      <path d="M 95 65 C 80 10, 220 10, 205 65 C 180 50, 120 50, 95 65 Z" fill="${color}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <path d="M 115 58 C 125 35, 175 35, 185 58 C 170 70, 130 70, 115 58 Z" fill="#0d0e14" />

      <!-- Drawstrings -->
      <line x1="135" y1="62" x2="132" y2="115" stroke="#dedcd4" stroke-width="2" stroke-linecap="round" />
      <rect x="130.5" y="113" width="3" height="6" rx="1" fill="#f59e0b" />
      <line x1="165" y1="62" x2="168" y2="115" stroke="#dedcd4" stroke-width="2" stroke-linecap="round" />
      <rect x="166.5" y="113" width="3" height="6" rx="1" fill="#f59e0b" />

      <!-- Body & Sleeves -->
      <path d="
        M 105 65
        L 62 82
        C 40 105, 30 145, 20 185
        L 48 196
        C 56 165, 66 135, 78 112
        L 78 280
        L 222 280
        L 222 112
        C 234 135, 244 165, 252 196
        L 280 185
        C 270 145, 260 105, 238 82
        L 195 65
        Z
      " fill="${color}" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

      <!-- Kangaroo Pocket -->
      <path d="
        M 100 195
        L 200 195
        L 214 260
        L 86 260
        Z
      " fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />

      <!-- Side Rib Panels -->
      <path d="M 78 112 L 92 115 L 92 280 L 78 280 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M 222 112 L 208 115 L 208 280 L 222 280 Z" fill="rgba(0,0,0,0.25)" />

      <!-- Bottom Ribbed Hem -->
      <rect x="78" y="278" width="144" height="14" fill="#10121a" stroke="rgba(255,255,255,0.15)" stroke-width="1" />

      <!-- Chest Print / Embroidery -->
      ${getArtistGraphics(artist)}
    </svg>
  `;
}

function renderJacketMockup(color, product, artist) {
  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <!-- Floor Shadow -->
      <ellipse cx="150" cy="305" rx="88" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- Body & Sleeves -->
      <path d="
        M 115 45
        L 60 70
        C 42 98, 32 145, 25 195
        L 56 204
        C 62 165, 72 135, 82 105
        L 82 285
        L 218 285
        L 218 105
        C 228 135, 238 165, 244 204
        L 275 195
        C 268 145, 258 98, 240 70
        L 185 45
        Z
      " fill="${color}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />

      <!-- Corduroy / Sherpa Collar -->
      <polygon points="115,45 85,82 135,82 148,50" fill="#2d1d15" stroke="#f59e0b" stroke-width="1.2" />
      <polygon points="185,45 215,82 165,82 152,50" fill="#2d1d15" stroke="#f59e0b" stroke-width="1.2" />

      <!-- Center Button Placket -->
      <rect x="144" y="52" width="12" height="233" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" />
      <!-- Brass Shank Buttons -->
      <circle cx="150" cy="72" r="3.5" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="150" cy="115" r="3.5" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="150" cy="160" r="3.5" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="150" cy="205" r="3.5" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="150" cy="250" r="3.5" fill="#f59e0b" stroke="#333" stroke-width="0.8" />

      <!-- Flap Chest Pockets -->
      <rect x="96" y="105" width="40" height="38" rx="2" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.15)" />
      <polygon points="96,105 136,105 116,118" fill="#1b1d24" stroke="rgba(255,255,255,0.15)" />
      <circle cx="116" cy="114" r="2.5" fill="#f59e0b" />

      <rect x="164" y="105" width="40" height="38" rx="2" fill="rgba(0,0,0,0.22)" stroke="rgba(255,255,255,0.15)" />
      <polygon points="164,105 204,105 184,118" fill="#1b1d24" stroke="rgba(255,255,255,0.15)" />
      <circle cx="184" cy="114" r="2.5" fill="#f59e0b" />

      <!-- Artist Insignia on Back or Right Shoulder -->
      <g transform="translate(184, 185) scale(0.65)">
        ${getArtistGraphics(artist)}
      </g>
    </svg>
  `;
}

function renderHatMockup(color, product, artist) {
  const isBeanie = product.id.includes('beanie');
  if (isBeanie) {
    return `
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
        <ellipse cx="150" cy="285" rx="75" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />
        <!-- Beanie Crown -->
        <path d="
          M 75 220
          C 70 80, 230 80, 225 220
          Z
        " fill="${color}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        <!-- Ribbed Lines -->
        <line x1="100" y1="120" x2="100" y2="220" stroke="rgba(0,0,0,0.2)" stroke-width="2.5" />
        <line x1="125" y1="95" x2="125" y2="220" stroke="rgba(0,0,0,0.2)" stroke-width="2.5" />
        <line x1="150" y1="85" x2="150" y2="220" stroke="rgba(0,0,0,0.2)" stroke-width="2.5" />
        <line x1="175" y1="95" x2="175" y2="220" stroke="rgba(0,0,0,0.2)" stroke-width="2.5" />
        <line x1="200" y1="120" x2="200" y2="220" stroke="rgba(0,0,0,0.2)" stroke-width="2.5" />
        <!-- Fold-over Cuff -->
        <rect x="70" y="200" width="160" height="55" rx="8" fill="${color}" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
        <!-- Leather Patch -->
        <rect x="132" y="212" width="36" height="32" rx="3" fill="#8b5a2b" stroke="#5c3818" stroke-width="1.5" />
        <text x="150" y="226" font-family="'Syne', sans-serif" font-size="4.5" fill="#fdfbf7" font-weight="900" text-anchor="middle">THE PURPLE</text>
        <text x="150" y="234" font-family="'Space Mono', monospace" font-size="4" fill="#f59e0b" font-weight="700" text-anchor="middle">VIXON</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <ellipse cx="150" cy="275" rx="85" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- Structured Crown -->
      <path d="
        M 65 210
        C 65 95, 235 95, 235 210
        Z
      " fill="${color}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />

      <!-- Crown Seams -->
      <path d="M 150 95 L 150 210" stroke="rgba(0,0,0,0.3)" stroke-width="2" />
      <path d="M 150 95 Q 110 135 75 200" stroke="rgba(0,0,0,0.25)" stroke-width="2" />
      <path d="M 150 95 Q 190 135 225 200" stroke="rgba(0,0,0,0.25)" stroke-width="2" />

      <!-- Top Squatchee (Button) -->
      <circle cx="150" cy="94" r="5" fill="#1b1c20" stroke="#f59e0b" stroke-width="1" />

      <!-- Front 3D Embroidery Crest -->
      <rect x="115" y="130" width="70" height="48" rx="6" fill="#14161c" stroke="#f59e0b" stroke-width="1.5" />
      <g transform="translate(150, 154) scale(0.65)">
        ${getArtistGraphics(artist)}
      </g>

      <!-- Visor / Bill -->
      <path d="
        M 50 210
        C 50 250, 250 250, 250 210
        C 230 225, 70 225, 50 210
        Z
      " fill="#1a1c22" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />

      <!-- Visor Stitching Arcs -->
      <path d="M 68 217 C 85 235, 215 235, 232 217" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" fill="none" stroke-dasharray="3 3" />
      <path d="M 80 224 C 100 240, 200 240, 220 224" stroke="rgba(255,255,255,0.2)" stroke-width="1.2" fill="none" stroke-dasharray="3 3" />
    </svg>
  `;
}

function renderVinylMockup(color, product, artist) {
  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <ellipse cx="150" cy="285" rx="95" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- Sliding 12" Vinyl Record (Protruding Right) -->
      <g transform="translate(175, 155)">
        <circle cx="0" cy="0" r="95" fill="#121316" stroke="#252830" stroke-width="1" />
        <!-- Grooves -->
        <circle cx="0" cy="0" r="86" fill="none" stroke="#22252c" stroke-width="1" stroke-dasharray="5 2" />
        <circle cx="0" cy="0" r="76" fill="none" stroke="#1d2026" stroke-width="1.2" />
        <circle cx="0" cy="0" r="66" fill="none" stroke="#22252c" stroke-width="1" stroke-dasharray="4 2" />
        <circle cx="0" cy="0" r="56" fill="none" stroke="#1d2026" stroke-width="1" />
        <circle cx="0" cy="0" r="46" fill="none" stroke="#22252c" stroke-width="1.2" />
        <!-- Smoke Marble Spec -->
        <path d="M-60 -40 Q0 0 60 40 Q30 -40 -60 -40 Z" fill="${color}" opacity="0.35" />
        <!-- Vinyl Light Sheen (Specular Highlight) -->
        <polygon points="-80,-40 80,40 60,70 -60,-10" fill="rgba(255,255,255,0.06)" />
        <!-- Center Label -->
        <circle cx="0" cy="0" r="32" fill="#090a0f" stroke="#f59e0b" stroke-width="1.5" />
        <text x="0" y="-8" font-family="'Syne', sans-serif" font-size="5" fill="#00f2fe" font-weight="900" text-anchor="middle">TRUCKIN ALL DAY</text>
        <text x="0" y="0" font-family="'Space Mono', monospace" font-size="4" fill="#f59e0b" text-anchor="middle">33 1/3 RPM</text>
        <text x="0" y="8" font-family="'Inter', sans-serif" font-size="3.5" fill="#ffffff" text-anchor="middle">SIDE A // 180G</text>
        <!-- Spindle Hole -->
        <circle cx="0" cy="0" r="3.5" fill="#f3f4f6" />
      </g>

      <!-- Gatefold Jacket Sleeve (Left Aligned) -->
      <g transform="translate(35, 60)">
        <rect x="0" y="0" width="180" height="190" rx="4" fill="#0c0e15" stroke="#f59e0b" stroke-width="1.5" />
        <!-- Metallic Foil Perimeter Border -->
        <rect x="8" y="8" width="164" height="174" rx="2" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1" />

        <!-- Artwork inside jacket -->
        <g transform="translate(90, 85) scale(0.9)">
          ${getArtistGraphics(artist)}
        </g>

        <!-- Spine Detail -->
        <rect x="0" y="0" width="6" height="190" fill="#1b1e28" />
        <text x="90" y="165" font-family="'Space Mono', monospace" font-size="5" fill="#00f2fe" font-weight="700" letter-spacing="1.5" text-anchor="middle">AUDIOPHILE DELUXE LP</text>
      </g>
    </svg>
  `;
}

function renderMugMockup(color, product, artist) {
  const isTumbler = product.id.includes('tumbler');
  if (isTumbler) {
    return `
      <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
        <ellipse cx="150" cy="285" rx="50" ry="10" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

        <!-- Tumbler Body -->
        <polygon points="115,70 185,70 175,270 125,270" fill="${color}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" />
        <!-- Steel Rim Bottom -->
        <polygon points="125,260 175,260 175,270 125,270" fill="#d1d5db" />
        <!-- Acrylic Lid -->
        <rect x="110" y="58" width="80" height="14" rx="3" fill="#374151" stroke="#00f2fe" stroke-width="1" />
        <rect x="135" y="52" width="30" height="8" rx="2" fill="#111827" />

        <!-- Laser Etched Graphic -->
        <g transform="translate(150, 165) scale(0.6)">
          ${getArtistGraphics(artist)}
        </g>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <ellipse cx="140" cy="275" rx="65" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- Handle -->
      <path d="M 185 115 C 235 115, 235 225, 185 225" fill="none" stroke="${color}" stroke-width="18" stroke-linecap="round" />
      <path d="M 185 115 C 235 115, 235 225, 185 225" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="8" stroke-linecap="round" />

      <!-- Mug Body -->
      <rect x="75" y="90" width="125" height="165" rx="10" fill="${color}" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
      <!-- Enamel Speckles -->
      <circle cx="95" cy="110" r="1.5" fill="#dedcd4" opacity="0.7" />
      <circle cx="120" cy="140" r="1" fill="#dedcd4" opacity="0.8" />
      <circle cx="85" cy="180" r="1.5" fill="#dedcd4" opacity="0.7" />
      <circle cx="170" cy="210" r="1" fill="#dedcd4" opacity="0.6" />
      <circle cx="150" cy="120" r="1.5" fill="#dedcd4" opacity="0.7" />
      <circle cx="180" cy="160" r="1" fill="#dedcd4" opacity="0.8" />

      <!-- Stainless Steel Rolled Rim -->
      <ellipse cx="137.5" cy="90" rx="62.5" ry="10" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1.5" />
      <ellipse cx="137.5" cy="90" rx="54" ry="7" fill="#1f2937" />

      <!-- Graphic -->
      <g transform="translate(137.5, 170) scale(0.6)">
        ${getArtistGraphics(artist)}
      </g>
    </svg>
  `;
}

function renderPinMockup(color, product, artist) {
  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <ellipse cx="150" cy="285" rx="80" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- 400 GSM Backing Card -->
      <rect x="70" y="45" width="160" height="230" rx="8" fill="#121319" stroke="#f59e0b" stroke-width="1.5" />
      <rect x="78" y="53" width="144" height="214" rx="4" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      <circle cx="150" cy="62" r="4" fill="#090a0f" stroke="#9ca3af" stroke-width="1" />

      <text x="150" y="82" font-family="'Syne', sans-serif" font-size="6.5" fill="#f59e0b" font-weight="900" letter-spacing="1.5" text-anchor="middle">TRUCKIN ALL DAY</text>
      <text x="150" y="92" font-family="'Space Mono', monospace" font-size="4.5" fill="#00f2fe" letter-spacing="2" text-anchor="middle">COLLECTOR PIN SERIES</text>

      <!-- Die-Cast Solid Metal Pin -->
      <g transform="translate(150, 165)">
        <circle cx="0" cy="0" r="45" fill="#2d2214" stroke="#f59e0b" stroke-width="4" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.6))" />
        <circle cx="0" cy="0" r="38" fill="#16171d" stroke="#c59d5f" stroke-width="2" />
        ${getArtistGraphics(artist)}
      </g>

      <text x="150" y="248" font-family="'Space Mono', monospace" font-size="4.5" fill="#dedcd4" letter-spacing="1" text-anchor="middle">SOLID CAST BRASS // EDITION 1</text>
    </svg>
  `;
}

function renderBagMockup(color, product, artist) {
  return `
    <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" class="mockup-svg" aria-label="${product.name} Mockup">
      <ellipse cx="150" cy="295" rx="85" ry="12" fill="rgba(0,0,0,0.5)" filter="blur(4px)" />

      <!-- Webbing Straps -->
      <path d="M 105 130 C 105 30, 140 30, 140 130" fill="none" stroke="#2b2d35" stroke-width="12" stroke-linecap="square" />
      <path d="M 160 130 C 160 30, 195 30, 195 130" fill="none" stroke="#2b2d35" stroke-width="12" stroke-linecap="square" />

      <!-- Tote Bag Canvas Body -->
      <rect x="65" y="125" width="170" height="160" rx="4" fill="${color}" stroke="rgba(255,255,255,0.15)" stroke-width="2" />

      <!-- Brass Rivets on Straps -->
      <circle cx="105" cy="140" r="3" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="140" cy="140" r="3" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="160" cy="140" r="3" fill="#f59e0b" stroke="#333" stroke-width="0.8" />
      <circle cx="195" cy="140" r="3" fill="#f59e0b" stroke="#333" stroke-width="0.8" />

      <!-- Front Graphic Print -->
      <g transform="translate(150, 205) scale(0.7)">
        ${getArtistGraphics(artist)}
      </g>
    </svg>
  `;
}
