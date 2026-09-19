/**
 * Store Product Catalog — Truckin all Day x The Purple Vixon
 * Sourced according to Fourthwall premium manufacturing and print-on-demand specs.
 * Creative concepts, poetic lore, and album artwork prompts crafted through an avant-garde creative director lens.
 */

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1.0, label: 'USD ($)' },
  CAD: { symbol: 'CA$', rate: 1.36, label: 'CAD (CA$)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP (£)' }
};

export const STORE_PRODUCTS = [
  // ── CLOCKWORK HARE (Steampunk / Electro-Rock) ───────────────────────────
  {
    id: "cwh-tee-gearrunner",
    name: "Clockwork Hare 'Gear Runner' Heavyweight Boxy Tee",
    artist: "CLOCKWORK HARE",
    artistId: "clockwork-hare",
    category: "apparel",
    price: 36.00,
    rating: 4.9,
    reviewsCount: 42,
    badge: "BESTSELLER",
    blankSpec: "Comfort Colors 1717 / 100% Ringspun Cotton (240 GSM)",
    printTechnique: "Direct-to-Garment 1200 DPI with Metallic Copper Accents",
    mockupType: "tee",
    colors: [
      { name: "Vintage Pepper", hex: "#2b2b2d", default: true },
      { name: "Patina Spruce", hex: "#223533" },
      { name: "Washed Sandstone", hex: "#d8cfc4" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true,
    stockCount: 85,
    tagline: "Mechanical cadence meets flesh and copper wire.",
    description: "Built from dense 240 GSM combed cotton with a softened garment wash. Features a high-gauge ribbed crew neck, twin-needle drop-shoulder construction, and our signature clockwork rabbit mechanical schematics rendered in weathered copper and cyan hues.",
    poeticConcept: "A study in clockwork velocity and nocturnal desire: two brass hearts ticking in frenzied synchronization against cool skin, where friction sparks along coiled gears and the open road unravels into a breathless mechanical waltz.",
    artDirectionPrompt: "Avant-garde editorial fashion still life: heavyweight washed pepper black cotton tee draped across industrial brass escapements, intricate copper-foil rabbit anatomy etched with filigree clock gears, cinematic mood lighting with warm tungsten and cool neon cyan rim lights.",
    specs: [
      "240 GSM (7.1 oz/yd²) ultra-heavyweight combed ringspun cotton",
      "Garment-dyed for vintage drape and zero shrinkage",
      "Eco-certified water-based ink formulation (OEKO-TEX Class 1)",
      "Double-stitched seamless collar and reinforced shoulder taping"
    ]
  },
  {
    id: "cwh-jacket-aether",
    name: "Clockwork Hare 'Aether-Crank' Sherpa Utility Jacket",
    artist: "CLOCKWORK HARE",
    artistId: "clockwork-hare",
    category: "outerwear",
    price: 118.00,
    rating: 5.0,
    reviewsCount: 28,
    badge: "CAPSULE DROP",
    blankSpec: "Heavy Duck Canvas (380 GSM) with Recycled Sherpa Lining",
    printTechnique: "3D High-Density Embroidery & Antiqued Brass Hardware",
    mockupType: "jacket",
    colors: [
      { name: "Dark Umber", hex: "#3b2a22", default: true },
      { name: "Obsidian Canvas", hex: "#1c1c1e" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 34,
    tagline: "Armored warmth for twilight railway crossings.",
    description: "Heavyweight 12 oz cotton duck canvas fortified with soft interior sherpa fleece. Custom stamped brass shanks, corduroy-faced collar, interior hidden chest pocket with embroidered song lyrics, and back-panel mechanical gear crest.",
    poeticConcept: "A tactile armor against mountain frost: thick canvas sheltering the furnace of the body, where rough denim and whispered confidences blur in the steam of a train depot at 3 A.M.",
    artDirectionPrompt: "High-fashion cinematic portrait: textured dark umber utility jacket with exposed burnished brass rivets and plush cream sherpa collar, standing in silhouette against billowing train steam and amber lantern glows.",
    specs: [
      "12 oz (380 GSM) 100% organic cotton duck canvas",
      "Plush 320 GSM recycled thermal sherpa lining throughout body",
      "Heavy-gauge antiqued brass shank buttons and zip closure",
      "Interior zip stash pocket with commemorative label patch"
    ]
  },
  {
    id: "cwh-pin-set",
    name: "Clockwork Hare Solid Cast Brass Lapel & Collar Pin Set",
    artist: "CLOCKWORK HARE",
    artistId: "clockwork-hare",
    category: "accessories",
    price: 22.00,
    rating: 4.8,
    reviewsCount: 31,
    badge: "COLLECTOR ITEM",
    blankSpec: "Cast Solid Brass with Dark Patina Wax Finish",
    printTechnique: "Die-Cast 3D Relief with Dual Rubber Clutches",
    mockupType: "pin",
    colors: [
      { name: "Antique Brass", hex: "#c59d5f", default: true }
    ],
    sizes: ["1.5\" Dual Pin Set"],
    inStock: true,
    stockCount: 110,
    tagline: "Solid metal insignias forged with mechanical precision.",
    description: "Pair of hand-finished brass lapel pins featuring the Clockwork Hare's iconic winged helicopter bunny and the interlocking interlocking clockwork cog talisman. Includes foil-stamped presentation card.",
    poeticConcept: "Small tokens of an unwritten vow: the cool weight of brass held between fingertips, an indelible keepsake of nights governed by rhythm and magnetic attraction.",
    artDirectionPrompt: "Macro jewelry editorial: sculpted brass lapel pins resting on weathered black saddle leather, deep shadowing showcasing high-relief gear teeth and polished bronze highlights.",
    specs: [
      "Solid zinc-brass alloy with hand-buffed dark antiquing",
      "Dual backing posts with heavy-duty anti-slip black clutches",
      "Packaged on matte black 400 GSM foil-stamped card"
    ]
  },

  // ── KEEP ON TRUCKIN' 24 7 (Outlaw Country / Southern Rock) ─────────────
  {
    id: "kot-tee-highway",
    name: "Keep on Truckin' 'Midnight Highway' Vintage Tour Tee",
    artist: "Keep on Truckin' 24 7",
    artistId: "keep-on-truckin",
    category: "apparel",
    price: 38.00,
    rating: 5.0,
    reviewsCount: 56,
    badge: "TOP HEADLINER",
    blankSpec: "Cotton Heritage / 100% Combed Heavy Cotton (250 GSM)",
    printTechnique: "Distressed Cracked Puff Screenprint with Soft Hand",
    mockupType: "tee",
    colors: [
      { name: "Washed Black", hex: "#222224", default: true },
      { name: "Asphalt Grey", hex: "#3e4249" },
      { name: "Desert Bone", hex: "#dfdcd3" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
    inStock: true,
    stockCount: 120,
    tagline: "Eighteen wheels hum a southern rock lullaby through the midnight divide.",
    description: "Custom oversized drop-shoulder boxy tee made with 250 GSM yarn. Depicts the iconic Kenworth chrome grille erupting into roaring celestial flames, framed with the official 24 7 interstate crest.",
    poeticConcept: "The hypnotic hum of asphalt under tires: two souls entwined in the cab of an eighteen-wheeler, chasing white lines and electric dreams across endless prairie darkness where freedom is tasted in every heavy breath.",
    artDirectionPrompt: "Vintage 1970s rock poster aesthetic: oversized washed charcoal tee against a stormy prairie horizon, dramatic cracked off-white screenprint showing a chrome semi-truck under a blood-orange moon.",
    specs: [
      "250 GSM heavy combed ringspun cotton with enzyme stone wash",
      "Thick 1.25\" ribbed collar with reinforced double-needle coverstitch",
      "Cracked vintage ink hand-feel that softens with every wash",
      "Pre-shrunk to retain boxy silhouette after tumble drying"
    ]
  },
  {
    id: "kot-hoodie-terry",
    name: "Keep on Truckin' 420 GSM Reverse-Weave Heavyweight Hoodie",
    artist: "Keep on Truckin' 24 7",
    artistId: "keep-on-truckin",
    category: "outerwear",
    price: 84.00,
    rating: 4.9,
    reviewsCount: 64,
    badge: "ULTRA FLEECE",
    blankSpec: "420 GSM Organic French Terry Fleece with Side Rib Panels",
    printTechnique: "Direct-to-Garment Back Piece & Embroidered Chest Emblem",
    mockupType: "hoodie",
    colors: [
      { name: "Midnight Charcoal", hex: "#1a1c23", default: true },
      { name: "Tobacco Brown", hex: "#422e23" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true,
    stockCount: 72,
    tagline: "Heavy gauge warmth for cold mountain highway summits.",
    description: "Constructed with cross-grain cut French terry fleece to resist vertical shrinkage. Features double-ribbed side gussets for freedom of movement, a double-layered structured hood with no drawstrings, and a kangaroo pouch pocket.",
    poeticConcept: "Surrendering to the quiet gravity of a roadside sanctuary: pulled into a fleece embrace as rain lashes the windshield, hands meeting in the shadows of the sleeper cab while the CB radio murmurs distant frequencies.",
    artDirectionPrompt: "Studio lookbook flat lay: heavyweight 420 GSM charcoal terry hoodie with thick ribbed side gussets, crisp embroidered chrome truck emblem on left chest, deep fabric folds and tactile brushed texture.",
    specs: [
      "420 GSM cross-grain French terry (80% organic cotton, 20% poly fleece)",
      "Structured 2-piece seamless hood lined with matching jersey",
      "Side rib expansion panels for athletic drape and maximum flexibility",
      "Heavyweight 2x2 ribbed cuffs and hem with spandex memory"
    ]
  },
  {
    id: "kot-cap-oilskin",
    name: "Keep on Truckin' Distressed Waxed Canvas Trucker Cap",
    artist: "Keep on Truckin' 24 7",
    artistId: "keep-on-truckin",
    category: "headwear",
    price: 28.00,
    rating: 4.8,
    reviewsCount: 39,
    badge: "ESSENTIAL",
    blankSpec: "Structured 6-Panel Waxed Cotton Canvas with Mesh Back",
    printTechnique: "Sculpted 3D Matte Embroidery & Antiqued Buckle",
    mockupType: "hat",
    colors: [
      { name: "Waxed Tobacco / Tan", hex: "#4b3a2a", default: true },
      { name: "Oilskin Black / Smoke", hex: "#232325" }
    ],
    sizes: ["One Size Fits Most (Adjustable)"],
    inStock: true,
    stockCount: 95,
    tagline: "Weathered by thousands of miles of wind and road glare.",
    description: "Structured medium-crown trucker silhouette cut from authentic water-resistant waxed cotton canvas paired with breathable cooling mesh. Finished with raised matte embroidery of the 24 7 highway emblem.",
    poeticConcept: "The weathered brim shielding tired eyes from dawn's golden intrusion, a faithful talisman through storm-swept mountain passes and bittersweet farewells on gravel shoulders.",
    artDirectionPrompt: "Rugged product photography: distressed waxed canvas trucker hat resting on an aged wood highway mile-marker, morning dew droplets clinging to the waxed bill and detailed threadwork.",
    specs: [
      "100% water-resistant paraffin-waxed cotton front panels",
      "Heavy breathable poly-mesh rear panels",
      "Custom embossed brass sliding buckle with tuck-in leather strap",
      "Moisture-wicking interior sweatband"
    ]
  },
  {
    id: "kot-vinyl-deluxe",
    name: "Keep on Truckin' 24 7 — 'Midnight Haul' 180g Audiophile Vinyl LP",
    artist: "Keep on Truckin' 24 7",
    artistId: "keep-on-truckin",
    category: "vinyl",
    price: 36.00,
    rating: 5.0,
    reviewsCount: 47,
    badge: "180G VINYL",
    blankSpec: "Deluxe 180-Gram Heavyweight Smoke-Marbled Analog Vinyl",
    printTechnique: "High-Foil Gatefold Jacket with Full-Color Inner Lyric Sleeve",
    mockupType: "vinyl",
    colors: [
      { name: "Smoke Marble Wax", hex: "#3a3c42", default: true }
    ],
    sizes: ["12\" 33 RPM LP"],
    inStock: true,
    stockCount: 65,
    tagline: "Analog warmth mastered directly from half-inch studio tapes.",
    description: "Pressed at 33 1/3 RPM on 180-gram smoke and silver marbled vinyl. Includes deluxe heavyweight 350 GSM gatefold jacket with metallic silver foil detailing, 12-page panoramic photo booklet, and instant 24-bit lossless digital audio download.",
    poeticConcept: "The tender needle drops into virgin vinyl grooves: raw acoustic twang swelling into a thunderous chorus of desire, echoing through smoky roadhouses and quiet bedrooms where lovers lean into the static.",
    artDirectionPrompt: "Audiophile vinyl showcase: translucent smoke-swirled 12-inch vinyl record partially slid out of an opulent foil-embossed gatefold sleeve, turntable tonearm hovering above the run-in groove under sultry rim lighting.",
    specs: [
      "180-gram virgin audiophile compound pressed in Europe",
      "Mastered specifically for analog cutting by senior lathe engineers",
      "Foil-embossed heavy 350 GSM board gatefold with matte lamination",
      "Includes antistatic poly-lined inner sleeve and 24-bit WAV download card"
    ]
  },

  // ── IRON STALLION MINING MUSIC (Heavy Industrial / Roots Metal) ──────────
  {
    id: "ism-shirt-acid",
    name: "Iron Stallion 'Deep-Shaft' Acid-Washed Canvas Overshirt",
    artist: "Iron Stallion Mining Music",
    artistId: "iron-stallion",
    category: "outerwear",
    price: 88.00,
    rating: 4.9,
    reviewsCount: 38,
    badge: "HEAVY ROOTS",
    blankSpec: "10 oz Heavyweight Duck Canvas with Mineral Acid Wash",
    printTechnique: "Laser-Distressed Chest Graphics & Gunmetal Fasteners",
    mockupType: "jacket",
    colors: [
      { name: "Slag Grey", hex: "#32353a", default: true },
      { name: "Raw Iron", hex: "#1e2126" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true,
    stockCount: 45,
    tagline: "Subterranean durability hammered out in raw iron and canvas.",
    description: "Built for brutal conditions: 10 oz rigid canvas treated with an artisan mineral wash that gives each overshirt a unique slate patina. Reinforced dual-layer elbows, gusseted chest pockets, and matte gunmetal snap closures.",
    poeticConcept: "A testament to unbreakable devotion: forged in the crushing pressure of deep shafts, where sweat glistens like liquid ore and passion burns hotter than a subterranean forge.",
    artDirectionPrompt: "Industrial workwear editorial: mineral-washed slag grey canvas overshirt hanging from a cast-iron pulley hook against a wall of weathered black coal and quartz veins, harsh tungsten directional light.",
    specs: [
      "10 oz (340 GSM) 100% industrial-grade cotton canvas",
      "Hand-finished mineral acid wash creating one-of-a-kind marbling",
      "Reinforced bartack stitching at all high-stress anchor points",
      "Triple-needle flat-felled seam construction throughout"
    ]
  },
  {
    id: "ism-cap-snapback",
    name: "Iron Stallion Deep-Shaft Heavy Structured Snapback",
    artist: "Iron Stallion Mining Music",
    artistId: "iron-stallion",
    category: "headwear",
    price: 26.00,
    rating: 4.8,
    reviewsCount: 44,
    badge: "YUPOONG 6606",
    blankSpec: "Yupoong Classics Structured Premium Twill / Mesh",
    printTechnique: "3D Gunmetal Puff Embroidery with Metallic Underbill Print",
    mockupType: "hat",
    colors: [
      { name: "Matte Charcoal / Slate", hex: "#2c2e35", default: true },
      { name: "Pitch Black", hex: "#141518" }
    ],
    sizes: ["One Size Fits Most"],
    inStock: true,
    stockCount: 110,
    tagline: "Subterranean crest with high-relief matte embroidery.",
    description: "The official headwear of subterranean roots metal. Features high-profile structured crown, flat visor with green underneath or custom pickaxe blueprint print, and raised 3D puff embroidery that stands out under harsh light.",
    poeticConcept: "A resolute silhouette against cavern darkness: standing unyielding amid the tremor of underground stone, bound to a love that cuts deeper than mining drills.",
    artDirectionPrompt: "Close-up apparel catalog shot: charcoal structured snapback resting on a block of raw pyrite and iron ore, crisp gunmetal 3D thread embroidery illuminated with precision studio rim lights.",
    specs: [
      "Premium Yupoong 6606 retro trucker foundation",
      "High-profile structured front panel with firm buckram backing",
      "High-density 3D puff embroidery with over 18,000 stitches",
      "Classic matching 7-hole snap plastic adjustment band"
    ]
  },
  {
    id: "ism-opener-steel",
    name: "Iron Stallion Forged Steel Mining Rail Bottle Opener",
    artist: "Iron Stallion Mining Music",
    artistId: "iron-stallion",
    category: "accessories",
    price: 20.00,
    rating: 5.0,
    reviewsCount: 52,
    badge: "SOLID STEEL",
    blankSpec: "Hand-Forged High-Carbon Steel with Beeswax Blackout Finish",
    printTechnique: "Hot-Stamped Artist Hallmark & Braided Leather Lanyard",
    mockupType: "accessories",
    colors: [
      { name: "Forged Carbon", hex: "#2b2c30", default: true }
    ],
    sizes: ["6.5\" Heavyweight Tool"],
    inStock: true,
    stockCount: 80,
    tagline: "Cut from reclaimed rail steel with serious leverage.",
    description: "Heavy solid forged tool steel inspired by historic rail spikes and mine shaft track ties. Heat-treated and sealed with a traditional blacksmith hot beeswax finish to prevent oxidation while maintaining raw textured grip.",
    poeticConcept: "Raw, unyielding, and honest: a tool built for calloused hands and celebrations won after backbreaking toil, opening the night to uninhibited laughter and intimate whispers.",
    artDirectionPrompt: "Dark moody craft still life: hand-forged steel bottle opener with hand-hammered facets on reclaimed dark timber, dark leather loop neatly coiled, subtle glistening highlights.",
    specs: [
      "Solid high-carbon tool steel weighing over 10 oz",
      "Traditional hot-forged anvil finish sealed with natural beeswax",
      "Hot-stamped Iron Stallion anvil insignia with unique hammer marks",
      "Includes full-grain hand-dyed saddle leather hanging cord"
    ]
  },

  // ── HARLAN ECHO (Appalachian Noir / Dark Americana) ─────────────────────
  {
    id: "he-thermal-hollow",
    name: "Harlan Echo 'Misty Mountain' Heavy Waffle Thermal",
    artist: "Harlan Echo",
    artistId: "harlan-echo",
    category: "apparel",
    price: 48.00,
    rating: 4.9,
    reviewsCount: 33,
    badge: "NOIR CLASSIC",
    blankSpec: "100% Combed Cotton Heavy Waffle Knit (280 GSM)",
    printTechnique: "Tonal Breast Embroidery & Distressed Back Hollow Print",
    mockupType: "tee",
    colors: [
      { name: "Spruce Pine", hex: "#253b34", default: true },
      { name: "Charcoal Heather", hex: "#313338" },
      { name: "Bone White", hex: "#dedcd4" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 58,
    tagline: "Haunting warmth woven for cold mountain ridges and quiet confessions.",
    description: "Thick 280 GSM honeycomb waffle knit offering breathability and thermal heat retention. Features wide flat-lock seams, extended ribbed cuffs that stay in place, and a weathered vintage wash that drapes naturally.",
    poeticConcept: "Wrapped in the quiet mist of the hollows: soft textured cotton against bare skin, the scent of woodsmoke lingering in the weave, sharing warmth on a porch while rain falls through the hemlocks.",
    artDirectionPrompt: "Atmospheric fashion editorial: deep spruce green heavy waffle thermal folded on an antique cedar chest, misty Appalachian pine forest visible through an open cabin window in background.",
    specs: [
      "280 GSM heavy textured honeycomb waffle knit cotton",
      "Enzyme silicone washed for an ultra-soft vintage touch",
      "Wide 3\" heavy ribbed cuffs engineered for sleeve-rolling",
      "Flat-lock anti-chafing seam construction for layering comfort"
    ]
  },
  {
    id: "he-vinyl-ghostpines",
    name: "Harlan Echo — 'Ghost Pines & Coal Hollows' 180g Vinyl LP",
    artist: "Harlan Echo",
    artistId: "harlan-echo",
    category: "vinyl",
    price: 36.00,
    rating: 5.0,
    reviewsCount: 49,
    badge: "LIMITED PRESS",
    blankSpec: "180g Forest Green & Smoke Swirl Audiophile Vinyl",
    printTechnique: "Velvet Matte Gatefold with Silver Foil Lettering",
    mockupType: "vinyl",
    colors: [
      { name: "Spruce Smoke Swirl", hex: "#1f332c", default: true }
    ],
    sizes: ["12\" 33 RPM LP"],
    inStock: true,
    stockCount: 40,
    tagline: "Haunting Appalachian acoustic ballads pressed with pristine dynamic range.",
    description: "The acclaimed debut album in its purest physical format. Cut at 45 RPM across two 180-gram discs for unmatched transient response and acoustic intimacy. Features foil-stamped gatefold with archival photo inserts.",
    poeticConcept: "Lonesome strings vibrating in the quiet chamber of the chest: a dark romance written in minor chords, whispering of promises kept in secret mountain caves and hearts that ache with tender devotion.",
    artDirectionPrompt: "Artisan record unboxing photography: marbled deep emerald vinyl record catching studio softbox reflections, textured matte black sleeve with embossed silver foil typography and acoustic guitar strings.",
    specs: [
      "Strictly limited to 500 hand-numbered worldwide copies",
      "Audiophile 180g pressing at Optimal Media (Germany)",
      "350 GSM soft-touch matte velvet jacket with debossed lyric title",
      "Includes 16-page large format photo monograph and download card"
    ]
  },
  {
    id: "he-mug-campfire",
    name: "Harlan Echo Lonesome Hollow Campfire Speckled Mug",
    artist: "Harlan Echo",
    artistId: "harlan-echo",
    category: "accessories",
    price: 18.00,
    rating: 4.8,
    reviewsCount: 41,
    badge: "ESSENTIAL",
    blankSpec: "Heavy Carbon Steel with Double-Dipped Ceramic Enamel (16 oz)",
    printTechnique: "Kiln-Fired 360-Degree Vitrified Enamel Print",
    mockupType: "mug",
    colors: [
      { name: "Forest Pine Speckle", hex: "#2d443e", default: true },
      { name: "Charcoal Speckle", hex: "#32353a" }
    ],
    sizes: ["16 oz (475 ml)"],
    inStock: true,
    stockCount: 140,
    tagline: "Campfire-ready steel mug designed to withstand wilderness embers.",
    description: "Durable steel mug dipped in thick vitrified enamel with an artisan dark green speckled finish and a smooth stainless steel rim. Tested over open campfires and dishwasher safe.",
    poeticConcept: "Holding warm coffee between two pairs of hands in the first chill of dawn: quiet glances exchanged over the steaming rim, where silence speaks more than words ever could.",
    artDirectionPrompt: "Rustic morning still life: dark forest green speckled enamel mug steaming with black coffee, resting on mossy bark beside an acoustic guitar, golden sunlight breaking through fog.",
    specs: [
      "Double-coated heavy gauge carbon steel with vitrified enamel glaze",
      "Smooth rolled stainless steel drinking lip for comfortable sipping",
      "100% campfire, stovetop, and dishwasher safe (BPA-free & lead-free)",
      "Permanent kiln-baked graphic that never fades or peels"
    ]
  },

  // ── SUBZERO PULSEWAVEZ (Cyber Synthwave / Neon Retrowave) ───────────────
  {
    id: "szp-jacket-neon120",
    name: "Subzero Pulsewavez 'Neon Highway 120' Reflective Windbreaker",
    artist: "Subzero Pulsewavez",
    artistId: "subzero-pulsewavez",
    category: "outerwear",
    price: 94.00,
    rating: 5.0,
    reviewsCount: 37,
    badge: "CYBER DROP",
    blankSpec: "Waterproof Ripstop Nylon with 3M Scotchlite Reflective Panels",
    printTechnique: "Sublimated Cyber Grid Lining & Luminescent Rubber Zip Pulls",
    mockupType: "jacket",
    colors: [
      { name: "Cyber Obsidian", hex: "#11131a", default: true },
      { name: "Glacier Silver", hex: "#7a889b" }
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 48,
    tagline: "Slicing through midnight rain at 120 MPH in pure neon armor.",
    description: "Featherweight yet totally wind- and rain-proof. Engineered with stealth black ripstop fabric that explodes into brilliant luminescent white under headlights thanks to micro-glass 3M reflective accents. Features waterproof aqua-guard zippers.",
    poeticConcept: "A nocturnal rush through rain-slicked city streets: heartbeats syncing with 120 BPM synth arpeggios, two bodies electric in the glow of dashboard dials, escaping the ordinary into neon eternity.",
    artDirectionPrompt: "Futuristic night street editorial: matte black technical windbreaker with illuminated holographic cyan wireframe stripes glowing under flashing streetlights, wet pavement reflecting magenta neon.",
    specs: [
      "High-density water-repellent ripstop nylon shell (DWR coated)",
      "Authentic 3M Scotchlite 550 candela reflective tape accents",
      "YKK Aquaguard waterproof reverse-coil front zipper with cyan teeth",
      "Concealed hood with bungee cord toggles and breathable mesh lining"
    ]
  },
  {
    id: "szp-tee-cyber",
    name: "Subzero Pulsewavez 'Nocturnal Highway' Neon Graphic Tee",
    artist: "Subzero Pulsewavez",
    artistId: "subzero-pulsewavez",
    category: "apparel",
    price: 35.00,
    rating: 4.9,
    reviewsCount: 51,
    badge: "NEON RETRO",
    blankSpec: "Bella+Canvas 3001 / 100% Airlume Combed Cotton (180 GSM)",
    printTechnique: "Ultra-Vivid Neon DTFx Digital Transfer with Soft Hand",
    mockupType: "tee",
    colors: [
      { name: "Midnight Black", hex: "#121316", default: true },
      { name: "Electric Indigo", hex: "#1e1e38" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true,
    stockCount: 90,
    tagline: "Luminescent vector wireframes and analog synthesizer waves.",
    description: "Soft ringspun combed cotton featuring our iconic vector interceptor supercar tearing through a perspective wireframe grid toward a low-slung neon grid sun. Formulated with high-pigment fluorescent inks that glow under blacklight.",
    poeticConcept: "The electric thrill of velocity and desire: synthwave basslines vibrating through the seats, hands touching under the neon twilight, an intoxicating dance of light and shadow.",
    artDirectionPrompt: "High-contrast synthwave lookbook: pitch-black t-shirt showcasing glowing magenta and cyan sports car graphic, bathed in chromatic aberration and nostalgic 1980s CRT monitor glow.",
    specs: [
      "100% Airlume combed and ringspun cotton (pre-shrunk)",
      "Fluorescent UV-reactive inks that pop under ambient blacklight",
      "Shoulder-to-shoulder taping with fitted bicep sleeves",
      "Tear-away neck label for friction-free comfort"
    ]
  },
  {
    id: "szp-tumbler-thermal",
    name: "Subzero Pulsewavez Insulated Cyber Tumbler (20 oz)",
    artist: "Subzero Pulsewavez",
    artistId: "subzero-pulsewavez",
    category: "accessories",
    price: 28.00,
    rating: 4.8,
    reviewsCount: 39,
    badge: "VACUUM STEEL",
    blankSpec: "18/8 Food-Grade Stainless Steel / Double-Wall Vacuum Insulated",
    printTechnique: "360-Degree Laser-Sintered Matte Obsidian with Neon Cyan Ring",
    mockupType: "mug",
    colors: [
      { name: "Matte Cyber Black", hex: "#161820", default: true }
    ],
    sizes: ["20 oz (600 ml)"],
    inStock: true,
    stockCount: 75,
    tagline: "Keeps drinks ice-cold for 24 hours or steaming hot for 8.",
    description: "Double-walled vacuum insulated tumbler crafted with pro-grade 18/8 stainless steel. Laser-etched with the Subzero audio waveform and retro perspective highway. Includes splash-proof sliding lid.",
    poeticConcept: "Unwavering refreshment on relentless nocturnal journeys: an anchor of cold clarity through heat-baked desert crossings, shared between wanderers chasing the horizon.",
    artDirectionPrompt: "High-tech studio photography: matte black vacuum tumbler with etched glowing cyan soundwave graphics, sitting on a glossy reflective surface surrounded by dry ice mist.",
    specs: [
      "Double-walled vacuum chamber keeps ice solid for 24+ hours",
      "18/8 food-grade kitchen stainless steel (never sweats or transfers taste)",
      "Splash-resistant magnetic sliding lid fits standard cupholders",
      "BPA-free, toxin-free, and top-rack dishwasher safe"
    ]
  },

  // ── THE PURPLE VIXON (Label Flagship / Exclusive Capsule) ───────────────
  {
    id: "tpv-hoodie-velvet",
    name: "The Purple Vixon Signature Velvet-Touch Luxury Hoodie",
    artist: "The Purple Vixon",
    artistId: "the-purple-vixon",
    category: "outerwear",
    price: 98.00,
    rating: 5.0,
    reviewsCount: 78,
    badge: "FLAGSHIP LUXURY",
    blankSpec: "450 GSM Ultra-Heavyweight Combed Fleece with Satin-Lined Hood",
    printTechnique: "Royal Purple Velvet Appliqué & High-Sheen Gold Embroidery",
    mockupType: "hoodie",
    colors: [
      { name: "Royal Noir Purple", hex: "#22132d", default: true },
      { name: "Pitch Onyx", hex: "#131317" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
    inStock: true,
    stockCount: 50,
    tagline: "The crown jewel of our creative store. Pure tactile luxury.",
    description: "The official flagship garment of The Purple Vixon store. Crafted from rare 450 GSM combed cotton fleece with an opulent purple satin interior hood lining. Features our signature fox-and-gears crest rendered in royal velvet appliqué with polished gold thread embroidery.",
    poeticConcept: "An intimate velvet cocoon: thick royal purple fleece yielding to tender touch, the sensation of brushed satin caressing the nape of the neck, an unapologetic tribute to sensuality, swagger, and nocturnal royalty.",
    artDirectionPrompt: "Haute couture editorial: deep royal purple velvet-appliqué hoodie draped over a sleek marble sculpture, illuminated by soft golden key light and violet fill, showing luscious fleece texture and gleaming satin hood interior.",
    specs: [
      "450 GSM (13.3 oz/yd²) custom-milled ultra-heavyweight combed fleece",
      "Signature silk-touch satin interior hood lining prevents hair friction",
      "Plush velvet appliqué chest lettering with metallic gold perimeter embroidery",
      "Heavyweight custom-molded gold aglets on flat braided cotton drawstrings"
    ]
  },
  {
    id: "tpv-tote-roadie",
    name: "The Purple Vixon Heavy Duck Canvas Roadie Tote",
    artist: "The Purple Vixon",
    artistId: "the-purple-vixon",
    category: "accessories",
    price: 32.00,
    rating: 4.9,
    reviewsCount: 35,
    badge: "HEAVY CANVAS",
    blankSpec: "16 oz (450 GSM) 100% Heavy Cotton Duck Canvas",
    printTechnique: "Double-Passed Soft Hand Plastisol Screenprint & Brass Rivets",
    mockupType: "bag",
    colors: [
      { name: "Vintage Natural", hex: "#e5ded4", default: true },
      { name: "Black Duck", hex: "#1f2024" }
    ],
    sizes: ["18\" x 15\" x 5\" Heavy Tote"],
    inStock: true,
    stockCount: 88,
    tagline: "Rugged tour tote built to hold vinyl records, tech, and road gear.",
    description: "Industrial strength 16 oz cotton duck tote bag with gusseted bottom tailored to fit up to thirty 12-inch vinyl records. Features reinforced cross-stitched handles with real brass reinforcing rivets and an interior zippered key pocket.",
    poeticConcept: "Carrying life's chosen artifacts: rare pressings, handwritten song lyrics, and secret mementos, held tight against the hip through bustling train terminals and backstage corridors.",
    artDirectionPrompt: "High-end lifestyle flat lay: 16 oz natural canvas roadie tote resting open on aged hardwood, several vinyl record jackets spilling gently out, brass rivets catching soft window light.",
    specs: [
      "16 oz military-grade natural cotton canvas with reinforced base",
      "Reinforced 26\" heavy webbing carry straps secured with solid brass rivets",
      "Internal zippered pocket (8\" x 8\") for phone, passport, and wallet security",
      "Reinforced boxed bottom accommodates full 12\" LP records upright"
    ]
  },
  {
    id: "tpv-beanie-ribbed",
    name: "The Purple Vixon 100% Merino Wool Ribbed Watch Cap",
    artist: "The Purple Vixon",
    artistId: "the-purple-vixon",
    category: "headwear",
    price: 34.00,
    rating: 4.9,
    reviewsCount: 46,
    badge: "100% MERINO",
    blankSpec: "Extra-Fine 100% Australian Merino Wool (7-Gauge Chunky Rib)",
    printTechnique: "Laser-Etched Full-Grain Leather Clamp Patch",
    mockupType: "hat",
    colors: [
      { name: "Heather Aubergine", hex: "#351e3c", default: true },
      { name: "Charcoal Slate", hex: "#282a30" },
      { name: "Golden Wheat", hex: "#c99a53" }
    ],
    sizes: ["One Size (Form-Fitting Stretch)"],
    inStock: true,
    stockCount: 65,
    tagline: "Natural climate control with butter-soft merino warmth.",
    description: "Knit from 100% natural extra-fine Merino wool fibers that regulate temperature and naturally repel moisture without itching. Fold-over cuff finished with an oil-waxed leather crest.",
    poeticConcept: "Soft warmth enveloping the temples as winter winds howl outside: pulling the brim down against the dark, finding comfort in quiet solitude and the memory of loving fingertips.",
    artDirectionPrompt: "Knitwear editorial: chunky heather aubergine merino wool beanie resting on a rustic wool blanket, soft warm backlighting highlighting the delicate natural yarn fibers and rich leather badge.",
    specs: [
      "100% extra-fine non-mulesed Australian Merino wool",
      "Breathable, itch-free, and naturally odor-resistant",
      "Chunky 7-gauge fisherman rib knit with adjustable cuff",
      "Full-grain hand-buffed leather fold-over clamp label"
    ]
  }
];

export const ARTISTS_CATALOG = [
  { id: "all", name: "All Artists", count: STORE_PRODUCTS.length },
  { id: "clockwork-hare", name: "CLOCKWORK HARE", count: 3, icon: "🐰⚙️", genre: "Steampunk / Electro-Rock" },
  { id: "keep-on-truckin", name: "Keep on Truckin' 24 7", count: 4, icon: "🚚🏗️", genre: "Outlaw Country / Southern Rock" },
  { id: "iron-stallion", name: "Iron Stallion Mining Music", count: 3, icon: "⛏️🚜", genre: "Heavy Industrial Roots" },
  { id: "harlan-echo", name: "Harlan Echo", count: 3, icon: "🌲🛻", genre: "Appalachian Noir" },
  { id: "subzero-pulsewavez", name: "Subzero Pulsewavez", count: 3, icon: "⚡🏎️", genre: "Cyber Synthwave" },
  { id: "the-purple-vixon", name: "The Purple Vixon", count: 3, icon: "🦊👑", genre: "Signature Label Drops" }
];

export const CATEGORIES_CATALOG = [
  { id: "all", name: "All Products" },
  { id: "apparel", name: "Apparel & Tees" },
  { id: "outerwear", name: "Hoodies & Jackets" },
  { id: "headwear", name: "Hats & Headwear" },
  { id: "vinyl", name: "Vinyl & Music" },
  { id: "accessories", name: "Accessories & Gear" }
];
