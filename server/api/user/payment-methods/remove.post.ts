import { eq, and } from 'drizzle-orm'
import { useDB, paymentMethods } from '../../../database'

/**
 * Remove Payment Method API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const body = await readBody(event)
  const { paymentMethodId } = body

  if (!paymentMethodId) {
    throw createError({
      statusCode: 400,
      message: 'Payment method ID is required'
    })
  }

  try {
    const db = useDB()
    
    // Delete payment method (ensure it belongs to the user)
    await db
      .delete(paymentMethods)
      .where(and(
        eq(paymentMethods.id, paymentMethodId),
        eq(paymentMethods.userId, session.user.id)
      ))
    
    return {
      success: true,
      message: 'Payment method removed successfully'
    }
  } catch (error) {
    console.error('Error removing payment method:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to remove payment method'
    })
  }
})
