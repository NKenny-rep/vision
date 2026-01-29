// app/composables/useMovies.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { defineComponent, ref } from 'vue'
import { useMovies } from './useMovies'

const { useFetchMock, useAsyncDataMock } = vi.hoisted(() => ({
  useFetchMock: vi.fn(),
  useAsyncDataMock: vi.fn()
}))

mockNuxtImport('useFetch', () => useFetchMock)
mockNuxtImport('useAsyncData', () => useAsyncDataMock)

describe('useMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFetchMock.mockReturnValue({
      data: ref(null),
      error: ref(null),
      status: ref('idle'),
      refresh: vi.fn(),
    })
    useAsyncDataMock.mockReturnValue({
      data: ref(null),
      error: ref(null),
      status: ref('idle'),
      refresh: vi.fn(),
    })
  })

  // Helper to mount a component and use the composable
  const mountComposable = async () => {
    let result: ReturnType<typeof useMovies>
    const wrapper = await mountSuspended(defineComponent({
      setup() {
        result = useMovies()
        return () => null
      },
    }))
    return { wrapper, result: result! }
  }

  it('should search movies successfully', async () => {
    const mockResponse = {
      Search: [
        { Title: 'Movie 1', Year: '2020', imdbID: 'tt123', Type: 'movie', Poster: 'N/A' },
        { Title: 'Movie 2', Year: '2021', imdbID: 'tt456', Type: 'movie', Poster: 'N/A' },
      ],
      totalResults: '2',
      Response: 'True',
    }

    global.$fetch = vi.fn().mockResolvedValue(mockResponse)

    const { result } = await mountComposable()
    const { data, error, status } = await result.searchMovies({ s: 'test' })

    expect(global.$fetch).toHaveBeenCalled()
    expect(data).toEqual(mockResponse.Search)
    expect(error).toBeNull()
    expect(status).toBe('success')
  })

  it('should handle movie search error', async () => {
    const mockError = new Error('Something went wrong!')
    
    global.$fetch = vi.fn().mockRejectedValue(mockError)

    const { result } = await mountComposable()
    const { data, error, status } = await result.searchMovies({ s: 'test' })

    expect(data).toEqual([])
    expect(error).toEqual({ message: 'Something went wrong!' })
    expect(status).toBe('error')
  })

  it('should fetch movie details successfully by ID', async () => {
    const mockResponse = {
      Title: 'Detailed Movie',
      imdbID: 'tt789',
      Response: 'True',
    }
    
    useAsyncDataMock.mockReturnValueOnce({
      data: ref(mockResponse),
      error: ref(null),
      status: ref('success'),
      refresh: vi.fn(),
    })

    const { result } = await mountComposable()
    const { data, error } = await result.getMovie('tt789')

    expect(useAsyncDataMock).toHaveBeenCalled()
    expect(data.value).toEqual(mockResponse)
    expect(error.value).toBeNull()
  })

  it('should fetch movie details successfully by title', async () => {
    const mockResponse = {
      Title: 'Detailed Movie',
      imdbID: 'tt789',
      Response: 'True',
    }
    
    useAsyncDataMock.mockReturnValueOnce({
      data: ref(mockResponse),
      error: ref(null),
      status: ref('success'),
      refresh: vi.fn(),
    })

    const { result } = await mountComposable()
    await result.getMovie('Detailed Movie')

    expect(useAsyncDataMock).toHaveBeenCalled()
  })

  it('should handle movie details fetch error', async () => {
    const mockError = new Error('Movie not found!')
    
    useAsyncDataMock.mockReturnValueOnce({
      data: ref(null),
      error: ref(mockError),
      status: ref('error'),
      refresh: vi.fn(),
    })

    const { result } = await mountComposable()
    const { data, error } = await result.getMovie('invalid-id')

    expect(data.value).toBeNull()
    expect(error.value).toEqual(mockError)
  })
})
