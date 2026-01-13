<script setup lang="ts">
/**
 * SearchBar Component (Molecule)
 * Movie search with expandable input and results dropdown
 */

interface SearchResult {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

const { searchMovies } = useMovies()
const localePath = useLocalePath()

const isOpen = ref(false)
const query = ref('')
const results = ref<SearchResult[]>([])
const isSearching = ref(false)

const toggleSearch = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      const input = document.querySelector('#movie-search-input') as HTMLInputElement
      input?.focus()
    })
  } else {
    query.value = ''
    results.value = []
  }
}

const viewAllResults = () => {
  if (query.value) {
    navigateTo(localePath(`/movies?q=${encodeURIComponent(query.value)}`))
    isOpen.value = false
    query.value = ''
    results.value = []
  }
}

const handleSearch = async () => {
  if (query.value.trim().length < 3) {
    results.value = []
    return
  }
  
  isSearching.value = true
  try {
    const { data } = await searchMovies({ s: query.value.trim() })
    results.value = data.value?.Search || []
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  } finally {
    isSearching.value = false
  }
}

const selectMovie = (movie: SearchResult) => {
  navigateTo(localePath(`/watch/${movie.imdbID}`))
  isOpen.value = false
  query.value = ''
  results.value = []
}

const getPosterUrl = (poster: string) => {
  return poster !== 'N/A' 
    ? poster 
    : 'https://placehold.co/50x75/1a1a1a/orange?text=No+Image'
}
</script>

<template>
  <div class="relative flex items-center">
    <!-- Search Input (appears when open) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="absolute right-0 top-1/2 -translate-y-1/2" style="width: 300px;">
        <UInput
          id="movie-search-input"
          v-model="query"
          placeholder="Search movies..."
          size="lg"
          icon="i-heroicons-magnifying-glass"
          :trailing="true"
          @input="handleSearch"
          @keyup.escape="toggleSearch"
        >
          <template #trailing>
            <UIButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              aria-label="Close search"
              @click="toggleSearch"
            />
          </template>
        </UInput>
        
        <!-- Search Results Dropdown -->
        <div 
          v-if="results.length > 0" 
          class="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
        >
          <div
            v-for="movie in results"
            :key="movie.imdbID"
            class="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition-colors"
            @click="selectMovie(movie)"
          >
            <img 
              :src="getPosterUrl(movie.Poster)" 
              :alt="movie.Title"
              class="w-12 h-18 object-cover rounded"
            >
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold truncate">{{ movie.Title }}</p>
              <p class="text-gray-400 text-sm">{{ movie.Year }} • {{ movie.Type }}</p>
            </div>
          </div>
          
          <!-- View All Results Button -->
          <div class="border-t border-gray-800 p-2">
            <UIButton
              block
              variant="ghost"
              size="sm"
              class="text-orange-500 hover:text-orange-400"
              @click="viewAllResults"
            >
              View all results for "{{ query }}"
            </UIButton>
          </div>
        </div>
        
        <!-- No Results -->
        <div 
          v-else-if="query.length >= 2 && !isSearching && results.length === 0" 
          class="absolute top-full mt-2 w-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-4 z-50"
        >
          <p class="text-gray-400 text-center">No movies found</p>
        </div>
      </div>
    </Transition>
    
    <!-- Search Icon Button (appears when closed) -->
    <UIButton
      v-if="!isOpen"
      variant="ghost"
      size="lg"
      icon="i-heroicons-magnifying-glass"
      aria-label="Search movies"
      @click="toggleSearch"
    />
  </div>
</template>
