<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'admin']
});

const routes = useAppRoutes()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-white">{{ $t('admin.dashboard.title') }}</h1>
      <p class="text-gray-400 mt-2">{{ $t('admin.dashboard.subtitle') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-orange-500/10">
            <UIcon name="i-heroicons-film" class="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p class="text-sm text-gray-400">{{ $t('admin.dashboard.totalVideos') }}</p>
            <p class="text-2xl font-bold text-white">128</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-orange-500/10">
            <UIcon name="i-heroicons-users" class="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p class="text-sm text-gray-400">{{ $t('admin.dashboard.activeUsers') }}</p>
            <p class="text-2xl font-bold text-white">1,234</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-orange-500/10">
            <UIcon name="i-heroicons-eye" class="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p class="text-sm text-gray-400">{{ $t('admin.dashboard.totalViews') }}</p>
            <p class="text-2xl font-bold text-white">45.2K</p>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-lg bg-orange-500/10">
            <UIcon name="i-heroicons-currency-dollar" class="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p class="text-sm text-gray-400">{{ $t('admin.dashboard.revenue') }}</p>
            <p class="text-2xl font-bold text-white">$12.5K</p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-white">{{ $t('admin.dashboard.quickActions') }}</h2>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UIButton
          :to="routes.admin.users()"
          variant="primary"
          size="lg"
          block
          icon="i-heroicons-users"
        >
          {{ $t('admin.users.title') }}
        </UIButton>
        <UIButton
          :to="routes.admin.videos()"
          variant="secondary"
          size="lg"
          block
          icon="i-heroicons-film"
          hidden
        >
          {{ $t('admin.videos.title') }}
        </UIButton>
        <UIButton
          :to="routes.user.browse()"
          variant="secondary"
          size="lg"
          block
          icon="i-heroicons-play-circle"
          hidden
        >
          {{ $t('nav.browse') }}
        </UIButton>
      </div>
    </UCard>
  </div>
</template>
