import { eq } from 'drizzle-orm'
import { useDB, users } from '../../../database'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await requireAdmin(event)

  const userId = parseInt(event.context.params?.id || '0')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  // Prevent admin from deleting themselves
  if (session.user?.id === userId) {
    throw createError({
      statusCode: 400,
      message: 'Cannot delete your own account'
    })
  }

  const db = useDB()

  try {
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Delete user (cascade will handle related records)
    await db
      .delete(users)
      .where(eq(users.id, userId))

    return {
      message: 'User deleted successfully'
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error deleting user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete user'
    })
  }
})
