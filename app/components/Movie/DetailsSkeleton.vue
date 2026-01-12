<script setup lang="ts">
/**
 * MovieDetailsSkeleton Component (Organism)
 * Skeleton loader for movie details page
 */
</script>

<template>
  <div class="min-h-screen bg-black">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Movie Info Skeleton -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <!-- Poster Skeleton -->
          <div class="md:col-span-1">
            <UISkeleton class="w-full aspect-2/3 rounded-lg" animation="wave" />
          </div>

          <!-- Details Skeleton -->
          <div class="md:col-span-2 space-y-6">
            <!-- Title -->
            <UISkeleton class="h-12 w-3/4" animation="wave" />
            
            <!-- Meta info -->
            <div class="flex flex-wrap gap-4">
              <UISkeleton class="h-6 w-20" animation="wave" />
              <UISkeleton class="h-6 w-24" animation="wave" />
              <UISkeleton class="h-6 w-16" animation="wave" />
            </div>

            <!-- Rating -->
            <div class="flex items-center gap-4">
              <UISkeleton class="h-8 w-32" animation="wave" />
              <UISkeleton class="h-8 w-24" animation="wave" />
            </div>

            <!-- Plot -->
            <div class="space-y-2">
              <UISkeleton class="h-4 w-full" animation="wave" />
              <UISkeleton class="h-4 w-full" animation="wave" />
              <UISkeleton class="h-4 w-3/4" animation="wave" />
            </div>

            <!-- Additional Info -->
            <div class="space-y-4">
              <div class="flex gap-2">
                <UISkeleton class="h-5 w-20" animation="wave" />
                <UISkeleton class="h-5 w-48" animation="wave" />
              </div>
              <div class="flex gap-2">
                <UISkeleton class="h-5 w-20" animation="wave" />
                <UISkeleton class="h-5 w-56" animation="wave" />
              </div>
              <div class="flex gap-2">
                <UISkeleton class="h-5 w-20" animation="wave" />
                <UISkeleton class="h-5 w-40" animation="wave" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4">
              <UISkeleton class="h-12 w-32" animation="wave" />
              <UISkeleton class="h-12 w-40" animation="wave" />
            </div>
          </div>
        </div>

        <!-- Reviews Section Skeleton -->
        <div class="space-y-6">
          <UISkeleton class="h-10 w-48" animation="wave" />
          
          <!-- Review Cards -->
          <div class="space-y-4">
            <div 
              v-for="i in 3" 
              :key="i"
              class="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4"
            >
              <!-- User info -->
              <div class="flex items-center gap-3">
                <UISkeleton variant="circle" class="w-12 h-12" animation="wave" />
                <div class="flex-1 space-y-2">
                  <UISkeleton class="h-4 w-32" animation="wave" />
                  <UISkeleton class="h-3 w-24" animation="wave" />
                </div>
              </div>
              
              <!-- Review content -->
              <div class="space-y-2">
                <UISkeleton class="h-4 w-full" animation="wave" />
                <UISkeleton class="h-4 w-full" animation="wave" />
                <UISkeleton class="h-4 w-2/3" animation="wave" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
