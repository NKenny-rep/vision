<script setup lang="ts">
import { BROWSE } from '~/constants'
import { getPosterUrl } from '~/utils/image'

const localePath = useLocalePath();
const { t } = useI18n();

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

// SEO Meta Tags
useSeoMeta({
  title: `${t('browse.title') || 'Browse Movies & TV Shows'} - ${t('common.appName')}`,
  description: t('browse.description') || 'Discover thousands of movies and TV shows. Stream unlimited entertainment on VideoVision.',
  ogTitle: `Browse Movies - ${t('common.appName')}`,
  ogDescription: 'Explore our extensive library of movies and TV shows',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const { getMovie } = useMovies()
const { showError } = useToastNotification()
const isOmdbLimitError = ref(false)

// Helper to check for API limit errors
const hasApiLimitError = (results: Awaited<ReturnType<typeof getMovie>>[]) => {
  return results.some(r => r.error.value?.message?.includes('limit'))
}

// Helper to check if any results have errors
const hasErrors = (results: Awaited<ReturnType<typeof getMovie>>[]) => {
  return results.some(r => r.error.value != null)
}

// Helper to count errors
const getErrorCount = (results: Awaited<ReturnType<typeof getMovie>>[]) => {
  return results.filter(r => r.error.value != null).length
}

// Fetch all movies with SSR support (Single Responsibility: data fetching)
const { data: moviesData, status, error } = await useAsyncData(
  'browse-movies',
  async () => {
    const results = await Promise.all(
      BROWSE.FEATURED_MOVIES.map(title => getMovie(title, { plot: BROWSE.MOVIE_PLOT_TYPE }))
    )
    
    if (hasApiLimitError(results)) {
      isOmdbLimitError.value = true
      throw new Error('OMDB API limit reached')
    }
    
    if (hasErrors(results)) {
      const errorCount = getErrorCount(results)
      showError(t('errors.apiError', { count: errorCount }))
    }
    
    const validMovies = results
      .filter(r => r.data.value && r.data.value.Response !== 'False')
      .map(r => r.data.value!)
    
    if (validMovies.length === 0 && hasErrors(results)) {
      throw new Error('Failed to load movies')
    }
    
    return validMovies
  },
  {
    server: true,
    lazy: true
  }
)

const isLoading = computed(() => status.value === 'pending')

const movies = computed(() => moviesData.value || [])
const featuredMovie = computed(() => movies.value[0] || null)

// Get all displayed movie titles to exclude from lazy load
const displayedMovieTitles = computed(() => {
  return movies.value.map(m => m.Title)
})

// Custom categories with specific labels
const categories = computed(() => {
  const allMovies = movies.value
  if (allMovies.length === 0) return []
  
  // Helper to get a subset of movies
  const getMovies = (start: number, count: number) => 
    allMovies.slice(start, Math.min(start + count, allMovies.length))
  
  return [
    { title: 'Featured Movies', videos: getMovies(0, 10) },
    { title: 'TOP 10 Movies', videos: getMovies(0, 10).sort((a, b) => parseFloat(b.imdbRating || '0') - parseFloat(a.imdbRating || '0')).slice(0, 10) },
    { title: 'TOP 10 Series', videos: getMovies(0, 10).filter(m => m.Type === 'series').slice(0, 10) },
    { title: 'Hollywood Selection', videos: getMovies(10, 10) },
    { title: 'Asian Selection', videos: getMovies(20, 10) },
    { title: 'Latin Selection', videos: getMovies(30, 10) },
    { title: 'Oldie Goldies', videos: allMovies.filter(m => parseInt(m.Year) < 2000).slice(0, 10) }
  ].filter(cat => cat.videos.length > 0)
})
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Error State -->
    <UIErrorState 
      v-if="error" 
      :title="isOmdbLimitError ? $t('errors.omdbApiLimit') : $t('errors.loadFailed')"
      :message="isOmdbLimitError ? $t('errors.omdbApiLimitMessage') : $t('errors.tryAgain')"
      @reload="() => { isOmdbLimitError = false; refreshNuxtData('browse-movies') }"
    />

    <!-- Skeleton Loading State -->
    <MovieBrowseSkeleton v-else-if="isLoading" />

    <template v-else>
      <!-- Hero Section -->
      <section v-if="featuredMovie" class="relative h-[50vh] -mt-24">
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent z-10"/>
        <div class="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black z-10"/>
        
        <img 
          :src="getPosterUrl(featuredMovie.Poster)" 
          :alt="featuredMovie.Title" 
          class="w-full h-full object-cover object-center"
        >
        
        <div class="absolute inset-0 z-20 flex items-end pb-32">
          <div class="container mx-auto px-4">
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 max-w-3xl">
              {{ featuredMovie.Title }}
            </h1>
            <p class="text-base md:text-lg text-gray-200 mb-6 max-w-2xl line-clamp-3">
              {{ featuredMovie.Plot }}
            </p>
            <ClientOnly>
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
                  :to="localePath(`/watch/${featuredMovie.imdbID}`)"
                  variant="secondary"
                  size="xl"
                  icon="i-heroicons-information-circle"
                  :aria-label="$t('movies.moreInfo')"
                >
                  {{ $t('movies.moreInfo') }}
                </UIButton>
              </div>
            </ClientOnly>
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
      <div v-if="categories.length > 0" class="container mx-auto pb-20 space-y-12 overflow-visible">
        <MovieGenreSection
          v-for="category in categories"
          :key="category.title"
          :title="category.title"
          :movies="category.videos"
        />
      </div>

      <!-- Lazy Load Section (below genre sections) -->
      <div v-if="categories.length > 0" class="container mx-auto pb-20">
        <MovieLazyList 
          :title="$t('browse.discoverMore')"
          :exclude-movies="displayedMovieTitles"
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
