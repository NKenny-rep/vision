/**
 * Type augmentation for nuxt-auth-utils
 * Extends the User type from nuxt-auth-utils to match our app's User interface
 * This ensures compatibility with userHelpers and other utilities
 */

import type { UserRole } from './index'

declare module '#auth-utils' {
  interface User {
    id: number
    email: string
    name: string
    avatar?: string | null
    phone?: string | null
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  interface UserSession {
    user: User
    loggedInAt: Date | string
  }
}

export {}
