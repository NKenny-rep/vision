// app/composables/useProfile.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { useProfile, type UserProfile, type PaymentType, type PaymentMethod, type ProfileUpdateData, type PaymentMethodData, type UserSubscription } from './useProfile'

const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}))

mockNuxtImport('navigateTo', () => navigateToMock)

describe('useProfile', () => {
  const mockUserProfile: UserProfile = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    paymentMethods: [],
  }

  const mockPaymentTypes: PaymentType[] = [
    { id: 1, name: 'credit_card', displayName: 'Credit Card' },
  ]

  const mockPaymentMethod: PaymentMethod = {
    id: 1,
    paymentType: mockPaymentTypes[0],
    cardLast4: '1234',
    cardBrand: 'Visa',
    expiryMonth: '12',
    expiryYear: '2025',
    isDefault: true,
    createdAt: '2023-01-01',
  }

  const mockUserSubscription: UserSubscription = {
    id: 1,
    status: 'active',
    startDate: '2023-01-01',
    autoRenew: true,
    plan: {
      id: 1,
      name: 'Basic',
      description: 'Basic plan',
      price: 1000,
      billingPeriod: 'monthly',
      features: '[]',
      maxDevices: 1,
      maxQuality: 'HD',
    },
  }

  // Helper to mount a component and use the composable
  const mountComposable = async () => {
    let result: ReturnType<typeof useProfile>
    await mountSuspended(defineComponent({
      setup() {
        result = useProfile()
        return () => null
      },
    }))
    return result!
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch payment types successfully', async () => {
    registerEndpoint('/api/payment-types', () => mockPaymentTypes)

    const { paymentTypes, getPaymentTypes } = await mountComposable()
    const result = await getPaymentTypes()

    expect(result).toEqual(mockPaymentTypes)
    expect(paymentTypes.value).toEqual(mockPaymentTypes)
  })

  it('should handle error when fetching payment types', async () => {
    registerEndpoint('/api/payment-types', () => { throw new Error('Failed to fetch types') })

    const { paymentTypes, getPaymentTypes } = await mountComposable()
    const result = await getPaymentTypes()

    expect(result).toEqual([])
    expect(paymentTypes.value).toEqual([])
  })

  it('should fetch user profile successfully', async () => {
    registerEndpoint('/api/user/profile', () => ({ success: true, profile: mockUserProfile }))

    const { getProfile } = await mountComposable()
    const result = await getProfile()

    expect(result).toEqual(mockUserProfile)
  })

  it('should navigate to login if unauthorized when fetching profile', async () => {
    registerEndpoint('/api/user/profile', () => { 
      const error: any = new Error('Unauthorized')
      error.statusCode = 401
      throw error
    })

    const { getProfile } = await mountComposable()
    const result = await getProfile()

    expect(navigateToMock).toHaveBeenCalledWith('/login')
    expect(result).toBeNull()
  })

  it('should throw error if fetching profile fails for other reasons', async () => {
    registerEndpoint('/api/user/profile', () => { throw new Error('Network error') })

    const { getProfile } = await mountComposable()
    await expect(getProfile()).rejects.toThrow()
  })

  it('should update user profile successfully', async () => {
    registerEndpoint('/api/user/profile/update', { method: 'POST', handler: () => ({}) })

    const { updateProfile } = await mountComposable()
    const updateData: ProfileUpdateData = { name: 'Updated Name', phone: '123456789' }
    await updateProfile(updateData)

    expect(navigateToMock).not.toHaveBeenCalled()
  })

  it('should throw error if updating profile fails', async () => {
    registerEndpoint('/api/user/profile/update', { method: 'POST', handler: () => { throw new Error('Update failed') } })

    const { updateProfile } = await mountComposable()
    const updateData: ProfileUpdateData = { name: 'Updated Name' }
    await expect(updateProfile(updateData)).rejects.toThrow()
  })

  it('should add a payment method successfully', async () => {
    registerEndpoint('/api/user/payment-methods/add', { method: 'POST', handler: () => ({}) })

    const { addPaymentMethod } = await mountComposable()
    const paymentData: PaymentMethodData = {
      paymentTypeId: 1, cardLast4: '1111', cardBrand: 'Visa', expiryMonth: '10', expiryYear: '2024', isDefault: false,
    }
    await addPaymentMethod(paymentData)

    expect(navigateToMock).not.toHaveBeenCalled()
  })

  it('should throw error if adding payment method fails', async () => {
    registerEndpoint('/api/user/payment-methods/add', { method: 'POST', handler: () => { throw new Error('Add failed') } })

    const { addPaymentMethod } = await mountComposable()
    const paymentData: PaymentMethodData = {
      paymentTypeId: 1, cardLast4: '1111', cardBrand: 'Visa', expiryMonth: '10', expiryYear: '2024', isDefault: false,
    }
    await expect(addPaymentMethod(paymentData)).rejects.toThrow()
  })

  it('should remove a payment method successfully', async () => {
    registerEndpoint('/api/user/payment-methods/remove', { method: 'POST', handler: () => ({}) })

    const { removePaymentMethod } = await mountComposable()
    await removePaymentMethod(1)

    expect(navigateToMock).not.toHaveBeenCalled()
  })

  it('should throw error if removing payment method fails', async () => {
    registerEndpoint('/api/user/payment-methods/remove', { method: 'POST', handler: () => { throw new Error('Remove failed') } })

    const { removePaymentMethod } = await mountComposable()
    await expect(removePaymentMethod(1)).rejects.toThrow()
  })

  it('should fetch user subscription successfully', async () => {
    registerEndpoint('/api/user/subscription', () => ({ success: true, subscription: mockUserSubscription }))

    const { getSubscription } = await mountComposable()
    const result = await getSubscription()

    expect(result).toEqual(mockUserSubscription)
  })

  it('should handle no subscription found', async () => {
    registerEndpoint('/api/user/subscription', () => ({ success: true, subscription: null }))

    const { getSubscription } = await mountComposable()
    const result = await getSubscription()

    expect(result).toBeNull()
  })

  it('should throw error if fetching subscription fails', async () => {
    registerEndpoint('/api/user/subscription', () => { throw new Error('Subscription fetch failed') })

    const { getSubscription } = await mountComposable()
    await expect(getSubscription()).rejects.toThrow()
  })

  it('should change subscription plan successfully', async () => {
    registerEndpoint('/api/user/subscription/change-plan', { method: 'POST', handler: () => ({}) })

    const { changePlan } = await mountComposable()
    await changePlan(2)

    expect(navigateToMock).not.toHaveBeenCalled()
  })

  it('should throw error if changing plan fails', async () => {
    registerEndpoint('/api/user/subscription/change-plan', { method: 'POST', handler: () => { throw new Error('Change plan failed') } })

    const { changePlan } = await mountComposable()
    await expect(changePlan(2)).rejects.toThrow()
  })

  it('should cancel subscription successfully', async () => {
    registerEndpoint('/api/user/subscription/cancel', { method: 'POST', handler: () => ({}) })

    const { cancelSubscription } = await mountComposable()
    await cancelSubscription()

    expect(navigateToMock).not.toHaveBeenCalled()
  })

  it('should throw error if cancelling subscription fails', async () => {
    registerEndpoint('/api/user/subscription/cancel', { method: 'POST', handler: () => { throw new Error('Cancel failed') } })

    const { cancelSubscription } = await mountComposable()
    await expect(cancelSubscription()).rejects.toThrow()
  })
})
