/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4: target all source files
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // ─── Brand Color Palette ───────────────────────────────────────────────
      colors: {
        // Primary green (Eco / EcoService brand)
        primary: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',  // Main brand green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Earth tones (Customer profile accent)
        earth: {
          50:  '#fdf8f0',
          100: '#fcecd8',
          200: '#f9d5a7',
          300: '#f4b56a',
          400: '#ee8c2e',
          500: '#e87010',  // Main earth orange
          600: '#d95a09',
          700: '#b4430c',
          800: '#903612',
          900: '#762e13',
          950: '#40140a',
        },
        // Neutral dark (backgrounds)
        surface: {
          DEFAULT: '#0d1117',
          raised: '#161b22',
          overlay: '#21262d',
          border: '#30363d',
        },
        // Semantic tokens
        success: '#22c55e',
        warning: '#f59e0b',
        error:   '#ef4444',
        info:    '#3b82f6',
      },

      // ─── Typography Scale ──────────────────────────────────────────────────
      fontFamily: {
        sans:  ['Inter_400Regular', 'system-ui', 'sans-serif'],
        medium:['Inter_500Medium', 'system-ui', 'sans-serif'],
        semi:  ['Inter_600SemiBold', 'system-ui', 'sans-serif'],
        bold:  ['Inter_700Bold', 'system-ui', 'sans-serif'],
      },

      // ─── Spacing & Border Radius ───────────────────────────────────────────
      borderRadius: {
        xl:  '16px',
        '2xl': '20px',
        '3xl': '28px',
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.35)',
        glow: '0 0 20px rgba(34, 197, 94, 0.25)',
      },
    },
  },
  plugins: [],
};
