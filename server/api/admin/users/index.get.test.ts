// server/api/admin/users/index.get.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getQuery, createError, getRouterParam } from 'h3'

// Import handler after mocks are set up
// @ts-ignore
import handler from './index.get'

// Mock dependencies
vi.mock('../../../database', () => ({
  useDB: vi.fn(),
  users: {},
  roles: {},
}))
vi.mock('../../../utils/auth', () => ({
  requireAdmin: vi.fn(),
})) // Import the actual handler

// Mock Drizzle ORM functions
const mockDrizzle = {
  select: vi.fn(() => mockDrizzle),
  from: vi.fn(() => mockDrizzle),
  where: vi.fn(() => mockDrizzle),
  ilike: vi.fn(),
  or: vi.fn(),
  desc: vi.fn(),
  asc: vi.fn(),
  eq: vi.fn(),
  leftJoin: vi.fn(() => mockDrizzle),
  orderBy: vi.fn(() => mockDrizzle),
  limit: vi.fn(() => mockDrizzle),
  offset: vi.fn(() => mockDrizzle),
  // Default mock for .execute() or similar terminal methods
  then: vi.fn((cb) => cb()), // Allows chaining .then() as if it's a promise
  // For total count
  all: vi.fn(() => []),
  // For main query
  _execute: vi.fn(() => []), // Internal method for result
}

// Mock the .all() and ._execute() to return specific values
mockDrizzle.select.mockImplementation(() => {
  const self = { ...mockDrizzle } // Clone to avoid overriding other chains
  self.from = vi.fn(() => self)
  self.where = vi.fn(() => self)
  self.all = vi.fn(() => []) // Default for count
  self._execute = vi.fn(() => []) // Default for main data
  return self
})


describe('GET /api/admin/users', () => {
  const mockEvent: any = {} // Mock H3Event object

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(requireAdmin).mockResolvedValue({ user: { id: 1, roleId: 2 } } as any) // Default: admin user
    vi.mocked(getQuery).mockReturnValue({}) // Default: no query params
    vi.mocked(useDB).mockReturnValue(mockDrizzle as any)

    // Reset specific mock implementations for each test
    mockDrizzle.select.mockImplementation(() => mockDrizzle)
    mockDrizzle.from.mockImplementation(() => mockDrizzle)
    mockDrizzle.where.mockImplementation(() => mockDrizzle)
    mockDrizzle.leftJoin.mockImplementation(() => mockDrizzle)
    mockDrizzle.orderBy.mockImplementation(() => mockDrizzle)
    mockDrizzle.limit.mockImplementation(() => mockDrizzle)
    mockDrizzle.offset.mockImplementation(() => mockDrizzle)
    mockDrizzle.all.mockImplementation(() => []) // For count
    mockDrizzle._execute.mockImplementation(() => []) // For main data
  })

  it('should deny access if not admin', async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(createError({ statusCode: 403, message: 'Forbidden' }))

    await expect(handler(mockEvent)).rejects.toThrow('Forbidden')
    expect(requireAdmin).toHaveBeenCalledWith(mockEvent)
  })

  it('should return a list of users with default pagination', async () => {
    const mockUsers = [
      { id: 1, email: 'user1@example.com', name: 'User One', roleName: 'user' },
    ]
    
    mockDrizzle.select.mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.all = vi.fn(() => [{ count: 1 }]) // Mock total count
      return self
    }).mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.leftJoin = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.orderBy = vi.fn(() => self)
      self.limit = vi.fn(() => self)
      self.offset = vi.fn(() => self)
      self._execute = vi.fn(() => mockUsers) // Mock main data
      return self
    })

    const response = await handler(mockEvent)

    expect(getQuery).toHaveBeenCalledWith(mockEvent)
    expect(mockDrizzle.select).toHaveBeenCalledTimes(2) // Once for count, once for data
    expect(mockDrizzle.from).toHaveBeenCalledWith(schema.users)
    expect(mockDrizzle.limit).toHaveBeenCalledWith(10)
    expect(mockDrizzle.offset).toHaveBeenCalledWith(0)
    expect(response).toEqual({
      data: mockUsers,
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    })
  })

  it('should handle search query', async () => {
    vi.mocked(getQuery).mockReturnValue({ search: 'test' })
    
    mockDrizzle.select.mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.all = vi.fn(() => [{ count: 1 }])
      return self
    }).mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.leftJoin = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.orderBy = vi.fn(() => self)
      self.limit = vi.fn(() => self)
      self.offset = vi.fn(() => self)
      self._execute = vi.fn(() => [{ id: 1, email: 'test@example.com', name: 'Test User', roleName: 'user' }])
      return self
    })

    await handler(mockEvent)

    expect(mockDrizzle.where).toHaveBeenCalledWith(expect.any(Object)) // ilike / or
    expect(mockDrizzle.ilike).toHaveBeenCalledTimes(3)
  })

  it('should handle pagination parameters', async () => {
    vi.mocked(getQuery).mockReturnValue({ page: '2', limit: '5' })
    
    mockDrizzle.select.mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.all = vi.fn(() => [{ count: 10 }])
      return self
    }).mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.leftJoin = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.orderBy = vi.fn(() => self)
      self.limit = vi.fn(() => self)
      self.offset = vi.fn(() => self)
      self._execute = vi.fn(() => [])
      return self
    })

    const response = await handler(mockEvent)

    expect(mockDrizzle.limit).toHaveBeenCalledWith(5)
    expect(mockDrizzle.offset).toHaveBeenCalledWith(5) // (2-1)*5
    expect(response.pagination.page).toBe(2)
    expect(response.pagination.limit).toBe(5)
    expect(response.pagination.totalPages).toBe(2)
  })

  it('should handle sorting parameters', async () => {
    vi.mocked(getQuery).mockReturnValue({ sortBy: 'name', sortOrder: 'asc' })
    
    mockDrizzle.select.mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.all = vi.fn(() => [{ count: 1 }])
      return self
    }).mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.leftJoin = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.orderBy = vi.fn(() => self)
      self.limit = vi.fn(() => self)
      self.offset = vi.fn(() => self)
      self._execute = vi.fn(() => [])
      return self
    })

    await handler(mockEvent)

    expect(mockDrizzle.orderBy).toHaveBeenCalledWith(expect.any(Object)) // asc(users.name)
    expect(mockDrizzle.asc).toHaveBeenCalledWith(schema.users.name)
  })

  it('should handle roleName sorting', async () => {
    vi.mocked(getQuery).mockReturnValue({ sortBy: 'roleName', sortOrder: 'desc' })
    
    mockDrizzle.select.mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.all = vi.fn(() => [{ count: 1 }])
      return self
    }).mockImplementationOnce(() => {
      const self = { ...mockDrizzle }
      self.from = vi.fn(() => self)
      self.leftJoin = vi.fn(() => self)
      self.where = vi.fn(() => self)
      self.orderBy = vi.fn(() => self)
      self.limit = vi.fn(() => self)
      self.offset = vi.fn(() => self)
      self._execute = vi.fn(() => [])
      return self
    })

    await handler(mockEvent)

    expect(mockDrizzle.orderBy).toHaveBeenCalledWith(expect.any(Object)) // desc(roles.name)
    expect(mockDrizzle.desc).toHaveBeenCalledWith(schema.roles.name)
  })

  it('should handle database errors', async () => {
    const dbError = new Error('Database connection failed')
    mockDrizzle.select.mockImplementationOnce(() => { throw dbError })
    
    await expect(handler(mockEvent)).rejects.toThrow('Failed to fetch users')
    expect(createError).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Failed to fetch users',
    })
  })
})
