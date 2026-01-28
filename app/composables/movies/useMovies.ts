import type { OMDBSearchResponse, OMDBMovie, OMDBSearchParams, OMDBMovieParams } from '~/types'
import { API_ROUTES } from '~/constants/apiRoutes'

export interface IMovieRepository {
  search(params: OMDBSearchParams): Promise<OMDBSearchResponse>
  getById(idOrTitle: string, params?: Omit<OMDBMovieParams, 'i' | 't'>): Promise<OMDBMovie>
}

interface ApiError {
  statusCode?: number
  message?: string
}

interface AsyncDataResult<T> {
  data: Ref<T | null>
  error: Ref<ApiError | null>
  status: Ref<string>
}

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

export const useMovies = (repository: IMovieRepository = new MovieApiAdapter()) => {
  const searchMovies = async (params: OMDBSearchParams) => {
    try {
      const data = await $fetch<OMDBSearchResponse>(API_ROUTES.MOVIES.SEARCH, {
        query: params,
      })
      if (data && data.Response === 'True' && Array.isArray(data.Search)) {
        return { data: data.Search, error: null, status: 'success' };
      } else if (data && data.Response === 'False') {
        return { data: [], error: { message: data.Error || 'No results found.' }, status: 'empty' };
      } else {
        return { data: [], error: { message: 'Unexpected response from server.' }, status: 'error' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return { data: [], error: { message: errorMessage }, status: 'error' };
    }
  }

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
    
    const { data, error, status, refresh } = useFetch<OMDBSearchResponse>(API_ROUTES.MOVIES.SEARCH, {
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
    // Error helpers
    isApiLimitError: (error: ApiError | null): boolean => error?.statusCode === 401,
    hasErrors: (results: AsyncDataResult<unknown>[]): boolean => results.some(r => r.error && r.error.value),
    getErrorCount: (results: AsyncDataResult<unknown>[]): number => results.filter(r => r.error && r.error.value).length,
    hasApiLimitError: (results: AsyncDataResult<unknown>[]): boolean => results.some(r => r.error && r.error.value && r.error.value.statusCode === 401),
  }
}
