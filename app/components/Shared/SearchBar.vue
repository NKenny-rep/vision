<script setup lang="ts">
import { getPosterUrl } from '~/utils/image'
import { SEARCH } from '~/constants'
import type { OMDBSearchItem } from '~/types'

interface Props {
  alwaysOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alwaysOpen: false
})

const { searchMovies } = useMovies()
const localePath = useLocalePath()
const { t } = useI18n()

// Reactive state
const state = reactive({
  isOpen: props.alwaysOpen,
  query: '',
  results: [] as OMDBSearchItem[],
  isSearching: false,
  hasError: false
})

let searchTimeout: NodeJS.Timeout | null = null

// Sync alwaysOpen prop
watch(() => props.alwaysOpen, (val) => state.isOpen = val)

// Search state machine handlers
const searchHandlers = {
  reset: () => {
    state.query = ''
    state.results = []
    state.hasError = false
    if (searchTimeout) clearTimeout(searchTimeout)
  },
  
  toggle: () => {
    if (props.alwaysOpen) return
    state.isOpen = !state.isOpen
    
    if (state.isOpen) {
      nextTick(() => document.getElementById('movie-search-input')?.focus())
    } else {
      searchHandlers.reset()
    }
  },
  
  execute: async () => {
    if (searchTimeout) clearTimeout(searchTimeout)
    if (!props.alwaysOpen) state.isOpen = true
    
    const trimmed = state.query.trim()
    if (trimmed.length < SEARCH.MIN_LENGTH) {
      state.results = []
      state.hasError = false
      return
    }
    
    state.hasError = false
    
    searchTimeout = setTimeout(async () => {
      if (state.query.trim().length < SEARCH.MIN_LENGTH) return
      
      state.isSearching = true
      const { data, error, status } = await searchMovies({ s: state.query.trim() })
      
      state.results = (status === 'success' && data) ? data : []
      state.hasError = status === 'empty' || !!error
      state.isSearching = false
    }, SEARCH.DEBOUNCE_MS)
  }
}

// Navigation handlers
const navigate = {
  toMovie: (movie: OMDBSearchItem) => {
    navigateTo(localePath(`/watch/${movie.imdbID}`))
    state.isOpen = false
    searchHandlers.reset()
  },
  
  toResults: () => {
    if (!state.query) return
    navigateTo(localePath(`/movies?q=${encodeURIComponent(state.query)}`))
    state.isOpen = false
    searchHandlers.reset()
  }
}

// Computed properties
const shouldShowResults = computed(() => 
  state.query.length >= SEARCH.MIN_LENGTH && (state.results.length > 0 || state.hasError)
)

const hasInputError = computed(() => 
  state.hasError && state.query.length >= SEARCH.MIN_LENGTH && !state.isSearching && state.results.length === 0
)

// Computed classes
const containerClass = computed(() => 
  props.alwaysOpen ? 'relative w-full' : 'search-container'
)

const inputClass = computed(() => [
  props.alwaysOpen ? 'w-full' : 'w-full @[900px]:w-45 lg:w-70',
  { 'border border-red-500': hasInputError.value }
])

const trailingAction = computed(() => 
  props.alwaysOpen ? searchHandlers.reset : searchHandlers.toggle
)

onUnmounted(() => searchTimeout && clearTimeout(searchTimeout))

defineExpose({
  state,
  searchHandlers,
  navigate
})

</script>

<template>
  <div class="flex items-center relative" :class="{ 'w-full': alwaysOpen }">
    <UIButton
      v-if="!alwaysOpen"
      variant="ghost"
      size="lg"
      icon="i-heroicons-magnifying-glass"
      aria-label="Search movies"
      @click="searchHandlers.toggle"
    />
    
    <div v-if="alwaysOpen || state.isOpen" class="transition-all duration-200 ease-out" :class="containerClass">
      <UInput
        id="movie-search-input"
        v-model="state.query"
        :placeholder="t('search.placeholder')"
        size="lg"
        icon="i-heroicons-magnifying-glass"
        :class="inputClass"
        @input="searchHandlers.execute"
        @keyup.escape="searchHandlers.toggle"
      >
        <template v-if="(alwaysOpen && state.query) || !alwaysOpen" #trailing>
          <UIButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-x-mark"
            :aria-label="alwaysOpen ? 'Clear search' : 'Close search'"
            @click="trailingAction"
          />
        </template>
      </UInput>
        
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="shouldShowResults" class="search-dropdown">
          <UTooltip
            v-for="movie in state.results"
            :key="movie.imdbID"
            :text="movie.Title"
            :popper="{ placement: 'top' }"
            :ui="{ 
              content: 'bg-primary text-white ring-1 ring-primary shadow-lg'
            }"
          >
            <button
              type="button"
              class="search-item w-full text-left"
              @click="navigate.toMovie(movie)"
            >
              <img :src="getPosterUrl(movie.Poster)" :alt="movie.Title" class="search-poster">
              <div class="flex-1 min-w-0 flex items-center justify-between gap-3">
                <p class="text-white font-semibold truncate">{{ movie.Title }}</p>
                <p class="text-muted text-sm whitespace-nowrap shrink-0">{{ movie.Year }} • {{ movie.Type }}</p>
              </div>
            </button>
          </UTooltip>
          
          <div v-if="state.hasError && !state.results.length" class="flex-center flex-col gap-2 p-6">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-500" />
            <p class="text-red-500 text-center text-sm">{{ t('search.noResults') }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

