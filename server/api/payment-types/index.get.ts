import { useDB, paymentTypes } from '../../database'

export default defineEventHandler(async (event) => {
  try {
    const db = useDB()
    const types = await db
      .select()
      .from(paymentTypes)
      .orderBy(paymentTypes.id)

    return types
  } catch (error) {
    console.error('Error fetching payment types:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch payment types'
    })
  }
})
