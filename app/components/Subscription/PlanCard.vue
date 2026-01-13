<script setup lang="ts">
/**
 * SubscriptionPlanCard Component
 * 
 * Single Responsibility: Displays a single subscription plan with its details
 * Reusable across different contexts (selection, comparison, display)
 */

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

interface Props {
  plan: SubscriptionPlan
  selected?: boolean
  disabled?: boolean
  compact?: boolean
  showPopularBadge?: boolean
}

interface Emits {
  (e: 'select', planId: number): void
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  disabled: false,
  compact: false,
  showPopularBadge: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const formatPrice = (cents: number) => (cents / 100).toFixed(2)

const parsedFeatures = computed(() => {
  try {
    return JSON.parse(props.plan.features) as string[]
  } catch {
    return []
  }
})

const handleClick = () => {
  if (!props.disabled) {
    emit('select', props.plan.id)
  }
}
</script>

<template>
  <div
    :class="[
      'relative group rounded-lg border-2 transition-all duration-200 overflow-hidden flex flex-col',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      compact ? 'hover:shadow-lg' : 'hover:shadow-2xl hover:-translate-y-1',
      selected
        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.01]'
        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 bg-white dark:bg-gray-800/50'
    ]"
    @click="handleClick"
  >
    <!-- Popular Badge -->
    <div 
      v-if="showPopularBadge"
      class="absolute top-0 right-0 bg-linear-to-r from-primary to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md"
    >
      {{ t('common.popular') || 'POPULAR' }}
    </div>

    <div :class="['flex flex-col flex-grow', compact ? 'p-3' : 'p-6 sm:p-8']">>
      <!-- Plan Header -->
      <div :class="['text-center', compact ? 'mb-3' : 'mb-6']">
        <h4
          :class="[
            'font-bold bg-linear-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent',
            compact ? 'text-lg mb-1' : 'text-2xl sm:text-3xl mb-2'
          ]"
        >
          {{ plan.name }}
        </h4>
        <p
          :class="[
            'text-gray-600 dark:text-gray-400 flex items-center justify-center',
            compact ? 'text-xs min-h-6' : 'text-sm min-h-10'
          ]"
        >
          {{ plan.description }}
        </p>
      </div>

      <!-- Price -->
      <div
        :class="[
          'text-center border-b border-gray-200 dark:border-gray-700',
          compact ? 'mb-3 pb-3' : 'mb-8 pb-6'
        ]"
      >
        <div class="flex items-start justify-center gap-1">
          <span :class="compact ? 'text-lg font-bold text-gray-900 dark:text-white mt-0.5' : 'text-2xl font-bold text-gray-900 dark:text-white mt-1'">$</span>
          <span
            :class="[
              'font-extrabold text-primary',
              compact ? 'text-3xl' : 'text-5xl sm:text-6xl'
            ]"
          >
            {{ formatPrice(plan.price) }}
          </span>
        </div>
        <p
          :class="[
            'text-gray-500 dark:text-gray-400',
            compact ? 'text-[10px] mt-1' : 'text-sm mt-2'
          ]"
        >
          per {{ plan.billingPeriod }}
        </p>
      </div>

      <!-- Features -->
      <ul :class="['flex-grow', compact ? 'space-y-1.5 mb-3' : 'space-y-3 mb-6']">>
        <li :class="compact ? 'flex items-start gap-2' : 'flex items-start gap-3'">
          <UIcon
            name="i-heroicons-check-circle-20-solid"
            :class="compact ? 'text-primary text-sm mt-0.5 shrink-0' : 'text-primary text-xl mt-0.5 shrink-0'"
          />
          <span :class="compact ? 'text-xs' : 'text-sm sm:text-base'">
            <strong>{{ plan.maxQuality }}</strong> Quality
          </span>
        </li>
        <li :class="compact ? 'flex items-start gap-2' : 'flex items-start gap-3'">
          <UIcon
            name="i-heroicons-check-circle-20-solid"
            :class="compact ? 'text-primary text-sm mt-0.5 shrink-0' : 'text-primary text-xl mt-0.5 shrink-0'"
          />
          <span :class="compact ? 'text-xs' : 'text-sm sm:text-base'">
            <strong>{{ plan.maxDevices }}</strong> {{ plan.maxDevices === 1 ? 'Device' : 'Devices' }}
          </span>
        </li>
        <li
          v-for="(feature, idx) in parsedFeatures"
          :key="idx"
          :class="compact ? 'flex items-start gap-2' : 'flex items-start gap-3'"
        >
          <UIcon
            name="i-heroicons-check-circle-20-solid"
            :class="compact ? 'text-primary text-sm mt-0.5 shrink-0' : 'text-primary text-xl mt-0.5 shrink-0'"
          />
          <span :class="compact ? 'text-xs' : 'text-sm sm:text-base'">{{ feature }}</span>
        </li>
      </ul>

      <!-- Selection Button -->
      <div :class="['mt-auto', compact ? 'pt-3' : 'pt-6']">
        <UButton
          :variant="selected ? 'solid' : 'outline'"
          color="primary"
          :size="compact ? 'md' : 'lg'"
          block
          class="transition-all duration-200"
        >
          <span v-if="selected" class="flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle-20-solid" />
            {{ t('common.selected') || 'Selected' }}
          </span>
          <span v-else>
            {{ t('common.select') || 'Select Plan' }}
          </span>
        </UButton>
      </div>
    </div>
  </div>
</template>
