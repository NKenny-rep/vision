<script setup lang="ts">
import type { OMDBSearchParams, OMDBSearchItem } from '~/types'

const localePath = useLocalePath();

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const route = useRoute()
const { searchMovies } = useMovies()

// Search & Filter State
const searchQuery = ref((route.query.q as string) || '')
const selectedType = ref<'movie' | 'series' | 'episode' | ''>('')
const selectedYear = ref('')
const currentPage = ref(1)

// Data State
const movies = ref<OMDBSearchItem[]>([])
const totalResults = ref(0)
const isLoading = ref(false)
const error = ref('')

// Perform initial search if query param exists
onMounted(() => {
  if (searchQuery.value) {
    performSearch()
  }
})

// Search function
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    error.value = 'Please enter a search term'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const params: OMDBSearchParams = {
      s: searchQuery.value,
      page: currentPage.value,
      ...(selectedType.value && { type: selectedType.value }),
      ...(selectedYear.value && { y: selectedYear.value })
    }

    const { data } = await searchMovies(params)
    
    if (data.value?.Response === 'True') {
      movies.value = data.value.Search || []
      totalResults.value = parseInt(data.value.totalResults || '0')
    } else {
      movies.value = []
      totalResults.value = 0
      error.value = data.value?.Error || 'No results found'
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message || 'Failed to search movies';
    } else {
      error.value = 'Failed to search movies';
    }
    movies.value = []
    totalResults.value = 0
  } finally {
    isLoading.value = false
  }
}

// Handle page change
const handlePageChange = (page: number) => {
  currentPage.value = page
  performSearch()
}

// Handle filter change
const handleFilterChange = () => {
  currentPage.value = 1
  performSearch()
}

// View movie details
const handleViewDetails = (imdbID: string) => {
  navigateTo(localePath(`/watch/${imdbID}`))
}

// Year options (last 50 years)
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i)
</script>

<template>
  <div class="min-h-screen bg-black py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">
          {{ $t('search.title').split(' ')[0] }} <span class="text-orange-500">{{ $t('search.titleHighlight') }}</span>
        </h1>
        <p class="text-gray-400">{{ $t('search.subtitle') }}</p>
      </div>

      <!-- Search & Filters -->
      <div class="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-6">
        <form class="space-y-4" @submit.prevent="performSearch">
          <!-- Search Input -->
          <div class="flex gap-4">
            <div class="flex-1">
              <UInput
                v-model="searchQuery"
                type="text"
                :placeholder="$t('search.searchPlaceholder')"
                size="lg"
                icon="i-heroicons-magnifying-glass"
                :ui="{ 
                  base: 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                }"
              />
            </div>
            <UIButton
              type="submit"
              variant="primary"
              size="lg"
              icon="i-heroicons-magnifying-glass"
              :loading="isLoading"
            >
              {{ $t('search.searchButton') }}
            </UIButton>
          </div>

          <!-- Filters -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                {{ $t('search.filterByType') }}
                <span class="text-xs text-gray-500">{{ $t('search.requiresSearch') }}</span>
              </label>
              <select
                v-model="selectedType"
                :disabled="!searchQuery.trim()"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                @change="handleFilterChange"
              >
                <option value="">{{ $t('search.allTypes') }}</option>
                <option value="movie">{{ $t('search.movie') }}</option>
                <option value="series">{{ $t('search.series') }}</option>
                <option value="episode">{{ $t('search.episode') }}</option>
              </select>
            </div>

            <!-- Year Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">
                {{ $t('search.filterByYear') }}
                <span class="text-xs text-gray-500">{{ $t('search.requiresSearch') }}</span>
              </label>
              <select
                v-model="selectedYear"
                :disabled="!searchQuery.trim()"
                class="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                @change="handleFilterChange"
              >
                <option value="">{{ $t('search.allYears') }}</option>
                <option v-for="year in yearOptions" :key="year" :value="year.toString()">
                  {{ year }}
                </option>
              </select>
            </div>

            <!-- Clear Filters -->
            <div class="flex items-end">
              <UIButton
                variant="outline"
                size="md"
                icon="i-heroicons-x-mark"
                block
                @click="() => { selectedType = ''; selectedYear = ''; handleFilterChange(); }"
              >
                {{ $t('search.clearFilters') }}
              </UIButton>
            </div>
          </div>
        </form>

        <!-- Error Message -->
        <div v-if="error" class="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>
      </div>

      <!-- Results Table -->
      <MovieTable
        :movies="movies"
        :loading="isLoading"
        :total-results="totalResults"
        :current-page="currentPage"
        :page-size="10"
        @page-change="handlePageChange"
        @view-details="handleViewDetails"
      />
    </div>
  </div>
</template>
