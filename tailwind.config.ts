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
        secondary: '#4A6A8A',
        accent: '#1A7ACF',
        success: '#059669',
        'success-light': '#D1FAE5',
        warning: '#D97706',
        'warning-light': '#FEF3C7',
        danger: '#DC2626',
        'danger-light': '#FEE2E2',
        surface: '#F4F6FA',
        'surface-tertiary': '#EBF2FF',
        border: '#E2EAF4',
        text: {
          DEFAULT: '#0C1F35',
          secondary: '#4A6A8A',
          muted: '#8AAAC5',
        },
      },
      fontFamily: {
        display: ['var(--font-sora)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
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
      },
      boxShadow: {
        'ocean-sm': '0 2px 8px rgba(11, 94, 168, 0.08)',
        'ocean-md': '0 4px 20px rgba(11, 94, 168, 0.12)',
        'ocean-lg': '0 8px 40px rgba(11, 94, 168, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
