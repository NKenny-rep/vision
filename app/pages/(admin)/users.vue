<script setup lang="ts">
import type { User, UserFormData } from '~/types'

definePageMeta({
  middleware: ['auth', 'admin'],
  layout: 'dashboard-layout'
})

const { t } = useI18n()
const { showSuccess, showError } = useToastNotification()

const {
  users,
  pagination,
  loading,
  error,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  changePage,
  updateFilters,
} = useUserManagement()

// Modal state management
const modals = reactive({
  create: false,
  edit: false,
  delete: false,
})

const selectedUser = ref<User | null>(null)

onMounted(async () => {
  await fetchUsers()
})

const handleSearch = async (query: string) => {
  await searchUsers(query)
}

const handleCreateUser = async (userData: UserFormData) => {
  const success = await createUser(userData)
  if (success) {
    modals.create = false
    showSuccess(t('admin.users.userCreated'))
  } else {
    showError(error.value || t('admin.users.createFailed'))
  }
}

const handleEditClick = (user: User) => {
  selectedUser.value = user
  modals.edit = true
}

const handleUpdateUser = async (userData: UserFormData) => {
  if (!selectedUser.value) return

  const success = await updateUser(selectedUser.value.id, userData)
  if (success) {
    modals.edit = false
    selectedUser.value = null
    showSuccess(t('admin.users.userUpdated'))
  } else {
    showError(error.value || t('admin.users.updateFailed'))
  }
}

const handleDeleteClick = (user: User) => {
  selectedUser.value = user
  modals.delete = true
}

const confirmDelete = async () => {
  if (!selectedUser.value) return

  const success = await deleteUser(selectedUser.value.id)
  if (success) {
    modals.delete = false
    selectedUser.value = null
    showSuccess(t('admin.users.userDeleted'))
  } else {
    showError(error.value || t('admin.users.deleteFailed'))
  }
}

const cancelDelete = () => {
  modals.delete = false
  selectedUser.value = null
}

const handlePageChange = async (page: number) => {
  await changePage(page)
}

const handleSort = async (sortBy: string, sortOrder: 'asc' | 'desc') => {
  await updateFilters({ sortBy, sortOrder })
}

const handleViewUser = (user: User) => {
  console.log('View user:', user)
}

// Extract form data from selected user
const editFormData = computed(() => selectedUser.value ? {
  name: selectedUser.value.name,
  email: selectedUser.value.email,
  phone: selectedUser.value.phone,
  avatar: selectedUser.value.avatar,
  roleId: selectedUser.value.roleId,
} : undefined)
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        {{ t('admin.users.title') }}
      </h1>
      <p class="text-gray-400">
        {{ t('admin.users.subtitle') }}
      </p>
    </div>

    <!-- Actions Bar -->
    <div class="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
      <!-- Search -->
      <div class="w-full md:w-96">
        <AdminUserSearchBar @search="handleSearch" />
      </div>

      <!-- Create Button -->
      <UIButton
        variant="primary"
        size="lg"
        @click="modals.create = true"
        icon="i-heroicons-plus"
      >
        {{ t('admin.users.createUser') }}
      </UIButton>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <!-- Users Table -->
    <div class="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <AdminUserTable
        :users="users"
        :loading="loading"
        @edit="handleEditClick"
        @delete="handleDeleteClick"
        @view="handleViewUser"
        @sort="handleSort"
      />
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="mt-6">
      <UIPagination
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        @page-change="handlePageChange"
      />
    </div>

    <UModal v-model="modals.create" class="sm:max-w-2xl">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-white mb-6">
          {{ t('admin.users.createUser') }}
        </h2>
        <AdminUserForm
          :loading="loading"
          @submit="handleCreateUser"
          @cancel="modals.create = false"
        />
      </div>
    </UModal>

    <UModal v-model="modals.edit" class="sm:max-w-2xl">
      <div class="p-6">
        <h2 class="text-2xl font-bold text-white mb-6">
          {{ t('admin.users.editUser') }}
        </h2>
        <AdminUserForm
          :initial-data="editFormData"
          :is-edit="true"
          :loading="loading"
          @submit="handleUpdateUser"
          @cancel="modals.edit = false"
        />
      </div>
    </UModal>

    <UModal v-model="modals.delete">
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="shrink-0">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-500" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white mb-2">
              {{ t('admin.users.deleteUser') }}
            </h3>
            <p class="text-gray-400 mb-1">
              {{ t('admin.users.confirmDelete') }}
            </p>
            <p class="text-sm text-gray-500 mb-4">
              {{ t('admin.users.deleteWarning') }}
            </p>
            <p v-if="selectedUser" class="text-white font-medium">
              {{ selectedUser.name }} ({{ selectedUser.email }})
            </p>
          </div>
        </div>
        <div class="flex gap-4 justify-end mt-6">
          <UIButton
            variant="ghost"
            :disabled="loading"
            @click="cancelDelete"
          >
            {{ t('common.cancel') }}
          </UIButton>
          <UIButton
            variant="primary"
            :disabled="loading"
            @click="confirmDelete"
            class="bg-red-600 hover:bg-red-700"
          >
            <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
            {{ t('common.delete') }}
          </UIButton>
        </div>
      </div>
    </UModal>
  </div>
</template>
