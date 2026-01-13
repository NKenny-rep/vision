import { eq } from 'drizzle-orm'
import { useDB, users } from '../../../database'
import { z } from 'zod'
import { requireAdmin } from '../../../utils/auth'
import { capitalizeWords } from '../../../utils/formatting'

const updateUserSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  roleId: z.number().int().positive().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const userId = parseInt(event.context.params?.id || '0')
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid user ID'
    })
  }

  const body = await readBody(event)

  // Validate input
  const validation = updateUserSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation failed',
      data: validation.error.errors
    })
  }

  const db = useDB()

  try {
    // Check if user exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Check for email uniqueness if updating
    if (validation.data.email) {
      const [emailExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, validation.data.email))
        .limit(1)

      if (emailExists && emailExists.id !== userId) {
        throw createError({
          statusCode: 409,
          message: 'Email already in use'
        })
      }
    }

    // Prepare update data with formatted name if provided
    const updateData = {
      ...validation.data,
      ...(validation.data.name && { name: capitalizeWords(validation.data.name) }),
      updatedAt: new Date(),
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        roleId: users.roleId,
        updatedAt: users.updatedAt,
      })

    return {
      message: 'User updated successfully',
      data: updatedUser
    }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error updating user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update user'
    })
  }
})
