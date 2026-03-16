/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        muji: {
          white: '#F5F0EB',
          cream: '#EDE8E1',
          charcoal: '#3C3C3C',
          linen: '#B8B0A8',
          border: '#D8D2CA',
          text: '#2C2C2C',
          'text-light': '#7A7A7A',
          red: '#C53D43',
        },
        success: {
          DEFAULT: '#5A8A6A',
          bg: '#EDF3EF',
        },
        warning: {
          DEFAULT: '#B8860B',
          bg: '#FBF6E9',
        },
        info: {
          DEFAULT: '#4A6FA5',
          bg: '#EBF0F8',
        },
        critical: {
          DEFAULT: '#C53D43',
          bg: '#FDF1F1',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        sm: ['0.875rem', { lineHeight: '1.6', letterSpacing: '0' }],
        base: ['1rem', { lineHeight: '1.45', letterSpacing: '-0.005em' }],
        lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        xl: ['1.375rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        '2xl': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '3px',
        md: '4px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(60, 60, 60, 0.04)',
        sm: '0 1px 3px rgba(60, 60, 60, 0.06), 0 1px 2px rgba(60, 60, 60, 0.04)',
        DEFAULT: '0 4px 6px rgba(60, 60, 60, 0.05), 0 2px 4px rgba(60, 60, 60, 0.04)',
        md: '0 4px 6px rgba(60, 60, 60, 0.05), 0 2px 4px rgba(60, 60, 60, 0.04)',
        lg: '0 10px 15px rgba(60, 60, 60, 0.06), 0 4px 6px rgba(60, 60, 60, 0.04)',
        inner: 'inset 0 1px 3px rgba(60, 60, 60, 0.06)',
        none: 'none',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        200: '200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
