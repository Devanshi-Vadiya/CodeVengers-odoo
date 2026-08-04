/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Cool gray surface hierarchy ───────────────────────────
        base:             '#F5F7FA',  // cool light-gray body
        'base-mid':       '#EEF1F6',  // slightly deeper gray
        'base-top':       '#E4E9F2',  // hover/active surface
        surface:          '#FFFFFF',  // card white
        'surface-raised': '#F0F4FA',  // input fields, nested panels
        'app-border':     '#E2E8F0',  // cool light border

        // Sidebar — white with border
        sidebar:          '#FFFFFF',

        // ── Typography ───────────────────────────────────────────
        'text-primary':   '#0F172A',  // slate-900
        'text-secondary': '#64748B',  // slate-500

        // ── Brand accent — fresh lime-green ──────────────────────
        'accent-signal':  '#22C55E',  // green-500
        'accent-light':   '#DCFCE7',  // green-100
        'accent-mid':     '#16A34A',  // green-600 (hover)

        // ── Status colors ────────────────────────────────────────
        'status-available':  '#22C55E',  // green
        'status-shop':       '#F59E0B',  // amber (in-shop)
        'status-retired':    '#94A3B8',  // slate
        'status-dispatched': '#3B82F6',  // blue
        'status-cancelled':  '#EF4444',  // red
      },
      fontFamily: {
        display:   ['"Space Grotesk"', 'sans-serif'],
        fraunces:  ['"Fraunces"',      'serif'],
        sans:      ['Inter',           'sans-serif'],
        mono:      ['"JetBrains Mono"','monospace'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
        'hero-green':    'linear-gradient(135deg, #F0FDF4 0%, #BBF7D0 60%, #DCFCE7 100%)',
      },
      boxShadow: {
        'card':       '0 1px 4px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'card-hover': '0 6px 20px rgba(15,23,42,0.10), 0 1px 4px rgba(15,23,42,0.06)',
        'elevated':   '0 4px 16px rgba(15,23,42,0.10), 0 1px 4px rgba(15,23,42,0.06)',
        'sidebar':    '1px 0 0 #E2E8F0',
      },
      borderRadius: {
        'card': '16px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
}
