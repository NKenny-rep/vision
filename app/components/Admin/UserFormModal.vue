<script setup lang="ts">
import type { UserFormData } from '~/types'

interface Props {
  open: boolean
  title: string
  initialData?: Partial<UserFormData>
  isEdit?: boolean
  loading?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [data: UserFormData]
}>()

const handleSubmit = (data: UserFormData) => {
  emit('submit', data)
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<template>
  <UModal :open="open" :title="title" @update:open="emit('update:open', $event)">
    <template #body>
      <AdminUserForm
        :initial-data="initialData"
        :is-edit="isEdit"
        :loading="loading"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </template>
  </UModal>
</template>
