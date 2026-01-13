/**
 * Server-side type augmentation for nuxt-auth-utils
 */

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
