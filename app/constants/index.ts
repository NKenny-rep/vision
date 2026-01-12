/**
 * Application Constants
 */

import { AUTH_ROUTES, USER_ROUTES, ADMIN_ROUTES } from './routes'
export * from './routes'

export const AVATAR_STYLES = [
  'adventurer',
  'avataaars',
  'big-ears',
  'bottts',
  'lorelei',
  'micah',
  'pixel-art',
  'personas'
] as const

export const CARD_BRANDS = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'discover', label: 'Discover' },
] as const

export const NAV_LINKS = {
  AUTHENTICATED: [
    { path: USER_ROUTES.BROWSE, labelKey: 'nav.browse' },
    { path: USER_ROUTES.MY_LIST, labelKey: 'nav.myList' },
  ],
  ADMIN: {
    path: ADMIN_ROUTES.DASHBOARD,
    labelKey: 'nav.admin',
    icon: 'i-heroicons-cog-6-tooth'
  },
  LOGOUT: {
    labelKey: 'nav.signOut',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    variant: 'ghost' as const,
    size: 'lg' as const
  },
  GUEST: [
    { 
      path: AUTH_ROUTES.LOGIN, 
      labelKey: 'nav.signIn',
      ariaLabelKey: 'auth.login.title',
      variant: 'ghost' as const,
      size: 'lg' as const
    },
    { 
      path: AUTH_ROUTES.LOGIN, 
      labelKey: 'landing.hero.buttonText',
      ariaLabelKey: 'landing.hero.buttonText',
      variant: 'primary' as const,
      size: 'lg' as const
    }
  ]
} as const

export const BROWSE = {
  MAX_GENRE_CATEGORIES: 6,
  FEATURED_MOVIES: [
    'The Matrix',
    'Inception',
    'Interstellar',
    'The Dark Knight',
    'John Wick',
    'Mad Max: Fury Road',
    'Die Hard',
    'Mission: Impossible',
    'Blade Runner',
    'Arrival',
    'Ex Machina',
    'Dune',
    'The Shawshank Redemption',
    'Pulp Fiction',
    'Forrest Gump',
    'The Godfather',
    'Fight Club',
    'Avatar',
    'The Avengers',
  ],
  MOVIE_PLOT_TYPE: 'short' as const,
} as const
