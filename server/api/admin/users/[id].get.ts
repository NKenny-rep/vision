import { eq, desc } from 'drizzle-orm'
import { useDB, users, roles, userSubscriptions, subscriptionPlans } from '../../../database'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const userId = Number(event.context.params?.id)
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  const db = useDB()

  try {
    // Fetch user with role
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        roleId: users.roleId,
        roleName: roles.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id))
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Fetch user subscription
    const [subscription] = await db
      .select({
        id: userSubscriptions.id,
        status: userSubscriptions.status,
        startDate: userSubscriptions.startDate,
        endDate: userSubscriptions.endDate,
        autoRenew: userSubscriptions.autoRenew,
        name: subscriptionPlans.name,
        price: subscriptionPlans.price,
        quality: subscriptionPlans.maxQuality,
      })
      .from(userSubscriptions)
      .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
      .where(eq(userSubscriptions.userId, userId))
      .orderBy(desc(userSubscriptions.createdAt))
      .limit(1)

    return {
      ...user,
      subscription: subscription || null
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error fetching user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user'
    })
  }
})
