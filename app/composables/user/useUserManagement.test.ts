// app/composables/useUserManagement.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useUserManagement, type IUserRepository } from './useUserManagement'
import type { User, UserFormData, PaginatedResponse, UserFilters } from '~/types'

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  roleId: 1,
  createdAt: '2023-01-01',
}

const mockPaginatedUsers: PaginatedResponse<User> = {
  data: [mockUser],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  },
}

const mockUserRepository: IUserRepository = {
  getUsers: vi.fn(() => Promise.resolve(mockPaginatedUsers)),
  getUser: vi.fn(() => Promise.resolve(mockUser)),
  createUser: vi.fn(() => Promise.resolve(mockUser)),
  updateUser: vi.fn(() => Promise.resolve(mockUser)),
  deleteUser: vi.fn(() => Promise.resolve()),
}

describe('useUserManagement', () => {
  let composable: ReturnType<typeof useUserManagement>

  beforeEach(() => {
    vi.clearAllMocks()
    composable = useUserManagement(mockUserRepository)
  })

  // Helper to mount a component and use the composable (for reactivity testing)
  const mountComposable = () => {
    shallowMount(defineComponent({
      setup() {
        composable = useUserManagement(mockUserRepository)
        return () => null
      },
    }))
    return composable
  }

  it('should initialize with default state', () => {
    expect(composable.users.value).toEqual([])
    expect(composable.selectedUser.value).toBeNull()
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(composable.pagination.value).toEqual({ page: 1, limit: 10, total: 0, totalPages: 0 })
    expect(composable.filters.value).toEqual({ page: 1, limit: 10, search: '', sortBy: 'createdAt', sortOrder: 'desc' })
  })

  it('should fetch users successfully', async () => {
    await composable.fetchUsers()

    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(composable.filters.value)
    expect(composable.users.value).toEqual(mockPaginatedUsers.data)
    expect(composable.pagination.value).toEqual(mockPaginatedUsers.pagination)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
  })

  it('should handle error when fetching users', async () => {
    const errorMessage = 'Failed to fetch'
    mockUserRepository.getUsers.mockRejectedValueOnce(new Error(errorMessage))

    await composable.fetchUsers()

    expect(mockUserRepository.getUsers).toHaveBeenCalled()
    expect(composable.users.value).toEqual([])
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBe(errorMessage)
  })

  it('should fetch a single user successfully', async () => {
    await composable.fetchUser(1)

    expect(mockUserRepository.getUser).toHaveBeenCalledWith(1)
    expect(composable.selectedUser.value).toEqual(mockUser)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
  })

  it('should handle error when fetching a single user', async () => {
    const errorMessage = 'User not found'
    mockUserRepository.getUser.mockRejectedValueOnce(new Error(errorMessage))

    await composable.fetchUser(1)

    expect(mockUserRepository.getUser).toHaveBeenCalledWith(1)
    expect(composable.selectedUser.value).toBeNull()
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBe(errorMessage)
  })

  it('should create a user successfully and refresh the list', async () => {
    const newUserData: UserFormData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password',
      roleId: 1,
    }

    const result = await composable.createUser(newUserData)

    expect(mockUserRepository.createUser).toHaveBeenCalledWith(newUserData)
    // Verify fetchUsers was called to refresh the list
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(composable.filters.value)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(result).toBe(true)
  })

  it('should handle error when creating a user', async () => {
    const errorMessage = 'Creation failed'
    mockUserRepository.createUser.mockRejectedValueOnce(new Error(errorMessage))
    const newUserData: UserFormData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password',
      roleId: 1,
    }

    const result = await composable.createUser(newUserData)

    expect(mockUserRepository.createUser).toHaveBeenCalledWith(newUserData)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBe(errorMessage)
    expect(result).toBe(false)
  })

  it('should update a user successfully and refresh the list', async () => {
    const updateData: Partial<UserFormData> = { name: 'Updated Name' }

    const result = await composable.updateUser(1, updateData)

    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(1, updateData)
    // Verify fetchUsers was called to refresh the list
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(composable.filters.value)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(result).toBe(true)
  })

  it('should handle error when updating a user', async () => {
    const errorMessage = 'Update failed'
    mockUserRepository.updateUser.mockRejectedValueOnce(new Error(errorMessage))
    const updateData: Partial<UserFormData> = { name: 'Updated Name' }

    const result = await composable.updateUser(1, updateData)

    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(1, updateData)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBe(errorMessage)
    expect(result).toBe(false)
  })

  it('should delete a user successfully and refresh the list', async () => {
    const result = await composable.deleteUser(1)

    expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(1)
    // Verify fetchUsers was called to refresh the list
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(composable.filters.value)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBeNull()
    expect(result).toBe(true)
  })

  it('should handle error when deleting a user', async () => {
    const errorMessage = 'Deletion failed'
    mockUserRepository.deleteUser.mockRejectedValueOnce(new Error(errorMessage))

    const result = await composable.deleteUser(1)

    expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(1)
    expect(composable.loading.value).toBe(false)
    expect(composable.error.value).toBe(errorMessage)
    expect(result).toBe(false)
  })

  it('should update filters and fetch users', async () => {
    const newFilters: Partial<UserFilters> = { search: 'test', page: 2 }

    await composable.updateFilters(newFilters)

    expect(composable.filters.value.search).toBe('test')
    expect(composable.filters.value.page).toBe(2)
    // Verify getUsers was called with updated filters
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'test', page: 2 })
    )
  })

  it('should change page and fetch users', async () => {
    await composable.changePage(3)

    expect(composable.filters.value.page).toBe(3)
    // Verify getUsers was called with new page
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(
      expect.objectContaining({ page: 3 })
    )
  })

  it('should search users and reset page', async () => {
    await composable.searchUsers('another search')

    expect(composable.filters.value.search).toBe('another search')
    expect(composable.filters.value.page).toBe(1) // Page should reset
    // Verify getUsers was called with search term and reset page
    expect(mockUserRepository.getUsers).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'another search', page: 1 })
    )
  })

  it('should clear the error', () => {
    composable.error.value = 'Some error'
    composable.clearError()
    expect(composable.error.value).toBeNull()
  })
})
