import type { Review, CreateReviewDTO, ContentType } from '~/types'
import { SKELETON_TESTING_DELAY_MS, applyTestingDelay } from '~/utils/testing'

export interface IReviewRepository {
  getReviews(contentId: string): Promise<Review[]>
  createReview(data: CreateReviewDTO): Promise<Review>
  updateReview(id: string, data: Partial<CreateReviewDTO>): Promise<Review>
  deleteReview(id: string): Promise<void>
  toggleLike(reviewId: string): Promise<boolean>
}

class MockReviewRepository implements IReviewRepository {
  async getReviews(contentId: string): Promise<Review[]> {
    if (SKELETON_TESTING_DELAY_MS > 0) await applyTestingDelay()
    return initializeMockReviews(contentId)
  }

  async createReview(data: CreateReviewDTO): Promise<Review> {
    const reviews = initializeMockReviews(data.contentId)
    const newReview: Review = {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Current User',
      userAvatar: '',
      contentId: data.contentId,
      contentType: 'movie',
      rating: data.rating,
      comment: data.comment,
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    reviews.push(newReview)
    return newReview
  }

  async updateReview(id: string, data: Partial<CreateReviewDTO>): Promise<Review> {
    // Find review across all content IDs
    for (const reviews of mockReviewsStore.values()) {
      const existingReview = reviews.find(r => r.id === id)
      if (existingReview) {
        Object.assign(existingReview, data, { updatedAt: new Date() })
        return existingReview
      }
    }
    throw new Error('Review not found')
  }

  async deleteReview(id: string): Promise<void> {
    // Find and delete review across all content IDs
    for (const reviews of mockReviewsStore.values()) {
      const index = reviews.findIndex(r => r.id === id)
      if (index !== -1) {
        reviews.splice(index, 1)
        return
      }
    }
    throw new Error('Review not found')
  }

  async toggleLike(reviewId: string): Promise<boolean> {
    // Find review across all content IDs
    for (const reviews of mockReviewsStore.values()) {
      const review = reviews.find(r => r.id === reviewId)
      if (review) {
        review.likes = review.likes > 0 ? 0 : 1
        return review.likes > 0
      }
    }
    throw new Error('Review not found')
  }
}

// class ReviewApiAdapter implements IReviewRepository {
//   async getReviews(contentId: string): Promise<Review[]> {
//     return await $fetch(`/api/reviews/${contentId}`)
//   }
//
//   async createReview(data: CreateReviewDTO): Promise<Review> {
//     return await $fetch('/api/reviews', {
//       method: 'POST',
//       body: data
//     })
//   }
//
//   async updateReview(id: string, data: Partial<CreateReviewDTO>): Promise<Review> {
//     return await $fetch(`/api/reviews/${id}`, {
//       method: 'PUT',
//       body: data
//     })
//   }
//
//   async deleteReview(id: string): Promise<void> {
//     await $fetch(`/api/reviews/${id}`, { method: 'DELETE' })
//   }
//
//   async toggleLike(reviewId: string): Promise<boolean> {
//     const result = await $fetch(`/api/reviews/${reviewId}/like`, {
//       method: 'POST'
//     })
//     return result.success
//   }
// }

export const useReviews = (repository: IReviewRepository = new MockReviewRepository()) => {
  const getReviews = async (contentId: string): Promise<Review[]> => {
    try {
      return await repository.getReviews(contentId)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      return []
    }
  }

  const createReview = async (
    data: CreateReviewDTO & { 
      userId?: string
      userName?: string
      userAvatar?: string
    }
  ): Promise<Review | null> => {
    try {
      return await repository.createReview(data)
    } catch (error) {
      console.error('Failed to create review:', error)
      return null
    }
  }

  const updateReview = async (
    id: string, 
    data: Partial<Pick<Review, 'rating' | 'comment'>>
  ): Promise<Review | null> => {
    try {
      return await repository.updateReview(id, data)
    } catch (error) {
      console.error('Failed to update review:', error)
      return null
    }
  }

  const deleteReview = async (id: string): Promise<boolean> => {
    try {
      await repository.deleteReview(id)
      return true
    } catch (error) {
      console.error('Failed to delete review:', error)
      return false
    }
  }

  const toggleLike = async (id: string): Promise<boolean> => {
    try {
      return await repository.toggleLike(id)
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

const mockReviewsStore = new Map<string, Review[]>()

function initializeMockReviews(contentId: string): Review[] {
  if (mockReviewsStore.has(contentId)) {
    return mockReviewsStore.get(contentId)!
  }
  
  const reviews = [
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
  
  mockReviewsStore.set(contentId, reviews)
  return reviews
}
