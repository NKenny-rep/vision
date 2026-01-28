import type { OMDBSearchResponse, OMDBMovie, OMDBSearchParams, OMDBMovieParams } from '~/types'
import { API_ROUTES } from '~/constants/apiRoutes'

/**
 * Movie Repository Interface
 * Defines contract for movie data access
 */
export interface IMovieRepository {
  search(params: OMDBSearchParams): Promise<OMDBSearchResponse>
  getById(idOrTitle: string, params?: Omit<OMDBMovieParams, 'i' | 't'>): Promise<OMDBMovie>
}

/**
 * API Adapter Implementation
 * Implements IMovieRepository using Nuxt API routes
 */
class MovieApiAdapter implements IMovieRepository {
  async search(params: OMDBSearchParams): Promise<OMDBSearchResponse> {
    return await $fetch<OMDBSearchResponse>(API_ROUTES.MOVIES.SEARCH, {
      query: params,
    })
  }

  async getById(idOrTitle: string, params?: Omit<OMDBMovieParams, 'i' | 't'>): Promise<OMDBMovie> {
    return await $fetch<OMDBMovie>(API_ROUTES.MOVIES.DETAIL(idOrTitle), {
      query: params,
    })
  }
}

/**
 * Movies Composable with Repository Pattern
 * @param repository Optional repository implementation (enables dependency injection for testing)
 */
export const useMovies = (repository: IMovieRepository = new MovieApiAdapter()) => {
  /**
   * Search for movies by title
   * @param params Search parameters
   * @returns Search results with movies array
   */
  const searchMovies = async (params: OMDBSearchParams) => {
    const { data, error, status } = await useFetch<OMDBSearchResponse>(
      `/api/movies/search`,
      {
        query: params,
        key: `movies-search-${params.s}-${params.page || 1}`,
        getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key],
      }
    )
    
    return { data, error, status }
  }

  /**
   * Get a single movie by IMDb ID or title (using repository)
   * @param idOrTitle IMDb ID (e.g., 'tt1285016') or movie title (e.g., 'The Matrix')
   * @param params Optional additional parameters
   * @returns Movie details
   */
  const getMovie = async (
    idOrTitle: string, 
    params?: Omit<OMDBMovieParams, 'i' | 't'>
  ) => {
    const { data, error, status } = await useAsyncData<OMDBMovie>(
      `movie-${idOrTitle}-${params?.plot || 'short'}`,
      async () => repository.getById(idOrTitle, params),
      {
        getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key],
      }
    )

    return { data, error, status }
  }

  /**
   * Direct repository access for non-reactive operations
   */
  const fetchMovie = async (
    idOrTitle: string,
    params?: Omit<OMDBMovieParams, 'i' | 't'>
  ): Promise<OMDBMovie> => {
    return await repository.getById(idOrTitle, params)
  }

  const fetchMovies = async (params: OMDBSearchParams): Promise<OMDBSearchResponse> => {
    return await repository.search(params)
  }

  /**
   * Search movies with reactive state
   * @param initialQuery Initial search query
   */
  const useMovieSearch = (initialQuery: OMDBSearchParams) => {
    const searchQuery = ref<OMDBSearchParams>(initialQuery)
    
    const { data, error, status, refresh } = useFetch<OMDBSearchResponse>('/api/movies/search', {
      query: searchQuery,
      key: computed(() => `movies-search-${searchQuery.value.s}-${searchQuery.value.page || 1}`),
      watch: [searchQuery]
    })
    
    const updateSearch = (newQuery: Partial<OMDBSearchParams>) => {
      searchQuery.value = { ...searchQuery.value, ...newQuery }
    }
    
    const nextPage = () => {
      const currentPage = searchQuery.value.page || 1
      searchQuery.value = { ...searchQuery.value, page: currentPage + 1 }
    }
    
    const prevPage = () => {
      const currentPage = searchQuery.value.page || 1
      if (currentPage > 1) {
        searchQuery.value = { ...searchQuery.value, page: currentPage - 1 }
      }
    }
    
    return {
      data,
      error,
      status,
      searchQuery: readonly(searchQuery),
      updateSearch,
      nextPage,
      prevPage,
      refresh
    }
  }

  return {
    searchMovies,
    getMovie,
    useMovieSearch,
    fetchMovie,
    fetchMovies,
  }
}
