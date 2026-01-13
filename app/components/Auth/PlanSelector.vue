<script setup lang="ts">
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
  modelValue: number | null
  compact?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const _props = withDefaults(defineProps<Props>(), {
  compact: false
})
const emit = defineEmits<Emits>()
const { t } = useI18n()

const { data: plans, pending } = await useFetch<SubscriptionPlan[]>('/api/plans')

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

const selectPlan = (planId: number) => {
  emit('update:modelValue', planId)
}
</script>

<template>
  <div>
    <div v-if="pending" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"/>
    </div>

    <div
v-else :class="[
      'grid gap-3',
      compact 
        ? 'grid-cols-1 sm:grid-cols-3' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
    ]">
      <div
        v-for="(plan, index) in plans"
        :key="plan.id"
        :class="[
          'relative group cursor-pointer rounded-lg border-2 transition-all duration-200 overflow-hidden',
          compact ? 'hover:shadow-lg' : 'hover:shadow-2xl hover:-translate-y-1',
          modelValue === plan.id
            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-[1.01]'
            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 bg-white dark:bg-gray-800/50'
        ]"
        @click="selectPlan(plan.id)"
      >
        <!-- Popular Badge for middle plan -->
        <div 
          v-if="index === 1"
          class="absolute top-0 right-0 bg-gradient-to-r from-primary to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md"
        >
          {{ t('common.popular') || 'POPULAR' }}
        </div>

        <div :class="compact ? 'p-3' : 'p-6 sm:p-8'">
          <!-- Plan Header -->
          <div :class="['text-center', compact ? 'mb-3' : 'mb-6']">
            <h4
:class="[
              'font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent',
              compact ? 'text-lg mb-1' : 'text-2xl sm:text-3xl mb-2'
            ]">
              {{ plan.name }}
            </h4>
            <p
:class="[
              'text-gray-600 dark:text-gray-400 flex items-center justify-center',
              compact ? 'text-xs min-h-[1.5rem]' : 'text-sm min-h-[2.5rem]'
            ]">
              {{ plan.description }}
            </p>
          </div>

          <!-- Price -->
          <div
:class="[
            'text-center border-b border-gray-200 dark:border-gray-700',
            compact ? 'mb-3 pb-3' : 'mb-8 pb-6'
          ]">
            <div class="flex items-start justify-center gap-1">
              <span :class="compact ? 'text-lg font-bold text-gray-900 dark:text-white mt-0.5' : 'text-2xl font-bold text-gray-900 dark:text-white mt-1'">$</span>
              <span
:class="[
                'font-extrabold text-primary',
                compact ? 'text-3xl' : 'text-5xl sm:text-6xl'
              ]">
                {{ formatPrice(plan.price) }}
              </span>
            </div>
            <p
:class="[
              'text-gray-500 dark:text-gray-400',
              compact ? 'text-[10px] mt-1' : 'text-sm mt-2'
            ]">
              per {{ plan.billingPeriod }}
            </p>
          </div>

          <!-- Features -->
          <ul :class="compact ? 'space-y-1.5 mb-3' : 'space-y-3 mb-6'">
            <li :class="compact ? 'flex items-start gap-2' : 'flex items-start gap-3'">
              <UIcon name="i-heroicons-check-circle-20-solid" :class="compact ? 'text-primary text-sm mt-0.5 flex-shrink-0' : 'text-primary text-xl mt-0.5 flex-shrink-0'" />
              <span :class="compact ? 'text-xs' : 'text-sm sm:text-base'">
                <strong>{{ plan.maxQuality }}</strong> Quality
              </span>
            </li>
            <li :class="compact ? 'flex items-start gap-2' : 'flex items-start gap-3'">
              <UIcon name="i-heroicons-check-circle-20-solid" :class="compact ? 'text-primary text-sm mt-0.5 flex-shrink-0' : 'text-primary text-xl mt-0.5 flex-shrink-0'" />
              <span :class="compact ? 'text-xs' : 'text-sm sm:text-base'">
                <strong>{{ plan.maxDevices }}</strong> {{ plan.maxDevices === 1 ? 'Device' : 'Devices' }}
              </span>
            </li>
            <li
              v-for="(feature, idx) in parsedFeatures(plan.features)"
              :key="idx"
              :class="compact ? 'flex items-start gap-2' : 'flex items-start gap-3'"
            >
              <UIcon name="i-heroicons-check-circle-20-solid" :class="compact ? 'text-primary text-sm mt-0.5 flex-shrink-0' : 'text-primary text-xl mt-0.5 flex-shrink-0'" />
              <span :class="compact ? 'text-xs' : 'text-sm sm:text-base'">{{ feature }}</span>
            </li>
          </ul>

          <!-- Selection Indicator -->
          <div :class="compact ? 'mt-3' : 'mt-6'">
            <UButton
              :variant="modelValue === plan.id ? 'solid' : 'outline'"
              color="primary"
              :size="compact ? 'md' : 'lg'"
              block
              class="transition-all duration-200"
            >
              <span v-if="modelValue === plan.id" class="flex items-center gap-2">
                <UIcon name="i-heroicons-check-circle-20-solid" />
                {{ t('common.selected') || 'Selected' }}
              </span>
              <span v-else>
                {{ t('common.select') || 'Select Plan' }}
              </span>
            </UButton>
          </div>
        </div>

        <!-- Animated border on hover -->
        <div 
          :class="[
            'absolute inset-0 transition-opacity duration-300 pointer-events-none',
            compact ? 'rounded-lg' : 'rounded-xl',
            modelValue === plan.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          ]"
          style="background: linear-gradient(60deg, transparent, rgba(var(--color-primary-500), 0.1), transparent); background-size: 200% 100%;"
        />
      </div>
    </div>
  </div>
</template>
