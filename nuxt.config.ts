// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/ui', 'nuxt-auth-utils', '@nuxtjs/i18n', '@nuxt/eslint'],
  
  eslint: {
    config: {
      stylistic: false,
    },
  },
  
  runtimeConfig: {
    // Server-only keys (never sent to client)
    omdbApiKey: process.env.OMDB_API || '',
    
    // Public keys (exposed to client)
    public: {
      omdbBaseUrl: process.env.OMDB_URL || 'http://www.omdbapi.com/',
      omdbPosterUrl: process.env.OMDB_POSTER_URL || 'http://img.omdbapi.com/',
    }
  },
  
  colorMode: {
    preference: 'dark'
  },

  ui: {
    primary: 'orange',
    gray: 'neutral'
  },

  app: {
    head: {
      title: 'VideoVision - Stream Unlimited Movies & TV Shows',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { 
          name: 'description', 
          content: 'Watch anywhere. Cancel anytime. Join VideoVision today and enjoy unlimited streaming.' 
        },
        { name: 'theme-color', content: '#000000' }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      htmlAttrs: {
        lang: 'en'
      }
    }
  },

  // i18n Configuration
  i18n: {
    
    // 2. Directory where your JSON files are located
    langDir: 'locales/', 
    
    // 3. Define the available languages and their files
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      },
      {
        code: 'es',
        iso: 'es-ES',
        file: 'es.json',
        name: 'Español'
      }
    ],
    
    defaultLocale: 'en',
    strategy: 'prefix_except_default', // /es for spanish, / for english
    //strategy: 'no_prefix',
    
    // Enable cookie detection and persistence
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
      cookieCrossOrigin: false,
      cookieSecure: false,
    }
  },

  // Auto-imports configuration for Nuxt 4 app directory  
  imports: {
    dirs: [
      'composables',
      'composables/**',
    ]
  }
})