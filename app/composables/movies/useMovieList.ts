import { API_ROUTES } from '~/constants/apiRoutes'

export interface MovieListItem {
  id: number
  omdbId: string
  title: string
  poster?: string
  year?: string
  type?: string
  addedAt: string
}

export interface MovieListResponse {
  items: MovieListItem[]
  total: number
}

export const useMovieList = () => {
  const { ensureAuthenticated, isSessionReady } = useAuthentication()

  const isInList = async (omdbId: string): Promise<boolean> => {
    if (!isSessionReady.value) return false

    try {
      await ensureAuthenticated()
      
      const { inList } = await $fetch<{ inList: boolean }>(API_ROUTES.USER.MOVIE_LIST_CHECK, {
        query: { omdbId },
      })
      return inList
    } catch (error) {
      console.error('Failed to check movie list status:', error)
      return false
    }
  }

  const addToList = async (movie: {
    omdbId: string
    movieTitle: string
    moviePoster: string
    movieYear: string
    movieType?: string
  }) => {
    await ensureAuthenticated()

    try {
      const result = await $fetch<{ success: boolean; item: MovieListItem }>(API_ROUTES.USER.MOVIE_LIST_ADD, {
        method: 'POST',
        body: movie,
      })
      return result
    } catch (error) {
      console.error('Failed to add movie to list:', error)
      throw error
    }
  }

  const removeFromList = async (omdbId: string) => {
    await ensureAuthenticated()

    try {
      const result = await $fetch<{ success: boolean }>(API_ROUTES.USER.MOVIE_LIST_REMOVE, {
        method: 'POST',
        body: { omdbId },
      })
      return result
    } catch (error) {
      console.error('Failed to remove movie from list:', error)
      throw error
    }
  }

  const toggleInList = async (
    omdbId: string,
    movie: {
      movieTitle: string
      moviePoster: string
      movieYear: string
      movieType?: string
    }
  ) => {
    const inList = await isInList(omdbId)

    if (inList) {
      return await removeFromList(omdbId)
    } else {
      return await addToList({
        omdbId,
        ...movie,
      })
    }
  }

  const fetchMovieList = () => {
    return useFetch<MovieListResponse>('/api/user/movie-list', {
      key: 'user-movie-list',
      default: () => ({ items: [], total: 0 })
    })
  }

  return {
    isInList,
    addToList,
    removeFromList,
    toggleInList,
    fetchMovieList,
  }
}
