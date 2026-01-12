import { eq, and } from 'drizzle-orm'
import { useDB, movieLists, movieListItems } from '../../../database'

/**
 * Get User's Movie List API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
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
        items: [],
        total: 0,
      }
    }

    // Get all movies in the list
    const items = await db
      .select()
      .from(movieListItems)
      .where(eq(movieListItems.listId, userList.id))
      .orderBy(movieListItems.addedAt)

    return {
      success: true,
      items: items.map(item => ({
        omdbId: item.omdbId,
        title: item.movieTitle,
        poster: item.moviePoster,
        year: item.movieYear,
        type: item.movieType,
        addedAt: item.addedAt,
      })),
      total: items.length,
    }
  } catch (error: any) {
    console.error('Failed to fetch movie list:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch movie list',
    })
  }
})
