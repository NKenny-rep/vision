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

const handlePageChange = async (page: number) => {
  await changePage(page)
}

const handleSort = async (sortBy: string, sortOrder: 'asc' | 'desc') => {
  await updateFilters({ sortBy, sortOrder })
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
      <AdminUserSearchBar @search="handleSearch" />

      <!-- Create Button -->
      <UIButton
        variant="primary"
        size="lg"
        icon="i-heroicons-plus"
        @click="modals.create = true"
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

    <!-- Create User Modal -->
    <AdminUserFormModal
      v-model:open="modals.create"
      :title="t('admin.users.createUser')"
      :loading="loading"
      @submit="handleCreateUser"
    />

    <!-- Edit User Modal -->
    <AdminUserFormModal
      v-model:open="modals.edit"
      :title="t('admin.users.editUser')"
      :initial-data="editFormData"
      :is-edit="true"
      :loading="loading"
      @submit="handleUpdateUser"
    />

    <!-- Delete Confirmation Modal -->
    <AdminConfirmModal
      v-model:open="modals.delete"
      :title="t('admin.users.deleteUser')"
      :message="t('admin.users.confirmDelete')"
      :warning="t('admin.users.deleteWarning')"
      :user-info="selectedUser ? `${selectedUser.name} (${selectedUser.email})` : ''"
      :confirm-text="t('common.delete')"
      confirm-class="bg-red-600 hover:bg-red-700 text-white"
      :loading="loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
