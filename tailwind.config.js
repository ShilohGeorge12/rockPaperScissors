/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Theme Color Palettes ──────────────────────────
      colors: {
        // Dark Premium Theme
        dark: {
          50: '#f0f0f5',
          100: '#d4d4e0',
          200: '#a8a8c0',
          300: '#7c78a0',
          400: '#5a5580',
          500: '#3d3560',
          600: '#2a2348',
          700: '#1a1533',
          800: '#0f0d20',
          900: '#080814',
          950: '#04040a',
        },
        // Neon Retro Theme
        neon: {
          pink: '#ff2d78',
          blue: '#00d4ff',
          green: '#39ff14',
          yellow: '#fff01f',
          purple: '#bf00ff',
          orange: '#ff6b00',
        },
        // Vibrant Accent Colors
        accent: {
          rock: '#ff4757',
          paper: '#3742fa',
          scissors: '#ffa502',
          win: '#2ed573',
          lose: '#ff4757',
          tie: '#ffa502',
          gold: '#ffd700',
          purple: '#8b5cf6',
          blue: '#3b82f6',
        },
      },

      // ── Typography ────────────────────────────────────
      fontFamily: {
        display: ['"BarlowSemiCondensed"', 'Impact', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'xs2': ['0.75rem', { lineHeight: '1rem' }],
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },

      // ── Spacing Scale ─────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },

      // ── Border Radius ─────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },

      // ── Box Shadows ───────────────────────────────────
      boxShadow: {
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.3)',
        'glow': '0 0 20px rgba(139, 92, 246, 0.4)',
        'glow-lg': '0 0 40px rgba(139, 92, 246, 0.5)',
        'glow-rock': '0 0 20px rgba(255, 71, 87, 0.5)',
        'glow-paper': '0 0 20px rgba(55, 66, 250, 0.5)',
        'glow-scissors': '0 0 20px rgba(255, 165, 2, 0.5)',
        'glow-win': '0 0 30px rgba(46, 213, 115, 0.5)',
        'glow-gold': '0 0 30px rgba(255, 215, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'elevated': '0 20px 60px -15px rgba(0, 0, 0, 0.5)',
        'neon-pink': '0 0 10px #ff2d78, 0 0 40px #ff2d78',
        'neon-blue': '0 0 10px #00d4ff, 0 0 40px #00d4ff',
        'neon-green': '0 0 10px #39ff14, 0 0 40px #39ff14',
      },

      // ── Animations ────────────────────────────────────
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'particle': 'particle 1s ease-out forwards',
        'confetti': 'confetti 1.5s ease-out forwards',
      },

      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: 0, transform: 'translateY(-30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'bounce-in': {
          '0%': { opacity: 0, transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'morph': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'particle': {
          '0%': { opacity: 1, transform: 'translateY(0) scale(1)' },
          '100%': { opacity: 0, transform: 'translateY(-100px) scale(0)' },
        },
        'confetti': {
          '0%': { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
          '100%': { opacity: 0, transform: 'translateY(200px) rotate(720deg)' },
        },
      },

      // ── Background Image ──────────────────────────────
      backgroundSize: {
        '300%': '300% 300%',
      },

      // ── Transitions ───────────────────────────────────
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '600': '600ms',
        '800': '800ms',
      },

      // ── Screens ───────────────────────────────────────
      screens: {
        'xsm': '300px',
        'se': '375px',
        'xs': '390px',
        'xr': '414px',
        'sm': '640px',
        'md': '768px',
        'lmd': '820px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};
