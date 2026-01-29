import type { User } from '~/types'
import { API_ROUTES } from '~/constants/apiRoutes'

export const useUserDetails = (userId?: number) => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref(false)

  const getUserDetails = async (id: number) => {
    loading.value = true
    error.value = false
    
    try {
      const { data, error: fetchError } = await useFetch<User>(API_ROUTES.ADMIN.USER_DETAIL(id))
      
      if (fetchError.value) {
        throw createError({
          statusCode: fetchError.value.statusCode || 404,
          message: fetchError.value.message || 'User not found'
        })
      }
      
      user.value = data.value ?? null
      return data.value
    } catch (e) {
      error.value = true
      throw e
    } finally {
      loading.value = false
    }
  }

  if (userId) {
    getUserDetails(userId)
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    getUserDetails
  }
}
