/**
 * Not Authenticated Middleware
 * Protects guest-only routes (login, register)
 * Redirects authenticated users to home page
 */
export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuthentication()

  const guestOnlyRoutes = ['/', '/login', '/register']

  // Redirect authenticated users to browse page
  if (guestOnlyRoutes.includes(to.path) && isLoggedIn.value) {
    return navigateTo('/browse')
  }
})