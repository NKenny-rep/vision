<script setup lang="ts">
definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth']
});

const { user, session } = useAuthentication()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-white">{{ $t('userPanel.welcomeToDashboard') }}</h1>
      <p class="text-gray-400 mt-2">{{ $t('userPanel.manageDashboardContent') }}</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>

    <!-- User Info -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold text-white">{{ $t('userPanel.userInformation') }}</h2>
      </template>
      <div class="space-y-3">
        <div>
          <span class="text-gray-400">{{ $t('userPanel.email') }}:</span>
          <span class="text-white ml-2">{{ user?.email }}</span>
        </div>
        <div>
          <span class="text-gray-400">{{ $t('userPanel.roles') }}:</span>
          <span class="text-white ml-2">{{ session?.user?.roles?.join(', ') || 'User' }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>
