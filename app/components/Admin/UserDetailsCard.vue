<script setup lang="ts">
import type { UserWithDetails } from '~/composables/user/useUserExpansion'

interface Props {
  user: UserWithDetails | null
  loading?: boolean
}

defineProps<Props>()

const { t } = useI18n()

const getRoleColor = (roleName?: string) => {
  if (!roleName) return 'text-gray-400'
  const role = roleName.toLowerCase()
  if (role.includes('admin')) return 'text-red-500'
  if (role.includes('moderator')) return 'text-purple-500'
  return 'text-blue-500'
}

const formatDateDetailed = (date: Date | string) => {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="flex items-center justify-center py-8">
    <div class="text-center space-y-4">
      <div class="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <p class="text-gray-400">{{ t('common.loading') }}...</p>
    </div>
  </div>

  <!-- User Details -->
  <div v-else-if="user" class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Account Information -->
    <UCard class="bg-gray-900 border border-gray-700">
      <template #header>
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-user-circle" class="w-5 h-5 text-primary" />
          {{ t('admin.users.details.accountInfo') }}
        </h3>
      </template>
      <div class="space-y-3 text-sm">
        <div>
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.table.email') }}</dt>
          <dd class="text-white">{{ user.email }}</dd>
        </div>
        <div v-if="user.phone">
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.table.phone') }}</dt>
          <dd class="text-white">{{ user.phone }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.table.role') }}</dt>
          <dd>
            <span class="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1" :class="getRoleColor(user.roleName ?? undefined) + ' bg-surface'">
              <UIcon name="i-heroicons-shield-check" class="w-3 h-3" />
              {{ user.roleName }}
            </span>
          </dd>
        </div>
      </div>
    </UCard>

    <!-- Subscription Information -->
    <UCard class="bg-gray-900 border border-gray-700">
      <template #header>
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-credit-card" class="w-5 h-5 text-primary" />
          {{ t('admin.users.details.subscription') }}
        </h3>
      </template>
      <div v-if="user.subscription" class="space-y-3 text-sm">
        <div>
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.details.plan') }}</dt>
          <dd class="text-white font-semibold">{{ user.subscription.name }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.details.price') }}</dt>
          <dd class="text-white">${{ (user.subscription.price / 100).toFixed(2) }}/{{ t('common.month') }}</dd>
        </div>
        <div>
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.details.quality') }}</dt>
          <dd class="text-white uppercase">{{ user.subscription.quality }}</dd>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <UIcon name="i-heroicons-x-circle" class="w-8 h-8 text-gray-600 mx-auto mb-1" />
        <p class="text-xs text-gray-400">{{ t('admin.users.details.noSubscription') }}</p>
      </div>
    </UCard>

    <!-- Activity -->
    <UCard class="bg-gray-900 border border-gray-700">
      <template #header>
        <h3 class="text-lg font-semibold text-white flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary" />
          {{ t('admin.users.details.activity') }}
        </h3>
      </template>
      <div class="space-y-3 text-sm">
        <div>
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.table.createdAt') }}</dt>
          <dd class="text-white">{{ formatDateDetailed(user.createdAt) }}</dd>
        </div>
        <div v-if="user.updatedAt">
          <dt class="text-xs font-medium text-gray-400 mb-1">{{ t('admin.users.details.lastUpdated') }}</dt>
          <dd class="text-white">{{ formatDateDetailed(user.updatedAt) }}</dd>
        </div>
      </div>
    </UCard>
  </div>
</template>
