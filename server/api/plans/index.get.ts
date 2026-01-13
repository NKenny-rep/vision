import { useDB, subscriptionPlans } from '../../database'

export default defineEventHandler(async (_event) => {
  try {
    const db = useDB()
    const plans = await db
      .select()
      .from(subscriptionPlans)
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
