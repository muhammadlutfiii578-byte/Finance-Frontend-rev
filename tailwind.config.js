/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: {
          DEFAULT: '#FAFAF9',
          dark: '#0E0F11',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#17181B',
          subtle: '#F4F4F3',
          'subtle-dark': '#1F2023',
        },
        ink: {
          DEFAULT: '#14151A',
          dark: '#F3F3F2',
          muted: '#6B6D76',
          'muted-dark': '#9A9CA5',
        },
        line: {
          DEFAULT: '#E8E8E6',
          dark: '#2A2B2F',
        },
        brand: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          400: '#5C8DFF',
          500: '#3D6BFF',
          600: '#2A4FE0',
          700: '#1F3BB3',
        },
        income: {
          DEFAULT: '#16A34A',
          soft: '#DCFCE7',
          'soft-dark': '#0F2A1B',
        },
        expense: {
          DEFAULT: '#E2462C',
          soft: '#FCE7E2',
          'soft-dark': '#321712',
        },
        warn: {
          DEFAULT: '#D97706',
          soft: '#FEF3C7',
        },
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(20,21,26,0.04), 0 8px 24px -12px rgba(20,21,26,0.08)',
        'soft-dark': '0 1px 2px rgba(0,0,0,0.2), 0 8px 24px -12px rgba(0,0,0,0.5)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
