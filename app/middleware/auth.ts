/**
 * Auth Middleware
 * Protects routes that require authentication
 * Redirects unauthenticated users to login page
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn, isAdmin } = useAuthentication()

  // Redirect to login if not authenticated
  // Save intended destination so user can be redirected after login
  if (!isLoggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
  
  // Restrict dashboard access to admins only
  if (to.path.startsWith('/dashboard') && !isAdmin.value) {
    return navigateTo('/')
  }
})
