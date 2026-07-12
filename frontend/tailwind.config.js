/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Layout tokens (hex — Tailwind JIT can resolve these)
        base:            '#0D0F14',
        surface:         '#161A23',
        'surface-raised':'#1E2330',
        'app-border':    '#262B38',
        'text-primary':  '#F5F6F8',
        'text-secondary':'#8B93A7',
        'accent-signal': '#F5A623',
        // These are used in inline styles via STATUS_META, but keep for reference
        'status-available': '#10B981',
        'status-shop':      '#F5A623',
        'status-retired':   '#8B93A7',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans:    ['Inter',           'sans-serif'],
        mono:    ['"JetBrains Mono"','monospace' ],
      },
    },
  },
  plugins: [],
}
