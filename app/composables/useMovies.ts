import type { OMDBSearchResponse, OMDBMovie, OMDBSearchParams, OMDBMovieParams } from '~/types'

export const useMovies = () => {
  /**
   * Search for movies by title
   * @param params Search parameters
   * @returns Search results with movies array
   */
  const searchMovies = async (params: OMDBSearchParams) => {
    const { data, error, status } = await useFetch<OMDBSearchResponse>('/api/movies/search', {
      query: params,
      key: `movies-search-${params.s}-${params.page || 1}`
    })
    
    return { data, error, status }
  }

  /**
   * Get a single movie by IMDb ID or title
   * @param idOrTitle IMDb ID (e.g., 'tt1285016') or movie title (e.g., 'The Matrix')
   * @param params Optional additional parameters
   * @returns Movie details
   */
  const getMovie = async (
    idOrTitle: string, 
    params?: Omit<OMDBMovieParams, 'i' | 't'>
  ) => {
    const { data, error, status } = await useFetch<OMDBMovie>(`/api/movies/${encodeURIComponent(idOrTitle)}`, {
      query: params,
      key: `movie-${idOrTitle}-${params?.plot || 'short'}`
    })
    

    return { data, error, status }
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
    useMovieSearch
  }
}
