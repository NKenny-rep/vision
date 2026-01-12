import { useDB, userSubscriptions, subscriptionPlans } from '../../../database'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const userId = (session.user as any).id as number

  const { planId } = await readBody(event)

  if (!planId) {
    throw createError({
      statusCode: 400,
      message: 'Plan ID is required'
    })
  }

  try {
    const db = useDB()
    // Verify new plan exists
    const [newPlan] = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.id, planId))
      .limit(1)

    if (!newPlan) {
      throw createError({
        statusCode: 404,
        message: 'Plan not found'
      })
    }

    // Cancel current active subscription
    await db
      .update(userSubscriptions)
      .set({
        status: 'cancelled',
        endDate: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userSubscriptions.userId, session.user.id),
          eq(userSubscriptions.status, 'active')
        )
      )

    // Create new subscription
    const [newSubscription] = await db
      .insert(userSubscriptions)
      .values({
        userId,
        planId,
        status: 'active',
        startDate: new Date(),
        autoRenew: true,
      })
      .returning()

    return {
      success: true,
      message: 'Subscription plan updated successfully',
      subscription: newSubscription
    }
  } catch (error) {
    console.error('Error changing plan:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to change subscription plan'
    })
  }
})
