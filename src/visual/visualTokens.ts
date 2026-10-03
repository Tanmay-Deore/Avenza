// Avenza Warm Paper + Soft Black + Earthy Muted Accents Design Tokens

export const avenzaColors = {
  // Paper Backgrounds
  paper: {
    base: '#F3EBDD',      // primary warm beige
    deep: '#EDE3D2',      // secondary, slightly deeper
    light: '#F8F4EC',     // very soft cream, nav/cards
    creamText: '#F7F0E5', // light text on dark
  },

  // Soft Black Structure
  black: {
    base: '#20211E',      // primary dark
    two: '#292A26',
    three: '#32332E',
    panel: '#242520',     // floating panel
    panelTwo: '#2E302B',
    panelInput: '#30322D',
    panelLine: '#57584E',
  },

  // FILL tier (3D, orbs, blobs, route lines, bars, large areas)
  fill: {
    earth: '#A48B6A',     // signature beige-brown
    sage: '#9EAD97',      // verified / progress
    blue: '#8495B8',      // dusty blue: navigation / active
    clay: '#C58F78',      // attention / warm
    gold: '#D4B56B',      // destination / achievement
  },

  // INK tier (text, icons, thin lines on light backgrounds)
  ink: {
    primary: '#20211E',   // primary text, 13.7:1 on paper
    secondary: '#5A5B53', // secondary text
    muted: '#64625A',     // captions / telemetry, 5.2:1 on paper
    blue: '#4F6288',      // 5.2:1 on paper
    sage: '#4C6650',      // 5.3:1
    clay: '#8A5440',      // 5.2:1
    gold: '#7A6128',      // 5.0:1
    earth: '#8A7050',     // 3.9:1, large text / icons only
  },

  // Decorative only (NEVER for text)
  decorative: {
    subtle: '#B5AE9F',
    line: '#D8CCB9',
    lineStrong: '#CFC2AE',
  },

  // Workspace specific tokens
  workspace: {
    paper: '#F3EBDD',
    paper2: '#EDE3D2',
    paper3: '#EEE6D8',
    cream: '#F8F4EC',
    shell: '#1F201C',
    header: '#232420',
    sidebar: '#242520',
    card: '#282923',
    card2: '#30312C',
    card3: '#373832',
    t1: '#F5EFE4',
    t2: '#BDB5A7',
    t3: '#A39F94',
    ink: '#282923',
    ink2: '#5F5C53',
    inkMuted: '#6B685E',
    blue: '#8798B7',
    sage: '#9BB59F',
    lav: '#A79BC4',
    clay: '#C6927D',
    gold: '#D1B46A',
    gray: '#77776E',
    blueT: '#A9B7D0',
    sageT: '#B4CCB8',
    lavT: '#BDB2D6',
    clayT: '#E3A28E',
    goldT: '#E0C77F',
    grayT: '#A8A498',
    line: '#4A4A42',
    track: '#45463F',
    lineLight: '#D4C8B8',
  },

  // Glass & Shadow
  glass: {
    paper: 'rgba(255, 250, 241, 0.72)',
    cool: 'rgba(238, 242, 245, 0.68)',
    warm: 'rgba(238, 228, 213, 0.68)',
    dark: 'rgba(32, 33, 30, 0.88)',
    shadow: 'rgba(40, 34, 27, 0.12)',
    shadowSoft: 'rgba(61, 54, 44, 0.10)',
  },

  // Chips & Badges
  chips: {
    system: { bg: '#E6EDF5', text: '#46597A', border: '#D5E0EC' },
    target: { bg: '#E6EDF5', text: '#46597A', border: '#D5E0EC' },
    verified: { bg: '#E3EFE5', text: '#4C6650', border: '#CFE2D2' },
    pace: { bg: '#F1E7CF', text: '#6F5522', border: '#E6D8B5' },
    ai: { bg: '#ECE7F4', text: '#5E5277', border: '#DDD5EA' },
  },

  // Floating Orbs Distribution (Section 07)
  orbFamilies: [
    { name: 'beige', fill: '#D8C6A8', highlight: '#EFE7D8', weight: 0.25 },
    { name: 'blue', fill: '#91A1C3', highlight: '#DDE5F5', weight: 0.25 },
    { name: 'sage', fill: '#A9B8A1', highlight: '#E5EDE0', weight: 0.20 },
    { name: 'clay', fill: '#C99782', highlight: '#F4DDD5', weight: 0.20 },
    { name: 'gold', fill: '#D8BC79', highlight: '#F7ECC8', weight: 0.10 },
  ],

  // Dark Mode Tokens (Section 16)
  darkMode: {
    bg: '#1B1C19',
    surface: '#242520',
    raised: '#2E302B',
    text: '#F4EDE1',
    muted: '#BDB5A6',
    border: '#3B3E36',
    accentBlue: '#9FB0D3',
    accentSage: '#B0BFA9',
    accentClay: '#D3A18B',
    accentGold: '#E0C57F',
    accentEarth: '#C2AA8C',
  }
} as const;

export const visualTokens = {
  colors: avenzaColors,
  themes: {
    bright: {
      id: 'warm-paper',
      name: 'Warm Paper Daylight',
      bg: {
        base: avenzaColors.paper.base,
        surface: avenzaColors.paper.light,
        elevated: '#FFFFFF',
        muted: avenzaColors.paper.deep,
        panel: avenzaColors.glass.paper,
        glassBorder: avenzaColors.decorative.line,
        cardBorder: avenzaColors.decorative.line,
      },
      ink: avenzaColors.ink,
      shadows: {
        soft: '0 10px 30px -10px rgba(40, 34, 27, 0.08), 0 4px 12px rgba(40, 34, 27, 0.04)',
        floating: '0 20px 40px -15px rgba(40, 34, 27, 0.12), 0 8px 20px rgba(40, 34, 27, 0.06)',
        glass: '0 8px 32px 0 rgba(40, 34, 27, 0.10), inset 0 0 0 1px rgba(255, 255, 255, 0.85)',
      }
    },
    dark: {
      id: 'warm-charcoal',
      name: 'Warm Charcoal Dark',
      bg: {
        base: avenzaColors.darkMode.bg,
        surface: avenzaColors.darkMode.surface,
        elevated: avenzaColors.darkMode.raised,
        muted: '#171815',
        panel: 'rgba(36, 37, 32, 0.85)',
        glassBorder: 'rgba(255, 255, 255, 0.12)',
        cardBorder: avenzaColors.darkMode.border,
      },
      ink: {
        primary: avenzaColors.darkMode.text,
        secondary: '#D2C9BB',
        muted: avenzaColors.darkMode.muted,
        blue: avenzaColors.darkMode.accentBlue,
        sage: avenzaColors.darkMode.accentSage,
        clay: avenzaColors.darkMode.accentClay,
        gold: avenzaColors.darkMode.accentGold,
        earth: avenzaColors.darkMode.accentEarth,
      },
      shadows: {
        soft: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        floating: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.12)',
      }
    }
  },
  typography: {
    mono: "'JetBrains Mono', 'Space Mono', monospace",
    sans: "'Inter', system-ui, -apple-system, sans-serif",
  },
  timing: {
    quick: 0.2,
    normal: 0.45,
    slow: 0.8,
    glitchDuration: 0.38,
  }
} as const;

export type VisualThemeMode = 'bright' | 'dark';
