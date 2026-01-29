<script setup lang="ts">
/**
 * UI InfoRow Component
 * Icon + label + value pattern
 */

interface Props {
  icon?: string
  label?: string
  value?: string | number
  truncate?: boolean
}

withDefaults(defineProps<Props>(), {
  truncate: false
})
</script>

<template>
  <div class="grid grid-cols-[auto_1fr] gap-3 items-start">
    <UIcon v-if="icon" :name="icon" class="w-4 h-4 text-muted mt-0.5 shrink-0" />
    <div class="min-w-0">
      <p v-if="label" class="text-xs text-muted mb-0.5">{{ label }}</p>
      <p class="text-sm text-white" :class="{ 'truncate': truncate }">
        <slot>{{ value }}</slot>
      </p>
    </div>
  </div>
</template>
