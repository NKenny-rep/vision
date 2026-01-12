import { eq, ilike, or, desc, asc } from 'drizzle-orm'
import { useDB, users, roles } from '../../../database'
import { requireAdmin } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 10
  const search = (query.search as string) || ''
  const sortBy = (query.sortBy as string) || 'createdAt'
  const sortOrder = (query.sortOrder as string) || 'desc'

  const db = useDB()

  try {
    // Build where clause for search
    const whereClause = search
      ? or(
          ilike(users.email, `%${search}%`),
          ilike(users.name, `%${search}%`),
          ilike(users.phone, `%${search}%`)
        )
      : undefined

    // Build order clause - handle roleName from joined roles table
    const validUserColumns = ['id', 'email', 'name', 'phone', 'createdAt', 'updatedAt'] as const
    type ValidUserColumn = typeof validUserColumns[number]
    
    const getSortColumn = () => {
      if (sortBy === 'roleName') {
        return roles.name
      }
      // Check if sortBy is a valid user column
      if (validUserColumns.includes(sortBy as ValidUserColumn)) {
        return users[sortBy as ValidUserColumn]
      }
      // Default to createdAt for invalid columns
      return users.createdAt
    }
    
    const orderClause = sortOrder === 'asc' 
      ? asc(getSortColumn())
      : desc(getSortColumn())

    const totalResult = await db
      .select({ count: users.id })
      .from(users)
      .where(whereClause)

    const total = totalResult.length

    const usersList = await db
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
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset((page - 1) * limit)

    return {
      data: usersList,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users'
    })
  }
})
