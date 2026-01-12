<script setup lang="ts">
/**
 * MovieCardSkeleton Component (Molecule)
 * Skeleton loader for MovieCard
 */

interface Props {
  size?: 'sm' | 'md' | 'lg'
  count?: number
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'md',
  count: 1
})

const sizeClasses = {
  sm: 'w-32 h-48',
  md: 'w-40 h-60',
  lg: 'w-48 h-72'
}
</script>

<template>
  <div 
    v-for="i in count" 
    :key="i"
    class="rounded-md overflow-hidden"
    :class="sizeClasses[size]"
  >
    <UISkeleton class="w-full h-full" animation="wave" />
  </div>
</template>
