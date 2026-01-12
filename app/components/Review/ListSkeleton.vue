<script setup lang="ts">
/**
 * ReviewListSkeleton Component (Molecule)
 * Skeleton loader for review list
 */

interface Props {
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 3
})
</script>

<template>
  <div class="space-y-4">
    <div 
      v-for="i in count" 
      :key="i"
      class="bg-gray-900 border border-gray-800 rounded-lg p-6"
    >
      <!-- User Header -->
      <div class="flex items-start gap-4 mb-4">
        <UISkeleton variant="circle" class="w-12 h-12" animation="wave" />
        <div class="flex-1 space-y-2">
          <UISkeleton class="h-4 w-32" animation="wave" />
          <UISkeleton class="h-3 w-24" animation="wave" />
        </div>
        <UISkeleton class="h-6 w-20" animation="wave" />
      </div>

      <!-- Review Content -->
      <div class="space-y-2 mb-4">
        <UISkeleton class="h-4 w-full" animation="wave" />
        <UISkeleton class="h-4 w-full" animation="wave" />
        <UISkeleton class="h-4 w-3/4" animation="wave" />
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <UISkeleton class="h-8 w-16" animation="wave" />
        <UISkeleton class="h-8 w-16" animation="wave" />
      </div>
    </div>
  </div>
</template>
