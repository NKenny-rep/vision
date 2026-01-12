<script setup lang="ts">
/**
 * GenreSection Component (Molecule)
 * Displays a horizontal scrollable section of movies for a genre
 * Atomic Design: Molecule composed of heading + MovieCard molecules
 */

import type { OMDBMovie } from '~/types'

interface Props {
  title: string
  movies: OMDBMovie[]
  showAll?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAll: false,
  loading: false
})

const displayedMovies = computed(() => {
  return props.showAll ? props.movies : props.movies.slice(0, 6)
})
</script>

<template>
  <section class="space-y-4">
    <!-- Section Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
    </div>

    <!-- Movies Carousel/Grid -->
    <template v-if="loading">
      <div class="flex gap-4 overflow-x-auto pb-4">
        <MovieCardSkeleton :count="6" size="md" />
      </div>
    </template>

    <template v-else-if="displayedMovies.length === 0">
      <div class="text-gray-400 py-8">
        {{ $t('movies.noMoviesInGenre') }}
      </div>
    </template>

    <!-- Carousel for default view, Grid for show all -->
    <UCarousel
      v-else-if="!showAll"
      :items="displayedMovies"
      :ui="{
        item: 'basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 snap-start',
        container: 'gap-4 snap-x snap-mandatory',
        prev: 'start-4 sm:-start-12 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white carousel-arrow',
        next: 'end-4 sm:-end-12 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white carousel-arrow'
      }"
      arrows
      class="overflow-visible relative carousel-container"
    >
      <template #default="{ item }">
        <MovieCard
          :movie="item"
          size="md"
          class="h-full"
        />
      </template>
    </UCarousel>

    <!-- Grid for show all view -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <MovieCard
        v-for="movie in displayedMovies"
        :key="movie.imdbID"
        :movie="movie"
        size="md"
      />
    </div>
  </section>
</template>

<style scoped>
.carousel-container .carousel-arrow {
  opacity: 0;
  transition: opacity 300ms;
}

.carousel-container:hover .carousel-arrow {
  opacity: 1;
}
</style>
