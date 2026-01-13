<script setup lang="ts">
import type { User } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard-layout'
})

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const userId = computed(() => Number(route.params.id))

const { getUserDetails } = useUserDetails()

const user = ref<User | null>(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    user.value = await getUserDetails(userId.value)
  } catch (_e) {
    error.value = true
  } finally {
    loading.value = false
  }
})

const goBack = () => navigateTo(localePath('/admin/users'))

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
  <div class="container mx-auto px-4 py-8">
    <!-- Back Button -->
    <UIButton
      variant="ghost"
      size="sm"
      icon="i-heroicons-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      {{ t('common.back') }}
    </UIButton>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-100">
      <div class="text-center space-y-4">
        <div class="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p class="text-gray-400">{{ t('common.loading') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || !user" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-white mb-2">{{ t('admin.users.userNotFound') }}</h2>
      <p class="text-gray-400 mb-6">{{ t('admin.users.userNotFoundDescription') }}</p>
      <UIButton variant="primary" @click="goBack">
        {{ t('common.back') }}
      </UIButton>
    </div>

    <!-- User Details -->
    <div v-else class="space-y-6">
      <!-- Header Card -->
      <UCard class="bg-gray-900 border border-gray-800">
        <div class="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <!-- Avatar -->
          <div class="shrink-0">
            <div v-if="user.avatar" class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700">
              <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover">
            </div>
            <div v-else class="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-700">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
          </div>

          <!-- User Info -->
          <div class="flex-1 space-y-2">
            <h1 class="text-3xl font-bold text-white">{{ user.name }}</h1>
            <div class="flex flex-wrap items-center gap-4 text-gray-400">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                <span>{{ user.email }}</span>
              </div>
              <div v-if="user.phone" class="flex items-center gap-2">
                <UIcon name="i-heroicons-phone" class="w-5 h-5" />
                <span>{{ user.phone }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" :class="getRoleColor(user.roleName)" class="w-5 h-5" />
              <span class="text-sm font-medium" :class="getRoleColor(user.roleName)">
                {{ user.roleName || t('admin.users.table.role') }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <UIButton
              variant="secondary"
              icon="i-heroicons-pencil"
              :to="localePath(`/admin/users/edit/${user.id}`)"
            >
              {{ t('common.edit') }}
            </UIButton>
          </div>
        </div>
      </UCard>

      <!-- Details Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Account Information -->
        <UCard class="bg-gray-900 border border-gray-800">
          <template #header>
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-orange-500" />
              {{ t('admin.users.details.accountInfo') }}
            </h2>
          </template>

          <div class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.userId') }}</dt>
              <dd class="text-white font-mono">{{ user.id }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.table.email') }}</dt>
              <dd class="text-white">{{ user.email }}</dd>
            </div>

            <div v-if="user.userName">
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.username') }}</dt>
              <dd class="text-white">{{ user.userName }}</dd>
            </div>

            <div v-if="user.fullName">
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.fullName') }}</dt>
              <dd class="text-white">{{ user.fullName }}</dd>
            </div>

            <div v-if="user.phone">
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.table.phone') }}</dt>
              <dd class="text-white">{{ user.phone }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.table.role') }}</dt>
              <dd>
                <span class="px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1" :class="getRoleColor(user.roleName) + ' bg-gray-800'">
                  <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                  {{ user.roleName }}
                </span>
              </dd>
            </div>
          </div>
        </UCard>

        <!-- Subscription Information -->
        <UCard class="bg-gray-900 border border-gray-800">
          <template #header>
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-orange-500" />
              {{ t('admin.users.details.subscription') }}
            </h2>
          </template>

          <div v-if="user.subscription" class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.plan') }}</dt>
              <dd>
                <span class="text-white font-semibold text-lg">{{ user.subscription.name }}</span>
              </dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.price') }}</dt>
              <dd class="text-white">${{ user.subscription.price.toFixed(2) }}/{{ t('common.month') }}</dd>
            </div>

            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.quality') }}</dt>
              <dd class="text-white uppercase">{{ user.subscription.quality }}</dd>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <UIcon name="i-heroicons-x-circle" class="w-12 h-12 text-gray-600 mx-auto mb-2" />
            <p class="text-gray-400">{{ t('admin.users.details.noSubscription') }}</p>
          </div>
        </UCard>

        <!-- Activity Timestamps -->
        <UCard class="bg-gray-900 border border-gray-800">
          <template #header>
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <UIcon name="i-heroicons-clock" class="w-6 h-6 text-orange-500" />
              {{ t('admin.users.details.activity') }}
            </h2>
          </template>

          <div class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.table.createdAt') }}</dt>
              <dd class="text-white">{{ formatDateDetailed(user.createdAt) }}</dd>
            </div>

            <div v-if="user.updatedAt">
              <dt class="text-sm font-medium text-gray-400 mb-1">{{ t('admin.users.details.lastUpdated') }}</dt>
              <dd class="text-white">{{ formatDateDetailed(user.updatedAt) }}</dd>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
