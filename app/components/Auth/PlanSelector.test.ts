import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import PlanSelector from './PlanSelector.vue'

// Mock i18n
const { useI18nMock } = vi.hoisted(() => ({
  useI18nMock: vi.fn()
}))

mockNuxtImport('useI18n', () => useI18nMock)

describe('Auth/PlanSelector', () => {
  const mockPlans = [
    {
      id: 1,
      name: 'Basic',
      description: 'Perfect for individual use',
      price: 999,
      billingPeriod: 'month',
      features: JSON.stringify(['HD Quality', '1 Device']),
      maxDevices: 1,
      maxQuality: 'HD'
    },
    {
      id: 2,
      name: 'Standard',
      description: 'Great for families',
      price: 1499,
      billingPeriod: 'month',
      features: JSON.stringify(['Full HD Quality', '2 Devices']),
      maxDevices: 2,
      maxQuality: 'Full HD'
    },
    {
      id: 3,
      name: 'Premium',
      description: 'Best experience',
      price: 1999,
      billingPeriod: 'month',
      features: JSON.stringify(['4K Quality', '4 Devices']),
      maxDevices: 4,
      maxQuality: '4K'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    useI18nMock.mockReturnValue({
      t: (key: string) => key === 'common.popular' ? 'POPULAR' : key
    })

    registerEndpoint('/api/plans', () => mockPlans)
  })

  it('should render plan selector', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.exists()).toBe(true)
  })

  it('should display all plans', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Basic')
    expect(wrapper.text()).toContain('Standard')
    expect(wrapper.text()).toContain('Premium')
  })

  it('should format price correctly', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('9.99')
    expect(wrapper.text()).toContain('14.99')
    expect(wrapper.text()).toContain('19.99')
  })

  it('should emit update:modelValue when plan is selected', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    wrapper.vm.selectPlan(2)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('should highlight selected plan', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: 2
      }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    const planCards = wrapper.findAll('[class*="cursor-pointer"]')
    expect(planCards[1].classes()).toContain('border-primary')
  })

  it('should show popular badge on middle plan', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('POPULAR')
  })

  it('should parse plan features correctly', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    const features = wrapper.vm.parsedFeatures(mockPlans[0].features)
    expect(features).toEqual(['HD Quality', '1 Device'])
  })

  it('should handle invalid JSON features gracefully', async () => {
    const wrapper = await mountSuspended(PlanSelector, {
      props: {
        modelValue: null
      }
    })

    const features = wrapper.vm.parsedFeatures('invalid json')
    expect(features).toEqual([])
  })
})
