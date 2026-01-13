import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import StarRating from './StarRating.vue'

describe('UI/StarRating', () => {
  it('should render with default 5 stars', async () => {
    const wrapper = await mountSuspended(StarRating)

    expect(wrapper.findAll('button')).toHaveLength(5)
  })

  it('should display correct filled stars based on rating', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 3
      }
    })

    expect(wrapper.vm.modelValue).toBe(3)
  })

  it('should render custom number of stars', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        maxStars: 10
      }
    })

    expect(wrapper.findAll('button')).toHaveLength(10)
  })

  it('should be interactive when not readonly', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 0,
        readonly: false
      }
    })

    await wrapper.vm.handleStarClick(4)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('should not emit events when readonly', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 3,
        readonly: true
      }
    })

    await wrapper.vm.handleStarClick(5)

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should handle hover state', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 2,
        readonly: false
      }
    })

    wrapper.vm.handleStarHover(4)

    expect(wrapper.vm.hoveredStar).toBe(4)
  })

  it('should show correct star fill on hover', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 2,
        readonly: false
      }
    })

    wrapper.vm.hoveredStar = 4

    expect(wrapper.vm.isStarFilled(3)).toBe(true)
    expect(wrapper.vm.isStarFilled(5)).toBe(false)
  })

  it('should apply correct size classes', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    for (const size of sizes) {
      const wrapper = await mountSuspended(StarRating, {
        props: { size }
      })
      
      expect(wrapper.exists()).toBe(true)
    }
  })

  it('should show label when showLabel is true', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 3.5,
        showLabel: true
      }
    })

    expect(wrapper.text()).toContain('3.5')
  })

  it('should hide label when showLabel is false', async () => {
    const wrapper = await mountSuspended(StarRating, {
      props: {
        modelValue: 3.5,
        showLabel: false
      }
    })

    expect(wrapper.text()).not.toContain('3.5')
  })
})
