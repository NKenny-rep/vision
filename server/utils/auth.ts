import type { H3Event } from 'h3'

/**
 * Server utility to check if user has admin role
 * Centralizes admin authentication logic
 */
export const requireAdmin = async (event: H3Event) => {
  const session = await getUserSession(event)
  
  if (!session?.user || session.user.roleId !== 2) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required'
    })
  }
  
  return session
}

/**
 * Server utility to require any authenticated user
 */
export const requireAuth = async (event: H3Event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Authentication required'
    })
  }
  
  return session
}
