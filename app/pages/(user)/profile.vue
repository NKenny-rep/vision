<script setup lang="ts">
import type { UserProfile, ProfileUpdateData, PaymentMethodData, UserSubscription } from '~/composables/useProfile'

const { t } = useI18n()
const toast = useToast()

// Composables - following Nuxt patterns
const { 
  getProfile, 
  updateProfile: updateProfileApi, 
  addPaymentMethod: addPaymentMethodApi,
  removePaymentMethod: removePaymentMethodApi,
  getSubscription,
  paymentTypes 
} = useProfile()

// State
const profile = ref<UserProfile | null>(null)
const subscription = ref<UserSubscription | null>(null)
const loading = ref(true)
const saving = ref(false)
const showAddPayment = ref(false)

const formData = ref<ProfileUpdateData>({
  name: '',
  phone: '',
  avatar: ''
})

// Helper for toast notifications - keeps UI logic in component
const showToast = (type: 'success' | 'error', message: string) => {
  toast.add({
    title: t(`common.${type}`),
    description: message
  })
}

// Data operations - delegate to composable (Separation of Concerns)
const fetchProfile = async () => {
  loading.value = true
  try {
    const data = await getProfile()
    
    if (data) {
      profile.value = data
      formData.value = {
        name: data.name,
        phone: data.phone || '',
        avatar: data.avatar || ''
      }
    }
  } catch (error) {
    showToast('error', t('profile.errors.loadFailed'))
  } finally {
    loading.value = false
  }
}

const fetchSubscription = async () => {
  try {
    const data = await getSubscription()
    subscription.value = data
  } catch (error) {
    console.error('Failed to load subscription:', error)
  }
}

const handleUpdateProfile = async () => {
  saving.value = true
  try {
    await updateProfileApi(formData.value)
    showToast('success', t('profile.messages.updateSuccess'))
    await fetchProfile()
  } catch (error) {
    showToast('error', t('profile.errors.updateFailed'))
  } finally {
    saving.value = false
  }
}

const handleAddPayment = async (paymentData: PaymentMethodData) => {
  try {
    await addPaymentMethodApi(paymentData)
    showToast('success', t('profile.messages.paymentAdded'))
    showAddPayment.value = false
    await fetchProfile()
  } catch (error) {
    showToast('error', t('profile.errors.paymentAddFailed'))
  }
}

const handleRemovePayment = async (paymentMethodId: number) => {
  try {
    await removePaymentMethodApi(paymentMethodId)
    showToast('success', t('profile.messages.paymentRemoved'))
    await fetchProfile()
  } catch (error) {
    showToast('error', t('profile.errors.paymentRemoveFailed'))
  }
}

// Lifecycle
onMounted(() => {
  fetchProfile()
  fetchSubscription()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-100">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="profile" class="max-w-4xl mx-auto space-y-8">
      <!-- Profile Header -->
      <div class="flex items-center gap-6">
        <NuxtImg
          :src="profile.avatar || '/default-avatar.png'"
          :alt="profile.name"
          class="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h1 class="text-3xl font-bold">{{ profile.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ profile.email }}</p>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-6">{{ t('common.profile') }}</h2>
        
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('common.name') }}</label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{{ t('common.phone') }}</label>
            <input
              v-model="formData.phone"
              type="tel"
              placeholder="+1-555-0000"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">{{ t('common.avatar') }}</label>
            <ProfileAvatarPicker
              :current-avatar="formData.avatar || ''"
              :user-name="formData.name"
              @update:avatar="formData.avatar = $event"
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? t('common.saving') : t('common.save') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-semibold">{{ t('profile.paymentMethods') }}</h2>
          <button
            @click="showAddPayment = !showAddPayment"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            {{ showAddPayment ? t('common.cancel') : t('profile.addPayment') }}
          </button>
        </div>

        <!-- Add Payment Form Component -->
        <ProfilePaymentMethodForm
          v-if="showAddPayment"
          :payment-types="paymentTypes"
          @submit="handleAddPayment"
          @cancel="showAddPayment = false"
          class="mb-6"
        />

        <!-- Payment Methods List Component -->
        <ProfilePaymentMethodList
          :payment-methods="profile.paymentMethods"
          @remove="handleRemovePayment"
        />
      </div>

      <!-- Subscription Management -->
      <ProfileSubscriptionManager
        :subscription="subscription"
        @refresh="fetchSubscription"
      />
    </div>
  </div>
</template>