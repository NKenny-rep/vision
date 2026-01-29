<script setup lang="ts">

import type { PaymentMethodData } from '~/composables/forms/usePaymentValidation'
import { usePaymentValidation } from '~/composables/forms/usePaymentValidation'

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
  showPaymentForm?: boolean // Whether to show payment method form
  compact?: boolean // Compact mode for space-constrained layouts
  paymentTypes?: PaymentType[] // Available payment types
  requirePayment?: boolean // Whether payment is required
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

// Use Zod validation composable - Nuxt pattern for validation logic
const { getFirstError, isPaymentValid: validatePaymentData } = usePaymentValidation()

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


const { data: plans, pending } = await useFetch<SubscriptionPlan[]>('/api/plans')

const isPaymentValid = computed(() => {
  if (!props.requirePayment || !showPaymentSection.value) return true
  // Use Zod validation from composable
  return validatePaymentData(paymentFormData.value)
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

    // Use composable to get field-specific error - Nuxt pattern
    const errorMessage = getFirstError(paymentFormData.value)
    if (errorMessage) {
      showError(errorMessage)
      return
    }
    
    showError(t('auth.register.completePaymentFirst') || 'Please complete payment information to select a plan')
    return
  }
  
  // If payment is valid and required, delay 2 seconds
  if (props.requirePayment && isPaymentValid.value && !isValidatingPayment.value) {
    isValidatingPayment.value = true
    setTimeout(() => {
      isValidatingPayment.value = false
      emit('update:modelValue', planId)
    }, 2000)
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

    <!-- Plan Selection Section -->
    <div>
      <!-- Show message when payment is required but not filled -->
      <div
        v-if="paymentFirst && requirePayment && !canSelectPlan"
        class="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
      >
        <div class="flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <UIcon name="i-heroicons-information-circle" class="text-xl" />
          <p class="text-sm font-medium">
            {{ t('auth.register.completePaymentFirst') || 'Please complete payment information to select a plan' }}
          </p>
        </div>
      </div>

      <div v-if="pending" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
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
    </div>

    <!-- Payment Method Section (After plans if paymentFirst is false) -->
    <div v-if="(showPaymentForm || showPaymentSection) && !paymentFirst" class="border-t border-gray-200 dark:border-gray-700 pt-4">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-sm font-semibold flex items-center gap-2">
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
