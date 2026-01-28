<script setup lang="ts">
interface Props {
  active?: boolean
  label: string
}

withDefaults(defineProps<Props>(), {
  active: false
})
</script>

<template>
  <button
    :class="[
      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
      active
        ? 'bg-primary text-white'
        : 'bg-surface text-gray-400 hover:bg-surface-700 hover:text-white'
    ]"
  >
    {{ label }}
  </button>
</template>
