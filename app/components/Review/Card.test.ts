import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ReviewCard from './Card.vue'

describe('Review/Card', () => {
  const mockReview = {
    id: 1,
    userName: 'John Doe',
    userAvatar: 'https://example.com/avatar.jpg',
    rating: 4,
    comment: 'Great movie! Really enjoyed it.',
    createdAt: new Date('2025-01-01'),
    contentId: 'tt0133093',
    userId: 1
  }

  it('should render review card', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('Great movie!')
  })

  it('should display user information', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    expect(wrapper.text()).toContain('John Doe')
  })

  it('should display rating', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    const starRating = wrapper.findComponent({ name: 'UIStarRating' })
    expect(starRating.exists()).toBe(true)
    expect(starRating.props('modelValue')).toBe(4)
  })

  it('should display review comment', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    expect(wrapper.text()).toContain('Great movie! Really enjoyed it.')
  })

  it('should show actions when showActions is true', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview,
        showActions: true
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should hide actions when showActions is false', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview,
        showActions: false
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should emit like event', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    await wrapper.vm.handleLike()

    expect(wrapper.emitted('like')).toBeTruthy()
    expect(wrapper.emitted('like')?.[0]).toEqual([1])
  })

  it('should emit reply event', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    await wrapper.vm.handleReply()

    expect(wrapper.emitted('reply')).toBeTruthy()
    expect(wrapper.emitted('reply')?.[0]).toEqual([1])
  })

  it('should emit report event', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    await wrapper.vm.handleReport()

    expect(wrapper.emitted('report')).toBeTruthy()
    expect(wrapper.emitted('report')?.[0]).toEqual([1])
  })

  it('should display formatted date', async () => {
    const wrapper = await mountSuspended(ReviewCard, {
      props: {
        review: mockReview
      }
    })

    expect(wrapper.vm.formattedDate).toBeDefined()
  })
})
