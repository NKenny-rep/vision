import type { PaymentMethodData } from '~/composables/forms/usePaymentValidation'
import { API_ROUTES } from '~/constants/apiRoutes'

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
  const profile = ref<UserProfile | null>(null)
  const subscription = ref<UserSubscription | null>(null)
  const paymentTypes = ref<PaymentType[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getPaymentTypes = async (): Promise<PaymentType[]> => {
    try {
      const types = await $fetch<PaymentType[]>(API_ROUTES.USER.PAYMENT_TYPES)
      paymentTypes.value = types
      return types
    } catch (err) {
      console.error('Failed to fetch payment types:', err)
      return []
    }
  }

  const fetchProfile = async (): Promise<UserProfile | null> => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ success: boolean; profile: UserProfile }>(API_ROUTES.USER.PROFILE)
      if (response.success) {
        profile.value = response.profile
        return response.profile
      }
      return null
    } catch (err: unknown) {
      // If unauthorized (401), redirect to login
      if (typeof err === 'object' && err !== null && 'statusCode' in err && (err as { statusCode: number }).statusCode === 401) {
        await navigateTo('/login')
        return null
      }
      error.value = err instanceof Error ? err.message : 'Failed to fetch profile'
      console.error('Failed to fetch profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getProfile = fetchProfile

  const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
    loading.value = true
    try {
      await $fetch(API_ROUTES.USER.PROFILE_UPDATE, {
        method: 'POST',
        body: data
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update profile'
      console.error('Failed to update profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addPaymentMethod = async (data: PaymentMethodData): Promise<void> => {
    try {
      await $fetch(API_ROUTES.USER.PAYMENT_METHODS_ADD, {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error('Failed to add payment method:', error)
      throw error
    }
  }

  const removePaymentMethod = async (paymentMethodId: number): Promise<void> => {
    try {
      await $fetch(API_ROUTES.USER.PAYMENT_METHODS_REMOVE, {
        method: 'POST',
        body: { paymentMethodId }
      })
    } catch (error) {
      console.error('Failed to remove payment method:', error)
      throw error
    }
  }

  const fetchSubscription = async (): Promise<UserSubscription | null> => {
    try {
      const response = await $fetch<{ success: boolean; subscription: UserSubscription | null }>(API_ROUTES.USER.SUBSCRIPTION)
      if (response.success) {
        subscription.value = response.subscription
        return response.subscription
      }
      return null
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
      throw error
    }
  }

  const getSubscription = fetchSubscription

  const changePlan = async (planId: number): Promise<void> => {
    try {
      await $fetch(API_ROUTES.USER.SUBSCRIPTION_CHANGE_PLAN, {
        method: 'POST',
        body: { planId }
      })
    } catch (error) {
      console.error('Failed to change plan:', error)
      throw error
    }
  }

  const cancelSubscription = async (): Promise<void> => {
    try {
      await $fetch(API_ROUTES.USER.SUBSCRIPTION_CANCEL, {
        method: 'POST'
      })
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      throw error
    }
  }

  return {
    profile: readonly(profile),
    subscription: readonly(subscription),
    paymentTypes: readonly(paymentTypes),
    loading: readonly(loading),
    error: readonly(error),
    fetchProfile,
    fetchSubscription,
    getProfile,
    getSubscription,
    updateProfile,
    addPaymentMethod,
    removePaymentMethod,
    getPaymentTypes,
    changePlan,
    cancelSubscription
  }
}
