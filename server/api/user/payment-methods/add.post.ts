import { eq, and } from 'drizzle-orm'
import { useDB, paymentMethods } from '../../../database'

/**
 * Add Payment Method API Endpoint
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
  const { paymentTypeId, cardLast4, cardBrand, expiryMonth, expiryYear, isDefault } = body

  // Validate required fields
  if (!paymentTypeId || !cardLast4 || !cardBrand) {
    throw createError({
      statusCode: 400,
      message: 'Missing required payment method fields'
    })
  }

  try {
    const db = useDB()
    
    // If this is the default, unset other defaults
    if (isDefault) {
      await db
        .update(paymentMethods)
        .set({ isDefault: false })
        .where(and(
          eq(paymentMethods.userId, session.user.id),
          eq(paymentMethods.isDefault, true)
        ))
    }
    
    // Add payment method
    const [newPaymentMethod] = await db
      .insert(paymentMethods)
      .values({
        userId: session.user.id,
        paymentTypeId,
        cardLast4,
        cardBrand,
        expiryMonth,
        expiryYear,
        isDefault: isDefault || false,
      })
      .returning()
    
    return {
      success: true,
      paymentMethod: newPaymentMethod,
      message: 'Payment method added successfully'
    }
  } catch (error) {
    console.error('Error adding payment method:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to add payment method'
    })
  }
})
