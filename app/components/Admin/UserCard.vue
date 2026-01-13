<script setup lang="ts">
import type { User } from '~/types'
import type { UserWithDetails } from '~/composables/useUserExpansion'
import { formatDate } from '~/utils/i18nHelpers'
import { getRoleBadgeClass } from '~/utils/styling'

interface Props {
  user: User
  expanded?: boolean
  userDetails?: UserWithDetails | null
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
  toggleExpand: [userId: number]
}>()

const { t } = useI18n()
</script>

<template>
  <UCard class="overflow-hidden">
    <div class="space-y-3">
      <!-- User Info Header -->
      <div class="flex items-center gap-3 pb-3 border-b border-gray-700">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="w-12 h-12 rounded-full object-cover"
        >
        <div
          v-else
          class="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-lg"
        >
          {{ user.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-white truncate">{{ user.name }}</h3>
          <p class="text-xs text-gray-400">ID: {{ user.id }}</p>
        </div>
      </div>

      <!-- User Details -->
      <div class="space-y-2">
        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-xs text-gray-400">{{ t('admin.users.table.email') }}</p>
            <p class="text-sm text-white truncate">{{ user.email }}</p>
          </div>
        </div>

        <div v-if="user.phone" class="flex items-start gap-2">
          <UIcon name="i-heroicons-phone" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div class="flex-1">
            <p class="text-xs text-gray-400">{{ t('admin.users.table.phone') }}</p>
            <p class="text-sm text-white">{{ user.phone }}</p>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-shield-check" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div class="flex-1">
            <p class="text-xs text-gray-400">{{ t('admin.users.table.role') }}</p>
            <span :class="['inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium', getRoleBadgeClass(user.roleName)]">
              {{ user.roleName }}
            </span>
          </div>
        </div>

        <div class="flex items-start gap-2">
          <UIcon name="i-heroicons-calendar" class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div class="flex-1">
            <p class="text-xs text-gray-400">{{ t('admin.users.table.createdAt') }}</p>
            <p class="text-sm text-white">{{ formatDate(user.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-700">
        <button
          :title="expanded ? t('common.hide') : t('common.view')"
          class="text-blue-500 hover:text-blue-400 transition-colors p-2 rounded hover:bg-blue-500/10"
          @click="emit('toggleExpand', user.id)"
        >
          <UIcon :name="expanded ? 'i-heroicons-chevron-up' : 'i-heroicons-eye'" class="w-5 h-5" />
        </button>
        <button
          :title="t('common.edit')"
          class="text-orange-500 hover:text-orange-400 transition-colors p-2 rounded hover:bg-orange-500/10"
          @click="emit('edit', user)"
        >
          <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
        </button>
        <button
          :title="t('common.delete')"
          class="text-red-500 hover:text-red-400 transition-colors p-2 rounded hover:bg-red-500/10"
          @click="emit('delete', user)"
        >
          <UIcon name="i-heroicons-trash" class="w-5 h-5" />
        </button>
      </div>

      <!-- Expanded Details -->
      <div v-if="expanded" class="pt-3 border-t border-gray-700">
        <AdminUserDetailsCard
          v-if="userDetails"
          :user="userDetails"
          :loading="loading"
        />
      </div>
    </div>
  </UCard>
</template>
