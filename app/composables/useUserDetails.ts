export const useUserDetails = () => {
  const getUserDetails = async (userId: number) => {
    const { data, error } = await useFetch(`/api/admin/users/${userId}`)
    
    if (error.value) {
      throw createError({
        statusCode: error.value.statusCode || 404,
        message: error.value.message || 'User not found'
      })
    }
    
    return data.value
  }

  return {
    getUserDetails
  }
}
