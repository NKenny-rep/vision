<script setup lang="ts">
/**
 * UI IconButton Component
 * Standardized icon button with variants
 */

interface Props {
  icon: string
  variant?: 'primary' | 'danger' | 'info'
  title?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = {
  primary: 'icon-btn-primary',
  danger: 'icon-btn-danger',
  info: 'text-blue-500 hover:bg-blue-500/10'
}

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    type="button"
    :title="title"
    :disabled="disabled"
    :class="['icon-btn', variantClasses[variant], 'transition-colors']"
    @click="handleClick"
  >
    <UIcon :name="icon" class="w-5 h-5" />
  </button>
</template>
