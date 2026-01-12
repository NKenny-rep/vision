import { eq } from 'drizzle-orm'
import { useDB, users } from '../../../database'
import { z } from 'zod'
import { requireAdmin } from '../../../utils/auth'
import { capitalizeWords } from '../../../utils/formatting'
import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

const createUserSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  phone: z.string().max(20).optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  roleId: z.number().int().positive().default(1),
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const body = await readBody(event)

  // Validate input
  const validation = createUserSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation failed',
      data: validation.error.errors
    })
  }

  const db = useDB()

  try {
    // Check if email already exists
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validation.data.email))
      .limit(1)

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Email already in use'
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(validation.data.password)

    // Capitalize name properly
    const formattedName = capitalizeWords(validation.data.name)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: formattedName,
        email: validation.data.email,
        password: hashedPassword,
        phone: validation.data.phone || null,
        avatar: validation.data.avatar || null,
        roleId: validation.data.roleId,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        phone: users.phone,
        roleId: users.roleId,
        createdAt: users.createdAt,
      })

    return {
      message: 'User created successfully',
      data: newUser
    }
  } catch (error) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    console.error('Error creating user:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create user'
    })
  }
})

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scryptAsync(password, salt, 64) as Buffer
  return salt + ':' + derivedKey.toString('hex')
}
