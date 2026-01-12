/**
 * useProfile Composable
 * Adapter for user profile and payment methods management
 * 
 * Follows Nuxt patterns:
 * - Uses $fetch (not tied to component lifecycle)
 * - Centralizes profile business logic
 * - Single Responsibility: profile data operations
 * - Easy to test and maintain
 */

export interface PaymentType {
  id: number
  name: string
  displayName: string
}

export interface PaymentMethod {
  id: number
  paymentType: PaymentType
  cardLast4?: string
  cardBrand?: string
  expiryMonth?: string
  expiryYear?: string
  isDefault: boolean
  createdAt: string
}

export interface UserProfile {
  id: number
  email: string
  name: string
  avatar?: string
  phone?: string
  createdAt: string
  updatedAt: string
  paymentMethods: PaymentMethod[]
}

export interface ProfileUpdateData {
  name: string
  phone?: string
  avatar?: string
}

export interface PaymentMethodData {
  paymentTypeId: number
  cardLast4: string
  cardBrand: string
  expiryMonth: string
  expiryYear: string
  isDefault: boolean
}

export interface SubscriptionPlan {
  id: number
  name: string
  description: string
  price: number
  billingPeriod: string
  features: string
  maxDevices: number
  maxQuality: string
}

export interface UserSubscription {
  id: number
  status: string
  startDate: string
  endDate?: string
  autoRenew: boolean
  plan: SubscriptionPlan
}

export const useProfile = () => {
  const paymentTypes = ref<PaymentType[]>([])

  /**
   * Get available payment types
   */
  const getPaymentTypes = async (): Promise<PaymentType[]> => {
    try {
      const types = await $fetch<PaymentType[]>('/api/payment-types')
      paymentTypes.value = types
      return types
    } catch (error) {
      console.error('Failed to fetch payment types:', error)
      return []
    }
  }

  /**
   * Get user profile with payment methods
   */
  const getProfile = async (): Promise<UserProfile | null> => {
    try {
      const response = await $fetch<{ success: boolean; profile: UserProfile }>('/api/user/profile')
      return response.success ? response.profile : null
    } catch (error: any) {
      // If unauthorized (401), redirect to login
      if (error?.statusCode === 401) {
        await navigateTo('/login')
        return null
      }
      console.error('Failed to fetch profile:', error)
      throw error
    }
  }

  /**
   * Update user profile information
   */
  const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
    try {
      await $fetch('/api/user/profile/update', {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  /**
   * Add a new payment method
   */
  const addPaymentMethod = async (data: PaymentMethodData): Promise<void> => {
    try {
      await $fetch('/api/user/payment-methods/add', {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error('Failed to add payment method:', error)
      throw error
    }
  }

  /**
   * Remove a payment method
   */
  const removePaymentMethod = async (paymentMethodId: number): Promise<void> => {
    try {
      await $fetch('/api/user/payment-methods/remove', {
        method: 'POST',
        body: { paymentMethodId }
      })
    } catch (error) {
      console.error('Failed to remove payment method:', error)
      throw error
    }
  }

  /**
   * Get current user subscription
   */
  const getSubscription = async (): Promise<UserSubscription | null> => {
    try {
      const response = await $fetch<{ success: boolean; subscription: UserSubscription | null }>('/api/user/subscription')
      return response.success ? response.subscription : null
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      throw error
    }
  }

  /**
   * Change subscription plan
   */
  const changePlan = async (planId: number): Promise<void> => {
    try {
      await $fetch('/api/user/subscription/change-plan', {
        method: 'POST',
        body: { planId }
      })
    } catch (error) {
      console.error('Failed to change plan:', error)
      throw error
    }
  }

  /**
   * Cancel subscription
   */
  const cancelSubscription = async (): Promise<void> => {
    try {
      await $fetch('/api/user/subscription/cancel', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw error
    }
  }

  return {
    // Data
    paymentTypes,
    
    // Methods
    getProfile,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    getPaymentTypes,
    getSubscription,
    changePlan,
    cancelSubscription
  }
}
