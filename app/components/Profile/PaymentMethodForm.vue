<script setup lang="ts">
import { CARD_BRANDS } from '~/constants'

interface PaymentType {
  id: number
  name: string
  displayName: string
}

interface Props {
  paymentTypes: PaymentType[]
}

interface Emits {
  (e: 'submit', payload: {
    paymentTypeId: number
    cardLast4: string
    cardBrand: string
    expiryMonth: string
    expiryYear: string
    isDefault: boolean
  }): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { showError } = useToastNotification()

const formData = ref({
  paymentTypeId: 1,
  cardLast4: '',
  cardBrand: '',
  expiryMonth: '',
  expiryYear: '',
  isDefault: false
})

const handleSubmit = () => {
  if (!formData.value.cardLast4 || !formData.value.cardBrand) {
    showError('Please fill all required fields')
    return
  }
  
  emit('submit', { ...formData.value })
  
  // Reset form
  formData.value = {
    paymentTypeId: 1,
    cardLast4: '',
    cardBrand: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  }
}
</script>

<template>
  <div class="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
    <h3 class="font-semibold mb-4">New Payment Method</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">Type</label>
        <select
          v-model="formData.paymentTypeId"
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
        >
          <option v-for="type in paymentTypes" :key="type.id" :value="type.id">
            {{ type.displayName }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Card Last 4 Digits</label>
          <input
            v-model="formData.cardLast4"
            type="text"
            maxlength="4"
            pattern="[0-9]{4}"
            required
            placeholder="1234"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Card Brand</label>
          <select
            v-model="formData.cardBrand"
            required
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="">Select Brand</option>
            <option v-for="brand in CARD_BRANDS" :key="brand.value" :value="brand.value">
              {{ brand.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">Expiry Month</label>
          <input
            v-model="formData.expiryMonth"
            type="text"
            maxlength="2"
            pattern="(0[1-9]|1[0-2])"
            placeholder="12"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Expiry Year</label>
          <input
            v-model="formData.expiryYear"
            type="text"
            maxlength="4"
            pattern="[0-9]{4}"
            placeholder="2025"
            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
          />
        </div>
      </div>

      <div class="flex items-center">
        <input
          v-model="formData.isDefault"
          type="checkbox"
          id="isDefault"
          class="mr-2"
        />
        <label for="isDefault" class="text-sm">Set as default payment method</label>
      </div>

      <div class="flex gap-2">
        <button
          type="submit"
          class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Add Payment Method
        </button>
        <button
          type="button"
          @click="emit('cancel')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
