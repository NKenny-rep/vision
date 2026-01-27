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
    <div class="stack-3">
      <!-- User Info Header -->
      <div class="flex-start gap-3 pb-3 border-b border-default">
        <UIAvatar :src="user.avatar" :name="user.name" :alt="user.name" size="md" />
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-white truncate">{{ user.name }}</h3>
          <p class="text-xs text-muted">ID: {{ user.id }}</p>
        </div>
      </div>

      <!-- User Details -->
      <div class="stack-2">
        <UIInfoRow
          icon="i-heroicons-envelope"
          :label="t('admin.users.table.email')"
          :value="user.email"
          truncate
        />

        <UIInfoRow
          v-if="user.phone"
          icon="i-heroicons-phone"
          :label="t('admin.users.table.phone')"
          :value="user.phone"
        />

        <UIInfoRow icon="i-heroicons-shield-check" :label="t('admin.users.table.role')">
          <span :class="['inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium', getRoleBadgeClass(user.roleName)]">
            {{ user.roleName }}
          </span>
        </UIInfoRow>

        <UIInfoRow
          icon="i-heroicons-calendar"
          :label="t('admin.users.table.createdAt')"
          :value="formatDate(user.createdAt)"
        />
      </div>

      <!-- Actions -->
      <div class="pt-3 border-t border-default">
        <UIActionButtons
          show-view
          show-edit
          show-delete
          :view-icon="expanded ? 'i-heroicons-chevron-up' : 'i-heroicons-eye'"
          @view="emit('toggleExpand', user.id)"
          @edit="emit('edit', user)"
          @delete="emit('delete', user)"
        />
      </div>

      <!-- Expanded Details -->
      <div v-if="expanded" class="pt-3 border-t border-default">
        <AdminUserDetailsCard
          v-if="userDetails"
          :user="userDetails"
          :loading="loading"
        />
      </div>
    </div>
  </UCard>
</template>
