import type { ColumnDef } from '@tanstack/vue-table'
import type { User } from '~/types'
import { formatDate } from '~/utils/i18nHelpers'
import { getRoleBadgeClass } from '~/utils/styling'

export const useUserTableColumns = () => {
  const { t } = useI18n()

  const columns: ColumnDef<User>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: () => t('admin.users.table.user'),
      cell: ({ row }) => {
        const user = row.original
        return h('div', { class: 'flex items-center gap-3' }, [
          user.avatar
            ? h('img', {
                src: user.avatar,
                alt: user.name,
                class: 'hidden lg:block w-10 h-10 rounded-full object-cover'
              })
            : h('div', {
                class: 'hidden lg:flex w-10 h-10 rounded-full bg-orange-500 items-center justify-center text-white font-semibold'
              }, user.name.charAt(0).toUpperCase()),
          h('div', [
            h('div', { class: 'font-medium text-white' }, user.name),
            h('div', { class: 'text-sm text-gray-400' }, `ID: ${user.id}`)
          ])
        ])
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: () => t('admin.users.table.email'),
      cell: ({ getValue }) => h('span', { class: 'text-sm text-gray-300' }, getValue() as string),
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: () => t('admin.users.table.phone'),
      cell: ({ getValue }) => h('span', { class: 'text-sm text-gray-300' }, (getValue() as string) || '-'),
    },
    {
      id: 'roleName',
      accessorKey: 'roleName',
      header: () => t('admin.users.table.role'),
      cell: ({ getValue }) => {
        const roleName = getValue() as string
        return h('span', {
          class: ['px-3 py-1 rounded-full text-xs font-medium', getRoleBadgeClass(roleName)]
        }, roleName)
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: () => t('admin.users.table.createdAt'),
      cell: ({ getValue }) => h('span', { class: 'text-sm text-gray-300' }, formatDate(getValue() as Date)),
    },
  ]

  return {
    columns
  }
}
