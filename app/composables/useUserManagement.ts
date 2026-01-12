import type { User, UserFormData, UserFilters, PaginatedResponse } from '~/types'

export interface IUserRepository {
  getUsers(filters: UserFilters): Promise<PaginatedResponse<User>>
  getUser(id: number): Promise<User>
  createUser(data: UserFormData): Promise<User>
  updateUser(id: number, data: Partial<UserFormData>): Promise<User>
  deleteUser(id: number): Promise<void>
}

class UserApiAdapter implements IUserRepository {
  async getUsers(filters: UserFilters): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams()
    
    // Build query string from filters
    if (filters.page) queryParams.append('page', filters.page.toString())
    if (filters.limit) queryParams.append('limit', filters.limit.toString())
    if (filters.search) queryParams.append('search', filters.search)
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)

    return await $fetch(`/api/admin/users?${queryParams.toString()}`)
  }

  async getUser(id: number): Promise<User> {
    return await $fetch(`/api/admin/users/${id}`)
  }

  async createUser(userData: UserFormData): Promise<User> {
    const response = await $fetch('/api/admin/users', {
      method: 'POST',
      body: userData,
    })

    return (response as any).data
  }

  async updateUser(id: number, userData: Partial<UserFormData>): Promise<User> {
    const response = await $fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: userData,
    })

    return (response as any).data
  }

  async deleteUser(id: number): Promise<void> {
    await $fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    })
  }
}

export const useUserManagement = (repository: IUserRepository = new UserApiAdapter()) => {
  // State
  const users = ref<User[]>([])
  const selectedUser = ref<User | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const filters = ref<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await repository.getUsers(filters.value)
      users.value = response.data
      pagination.value = response.pagination
    } catch (e) {
      // Extract error message from Error object
      error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      selectedUser.value = await repository.getUser(id)
    } catch (e) {
      // Extract error message from Error object
      error.value = e instanceof Error ? e.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData: UserFormData) => {
    loading.value = true
    error.value = null

    try {
      await repository.createUser(userData)
      await fetchUsers() // Refresh list
      return true
    } catch (e) {
      // Extract error message from Error object
      error.value = e instanceof Error ? e.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, userData: Partial<UserFormData>) => {
    loading.value = true
    error.value = null

    try {
      await repository.updateUser(id, userData)
      await fetchUsers() // Refresh list
      return true
    } catch (e) {
      // Extract error message from Error object
      error.value = e instanceof Error ? e.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await repository.deleteUser(id)
      await fetchUsers() // Refresh list
      return true
    } catch (e) {      // Extract error message from Error object      error.value = e instanceof Error ? e.message : 'An error occurred'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateFilters = async (newFilters: Partial<UserFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
    await fetchUsers()
  }

  const changePage = async (page: number) => {
    filters.value.page = page
    await fetchUsers()
  }

  const searchUsers = async (searchTerm: string) => {
    filters.value.search = searchTerm
    filters.value.page = 1 // Reset to first page
    await fetchUsers()
  }

  const clearError = () => {
    error.value = null
  }

  return {
    users: readonly(users),
    selectedUser: readonly(selectedUser),
    pagination: readonly(pagination),
    filters: readonly(filters),
    loading: readonly(loading),
    error: readonly(error),
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    updateFilters,
    changePage,
    searchUsers,
    clearError,
  }
}
