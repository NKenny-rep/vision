import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ReviewForm from './Form.vue'

describe('Review/Form', () => {
  it('should render review form', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    expect(wrapper.find('h3').text()).toContain('Write a Review')
  })

  it('should initialize with default values', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    expect(wrapper.vm.rating).toBe(0)
    expect(wrapper.vm.comment).toBe('')
  })

  it('should initialize with provided rating', async () => {
    const wrapper = await mountSuspended(ReviewForm, {
      props: {
        initialRating: 4
      }
    })

    expect(wrapper.vm.rating).toBe(4)
  })

  it('should validate form correctly', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    expect(wrapper.vm.isValid).toBe(false)

    wrapper.vm.rating = 5
    wrapper.vm.comment = 'Great movie!'

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isValid).toBe(true)
  })

  it('should require minimum comment length', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    wrapper.vm.rating = 5
    wrapper.vm.comment = 'Short'

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isValid).toBe(false)
  })

  it('should emit submit event with form data', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    wrapper.vm.rating = 5
    wrapper.vm.comment = 'This is an excellent movie!'

    await wrapper.vm.handleSubmit()

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0]).toEqual([{
      rating: 5,
      comment: 'This is an excellent movie!'
    }])
  })

  it('should reset form after submit', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    wrapper.vm.rating = 5
    wrapper.vm.comment = 'Great movie experience!'

    await wrapper.vm.handleSubmit()

    expect(wrapper.vm.rating).toBe(0)
    expect(wrapper.vm.comment).toBe('')
  })

  it('should not submit invalid form', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    wrapper.vm.rating = 0
    wrapper.vm.comment = 'Too short'

    await wrapper.vm.handleSubmit()

    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('should track character count', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    const testComment = 'This is a test comment'
    wrapper.vm.comment = testComment

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.comment.length).toBe(22)
  })

  it('should show validation status', async () => {
    const wrapper = await mountSuspended(ReviewForm)

    wrapper.vm.rating = 5
    wrapper.vm.comment = 'Short'

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isValid).toBe(false)

    wrapper.vm.comment = 'This is a longer comment that meets the minimum requirement'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isValid).toBe(true)
  })
})
