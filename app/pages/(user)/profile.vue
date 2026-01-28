<script setup lang="ts">
import type { ProfileUpdateData } from '~/composables/user/useProfile'
import type { PaymentMethodData } from '~/composables/forms/usePaymentValidation'
import { getInitialsFromName } from '~/utils/userHelpers'

const { t } = useI18n()
const { showSuccess, showError } = useToastNotification()

const { 
  profile,
  subscription,
  paymentTypes,
  loading,
  fetchProfile,
  fetchSubscription,
  updateProfile: updateProfileApi,
  addPaymentMethod: addPaymentMethodApi,
  removePaymentMethod: removePaymentMethodApi,
  getPaymentTypes
} = useProfile()

const saving = ref(false)
const showAddPayment = ref(false)

const formData = ref<ProfileUpdateData>({
  name: '',
  phone: '',
  avatar: ''
})

watch(profile, (newProfile) => {
  if (newProfile) {
    formData.value = {
      name: newProfile.name,
      phone: newProfile.phone || '',
      avatar: newProfile.avatar || ''
    }
  }
})

const handleUpdateProfile = async () => {
  saving.value = true
  try {
    await updateProfileApi(formData.value)
    await fetchProfile()
    showSuccess(t('profile.messages.updateSuccess'))
  } catch {
    showError(t('profile.errors.updateFailed'))
  } finally {
    saving.value = false
  }
}

const handleAddPayment = async (paymentData: PaymentMethodData) => {
  try {
    await addPaymentMethodApi(paymentData)
    await fetchProfile()
    showSuccess(t('profile.messages.paymentAdded'))
    showAddPayment.value = false
  } catch {
    showError(t('profile.errors.paymentAddFailed'))
  }
}

const handleRemovePayment = async (paymentMethodId: number) => {
  try {
    await removePaymentMethodApi(paymentMethodId)
    await fetchProfile()
    showSuccess(t('profile.messages.paymentRemoved'))
  } catch {
    showError(t('profile.errors.paymentRemoveFailed'))
  }
}

onMounted(async () => {
  await getPaymentTypes()
  fetchProfile()
  fetchSubscription()
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center min-h-100">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"/>
    </div>

    <div v-else-if="profile" class="max-w-4xl mx-auto space-y-8">
      <!-- Profile Header -->
      <div class="flex items-center gap-6">
        <div v-if="profile.avatar" class="w-24 h-24 rounded-full overflow-hidden">
          <NuxtImg
            :src="profile.avatar"
            :alt="profile.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold"
        >
          {{ getInitialsFromName(profile.name) }}
        </div>
        <div>
          <h1 class="text-3xl font-bold">{{ profile.name }}</h1>
          <p class="text-gray-600 dark:text-gray-400">{{ profile.email }}</p>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-2xl font-semibold mb-6">{{ t('common.profile') }}</h2>
        
        <form class="space-y-4" @submit.prevent="handleUpdateProfile">
          <div>
            <label class="block text-sm font-medium mb-2">{{ t('common.name') }}</label>
            <input
              v-model="formData.name"
              type="text"
              required
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
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            @click="showAddPayment = !showAddPayment"
          >
            {{ showAddPayment ? t('common.cancel') : t('profile.addPayment') }}
          </button>
        </div>

        <!-- Add Payment Form Component -->
        <ProfilePaymentMethodForm
          v-if="showAddPayment"
          :payment-types="[...(paymentTypes || [])]"
          class="mb-6"
          @submit="handleAddPayment"
          @cancel="showAddPayment = false"
        />

        <!-- Payment Methods List Component -->
        <ProfilePaymentMethodsList
          :payment-methods="[...(profile?.paymentMethods || [])]"
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