import { useDB, subscriptionPlans } from '../../database'

/**
 * Seed subscription plans
 */
export default defineEventHandler(async () => {
  try {
    const db = useDB()
    const plans = [
      {
        name: 'Basic',
        description: 'Perfect for casual viewers',
        price: 999, // $9.99
        billingPeriod: 'monthly',
        features: JSON.stringify([
          'Watch on 1 device',
          'HD streaming',
          'Unlimited movies & shows',
          'Cancel anytime'
        ]),
        maxDevices: 1,
        maxQuality: 'HD',
        isActive: true
      },
      {
        name: 'Standard',
        description: 'Most popular plan for families',
        price: 1499, // $14.99
        billingPeriod: 'monthly',
        features: JSON.stringify([
          'Watch on 2 devices',
          'Full HD streaming',
          'Unlimited movies & shows',
          'Download for offline viewing',
          'Cancel anytime'
        ]),
        maxDevices: 2,
        maxQuality: 'Full HD',
        isActive: true
      },
      {
        name: 'Premium',
        description: 'Best experience with 4K quality',
        price: 1999, // $19.99
        billingPeriod: 'monthly',
        features: JSON.stringify([
          'Watch on 4 devices',
          '4K + HDR streaming',
          'Unlimited movies & shows',
          'Download for offline viewing',
          'Priority customer support',
          'Cancel anytime'
        ]),
        maxDevices: 4,
        maxQuality: '4K',
        isActive: true
      }
    ]

    await db.insert(subscriptionPlans).values(plans).onConflictDoNothing()

    return {
      success: true,
      message: 'Subscription plans seeded successfully'
    }
  } catch (error) {
    console.error('Error seeding subscription plans:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to seed subscription plans'
    })
  }
})
