<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
})

const { t } = useI18n()
const localePath = useLocalePath()
const { showSuccess, showError } = useToastNotification()

const { fetchMovieList, removeFromList } = useMovieList()

// Fetch user's movie list with auto-refresh on mount
const { data: listData, pending, refresh } = await fetchMovieList()

const movies = computed(() => listData.value?.items || [])
const totalMovies = computed(() => listData.value?.total || 0)

// Remove movie handler - delegates to composable
const handleRemove = async (omdbId: string) => {
  try {
    await removeFromList(omdbId)
    await refresh()
    
    showSuccess(t('userPanel.movieList.messages.removed'))
  } catch {
    showError(t('userPanel.movieList.errors.removeFailed'))
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 space-y-8">
    <!-- Header -->
    <div class="relative">
      <NuxtImg
        src="https://placehold.co/600x400/1a1a1a/orange?text=Movie+List+Background"
        alt="Movie List Background"
        class="w-full h-64 object-cover rounded-lg"
        loading="lazy"
        width="600"
        height="400"
      />
      <div class="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-3xl md:text-4xl font-bold text-white">
            {{ $t('userPanel.movieList.title') }}
          </h1>
          <p class="text-gray-300 mt-2">
            {{ totalMovies }} {{ totalMovies === 1 ? 'movie' : 'movies' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <MovieCardSkeleton v-for="i in 12" :key="i" />
    </div>

    <!-- Empty State -->
    <div v-else-if="movies.length === 0" class="text-center py-16">
      <UIcon name="i-heroicons-film" class="w-20 h-20 text-gray-600 mx-auto mb-4" />
      <h2 class="text-2xl font-semibold text-gray-400 mb-2">
        {{ $t('userPanel.movieList.empty.title') }}
      </h2>
      <p class="text-gray-500 mb-6">
        {{ $t('userPanel.movieList.empty.description') }}
      </p>
      <UIButton
        :to="localePath('/browse')"
        variant="outline"
        size="lg"
      >
        {{ $t('userPanel.movieList.empty.browseButton') }}
      </UIButton>
    </div>

    <!-- Movie Grid -->
    <div v-else class="space-y-4">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <MovieListCard
          v-for="movie in movies"
          :key="movie.omdbId"
          :item="movie"
          @remove="handleRemove"
        />
      </div>
    </div>
  </div>
</template>