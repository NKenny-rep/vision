<script setup lang="ts">
import type { OMDBMovie } from '~/types'
import { BROWSE } from '~/constants'

const localePath = useLocalePath();

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const { getMovie } = useMovies()

// Fetch all movies with SSR support (Single Responsibility: data fetching)
const { data: moviesData, pending: isLoading, error } = await useAsyncData(
  'browse-movies',
  async () => {
    const results = await Promise.all(
      BROWSE.FEATURED_MOVIES.map(title => getMovie(title, { plot: BROWSE.MOVIE_PLOT_TYPE }))
    )
    
    return results
      .filter(r => r.data.value && r.data.value.Response !== 'False')
      .map(r => r.data.value!)
  },
  {
    server: true,
    lazy: true
  }
)

const movies = computed(() => moviesData.value || [])
const featuredMovie = computed(() => movies.value[0] || null)

// Organize movies by genre (Single Responsibility: genre organization)
const categories = computed(() => {
  const genreMap = new Map<string, OMDBMovie[]>()
  
  movies.value.forEach(movie => {
    if (movie.Genre) {
      const genres = movie.Genre.split(',').map(g => g.trim())
      
      genres.forEach(genre => {
        if (!genreMap.has(genre)) {
          genreMap.set(genre, [])
        }
        genreMap.get(genre)!.push(movie)
      })
    }
  })
  
  return Array.from(genreMap.entries())
    .map(([title, videos]) => ({ title, videos }))
    .sort((a, b) => b.videos.length - a.videos.length)
    .slice(0, BROWSE.MAX_GENRE_CATEGORIES)
})

// Helper: Get poster URL with fallback (Single Responsibility: image handling)
const getPosterUrl = (movie: OMDBMovie) => {
  if (movie.Poster && movie.Poster !== 'N/A') {
    return movie.Poster
  }
  return `https://placehold.co/300x450/1a1a1a/orange?text=${encodeURIComponent(movie.Title)}`
}
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Error State -->
    <div v-if="error" class="container mx-auto px-4 py-20 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
      <p class="text-gray-400 text-lg">{{ $t('errors.loadingFailed') }}</p>
    </div>

    <!-- Skeleton Loading State -->
    <MovieBrowseSkeleton v-else-if="isLoading" />

    <template v-else>
      <!-- Hero Section -->
      <section v-if="featuredMovie" class="relative h-[50vh] -mt-24">
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black z-10"></div>
        
        <img 
          :src="getPosterUrl(featuredMovie)" 
          :alt="featuredMovie.Title" 
          class="w-full h-full object-cover object-center"
        />
        
        <div class="absolute inset-0 z-20 flex items-end pb-32">
          <div class="container mx-auto px-4">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-3xl">
              {{ featuredMovie.Title }}
            </h1>
            <p class="text-base md:text-lg text-gray-200 mb-6 max-w-2xl line-clamp-3">
              {{ featuredMovie.Plot }}
            </p>
            <div class="flex flex-wrap gap-3 mb-4">
              <UIButton
                :to="localePath(`/watch/${featuredMovie.imdbID}`)"
                variant="primary"
                size="xl"
                icon="i-heroicons-play"
                :aria-label="$t('movies.playNow')"
              >
                {{ $t('movies.playNow') }}
              </UIButton>
              <UIButton
                variant="secondary"
                size="xl"
                icon="i-heroicons-information-circle"
                :aria-label="$t('movies.moreInfo')"
              >
                {{ $t('movies.moreInfo') }}
              </UIButton>
            </div>
            <div class="flex flex-wrap gap-3 text-sm text-gray-300">
              <span>{{ featuredMovie.Year }}</span>
              <span>•</span>
              <span>{{ featuredMovie.Runtime }}</span>
              <span>•</span>
              <span>{{ featuredMovie.Genre }}</span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-500" />
                {{ featuredMovie.imdbRating }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <div v-if="categories.length > 0" class="container mx-auto px-4 pb-20 space-y-12">
        <MovieGenreSection
          v-for="category in categories"
          :key="category.title"
          :title="category.title"
          :movies="category.videos"
        />
      </div>

      <!-- Empty State - only show if not loading and no data -->
      <div v-else-if="moviesData && categories.length === 0" class="text-center py-20">
        <UIcon name="i-heroicons-film" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400">{{ $t('movies.noMoviesFound') }}</p>
      </div>
    </template>
  </div>
</template>
