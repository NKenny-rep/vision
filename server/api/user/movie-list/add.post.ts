import { eq, and } from 'drizzle-orm'
import { useDB, movieLists, movieListItems } from '../../../database'

/**
 * Add Movie to List API Endpoint
 */
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const { omdbId, movieTitle, moviePoster, movieYear, movieType } = await readBody(event)

  if (!omdbId) {
    throw createError({
      statusCode: 400,
      message: 'Movie ID is required',
    })
  }

  try {
    const db = useDB()

    // Get or create user's default list
    let [userList] = await db
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
      // Create default list if it doesn't exist
      [userList] = await db
        .insert(movieLists)
        .values({
          userId: session.user.id,
          name: 'My List',
          description: 'My saved movies',
          isDefault: true,
        })
        .returning()
    }

    // Check if movie is already in list
    const [existing] = await db
      .select()
      .from(movieListItems)
      .where(
        and(
          eq(movieListItems.listId, userList.id),
          eq(movieListItems.omdbId, omdbId)
        )
      )
      .limit(1)

    if (existing) {
      return {
        success: true,
        message: 'Movie already in list',
        inList: true,
      }
    }

    // Add movie to list
    await db.insert(movieListItems).values({
      listId: userList.id,
      omdbId,
      movieTitle,
      moviePoster,
      movieYear,
      movieType,
    })

    return {
      success: true,
      message: 'Movie added to list',
      inList: true,
    }
  } catch (error: any) {
    console.error('Failed to add movie to list:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to add movie to list',
    })
  }
})
