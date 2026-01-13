import { useDB, userSubscriptions, subscriptionPlans } from '../../../database'
import { eq, desc } from 'drizzle-orm'

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
    const [subscription] = await db
      .select({
        id: userSubscriptions.id,
        status: userSubscriptions.status,
        startDate: userSubscriptions.startDate,
        endDate: userSubscriptions.endDate,
        autoRenew: userSubscriptions.autoRenew,
        plan: {
          id: subscriptionPlans.id,
          name: subscriptionPlans.name,
          description: subscriptionPlans.description,
          price: subscriptionPlans.price,
          billingPeriod: subscriptionPlans.billingPeriod,
          features: subscriptionPlans.features,
          maxDevices: subscriptionPlans.maxDevices,
          maxQuality: subscriptionPlans.maxQuality,
        }
      })
      .from(userSubscriptions)
      .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, session.user.id))
      .orderBy(desc(userSubscriptions.createdAt))
      .limit(1)

    return {
      success: true,
      subscription: subscription || null
    }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subscription'
    })
  }
})
