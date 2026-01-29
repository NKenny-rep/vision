<script setup lang="ts">
/**
 * UI ActionButtons Component
 * Group of action buttons for admin cards
 */

interface Props {
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
  viewIcon?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  showView: false,
  showEdit: true,
  showDelete: true,
  viewIcon: 'i-heroicons-eye',
  disabled: false
})

const emit = defineEmits<{
  view: []
  edit: []
  delete: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="flex-end gap-2">
    <UIIconButton
      v-if="showView"
      :icon="viewIcon"
      variant="info"
      :title="t('common.view')"
      :disabled="disabled"
      @click="emit('view')"
    />
    <UIIconButton
      v-if="showEdit"
      icon="i-heroicons-pencil-square"
      variant="primary"
      :title="t('common.edit')"
      :disabled="disabled"
      @click="emit('edit')"
    />
    <UIIconButton
      v-if="showDelete"
      icon="i-heroicons-trash"
      variant="danger"
      :title="t('common.delete')"
      :disabled="disabled"
      @click="emit('delete')"
    />
  </div>
</template>
