/**
 * Admin Middleware
 * Restricts access to admin-only routes
 * Redirects non-admin users to browse page
 */
export default defineNuxtRouteMiddleware(() => {
  const { isAdmin } = useAuthentication()

  if (!isAdmin.value) {
    return navigateTo('/browse')
  }
})
