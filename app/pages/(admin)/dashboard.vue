<script setup lang="ts">
const localePath = useLocalePath();

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'admin']
});

const { user, session } = useAuthentication()
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
          :to="localePath('/videos/create')"
          variant="primary"
          size="lg"
          block
          icon="i-heroicons-plus"
        >
          {{ $t('admin.dashboard.addNewVideo') }}
        </UIButton>
        <UIButton
          :to="localePath('/videos')"
          variant="secondary"
          size="lg"
          block
          icon="i-heroicons-film"
        >
          {{ $t('admin.videos.title') }}
        </UIButton>
        <UIButton
          :to="localePath('/browse')"
          variant="secondary"
          size="lg"
          block
          icon="i-heroicons-play-circle"
        >
          {{ $t('nav.browse') }}
        </UIButton>
      </div>
    </UCard>

    <!-- Recent Activity -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-white">{{ $t('admin.dashboard.recentActivity') }}</h2>
      </template>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-film" class="w-5 h-5 text-orange-500" />
            <span class="text-white">{{ $t('admin.dashboard.newVideoUploaded') }}: "Action Movie Title"</span>
          </div>
          <span class="text-sm text-gray-400">{{ $t('admin.dashboard.hoursAgo', { count: 2 }) }}</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-user-plus" class="w-5 h-5 text-orange-500" />
            <span class="text-white">{{ $t('admin.dashboard.newUserRegistered') }}</span>
          </div>
          <span class="text-sm text-gray-400">{{ $t('admin.dashboard.hoursAgo', { count: 5 }) }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
