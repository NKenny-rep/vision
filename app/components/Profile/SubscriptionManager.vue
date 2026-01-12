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

const _props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const { showSuccess, showError } = useToastNotification()

const isChangingPlan = ref(false)
const isCancelling = ref(false)
const showPlanSelector = ref(false)
const selectedPlanId = ref<number | null>(null)

const { data: availablePlans } = await useFetch<SubscriptionPlan[]>('/api/plans')

const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}

const parsedFeatures = (featuresJson: string) => {
  try {
    return JSON.parse(featuresJson) as string[]
  } catch {
    return []
  }
}

const handleChangePlan = async () => {
  if (!selectedPlanId.value) {
    showError(t('profile.subscription.selectNewPlan'))
    return
  }

  isChangingPlan.value = true
  try {
    await $fetch('/api/user/subscription/change-plan', {
      method: 'POST',
      body: { planId: selectedPlanId.value }
    })

    showSuccess(t('profile.subscription.planChanged'))

    showPlanSelector.value = false
    emit('refresh')
  } catch (error: unknown) {
    const errorMessage = (error as { data?: { message?: string } })?.data?.message || t('profile.subscription.changeFailed');
    showError(errorMessage);
  } finally {
    isChangingPlan.value = false
  }
}

const handleCancelSubscription = async () => {
  if (!confirm(t('profile.subscription.cancelConfirm'))) {
    return
  }

  isCancelling.value = true
  try {
    await $fetch('/api/user/subscription/cancel', {
      method: 'POST'
    })

    showSuccess(t('profile.subscription.cancelled'))

    emit('refresh')
  } catch (error: unknown) {
    const errorMessage = (error as { data?: { message?: string } })?.data?.message || t('profile.subscription.cancelFailed');
    showError(errorMessage);
  } finally {
    isCancelling.value = false
  }
}

const openChangePlan = () => {
  selectedPlanId.value = null
  showPlanSelector.value = true
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
      <p class="text-gray-600 dark:text-gray-400">{{ t('profile.subscription.noSubscription') }}</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Current Plan -->
      <div class="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
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
      <div class="flex gap-3">
        <UButton
          color="primary"
          variant="outline"
          :disabled="isChangingPlan || isCancelling"
          @click="openChangePlan"
        >
          {{ t('profile.subscription.changePlan') }}
        </UButton>
        <UButton
          variant="outline"
          :loading="isCancelling"
          :disabled="isChangingPlan || isCancelling"
          @click="handleCancelSubscription"
        >
          {{ t('profile.subscription.cancelSubscription') }}
        </UButton>
      </div>

      <!-- Plan Selector Modal -->
      <UModal v-model="showPlanSelector">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ t('profile.subscription.selectNewPlan') }}</h3>
          </template>

          <div class="space-y-4">
            <div
              v-for="plan in availablePlans"
              :key="plan.id"
              :class="[
                'cursor-pointer p-4 rounded-lg border-2 transition-all',
                selectedPlanId === plan.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary/50',
                subscription.plan.id === plan.id ? 'opacity-50' : ''
              ]"
              @click="selectedPlanId = plan.id"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-bold">{{ plan.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ plan.description }}</p>
                </div>
                <div class="text-right">
                  <div class="text-xl font-bold text-primary">
                    ${{ formatPrice(plan.price) }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">/{{ plan.billingPeriod }}</div>
                </div>
              </div>
              <div v-if="subscription.plan.id === plan.id" class="text-xs text-gray-500">
                {{ t('profile.subscription.currentPlan') }}
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                variant="outline"
                @click="showPlanSelector = false"
              >
                {{ t('common.cancel') }}
              </UButton>
              <UButton
                color="primary"
                :loading="isChangingPlan"
                :disabled="!selectedPlanId || selectedPlanId === subscription.plan.id"
                @click="handleChangePlan"
              >
                {{ t('profile.subscription.confirmChange') }}
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </UCard>
</template>
