// app/composables/useMovieList.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { useMovieList } from './useMovieList'

const { useToastMock } = vi.hoisted(() => ({
  useToastMock: vi.fn(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn()
  }))
}))

const { useAuthenticationMock } = vi.hoisted(() => ({
  useAuthenticationMock: vi.fn()
}))

mockNuxtImport('useToastNotification', () => useToastMock)
mockNuxtImport('useAuthentication', () => useAuthenticationMock)

describe('useMovieList', () => { 
  let mockShowSuccess: ReturnType<typeof vi.fn>
  let mockShowError: ReturnType<typeof vi.fn>

  beforeEach(() => { 
    vi.clearAllMocks()
    mockShowSuccess = vi.fn()
    mockShowError = vi.fn()
    
    useToastMock.mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: mockShowError
    })

    useAuthenticationMock.mockReturnValue({
      ensureAuthenticated: vi.fn().mockResolvedValue({ id: 1 }),
      isSessionReady: { value: true }
    })
  })

  const mountComposable = async () => { 
    let result: ReturnType<typeof useMovieList>
    await mountSuspended(defineComponent({ 
      setup() { 
        result = useMovieList()
        return () => null
      },
    }))
    return result!
  }

  it('should check if movie is in list', async () => { 
    registerEndpoint('/api/user/movie-list/check', () => ({ inList: true }))

    const { isInList } = await mountComposable()
    const result = await isInList('tt123')

    expect(result).toBe(true)
  })

  it('should return false if movie is not in list', async () => { 
    registerEndpoint('/api/user/movie-list/check', () => ({ inList: false }))

    const { isInList } = await mountComposable()
    const result = await isInList('tt123')

    expect(result).toBe(false)
  })

  it('should add a movie to the list', async () => { 
    registerEndpoint('/api/user/movie-list/add', {
      method: 'POST',
      handler: () => ({ success: true, inList: true })
    })

    const { addToList } = await mountComposable()
    const movieData = {
      omdbId: 'tt123',
      movieTitle: 'Test Movie',
      moviePoster: 'poster.jpg',
      movieYear: '2023',
      movieType: 'movie',
    }
    const result = await addToList(movieData)

    expect(result).toEqual({ success: true, inList: true })
  })

  it('should handle error when adding a movie to the list', async () => { 
    registerEndpoint('/api/user/movie-list/add', {
      method: 'POST',
      handler: () => { throw new Error('Failed to add') }
    })

    const { addToList } = await mountComposable()
    const movieData = {
      omdbId: 'tt123',
      movieTitle: 'Test Movie',
      moviePoster: 'poster.jpg',
      movieYear: '2023',
      movieType: 'movie',
    }
    
    await expect(addToList(movieData)).rejects.toThrow()
  })

  it('should remove a movie from the list', async () => { 
    registerEndpoint('/api/user/movie-list/remove', {
      method: 'POST',
      handler: () => ({ success: true, inList: false })
    })

    const { removeFromList } = await mountComposable()
    const result = await removeFromList('tt123')

    expect(result).toEqual({ success: true, inList: false })
  })

  it('should handle error when removing a movie from the list', async () => { 
    registerEndpoint('/api/user/movie-list/remove', {
      method: 'POST',
      handler: () => { throw new Error('Failed to remove') }
    })

    const { removeFromList } = await mountComposable()
    
    await expect(removeFromList('tt123')).rejects.toThrow()
  })

  it('should toggle movie in list', async () => { 
    registerEndpoint('/api/user/movie-list/check', () => ({ inList: false }))
    registerEndpoint('/api/user/movie-list/add', {
      method: 'POST',
      handler: () => ({ success: true, inList: true })
    })

    const { toggleInList } = await mountComposable()
    const movieData = {
      omdbId: 'tt123',
      movieTitle: 'Test Movie',
      moviePoster: 'poster.jpg',
      movieYear: '2023',
    }
    const result = await toggleInList(movieData)

    expect(result).toEqual({ success: true, inList: true })
  })
})
