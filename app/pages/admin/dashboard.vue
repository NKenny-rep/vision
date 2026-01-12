<script setup lang="ts">
import { ADMIN_ROUTES } from '~/constants/routes'

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'admin']
})

const { t } = useI18n()
const routes = useAppRoutes()

// Admin quick actions configuration (SOLID: Open/Closed Principle)
const adminActions = [
  {
    to: routes.admin.users(),
    icon: 'i-heroicons-users',
    labelKey: 'admin.users.title',
    variant: 'primary' as const
  },
  {
    to: ADMIN_ROUTES.VIDEOS,
    icon: 'i-heroicons-film',
    labelKey: 'admin.videos.title',
    variant: 'secondary' as const
  },
  {
    to: ADMIN_ROUTES.ANALYTICS,
    icon: 'i-heroicons-chart-bar',
    labelKey: 'admin.analytics.title',
    variant: 'secondary' as const
  }
]

// Dashboard stats configuration (DRY principle)
const stats = [
  {
    icon: 'i-heroicons-film',
    labelKey: 'admin.dashboard.stats.totalVideos',
    value: '128',
    color: 'orange'
  },
  {
    icon: 'i-heroicons-users',
    labelKey: 'admin.dashboard.stats.activeUsers',
    value: '1,234',
    color: 'orange'
  },
  {
    icon: 'i-heroicons-eye',
    labelKey: 'admin.dashboard.stats.totalViews',
    value: '45.2K',
    color: 'orange'
  },
  {
    icon: 'i-heroicons-currency-dollar',
    labelKey: 'admin.dashboard.stats.revenue',
    value: '$12.5K',
    color: 'orange'
  }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white">{{ $t('admin.dashboard.title') }}</h1>
      <p class="text-gray-400 mt-2">{{ $t('admin.dashboard.subtitle') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard v-for="(stat, index) in stats" :key="index">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg" :class="`bg-${stat.color}-500/10`">
            <UIcon :name="stat.icon" class="w-6 h-6" :class="`text-${stat.color}-500`" />
          </div>
          <div>
            <p class="text-sm text-gray-400">{{ $t(stat.labelKey) }}</p>
            <p class="text-2xl font-bold text-white">{{ stat.value }}</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions (Admin Routes Only) -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-white">{{ $t('admin.dashboard.quickActions') }}</h2>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UIButton
          v-for="action in adminActions"
          :key="action.labelKey"
          :to="action.to"
          :variant="action.variant"
          :icon="action.icon"
          size="lg"
          block
        >
          {{ $t(action.labelKey) }}
        </UIButton>
      </div>
    </UCard>
  </div>
</template>
