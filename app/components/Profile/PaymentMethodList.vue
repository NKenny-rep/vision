<script setup lang="ts">
interface PaymentType {
  id: number
  name: string
  displayName: string
}

interface PaymentMethod {
  id: number
  paymentType: PaymentType
  cardLast4?: string
  cardBrand?: string
  expiryMonth?: string
  expiryYear?: string
  isDefault: boolean
  createdAt: string
}

interface Props {
  paymentMethods: PaymentMethod[]
}

interface Emits {
  (e: 'remove', id: number): void
}

const _props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="payment in paymentMethods"
      :key="payment.id"
      class="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <span class="text-2xl">💳</span>
        </div>
        <div>
          <div class="font-semibold">
            {{ payment.paymentType.displayName }}
            <span v-if="payment.isDefault" class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Default
            </span>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ payment.cardBrand }} •••• {{ payment.cardLast4 }}
            <span v-if="payment.expiryMonth && payment.expiryYear">
              • Expires {{ payment.expiryMonth }}/{{ payment.expiryYear }}
            </span>
          </div>
        </div>
      </div>
      <button
        class="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
        @click="emit('remove', payment.id)"
      >
        Remove
      </button>
    </div>

    <div v-if="!paymentMethods.length" class="text-center py-8 text-gray-500">
      No payment methods added yet
    </div>
  </div>
</template>
