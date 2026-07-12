/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: '#0A0A0B',
        surface: '#121214',
        'surface-raised': '#27272A',
        'accent-signal': '#3B82F6', /* Vibrant Blue for actions */
        'status-available': '#10B981', /* Emerald */
        'status-shop': '#F59E0B', /* Amber */
        'status-retired': '#52525B', /* Zinc 600 */
        'text-primary': '#FAFAFA', /* Zinc 50 */
        'text-secondary': '#A1A1AA', /* Zinc 400 */
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
