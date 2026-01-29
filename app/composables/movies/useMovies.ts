import type { OMDBSearchResponse, OMDBMovie, OMDBSearchParams, OMDBMovieParams } from '~/types'
import { API_ROUTES } from '~/constants/apiRoutes'

export interface IMovieRepository {
  search(params: OMDBSearchParams): Promise<OMDBSearchResponse>
  getById(idOrTitle: string, params?: Omit<OMDBMovieParams, 'i' | 't'>): Promise<OMDBMovie>
}

interface FetchError {
  statusCode?: number
  message?: string
  data?: {
    message?: string
  }
  response?: {
    status?: number
  }
}

// Type guard to check if error is a FetchError
const isFetchError = (error: unknown): error is FetchError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('statusCode' in error || 'message' in error || 'response' in error)
  )
}

// Type guard to check if error is an Error instance
const isErrorInstance = (error: unknown): error is Error => {
  return error instanceof Error
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
  // Global state for API limit error (called inside composable context)
  const apiLimitError = useState<boolean>('omdb-api-limit-error', () => false)
  const apiLimitMessage = useState<string>('omdb-api-limit-message', () => '')
  
  const extractErrorDetails = (error: unknown): { statusCode?: number; message: string } => {
    if (isFetchError(error)) {
      const statusCode = error.statusCode ?? error.response?.status
      const message = error.data?.message ?? error.message ?? 'An error occurred'
      return { statusCode, message }
    }
    
    if (isErrorInstance(error)) {
      return { message: error.message }
    }
    
    return { message: 'An unknown error occurred' }
  }
  
  const handleApiError = (error: unknown): { statusCode?: number; errorMessage: string } => {
    const { statusCode, message: errorMessage } = extractErrorDetails(error)
    
    // Check for 401 Unauthorized (API limit reached)
    if (statusCode === 401) {
      apiLimitError.value = true
      apiLimitMessage.value = errorMessage
    }
    
    return { statusCode, errorMessage }
  }
  
  const clearApiError = (): void => {
    apiLimitError.value = false
    apiLimitMessage.value = ''
  }
  
  const searchMovies = async (params: OMDBSearchParams) => {
    try {
      const data = await $fetch<OMDBSearchResponse>(API_ROUTES.MOVIES.SEARCH, {
        query: params,
      })
      if (data && data.Response === 'True' && Array.isArray(data.Search)) {
        return { data: data.Search, error: null, status: 'success' as const };
      } else if (data && data.Response === 'False') {
        return { data: [], error: { message: data.Error || 'No results found.' }, status: 'empty' as const };
      } else {
        return { data: [], error: { message: 'Unexpected response from server.' }, status: 'error' as const };
      }
    } catch (error: unknown) {
      const { statusCode, errorMessage } = handleApiError(error)
      return { 
        data: [], 
        error: { message: errorMessage, statusCode }, 
        status: 'error' as const
      };
    }
  }

  const getMovie = async (
    idOrTitle: string, 
    params?: Omit<OMDBMovieParams, 'i' | 't'>
  ) => {
    const { data, error, status } = await useAsyncData<OMDBMovie>(
      `movie-${idOrTitle}-${params?.plot || 'short'}`,
      async () => {
        try {
          return await repository.getById(idOrTitle, params)
        } catch (err: unknown) {
          handleApiError(err)
          throw err
        }
      },
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
    // Global error state
    apiLimitError: readonly(apiLimitError),
    apiLimitMessage: readonly(apiLimitMessage),
    clearApiError,
  }
}
