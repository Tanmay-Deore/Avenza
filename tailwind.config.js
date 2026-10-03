/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        av: {
          paper: 'var(--av-paper)',
          'paper-deep': 'var(--av-paper-deep)',
          'paper-light': 'var(--av-paper-light)',
          'cream-text': 'var(--av-cream-text)',
          black: 'var(--av-black)',
          'black-2': 'var(--av-black-2)',
          'black-3': 'var(--av-black-3)',
          panel: 'var(--av-panel)',
          'panel-2': 'var(--av-panel-2)',
          'panel-input': 'var(--av-panel-input)',
          'panel-line': 'var(--av-panel-line)',
          earth: 'var(--av-earth)',
          sage: 'var(--av-sage)',
          blue: 'var(--av-blue)',
          clay: 'var(--av-clay)',
          gold: 'var(--av-gold)',
          text: 'var(--av-text)',
          'text-2': 'var(--av-text-2)',
          'text-muted': 'var(--av-text-muted)',
          'blue-ink': 'var(--av-blue-ink)',
          'sage-ink': 'var(--av-sage-ink)',
          'clay-ink': 'var(--av-clay-ink)',
          'gold-ink': 'var(--av-gold-ink)',
          'earth-ink': 'var(--av-earth-ink)',
          subtle: 'var(--av-subtle)',
          line: 'var(--av-line)',
          'line-strong': 'var(--av-line-strong)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Space Mono', 'Fira Code', 'Courier New', 'monospace'],
        manrope: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        'ibm-plex-mono': ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
