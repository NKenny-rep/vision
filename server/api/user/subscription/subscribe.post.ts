import { eq, and } from 'drizzle-orm'
import { useDB, userSubscriptions, subscriptionPlans, paymentMethods } from '../../../database'

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const userId = session.user.id as number
  const { planId } = await readBody<{ planId: number }>(event)

  if (!planId) {
    throw createError({
      statusCode: 400,
      message: 'Plan ID is required'
    })
  }

  const db = useDB()

  // Check if user already has an active subscription
  const existingSubscription = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, 'active')
      )
    )
    .limit(1)

  if (existingSubscription.length > 0) {
    throw createError({
      statusCode: 400,
      message: 'User already has an active subscription'
    })
  }

  // Check if user has a payment method
  const userPaymentMethods = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.userId, userId))
    .limit(1)

  if (userPaymentMethods.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Please add a payment method before subscribing'
    })
  }

  // Verify plan exists
  const plan = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.id, planId))
    .limit(1)

  if (plan.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Subscription plan not found'
    })
  }

  // Create subscription
  const [newSubscription] = await db
    .insert(userSubscriptions)
    .values({
      userId,
      planId,
      status: 'active',
      autoRenew: true,
      startDate: new Date(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    })
    .returning()

  return {
    success: true,
    subscription: newSubscription
  }
})
