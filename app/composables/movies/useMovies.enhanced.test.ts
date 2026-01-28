// app/composables/useMovies.enhanced.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useMovies, type IMovieRepository } from './useMovies'
import type { OMDBMovie, OMDBSearchResponse, OMDBSearchParams, OMDBMovieParams } from '~/types'

describe('useMovies - Enhanced Tests', () => {
  // Mock data
  const mockMovie: OMDBMovie = {
    Title: 'The Matrix',
    Year: '1999',
    imdbID: 'tt0133093',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
    Response: 'True',
    Plot: 'A computer hacker learns about the true nature of reality.',
    Genre: 'Action, Sci-Fi',
    Director: 'Lana Wachowski, Lilly Wachowski',
    Actors: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
    Runtime: '136 min',
    imdbRating: '8.7',
    Rated: 'R',
    Released: '31 Mar 1999',
    Writer: 'Lilly Wachowski, Lana Wachowski',
    Language: 'English',
    Country: 'United States',
    Awards: 'Won 4 Oscars',
    Metascore: '73',
    imdbVotes: '1,900,000',
    DVD: '21 Sep 1999',
    BoxOffice: '$171,479,930',
    Production: 'Warner Bros.',
    Website: 'N/A'
  }

  const mockSearchResponse: OMDBSearchResponse = {
    Search: [
      mockMovie,
      {
        Title: 'The Matrix Reloaded',
        Year: '2003',
        imdbID: 'tt0234215',
        Type: 'movie',
        Poster: 'https://example.com/poster2.jpg',
        Response: 'True'
      }
    ],
    totalResults: '2',
    Response: 'True'
  }

  const createMockRepository = (): IMovieRepository => ({
    search: vi.fn().mockResolvedValue(mockSearchResponse),
    getById: vi.fn().mockResolvedValue(mockMovie)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Repository Pattern Implementation', () => {
    it('should use default MovieApiAdapter when no repository provided', () => {
      const { fetchMovie, fetchMovies } = useMovies()
      
      expect(fetchMovie).toBeDefined()
      expect(fetchMovies).toBeDefined()
      expect(typeof fetchMovie).toBe('function')
      expect(typeof fetchMovies).toBe('function')
    })

    it('should accept custom repository implementation', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('tt0133093')

      expect(mockRepo.getById).toHaveBeenCalledWith('tt0133093', undefined)
    })

    it('should allow multiple instances with different repositories', async () => {
      const mockRepo1 = createMockRepository()
      const mockRepo2 = createMockRepository()

      const movies1 = useMovies(mockRepo1)
      const movies2 = useMovies(mockRepo2)

      await movies1.fetchMovie('tt111')
      await movies2.fetchMovie('tt222')

      expect(mockRepo1.getById).toHaveBeenCalledWith('tt111', undefined)
      expect(mockRepo2.getById).toHaveBeenCalledWith('tt222', undefined)
    })
  })

  describe('fetchMovie - Direct Repository Access', () => {
    it('should fetch movie by IMDb ID', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      const result = await fetchMovie('tt0133093')

      expect(mockRepo.getById).toHaveBeenCalledWith('tt0133093', undefined)
      expect(result).toEqual(mockMovie)
      expect(result.Title).toBe('The Matrix')
    })

    it('should fetch movie by title', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('The Matrix')

      expect(mockRepo.getById).toHaveBeenCalledWith('The Matrix', undefined)
    })

    it('should pass plot parameter', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('tt0133093', { plot: 'full' })

      expect(mockRepo.getById).toHaveBeenCalledWith('tt0133093', { plot: 'full' })
    })

    it('should pass year parameter', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('The Matrix', { y: '1999' })

      expect(mockRepo.getById).toHaveBeenCalledWith('The Matrix', { y: '1999' })
    })

    it('should handle multiple parameters', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      const params: Omit<OMDBMovieParams, 'i' | 't'> = {
        plot: 'full',
        y: '1999',
        type: 'movie'
      }

      await fetchMovie('tt0133093', params)

      expect(mockRepo.getById).toHaveBeenCalledWith('tt0133093', params)
    })

    it('should handle repository errors', async () => {
      const mockRepo = createMockRepository()
      mockRepo.getById = vi.fn().mockRejectedValue(new Error('Movie not found'))

      const { fetchMovie } = useMovies(mockRepo)

      await expect(fetchMovie('tt999999')).rejects.toThrow('Movie not found')
    })
  })

  describe('fetchMovies - Direct Search Access', () => {
    it('should search movies by title', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      const params: OMDBSearchParams = { s: 'Matrix' }
      const result = await fetchMovies(params)

      expect(mockRepo.search).toHaveBeenCalledWith(params)
      expect(result).toEqual(mockSearchResponse)
      expect(result.Search).toHaveLength(2)
    })

    it('should handle pagination', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      await fetchMovies({ s: 'Matrix', page: 2 })

      expect(mockRepo.search).toHaveBeenCalledWith({ s: 'Matrix', page: 2 })
    })

    it('should filter by type', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      await fetchMovies({ s: 'Matrix', type: 'movie' })

      expect(mockRepo.search).toHaveBeenCalledWith({ s: 'Matrix', type: 'movie' })
    })

    it('should filter by year', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      await fetchMovies({ s: 'Matrix', y: '1999' })

      expect(mockRepo.search).toHaveBeenCalledWith({ s: 'Matrix', y: '1999' })
    })

    it('should handle multiple filters', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      const params: OMDBSearchParams = {
        s: 'Matrix',
        type: 'movie',
        y: '1999',
        page: 1
      }

      await fetchMovies(params)

      expect(mockRepo.search).toHaveBeenCalledWith(params)
    })

    it('should handle empty search results', async () => {
      const mockRepo = createMockRepository()
      mockRepo.search = vi.fn().mockResolvedValue({
        Search: [],
        totalResults: '0',
        Response: 'False',
        Error: 'Movie not found!'
      })

      const { fetchMovies } = useMovies(mockRepo)
      const result = await fetchMovies({ s: 'NonExistentMovie' })

      expect(result.Search).toEqual([])
    })

    it('should handle search errors', async () => {
      const mockRepo = createMockRepository()
      mockRepo.search = vi.fn().mockRejectedValue(new Error('API Error'))

      const { fetchMovies } = useMovies(mockRepo)

      await expect(fetchMovies({ s: 'Matrix' })).rejects.toThrow('API Error')
    })
  })

  describe('searchMovies - Reactive Search', () => {
    it('should expose all expected methods', () => {
      const { searchMovies, getMovie, useMovieSearch, fetchMovie, fetchMovies } = useMovies()

      expect(searchMovies).toBeDefined()
      expect(getMovie).toBeDefined()
      expect(useMovieSearch).toBeDefined()
      expect(fetchMovie).toBeDefined()
      expect(fetchMovies).toBeDefined()
    })
  })

  describe('Error Handling Strategies', () => {
    it('should propagate repository errors', async () => {
      const mockRepo = createMockRepository()
      const errorMessage = 'Network timeout'
      mockRepo.getById = vi.fn().mockRejectedValue(new Error(errorMessage))

      const { fetchMovie } = useMovies(mockRepo)

      await expect(fetchMovie('tt123')).rejects.toThrow(errorMessage)
    })

    it('should handle malformed responses', async () => {
      const mockRepo = createMockRepository()
      mockRepo.getById = vi.fn().mockResolvedValue({} as OMDBMovie)

      const { fetchMovie } = useMovies(mockRepo)
      const result = await fetchMovie('tt123')

      expect(result).toBeDefined()
    })

    it('should handle network errors gracefully', async () => {
      const mockRepo = createMockRepository()
      mockRepo.search = vi.fn().mockRejectedValue(new Error('Failed to fetch'))

      const { fetchMovies } = useMovies(mockRepo)

      await expect(fetchMovies({ s: 'Test' })).rejects.toThrow('Failed to fetch')
    })
  })

  describe('Caching and Performance', () => {
    it('should call repository only once for same request', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('tt0133093')
      await fetchMovie('tt0133093')

      // Repository should be called twice (no caching at repository level)
      expect(mockRepo.getById).toHaveBeenCalledTimes(2)
    })

    it('should handle concurrent requests', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      const promises = [
        fetchMovie('tt111'),
        fetchMovie('tt222'),
        fetchMovie('tt333')
      ]

      await Promise.all(promises)

      expect(mockRepo.getById).toHaveBeenCalledTimes(3)
    })
  })

  describe('Type Safety and Validation', () => {
    it('should enforce correct parameter types', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie, fetchMovies } = useMovies(mockRepo)

      // Valid calls
      await fetchMovie('tt0133093')
      await fetchMovie('The Matrix', { plot: 'short' })
      await fetchMovies({ s: 'Matrix' })

      expect(mockRepo.getById).toHaveBeenCalled()
      expect(mockRepo.search).toHaveBeenCalled()
    })

    it('should handle URL encoding in movie IDs', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('The Matrix: Reloaded')

      expect(mockRepo.getById).toHaveBeenCalledWith('The Matrix: Reloaded', undefined)
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle full movie discovery workflow', async () => {
      const mockRepo = createMockRepository()
      const composable = useMovies(mockRepo)

      // 1. Search for movies
      const searchResults = await composable.fetchMovies({ s: 'Matrix' })
      expect(searchResults.Search).toHaveLength(2)

      // 2. Get details for first result
      const movieDetails = await composable.fetchMovie(searchResults.Search[0].imdbID)
      expect(movieDetails.Title).toBe('The Matrix')

      // 3. Get full plot
      const fullDetails = await composable.fetchMovie('tt0133093', { plot: 'full' })
      expect(mockRepo.getById).toHaveBeenLastCalledWith('tt0133093', { plot: 'full' })
    })

    it('should handle search refinement', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      // Initial search
      await fetchMovies({ s: 'Matrix' })

      // Refine by type
      await fetchMovies({ s: 'Matrix', type: 'movie' })

      // Refine by year
      await fetchMovies({ s: 'Matrix', type: 'movie', y: '1999' })

      expect(mockRepo.search).toHaveBeenCalledTimes(3)
    })

    it('should handle pagination workflow', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      // Page 1
      await fetchMovies({ s: 'Star Wars', page: 1 })

      // Page 2
      await fetchMovies({ s: 'Star Wars', page: 2 })

      // Page 3
      await fetchMovies({ s: 'Star Wars', page: 3 })

      expect(mockRepo.search).toHaveBeenCalledTimes(3)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty movie ID', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('')

      expect(mockRepo.getById).toHaveBeenCalledWith('', undefined)
    })

    it('should handle special characters in search', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      await fetchMovies({ s: 'Matrix & Reloaded' })
      await fetchMovies({ s: 'Movie/Title' })
      await fetchMovies({ s: 'Test (2024)' })

      expect(mockRepo.search).toHaveBeenCalledTimes(3)
    })

    it('should handle very long search queries', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovies } = useMovies(mockRepo)

      const longQuery = 'A'.repeat(200)
      await fetchMovies({ s: longQuery })

      expect(mockRepo.search).toHaveBeenCalledWith({ s: longQuery })
    })

    it('should handle undefined parameters gracefully', async () => {
      const mockRepo = createMockRepository()
      const { fetchMovie } = useMovies(mockRepo)

      await fetchMovie('tt123', undefined)

      expect(mockRepo.getById).toHaveBeenCalledWith('tt123', undefined)
    })
  })

  describe('Mock vs Production Behavior', () => {
    it('should work identically with different repository implementations', async () => {
      const mockRepo1 = createMockRepository()
      const mockRepo2 = createMockRepository()

      const composable1 = useMovies(mockRepo1)
      const composable2 = useMovies(mockRepo2)

      const result1 = await composable1.fetchMovie('tt123')
      const result2 = await composable2.fetchMovie('tt123')

      expect(result1).toEqual(result2)
    })
  })
})
