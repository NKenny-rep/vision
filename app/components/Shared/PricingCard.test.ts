import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PricingCard from './PricingCard.vue'

describe('Shared/PricingCard', () => {
  const mockFeatures = [
    'HD Quality',
    '2 Devices',
    'Unlimited Content'
  ]

  it('should render pricing card', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Standard',
        subtitle: 'Perfect for families',
        price: 14.99,
        features: mockFeatures
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display title and subtitle', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Premium',
        subtitle: 'Best experience',
        price: 19.99,
        features: mockFeatures
      }
    })

    expect(wrapper.text()).toContain('Premium')
    expect(wrapper.text()).toContain('Best experience')
  })

  it('should display price', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Basic',
        subtitle: 'Individual',
        price: 9.99,
        features: mockFeatures
      }
    })

    expect(wrapper.text()).toContain('9.99')
  })

  it('should display period', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Basic',
        subtitle: 'Individual',
        price: 9.99,
        period: '/year',
        features: mockFeatures
      }
    })

    expect(wrapper.text()).toContain('/year')
  })

  it('should display all features', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Standard',
        subtitle: 'For families',
        price: 14.99,
        features: mockFeatures
      }
    })

    mockFeatures.forEach(feature => {
      expect(wrapper.text()).toContain(feature)
    })
  })

  it('should show featured badge when featured', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Standard',
        subtitle: 'For families',
        price: 14.99,
        features: mockFeatures,
        featured: true
      }
    })

    expect(wrapper.text()).toContain('Most Popular')
  })

  it('should not show badge when not featured', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Basic',
        subtitle: 'Individual',
        price: 9.99,
        features: mockFeatures,
        featured: false
      }
    })

    expect(wrapper.text()).not.toContain('Most Popular')
  })

  it('should normalize string features to objects', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Basic',
        subtitle: 'Individual',
        price: 9.99,
        features: mockFeatures
      }
    })

    wrapper.vm.normalizedFeatures.forEach(feature => {
      expect(feature).toHaveProperty('text')
      expect(feature).toHaveProperty('icon')
    })
  })

  it('should apply featured card classes', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Standard',
        subtitle: 'For families',
        price: 14.99,
        features: mockFeatures,
        featured: true
      }
    })

    expect(wrapper.vm.cardClasses).toContain('border-orange-500')
  })

  it('should apply scale class when scale is true', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Standard',
        subtitle: 'For families',
        price: 14.99,
        features: mockFeatures,
        scale: true
      }
    })

    expect(wrapper.vm.cardClasses).toContain('scale-105')
  })

  it('should render button with correct text', async () => {
    const wrapper = await mountSuspended(PricingCard, {
      props: {
        title: 'Basic',
        subtitle: 'Individual',
        price: 9.99,
        features: mockFeatures,
        buttonText: 'Get Started'
      }
    })

    expect(wrapper.text()).toContain('Get Started')
  })
})
