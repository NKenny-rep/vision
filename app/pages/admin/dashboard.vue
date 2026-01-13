<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'admin']
})

const { t: _t } = useI18n()
const routes = useAppRoutes()

// Admin quick actions configuration (SOLID: Open/Closed Principle)

// Only enable user management quick action
const adminActions = [
  {
    to: routes.admin.users(),
    icon: 'i-heroicons-users',
    labelKey: 'admin.users.title',
    variant: 'primary' as const
  }
]

// Fetch stats on client side after authentication
interface StatsData {
  totalUsers: number
  totalRevenue: number
  mostUsedPlan: { name: string; planId: number; count: number } | null
  mostSavedMovie: { title: string; omdbId: string; count: number } | null
}

const statsData = ref<StatsData | null>(null)
const loading = ref(true)

// Computed stats based on fetched data
const stats = computed(() => {
  if (!statsData.value) {
    return [
      { icon: 'i-heroicons-users', labelKey: 'admin.dashboard.stats.totalUsers', value: '...', color: 'orange' },
      { icon: 'i-heroicons-currency-dollar', labelKey: 'admin.dashboard.stats.revenue', value: '...', color: 'orange' },
      { icon: 'i-heroicons-cog-6-tooth', labelKey: 'admin.dashboard.stats.mostUsedPlan', value: '...', color: 'orange' },
      { icon: 'i-heroicons-bookmark', labelKey: 'admin.dashboard.stats.mostSavedMovie', value: '...', color: 'orange' },
    ]
  }

  return [
    {
      icon: 'i-heroicons-users',
      labelKey: 'admin.dashboard.stats.totalUsers',
      value: statsData.value.totalUsers,
      color: 'orange',
    },
    {
      icon: 'i-heroicons-currency-dollar',
      labelKey: 'admin.dashboard.stats.revenue',
      value: `$${(Number(statsData.value.totalRevenue) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      color: 'orange',
    },
    {
      icon: 'i-heroicons-cog-6-tooth',
      labelKey: 'admin.dashboard.stats.mostUsedPlan',
      value: statsData.value.mostUsedPlan?.name || '-',
      color: 'orange',
    },
    {
      icon: 'i-heroicons-bookmark',
      labelKey: 'admin.dashboard.stats.mostSavedMovie',
      value: statsData.value.mostSavedMovie?.title || '-',
      color: 'orange',
    },
  ]
})

// Fetch stats after component is mounted
onMounted(async () => {
  try {
    const data = await $fetch<StatsData>('/api/admin/stats')
    statsData.value = data
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
  } finally {
    loading.value = false
  }
})
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
