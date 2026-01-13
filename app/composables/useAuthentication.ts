/**
 * Authentication Composable (Adapter Pattern)
 * Wraps useUserSession with custom behavior for login, register, logout
 */

export const AUTH_REDIRECT_PATHS = {
  LOGIN_SUCCESS: '/browse',
  LOGOUT_SUCCESS: '/',
  REGISTER_SUCCESS: '/browse',
} as const

export const useAuthentication = () => {
  const { loggedIn, session, user, clear, fetch } = useUserSession()

  /**
   * Ensures the session is fully loaded with user data
   * Useful for preventing race conditions where API calls happen before session is ready
   * @returns Promise that resolves when user is available, or throws if not authenticated
   */
  const ensureAuthenticated = async () => {
    if (!loggedIn.value) {
      throw new Error('User is not logged in')
    }

    // If user data is not loaded yet, fetch the session
    if (!user.value) {
      await fetch()
    }

    // After fetching, if still no user, something is wrong
    if (!user.value) {
      throw new Error('Failed to load user session')
    }

    return user.value
  }

  /**
   * Checks if session is ready (logged in AND user data loaded)
   * Non-throwing version for conditional checks
   */
  const isSessionReady = computed(() => {
    return loggedIn.value && !!user.value
  })

  const login = async (
    email: string, 
    password: string, 
    redirectTo: string | null = null
  ) => {
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      await fetch()
      
      if (!redirectTo) {
        redirectTo = AUTH_REDIRECT_PATHS.LOGIN_SUCCESS
      }
      
      if (redirectTo) {
        await nextTick()
        await navigateTo(redirectTo, { replace: true })
      }

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (
    name: string,
    email: string, 
    password: string,
    phone?: string,
    avatar?: string,
    planId?: number
  ) => {
    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name, email, password, phone, avatar, planId }
      })

      // Refresh session after registration
      await fetch()
      
      return { success: true }
    } catch (error: unknown) {
      console.error('Registration error:', error)
      const errorMessage = (error as { data?: { message?: string } })?.data?.message || 'Registration failed';
      return { 
        success: false, 
        error: errorMessage
      }
    }
  }

  const logout = async(redirectTo: string | null = AUTH_REDIRECT_PATHS.LOGOUT_SUCCESS) => {
    await clear()
    if (redirectTo) {
      navigateTo(redirectTo)
    }
  }

  return {
    loggedIn,
    session,
    user,
    isLoggedIn: computed(() => loggedIn.value && !!session.value?.user),
    isSessionReady,
    isAdmin: computed(() => {
      const roleId = session.value?.user?.roleId
      // Debug log
      if (process.client && session.value?.user) {
        console.log('[useAuthentication] User roleId:', roleId, 'isAdmin:', roleId === 2)
      }
      return roleId === 2
    }),
    ensureAuthenticated,
    fetch,
    login,
    logout,
    register,
  }
}
