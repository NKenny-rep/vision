import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316', // orange-500
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        surface: {
          DEFAULT: '#1f2937', // gray-800
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        danger: {
          DEFAULT: '#dc2626', // red-600
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
    },
  },
  plugins: [
    plugin(({ addComponents, theme }) => {
      addComponents({
        // Layout utilities
        '.flex-center': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.flex-between': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        '.flex-start': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        '.flex-end': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        },
        
        // Spacing utilities
        '.stack-2': {
          '& > * + *': {
            marginTop: theme('spacing.2'),
          },
        },
        '.stack-3': {
          '& > * + *': {
            marginTop: theme('spacing.3'),
          },
        },
        '.stack-4': {
          '& > * + *': {
            marginTop: theme('spacing.4'),
          },
        },
        
        // Icon button utilities
        '.icon-btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: theme('spacing.2'),
          borderRadius: theme('borderRadius.md'),
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
        },
        '.icon-btn-primary': {
          color: theme('colors.primary.DEFAULT'),
          '&:hover': {
            backgroundColor: theme('colors.primary.600', '0.1'),
          },
        },
        '.icon-btn-danger': {
          color: theme('colors.danger.500'),
          '&:hover': {
            backgroundColor: theme('colors.danger.500', '0.1'),
          },
        },
      })
    }),
  ],
} satisfies Config
