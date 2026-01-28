<script setup lang="ts">
import { getPosterUrl } from '~/utils/image'
import { SEARCH } from '~/constants'

interface SearchResult {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

interface Props {
  /** Force always-open mode (for mobile) */
  alwaysOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alwaysOpen: false
})

const { searchMovies } = useMovies()
const localePath = useLocalePath()
const { showError } = useToastNotification()
const { t } = useI18n()

const isOpen = ref(props.alwaysOpen)
const query = ref('')
const results = ref<SearchResult[]>([])
const isSearching = ref(false)
const hasError = ref(false)
let searchTimeout: NodeJS.Timeout | null = null

// Watch alwaysOpen prop changes
watch(() => props.alwaysOpen, (newVal) => {
  isOpen.value = newVal
})

/**
 * Reset search state (Single Responsibility)
 */
const resetSearch = () => {
  query.value = ''
  results.value = []
  hasError.value = false
  if (searchTimeout) {
    clearTimeout(searchTimeout)
    searchTimeout = null
  }
}

/**
 * Toggle search bar visibility (only if not in alwaysOpen mode)
 */
const toggleSearch = () => {
  if (props.alwaysOpen) return
  
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      const input = document.querySelector('#movie-search-input') as HTMLInputElement
      input?.focus()
    })
  } else {
    resetSearch()
  }
}

/**
 * Navigate to full search results page
 */
const viewAllResults = () => {
  if (query.value) {
    navigateTo(localePath(`/movies?q=${encodeURIComponent(query.value)}`))
    isOpen.value = false
    resetSearch()
  }
}

/**
 * Debounced search handler (Single Responsibility: search logic)
 */
const handleSearch = async () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  if (query.value.trim().length < SEARCH.MIN_LENGTH) {
    results.value = []
    return
  }
  
  searchTimeout = setTimeout(async () => {
    isSearching.value = true
    hasError.value = false
    try {
      const { data, error } = await searchMovies({ s: query.value.trim() })
      
      if (error.value) {
        hasError.value = true
        showError(t('errors.searchFailed'))
        results.value = []
      } else {
        results.value = data.value?.Search || []
      }
    } catch (error) {
      console.error('Search error:', error)
      hasError.value = true
      showError(t('errors.searchFailed'))
      results.value = []
    } finally {
      isSearching.value = false
    }
  }, SEARCH.DEBOUNCE_MS)
}

/**
 * Navigate to selected movie
 */
const selectMovie = (movie: SearchResult) => {
  navigateTo(localePath(`/watch/${movie.imdbID}`))
  isOpen.value = false
  resetSearch()
}

// Cleanup on unmount
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>

<template>
  <div class="flex items-center" :class="alwaysOpen ? 'w-full' : ''">
    <!-- Search Input Container (expands to the left when open on desktop, full width on mobile) -->
    <div 
      class="relative overflow-hidden transition-all duration-200 ease-out"
      :style="alwaysOpen ? { width: '100%' } : { width: isOpen ? '320px' : '0px' }"
    >
      <UInput
        id="movie-search-input"
        v-model="query"
        placeholder="Search movies..."
        size="lg"
        icon="i-heroicons-magnifying-glass"
        :class="alwaysOpen ? 'w-full' : 'w-80'"
        @input="handleSearch"
        @keyup.escape="toggleSearch"
      >
        <template v-if="!alwaysOpen || query.length > 0" #trailing>
          <UIButton
            v-if="alwaysOpen && query.length > 0"
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
            aria-label="Clear search"
            @click="resetSearch"
          />
          <UIButton
            v-else-if="!alwaysOpen"
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
            aria-label="Close search"
            @click="toggleSearch"
          />
        </template>
      </UInput>
        
        <!-- Search Results Dropdown -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div 
            v-if="results.length > 0" 
            class="absolute top-full mt-2 w-full bg-gray-900 border-default rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 right-0"
          >
            <div
              v-for="movie in results"
              :key="movie.imdbID"
              class="flex-start gap-3 p-3 hover:bg-surface cursor-pointer transition-colors"
              @click="selectMovie(movie)"
            >
              <img 
                :src="getPosterUrl(movie.Poster)" 
                :alt="movie.Title"
                class="w-12 h-18 object-cover rounded"
              >
              <div class="flex-1 min-w-0">
                <p class="text-white font-semibold truncate">{{ movie.Title }}</p>
                <p class="text-muted text-sm">{{ movie.Year }} • {{ movie.Type }}</p>
              </div>
            </div>
            
            <!-- View All Results Button -->
            <div class="border-t border-default p-2">
              <UIButton
                block
                variant="ghost"
                size="sm"
                class="text-primary hover:text-primary-400"
                @click="viewAllResults"
              >
                View all results for "{{ query }}"
              </UIButton>
            </div>
          </div>
        </Transition>
        
        <!-- No Results -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div 
            v-if="query.length >= SEARCH.MIN_LENGTH && !isSearching && results.length === 0" 
            class="absolute top-full mt-2 w-full bg-gray-900 border-default rounded-lg shadow-xl p-4 z-50 right-0"
          >
            <div v-if="hasError" class="flex-center flex-col gap-2">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
              <p class="text-muted text-center text-sm">{{ t('errors.searchFailed') }}</p>
            </div>
            <p v-else class="text-muted text-center">{{ t('search.noResults') }}</p>
          </div>
        </Transition>
      </div>

    <!-- Search Icon Button (only visible in desktop mode when closed) -->
    <UIButton
      v-if="!alwaysOpen"
      variant="ghost"
      size="lg"
      icon="i-heroicons-magnifying-glass"
      aria-label="Search movies"
      @click="toggleSearch"
    />
  </div>
</template>

