import { eq, and } from 'drizzle-orm'
import { useDB, movieLists, movieListItems } from '../../../database'

/**
 * Remove Movie from List API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const { omdbId } = await readBody(event)

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
      return {
        success: true,
        message: 'Movie not in list',
        inList: false,
      }
    }

    // Remove movie from list
    await db
      .delete(movieListItems)
      .where(
        and(
          eq(movieListItems.listId, userList.id),
          eq(movieListItems.omdbId, omdbId)
        )
      )

    return {
      success: true,
      message: 'Movie removed from list',
      inList: false,
    }
  } catch (error: any) {
    console.error('Failed to remove movie from list:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to remove movie from list',
    })
  }
})
