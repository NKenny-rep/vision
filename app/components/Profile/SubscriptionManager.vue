<script setup lang="ts">
import { formatDate } from '~/utils/i18nHelpers'

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

interface UserSubscription {
  id: number
  status: string
  startDate: string
  endDate?: string
  autoRenew: boolean
  plan: SubscriptionPlan
}

interface Props {
  subscription: UserSubscription | null
}

interface Emits {
  (e: 'refresh'): void
}

const props = defineProps<Props>()
const { subscription } = toRefs(props)
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { showSuccess, showError } = useToastNotification()

// State
const isChangingPlan = ref(false)
const isCancelling = ref(false)
const isSubscribing = ref(false)
const showPlanSelector = ref(false)
const showConfirmModal = ref(false)
const showCancelModal = ref(false)
const selectedPlanId = ref<number | null>(null)
const selectedPlan = ref<SubscriptionPlan | null>(null)

// Computed
const isLoading = computed(() => 
  subscription.value ? isChangingPlan.value : isSubscribing.value
)

const confirmModalTitle = computed(() =>
  subscription.value 
    ? t('profile.subscription.confirmChangeTitle') 
    : t('profile.subscription.confirmSubscribeTitle')
)

const confirmModalMessage = computed(() =>
  subscription.value 
    ? t('profile.subscription.confirmChangeMessage') 
    : t('profile.subscription.confirmSubscribeMessage')
)

const confirmButtonText = computed(() =>
  subscription.value 
    ? t('profile.subscription.confirmChange') 
    : t('profile.subscription.confirmSubscribe')
)

const selectedPlanInfo = computed(() => {
  if (!selectedPlan.value) return ''
  return `${selectedPlan.value.name} - $${formatPrice(selectedPlan.value.price)}/${selectedPlan.value.billingPeriod}`
})

const currentPlanInfo = computed(() =>
  subscription.value 
    ? `${subscription.value.plan.name} - $${formatPrice(subscription.value.plan.price)}/${subscription.value.plan.billingPeriod}`
    : ''
)

// Utilities
const formatPrice = (cents: number) => (cents / 100).toFixed(2)

const parsedFeatures = (featuresJson: string) => {
  try {
    return JSON.parse(featuresJson) as string[]
  } catch {
    return []
  }
}

// API call wrapper
const handleApiCall = async (
  apiCall: () => Promise<void>,
  loadingRef: Ref<boolean>,
  successMessage: string,
  errorMessage: string,
  onSuccess?: () => void
) => {
  loadingRef.value = true
  try {
    await apiCall()
    showSuccess(successMessage)
    onSuccess?.()
  } catch (error: unknown) {
    const message = (error as { data?: { message?: string } })?.data?.message || errorMessage
    showError(message)
  } finally {
    loadingRef.value = false
  }
}

// Handlers
const handleSubscribe = async () => {
  if (!selectedPlanId.value) {
    showError(t('profile.subscription.selectPlan'))
    return
  }

  await handleApiCall(
    () => $fetch('/api/user/subscription/subscribe', {
      method: 'POST',
      body: { planId: selectedPlanId.value }
    }),
    isSubscribing,
    t('profile.subscription.subscribed'),
    t('profile.subscription.subscribeFailed'),
    () => {
      showPlanSelector.value = false
      showConfirmModal.value = false
      emit('refresh')
    }
  )
}

const handleChangePlan = async () => {
  if (!selectedPlanId.value) {
    showError(t('profile.subscription.selectNewPlan'))
    return
  }

  await handleApiCall(
    () => $fetch('/api/user/subscription/change-plan', {
      method: 'POST',
      body: { planId: selectedPlanId.value }
    }),
    isChangingPlan,
    t('profile.subscription.planChanged'),
    t('profile.subscription.changeFailed'),
    () => {
      showPlanSelector.value = false
      showConfirmModal.value = false
      emit('refresh')
    }
  )
}

const handleCancelSubscription = async () => {
  await handleApiCall(
    () => $fetch('/api/user/subscription/cancel', { method: 'POST' }),
    isCancelling,
    t('profile.subscription.cancelled'),
    t('profile.subscription.cancelFailed'),
    () => {
      showCancelModal.value = false
      emit('refresh')
    }
  )
}

const openPlanSelector = () => {
  selectedPlanId.value = null
  selectedPlan.value = null
  showPlanSelector.value = true
}

// Fetch plans to get selected plan details
const { data: availablePlans } = await useFetch<SubscriptionPlan[]>('/api/plans')

const handlePlanSelection = (planId: number) => {
  if (subscription.value?.plan.id === planId) return
  
  selectedPlanId.value = planId
  // Get the full plan object
  selectedPlan.value = availablePlans.value?.find(p => p.id === planId) || null
  showPlanSelector.value = false
  showConfirmModal.value = true
}

const handleConfirm = async () => {
  if (subscription.value) {
    await handleChangePlan()
  } else {
    await handleSubscribe()
  }
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ t('profile.subscription.title') }}</h3>
        <UBadge
          v-if="subscription"
          variant="subtle"
        >
          {{ subscription.status }}
        </UBadge>
      </div>
    </template>

    <div v-if="!subscription" class="text-center py-8">
      <UIcon name="i-heroicons-credit-card" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('profile.subscription.noSubscription') }}</p>
      <UButton color="primary" size="lg" @click="openPlanSelector">
        {{ t('profile.subscription.subscribe') }}
      </UButton>
    </div>

    <div v-else class="space-y-6">
      <!-- Current Plan -->
      <div v-if="!showPlanSelector" class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h4 class="text-xl font-bold">{{ subscription.plan.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ subscription.plan.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-primary">
              ${{ formatPrice(subscription.plan.price) }}
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">
              /{{ subscription.plan.billingPeriod }}
            </div>
          </div>
        </div>

        <ul class="space-y-2 mb-4">
          <li class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-check-circle" class="text-green-500" />
            <span>{{ subscription.plan.maxQuality }} Quality</span>
          </li>
          <li class="flex items-center gap-2 text-sm">
            <UIcon name="i-heroicons-check-circle" class="text-green-500" />
            <span>{{ subscription.plan.maxDevices }} {{ subscription.plan.maxDevices === 1 ? 'Device' : 'Devices' }}</span>
          </li>
          <li
            v-for="(feature, idx) in parsedFeatures(subscription.plan.features)"
            :key="idx"
            class="flex items-center gap-2 text-sm"
          >
            <UIcon name="i-heroicons-check-circle" class="text-green-500" />
            <span>{{ feature }}</span>
          </li>
        </ul>

        <div class="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
          <p>{{ t('profile.subscription.startDate') }}: {{ formatDate(subscription.startDate) }}</p>
          <p v-if="subscription.autoRenew">{{ t('profile.subscription.autoRenew') }}: {{ t('common.yes') }}</p>
          <p v-if="subscription.endDate">{{ t('profile.subscription.endDate') }}: {{ formatDate(subscription.endDate) }}</p>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="!showPlanSelector" class="flex gap-3">
        <UButton
          color="primary"
          variant="outline"
          :disabled="isChangingPlan || isCancelling"
          @click="openPlanSelector"
        >
          {{ t('profile.subscription.changePlan') }}
        </UButton>
        <UButton
          variant="outline"
          color="gray"
          :loading="isCancelling"
          :disabled="isChangingPlan || isCancelling"
          @click="showCancelModal = true"
        >
          {{ t('profile.subscription.cancelSubscription') }}
        </UButton>
      </div>
    </div>

    <!-- Plan Selector -->
    <div v-if="showPlanSelector" class="mt-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ subscription ? t('profile.subscription.selectNewPlan') : t('profile.subscription.selectPlan') }}
      </h3>

      <SubscriptionPlanWithPayment
        v-model="selectedPlanId"
        :show-payment-form="false"
        @update:model-value="handlePlanSelection"
      />

      <div class="flex justify-end gap-3 mt-6">
        <UButton variant="outline" @click="showPlanSelector = false">
          {{ t('common.cancel') }}
        </UButton>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <AdminConfirmModal
      v-model:open="showConfirmModal"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :user-info="selectedPlanInfo"
      :confirm-text="confirmButtonText"
      confirm-class="bg-primary hover:bg-primary/90"
      :loading="isLoading"
      @confirm="handleConfirm"
    />

    <!-- Cancel Confirmation Modal -->
    <AdminConfirmModal
      v-model:open="showCancelModal"
      :title="t('profile.subscription.cancelSubscription')"
      :message="t('profile.subscription.cancelConfirm')"
      :user-info="currentPlanInfo"
      :confirm-text="t('profile.subscription.cancelSubscription')"
      confirm-class="bg-red-600 hover:bg-red-700"
      :loading="isCancelling"
      @confirm="handleCancelSubscription"
    />
  </UCard>
</template>
