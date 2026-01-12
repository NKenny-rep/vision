<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  message: string
  warning?: string
  userInfo?: string
  confirmText?: string
  confirmClass?: string
  icon?: string
  iconColor?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  confirmClass: '',
  icon: 'i-heroicons-exclamation-triangle',
  iconColor: 'text-red-500',
  loading: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const { t } = useI18n()

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<template>
  <UModal :open="open" @update:open="emit('update:open', $event)">
    <template #body>
      <div class="flex items-start gap-4">
        <div class="shrink-0">
          <UIcon :name="icon" class="w-10 h-10" :class="iconColor" />
        </div>
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-2">
            {{ title }}
          </h3>
          <p class="text-gray-400 mb-1">{{ message }}</p>
          <p v-if="warning" class="text-sm text-gray-500 mb-4">{{ warning }}</p>
          <p v-if="userInfo" class="font-medium">{{ userInfo }}</p>
        </div>
      </div>
    </template>
      
    <template #footer>
      <div class="flex gap-3 justify-end">
        <UButton
          color="neutral"
          variant="ghost"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ t('common.cancel') }}
        </UButton>
        <UButton
          :disabled="loading"
          :class="confirmClass"
          @click="handleConfirm"
        >
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
          {{ confirmText }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
