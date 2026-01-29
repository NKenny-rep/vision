<script setup lang="ts">
/**
 * UISkeleton Component (Atom)
 * Animated placeholder for loading states
 * 
 * Usage:
 * <UISkeleton class="h-8 w-32" /> - Custom dimensions
 * <UISkeleton variant="text" /> - Text line
 * <UISkeleton variant="card" /> - Card shape
 * <UISkeleton variant="circle" /> - Avatar/circle
 */

interface Props {
  variant?: 'default' | 'text' | 'card' | 'circle' | 'button'
  animation?: 'pulse' | 'wave' | 'none'
}

const _props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  animation: 'pulse'
})

const variantClasses = {
  default: 'rounded',
  text: 'h-4 w-full rounded',
  card: 'h-48 w-full rounded-lg',
  circle: 'rounded-full',
  button: 'h-10 w-24 rounded-md'
}

const animationClasses = {
  pulse: 'animate-pulse',
  wave: 'animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]',
  none: ''
}
</script>

<template>
  <div 
    class="bg-surface"
    :class="[
      variantClasses[variant],
      animationClasses[animation]
    ]"
  />
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
