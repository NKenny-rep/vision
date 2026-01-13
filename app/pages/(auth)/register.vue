<script setup lang="ts">
import type { PaymentMethodData } from '~/composables/useRegistrationForm'

const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'login-layout',
  middleware: 'not-auth',
})

// Use registration form composable
const { formData, isSubmitting, submit, initializeFromCookie } = useRegistrationForm()

// Get payment types using useProfile composable
const { getPaymentTypes, paymentTypes } = useProfile()
const { showError } = useToastNotification()

// Initialize email from cookie and load payment types on mount
onMounted(async () => {
  initializeFromCookie()
  await getPaymentTypes()
})

// Validation: Ensure payment method is provided
const isFormValid = computed(() => {
  return formData.value.planId !== null && formData.value.paymentMethod !== null
})

const onSubmit = async () => {
  if (!formData.value.paymentMethod) {
    showError(t('auth.register.paymentRequired') || 'Payment method is required to complete registration')
    return
  }
  
  if (!formData.value.planId) {
    showError(t('auth.register.planRequired') || 'Please select a subscription plan')
    return
  }
  
  await submit()
}

const handlePaymentUpdate = (payment: PaymentMethodData | null) => {
  formData.value.paymentMethod = payment
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <!-- Page Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">
          {{ t('auth.register.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">{{ t('auth.register.subtitle') }}</p>
      </div>

      <form class="space-y-8" @submit.prevent="onSubmit">
        <!-- Personal Information -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 class="text-2xl font-semibold mb-6 flex items-center gap-2">
            <UIcon name="i-heroicons-user-circle-20-solid" class="text-primary" />
            {{ t('auth.register.personalInfo') }}
          </h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                {{ t('auth.register.name') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                :placeholder="t('auth.register.namePlaceholder')"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
              >
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('auth.register.email') }} <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  required
                  :placeholder="t('auth.register.emailPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
                >
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">{{ t('common.phone') }}</label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="+1-555-0000"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('auth.register.password') }} <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.password"
                  type="password"
                  required
                  :placeholder="t('auth.register.passwordPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
                >
              </div>

              <div>
                <label class="block text-sm font-medium mb-2">
                  {{ t('auth.register.confirmPassword') }} <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.confirmPassword"
                  type="password"
                  required
                  :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">{{ t('common.avatar') }}</label>
              <ProfileAvatarPicker
                :current-avatar="formData.avatar"
                :user-name="formData.name || 'user'"
                @update:avatar="formData.avatar = $event"
              />
            </div>
          </div>
        </div>

        <!-- Plan & Payment Selection -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="mb-6">
            <h2 class="text-2xl font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-credit-card-20-solid" class="text-primary" />
              {{ t('auth.register.choosePlan') }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {{ t('auth.register.choosePlanDescription') || 'Select your plan and add payment method to complete registration' }}
            </p>
          </div>

          <SubscriptionPlanWithPayment
            v-model="formData.planId"
            :payment-types="paymentTypes"
            :show-payment-form="true"
            :require-payment="true"
            :payment-first="true"
            @update:payment="handlePaymentUpdate"
          />
        </div>

        <!-- Submit Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <NuxtLink
              :to="localePath('/login')"
              class="text-primary hover:underline order-2 sm:order-1"
            >
              {{ t('auth.register.haveAccount') }}
            </NuxtLink>

            <button
              type="submit"
              :disabled="isSubmitting || !isFormValid"
              class="w-full sm:w-auto order-1 sm:order-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UIcon v-if="!isSubmitting" name="i-heroicons-user-plus-20-solid" />
              <span v-if="isSubmitting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              {{ isSubmitting ? t('common.saving') : t('auth.register.submit') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
