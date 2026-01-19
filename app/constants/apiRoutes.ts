export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login' as string,
    REGISTER: '/api/auth/register' as string,
  },
  MOVIES: {
    SEARCH: '/api/movies/search' as string,
    DETAIL: (idOrTitle: string): string => `/api/movies/${encodeURIComponent(idOrTitle)}`,
  },
  REVIEWS: {
    LIST: (contentId: string): string => `/api/reviews/${contentId}`,
    CREATE: '/api/reviews' as string,
    UPDATE: (id: string): string => `/api/reviews/${id}`,
    DELETE: (id: string): string => `/api/reviews/${id}`,
    TOGGLE_LIKE: (reviewId: string): string => `/api/reviews/${reviewId}/like`,
  },
  USER: {
    PROFILE: '/api/user/profile' as string,
    PROFILE_UPDATE: '/api/user/profile/update' as string,
    SUBSCRIPTION: '/api/user/subscription' as string,
    SUBSCRIPTION_CHANGE_PLAN: '/api/user/subscription/change-plan' as string,
    SUBSCRIPTION_CANCEL: '/api/user/subscription/cancel' as string,
    PAYMENT_TYPES: '/api/payment-types' as string,
    PAYMENT_METHODS_ADD: '/api/user/payment-methods/add' as string,
    PAYMENT_METHODS_REMOVE: '/api/user/payment-methods/remove' as string,
    MOVIE_LIST: '/api/user/movie-list' as string,
    MOVIE_LIST_CHECK: '/api/user/movie-list/check' as string,
    MOVIE_LIST_ADD: '/api/user/movie-list/add' as string,
    MOVIE_LIST_REMOVE: '/api/user/movie-list/remove' as string,
  },
  ADMIN: {
    USERS: '/api/admin/users' as string,
    USER_DETAIL: (id: number): string => `/api/admin/users/${id}`,
  },
}
