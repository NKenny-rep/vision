/**
 * Application Routes
 */

export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
} as const

export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const

export const USER_ROUTES = {
  BROWSE: '/browse',
  SEARCH: '/search',
  MY_LIST: '/movie-list',
  PROFILE: '/profile',
  WATCH: (id: string) => `/watch/${id}` as const,
} as const

export const ADMIN_ROUTES = {
  DASHBOARD: '/dashboard',
  USERS: '/dashboard/users',
  VIDEOS: '/dashboard/videos',
  ANALYTICS: '/dashboard/analytics',
} as const

export const REDIRECT_PATHS = {
  AFTER_LOGIN: USER_ROUTES.BROWSE,
  AFTER_LOGOUT: PUBLIC_ROUTES.HOME,
  AFTER_REGISTER: USER_ROUTES.BROWSE,
  UNAUTHORIZED: AUTH_ROUTES.LOGIN,
  FORBIDDEN: USER_ROUTES.BROWSE,
} as const

export const LEGAL_ROUTES = {
  PRIVACY_POLICY: '/privacy',
  TERMS_OF_SERVICE: '/terms',
  COOKIE_POLICY: '/cookies',
  HELP_CENTER: '/help',
} as const

export const buildRoute = {
  watch: (imdbId: string) => `/watch/${imdbId}`,
  userProfile: (userId: string) => `/profile/${userId}`,
  adminUser: (userId: string) => `/dashboard/users/${userId}`,
} as const

export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...USER_ROUTES,
  ...ADMIN_ROUTES,
  ...LEGAL_ROUTES,
  REDIRECT: REDIRECT_PATHS,
  BUILD: buildRoute,
} as const
