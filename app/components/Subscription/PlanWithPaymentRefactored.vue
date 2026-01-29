<script setup lang="ts">
/**
 * PlanWithPayment Component (Refactored with Zod)
 * 
 * Single Responsibility: Orchestrates plan selection with optional payment
 * Validation: Uses Zod schema from composable
 * Open/Closed: Extensible via props and events, uses composition of sub-components
 * Dependency Inversion: Depends on composables and sub-components
 * 
 * Reduced from 709 lines to ~200 lines by extracting:
 * - Payment validation logic → usePaymentValidation composable (Zod-based)
 * - Payment form UI → PaymentForm component
 * - Plan card UI → PlanCard component
 */

import type { PaymentMethodData } from '~/composables/forms/usePaymentValidation'

interface SubscriptionPlan {
  id: number
  name: string
  description: string
  price: number
  billingPeriod: string
  features: string
  maxDevices: number
  maxQuality: string
}

interface PaymentType {
  id: number
  name: string
  displayName: string
}

interface Props {
  modelValue: number | null // Selected plan ID
  showPaymentForm?: boolean
  compact?: boolean
  paymentTypes?: PaymentType[]
  requirePayment?: boolean
  paymentFirst?: boolean // Show payment before plans
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'update:payment', value: PaymentMethodData | null): void
}

const props = withDefaults(defineProps<Props>(), {
  showPaymentForm: false,
  compact: false,
  requirePayment: false,
  paymentTypes: () => [],
  paymentFirst: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
const { showError } = useToastNotification()

// Use Zod validation composable
const { validatePaymentData: _validatePaymentData, getFirstError, isPaymentValid: validatePayment } = usePaymentValidation()

// State
const showPaymentSection = ref(props.showPaymentForm)
const paymentFormData = ref<PaymentMethodData>({
  paymentTypeId: 1,
  cardLast4: '',
  cardBrand: '',
  expiryMonth: '',
  expiryYear: '',
  isDefault: true
})

// Loading state for payment validation
const isValidatingPayment = ref(false)
let validationTimer: NodeJS.Timeout | null = null

// Data fetching
const { data: plans, pending } = await useFetch<SubscriptionPlan[]>('/api/plans')

// Computed - using Zod validation
const isPaymentValid = computed(() => {
  if (!props.requirePayment || !showPaymentSection.value) return true
  return validatePayment(paymentFormData.value)
})

const canSelectPlan = computed(() => {
  if (!props.paymentFirst || !props.requirePayment) return true
  return isPaymentValid.value && !isValidatingPayment.value
})

// Handlers
const selectPlan = (planId: number) => {
  if (!canSelectPlan.value) {
    // If payment is still validating, show waiting message
    if (isValidatingPayment.value) {
      showError(t('common.pleaseWait') || 'Validating payment information...')
      return
    }

    // Use Zod validation to get first error
    const errorMessage = getFirstError(paymentFormData.value)
    if (errorMessage) {
      showError(errorMessage)
      return
    }
    
    showError(t('auth.register.completePaymentFirst') || 'Please complete payment information to select a plan')
    return
  }
  
  emit('update:modelValue', planId)
}

const togglePaymentForm = () => {
  showPaymentSection.value = !showPaymentSection.value
  if (!showPaymentSection.value) {
    emit('update:payment', null)
  }
}

// Watch payment data changes and emit to parent
watch(paymentFormData, (newData) => {
  // Clear any existing timer
  if (validationTimer) {
    clearTimeout(validationTimer)
    validationTimer = null
  }

  if (showPaymentSection.value) {
    // If payment is valid, start a 2-second validation timer
    if (isPaymentValid.value && props.paymentFirst) {
      isValidatingPayment.value = true
      
      validationTimer = setTimeout(() => {
        isValidatingPayment.value = false
        validationTimer = null
      }, 2000)
    } else {
      isValidatingPayment.value = false
    }

    emit('update:payment', { ...newData })
  } else {
    emit('update:payment', null)
  }
}, { deep: true })

// Watch showPaymentForm prop changes
watch(() => props.showPaymentForm, (newValue) => {
  showPaymentSection.value = newValue
})

// Cleanup timer on unmount
onUnmounted(() => {
  if (validationTimer) {
    clearTimeout(validationTimer)
    validationTimer = null
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Payment Method Section (First if paymentFirst is true) -->
    <div v-if="(showPaymentForm || showPaymentSection) && paymentFirst" class="pb-4">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-heroicons-credit-card" class="text-primary" />
          {{ t('profile.paymentMethod') || 'Payment Method' }}
          <span v-if="requirePayment" class="text-red-500">*</span>
        </h4>
        <button
          v-if="!requirePayment"
          type="button"
          :class="[
            'text-xs px-2 py-1 rounded border transition-colors',
            showPaymentSection 
              ? 'border-red-300 text-red-600 hover:bg-red-50' 
              : 'border-primary text-primary hover:bg-primary/5'
          ]"
          @click="togglePaymentForm"
        >
          {{ showPaymentSection ? (t('common.remove') || 'Remove') : (t('profile.addPayment') || 'Add Payment') }}
        </button>
      </div>

      <SubscriptionPaymentForm
        v-if="showPaymentSection"
        v-model="paymentFormData"
        :payment-types="paymentTypes"
        :compact="compact"
        :is-validating="isValidatingPayment"
      />
    </div>

    <!-- Plans Section -->
    <div v-if="pending" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-3xl text-primary" />
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ t('common.loading') || 'Loading...' }}
      </p>
    </div>

    <div
      v-else
      :class="[
        'grid gap-3',
        compact 
          ? 'grid-cols-1 sm:grid-cols-3' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      ]"
    >
      <SubscriptionPlanCard
        v-for="(plan, index) in plans"
        :key="plan.id"
        :plan="plan"
        :selected="modelValue === plan.id"
        :disabled="!canSelectPlan"
        :compact="compact"
        :show-popular-badge="index === 1"
        @select="selectPlan"
      />
    </div>

    <!-- Payment Method Section (After plans if paymentFirst is false) -->
    <div v-if="(showPaymentForm || showPaymentSection) && !paymentFirst" class="pt-4">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-lg font-semibold flex items-center gap-2">
          <UIcon name="i-heroicons-credit-card" class="text-primary" />
          {{ t('profile.paymentMethod') || 'Payment Method' }}
          <span v-if="requirePayment" class="text-red-500">*</span>
        </h4>
        <button
          v-if="!requirePayment"
          type="button"
          :class="[
            'text-xs px-2 py-1 rounded border transition-colors',
            showPaymentSection 
              ? 'border-red-300 text-red-600 hover:bg-red-50' 
              : 'border-primary text-primary hover:bg-primary/5'
          ]"
          @click="togglePaymentForm"
        >
          {{ showPaymentSection ? (t('common.remove') || 'Remove') : (t('profile.addPayment') || 'Add Payment') }}
        </button>
      </div>

      <SubscriptionPaymentForm
        v-if="showPaymentSection"
        v-model="paymentFormData"
        :payment-types="paymentTypes"
        :compact="compact"
        :is-validating="isValidatingPayment"
      />
    </div>
  </div>
</template>
