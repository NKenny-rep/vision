/**
 * User Helper Utilities
 */

import { capitalize } from './formatters'

type UserLike = {
  id?: string | number
  email?: string
  userName?: string
  fullName?: string
  avatar?: string | null
  roles?: string[]
}

export function getUserDisplayName(user: UserLike | null | undefined): string {
  if (!user) return 'Anonymous'
  if (user.fullName) return user.fullName
  return user.email?.split('@')[0] || 'User'
}

export function getUserInitials(user: UserLike | null | undefined): string {
  if (!user?.fullName) return 'U'
  return user.fullName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Get initials from a name string
 */
export function getInitialsFromName(name: string | null | undefined): string {
  if (!name) return 'U'
  return name
    .trim()
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getUserAvatar(user: UserLike | null | undefined): string | null {
  if (!user?.avatar) return null
  return user.avatar
}

export function isUserAdmin(user: UserLike | null | undefined): boolean {
  return user?.roles?.includes('admin') || false
}

export function getUserRole(user: UserLike | null | undefined): string {
  if (!user?.roles || user.roles.length === 0) return 'Guest'
  const primaryRole = user.roles[0]
  return primaryRole ? capitalize(primaryRole) : 'Guest'
}
