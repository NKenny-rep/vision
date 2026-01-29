// app/composables/useAuthentication.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent, ref, nextTick } from 'vue'
import { useAuthentication, AUTH_REDIRECT_PATHS } from './useAuthentication'

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}))

const { useUserSessionMock } = vi.hoisted(() => ({
  useUserSessionMock: vi.fn()
}))

mockNuxtImport('navigateTo', () => navigateToMock)
mockNuxtImport('useUserSession', () => useUserSessionMock)

describe('useAuthentication', () => {
  let mockSession: {
    loggedIn: any
    session: any
    user: any
    fetch: ReturnType<typeof vi.fn>
    clear: ReturnType<typeof vi.fn>
  }

  // Helper to mount a component and use the composable
  const mountComposable = async () => {
    let result: ReturnType<typeof useAuthentication>
    await mountSuspended(defineComponent({
      setup() {
        result = useAuthentication()
        return () => null
      },
    }))
    return result!
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup mock session
    mockSession = {
      loggedIn: ref(false),
      session: ref(null),
      user: ref(null),
      fetch: vi.fn(),
      clear: vi.fn()
    }
    
    useUserSessionMock.mockReturnValue(mockSession)
  })

  it('should reflect initial logged out state', async () => {
    const { loggedIn, user, isLoggedIn, isSessionReady } = await mountComposable()
    expect(loggedIn.value).toBe(false)
    expect(user.value).toBeNull()
    expect(isLoggedIn.value).toBe(false)
    expect(isSessionReady.value).toBe(false)
  })

  it('should ensure authenticated when user is logged in and session is ready', async () => {
    mockSession.loggedIn.value = true
    mockSession.user.value = { id: 1, email: 'test@example.com', roleId: 1 } as any
    mockSession.session.value = { user: mockSession.user.value } as any

    const { ensureAuthenticated } = await mountComposable()
    const user = await ensureAuthenticated()

    expect(user).toEqual(mockSession.user.value)
    expect(mockSession.fetch).not.toHaveBeenCalled() // User already available
  })

  it('should fetch session if user data is missing but loggedIn is true', async () => {
    mockSession.loggedIn.value = true
    mockSession.user.value = null
    const expectedUser = { id: 1, email: 'test@example.com', roleId: 1 }
    mockSession.session.value = { user: expectedUser } as any
    mockSession.fetch.mockImplementation(() => {
      mockSession.user.value = expectedUser as any
      return Promise.resolve()
    })

    const { ensureAuthenticated } = await mountComposable()
    const user = await ensureAuthenticated()

    expect(mockSession.fetch).toHaveBeenCalledTimes(1)
    expect(user).toEqual(expectedUser)
  })

  it('should throw error if not logged in', async () => {
    const { ensureAuthenticated } = await mountComposable()
    await expect(ensureAuthenticated()).rejects.toThrow('User is not logged in')
  })

  it('should throw error if fetch fails to load user', async () => {
    mockSession.loggedIn.value = true
    mockSession.user.value = null
    mockSession.session.value = null // No user in session either
    mockSession.fetch.mockResolvedValueOnce(undefined)

    const { ensureAuthenticated } = await mountComposable()
    await expect(ensureAuthenticated()).rejects.toThrow('Failed to load user session')
  })

  it('should login successfully and navigate', async () => {
    registerEndpoint('/api/auth/login', { method: 'POST', handler: () => ({}) })
    mockSession.fetch.mockResolvedValueOnce(undefined)
    mockSession.loggedIn.value = true
    mockSession.user.value = { id: 1, email: 'test@example.com', roleId: 1 } as any

    const { login } = await mountComposable()
    const result = await login('test@example.com', 'password123')

    expect(mockSession.fetch).toHaveBeenCalledTimes(1)
    await nextTick() // Wait for navigation to complete
    expect(navigateToMock).toHaveBeenCalledWith(AUTH_REDIRECT_PATHS.LOGIN_SUCCESS, { replace: true })
    expect(result).toBe(true)
  })

  it('should login successfully and navigate to custom redirectTo', async () => {
    registerEndpoint('/api/auth/login', { method: 'POST', handler: () => ({}) })
    mockSession.fetch.mockResolvedValueOnce(undefined)
    mockSession.loggedIn.value = true
    mockSession.user.value = { id: 1, email: 'test@example.com', roleId: 1 } as any

    const { login } = await mountComposable()
    const result = await login('test@example.com', 'password123', '/custom-path')

    expect(navigateToMock).toHaveBeenCalledWith('/custom-path', { replace: true })
    expect(result).toBe(true)
  })

  it('should handle login failure', async () => {
    registerEndpoint('/api/auth/login', { method: 'POST', handler: () => { throw new Error('Invalid credentials') } })

    const { login } = await mountComposable()
    const result = await login('test@example.com', 'wrongpassword')

    expect(mockSession.fetch).not.toHaveBeenCalled()
    expect(navigateToMock).not.toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('should register successfully and fetch session', async () => {
    registerEndpoint('/api/auth/register', { method: 'POST', handler: () => ({}) })
    mockSession.fetch.mockResolvedValueOnce(undefined)

    const { register } = await mountComposable()
    const result = await register('Test User', 'register@example.com', 'password123')

    expect(mockSession.fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })

  it('should handle registration failure', async () => {
    registerEndpoint('/api/auth/register', { method: 'POST', handler: () => { 
      const error: any = new Error('Email already exists')
      error.data = { message: 'Email already exists' }
      throw error
    } })

    const { register } = await mountComposable()
    const result = await register('Test User', 'register@example.com', 'password123')

    expect(mockSession.fetch).not.toHaveBeenCalled()
    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('should logout successfully and navigate', async () => {
    mockSession.clear.mockResolvedValueOnce(undefined)

    const { logout } = await mountComposable()
    await logout()

    expect(mockSession.clear).toHaveBeenCalledTimes(1)
    expect(navigateToMock).toHaveBeenCalledWith(AUTH_REDIRECT_PATHS.LOGOUT_SUCCESS)
  })

  it('should logout successfully and navigate to custom redirectTo', async () => {
    mockSession.clear.mockResolvedValueOnce(undefined)

    const { logout } = await mountComposable()
    await logout('/custom-logout')

    expect(navigateToMock).toHaveBeenCalledWith('/custom-logout')
  })
})
