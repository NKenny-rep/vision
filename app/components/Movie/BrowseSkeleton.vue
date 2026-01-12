<script setup lang="ts">
/**
 * BrowsePageSkeleton Component (Organism)
 * Skeleton loader for browse page
 */
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Hero Section Skeleton -->
    <section class="relative h-[50vh] mb-8">
      <UISkeleton class="absolute inset-0" animation="wave" />
      <div class="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent z-10"></div>
      <div class="relative z-20 container mx-auto px-4 h-full flex items-end pb-16">
        <div class="max-w-2xl space-y-4">
          <UISkeleton class="h-16 w-3/4" animation="wave" />
          <UISkeleton class="h-6 w-32" animation="wave" />
          <div class="space-y-2">
            <UISkeleton class="h-4 w-full" animation="wave" />
            <UISkeleton class="h-4 w-full" animation="wave" />
            <UISkeleton class="h-4 w-2/3" animation="wave" />
          </div>
          <div class="flex gap-4 pt-4">
            <UISkeleton class="h-12 w-32" animation="wave" />
            <UISkeleton class="h-12 w-40" animation="wave" />
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Skeleton -->
    <div class="container mx-auto px-4 py-8 space-y-12">
      <div v-for="i in 4" :key="i" class="space-y-6">
        <!-- Category Title -->
        <UISkeleton class="h-8 w-48" animation="wave" />
        
        <!-- Movie Cards Grid -->
        <div class="flex gap-4 overflow-hidden">
          <MovieCardSkeleton :count="6" size="md" />
        </div>
      </div>
    </div>
  </div>
</template>
