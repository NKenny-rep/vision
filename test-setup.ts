// test-setup.ts
import { vi } from 'vitest'
import { ref } from 'vue'

// Create a mock fetch function that can be imported
export const mockFetch = vi.fn(() => Promise.resolve({}))

// Set it globally
global.$fetch = mockFetch

// Mock ofetch module
vi.mock('ofetch', () => ({
  $fetch: mockFetch,
  default: mockFetch,
}))

// Mock Nuxt Composables
vi.mock('#app', async () => {
  const { ref, computed } = await import('vue')
  const actual = await vi.importActual('#app')
  
  // Create a simple Nuxt app mock
  const nuxtAppMock = {
    $i18n: {
      t: vi.fn((key: string) => key),
      locale: ref('en'),
    },
    provide: vi.fn(),
    hook: vi.fn(),
    _nuxtIdCounter: { current: 0 },
    _scope: {
      run: (fn: any) => fn(),
    },
    versions: {},
  }
  
  return {
    ...actual,
    useNuxtApp: vi.fn(() => nuxtAppMock),
    useState: vi.fn((key: string, init?: () => any) => {
      const state = ref(init ? init() : undefined)
      return state
    }),
    useRuntimeConfig: vi.fn(() => ({
      public: {
        omdbBaseUrl: 'http://mock-omdb-api.com',
      },
      omdbApiKey: 'mock-api-key',
    })),
    useRoute: vi.fn(() => ({
      query: {},
      params: {},
    })),
    navigateTo: vi.fn(),
    createError: vi.fn((options) => {
      const error = new Error(options.message || 'Mock Error');
      (error as any).statusCode = options.statusCode || 500;
      return error;
    }),
    useFetch: vi.fn((url: string, options?: any) => {
      return {
        data: ref(null),
        error: ref(null),
        status: ref('idle'),
        refresh: vi.fn(),
        execute: vi.fn(),
        pending: ref(false),
      }
    }),
    useAsyncData: vi.fn((key: string, handler: () => any, options?: any) => {
      return {
        data: ref(null),
        error: ref(null),
        status: ref('idle'),
        refresh: vi.fn(),
        execute: vi.fn(),
        pending: ref(false),
      }
    }),
  }
})

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      query: {},
      params: {},
    })),
    navigateTo: vi.fn(),
  }
})

// Mock Nuxt-Auth-Utils - Simple mock that doesn't require Nuxt instance
vi.mock('nuxt-auth-utils', async () => {
  const { ref } = await import('vue')
  return {
    useUserSession: vi.fn(() => {
      const loggedIn = ref(false)
      const session = ref(null)
      const user = ref(null)
      return {
        loggedIn,
        session,
        user,
        clear: vi.fn(async () => {
          loggedIn.value = false
          session.value = null
          user.value = null
        }),
        fetch: vi.fn(async () => {
          // Default behavior - can be overridden in tests
        }),
      }
    }),
    getUserSession: vi.fn(() => Promise.resolve({
      user: { id: 1, email: 'test@example.com', roleId: 1 }
    })),
  }
})

// Mock @nuxtjs/i18n
vi.mock('@nuxtjs/i18n', () => ({
  useI18n: vi.fn(() => ({
    t: vi.fn((key) => key), // Simple mock: returns the key itself
    locale: ref('en'),
    locales: ref([{ code: 'en', name: 'English' }, { code: 'es', name: 'Español' }]),
    setLocale: vi.fn(),
    getLocalePath: vi.fn((path) => path),
  })),
  useLocalePath: vi.fn(() => vi.fn((path: string) => path)),
}))

// Mock useToastNotification
vi.mock('~/composables/useToastNotification', () => ({
  useToastNotification: vi.fn(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  })),
}))

// Mock useAppRoutes
vi.mock('~/composables/useAppRoutes', () => ({
  useAppRoutes: vi.fn(() => ({
    admin: {
      users: vi.fn(() => '/admin/users'),
      videos: vi.fn(() => '/admin/videos'),
      analytics: vi.fn(() => '/admin/analytics'),
    },
    auth: {
      login: vi.fn(() => '/auth/login'),
      register: vi.fn(() => '/auth/register'),
    },
    user: {
      profile: vi.fn(() => '/user/profile'),
      browse: vi.fn(() => '/browse'),
    },
    // Add other routes as needed
  })),
}))

// Mock $fetch for API calls - Define it globally
global.$fetch = vi.fn(() => Promise.resolve({}))

// Mock H3 utilities for server routes
vi.mock('h3', () => ({
  defineEventHandler: vi.fn((handler) => handler),
  getQuery: vi.fn(() => ({})),
  getRouterParam: vi.fn(() => ''),
  readBody: vi.fn(() => Promise.resolve({})),
  createError: vi.fn((options) => {
    const error = new Error(options.message || 'Mock Error');
    (error as any).statusCode = options.statusCode || 500;
    return error;
  }),
  setResponseStatus: vi.fn(),
}))

// Mock Nuxt utils for server (e.g., useRuntimeConfig)
vi.mock('#imports', async () => {
  const actual = await vi.importActual('#imports')
  return {
    ...actual,
    useRuntimeConfig: vi.fn(() => ({
      public: {
        omdbBaseUrl: 'http://mock-omdb-api.com',
      },
      omdbApiKey: 'mock-api-key',
    })),
  }
})
