/**
 * data.js — Scientifically accurate planetary & solar data with full English & Kannada (ಕನ್ನಡ) support.
 */

const UI_TEXT = {
  en: {
    appTitle: "Solar System Explorer",
    appSubtitle: "3D Observatory & Planetary Environment Lab",
    langToggleBtn: "ಕನ್ನಡ",
    langBadge: "EN",
    compareBtn: "Compare Planets",
    resetViewBtn: "Solar Overview",
    loadingTitle: "Synthesizing Planetary Surfaces...",
    loadingSub: "Generating procedural terrains, atmospheres & rings",
    controls: {
      play: "Play",
      pause: "Pause",
      speed: "Orbit Speed",
      orbits: "Orbit Lines",
      labels: "Labels",
      selectPrompt: "Click any planet or the Sun to open Planet Lab"
    },
    stats: {
      distance: "Distance from Sun",
      diameter: "Diameter",
      dayLength: "Rotation (Day)",
      yearLength: "Orbit (Year)",
      axialTilt: "Axial Tilt",
      moons: "Known Moons"
    },
    lab: {
      close: "Close Lab",
      focusCamera: "Center Camera",
      tempTitle: "Temperature Check Meter",
      dayTemp: "Day",
      meanTemp: "Mean",
      nightTemp: "Night",
      sunDayLabel: "Active Corona",
      sunMeanLabel: "Photosphere",
      sunNightLabel: "Sunspots",
      waterFreeze: "0°C Water Freezes",
      waterBoil: "100°C Water Boils",
      leadMelt: "327°C Lead Melts",
      elementsTitle: "Elements & Chemical Composition",
      atmosphereSub: "Atmospheric Gases",
      interiorSub: "Core & Surface Elements",
      envTitle: "Environment & Weather Simulator",
      pressure: "Pressure vs Earth",
      windSpeed: "Peak Wind Speed",
      gravity: "Surface Gravity",
      surfaceType: "Structure / Surface",
      hazardsLabel: "Real Weather Hazards",
      calcTitle: "Weight & Survival Check",
      enterWeight: "Enter Weight on Earth (kg):",
      yourWeight: "Your Weight Here",
      forceNewtons: "Gravitational Force",
      survivalTime: "Unprotected Survival (No Spacesuit)",
      whyLabel: "Why?"
    },
    compare: {
      title: "Compare Worlds Side-by-Side",
      subtitle: "Analyze temperature extremes, atmospheric gases, core composition & human survival",
      bodyA: "First World",
      bodyB: "Second World",
      presets: "Quick Comparisons:",
      presetEarthVenus: "Earth vs Venus",
      presetEarthMars: "Earth vs Mars",
      presetGasGiants: "Jupiter vs Saturn",
      presetIceGiants: "Uranus vs Neptune",
      presetExtremes: "Mercury vs Neptune",
      tempSection: "Temperature Comparison (°C / °F)",
      elementsSection: "Atmospheric & Core Elements (%)",
      envSection: "Gravity, Pressure, Winds & Survival",
      metricLabel: "Parameter",
      weightFor: "Weight of",
      kgPerson: "kg Person"
    },
    units: {
      km: "km",
      au: "AU",
      mKm: "M km",
      bar: "bar",
      kmh: "km/h",
      ms2: "m/s²",
      kg: "kg",
      N: "N",
      earthRatio: "× Earth"
    }
  },
  kn: {
    appTitle: "ಸೌರಮಂಡಲ ಅನ್ವೇಷಕ",
    appSubtitle: "3D ವೀಕ್ಷಣಾಲಯ ಮತ್ತು ಗ್ರಹ ಪರಿಸರ ಪ್ರಯೋಗಾಲಯ",
    langToggleBtn: "English",
    langBadge: "ಕನ್ನಡ",
    compareBtn: "ಗ್ರಹಗಳ ಹೋಲಿಕೆ",
    resetViewBtn: "ಸಂಪೂರ್ಣ ಸೌರಮಂಡಲ",
    loadingTitle: "ಗ್ರಹಗಳ ಮೇಲ್ಮೈ ಸೃಷ್ಟಿಸಲಾಗುತ್ತಿದೆ...",
    loadingSub: "ಮೇಲ್ಮೈ ವಿನ್ಯಾಸ, ವಾಯುಮಂಡಲ ಮತ್ತು ಉಂಗುರಗಳನ್ನು ನಿರ್ಮಿಸಲಾಗುತ್ತಿದೆ",
    controls: {
      play: "ಚಲಿಸು",
      pause: "ನಿಲ್ಲಿಸು",
      speed: "ಕಕ್ಷೆಯ ವೇಗ",
      orbits: "ಕಕ್ಷಾ ರೇಖೆಗಳು",
      labels: "ಹೆಸರುಗಳು",
      selectPrompt: "ಗ್ರಹ ಪ್ರಯೋಗಾಲಯವನ್ನು ತೆರೆಯಲು ಯಾವುದೇ ಗ್ರಹ ಅಥವಾ ಸೂರ್ಯನನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ"
    },
    stats: {
      distance: "ಸೂರ್ಯನಿಂದ ದೂರ",
      diameter: "ವ್ಯಾಸ",
      dayLength: "ಭ್ರಮಣ ಅವಧಿ (ದಿನ)",
      yearLength: "ಪರಿಭ್ರಮಣ (ವರ್ಷ)",
      axialTilt: "ಅಕ್ಷೀಯ ವಾಲುವಿಕೆ",
      moons: "ಉಪಗ್ರಹಗಳು"
    },
    lab: {
      close: "ಮುಚ್ಚಿ",
      focusCamera: "ಕ್ಯಾಮೆರಾ ಕೇಂದ್ರೀಕರಿಸಿ",
      tempTitle: "ತಾಪಮಾನ ತಪಾಸಣೆ ಮಾಪಕ",
      dayTemp: "ಹಗಲು",
      meanTemp: "ಸರಾಸರಿ",
      nightTemp: "ರಾತ್ರಿ",
      sunDayLabel: "ಸಕ್ರಿಯ ಕರೋನಾ",
      sunMeanLabel: "ದ್ಯುತಿಗೋಳ (Photosphere)",
      sunNightLabel: "ಸೌರ ಕಲೆಗಳು",
      waterFreeze: "0°C ನೀರು ಹೆಪ್ಪುಗಟ್ಟುವಿಕೆ",
      waterBoil: "100°C ನೀರು ಕುದಿಯುವಿಕೆ",
      leadMelt: "327°C ಸೀಸ ಕರಗುವಿಕೆ",
      elementsTitle: "ಧಾತುಗಳು ಮತ್ತು ರಾಸಾಯನಿಕ ಸಂಯೋಜನೆ",
      atmosphereSub: "ವಾಯುಮಂಡಲದ ಅನಿಲಗಳು",
      interiorSub: "ಒಳಭಾಗ ಮತ್ತು ಮೇಲ್ಮೈ ಧಾತುಗಳು",
      envTitle: "ಪರಿಸರ ಮತ್ತು ಹವಾಮಾನ ಸಿಮ್ಯುಲೇಟರ್",
      pressure: "ಭೂಮಿಗೆ ಹೋಲಿಸಿದ ಒತ್ತಡ",
      windSpeed: "ಗರಿಷ್ಠ ಗಾಳಿಯ ವೇಗ",
      gravity: "ಮೇಲ್ಮೈ ಗುರುತ್ವಾಕರ್ಷಣೆ",
      surfaceType: "ರಚನೆ / ಮೇಲ್ಮೈ ವಿಧ",
      hazardsLabel: "ನೈಜ ಹವಾಮಾನ ಅಪಾಯಗಳು",
      calcTitle: "ತೂಕ ಮತ್ತು ಬದುಕುಳಿಯುವಿಕೆ ಪರೀಕ್ಷೆ",
      enterWeight: "ಭೂಮಿಯ ಮೇಲಿನ ನಿಮ್ಮ ತೂಕ ನಮೂದಿಸಿ (kg):",
      yourWeight: "ಇಲ್ಲಿ ನಿಮ್ಮ ತೂಕ",
      forceNewtons: "ಗುರುತ್ವ ಬಲ",
      survivalTime: "ರಕ್ಷಣಾ ಕವಚವಿಲ್ಲದೆ ಬದುಕುಳಿಯುವ ಸಮಯ",
      whyLabel: "ಕಾರಣವೇನು?"
    },
    compare: {
      title: "ಗ್ರಹಗಳ ಸಮಾನಾಂತರ ಹೋಲಿಕೆ",
      subtitle: "ತಾಪಮಾನ, ವಾಯುಮಂಡಲದ ಅನಿಲಗಳು, ಒಳಭಾಗದ ಧಾತುಗಳು ಮತ್ತು ಬದುಕುಳಿಯುವಿಕೆಯನ್ನು ಹೋಲಿಸಿ",
      bodyA: "ಮೊದಲ ಗ್ರಹ/ಕಾಯ",
      bodyB: "ಎರಡನೇ ಗ್ರಹ/ಕಾಯ",
      presets: "ತ್ವರಿತ ಹೋಲಿಕೆಗಳು:",
      presetEarthVenus: "ಭೂಮಿ vs ಶುಕ್ರ",
      presetEarthMars: "ಭೂಮಿ vs ಮಂಗಳ",
      presetGasGiants: "ಗುರು vs ಶನಿ",
      presetIceGiants: "ಯುರೇನಸ್ vs ನೆಪ್ಚೂನ್",
      presetExtremes: "ಬುಧ vs ನೆಪ್ಚೂನ್",
      tempSection: "ತಾಪಮಾನ ಹೋಲಿಕೆ (°C / °F)",
      elementsSection: "ವಾಯುಮಂಡಲ ಮತ್ತು ಒಳಭಾಗದ ಧಾತುಗಳು (%)",
      envSection: "ಗುರುತ್ವಾಕರ್ಷಣೆ, ಒತ್ತಡ, ಗಾಳಿ ಮತ್ತು ಬದುಕುಳಿಯುವಿಕೆ",
      metricLabel: "ಮಾನದಂಡ",
      weightFor: "ತೂಕ:",
      kgPerson: "kg ವ್ಯಕ್ತಿಗೆ"
    },
    units: {
      km: "ಕಿ.ಮೀ",
      au: "AU",
      mKm: "ಮಿಲಿಯನ್ ಕಿ.ಮೀ",
      bar: "ಬಾರ್",
      kmh: "ಕಿ.ಮೀ/ಗಂ",
      ms2: "ಮೀ/ಸೆ²",
      kg: "ಕೆಜಿ",
      N: "N",
      earthRatio: "× ಭೂಮಿ"
    }
  }
};

const ELEMENT_META = {
  H2: {
    formula: "H₂",
    color: "#38bdf8",
    en: "Hydrogen",
    kn: "ಜಲಜನಕ (Hydrogen)"
  },
  He: {
    formula: "He",
    color: "#fbbf24",
    en: "Helium",
    kn: "ಹೀಲಿಯಂ (Helium)"
  },
  CO2: {
    formula: "CO₂",
    color: "#fb923c",
    en: "Carbon Dioxide",
    kn: "ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ (CO₂)"
  },
  N2: {
    formula: "N₂",
    color: "#818cf8",
    en: "Nitrogen",
    kn: "ಸಾರಜನಕ (Nitrogen)"
  },
  O2: {
    formula: "O₂",
    color: "#34d399",
    en: "Oxygen",
    kn: "ಆಮ್ಲಜನಕ (Oxygen)"
  },
  CH4: {
    formula: "CH₄",
    color: "#22d3ee",
    en: "Methane",
    kn: "ಮೀಥೇನ್ (Methane)"
  },
  H2SO4: {
    formula: "H₂SO₄",
    color: "#eab308",
    en: "Sulfuric Acid Clouds",
    kn: "ಗಂಧಕಾಮ್ಲ ಮೋಡಗಳು (H₂SO₄)"
  },
  Ar: {
    formula: "Ar",
    color: "#c084fc",
    en: "Argon",
    kn: "ಆರ್ಗಾನ್ (Argon)"
  },
  Na: {
    formula: "Na",
    color: "#f472b6",
    en: "Sodium (Exosphere)",
    kn: "ಸೋಡಿಯಂ (ಬಹಿರ್ಮಂಡಲ)"
  },
  Heavy: {
    formula: "O/C/Fe",
    color: "#f87171",
    en: "Heavy Elements (O, C, Fe, Ne)",
    kn: "ಭಾರ ಧಾತುಗಳು (O, C, Fe, Ne)"
  },
  Iron: {
    formula: "Fe",
    color: "#94a3b8",
    en: "Iron / Nickel Core",
    kn: "ಕಬ್ಬಿಣ / ನಿಕಲ್ ತಿರುಳು"
  },
  Silicate: {
    formula: "SiO₂",
    color: "#d97706",
    en: "Silicate Rock",
    kn: "ಸಿಲಿಕೇಟ್ ಬಂಡೆ"
  },
  Ice: {
    formula: "H₂O/NH₃",
    color: "#67e8f9",
    en: "Water / Ammonia / Methane Ice",
    kn: "ನೀರು / ಅಮೋನಿಯಾ / ಮೀಥೇನ್ ಮಂಜುಗಡ್ಡೆ"
  },
  MetH2: {
    formula: "H⁺",
    color: "#60a5fa",
    en: "Liquid Metallic Hydrogen",
    kn: "ದ್ರವ ಲೋಹೀಯ ಜಲಜನಕ"
  },
  PlasmaH: {
    formula: "H⁺/He",
    color: "#fde047",
    en: "Ionized H/He Plasma",
    kn: "ಅಯಾನೀಕೃತ ಜಲಜನಕ/ಹೀಲಿಯಂ ಪ್ಲಾಸ್ಮಾ"
  }
};

const CELESTIAL_BODIES = [
  {
    id: "sun",
    isStar: true,
    accentColor: "#ff9d2e",
    visualRadius: 6.2,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.004,
    axialTiltDeg: 7.25,
    retrograde: false,
    atmosphere: null,
    name: { en: "Sun", kn: "ಸೂರ್ಯ" },
    category: { en: "G2V Yellow Dwarf Star", kn: "G2V ಹಳದಿ ಕುಬ್ಜ ನಕ್ಷತ್ರ" },
    stats: {
      distance: { en: "0 AU (System Center)", kn: "0 AU (ಸೌರಮಂಡಲ ಕೇಂದ್ರ)" },
      diameter: { en: "1,392,700 km (109× Earth)", kn: "1,392,700 ಕಿ.ಮೀ (109× ಭೂಮಿ)" },
      dayLength: { en: "25.05 Earth days (Equator)", kn: "25.05 ಭೂ ದಿನಗಳು (ಸಮಭಾಜಕ)" },
      yearLength: { en: "230M yrs (Galactic Orbit)", kn: "230 ಮಿಲಿಯನ್ ವರ್ಷ (ಕ್ಷೀರಪಥ)" },
      axialTilt: "7.25°",
      moons: "0 (8 Planets)"
    },
    diameterKm: 1392700,
    gravityMs2: 274.0,
    gravityEarth: 27.94,
    pressureBar: 0.086,
    pressureLabel: { en: "0.086 bar (Photosphere) / 250B bar (Core)", kn: "0.086 ಬಾರ್ (ದ್ಯುತಿಗೋಳ) / 250 ಬಿಲಿಯನ್ ಬಾರ್ (ತಿರುಳು)" },
    windSpeedKmh: 1440000,
    windLabel: { en: "1,440,000+ km/h (Solar Wind)", kn: "1,440,000+ ಕಿ.ಮೀ/ಗಂ (ಸೌರ ಮಾರುತ)" },
    surfaceType: { en: "Superheated Plasma (No Solid Surface)", kn: "ಅತಿ ಬಿಸಿ ಪ್ಲಾಸ್ಮಾ (ಘನ ಮೇಲ್ಮೈ ಇಲ್ಲ)" },
    temperature: {
      dayC: 1000000,
      meanC: 5500,
      nightC: 3800,
      customLabels: true,
      thermalCategory: "plasma",
      status: { en: "Thermonuclear Plasma Furnace", kn: "ಥರ್ಮೋನ್ಯೂಕ್ಲಿಯರ್ ಪ್ಲಾಸ್ಮಾ ಕುಲುಮೆ" },
      fact: {
        en: "The visible photosphere averages 5,500°C, cooler dark sunspots dip to 3,800°C, while the outer corona mysteriously soars past 1,000,000°C and the core burns at 15,000,000°C.",
        kn: "ಸೂರ್ಯನ ಗೋಚರ ದ್ಯುತಿಗೋಳವು ಸರಾಸರಿ 5,500°C ತಾಪಮಾನ ಹೊಂದಿದೆ. ತಂಪಾದ ಸೌರ ಕಲೆಗಳು 3,800°C ಗೆ ಇಳಿದರೆ, ಹೊರ ಕರೋನಾ 1,000,000°C ಗಿಂತ ಹೆಚ್ಚು ಮತ್ತು ತಿರುಳು 15,000,000°C ನಲ್ಲಿ ಉರಿಯುತ್ತದೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "H2", pct: 73.5 },
        { id: "He", pct: 24.9 },
        { id: "Heavy", pct: 1.6 }
      ],
      interior: [
        { id: "PlasmaH", pct: 98.4 },
        { id: "Heavy", pct: 1.6 }
      ],
      note: {
        en: "By mass, the Sun is ~73.5% hydrogen and ~24.9% helium; nuclear fusion in its core converts 600 million tons of hydrogen into helium every second.",
        kn: "ದ್ರವ್ಯರಾಶಿಯ ಪ್ರಕಾರ ಸೂರ್ಯನು ~73.5% ಜಲಜನಕ ಮತ್ತು ~24.9% ಹೀಲಿಯಂ ಹೊಂದಿದೆ; ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ 600 ಮಿಲಿಯನ್ ಟನ್ ಜಲಜನಕವು ಹೀಲಿಯಂ ಆಗಿ ಸಮ್ಮಿಳನಗೊಳ್ಳುತ್ತದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Extreme Gamma & UV Radiation", "Coronal Mass Ejections", "27.9g Crushing Gravity", "5,500°C Vaporizing Heat"],
        kn: ["ತೀವ್ರ ಗಾಮಾ ಮತ್ತು UV ವಿಕಿರಣ", "ಕರೋನಲ್ ಮಾಸ್ ಎಜೆಕ್ಷನ್", "27.9g ಅತಿಯಾದ ಗುರುತ್ವ", "5,500°C ಆವಿಯಾಗಿಸುವ ಶಾಖ"]
      },
      description: {
        en: "Not a solid planet but a massive magnetic sphere of ionized plasma. Powerful magnetic loops trigger solar flares and blast supersonic charged particles across the entire Solar System.",
        kn: "ಇದು ಘನ ಗ್ರಹವಲ್ಲ, ಅಯಾನೀಕೃತ ಪ್ಲಾಸ್ಮಾದ ಬೃಹತ್ ಕಾಂತೀಯ ಗೋಳವಾಗಿದೆ. ಶಕ್ತಿಶಾಲಿ ಕಾಂತೀಯ ಕುಣಿಕೆಗಳು ಸೌರ ಜ್ವಾಲೆಗಳನ್ನು ಮತ್ತು ಅತೀವೇಗದ ವಿದ್ಯುತ್ ಕಣಗಳನ್ನು ಸೌರಮಂಡಲದಾದ್ಯಂತ ಹರಡುತ್ತವೆ."
      }
    },
    survival: {
      severity: "instant",
      time: { en: "< 0.001 Seconds (Instant Vaporization)", kn: "< 0.001 ಸೆಕೆಂಡ್ (ತಕ್ಷಣ ಆವಿಯಾಗುವಿಕೆ)" },
      reason: {
        en: "Even thousands of kilometers before reaching the photosphere, intense thermal radiation vaporizes organic matter into plasma, while 27.9g gravity tears objects apart.",
        kn: "ದ್ಯುತಿಗೋಳವನ್ನು ತಲುಪುವ ಸಾವಿರಾರು ಕಿಲೋಮೀಟರ್ ಮೊದಲೇ ತೀವ್ರ ಉಷ್ಣ ವಿಕಿರಣವು ದೇಹವನ್ನು ತಕ್ಷಣ ಪ್ಲಾಸ್ಮಾವಾಗಿ ಆವಿಯಾಗಿಸುತ್ತದೆ ಮತ್ತು 27.9g ಗುರುತ್ವವು ಹರಿದು ಹಾಕುತ್ತದೆ."
      }
    }
  },
  {
    id: "mercury",
    isStar: false,
    accentColor: "#a8a29e",
    visualRadius: 0.72,
    orbitRadius: 11.5,
    orbitSpeed: 1.60,
    rotationSpeed: 0.003,
    axialTiltDeg: 0.03,
    retrograde: false,
    atmosphere: null,
    name: { en: "Mercury", kn: "ಬುಧ" },
    category: { en: "Terrestrial Rocky Planet", kn: "ಭೂಸದೃಶ್ಯ ಶಿಲಾ ಗ್ರಹ" },
    stats: {
      distance: { en: "0.39 AU (57.9M km)", kn: "0.39 AU (57.9 ಮಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "4,879 km (0.38× Earth)", kn: "4,879 ಕಿ.ಮೀ (0.38× ಭೂಮಿ)" },
      dayLength: { en: "58.6 Earth days (176d solar)", kn: "58.6 ಭೂ ದಿನಗಳು (176 ದಿನ ಸೌರ)" },
      yearLength: { en: "88.0 Earth days", kn: "88.0 ಭೂ ದಿನಗಳು" },
      axialTilt: "0.03°",
      moons: "0"
    },
    diameterKm: 4879,
    gravityMs2: 3.70,
    gravityEarth: 0.377,
    pressureBar: 1e-14,
    pressureLabel: { en: "~10⁻¹⁴ bar (Near Vacuum Exosphere)", kn: "~10⁻¹⁴ ಬಾರ್ (ಶೂನ್ಯದಷ್ಟೇ ತೆಳುವಾದ ಬಹಿರ್ಮಂಡಲ)" },
    windSpeedKmh: 0,
    windLabel: { en: "0 km/h (No Atmosphere)", kn: "0 ಕಿ.ಮೀ/ಗಂ (ವಾಯುಮಂಡಲವಿಲ್ಲ)" },
    surfaceType: { en: "Solid Rocky & Cratered Regolith", kn: "ಘನ ಶಿಲೆ ಮತ್ತು ಕುಳಿಗಳಿಂದ ಕೂಡಿದ ಮೇಲ್ಮೈ" },
    temperature: {
      dayC: 430,
      meanC: 167,
      nightC: -180,
      thermalCategory: "extreme-swing",
      status: { en: "Extreme 610°C Thermal Swing", kn: "610°C ತೀವ್ರ ತಾಪಮಾನ ವ್ಯತ್ಯಾಸ" },
      fact: {
        en: "Without an atmosphere to trap heat, Mercury roasts at 430°C in sunlight (hot enough to melt lead!) and plunges to -180°C on its night side.",
        kn: "ಶಾಖವನ್ನು ಹಿಡಿದಿಡುವ ವಾಯುಮಂಡಲವಿಲ್ಲದ ಕಾರಣ, ಬುಧ ಗ್ರಹವು ಹಗಲಿನಲ್ಲಿ 430°C ವರೆಗೆ ಕಾದು (ಸೀಸ ಕರಗುವಷ್ಟು ಬಿಸಿ!) ರಾತ್ರಿಯಲ್ಲಿ -180°C ಗೆ ಕುಸಿಯುತ್ತದೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "O2", pct: 42.0 },
        { id: "Na", pct: 29.0 },
        { id: "H2", pct: 22.0 },
        { id: "He", pct: 6.0 }
      ],
      interior: [
        { id: "Iron", pct: 70.0 },
        { id: "Silicate", pct: 30.0 }
      ],
      note: {
        en: "Mercury is essentially a giant metallic cannonball: its massive iron core occupies ~85% of the planet's radius (~70% of total mass). Its exosphere is just trace atoms.",
        kn: "ಬುಧವು ಬೃಹತ್ ಲೋಹೀಯ ಗೋಳದಂತಿದೆ: ಇದರ ಕಬ್ಬಿಣದ ತಿರುಳು ಗ್ರಹದ ತ್ರಿಜ್ಯದ ~85% ರಷ್ಟು (ದ್ರವ್ಯರಾಶಿಯ ~70%) ವ್ಯಾಪಿಸಿದೆ. ಇದರ ಬಹಿರ್ಮಂಡಲವು ಅತ್ಯಲ್ಪ ಕಣಗಳನ್ನು ಮಾತ್ರ ಹೊಂದಿದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Hard Vacuum Exposure", "430°C Sunlit Heat / -180°C Night", "Intense Solar Radiation", "Micrometeoroid Impacts"],
        kn: ["ನಿರ್ವಾತ ಪ್ರದೇಶದ ಅಪಾಯ", "430°C ಹಗಲು ಶಾಖ / -180°C ಶೀತ", "ತೀವ್ರ ಸೌರ ವಿಕಿರಣ", "ಸೂಕ್ಷ್ಮ ಉಲ್ಕಾಪಾತಗಳು"]
      },
      description: {
        en: "Airless, heavily cratered world bathed in 7× stronger sunlight than Earth. Deep craters at the poles stay permanently shadowed and harbor water ice.",
        kn: "ಗಾಳಿಯಿಲ್ಲದ, ಕುಳಿಗಳಿಂದ ತುಂಬಿದ ಜಗತ್ತು. ಭೂಮಿಗಿಂತ 7 ಪಟ್ಟು ಹೆಚ್ಚು ತೀವ್ರವಾದ ಸೂರ್ಯನ ಬೆಳಕು ಬೀಳುತ್ತದೆ. ಧ್ರುವಗಳ ಆಳವಾದ ಕುಳಿಗಳಲ್ಲಿ ಶಾಶ್ವತ ನೆರಳಿನಿಂದ ಮಂಜುಗಡ್ಡೆ ಇದೆ."
      }
    },
    survival: {
      severity: "seconds",
      time: { en: "~2 Seconds (Instant Consciousness Loss in ~15s)", kn: "~2 ಸೆಕೆಂಡ್ (15 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಪ್ರಜ್ಞಾಹೀನತೆ)" },
      reason: {
        en: "Near-total vacuum causes rapid decompression, boiling saliva/moisture on exposed surfaces (ebullism), and zero oxygen while solar radiation sears or deep freeze sets in.",
        kn: "ಸಂಪೂರ್ಣ ನಿರ್ವಾತದಿಂದಾಗಿ ದೇಹದ ಒತ್ತಡ ಕುಸಿದು ನೀರು ಕುದಿಯಲಾರಂಭಿಸುತ್ತದೆ (ebullism), ಆಮ್ಲಜನಕವಿಲ್ಲದೆ ಉಸಿರುಗಟ್ಟಿ ತೀವ್ರ ಶಾಖ ಅಥವಾ ಶೀತದಿಂದ ಪ್ರಾಣಹಾನಿಯಾಗುತ್ತದೆ."
      }
    }
  },
  {
    id: "venus",
    isStar: false,
    accentColor: "#f5c55a",
    visualRadius: 1.15,
    orbitRadius: 16.5,
    orbitSpeed: 1.18,
    rotationSpeed: 0.0012,
    axialTiltDeg: 177.4,
    retrograde: true,
    atmosphere: {
      color: "#f5be4f",
      intensity: 1.15,
      power: 2.3,
      scale: 1.11
    },
    name: { en: "Venus", kn: "ಶುಕ್ರ" },
    category: { en: "Terrestrial Planet (Runaway Greenhouse)", kn: "ಭೂಸದೃಶ್ಯ ಗ್ರಹ (ಅತಿ ಹಸಿರುಮನೆ ಪರಿಣಾಮ)" },
    stats: {
      distance: { en: "0.72 AU (108.2M km)", kn: "0.72 AU (108.2 ಮಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "12,104 km (0.95× Earth)", kn: "12,104 ಕಿ.ಮೀ (0.95× ಭೂಮಿ)" },
      dayLength: { en: "243 Earth days (Retrograde)", kn: "243 ಭೂ ದಿನಗಳು (ವಿರುದ್ಧ ದಿಕ್ಕು)" },
      yearLength: { en: "224.7 Earth days", kn: "224.7 ಭೂ ದಿನಗಳು" },
      axialTilt: "177.4°",
      moons: "0"
    },
    diameterKm: 12104,
    gravityMs2: 8.87,
    gravityEarth: 0.904,
    pressureBar: 92.0,
    pressureLabel: { en: "92 bar (92× Earth — 900m Deep Ocean)", kn: "92 ಬಾರ್ (ಭೂಮಿಯ 92× — 900 ಮೀ ಆಳದ ಸಮುದ್ರದ ಒತ್ತಡ)" },
    windSpeedKmh: 360,
    windLabel: { en: "360 km/h (Upper Clouds) / 4 km/h (Surface)", kn: "360 ಕಿ.ಮೀ/ಗಂ (ಮೇಲಿನ ಮೋಡ) / 4 ಕಿ.ಮೀ/ಗಂ (ಮೇಲ್ಮೈ)" },
    surfaceType: { en: "Solid Volcanic Basalt Plains", kn: "ಘನ ಜ್ವಾಲಾಮುಖಿ ಬಸಾಲ್ಟ್ ಬಯಲು" },
    temperature: {
      dayC: 464,
      meanC: 464,
      nightC: 464,
      thermalCategory: "extreme-hot",
      status: { en: "Lead Melts Here! (464°C Constant)", kn: "ಸೀಸ ಕರಗುವ ಉಷ್ಣತೆ! (ನಿರಂತರ 464°C)" },
      fact: {
        en: "Despite being farther from the Sun than Mercury, Venus is the hottest planet. Its thick 96.5% CO₂ blanket traps heat so efficiently that day and night stay locked at 464°C — hotter than a self-cleaning oven!",
        kn: "ಬುಧಕ್ಕಿಂತ ದೂರವಿದ್ದರೂ ಶುಕ್ರ ಅತ್ಯಂತ ಬಿಸಿಯಾದ ಗ್ರಹವಾಗಿದೆ. ಇದರ ದಟ್ಟವಾದ 96.5% CO₂ ವಾಯುಮಂಡಲವು ಶಾಖವನ್ನು ತಡೆಹಿಡಿದು ಹಗಲು-ರಾತ್ರಿ ನಿರಂತರ 464°C ತಾಪಮಾನವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳುತ್ತದೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "CO2", pct: 96.5 },
        { id: "N2", pct: 3.5 },
        { id: "H2SO4", pct: 0.02 }
      ],
      interior: [
        { id: "Silicate", pct: 68.0 },
        { id: "Iron", pct: 32.0 }
      ],
      note: {
        en: "Dense carbon dioxide creates crushing surface pressure while opaque sulfuric acid cloud decks reflect 76% of sunlight, making Venus brilliant in Earth's sky.",
        kn: "ದಟ್ಟವಾದ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಭಾರೀ ಒತ್ತಡ ಸೃಷ್ಟಿಸುತ್ತದೆ ಮತ್ತು ಗಂಧಕಾಮ್ಲದ ಮೋಡಗಳು ಸೂರ್ಯನ ಬೆಳಕಿನ 76% ಭಾಗವನ್ನು ಪ್ರತಿಫಲಿಸಿ ಶುಕ್ರನನ್ನು ಪ್ರಕಾಶಮಾನವಾಗಿ ಕಾಣುವಂತೆ ಮಾಡುತ್ತವೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Sulfuric Acid Virga Rain", "92-Bar Crushing Pressure", "464°C Thermal Incineration", "Super-Rotating Cloud Winds"],
        kn: ["ಗಂಧಕಾಮ್ಲ (Acid) ಮಳೆ", "92-ಬಾರ್ ಅಪ್ಪಚ್ಚಿ ಮಾಡುವ ಒತ್ತಡ", "464°C ಸುಡುವ ತಾಪಮಾನ", "ಅತಿ ವೇಗದ ಮೇಲಿನ ಗಾಳಿ"]
      },
      description: {
        en: "A volcanic pressure cooker shrouded in corrosive yellow sulfuric acid clouds. Rain falls as acid droplets high above, evaporating before hitting the scorching plains.",
        kn: "ಕ್ಷಾರೀಯ ಹಳದಿ ಗಂಧಕಾಮ್ಲದ ಮೋಡಗಳಿಂದ ಆವೃತವಾದ ಜ್ವಾಲಾಮುಖಿ ಕುಕ್ಕರ್. ಮೇಲಿನಿಂದ ಬೀಳುವ ಆಮ್ಲ ಮಳೆಯು ಕುದಿಯುವ ಮೇಲ್ಮೈ ತಲುಪುವ ಮುನ್ನವೇ ಆವಿಯಾಗುತ್ತದೆ."
      }
    },
    survival: {
      severity: "instant",
      time: { en: "< 1 Second (Crushed & Incinerated)", kn: "< 1 ಸೆಕೆಂಡ್ (ಅಪ್ಪಚ್ಚಿ ಮತ್ತು ಸುಟ್ಟು ಭಸ್ಮ)" },
      reason: {
        en: "Atmospheric pressure 92 times Earth's immediately crushes the lungs and body while 464°C toxic CO₂ and sulfuric acid vapors sear tissues instantaneously.",
        kn: "ಭೂಮಿಗಿಂತ 92 ಪಟ್ಟು ಹೆಚ್ಚಿನ ವಾಯು ಒತ್ತಡವು ದೇಹವನ್ನು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಅಪ್ಪಚ್ಚಿ ಮಾಡುತ್ತದೆ ಮತ್ತು 464°C ವಿಷಕಾರಿ CO₂ ಹಾಗೂ ಗಂಧಕಾಮ್ಲವು ದೇಹವನ್ನು ಸುಟ್ಟುಹಾಕುತ್ತದೆ."
      }
    }
  },
  {
    id: "earth",
    isStar: false,
    accentColor: "#4fa8ff",
    visualRadius: 1.22,
    orbitRadius: 22.5,
    orbitSpeed: 1.0,
    rotationSpeed: 0.015,
    axialTiltDeg: 23.44,
    retrograde: false,
    atmosphere: {
      color: "#4da6ff",
      intensity: 0.95,
      power: 3.2,
      scale: 1.07
    },
    name: { en: "Earth", kn: "ಭೂಮಿ" },
    category: { en: "Oceanic Terrestrial Planet", kn: "ಸಾಗರಮಯ ಶಿಲಾ ಗ್ರಹ" },
    stats: {
      distance: { en: "1.00 AU (149.6M km)", kn: "1.00 AU (149.6 ಮಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "12,742 km (1.00× Reference)", kn: "12,742 ಕಿ.ಮೀ (1.00× ಮಾನದಂಡ)" },
      dayLength: { en: "23.93 hours", kn: "23.93 ಗಂಟೆಗಳು" },
      yearLength: { en: "365.25 days", kn: "365.25 ದಿನಗಳು" },
      axialTilt: "23.44°",
      moons: "1 (Moon)"
    },
    diameterKm: 12742,
    gravityMs2: 9.81,
    gravityEarth: 1.00,
    pressureBar: 1.013,
    pressureLabel: { en: "1.013 bar (1.00 atm — Sea Level)", kn: "1.013 ಬಾರ್ (1.00 atm — ಸಮುದ್ರ ಮಟ್ಟ)" },
    windSpeedKmh: 110,
    windLabel: { en: "110 km/h (Storms; 400 km/h Jet Streams)", kn: "110 ಕಿ.ಮೀ/ಗಂ (ಬಿರುಗಾಳಿ; 400 ಕಿ.ಮೀ/ಗಂ ಜೆಟ್ ಸ್ಟ್ರೀಮ್)" },
    surfaceType: { en: "71% Liquid Oceans & 29% Rocky Continents", kn: "71% ದ್ರವ ಸಾಗರಗಳು ಮತ್ತು 29% ಶಿಲಾ ಭೂಖಂಡಗಳು" },
    temperature: {
      dayC: 22,
      meanC: 15,
      nightC: 8,
      thermalCategory: "habitable",
      status: { en: "Habitable Liquid Water Zone", kn: "ಜೀವಯೋಗ್ಯ ದ್ರವ ನೀರಿನ ವಲಯ" },
      fact: {
        en: "Earth sits squarely in the Sun's Goldilocks zone. Its balanced N₂/O₂ atmosphere and oceans keep global mean temperature at 15°C (extremes range -89°C to +57°C).",
        kn: "ಭೂಮಿಯು ಸೂರ್ಯನ 'ಗೋಲ್ಡಿಲಾಕ್ಸ್' ಜೀವಯೋಗ್ಯ ವಲಯದಲ್ಲಿದೆ. ಇದರ ಸಾರಜನಕ/ಆಮ್ಲಜನಕ ವಾಯುಮಂಡಲ ಮತ್ತು ಸಾಗರಗಳು ಸರಾಸರಿ ತಾಪಮಾನವನ್ನು 15°C ನಲ್ಲಿ ಸ್ಥಿರವಾಗಿರಿಸುತ್ತವೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "N2", pct: 78.1 },
        { id: "O2", pct: 20.9 },
        { id: "Ar", pct: 0.9 },
        { id: "CO2", pct: 0.04 }
      ],
      interior: [
        { id: "Silicate", pct: 67.0 },
        { id: "Iron", pct: 32.0 },
        { id: "Ice", pct: 1.0 }
      ],
      note: {
        en: "Earth is the only known planet with abundant free molecular oxygen (20.9%) maintained by photosynthesis and liquid surface oceans stabilized by atmospheric pressure.",
        kn: "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಯಿಂದ ಉತ್ಪತ್ತಿಯಾದ ಮುಕ್ತ ಆಮ್ಲಜನಕ (20.9%) ಮತ್ತು ದ್ರವ ರೂಪದ ಸಾಗರಗಳನ್ನು ಹೊಂದಿರುವ ಏಕೈಕ ತಿಳಿದಿರುವ ಗ್ರಹ ಭೂಮಿಯಾಗಿದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Cyclones & Hurricanes", "Thunderstorms & Lightning", "Regional Polar Frost / Heatwaves", "Active Tectonics & Volcanism"],
        kn: ["ಚಂಡಮಾರುತಗಳು", "ಗುಡುಗು-ಮಿಂಚಿನ ಮಳೆ", "ಧ್ರುವ ಶೀತ / ಬಿಸಿಗಾಳಿ", "ಭೂಕಂಪ ಮತ್ತು ಜ್ವಾಲಾಮುಖಿ"]
      },
      description: {
        en: "Protected by a magnetic field that deflects solar wind and an ozone layer that blocks harmful UV rays, supporting a rich water cycle and diverse biosphere.",
        kn: "ಸೌರ ಮಾರುತವನ್ನು ತಡೆಯುವ ಕಾಂತೀಯ ಕ್ಷೇತ್ರ ಮತ್ತು UV ಕಿರಣಗಳನ್ನು ತಡೆಯುವ ಓಝೋನ್ ಪದರವು ಭೂಮಿಯ ಜಲಚಕ್ರ ಮತ್ತು ಜೀವಸಂಕುಲವನ್ನು ರಕ್ಷಿಸುತ್ತವೆ."
      }
    },
    survival: {
      severity: "habitable",
      time: { en: "Full Natural Lifespan (~75–85 Years)", kn: "ಸಂಪೂರ್ಣ ಜೀವಿತಾವಧಿ (~75–85 ವರ್ಷಗಳು)" },
      reason: {
        en: "Ideal 1-bar breathable 21% oxygen atmosphere, liquid water, 1g gravity optimized for human biology, and magnetic shielding from cosmic radiation.",
        kn: "ಉಸಿರಾಡಲು ಯೋಗ್ಯವಾದ 21% ಆಮ್ಲಜನಕ, 1-ಬಾರ್ ಒತ್ತಡ, ದ್ರವ ನೀರು, ಮಾನವ ದೇಹಕ್ಕೆ ಹೊಂದಿಕೊಳ್ಳುವ 1g ಗುರುತ್ವಾಕರ್ಷಣೆ ಮತ್ತು ವಿಕಿರಣ ರಕ್ಷಣೆ ಇಲ್ಲಿದೆ."
      }
    }
  },
  {
    id: "mars",
    isStar: false,
    accentColor: "#e26a48",
    visualRadius: 0.90,
    orbitRadius: 28.5,
    orbitSpeed: 0.80,
    rotationSpeed: 0.0145,
    axialTiltDeg: 25.19,
    retrograde: false,
    atmosphere: {
      color: "#e67e5a",
      intensity: 0.58,
      power: 3.8,
      scale: 1.045
    },
    name: { en: "Mars", kn: "ಮಂಗಳ" },
    category: { en: "Cold Desert Terrestrial Planet", kn: "ಶೀತ ಮರುಭೂಮಿ ಶಿಲಾ ಗ್ರಹ" },
    stats: {
      distance: { en: "1.52 AU (227.9M km)", kn: "1.52 AU (227.9 ಮಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "6,779 km (0.53× Earth)", kn: "6,779 ಕಿ.ಮೀ (0.53× ಭೂಮಿ)" },
      dayLength: { en: "24.62 hours (1 Sol)", kn: "24.62 ಗಂಟೆಗಳು (1 ಸೋಲ್)" },
      yearLength: { en: "687.0 Earth days", kn: "687.0 ಭೂ ದಿನಗಳು" },
      axialTilt: "25.19°",
      moons: "2 (Phobos, Deimos)"
    },
    diameterKm: 6779,
    gravityMs2: 3.71,
    gravityEarth: 0.378,
    pressureBar: 0.006,
    pressureLabel: { en: "0.006 bar (0.6% of Earth — Below Armstrong Limit)", kn: "0.006 ಬಾರ್ (ಭೂಮಿಯ 0.6% — ಅತ್ಯಂತ ವಿರಳ)" },
    windSpeedKmh: 100,
    windLabel: { en: "100 km/h (Planet-Wide Dust Storms)", kn: "100 ಕಿ.ಮೀ/ಗಂ (ಜಾಗತಿಕ ಧೂಳಿನ ಬಿರುಗಾಳಿ)" },
    surfaceType: { en: "Solid Iron-Oxide Desert & Ice Caps", kn: "ಕಬ್ಬಿಣದ ಆಕ್ಸೈಡ್ ಮರುಭೂಮಿ ಮತ್ತು ಮಂಜು ಟೋಪಿಗಳು" },
    temperature: {
      dayC: 20,
      meanC: -65,
      nightC: -140,
      thermalCategory: "cold",
      status: { en: "Sub-Zero Thin-Air Desert", kn: "ಶೂನ್ಯಕ್ಕಿಂತ ಕೆಳಗಿನ ವಿರಳ-ಗಾಳಿ ಮರುಭೂಮಿ" },
      fact: {
        en: "While equatorial summer noon can briefly touch +20°C at ground level, Mars's ultra-thin CO₂ air cannot retain warmth, plunging nights to -140°C.",
        kn: "ಮಂಗಳನ ಸಮಭಾಜಕದಲ್ಲಿ ಬೇಸಿಗೆಯ ಮಧ್ಯಾಹ್ನದ ನೆಲವು +20°C ತಲುಪಬಹುದಾದರೂ, ಅತಿ ತೆಳುವಾದ CO₂ ವಾಯುಮಂಡಲದಿಂದಾಗಿ ರಾತ್ರಿ ತಾಪಮಾನ -140°C ಗೆ ಕುಸಿಯುತ್ತದೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "CO2", pct: 95.3 },
        { id: "N2", pct: 2.6 },
        { id: "Ar", pct: 1.9 },
        { id: "O2", pct: 0.16 }
      ],
      interior: [
        { id: "Silicate", pct: 78.0 },
        { id: "Iron", pct: 21.0 },
        { id: "Ice", pct: 1.0 }
      ],
      note: {
        en: "Iron oxide dust blankets the basalt crust in rust red. Polar caps hold frozen water ice topped with seasonal dry ice (frozen CO₂).",
        kn: "ಕಬ್ಬಿಣದ ಆಕ್ಸೈಡ್ ಧೂಳು ಮಂಗಳನ ಮೇಲ್ಮೈಗೆ ಕೆಂಪು ಬಣ್ಣ ನೀಡಿದೆ. ಧ್ರುವ ಪ್ರದೇಶಗಳಲ್ಲಿ ಘನೀಕೃತ ನೀರು ಮತ್ತು ಶುಷ್ಕ ಮಂಜುಗಡ್ಡೆ (ಘನ CO₂) ಸಂಗ್ರಹವಾಗಿದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Global Dust Storms", "0.6% Unbreathable CO₂ Pressure", "Toxic Perchlorate Soil", "Unshielded Cosmic Radiation"],
        kn: ["ಜಾಗತಿಕ ಧೂಳಿನ ಬಿರುಗಾಳಿ", "0.6% ಉಸಿರಾಡಲಾಗದ CO₂ ಒತ್ತಡ", "ವಿಷಕಾರಿ ಪರ್‌ಕ್ಲೋರೇಟ್ ಮಣ್ಣು", "ತೀವ್ರ ಬಾಹ್ಯಾಕಾಶ ವಿಕಿರಣ"]
      },
      description: {
        en: "Home to the Solar System's tallest volcano (Olympus Mons) and deepest canyon (Valles Marineris). Fine iron-rich dust can engulf the entire globe for months.",
        kn: "ಸೌರಮಂಡಲದ ಅತಿ ಎತ್ತರದ ಜ್ವಾಲಾಮುಖಿ (ಒಲಿಂಪಸ್ ಮಾನ್ಸ್) ಮತ್ತು ಆಳವಾದ ಕಣಿವೆ (ವ್ಯಾಲೆಸ್ ಮರಿನೆರಿಸ್) ಇಲ್ಲಿದೆ. ಸೂಕ್ಷ್ಮ ಕೆಂಪು ಧೂಳಿನ ಬಿರುಗಾಳಿ ತಿಂಗಳುಗಟ್ಟಲೆ ಗ್ರಹವನ್ನು ಆವರಿಸುತ್ತದೆ."
      }
    },
    survival: {
      severity: "minutes",
      time: { en: "~60–90 Seconds (Unconscious in ~15s)", kn: "~60–90 ಸೆಕೆಂಡ್ (15 ಸೆಕೆಂಡ್‌ಗಳಲ್ಲಿ ಪ್ರಜ್ಞಾಹೀನತೆ)" },
      reason: {
        en: "Atmospheric pressure (0.006 bar) is far below the Armstrong limit: bodily fluids vaporize at body temperature, and 95% CO₂ provides zero breathable oxygen.",
        kn: "0.006 ಬಾರ್ ಒತ್ತಡವು 'ಆರ್ಮ್‌ಸ್ಟ್ರಾಂಗ್ ಮಿತಿ'ಗಿಂತ ತುಂಬಾ ಕಡಿಮೆಯಿದ್ದು, ದೇಹದ ದ್ರವಗಳು ಕುದಿಯಲಾರಂಭಿಸುತ್ತವೆ ಮತ್ತು 95% CO₂ ವಾಯುವಿನಲ್ಲಿ ಆಮ್ಲಜನಕವಿಲ್ಲದೆ ಉಸಿರುಗಟ್ಟುತ್ತದೆ."
      }
    }
  },
  {
    id: "jupiter",
    isStar: false,
    accentColor: "#e8a87c",
    visualRadius: 3.1,
    orbitRadius: 39.5,
    orbitSpeed: 0.43,
    rotationSpeed: 0.032,
    axialTiltDeg: 3.13,
    retrograde: false,
    atmosphere: {
      color: "#e6b88a",
      intensity: 0.65,
      power: 3.5,
      scale: 1.06
    },
    name: { en: "Jupiter", kn: "ಗುರು" },
    category: { en: "Gas Giant Planet", kn: "ಅನಿಲ ದೈತ್ಯ ಗ್ರಹ" },
    stats: {
      distance: { en: "5.20 AU (778.5M km)", kn: "5.20 AU (778.5 ಮಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "139,820 km (10.97× Earth)", kn: "139,820 ಕಿ.ಮೀ (10.97× ಭೂಮಿ)" },
      dayLength: { en: "9.93 hours (Fastest Spin)", kn: "9.93 ಗಂಟೆ (ಅತಿ ವೇಗದ ಭ್ರಮಣ)" },
      yearLength: { en: "11.86 Earth years", kn: "11.86 ಭೂ ವರ್ಷಗಳು" },
      axialTilt: "3.13°",
      moons: "95"
    },
    diameterKm: 139820,
    gravityMs2: 24.79,
    gravityEarth: 2.527,
    pressureBar: 1.0,
    pressureLabel: { en: "1 bar (Cloud Tops) → >40M bar Deep Interior", kn: "1 ಬಾರ್ (ಮೋಡದ ತುದಿ) → >40 ಮಿಲಿಯನ್ ಬಾರ್ ಒಳಭಾಗ" },
    windSpeedKmh: 540,
    windLabel: { en: "540 km/h (Great Red Spot & Jet Bands)", kn: "540 ಕಿ.ಮೀ/ಗಂ (ಗ್ರೇಟ್ ರೆಡ್ ಸ್ಪಾಟ್ ಮತ್ತು ಜೆಟ್ ಮಾರುತ)" },
    surfaceType: { en: "Gas Giant (No Solid Surface)", kn: "ಅನಿಲ ದೈತ್ಯ (ಘನ ಮೇಲ್ಮೈ ಇಲ್ಲ)" },
    temperature: {
      dayC: -108,
      meanC: -110,
      nightC: -112,
      thermalCategory: "cold",
      status: { en: "Cryogenic Cloud Tops / Superhot Core", kn: "ಶೀತಲ ಮೋಡದ ಮೇಲ್ಭಾಗ / ಅತಿ ಬಿಸಿ ತಿರುಳು" },
      fact: {
        en: "Cloud tops stay near -110°C day and night due to internal heat radiating outward; deeper down, pressures compress hydrogen into liquid metal at +24,000°C!",
        kn: "ಒಳಗಿನಿಂದ ಹೊರಸೂಸುವ ಶಾಖದಿಂದ ಮೋಡದ ಮೇಲ್ಮೈ ಹಗಲು-ರಾತ್ರಿ -110°C ನಷ್ಟಿರುತ್ತದೆ; ಆಳದಲ್ಲಿ ಒತ್ತಡದಿಂದ ಜಲಜನಕ ಲೋಹವಾಗಿ ಬದಲಾಗಿ +24,000°C ತಾಪಮಾನ ತಲುಪುತ್ತದೆ!"
      }
    },
    composition: {
      atmosphere: [
        { id: "H2", pct: 89.8 },
        { id: "He", pct: 10.2 },
        { id: "CH4", pct: 0.3 }
      ],
      interior: [
        { id: "MetH2", pct: 78.0 },
        { id: "H2", pct: 17.0 },
        { id: "Ice", pct: 5.0 }
      ],
      note: {
        en: "Similar in bulk composition to the Sun, Jupiter has no solid ground—its hydrogen atmosphere gradually compresses into a vast ocean of electrically conducting liquid metallic hydrogen.",
        kn: "ಸೂರ್ಯನಂತೆಯೇ ಜಲಜನಕ-ಹೀಲಿಯಂ ಪ್ರಧಾನವಾಗಿರುವ ಗುರು ಗ್ರಹಕ್ಕೆ ಘನ ನೆಲವಿಲ್ಲ; ಆಳದಲ್ಲಿ ಜಲಜನಕವು ವಿದ್ಯುತ್ ವಾಹಕ ದ್ರವ ಲೋಹೀಯ ಸಾಗರವಾಗಿ ಮಾರ್ಪಡುತ್ತದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Earth-Sized Great Red Spot Storm", "540 km/h Ammonia Wind Shear", "Lethal Van Allen Radiation Belts", "Crushing Deep Pressure"],
        kn: ["ಭೂಮಿಯಷ್ಟೇ ದೊಡ್ಡ ರೆಡ್ ಸ್ಪಾಟ್ ಬಿರುಗಾಳಿ", "540 ಕಿ.ಮೀ/ಗಂ ಅಮೋನಿಯಾ ಬಿರುಗಾಳಿ", "ಮಾರಕ ವಿಕಿರಣ ವಲಯಗಳು", "ಅಪ್ಪಚ್ಚಿ ಮಾಡುವ ಒಳ ಒತ್ತಡ"]
      },
      description: {
        en: "Jupiter's 9.9-hour spin whips ammonia clouds into multicolored bands and storms larger than Earth, powered by a colossal magnetic field 20,000× stronger than Earth's.",
        kn: "9.9 ಗಂಟೆಗಳ ವೇಗದ ಭ್ರಮಣದಿಂದ ಅಮೋನಿಯಾ ಮೋಡಗಳು ಬಣ್ಣಬಣ್ಣದ ಪಟ್ಟೆಗಳಾಗಿ ಮತ್ತು ಭೂಮಿಗಿಂತ ದೊಡ್ಡ ಚಂಡಮಾರುತಗಳಾಗಿ ರೂಪುಗೊಳ್ಳುತ್ತವೆ."
      }
    },
    survival: {
      severity: "instant",
      time: { en: "< 1 Second (No Ground, Crushed & Irradiated)", kn: "< 1 ಸೆಕೆಂಡ್ (ನೆಲವಿಲ್ಲ, ಒತ್ತಡ ಮತ್ತು ವಿಕಿರಣದಿಂದ ಸಾವು)" },
      reason: {
        en: "Zero oxygen, lethal radiation belts, 2.53g downward pull, and no solid floor—anyone falling sinks rapidly into crushing, boiling metallic hydrogen pressures.",
        kn: "ಆಮ್ಲಜನಕವಿಲ್ಲದ ವಿಷಕಾರಿ ಅನಿಲ, ಮಾರಕ ವಿಕಿರಣ, 2.53g ಗುರುತ್ವ ಮತ್ತು ಘನ ನೆಲವಿಲ್ಲದ ಕಾರಣ ಬಿದ್ದವರು ಅತಿಯಾದ ಒತ್ತಡ ಮತ್ತು ಶಾಖದಲ್ಲಿ ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ನಾಶವಾಗುತ್ತಾರೆ."
      }
    }
  },
  {
    id: "saturn",
    isStar: false,
    accentColor: "#edd59e",
    visualRadius: 2.65,
    orbitRadius: 52.0,
    orbitSpeed: 0.30,
    rotationSpeed: 0.029,
    axialTiltDeg: 26.73,
    retrograde: false,
    atmosphere: {
      color: "#ebd39c",
      intensity: 0.62,
      power: 3.5,
      scale: 1.06
    },
    rings: {
      type: "saturn",
      innerRadius: 3.35,
      outerRadius: 6.25
    },
    name: { en: "Saturn", kn: "ಶನಿ" },
    category: { en: "Ringed Gas Giant Planet", kn: "ಉಂಗುರಯುಕ್ತ ಅನಿಲ ದೈತ್ಯ ಗ್ರಹ" },
    stats: {
      distance: { en: "9.58 AU (1.43B km)", kn: "9.58 AU (1.43 ಬಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "116,460 km (9.14× Earth)", kn: "116,460 ಕಿ.ಮೀ (9.14× ಭೂಮಿ)" },
      dayLength: { en: "10.7 hours", kn: "10.7 ಗಂಟೆಗಳು" },
      yearLength: { en: "29.45 Earth years", kn: "29.45 ಭೂ ವರ್ಷಗಳು" },
      axialTilt: "26.73°",
      moons: "146"
    },
    diameterKm: 116460,
    gravityMs2: 10.44,
    gravityEarth: 1.064,
    pressureBar: 1.0,
    pressureLabel: { en: "1 bar (Cloud Tops) → >10M bar Deep Interior", kn: "1 ಬಾರ್ (ಮೋಡದ ತುದಿ) → >10 ಮಿಲಿಯನ್ ಬಾರ್ ಒಳಭಾಗ" },
    windSpeedKmh: 1800,
    windLabel: { en: "1,800 km/h (Supersonic Equatorial Jets)", kn: "1,800 ಕಿ.ಮೀ/ಗಂ (ಸೂಪರ್‌ಸಾನಿಕ್ ಸಮಭಾಜಕ ಮಾರುತ)" },
    surfaceType: { en: "Gas Giant with Water-Ice Ring System", kn: "ನೀರು-ಮಂಜುಗಡ್ಡೆ ಉಂಗುರಗಳ ಅನಿಲ ದೈತ್ಯ" },
    temperature: {
      dayC: -138,
      meanC: -140,
      nightC: -142,
      thermalCategory: "cryogenic",
      status: { en: "Frigid Supersonic Ammonia Haze", kn: "ಶೀತಲ ಸೂಪರ್‌ಸಾನಿಕ್ ಅಮೋನಿಯಾ ಮಂಜು" },
      fact: {
        en: "Cloud tops chill around -140°C while Saturn's density is lower than liquid water (0.687 g/cm³)—the only planet less dense than water!",
        kn: "ಮೋಡದ ಮೇಲ್ಮೈ -140°C ನಷ್ಟು ತಂಪಾಗಿದೆ. ಶನಿಯ ಸಾಂದ್ರತೆ ನೀರಿಗಿಂತಲೂ ಕಡಿಮೆ (0.687 g/cm³) — ಇದು ನೀರಿನಲ್ಲಿ ತೇಲಬಲ್ಲಷ್ಟು ಹಗುರ ಸಾಂದ್ರತೆಯ ಏಕೈಕ ಗ್ರಹ!"
      }
    },
    composition: {
      atmosphere: [
        { id: "H2", pct: 96.3 },
        { id: "He", pct: 3.25 },
        { id: "CH4", pct: 0.45 }
      ],
      interior: [
        { id: "MetH2", pct: 85.0 },
        { id: "Iron", pct: 10.0 },
        { id: "Ice", pct: 5.0 }
      ],
      note: {
        en: "Composed almost entirely of hydrogen (96.3%) and helium. Its iconic multi-ring system spans 282,000 km across yet averages only ~10 meters thick, made of 99% pure water ice.",
        kn: "ಶನಿಯು 96.3% ಜಲಜನಕದಿಂದ ಕೂಡಿದೆ. ಇದರ ಪ್ರಸಿದ್ಧ ಉಂಗುರ ವ್ಯವಸ್ಥೆ 2,82,000 ಕಿ.ಮೀ ಅಗಲವಿದ್ದರೂ ಕೇವಲ ~10 ಮೀಟರ್ ದಪ್ಪವಿದ್ದು, 99% ಶುದ್ಧ ನೀರಿನ ಮಂಜುಗಡ್ಡೆಯಿಂದ ನಿರ್ಮಿತವಾಗಿದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["1,800 km/h Supersonic Winds", "North Pole Hexagonal Jet Vortex", "Cryogenic Ammonia Clouds", "No Solid Ground"],
        kn: ["1,800 ಕಿ.ಮೀ/ಗಂ ಅತಿವೇಗದ ಗಾಳಿ", "ಉತ್ತರ ಧ್ರುವದ ಷಡ್ಭುಜಾಕೃತಿಯ ಸುಂಟರಗಾಳಿ", "ತೀವ್ರ ಶೀತಲ ಅಮೋನಿಯಾ ಮೋಡ", "ಘನ ಮೇಲ್ಮೈ ಇಲ್ಲ"]
      },
      description: {
        en: "Fierce equatorial winds blow over 4× faster than Earth's strongest hurricanes, while a mysterious 30,000-km-wide hexagonal jet stream rotates steadily at its north pole.",
        kn: "ಭೂಮಿಯ ಅತ್ಯಂತ ಭೀಕರ ಚಂಡಮಾರುತಕ್ಕಿಂತ 4 ಪಟ್ಟು ವೇಗವಾಗಿ ಗಾಳಿ ಬೀಸುತ್ತದೆ. ಉತ್ತರ ಧ್ರುವದಲ್ಲಿ 30,000 ಕಿ.ಮೀ ಅಗಲದ ನಿಗೂಢ ಷಡ್ಭುಜಾಕೃತಿಯ ಗಾಳಿ ಸುಳಿ ಸುತ್ತುತ್ತಿದೆ."
      }
    },
    survival: {
      severity: "instant",
      time: { en: "< 1 Second (Freezing, Shredded by 1,800 km/h Winds)", kn: "< 1 ಸೆಕೆಂಡ್ (ಶೀತ ಮತ್ತು 1,800 ಕಿ.ಮೀ/ಗಂ ಗಾಳಿಗೆ ಸಿಲುಕಿ ಸಾವು)" },
      reason: {
        en: "No solid surface, zero breathable oxygen, cryogenic temperatures, and supersonic ammonia winds tear apart any unshielded body as it plunges into crushing depths.",
        kn: "ಘನ ನೆಲವಿಲ್ಲದ, ಆಮ್ಲಜನಕ ರಹಿತ ವಾತಾವರಣದಲ್ಲಿ -140°C ಶೀತ ಮತ್ತು 1,800 ಕಿ.ಮೀ/ಗಂ ವೇಗದ ಅಮೋನಿಯಾ ಗಾಳಿಯು ದೇಹವನ್ನು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಛಿದ್ರಗೊಳಿಸಿ ಆಳಕ್ಕೆ ಎಳೆಯುತ್ತದೆ."
      }
    }
  },
  {
    id: "uranus",
    isStar: false,
    accentColor: "#6be2e8",
    visualRadius: 1.85,
    orbitRadius: 65.5,
    orbitSpeed: 0.20,
    rotationSpeed: 0.022,
    axialTiltDeg: 97.77,
    retrograde: true,
    atmosphere: {
      color: "#6ce6ed",
      intensity: 0.85,
      power: 3.1,
      scale: 1.075
    },
    rings: {
      type: "uranus",
      innerRadius: 2.45,
      outerRadius: 3.45
    },
    name: { en: "Uranus", kn: "ಯುರೇನಸ್" },
    category: { en: "Tilted Ice Giant Planet", kn: "ವಾಲಿದ ಹಿಮ ದೈತ್ಯ ಗ್ರಹ" },
    stats: {
      distance: { en: "19.20 AU (2.87B km)", kn: "19.20 AU (2.87 ಬಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "50,724 km (3.98× Earth)", kn: "50,724 ಕಿ.ಮೀ (3.98× ಭೂಮಿ)" },
      dayLength: { en: "17.24 hours (Sideways)", kn: "17.24 ಗಂಟೆ (ಮಗ್ಗುಲಲ್ಲಿ ತಿರುಗುತ್ತದೆ)" },
      yearLength: { en: "84.0 Earth years", kn: "84.0 ಭೂ ವರ್ಷಗಳು" },
      axialTilt: "97.77°",
      moons: "28"
    },
    diameterKm: 50724,
    gravityMs2: 8.87,
    gravityEarth: 0.904,
    pressureBar: 1.0,
    pressureLabel: { en: "1 bar (Cloud Tops) → >8M bar Ice Mantle", kn: "1 ಬಾರ್ (ಮೋಡದ ತುದಿ) → >8 ಮಿಲಿಯನ್ ಬಾರ್ ಮಂಜು ಕವಚ" },
    windSpeedKmh: 900,
    windLabel: { en: "900 km/h (Extreme Seasonal Winds)", kn: "900 ಕಿ.ಮೀ/ಗಂ (ತೀವ್ರ ಋತುಮಾನ ಗಾಳಿ)" },
    surfaceType: { en: "Ice Giant (Superionic Water/Ammonia Mantle)", kn: "ಹಿಮ ದೈತ್ಯ (ನೀರು/ಅಮೋನಿಯಾ ಮಂಜು ದ್ರವ)" },
    temperature: {
      dayC: -193,
      meanC: -195,
      nightC: -224,
      thermalCategory: "cryogenic",
      status: { en: "Cryogenic Freezing (Coldest Atmosphere!)", kn: "ಕ್ರಯೋಜೆನಿಕ್ ಶೀತ (ಅತ್ಯಂತ ತಂಪಾದ ವಾಯುಮಂಡಲ!)" },
      fact: {
        en: "Uranus holds the record for the coldest planetary atmosphere in the Solar System, dropping to -224°C (-371°F) because it radiates almost no excess internal heat.",
        kn: "ಯುರೇನಸ್ ಸೌರಮಂಡಲದಲ್ಲೇ ಅತ್ಯಂತ ತಂಪಾದ ವಾಯುಮಂಡಲ (-224°C) ಹೊಂದಿದೆ; ಇದು ಒಳಗಿನಿಂದ ಹೆಚ್ಚುವರಿ ಶಾಖವನ್ನು ಹೊರಸೂಸದಿರುವುದು ಇದಕ್ಕೆ ಕಾರಣವಾಗಿದೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "H2", pct: 82.5 },
        { id: "He", pct: 15.2 },
        { id: "CH4", pct: 2.3 }
      ],
      interior: [
        { id: "Ice", pct: 80.0 },
        { id: "H2", pct: 15.0 },
        { id: "Silicate", pct: 5.0 }
      ],
      note: {
        en: "Methane gas (2.3%) absorbs red sunlight and reflects pale cyan-blue light. Beneath the atmosphere, 80% of its mass is a hot, dense fluid mantle of water, ammonia, and methane 'ices'.",
        kn: "ಮೀಥೇನ್ ಅನಿಲ (2.3%) ಕೆಂಪು ಬೆಳಕನ್ನು ಹೀರಿ ನೀಲಿ-ಹಸಿರು ಬಣ್ಣವನ್ನು ಪ್ರತಿಫಲಿಸುತ್ತದೆ. ಇದರ ದ್ರವ್ಯರಾಶಿಯ 80% ಭಾಗ ನೀರು, ಅಮೋನಿಯಾ ಮತ್ತು ಮೀಥೇನ್ ಮಂಜು ದ್ರವದಿಂದ ಕೂಡಿದೆ."
      }
    },
    environment: {
      hazards: {
        en: ["Cryogenic -224°C Freeze", "42-Year Polar Night / Day Cycles", "900 km/h Methane Gales", "Deep Diamond-Rain Mantle"],
        kn: ["-224°C ಕ್ರಯೋಜೆನಿಕ್ ಶೀತ", "42 ವರ್ಷಗಳ ಧ್ರುವ ರಾತ್ರಿ / ಹಗಲು", "900 ಕಿ.ಮೀ/ಗಂ ಮೀಥೇನ್ ಬಿರುಗಾಳಿ", "ಆಳದಲ್ಲಿ ವಜ್ರದ ಮಳೆ (Diamond Rain)"]
      },
      description: {
        en: "Knocked onto its side at a 97.77° tilt, Uranus rolls around the Sun with vertical rings, plunging each pole into 42 years of continuous sunlight followed by 42 years of darkness.",
        kn: "97.77° ವಾಲುವಿಕೆಯೊಂದಿಗೆ ಪಕ್ಕಕ್ಕೆ ಉರುಳುತ್ತಾ ಸುತ್ತುವ ಯುರೇನಸ್ ಲಂಬವಾದ ಉಂಗುರಗಳನ್ನು ಹೊಂದಿದೆ; ಪ್ರತಿ ಧ್ರುವದಲ್ಲಿ 42 ವರ್ಷ ಹಗಲು ಮತ್ತು 42 ವರ್ಷ ಕತ್ತಲೆ ಇರುತ್ತದೆ."
      }
    },
    survival: {
      severity: "instant",
      time: { en: "< 1 Second (Instant Cryogenic Freeze & Asphyxiation)", kn: "< 1 ಸೆಕೆಂಡ್ (ತಕ್ಷಣದ ಶೀತ ಘನೀಕರಣ ಮತ್ತು ಉಸಿರುಗಟ್ಟುವಿಕೆ)" },
      reason: {
        en: "Temperatures down to -224°C instantly freeze biological tissue solid while zero oxygen, toxic methane/hydrogen sulfide clouds, and 900 km/h winds prevent any survival.",
        kn: "-224°C ತಾಪಮಾನವು ದೇಹವನ್ನು ಕ್ಷಣಾರ್ಧದಲ್ಲಿ ಗಟ್ಟಿಯಾಗಿ ಹೆಪ್ಪುಗಟ್ಟಿಸುತ್ತದೆ, ಜೊತೆಗೆ ಆಮ್ಲಜನಕ ರಹಿತ ಮೀಥೇನ್ ಗಾಳಿ ಮತ್ತು 900 ಕಿ.ಮೀ/ಗಂ ಚಂಡಮಾರುತವು ತಕ್ಷಣ ಪ್ರಾಣಹಾನಿ ಮಾಡುತ್ತದೆ."
      }
    }
  },
  {
    id: "neptune",
    isStar: false,
    accentColor: "#3b82f6",
    visualRadius: 1.78,
    orbitRadius: 78.0,
    orbitSpeed: 0.14,
    rotationSpeed: 0.023,
    axialTiltDeg: 28.32,
    retrograde: false,
    atmosphere: {
      color: "#3b82f6",
      intensity: 0.92,
      power: 3.0,
      scale: 1.075
    },
    name: { en: "Neptune", kn: "ನೆಪ್ಚೂನ್" },
    category: { en: "Supersonic Ice Giant Planet", kn: "ಅತೀವೇಗದ ಗಾಳಿಯ ಹಿಮ ದೈತ್ಯ" },
    stats: {
      distance: { en: "30.05 AU (4.50B km)", kn: "30.05 AU (4.50 ಬಿಲಿಯನ್ ಕಿ.ಮೀ)" },
      diameter: { en: "49,244 km (3.86× Earth)", kn: "49,244 ಕಿ.ಮೀ (3.86× ಭೂಮಿ)" },
      dayLength: { en: "16.11 hours", kn: "16.11 ಗಂಟೆಗಳು" },
      yearLength: { en: "164.8 Earth years", kn: "164.8 ಭೂ ವರ್ಷಗಳು" },
      axialTilt: "28.32°",
      moons: "16"
    },
    diameterKm: 49244,
    gravityMs2: 11.15,
    gravityEarth: 1.137,
    pressureBar: 1.0,
    pressureLabel: { en: "1 bar (Cloud Tops) → >8M bar Ice Mantle", kn: "1 ಬಾರ್ (ಮೋಡದ ತುದಿ) → >8 ಮಿಲಿಯನ್ ಬಾರ್ ಮಂಜು ಕವಚ" },
    windSpeedKmh: 2100,
    windLabel: { en: "2,100 km/h (Fastest Winds in Solar System)", kn: "2,100 ಕಿ.ಮೀ/ಗಂ (ಸೌರಮಂಡಲದ ಅತಿ ವೇಗದ ಗಾಳಿ)" },
    surfaceType: { en: "Ice Giant (No Solid Surface)", kn: "ಹಿಮ ದೈತ್ಯ (ಘನ ಮೇಲ್ಮೈ ಇಲ್ಲ)" },
    temperature: {
      dayC: -198,
      meanC: -200,
      nightC: -218,
      thermalCategory: "cryogenic",
      status: { en: "Cryogenic Freezing & Supersonic Ice", kn: "ಕ್ರಯೋಜೆನಿಕ್ ಶೀತ ಮತ್ತು ಸೂಪರ್‌ಸಾನಿಕ್ ಮಂಜು" },
      fact: {
        en: "Orbiting 30× farther from the Sun than Earth (receiving 900× less sunlight), Neptune freezes at -200°C yet drives the Solar System's fastest winds from internal heat.",
        kn: "ಭೂಮಿಗಿಂತ 30 ಪಟ್ಟು ದೂರದಲ್ಲಿರುವ ನೆಪ್ಚೂನ್ -200°C ನಷ್ಟು ಹೆಪ್ಪುಗಟ್ಟುವ ತಾಪಮಾನದಲ್ಲಿದ್ದರೂ, ಒಳಗಿನ ಶಾಖದಿಂದ ಸೌರಮಂಡಲದಲ್ಲೇ ಅತ್ಯಂತ ವೇಗದ ಗಾಳಿಯನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ."
      }
    },
    composition: {
      atmosphere: [
        { id: "H2", pct: 80.0 },
        { id: "He", pct: 18.5 },
        { id: "CH4", pct: 1.5 }
      ],
      interior: [
        { id: "Ice", pct: 80.0 },
        { id: "H2", pct: 15.0 },
        { id: "Silicate", pct: 5.0 }
      ],
      note: {
        en: "Deep inside Neptune's mantle, extreme pressure and temperature break down methane molecules into pure carbon crystals, causing literal diamond rain to sink toward the core.",
        kn: "ನೆಪ್ಚೂನ್ ಒಳಭಾಗದ ತೀವ್ರ ಒತ್ತಡ ಮತ್ತು ಉಷ್ಣತೆಯು ಮೀಥೇನ್ ಅಣುಗಳನ್ನು ಒಡೆದು ಶುದ್ಧ ಇಂಗಾಲದ ಹರಳುಗಳನ್ನಾಗಿಸುತ್ತದೆ—ಇದರಿಂದ ಆಳದಲ್ಲಿ ವಜ್ರದ ಮಳೆ ಸುರಿಯುತ್ತದೆ!"
      }
    },
    environment: {
      hazards: {
        en: ["2,100 km/h Supersonic Winds", "Cryogenic -200°C Methane Clouds", "Dark Vortex Storms", "High-Pressure Diamond Rain"],
        kn: ["2,100 ಕಿ.ಮೀ/ಗಂ ಅತೀವೇಗದ ಬಿರುಗಾಳಿ", "-200°C ಕ್ರಯೋಜೆನಿಕ್ ಮೀಥೇನ್ ಮೋಡ", "ಡಾರ್ಕ್ ವೋರ್ಟೆಕ್ಸ್ ಚಂಡಮಾರುತ", "ಅತಿಯಾದ ಒತ್ತಡದ ವಜ್ರದ ಮಳೆ"]
      },
      description: {
        en: "A dark, cold, whip-lashed ice world where frozen methane cirrus clouds race past dark anticyclones faster than the speed of sound.",
        kn: "ಶಬ್ದದ ವೇಗಕ್ಕಿಂತ ವೇಗವಾಗಿ ಮೀಥೇನ್ ಹಿಮ ಮೋಡಗಳು ಚಲಿಸುವ ಕಡು ನೀಲಿ, ಶೀತಲ ಮತ್ತು ಭೀಕರ ಚಂಡಮಾರುತಗಳ ಹಿಮ ದೈತ್ಯ ಜಗತ್ತು."
      }
    },
    survival: {
      severity: "instant",
      time: { en: "< 1 Second (Frozen & Torn by Supersonic Winds)", kn: "< 1 ಸೆಕೆಂಡ್ (ಶೀತ ಘನೀಕರಣ ಮತ್ತು ಸೂಪರ್‌ಸಾನಿಕ್ ಗಾಳಿಯಿಂದ ನಾಶ)" },
      reason: {
        en: "At -200°C with no oxygen and no ground, 2,100 km/h winds (Mach 1.7+) and rapidly escalating interior pressures destroy any unprotected organism immediately.",
        kn: "-200°C ಶೀತ, ಆಮ್ಲಜನಕದ ಕೊರತೆ ಮತ್ತು ಘನ ನೆಲವಿಲ್ಲದ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ 2,100 ಕಿ.ಮೀ/ಗಂ (ಮ್ಯಾಕ್ 1.7+) ಗಾಳಿ ಮತ್ತು ಹೆಚ್ಚುವ ಒತ್ತಡವು ದೇಹವನ್ನು ತಕ್ಷಣ ನಾಶಪಡಿಸುತ್ತದೆ."
      }
    }
  }
];

window.SOLAR_DATA = { UI_TEXT, ELEMENT_META, CELESTIAL_BODIES };
