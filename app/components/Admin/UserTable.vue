<script setup lang="ts">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  FlexRender,
} from '@tanstack/vue-table'
import type { User } from '~/types'
import { formatDate } from '~/utils/i18nHelpers'
import { getRoleBadgeClass } from '~/utils/styling'

interface Props {
  users: readonly User[]
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [user: User]
  delete: [user: User]
  view: [user: User]
  sort: [sortBy: string, sortOrder: 'asc' | 'desc']
}>()

const { t } = useI18n()
const sorting = ref<SortingState>([])

// Column definitions
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: () => t('admin.users.table.user'),
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        // Avatar or fallback with initials
        user.avatar
          ? h('img', {
              src: user.avatar,
              alt: user.name,
              class: 'w-10 h-10 rounded-full object-cover'
            })
          : h('div', {
              class: 'w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold'
            }, user.name.charAt(0).toUpperCase()),
        h('div', [
          h('div', { class: 'font-medium text-white' }, user.name),
          h('div', { class: 'text-sm text-gray-400' }, `ID: ${user.id}`)
        ])
      ])
    },
  },
  {
    accessorKey: 'email',
    header: () => t('admin.users.table.email'),
    cell: ({ getValue }) => h('span', { class: 'text-sm text-gray-300' }, getValue() as string),
  },
  {
    accessorKey: 'phone',
    header: () => t('admin.users.table.phone'),
    cell: ({ getValue }) => h('span', { class: 'text-sm text-gray-300' }, (getValue() as string) || '-'),
  },
  {
    accessorKey: 'roleName',
    header: () => t('admin.users.table.role'),
    cell: ({ getValue }) => {
      const roleName = getValue() as string
      // Apply color based on role type
      return h('span', {
        class: ['px-3 py-1 rounded-full text-xs font-medium', getRoleBadgeClass(roleName)]
      }, roleName)
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => t('admin.users.table.createdAt'),
    cell: ({ getValue }) => h('span', { class: 'text-sm text-gray-300' }, formatDate(getValue() as Date)),
  },
  {
    id: 'actions',
    header: () => t('admin.users.table.actions'),
    cell: ({ row }) => {
      const user = row.original
      // Render action buttons for each row - using template strings for better rendering
      return h('div', { class: 'flex items-center justify-end gap-2' }, [
        h('button', {
          onClick: () => emit('view', user),
          class: 'text-blue-500 hover:text-blue-400 transition-colors p-2 rounded hover:bg-blue-500/10',
          title: t('common.view'),
          innerHTML: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>'
        }),
        h('button', {
          onClick: () => emit('edit', user),
          class: 'text-orange-500 hover:text-orange-400 transition-colors p-2 rounded hover:bg-orange-500/10',
          title: t('common.edit'),
          innerHTML: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>'
        }),
        h('button', {
          onClick: () => emit('delete', user),
          class: 'text-red-500 hover:text-red-400 transition-colors p-2 rounded hover:bg-red-500/10',
          title: t('common.delete'),
          innerHTML: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>'
        })
      ])
    },
  },
]

// Create table instance
const table = useVueTable({
  get data() {
    return props.users
  },
  columns,
  state: {
    get sorting() {
      return sorting.value
    },
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    
    // Emit sort event to parent
    if (sorting.value.length > 0) {
      const sort = sorting.value[0]
      emit('sort', sort.id, sort.desc ? 'desc' : 'asc')
    }
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
</script>

<template>
  <div class="overflow-x-auto">
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
            class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
            :class="[
              header.column.getCanSort() ? 'cursor-pointer select-none hover:text-gray-200' : '',
              header.id === 'actions' ? 'text-right' : ''
            ]"
            @click="header.column.getToggleSortingHandler()?.($event)"
          >
            <div class="flex items-center gap-2" :class="header.id === 'actions' ? 'justify-end' : ''">
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <span v-if="header.column.getCanSort()" class="flex flex-col">
                <UIcon
                  name="i-heroicons-chevron-up"
                  class="w-3 h-3"
                  :class="header.column.getIsSorted() === 'asc' ? 'text-orange-500' : 'text-gray-600'"
                />
                <UIcon
                  name="i-heroicons-chevron-down"
                  class="w-3 h-3 -mt-1"
                  :class="header.column.getIsSorted() === 'desc' ? 'text-orange-500' : 'text-gray-600'"
                />
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-700">
        <!-- Loading State -->
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-6 py-8 text-center">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8 mx-auto text-orange-500" />
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-else-if="!users || users.length === 0">
          <td :colspan="columns.length" class="px-6 py-8 text-center text-gray-400">
            {{ t('admin.users.table.empty') }}
          </td>
        </tr>

        <!-- User Rows -->
        <tr
          v-else
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="hover:bg-gray-800/50 transition-colors"
        >
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            class="px-6 py-4 whitespace-nowrap"
            :class="cell.column.id === 'actions' ? 'text-right' : ''"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
