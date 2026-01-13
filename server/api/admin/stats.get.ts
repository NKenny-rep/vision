import { useDB, users, userSubscriptions, subscriptionPlans, movieListItems } from '../../database'
import { requireAdmin } from '../../utils/auth'
import { eq, count, desc, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const db = useDB()

  // Total users
  const [{ totalUsers }] = await db.select({ totalUsers: count(users.id) }).from(users)

  // Total revenue (sum of all active userSubscriptions' plan price)
  // Use explicit alias for subscriptionPlans as 'sp' for SUM
  const [{ totalRevenue }] = await db
    .select({
      totalRevenue: sql`COALESCE(SUM(subscription_plans.price), 0)`
    })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(eq(userSubscriptions.status, 'active'))

  // Most used plan
  const [mostUsedPlan] = await db
    .select({
      planId: subscriptionPlans.id,
      name: subscriptionPlans.name,
      count: count(userSubscriptions.id)
    })
    .from(userSubscriptions)
    .innerJoin(subscriptionPlans, eq(userSubscriptions.planId, subscriptionPlans.id))
    .where(eq(userSubscriptions.status, 'active'))
    .groupBy(subscriptionPlans.id)
    .orderBy(desc(count(userSubscriptions.id)))
    .limit(1)

  // Most saved movie (by omdbId)
  const [mostSavedMovie] = await db
    .select({
      omdbId: movieListItems.omdbId,
      title: movieListItems.movieTitle,
      count: count(movieListItems.id)
    })
    .from(movieListItems)
    .groupBy(movieListItems.omdbId, movieListItems.movieTitle)
    .orderBy(desc(count(movieListItems.id)))
    .limit(1)

  return {
    totalUsers: totalUsers || 0,
    totalRevenue: totalRevenue || 0,
    mostUsedPlan: mostUsedPlan || null,
    mostSavedMovie: mostSavedMovie || null
  }
})
