// app/composables/useMovieList.enhanced.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { useMovieList } from './useMovieList'
import type { MovieListItem, MovieListResponse } from './useMovieList'

// Mock dependencies
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

const mockEnsureAuthenticated = vi.fn()
const mockIsSessionReady = { value: true }
const mockShowSuccess = vi.fn()
const mockShowError = vi.fn()
const mockT = vi.fn((key: string) => key)

mockNuxtImport('useAuthentication', () => {
  return () => ({
    ensureAuthenticated: mockEnsureAuthenticated,
    isSessionReady: mockIsSessionReady
  })
})

mockNuxtImport('useToastNotification', () => {
  return () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError
  })
})

mockNuxtImport('useI18n', () => {
  return () => ({
    t: mockT
  })
})

describe('useMovieList - Enhanced Tests', () => {
  const mockMovieListItem: MovieListItem = {
    id: 1,
    omdbId: 'tt0133093',
    title: 'The Matrix',
    poster: 'https://example.com/poster.jpg',
    year: '1999',
    type: 'movie',
    addedAt: '2024-01-01T00:00:00Z'
  }

  const mockMovieListResponse: MovieListResponse = {
    items: [mockMovieListItem],
    total: 1
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsSessionReady.value = true
    mockEnsureAuthenticated.mockResolvedValue(undefined)
  })

  describe('isInList', () => {
    it('should check if movie is in list', async () => {
      mockFetch.mockResolvedValue({ inList: true })

      const { isInList } = useMovieList()
      const result = await isInList('tt0133093')

      expect(mockEnsureAuthenticated).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/check', {
        query: { omdbId: 'tt0133093' }
      })
      expect(result).toBe(true)
    })

    it('should return false when movie is not in list', async () => {
      mockFetch.mockResolvedValue({ inList: false })

      const { isInList } = useMovieList()
      const result = await isInList('tt9999999')

      expect(result).toBe(false)
    })

    it('should return false when session is not ready', async () => {
      mockIsSessionReady.value = false

      const { isInList } = useMovieList()
      const result = await isInList('tt0133093')

      expect(mockFetch).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('should return false on authentication error', async () => {
      mockEnsureAuthenticated.mockRejectedValue(new Error('Not authenticated'))

      const { isInList } = useMovieList()
      const result = await isInList('tt0133093')

      expect(result).toBe(false)
    })

    it('should return false on API error', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'))

      const { isInList } = useMovieList()
      const result = await isInList('tt0133093')

      expect(result).toBe(false)
    })

    it('should handle network timeout', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockFetch.mockRejectedValue(new Error('Network timeout'))

      const { isInList } = useMovieList()
      const result = await isInList('tt0133093')

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('addToList', () => {
    const movieData = {
      omdbId: 'tt0133093',
      movieTitle: 'The Matrix',
      moviePoster: 'https://example.com/poster.jpg',
      movieYear: '1999',
      movieType: 'movie'
    }

    it('should add movie to list successfully', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const { addToList } = useMovieList()
      const result = await addToList(movieData)

      expect(mockEnsureAuthenticated).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/add', {
        method: 'POST',
        body: movieData
      })
      expect(result).toEqual({ success: true })
    })

    it('should throw error if not authenticated', async () => {
      mockEnsureAuthenticated.mockRejectedValue(new Error('Not authenticated'))

      const { addToList } = useMovieList()

      await expect(addToList(movieData)).rejects.toThrow('Not authenticated')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should handle API errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockFetch.mockRejectedValue(new Error('Failed to add'))

      const { addToList } = useMovieList()

      await expect(addToList(movieData)).rejects.toThrow('Failed to add')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle movie without optional fields', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const minimalData = {
        omdbId: 'tt0133093',
        movieTitle: 'The Matrix',
        moviePoster: 'N/A',
        movieYear: '1999'
      }

      const { addToList } = useMovieList()
      await addToList(minimalData)

      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/add', {
        method: 'POST',
        body: minimalData
      })
    })

    it('should handle duplicate additions', async () => {
      mockFetch.mockResolvedValue({ success: false, message: 'Movie already in list' })

      const { addToList } = useMovieList()
      const result = await addToList(movieData)

      expect(result).toEqual({ success: false, message: 'Movie already in list' })
    })
  })

  describe('removeFromList', () => {
    it('should remove movie from list successfully', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const { removeFromList } = useMovieList()
      const result = await removeFromList('tt0133093')

      expect(mockEnsureAuthenticated).toHaveBeenCalled()
      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/remove', {
        method: 'POST',
        body: { omdbId: 'tt0133093' }
      })
      expect(result).toEqual({ success: true })
    })

    it('should throw error if not authenticated', async () => {
      mockEnsureAuthenticated.mockRejectedValue(new Error('Not authenticated'))

      const { removeFromList } = useMovieList()

      await expect(removeFromList('tt0133093')).rejects.toThrow('Not authenticated')
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should handle API errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockFetch.mockRejectedValue(new Error('Failed to remove'))

      const { removeFromList } = useMovieList()

      await expect(removeFromList('tt0133093')).rejects.toThrow('Failed to remove')
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should handle removing non-existent movie', async () => {
      mockFetch.mockResolvedValue({ success: false, message: 'Movie not found' })

      const { removeFromList } = useMovieList()
      const result = await removeFromList('tt9999999')

      expect(result).toEqual({ success: false, message: 'Movie not found' })
    })

    it('should handle different movie IDs', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const { removeFromList } = useMovieList()

      await removeFromList('tt111')
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user/movie-list/remove', {
        method: 'POST',
        body: { omdbId: 'tt111' }
      })

      await removeFromList('tt222')
      expect(mockFetch).toHaveBeenLastCalledWith('/api/user/movie-list/remove', {
        method: 'POST',
        body: { omdbId: 'tt222' }
      })
    })
  })

  describe('toggleInList', () => {
    const movieData = {
      movieTitle: 'The Matrix',
      moviePoster: 'https://example.com/poster.jpg',
      movieYear: '1999',
      movieType: 'movie'
    }

    it('should add movie when not in list', async () => {
      mockFetch
        .mockResolvedValueOnce({ inList: false }) // isInList check
        .mockResolvedValueOnce({ success: true }) // addToList

      const { toggleInList } = useMovieList()
      const result = await toggleInList('tt0133093', movieData)

      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/check', {
        query: { omdbId: 'tt0133093' }
      })
      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/add', {
        method: 'POST',
        body: { omdbId: 'tt0133093', ...movieData }
      })
      expect(result).toEqual({ success: true })
    })

    it('should remove movie when already in list', async () => {
      mockFetch
        .mockResolvedValueOnce({ inList: true }) // isInList check
        .mockResolvedValueOnce({ success: true }) // removeFromList

      const { toggleInList } = useMovieList()
      const result = await toggleInList('tt0133093', movieData)

      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/check', {
        query: { omdbId: 'tt0133093' }
      })
      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/remove', {
        method: 'POST',
        body: { omdbId: 'tt0133093' }
      })
      expect(result).toEqual({ success: true })
    })

    it('should handle toggle errors', async () => {
      mockFetch
        .mockResolvedValueOnce({ inList: false })
        .mockRejectedValueOnce(new Error('Toggle failed'))

      const { toggleInList } = useMovieList()

      await expect(toggleInList('tt0133093', movieData)).rejects.toThrow('Toggle failed')
    })

    it('should work without optional movieType', async () => {
      mockFetch
        .mockResolvedValueOnce({ inList: false })
        .mockResolvedValueOnce({ success: true })

      const dataWithoutType = {
        movieTitle: 'The Matrix',
        moviePoster: 'poster.jpg',
        movieYear: '1999'
      }

      const { toggleInList } = useMovieList()
      await toggleInList('tt0133093', dataWithoutType)

      expect(mockFetch).toHaveBeenLastCalledWith('/api/user/movie-list/add', {
        method: 'POST',
        body: { omdbId: 'tt0133093', ...dataWithoutType }
      })
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle full movie list workflow', async () => {
      const composable = useMovieList()
      const movieData = {
        movieTitle: 'The Matrix',
        moviePoster: 'poster.jpg',
        movieYear: '1999',
        movieType: 'movie'
      }

      // 1. Check if movie is in list (not in list)
      mockFetch.mockResolvedValueOnce({ inList: false })
      let inList = await composable.isInList('tt0133093')
      expect(inList).toBe(false)

      // 2. Add movie to list
      mockFetch.mockResolvedValueOnce({ success: true })
      await composable.addToList({ omdbId: 'tt0133093', ...movieData })

      // 3. Check again (now in list)
      mockFetch.mockResolvedValueOnce({ inList: true })
      inList = await composable.isInList('tt0133093')
      expect(inList).toBe(true)

      // 4. Remove from list
      mockFetch.mockResolvedValueOnce({ success: true })
      await composable.removeFromList('tt0133093')

      // 5. Check again (not in list anymore)
      mockFetch.mockResolvedValueOnce({ inList: false })
      inList = await composable.isInList('tt0133093')
      expect(inList).toBe(false)
    })

    it('should handle toggle workflow', async () => {
      const composable = useMovieList()
      const movieData = {
        movieTitle: 'The Matrix',
        moviePoster: 'poster.jpg',
        movieYear: '1999'
      }

      // First toggle (add)
      mockFetch
        .mockResolvedValueOnce({ inList: false })
        .mockResolvedValueOnce({ success: true })
      await composable.toggleInList('tt0133093', movieData)

      // Second toggle (remove)
      mockFetch
        .mockResolvedValueOnce({ inList: true })
        .mockResolvedValueOnce({ success: true })
      await composable.toggleInList('tt0133093', movieData)

      expect(mockFetch).toHaveBeenCalledTimes(4)
    })

    it('should handle multiple movies in list', async () => {
      const composable = useMovieList()
      const movies = [
        { omdbId: 'tt111', movieTitle: 'Movie 1', moviePoster: '1.jpg', movieYear: '2020' },
        { omdbId: 'tt222', movieTitle: 'Movie 2', moviePoster: '2.jpg', movieYear: '2021' },
        { omdbId: 'tt333', movieTitle: 'Movie 3', moviePoster: '3.jpg', movieYear: '2022' }
      ]

      mockFetch.mockResolvedValue({ success: true })

      for (const movie of movies) {
        await composable.addToList(movie)
      }

      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('Authentication Edge Cases', () => {
    it('should handle session expiration during operation', async () => {
      mockEnsureAuthenticated.mockRejectedValue(new Error('Session expired'))

      const { addToList } = useMovieList()

      await expect(addToList({
        omdbId: 'tt123',
        movieTitle: 'Test',
        moviePoster: 'test.jpg',
        movieYear: '2024'
      })).rejects.toThrow('Session expired')
    })

    it('should wait for session to be ready', async () => {
      mockIsSessionReady.value = false

      const { isInList } = useMovieList()
      const result = await isInList('tt123')

      expect(result).toBe(false)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('Error Recovery', () => {
    it('should recover from transient errors', async () => {
      const { addToList } = useMovieList()
      const movieData = {
        omdbId: 'tt123',
        movieTitle: 'Test',
        moviePoster: 'test.jpg',
        movieYear: '2024'
      }

      // First attempt fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      await expect(addToList(movieData)).rejects.toThrow('Network error')

      // Second attempt succeeds
      mockFetch.mockResolvedValueOnce({ success: true })
      const result = await addToList(movieData)
      expect(result).toEqual({ success: true })
    })

    it('should log errors without breaking the app', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockFetch.mockRejectedValue(new Error('API Error'))

      const { isInList } = useMovieList()
      const result = await isInList('tt123')

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Data Validation', () => {
    it('should handle empty omdbId', async () => {
      mockFetch.mockResolvedValue({ inList: false })

      const { isInList } = useMovieList()
      await isInList('')

      expect(mockFetch).toHaveBeenCalledWith('/api/user/movie-list/check', {
        query: { omdbId: '' }
      })
    })

    it('should handle special characters in movie data', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const { addToList } = useMovieList()
      await addToList({
        omdbId: 'tt123',
        movieTitle: 'Movie & Title: Special (2024)',
        moviePoster: 'https://example.com/poster?size=large',
        movieYear: '2024'
      })

      expect(mockFetch).toHaveBeenCalled()
    })

    it('should handle missing poster', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const { addToList } = useMovieList()
      await addToList({
        omdbId: 'tt123',
        movieTitle: 'Test Movie',
        moviePoster: 'N/A',
        movieYear: '2024'
      })

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent checks', async () => {
      mockFetch.mockResolvedValue({ inList: true })

      const { isInList } = useMovieList()

      const checks = await Promise.all([
        isInList('tt111'),
        isInList('tt222'),
        isInList('tt333')
      ])

      expect(checks).toEqual([true, true, true])
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })

    it('should handle concurrent add/remove operations', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const composable = useMovieList()

      await Promise.all([
        composable.addToList({
          omdbId: 'tt111',
          movieTitle: 'Movie 1',
          moviePoster: '1.jpg',
          movieYear: '2020'
        }),
        composable.removeFromList('tt222')
      ])

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })
})
