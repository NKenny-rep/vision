// app/composables/useReviews.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReviews, type IReviewRepository } from './useReviews'
import type { Review, CreateReviewDTO } from '~/types'

describe('useReviews', () => {
  // Mock data
  const mockReview: Review = {
    id: '1',
    userId: 'user123',
    userName: 'John Doe',
    userAvatar: 'avatar.jpg',
    contentId: 'tt0133093',
    contentType: 'movie',
    rating: 5,
    comment: 'Amazing movie!',
    likes: 10,
    dislikes: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  const mockReviewsList: Review[] = [
    mockReview,
    {
      id: '2',
      userId: 'user456',
      userName: 'Jane Smith',
      userAvatar: '',
      contentId: 'tt0133093',
      contentType: 'movie',
      rating: 4,
      comment: 'Great film!',
      likes: 5,
      dislikes: 0,
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ]

  const createMockRepository = (): IReviewRepository => ({
    getReviews: vi.fn().mockResolvedValue(mockReviewsList),
    createReview: vi.fn().mockResolvedValue(mockReview),
    updateReview: vi.fn().mockResolvedValue(mockReview),
    deleteReview: vi.fn().mockResolvedValue(undefined),
    toggleLike: vi.fn().mockResolvedValue(true)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Repository Pattern', () => {
    it('should use default repository when none provided', () => {
      const { getReviews } = useReviews()
      expect(getReviews).toBeDefined()
      expect(typeof getReviews).toBe('function')
    })

    it('should use injected repository', async () => {
      const mockRepo = createMockRepository()
      const { getReviews } = useReviews(mockRepo)

      await getReviews('tt0133093')

      expect(mockRepo.getReviews).toHaveBeenCalledWith('tt0133093')
    })
  })

  describe('getReviews', () => {
    it('should fetch reviews for a content ID', async () => {
      const mockRepo = createMockRepository()
      const { getReviews } = useReviews(mockRepo)

      const reviews = await getReviews('tt0133093')

      expect(mockRepo.getReviews).toHaveBeenCalledWith('tt0133093')
      expect(reviews).toEqual(mockReviewsList)
      expect(reviews).toHaveLength(2)
    })

    it('should return empty array on error', async () => {
      const mockRepo = createMockRepository()
      mockRepo.getReviews = vi.fn().mockRejectedValue(new Error('Network error'))

      const { getReviews } = useReviews(mockRepo)
      const reviews = await getReviews('tt0133093')

      expect(reviews).toEqual([])
    })

    it('should handle different content IDs', async () => {
      const mockRepo = createMockRepository()
      const { getReviews } = useReviews(mockRepo)

      await getReviews('tt1234567')
      expect(mockRepo.getReviews).toHaveBeenCalledWith('tt1234567')

      await getReviews('tt7654321')
      expect(mockRepo.getReviews).toHaveBeenCalledWith('tt7654321')
    })
  })

  describe('createReview', () => {
    const reviewData: CreateReviewDTO = {
      contentId: 'tt0133093',
      rating: 5,
      comment: 'Excellent movie!',
      userId: 'user123'
    }

    it('should create a new review', async () => {
      const mockRepo = createMockRepository()
      const { createReview } = useReviews(mockRepo)

      const result = await createReview(reviewData)

      expect(mockRepo.createReview).toHaveBeenCalledWith(reviewData)
      expect(result).toEqual(mockReview)
    })

    it('should handle review with additional user data', async () => {
      const mockRepo = createMockRepository()
      const { createReview } = useReviews(mockRepo)

      const dataWithUserInfo = {
        ...reviewData,
        userName: 'John Doe',
        userAvatar: 'avatar.jpg'
      }

      await createReview(dataWithUserInfo)

      expect(mockRepo.createReview).toHaveBeenCalledWith(dataWithUserInfo)
    })

    it('should return null on error', async () => {
      const mockRepo = createMockRepository()
      mockRepo.createReview = vi.fn().mockRejectedValue(new Error('Failed to create'))

      const { createReview } = useReviews(mockRepo)
      const result = await createReview(reviewData)

      expect(result).toBeNull()
    })

    it('should validate rating range', async () => {
      const mockRepo = createMockRepository()
      const { createReview } = useReviews(mockRepo)

      await createReview({ ...reviewData, rating: 1 })
      expect(mockRepo.createReview).toHaveBeenCalled()

      await createReview({ ...reviewData, rating: 5 })
      expect(mockRepo.createReview).toHaveBeenCalled()
    })
  })

  describe('updateReview', () => {
    it('should update an existing review', async () => {
      const mockRepo = createMockRepository()
      const { updateReview } = useReviews(mockRepo)

      const updateData = { rating: 4, comment: 'Updated comment' }
      const result = await updateReview('1', updateData)

      expect(mockRepo.updateReview).toHaveBeenCalledWith('1', updateData)
      expect(result).toEqual(mockReview)
    })

    it('should allow partial updates', async () => {
      const mockRepo = createMockRepository()
      const { updateReview } = useReviews(mockRepo)

      await updateReview('1', { comment: 'Only update comment' })
      expect(mockRepo.updateReview).toHaveBeenCalledWith('1', { comment: 'Only update comment' })

      await updateReview('1', { rating: 3 })
      expect(mockRepo.updateReview).toHaveBeenCalledWith('1', { rating: 3 })
    })

    it('should return null on error', async () => {
      const mockRepo = createMockRepository()
      mockRepo.updateReview = vi.fn().mockRejectedValue(new Error('Update failed'))

      const { updateReview } = useReviews(mockRepo)
      const result = await updateReview('1', { rating: 4 })

      expect(result).toBeNull()
    })
  })

  describe('deleteReview', () => {
    it('should delete a review by ID', async () => {
      const mockRepo = createMockRepository()
      const { deleteReview } = useReviews(mockRepo)

      const result = await deleteReview('1')

      expect(mockRepo.deleteReview).toHaveBeenCalledWith('1')
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const mockRepo = createMockRepository()
      mockRepo.deleteReview = vi.fn().mockRejectedValue(new Error('Delete failed'))

      const { deleteReview } = useReviews(mockRepo)
      const result = await deleteReview('1')

      expect(result).toBe(false)
    })

    it('should handle different review IDs', async () => {
      const mockRepo = createMockRepository()
      const { deleteReview } = useReviews(mockRepo)

      await deleteReview('review-123')
      expect(mockRepo.deleteReview).toHaveBeenCalledWith('review-123')

      await deleteReview('review-456')
      expect(mockRepo.deleteReview).toHaveBeenCalledWith('review-456')
    })
  })

  describe('toggleLike', () => {
    it('should toggle like on a review', async () => {
      const mockRepo = createMockRepository()
      const { toggleLike } = useReviews(mockRepo)

      const result = await toggleLike('1')

      expect(mockRepo.toggleLike).toHaveBeenCalledWith('1')
      expect(result).toBe(true)
    })

    it('should return false on error', async () => {
      const mockRepo = createMockRepository()
      mockRepo.toggleLike = vi.fn().mockRejectedValue(new Error('Toggle failed'))

      const { toggleLike } = useReviews(mockRepo)
      const result = await toggleLike('1')

      expect(result).toBe(false)
    })

    it('should handle unlike (toggle off)', async () => {
      const mockRepo = createMockRepository()
      mockRepo.toggleLike = vi.fn().mockResolvedValue(false)

      const { toggleLike } = useReviews(mockRepo)
      const result = await toggleLike('1')

      expect(result).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should log errors but not throw', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockRepo = createMockRepository()
      mockRepo.getReviews = vi.fn().mockRejectedValue(new Error('API Error'))

      const { getReviews } = useReviews(mockRepo)
      const result = await getReviews('tt123')

      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toEqual([])

      consoleSpy.mockRestore()
    })

    it('should handle network errors gracefully', async () => {
      const mockRepo = createMockRepository()
      mockRepo.createReview = vi.fn().mockRejectedValue(new Error('Network timeout'))

      const { createReview } = useReviews(mockRepo)
      const result = await createReview({
        contentId: 'tt123',
        rating: 5,
        comment: 'Test'
      })

      expect(result).toBeNull()
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle full review lifecycle', async () => {
      const mockRepo = createMockRepository()
      const composable = useReviews(mockRepo)

      // Get initial reviews
      const reviews = await composable.getReviews('tt0133093')
      expect(reviews).toHaveLength(2)

      // Create new review
      const newReview = await composable.createReview({
        contentId: 'tt0133093',
        rating: 5,
        comment: 'New review'
      })
      expect(newReview).toBeDefined()

      // Update review
      const updated = await composable.updateReview('1', { rating: 4 })
      expect(updated).toBeDefined()

      // Toggle like
      const liked = await composable.toggleLike('1')
      expect(liked).toBe(true)

      // Delete review
      const deleted = await composable.deleteReview('1')
      expect(deleted).toBe(true)
    })

    it('should handle multiple concurrent operations', async () => {
      const mockRepo = createMockRepository()
      const composable = useReviews(mockRepo)

      const operations = await Promise.all([
        composable.getReviews('tt0133093'),
        composable.createReview({ contentId: 'tt0133093', rating: 5, comment: 'Test' }),
        composable.toggleLike('1')
      ])

      expect(operations[0]).toEqual(mockReviewsList)
      expect(operations[1]).toEqual(mockReview)
      expect(operations[2]).toBe(true)
    })
  })

  describe('Type Safety', () => {
    it('should enforce proper review data structure', async () => {
      const mockRepo = createMockRepository()
      const { createReview } = useReviews(mockRepo)

      const validData: CreateReviewDTO = {
        contentId: 'tt0133093',
        rating: 5,
        comment: 'Valid review'
      }

      await createReview(validData)
      expect(mockRepo.createReview).toHaveBeenCalledWith(validData)
    })

    it('should handle optional fields', async () => {
      const mockRepo = createMockRepository()
      const { updateReview } = useReviews(mockRepo)

      // Only rating
      await updateReview('1', { rating: 4 })
      expect(mockRepo.updateReview).toHaveBeenCalled()

      // Only comment
      await updateReview('1', { comment: 'Updated' })
      expect(mockRepo.updateReview).toHaveBeenCalled()
    })
  })
})
