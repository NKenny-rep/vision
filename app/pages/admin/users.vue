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

// Modal state
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
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
    showCreateModal.value = false
    showSuccess(t('admin.users.userCreated'))
  } else {
    showError(error.value || t('admin.users.createFailed'))
  }
}

const handleEditClick = (user: User) => {
  selectedUser.value = user
  showEditModal.value = true
}

const handleUpdateUser = async (userData: UserFormData) => {
  if (!selectedUser.value) return

  const success = await updateUser(selectedUser.value.id, userData)
  if (success) {
    showEditModal.value = false
    selectedUser.value = null
    showSuccess(t('admin.users.userUpdated'))
  } else {
    showError(error.value || t('admin.users.updateFailed'))
  }
}

const handleDeleteClick = (user: User) => {
  selectedUser.value = user
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedUser.value) return

  const success = await deleteUser(selectedUser.value.id)
  if (success) {
    showDeleteModal.value = false
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

const deleteUserInfo = computed(() => 
  selectedUser.value ? `${selectedUser.value.name} (${selectedUser.value.email})` : ''
)
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
      <div class="w-full md:w-96">
        <AdminUserSearchBar @search="handleSearch" />
      </div>
      <UIButton
        variant="primary"
        size="lg"
        icon="i-heroicons-plus"
        @click="showCreateModal = true"
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

    <!-- Form Modal (Create/Edit) -->
    <AdminUserFormModal
      v-model:open="showCreateModal"
      :title="t('admin.users.createUser')"
      :loading="loading"
      @submit="handleCreateUser"
    />

    <AdminUserFormModal
      v-model:open="showEditModal"
      :title="t('admin.users.editUser')"
      :initial-data="editFormData"
      :is-edit="true"
      :loading="loading"
      @submit="handleUpdateUser"
    />

    <!-- Confirmation Modal (Delete) -->
    <AdminConfirmModal
      v-model:open="showDeleteModal"
      :title="t('admin.users.deleteUser')"
      :message="t('admin.users.confirmDelete')"
      :warning="t('admin.users.deleteWarning')"
      :user-info="deleteUserInfo"
      :confirm-text="t('common.delete')"
      confirm-class="bg-red-600 hover:bg-red-700"
      :loading="loading"
      @confirm="confirmDelete"
    />
  </div>
</template>
