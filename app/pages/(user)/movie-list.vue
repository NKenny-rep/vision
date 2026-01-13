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
    <div class="relative overflow-hidden rounded-lg">
      <!-- Background Image -->
      <NuxtImg 
        src="/images/userlist-banner.jpeg" 
        alt="Movie List Background"
        format="webp" 
        quality="80" 
        sizes="sm:100vw md:50vw lg:800px"
        class="w-full h-64 object-cover"
      />
      
      <!-- Gradient Overlay for better blending -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"/>
      
      <!-- Diffuse blur effect at edges -->
      <div class="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]"/>
      
      <!-- Content -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center px-4">
          <h1 class="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">
            {{ $t('userPanel.movieList.title') }}
          </h1>
          <p class="text-sm md:text-base text-gray-200 mt-3 font-light tracking-wide uppercase opacity-80">
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