import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B5EA8',
          mid: '#1A7ACF',
          dark: '#073E72',
          light: '#D6E8FF',
        },
        // Aquatic palette — Apple-meets-pool
        aqua: {
          50: '#ECFBFF',
          100: '#CFF5FF',
          200: '#A2EBFF',
          300: '#6BDCFF',
          400: '#34C8F2',
          500: '#0CB4DB',
          600: '#0894B7',
          700: '#0A7693',
          800: '#0E5A72',
          900: '#0E4458',
        },
        lagoon: {
          DEFAULT: '#06B6A4',
          light: '#9BF1E4',
          dark: '#057E72',
        },
        abyss: {
          DEFAULT: '#0A2540',
          mid: '#13314F',
          deep: '#061A2E',
        },
        mist: '#F4F8FB',
        secondary: '#4A6A8A',
        accent: '#1A7ACF',
        success: '#06B6A4',
        'success-light': '#D1F9F0',
        warning: '#D97706',
        'warning-light': '#FEF3C7',
        danger: '#FF6B6B',
        'danger-light': '#FFE2E2',
        surface: '#F4F8FB',
        'surface-tertiary': '#EBF6FF',
        border: '#E2EAF4',
        text: {
          DEFAULT: '#0A2540',
          secondary: '#4A6A8A',
          muted: '#8AAAC5',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.5rem', { lineHeight: '1.1' }],
        '5xl': ['3.5rem', { lineHeight: '1.05' }],
        '6xl': ['4.5rem', { lineHeight: '1' }],
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
      },
      borderRadius: {
        'xs': '10px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
      },
      boxShadow: {
        'ocean-sm': '0 2px 10px rgba(11, 94, 168, 0.06), 0 1px 2px rgba(11, 94, 168, 0.04)',
        'ocean-md': '0 8px 30px rgba(11, 94, 168, 0.10), 0 2px 6px rgba(11, 94, 168, 0.06)',
        'ocean-lg': '0 18px 50px rgba(11, 94, 168, 0.18), 0 4px 12px rgba(11, 94, 168, 0.08)',
        'glass': '0 10px 40px rgba(10, 37, 64, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
        'aqua-glow': '0 0 0 6px rgba(12, 180, 219, 0.10), 0 12px 30px rgba(12, 180, 219, 0.18)',
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(135deg, #0A2540 0%, #0B5EA8 45%, #0CB4DB 100%)',
        'gradient-ocean-soft': 'linear-gradient(135deg, #1A7ACF 0%, #0CB4DB 100%)',
        'gradient-lagoon': 'linear-gradient(135deg, #0CB4DB 0%, #06B6A4 100%)',
        'gradient-mist': 'linear-gradient(180deg, #F4F8FB 0%, #ECFBFF 100%)',
        'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(236,251,255,0.55) 100%)',
        'water-shine': 'radial-gradient(120% 80% at 30% 20%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-2px,0)' },
          '100%': { transform: 'translate3d(0,0,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        ripple: 'ripple 6s ease-in-out infinite',
        shimmer: 'shimmer 8s linear infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
