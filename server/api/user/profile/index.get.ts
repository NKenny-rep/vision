import { eq } from 'drizzle-orm'
import { useDB, users, paymentMethods, paymentTypes } from '../../../database'

/**
 * Get User Profile API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  try {
    const db = useDB()
    
    // Get user profile
    const [userProfile] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
    
    if (!userProfile) {
      // Clear invalid session
      await clearUserSession(event)
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Get payment methods
    const userPaymentMethods = await db
      .select({
        id: paymentMethods.id,
        paymentType: {
          id: paymentTypes.id,
          name: paymentTypes.name,
          displayName: paymentTypes.displayName,
        },
        cardLast4: paymentMethods.cardLast4,
        cardBrand: paymentMethods.cardBrand,
        expiryMonth: paymentMethods.expiryMonth,
        expiryYear: paymentMethods.expiryYear,
        isDefault: paymentMethods.isDefault,
        createdAt: paymentMethods.createdAt,
      })
      .from(paymentMethods)
      .leftJoin(paymentTypes, eq(paymentMethods.paymentTypeId, paymentTypes.id))
      .where(eq(paymentMethods.userId, session.user.id))
    
    return {
      success: true,
      profile: {
        ...userProfile,
        paymentMethods: userPaymentMethods
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch user profile'
    })
  }
})
