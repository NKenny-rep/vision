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
    extend: {},
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
          color: theme('colors.orange.500'),
          '&:hover': {
            backgroundColor: 'rgba(234, 88, 12, 0.1)',
          },
        },
        '.icon-btn-danger': {
          color: theme('colors.red.500'),
          '&:hover': {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
          },
        },
      })
    }),
  ],
} satisfies Config
