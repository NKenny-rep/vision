import type { User } from '~/types'

// Extended user type for admin details view with subscription info
export interface UserWithDetails extends Omit<User, 'subscription' | 'roleName'> {
  roleName?: string | null
  subscription?: {
    id: number
    name: string
    price: number
    status: string
    startDate: string
    endDate: string | null
    autoRenew: boolean
    quality: string
  } | null
}

export const useUserExpansion = () => {
  const { getUserDetails } = useUserDetails()
  
  const expandedUserDetails = ref<Record<number, UserWithDetails | null>>({})
  const loadingDetails = ref<Record<number, boolean>>({})

  const fetchUserDetails = async (userId: number) => {
    if (expandedUserDetails.value[userId]) {
      return expandedUserDetails.value[userId]
    }

    loadingDetails.value[userId] = true
    try {
      const details = await getUserDetails(userId)
      expandedUserDetails.value[userId] = details ?? null
      return details
    } catch (error) {
      console.error('Failed to load user details:', error)
      expandedUserDetails.value[userId] = null
      return null
    } finally {
      loadingDetails.value[userId] = false
    }
  }

  const clearUserDetails = (userId: number) => {
    const { [userId]: _, ...restDetails } = expandedUserDetails.value
    const { [userId]: __, ...restLoading } = loadingDetails.value
    expandedUserDetails.value = restDetails
    loadingDetails.value = restLoading
  }

  return {
    expandedUserDetails,
    loadingDetails,
    fetchUserDetails,
    clearUserDetails
  }
}
