<script setup lang="ts">
import type { User } from '~/types'

interface Props {
  user: User
  isExpanded: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  toggleExpand: []
  edit: [user: User]
  delete: [user: User]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-end gap-2">
    <button
      type="button"
      :title="isExpanded ? t('common.hide') : t('common.view')"
      class="text-blue-500 hover:text-blue-400 transition-colors p-2 rounded hover:bg-blue-500/10"
      @click.stop="emit('toggleExpand')"
    >
      <UIcon
        :name="isExpanded ? 'i-heroicons-chevron-up' : 'i-heroicons-eye'"
        class="w-5 h-5"
      />
    </button>
    <button
      type="button"
      :title="t('common.edit')"
      class="text-orange-500 hover:text-orange-400 transition-colors p-2 rounded hover:bg-orange-500/10"
      @click.stop="emit('edit', user)"
    >
      <UIcon name="i-heroicons-pencil-square" class="w-5 h-5" />
    </button>
    <button
      type="button"
      :title="t('common.delete')"
      class="text-red-500 hover:text-red-400 transition-colors p-2 rounded hover:bg-red-500/10"
      @click.stop="emit('delete', user)"
    >
      <UIcon name="i-heroicons-trash" class="w-5 h-5" />
    </button>
  </div>
</template>
