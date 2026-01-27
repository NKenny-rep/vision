<script setup lang="ts">
/**
 * UI Avatar Component
 * Displays user avatar with automatic fallback to initials
 */

interface Props {
  src?: string | null
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  alt: 'Avatar'
})

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-lg'
}

const initials = computed(() => {
  if (!props.name) return '?'
  const names = props.name.trim().split(' ').filter(n => n.length > 0)
  if (names.length >= 2) {
    const first = names[0]
    const last = names[names.length - 1]
    return (first?.charAt(0) || '').toUpperCase() + (last?.charAt(0) || '').toUpperCase()
  }
  return props.name.charAt(0).toUpperCase()
})

const showFallback = ref(false)
const handleError = () => {
  showFallback.value = true
}
</script>

<template>
  <div :class="['flex-center shrink-0 overflow-hidden rounded-full', sizeClasses[size]]">
    <img
      v-if="src && !showFallback"
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="handleError"
    >
    <div v-else class="w-full h-full bg-orange-500 flex-center text-white font-semibold">
      {{ initials }}
    </div>
  </div>
</template>
