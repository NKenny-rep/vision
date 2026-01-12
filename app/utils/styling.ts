/**
 * Styling utilities for badges and status indicators
 * Centralized styling logic following DRY principle
 */

export const getRoleBadgeClass = (roleName?: string) => {
  const role = roleName?.toLowerCase()
  return {
    'bg-orange-500/20 text-orange-500': role === 'admin',
    'bg-blue-500/20 text-blue-500': role === 'user',
    'bg-purple-500/20 text-purple-500': role === 'moderator',
  }
}

export const getStatusBadgeClass = (status: string) => {
  const normalizedStatus = status.toLowerCase()
  return {
    'bg-green-500/20 text-green-500': normalizedStatus === 'active' || normalizedStatus === 'success',
    'bg-yellow-500/20 text-yellow-500': normalizedStatus === 'pending' || normalizedStatus === 'warning',
    'bg-red-500/20 text-red-500': normalizedStatus === 'inactive' || normalizedStatus === 'error' || normalizedStatus === 'cancelled',
    'bg-gray-500/20 text-gray-500': normalizedStatus === 'draft',
  }
}
