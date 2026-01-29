<script setup lang="ts">
/**
 * PaymentForm Component
 * 
 * Single Responsibility: Handles payment method input form UI
 * Validation: Uses Zod schema from composable
 * Separated from plan selection logic
 */

import { CARD_BRANDS } from '~/constants'
import type { PaymentMethodData } from '~/composables/forms/usePaymentValidation'

interface PaymentType {
  id: number
  name: string
  displayName: string
}

interface Props {
  modelValue: PaymentMethodData
  paymentTypes: PaymentType[]
  compact?: boolean
  isValidating?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: PaymentMethodData): void
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  isValidating: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

// Local copy for v-model bindings
const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg relative">
    <!-- Loading overlay -->
    <div
      v-if="isValidating"
      class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10"
    >
      <div class="flex flex-col items-center gap-2">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ t('common.validating') || 'Validating payment...' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <!-- Payment Type -->
      <div class="sm:col-span-2">
        <label :class="compact ? 'block text-xs font-medium mb-1' : 'block text-sm font-medium mb-2'">
          {{ t('profile.paymentType') || 'Payment Type' }}
        </label>
        <select
          v-model="formData.paymentTypeId"
          :class="[
            'w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
          ]"
        >
          <option
            v-for="type in paymentTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.displayName }}
          </option>
        </select>
      </div>

      <!-- Card Brand -->
      <div>
        <label :class="compact ? 'block text-xs font-medium mb-1' : 'block text-sm font-medium mb-2'">
          {{ t('profile.cardBrand') || 'Card Brand' }} <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.cardBrand"
          required
          :class="[
            'w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
          ]"
        >
          <option value="">
            {{ t('common.select') || 'Select...' }}
          </option>
          <option
            v-for="brand in CARD_BRANDS"
            :key="brand.value"
            :value="brand.value"
          >
            {{ brand.label }}
          </option>
        </select>
      </div>

      <!-- Card Last 4 Digits -->
      <div>
        <label :class="compact ? 'block text-xs font-medium mb-1' : 'block text-sm font-medium mb-2'">
          {{ t('profile.cardLast4') || 'Last 4 Digits' }} <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.cardLast4"
          type="text"
          required
          maxlength="4"
          pattern="\d{4}"
          placeholder="1234"
          :class="[
            'w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
          ]"
        >
      </div>

      <!-- Expiry Month -->
      <div>
        <label :class="compact ? 'block text-xs font-medium mb-1' : 'block text-sm font-medium mb-2'">
          {{ t('profile.expiryMonth') || 'Expiry Month' }} <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.expiryMonth"
          required
          :class="[
            'w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
          ]"
        >
          <option value="">
            MM
          </option>
          <option
            v-for="month in 12"
            :key="month"
            :value="month.toString().padStart(2, '0')"
          >
            {{ month.toString().padStart(2, '0') }}
          </option>
        </select>
      </div>

      <!-- Expiry Year -->
      <div>
        <label :class="compact ? 'block text-xs font-medium mb-1' : 'block text-sm font-medium mb-2'">
          {{ t('profile.expiryYear') || 'Expiry Year' }} <span class="text-red-500">*</span>
        </label>
        <select
          v-model="formData.expiryYear"
          required
          :class="[
            'w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700',
            compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
          ]"
        >
          <option value="">
            YYYY
          </option>
          <option
            v-for="year in 15"
            :key="year"
            :value="(new Date().getFullYear() + year - 1).toString()"
          >
            {{ new Date().getFullYear() + year - 1 }}
          </option>
        </select>
      </div>

      <!-- Set as Default -->
      <div class="sm:col-span-2 flex items-center gap-2">
        <input
          :id="`default-payment-${formData.paymentTypeId}`"
          v-model="formData.isDefault"
          type="checkbox"
          class="rounded border-gray-300 text-primary focus:ring-primary"
        >
        <label
          :for="`default-payment-${formData.paymentTypeId}`"
          :class="compact ? 'text-xs' : 'text-sm'"
        >
          {{ t('profile.setAsDefault') || 'Set as default payment method' }}
        </label>
      </div>
    </div>
  </div>
</template>
