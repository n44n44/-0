// High-fidelity self-contained SVG image representations matching reference images
// Ensures instant, 100% reliable rendering without external network dependency

export const PRODUCT_IMAGES = {
  bag: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="%23f1ede6"/>
    <defs>
      <linearGradient id="straw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="%23d8b284"/>
        <stop offset="50%" stop-color="%23be9466"/>
        <stop offset="100%" stop-color="%23a0784d"/>
      </linearGradient>
      <linearGradient id="handle" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="%239c7144"/>
        <stop offset="100%" stop-color="%236b4b27"/>
      </linearGradient>
    </defs>
    <!-- Handle -->
    <path d="M150 140 C150 70 250 70 250 140" fill="none" stroke="url(%23handle)" stroke-width="14" stroke-linecap="round"/>
    <!-- Bag body -->
    <path d="M110 135 L290 135 L280 255 L120 255 Z" fill="url(%23straw)" stroke="%238a653c" stroke-width="3"/>
    <!-- Straw weave lines -->
    <line x1="115" y1="160" x2="285" y2="160" stroke="%23a67d51" stroke-width="2" stroke-dasharray="6,4"/>
    <line x1="118" y1="185" x2="282" y2="185" stroke="%23a67d51" stroke-width="2" stroke-dasharray="6,4"/>
    <line x1="120" y1="210" x2="280" y2="210" stroke="%23a67d51" stroke-width="2" stroke-dasharray="6,4"/>
    <line x1="122" y1="235" x2="278" y2="235" stroke="%23a67d51" stroke-width="2" stroke-dasharray="6,4"/>
    <!-- Traditional Embroidery Patch -->
    <rect x="145" y="170" width="110" height="65" rx="4" fill="%231e3a5f" stroke="%23d97706" stroke-width="2.5"/>
    <!-- Yemeni geometric stitches -->
    <path d="M155 200 L170 180 L185 200 L200 180 L215 200 L230 180 L245 200" fill="none" stroke="%23fbbf24" stroke-width="3" stroke-linecap="round"/>
    <path d="M155 220 L170 205 L185 220 L200 205 L215 220 L230 205 L245 220" fill="none" stroke="%2338bdf8" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="200" cy="195" r="4" fill="%23ef4444"/>
    <circle cx="170" cy="195" r="3.5" fill="%2310b981"/>
    <circle cx="230" cy="195" r="3.5" fill="%2310b981"/>
  </svg>`,

  burner: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="%231f242d"/>
    <defs>
      <linearGradient id="clay" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="%238c4c34"/>
        <stop offset="50%" stop-color="%23683421"/>
        <stop offset="100%" stop-color="%23431f13"/>
      </linearGradient>
      <radialGradient id="smoke" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="%23fef3c7" stop-opacity="0.9"/>
        <stop offset="40%" stop-color="%23d97706" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="%231f242d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Glowing incense smoke -->
    <circle cx="200" cy="90" r="50" fill="url(%23smoke)"/>
    <path d="M195 100 Q190 70 205 50 Q215 35 200 20" fill="none" stroke="%23ffffff" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    <path d="M205 105 Q220 75 210 55" fill="none" stroke="%23fef08a" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
    <!-- Burner top bowl -->
    <path d="M140 120 C140 120 170 145 200 145 C230 145 260 120 260 120 L245 165 L155 165 Z" fill="url(%23clay)" stroke="%23d97706" stroke-width="2.5"/>
    <!-- Traditional Yemeni Leather stitching -->
    <line x1="150" y1="135" x2="250" y2="135" stroke="%23fbbf24" stroke-width="2" stroke-dasharray="4,3"/>
    <line x1="155" y1="150" x2="245" y2="150" stroke="%23f59e0b" stroke-width="2" stroke-dasharray="4,3"/>
    <!-- Burner middle column -->
    <path d="M175 165 L170 210 L230 210 L225 165 Z" fill="%23522919" stroke="%238c4c34" stroke-width="2"/>
    <!-- Burner Base -->
    <path d="M150 210 L130 260 L270 260 L250 210 Z" fill="url(%23clay)" stroke="%23d97706" stroke-width="2.5"/>
    <rect x="135" y="248" width="130" height="10" rx="3" fill="%23d97706"/>
    <!-- Embers -->
    <circle cx="185" cy="128" r="5" fill="%23ef4444"/>
    <circle cx="200" cy="125" r="6" fill="%23f97316"/>
    <circle cx="215" cy="128" r="4.5" fill="%23fbbf24"/>
  </svg>`,

  candles: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="%23eef2f6"/>
    <!-- Candle 1: White Stone Textured Candle -->
    <rect x="105" y="130" width="55" height="110" rx="6" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/>
    <path d="M107 145 L158 145 M107 165 L158 165 M107 185 L158 185 M107 205 L158 205" stroke="%23e2e8f0" stroke-width="2"/>
    <line x1="132" y1="130" x2="132" y2="115" stroke="%23334155" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M132 115 Q127 100 132 90 Q137 100 132 115" fill="%23f59e0b"/>

    <!-- Candle 2 (Center): Amber Glass Jar with Wooden Lid -->
    <rect x="175" y="145" width="70" height="95" rx="5" fill="%23b45309" stroke="%2378350f" stroke-width="2.5"/>
    <rect x="183" y="165" width="54" height="40" rx="2" fill="%23fef3c7" stroke="%23d97706" stroke-width="1"/>
    <text x="210" y="185" font-size="7" font-weight="bold" fill="%2378350f" text-anchor="middle" font-family="sans-serif">GHAYM SPACE</text>
    <text x="210" y="196" font-size="6" fill="%2392400e" text-anchor="middle" font-family="sans-serif">LUBAN &amp; OUD</text>
    <!-- Flame -->
    <line x1="210" y1="145" x2="210" y2="130" stroke="%23334155" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M210 130 Q203 112 210 100 Q217 112 210 130" fill="%23f59e0b"/>
    <circle cx="210" cy="115" r="2.5" fill="%23fef08a"/>

    <!-- Candle 3 (Right): Short Cream Pillar & Wood Base -->
    <ellipse cx="285" cy="240" rx="35" ry="10" fill="%23d97706"/>
    <rect x="260" y="165" width="50" height="75" rx="4" fill="%23fffbeb" stroke="%23fde68a" stroke-width="2"/>
    <line x1="285" y1="165" x2="285" y2="152" stroke="%23334155" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M285 152 Q280 140 285 130 Q290 140 285 152" fill="%23f59e0b"/>
  </svg>`,

  concrete: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="%23f1f5f9"/>
    <!-- Minimalist Art Frame in Background -->
    <rect x="195" y="70" width="90" height="120" rx="3" fill="%23ffffff" stroke="%2394a3b8" stroke-width="3"/>
    <rect x="205" y="80" width="70" height="100" fill="%23f8fafc"/>
    <circle cx="240" cy="120" r="18" fill="%23334155"/>
    <path d="M225 155 Q240 130 255 155 Z" fill="%230284c7"/>

    <!-- Concrete Ribbed Sculptural Vase -->
    <path d="M125 140 C110 170 110 230 135 250 L170 250 C195 230 195 170 180 140 Z" fill="%23e2e8f0" stroke="%2394a3b8" stroke-width="3"/>
    <!-- Dried Pampas Grass -->
    <path d="M152 140 Q130 90 110 50" fill="none" stroke="%23b45309" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M152 140 Q150 80 145 40" fill="none" stroke="%23d97706" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M152 140 Q170 90 185 55" fill="none" stroke="%23b45309" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Concrete Dish / Tray -->
    <ellipse cx="152" cy="255" rx="55" ry="12" fill="%23cbd5e1" stroke="%2394a3b8" stroke-width="2"/>
    <!-- Golden Accent -->
    <path d="M135 220 Q152 235 170 220" fill="none" stroke="%23f59e0b" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  cake: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
    <rect width="400" height="300" fill="%23fff1f2"/>
    <defs>
      <linearGradient id="cakeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="%23f43f5e"/>
        <stop offset="100%" stop-color="%23be123c"/>
      </linearGradient>
    </defs>
    <!-- Cake Plate -->
    <ellipse cx="200" cy="245" rx="140" ry="25" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="3"/>
    <!-- Bottom Layer -->
    <path d="M100 170 C100 195 300 195 300 170 L300 220 C300 245 100 245 100 220 Z" fill="url(%23cakeGrad)"/>
    <ellipse cx="200" cy="170" rx="100" ry="20" fill="%23fda4af"/>
    <!-- Cream Drips -->
    <path d="M100 170 Q115 195 130 170 Q150 205 170 170 Q190 200 210 170 Q230 205 250 170 Q270 200 290 170 Q298 185 300 170" fill="none" stroke="%23fff" stroke-width="8" stroke-linecap="round"/>
    <!-- Top Layer -->
    <path d="M130 115 C130 135 270 135 270 115 L270 160 C270 180 130 180 130 160 Z" fill="%23881337"/>
    <ellipse cx="200" cy="115" rx="70" ry="16" fill="%23e11d48"/>
    <!-- Strawberries and Cherries on Top -->
    <circle cx="160" cy="105" r="10" fill="%23ef4444"/>
    <circle cx="200" cy="100" r="12" fill="%23ef4444"/>
    <circle cx="240" cy="105" r="10" fill="%23ef4444"/>
    <!-- Sparkles -->
    <text x="140" y="85" font-size="20">✨</text>
    <text x="250" y="85" font-size="20">🍓</text>
  </svg>`,
};

export const STORE_IMAGES = {
  // Store 1: متجر وردة الأناقة
  ghaymGiftsCover: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="500" height="250">
    <rect width="500" height="250" fill="%230f1d38"/>
    <defs>
      <radialGradient id="glowG" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="%230f1d38" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="250" cy="125" r="130" fill="url(%23glowG)"/>
    <!-- Luxury Golden Perfume Bottle -->
    <rect x="220" y="60" width="60" height="110" rx="8" fill="%23f59e0b" stroke="%23fef08a" stroke-width="2.5"/>
    <rect x="235" y="42" width="30" height="18" rx="2" fill="%23fbbf24"/>
    <rect x="228" y="90" width="44" height="40" rx="2" fill="%230f1d38" stroke="%23fef08a" stroke-width="1.5"/>
    <text x="250" y="112" font-size="8" font-weight="black" fill="%2338bdf8" text-anchor="middle" font-family="sans-serif">GHAYM</text>
  </svg>`,

  // Store 2: بخور وعطور المكلا
  mukallaIncenseCover: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="500" height="250">
    <rect width="500" height="250" fill="%231a1512"/>
    <defs>
      <radialGradient id="glowI" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="%23f59e0b" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="%231a1512" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="250" cy="120" r="140" fill="url(%23glowI)"/>
    <!-- Glowing Burner & Smoke -->
    <path d="M250 80 Q235 50 250 30" fill="none" stroke="%23fef3c7" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
    <path d="M210 130 C210 130 230 155 250 155 C270 155 290 130 290 130 L275 180 L225 180 Z" fill="%2378350f" stroke="%23fbbf24" stroke-width="2.5"/>
    <path d="M220 180 L205 215 L295 215 L280 180 Z" fill="%2392400e" stroke="%23fbbf24" stroke-width="2.5"/>
  </svg>`,

  // Store 3: بخور وعطور المكلا (الفرع الذهبي / JAZIZA)
  mukallaGoldCover: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="500" height="250">
    <rect width="500" height="250" fill="%23141f2d"/>
    <defs>
      <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="%23d97706" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="%23141f2d" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="250" cy="125" r="130" fill="url(%23glowGold)"/>
    <!-- Perfume Bottle with Rose Petals -->
    <rect x="220" y="70" width="60" height="95" rx="6" fill="%23fef3c7" stroke="%23d97706" stroke-width="2.5"/>
    <rect x="235" y="52" width="30" height="18" rx="2" fill="%23d97706"/>
    <!-- JAZIZA text -->
    <circle cx="250" cy="115" r="16" fill="%231e293b" stroke="%23fbbf24" stroke-width="1.5"/>
    <text x="250" y="118" font-size="6" font-weight="bold" fill="%23fbbf24" text-anchor="middle" font-family="sans-serif">JAZIZA</text>
  </svg>`,

  // Store 4: سمر المكلا
  samarMukallaCover: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="500" height="250">
    <rect width="500" height="250" fill="%232b1d28"/>
    <defs>
      <radialGradient id="glowS" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="%23db2777" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="%232b1d28" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="250" cy="125" r="140" fill="url(%23glowS)"/>
    <!-- Heritage Gift Box with Ribbon -->
    <rect x="200" y="75" width="100" height="95" rx="8" fill="%23fdf2f8" stroke="%23db2777" stroke-width="2.5"/>
    <line x1="250" y1="75" x2="250" y2="170" stroke="%23db2777" stroke-width="6"/>
    <line x1="200" y1="122" x2="300" y2="122" stroke="%23db2777" stroke-width="6"/>
    <!-- Ribbon Bow -->
    <circle cx="240" cy="70" r="10" fill="%23db2777"/>
    <circle cx="260" cy="70" r="10" fill="%23db2777"/>
    <circle cx="250" cy="72" r="5" fill="%23f43f5e"/>
  </svg>`,

  // Avatars
  burnerAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="%2378350f" stroke="%23fbbf24" stroke-width="3"/>
    <!-- Incense burner silhouette -->
    <path d="M30 45 C30 45 40 55 50 55 C60 55 70 45 70 45 L62 65 L38 65 Z" fill="%23fbbf24"/>
    <path d="M35 65 L30 80 L70 80 L65 65 Z" fill="%23f59e0b"/>
    <circle cx="50" cy="35" r="4" fill="%23fef08a"/>
  </svg>`,

  jazizaAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="%230f172a" stroke="%23d97706" stroke-width="3"/>
    <!-- Crown icon -->
    <path d="M35 50 L40 38 L50 45 L60 38 L65 50 Z" fill="%23fbbf24"/>
    <text x="50" y="66" font-size="11" font-weight="black" fill="%23fef08a" text-anchor="middle" font-family="sans-serif">JAZIZA</text>
  </svg>`,

  jazizaMaroonAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="48" fill="%23581c87" stroke="%23f472b6" stroke-width="3"/>
    <path d="M35 50 L40 38 L50 45 L60 38 L65 50 Z" fill="%23fbbf24"/>
    <text x="50" y="66" font-size="11" font-weight="black" fill="%23ffffff" text-anchor="middle" font-family="sans-serif">JAZIZA</text>
  </svg>`,
};
