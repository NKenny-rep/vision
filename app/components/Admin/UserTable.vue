<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  type SortingState,
  type ExpandedState,
  type Row,
  type CellContext,
  FlexRender,
} from '@tanstack/vue-table'
import type { User } from '~/types'

interface Props {
  users: readonly User[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
  sort: [sortBy: string, sortOrder: 'asc' | 'desc']
}>()

const { t } = useI18n()
const { columns } = useUserTableColumns()
const { expandedUserDetails, loadingDetails, fetchUserDetails } = useUserExpansion()

const sorting = ref<SortingState>([])
const expandedRows = ref<ExpandedState>({})
const mobileExpandedRows = ref<Record<number, boolean>>({})

// Add actions column
const tableColumns = computed(() => [
  ...columns,
  {
    id: 'actions',
    header: () => t('admin.users.table.actions'),
    cell: ({ row }: CellContext<User, unknown>) => {
      return h(resolveComponent('AdminUserTableActions'), {
        user: row.original,
        isExpanded: row.getIsExpanded(),
        onToggleExpand: () => handleToggleExpand(row.original, row),
        onEdit: (user: User) => emit('edit', user),
        onDelete: (user: User) => emit('delete', user),
      })
    },
  },
])

// Create table instance
const table = useVueTable({
  get data() {
    return props.users as User[]
  },
  get columns() {
    return tableColumns.value
  },
  state: {
    get sorting() {
      return sorting.value
    },
    get expanded() {
      return expandedRows.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    
    if (sorting.value.length > 0) {
      const sort = sorting.value[0]
      if (sort) {
        emit('sort', sort.id, sort.desc ? 'desc' : 'asc')
      }
    }
  },
  onExpandedChange: (updater) => {
    expandedRows.value = typeof updater === 'function' ? updater(expandedRows.value) : updater
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})

const handleToggleExpand = async (user: User, row: Row<User>) => {
  row.toggleExpanded()
  
  if (row.getIsExpanded()) {
    await fetchUserDetails(user.id)
  }
}

const handleMobileToggleExpand = async (userId: number) => {
  mobileExpandedRows.value[userId] = !mobileExpandedRows.value[userId]
  
  if (mobileExpandedRows.value[userId]) {
    await fetchUserDetails(userId)
  }
}
</script>

<template>
  <!-- Desktop Table View -->
  <div class="hidden md:block overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="border-b border-gray-700"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            :class="[
              header.column.getCanSort() ? 'cursor-pointer select-none hover:text-white transition-colors' : '',
              header.id === 'actions' ? 'text-right' : '',
              header.id === 'createdAt' ? 'hidden lg:table-cell' : '',
              header.id === 'roleName' ? 'hidden lg:table-cell' : ''
            ]"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
            <span v-if="header.column.getIsSorted()">
              {{ header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="tableColumns.length" class="px-3 py-4 text-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-primary mx-auto" />
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!users || users.length === 0">
          <td :colspan="tableColumns.length" class="px-3 py-4 text-center text-gray-400">
            {{ t('admin.users.table.empty') }}
          </td>
        </tr>

        <!-- User Rows -->
        <template v-for="row in table.getRowModel().rows" v-else :key="row.id">
          <tr class="hover:bg-gray-800/50 transition-colors">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="px-3 py-2 whitespace-nowrap"
              :class="[
                cell.column.id === 'actions' ? 'text-right' : '',
                cell.column.id === 'createdAt' ? 'hidden lg:table-cell' : '',
                cell.column.id === 'roleName' ? 'hidden lg:table-cell' : ''
              ]"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>

          <!-- Expanded Row Details -->
          <tr v-if="row.getIsExpanded()" class="bg-gray-800/30">
            <td :colspan="tableColumns.length" class="px-3 py-3">
              <AdminUserDetailsCard
                :user="expandedUserDetails[row.original.id] ?? null"
                :loading="loadingDetails[row.original.id]"
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>

  <!-- Mobile Card View -->
  <div class="md:hidden space-y-4 p-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 text-primary" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!users || users.length === 0" class="text-center py-8 text-gray-400">
      {{ t('admin.users.table.empty') }}
    </div>

    <!-- User Cards -->
    <template v-for="user in users" v-else :key="user.id">
      <AdminUserCard
        :user="user"
        :expanded="mobileExpandedRows[user.id]"
        :user-details="expandedUserDetails[user.id]"
        :loading="loadingDetails[user.id]"
        @toggle-expand="handleMobileToggleExpand(user.id)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </template>
  </div>
</template>
