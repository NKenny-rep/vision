/**
 * useReviews Composable
 * Adapter for review data management
 * 
 * Follows the same pattern as useAuthentication and useMovies:
 * - Abstracts data access layer
 * - Uses $fetch instead of useFetch (not tied to component lifecycle)
 * - Centralizes review business logic
 * - Easy to switch from mock to real API
 */

import type { Review, CreateReviewDTO, ContentType } from '~/types'
import { SKELETON_TESTING_DELAY_MS, applyTestingDelay } from '~/utils/testing'

export const useReviews = () => {
  /**
   * Get all reviews for a specific content item
   * @param contentId - IMDb ID or content identifier
   */
  const getReviews = async (contentId: string): Promise<Review[]> => {
    try {
      // 🧪 TESTING: Delay to see skeleton
      if (SKELETON_TESTING_DELAY_MS > 0) await applyTestingDelay()
      
      // TODO: Replace with real API call when backend is ready
      // return await $fetch(`/api/reviews/${contentId}`)
      
      // Mock data for now
      return getMockReviews(contentId)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      return []
    }
  }

  /**
   * Create a new review
   * @param data - Review data (rating, comment, contentId)
   */
  const createReview = async (
    data: CreateReviewDTO & { 
      userId?: string
      userName?: string
      userAvatar?: string
    }
  ): Promise<Review | null> => {
    try {
      // TODO: Replace with real API call
      // return await $fetch('/api/reviews', {
      //   method: 'POST',
      //   body: data
      // })

      // Mock: Create review locally
      const newReview: Review = {
        id: Date.now().toString(),
        userId: data.userId || 'current-user',
        userName: data.userName || 'Anonymous',
        userAvatar: data.userAvatar || '',
        contentId: data.contentId,
        contentType: 'movie',
        rating: data.rating,
        comment: data.comment,
        likes: 0,
        dislikes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      return newReview
    } catch (error) {
      console.error('Failed to create review:', error)
      return null
    }
  }

  /**
   * Update an existing review
   * @param id - Review ID
   * @param data - Updated review data
   */
  const updateReview = async (
    id: string, 
    data: Partial<Pick<Review, 'rating' | 'comment'>>
  ): Promise<boolean> => {
    try {
      // TODO: Replace with real API call
      // await $fetch(`/api/reviews/${id}`, {
      //   method: 'PUT',
      //   body: data
      // })

      console.log('Update review:', id, data)
      return true
    } catch (error) {
      console.error('Failed to update review:', error)
      return false
    }
  }

  /**
   * Delete a review
   * @param id - Review ID
   */
  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      // TODO: Replace with real API call
      // await $fetch(`/api/reviews/${id}`, {
      //   method: 'DELETE'
      // })

      console.log('Delete review:', id)
      return true
    } catch (error) {
      console.error('Failed to delete review:', error)
      return false
    }
  }

  /**
   * Like/unlike a review
   * @param id - Review ID
   */
  const toggleLike = async (id: string): Promise<boolean> => {
    try {
      // TODO: Replace with real API call
      // await $fetch(`/api/reviews/${id}/like`, {
      //   method: 'POST'
      // })

      console.log('Toggle like on review:', id)
      return true
    } catch (error) {
      console.error('Failed to toggle like:', error)
      return false
    }
  }

  return {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    toggleLike
  }
}

/**
 * Mock data generator
 * Remove this when real API is implemented
 */
function getMockReviews(contentId: string): Review[] {
  return [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: '',
      contentId: contentId,
      contentType: 'movie' as ContentType,
      rating: 5,
      comment: 'Amazing movie! The plot was incredibly engaging and the cinematography was stunning. Highly recommend!',
      likes: 24,
      dislikes: 2,
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Jane Smith',
      userAvatar: '',
      contentId: contentId,
      contentType: 'movie' as ContentType,
      rating: 4,
      comment: 'Great film overall. Some parts were a bit slow but the ending made up for it. Definitely worth watching.',
      likes: 15,
      dislikes: 1,
      createdAt: new Date('2024-01-06'),
      updatedAt: new Date('2024-01-06')
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Mike Johnson',
      userAvatar: '',
      contentId: contentId,
      contentType: 'movie' as ContentType,
      rating: 3.5,
      comment: 'Decent movie. Acting was good but the story could have been better developed.',
      likes: 8,
      dislikes: 3,
      createdAt: new Date('2024-01-07'),
      updatedAt: new Date('2024-01-07')
    }
  ]
}
