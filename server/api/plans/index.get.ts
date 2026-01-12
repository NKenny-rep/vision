import { useDB, subscriptionPlans } from '../../database'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (_event) => {
  try {
    const db = useDB()
    const plans = await db
      .select()
      .from(subscriptionPlans)
      .where(eq(subscriptionPlans.isActive, true))
      .orderBy(subscriptionPlans.price)

    return plans
  } catch (error: unknown) {
    console.error('Error fetching subscription plans:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch subscription plans'
    })
  }
})
