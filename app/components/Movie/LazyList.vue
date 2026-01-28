<script setup lang="ts">
/**
 * LazyMovieList Component (Organism)
 * Displays an infinite scroll list of movies with filtering
 * Single Responsibility: Orchestrate lazy loading UI and filter interaction
 * 
 */

import type { OMDBMovie } from '~/types'
import { BROWSE } from '~/constants'
import { LAZY_LOAD } from '~/constants/lazyLoad'

interface Props {
  initialMovies?: OMDBMovie[]
  title?: string
  /** Movies to exclude (already shown in browse page) */
  excludeMovies?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  initialMovies: () => [],
  title: 'Discover More',
  excludeMovies: () => []
})

const { t } = useI18n()
const { fetchMovie } = useMovies()
const { showError } = useToastNotification()

const { 
  activeFilter, 
  getMoviesToLoad, 
  filterMovies,
  resetFilter 
} = useMovieFilter({ excludeTitles: props.excludeMovies })

// State management
const movies = ref<OMDBMovie[]>(props.initialMovies)
const hasMore = ref(true)
const error = ref<Error | null>(null)
const loadedMovieIds = ref<Set<string>>(new Set())

const filteredMovies = computed(() => filterMovies(movies.value))

/**
 * Fetch and process movie batch
 * Single Responsibility: Data fetching and error handling
 */
const fetchMovieBatch = async (titles: string[]) => {
  const moviePromises = titles.map(title => 
    fetchMovie(title, { plot: BROWSE.MOVIE_PLOT_TYPE })
  )
  
  const results = await Promise.allSettled(moviePromises)
  
  // Separate successful and failed fetches
  const successfulMovies: OMDBMovie[] = []
  const failedCount = results.filter((result, index) => {
    if (result.status === 'fulfilled' && result.value && result.value.Response !== 'False') {
      successfulMovies.push(result.value)
      return false
    }
    if (result.status === 'rejected') {
      console.error(`Failed to fetch movie: ${titles[index]}`, result.reason)
    }
    return true
  }).length
  
  return { successfulMovies, failedCount }
}

/**
 * Load more movies
 * Single Responsibility: Coordinate loading process
 */
const loadMoreMovies = async (_page: number) => {
  const isInitialLoad = movies.value.length === 0
  
  try {
    error.value = null
    
    const { moviesToLoad, hasMoreItems } = getMoviesToLoad(LAZY_LOAD.ITEMS_PER_PAGE)
    hasMore.value = hasMoreItems
    
    if (moviesToLoad.length === 0) {
      hasMore.value = false
      return
    }
    
    const { successfulMovies, failedCount } = await fetchMovieBatch(moviesToLoad)
    
    if (successfulMovies.length === 0 && moviesToLoad.length > 0) {
      if (isInitialLoad) {
        throw new Error('Failed to load movies - API might be unavailable')
      }
      showError(t('errors.movieLoadFailed'))
      hasMore.value = false
      return
    }
    
    if (failedCount > 0 && successfulMovies.length > 0) {
      showError(t('errors.someMoviesFailed', { count: failedCount }))
    }
    
    // Filter duplicates and add new movies
    const newMovies = successfulMovies.filter(movie => {
      if (loadedMovieIds.value.has(movie.imdbID)) return false
      loadedMovieIds.value.add(movie.imdbID)
      return true
    })
    
    movies.value = [...movies.value, ...newMovies]
  } catch (e) {
    error.value = e instanceof Error ? e : new Error('Failed to load movies')
    console.error('Error loading more movies:', e)
    showError(t('errors.movieLoadFailed'))
    hasMore.value = false
  }
}

const { sentinelRef, isLoading, loadNext } = useLazyLoad(loadMoreMovies, {
  initialPage: 1,
  rootMargin: LAZY_LOAD.ROOT_MARGIN,
  threshold: LAZY_LOAD.OBSERVER_THRESHOLD,
  hasMore
})

const containerRef = ref<HTMLElement | null>(null)

/**
 * Scroll listener backup for lazy loading
 */
const handleScroll = () => {
  if (!containerRef.value || isLoading.value || !hasMore.value) return
  
  const rect = containerRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight
  
  if (rect.bottom < windowHeight + LAZY_LOAD.SCROLL_THRESHOLD) {
    loadNext()
  }
}

const handleRetry = () => {
  error.value = null
  hasMore.value = true
  loadNext()
}

const handleFilterChange = (filter: typeof activeFilter.value) => {
  activeFilter.value = filter
}

onMounted(() => {
  loadNext()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(activeFilter, () => {
  movies.value = []
  loadedMovieIds.value.clear()
  resetFilter()
  hasMore.value = true
  error.value = null
  loadNext()
})
</script>

<template>
  <section class="space-y-6 mx-16">
    <div class="space-y-4">
      <h2 class="text-2xl font-bold text-white">{{ title }}</h2>
      
      <div class="flex items-center gap-2">
        <UIFilterTab
          :active="activeFilter === 'all'"
          :label="t('common.all')"
          @click="handleFilterChange('all')"
        />
        <UIFilterTab
          :active="activeFilter === 'movie'"
          :label="t('movies.title')"
          @click="handleFilterChange('movie')"
        />
        <UIFilterTab
          :active="activeFilter === 'series'"
          :label="t('browse.series')"
          @click="handleFilterChange('series')"
        />
      </div>
    </div>

    <!-- Movies Container with Scroll Observer -->
    <div ref="containerRef" class="relative">
      <UIErrorState
        v-if="error && movies.length === 0"
        :title="t('errors.movieLoadFailed')"
        :message="t('errors.checkConnectionRetry')"
        @reload="handleRetry"
      />

      <!-- Movies Grid -->
      <div 
        v-else-if="filteredMovies.length > 0" 
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie.imdbID"
          :movie="movie"
          size="md"
        />
      </div>

      <div v-else-if="movies.length > 0 && filteredMovies.length === 0" class="text-center py-12">
        <UIcon name="i-heroicons-funnel" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p class="text-gray-400">{{ t('browse.noResultsFilter') }}</p>
      </div>

      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="flex items-center gap-3 text-gray-400">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin" />
          <span>{{ t('common.loading') }}...</span>
        </div>
      </div>

      <!-- End State -->
      <div v-if="!hasMore && !isLoading && movies.length > 0" class="text-center py-8">
        <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p class="text-gray-400">{{ t('movies.allMoviesLoaded') }}</p>
      </div>

      <!-- Sentinel Element (Intersection Observer Target) -->
      <div 
        ref="sentinelRef" 
        class="h-20 w-full"
        aria-hidden="true"
      />
    </div>
  </section>
</template>
