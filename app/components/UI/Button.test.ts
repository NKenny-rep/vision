// app/components/UI/Button.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Button from './Button.vue'

describe('UI/Button', () => {
  it('should render with default props', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Click me'
      }
    })

    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should render with primary variant', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Primary Button',
        variant: 'primary'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-orange-500')
  })

  it('should render with secondary variant', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Secondary Button',
        variant: 'secondary'
      }
    })

    expect(wrapper.text()).toContain('Secondary Button')
    expect(wrapper.html()).toContain('text-white')
  })

  it('should emit click event when clicked', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Click me'
      }
    })

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toBeDefined()
  })

  it('should be disabled when disabled prop is true', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Disabled Button',
        disabled: true
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should show loading state', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Loading Button',
        loading: true
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('should render with leading icon', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Like',
        leadingIcon: 'i-heroicons-heart'
      }
    })

    // UButton will render the icon
    expect(wrapper.html()).toContain('Like')
  })

  it('should apply block class when block is true', async () => {
    const wrapper = await mountSuspended(Button, {
      props: {
        label: 'Block Button',
        block: true
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('w-full')
  })

  it('should render different sizes', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

    for (const size of sizes) {
      const wrapper = await mountSuspended(Button, {
        props: {
          label: `${size} Button`,
          size
        }
      })

      expect(wrapper.find('button').exists()).toBe(true)
    }
  })
})
