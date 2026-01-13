import { useDB, userSubscriptions } from '../../../database'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    const db = useDB()
    // Cancel active subscription
    await db
      .update(userSubscriptions)
      .set({
        status: 'cancelled',
        endDate: new Date(),
        autoRenew: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userSubscriptions.userId, session.user.id),
          eq(userSubscriptions.status, 'active')
        )
      )

    return {
      success: true,
      message: 'Subscription cancelled successfully'
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to cancel subscription'
    })
  }
})
