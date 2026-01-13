import { eq, and } from 'drizzle-orm'
import { useDB, movieLists, movieListItems } from '../../../database'

/**
 * Check if Movie is in User's List API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const omdbId = getQuery(event).omdbId as string

  if (!omdbId) {
    throw createError({
      statusCode: 400,
      message: 'Movie ID is required',
    })
  }

  try {
    const db = useDB()

    // Get user's default list
    const [userList] = await db
      .select()
      .from(movieLists)
      .where(
        and(
          eq(movieLists.userId, session.user.id),
          eq(movieLists.isDefault, true)
        )
      )
      .limit(1)

    if (!userList) {
      return { inList: false }
    }

    // Check if movie is in list
    const [item] = await db
      .select()
      .from(movieListItems)
      .where(
        and(
          eq(movieListItems.listId, userList.id),
          eq(movieListItems.omdbId, omdbId)
        )
      )
      .limit(1)

    return {
      inList: !!item,
    }
  } catch (error: unknown) {
    console.error('Failed to check movie list status:', error)
    return { inList: false }
  }
})
