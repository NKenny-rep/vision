import { eq } from 'drizzle-orm'
import { useDB, users } from '../../../database'

/**
 * Update User Profile API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readBody(event)
  const { name, avatar, phone } = body

  try {
    const db = useDB()
    
    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set({
        name: name || undefined,
        avatar: avatar || undefined,
        phone: phone || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        updatedAt: users.updatedAt,
      })
    
    if (!updatedUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return {
      success: true,
      profile: updatedUser,
      message: 'Profile updated successfully'
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update user profile'
    })
  }
})
