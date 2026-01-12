<script setup lang="ts">
import type { OMDBMovie, Review } from '~/types'

const localePath = useLocalePath();

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const route = useRoute()
const videoId = route.params.id as string
const { getMovie } = useMovies()
const { user } = useAuthentication()
const { getReviews, createReview, toggleLike } = useReviews()
const movieList = useMovieList()

// Fetch movie data
const { data: movie, pending: isLoading } = await useAsyncData(
  `movie-${videoId}`,
  async () => {
    const { data } = await getMovie(videoId, { plot: 'full' })
    return data.value
  },
  {
    server: true,
    lazy: true
  }
)

// Fetch reviews using adapter
const reviews = ref<Review[]>([])
const reviewsLoading = ref(true)

const loadReviews = async () => {
  reviewsLoading.value = true
  reviews.value = await getReviews(videoId)
  reviewsLoading.value = false
}

// Load reviews on mount
onMounted(() => {
  loadReviews()
})

const showReviewForm = ref(false)
const showTrailer = ref(false)
const trailerUrl = ref('')

const searchTrailer = () => {
  if (!movie.value) return
  
  // Generate YouTube search URL for trailer
  const searchQuery = encodeURIComponent(`${movie.value.Title} ${movie.value.Year} official trailer`)
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`
  
  // For embedding, we'll use a common pattern - most official trailers follow this format
  // In production, you'd use YouTube Data API to get actual video ID
  const videoId = `${movie.value.imdbID}-trailer` // Placeholder
  trailerUrl.value = `https://www.youtube.com/embed/${videoId}`
  
  // For now, just open YouTube search in new tab since we don't have YouTube API
  window.open(youtubeSearchUrl, '_blank')
}

const handleReviewSubmit = async (data: { rating: number; comment: string }) => {
  // Create review using adapter
  const newReview = await createReview({
    userId: user.value?.id?.toString() || 'current-user',
    userName: getUserDisplayName(user.value),
    userAvatar: getUserAvatar(user.value) || '',
    contentId: videoId,
    rating: data.rating,
    comment: data.comment
  })
  
  if (newReview) {
    reviews.value.unshift(newReview)
    showReviewForm.value = false
  }
}

const handleLike = async (reviewId: string | number) => {
  // Toggle like using adapter
  const success = await toggleLike(reviewId.toString())
  
  if (success) {
    const review = reviews.value.find(r => r.id === reviewId)
    if (review) {
      review.likes = (review.likes || 0) + 1
    }
  }
}

const getPosterUrl = (movieData: OMDBMovie | null) => {
  if (!movieData) return ''
  if (movieData.Poster && movieData.Poster !== 'N/A') {
    return movieData.Poster
  }
  return `https://placehold.co/300x450/1a1a1a/orange?text=${encodeURIComponent(movieData.Title)}`
}

// Movie list state
const isInList = ref(false)
const isTogglingList = ref(false)

const checkListStatus = async () => {
  if (!movie.value) return
  isInList.value = await movieList.isInList(movie.value.imdbID)
}

const toggleMovieList = async () => {
  if (!movie.value || isTogglingList.value) return
  
  isTogglingList.value = true
  
  try {
    await movieList.toggleInList(movie.value.imdbID, {
      movieTitle: movie.value.Title,
      moviePoster: movie.value.Poster,
      movieYear: movie.value.Year,
      movieType: movie.value.Type || 'movie',
    })
    
    isInList.value = !isInList.value
  } catch (error) {
    console.error('Failed to toggle movie list:', error)
  } finally {
    isTogglingList.value = false
  }
}

// Check list status when movie loads
watch(movie, () => {
  if (movie.value) {
    checkListStatus()
  }
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-black">
    <!-- Skeleton Loading State -->
    <MovieDetailsSkeleton v-if="isLoading" />

    <!-- Error State -->
    <div v-else-if="!movie || movie.Response === 'False'" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-white mb-2">{{ $t('watch.movieNotFound') }}</h2>
        <p class="text-gray-400 mb-6">{{ $t('watch.movieNotFoundDescription') }}</p>
        <UIButton :to="localePath('/browse')" variant="primary">
          {{ $t('watch.backToBrowse') }}
        </UIButton>
      </div>
    </div>

    <!-- Movie Content -->
    <template v-else>
      <!-- Movie Info -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <!-- Poster -->
            <div class="md:col-span-1">
              <img 
                :src="getPosterUrl(movie)" 
                :alt="movie.Title"
                class="w-full rounded-lg shadow-2xl"
              />
              
              <!-- Action Buttons - Mobile -->
              <div class="flex flex-col gap-3 mt-6 md:hidden">
                <UIButton
                  variant="primary"
                  icon="i-heroicons-film"
                  size="lg"
                  block
                  @click="searchTrailer"
                >
                  {{ $t('watch.watchTrailer') }}
                </UIButton>
                <UIButton
                  :variant="isInList ? 'primary' : 'secondary'"
                  :icon="isInList ? 'i-heroicons-check' : 'i-heroicons-plus'"
                  :loading="isTogglingList"
                  block
                  @click="toggleMovieList"
                >
                  {{ isInList ? $t('common.inMyList') : $t('watch.addToMyList') }}
                </UIButton>
                <UIButton
                  variant="secondary"
                  icon="i-heroicons-share"
                  block
                >
                  {{ $t('watch.share') }}
                </UIButton>
              </div>
            </div>

            <!-- Details -->
            <div class="md:col-span-2">
              <h1 class="text-4xl font-bold text-white mb-4">{{ movie.Title }}</h1>
              
              <div class="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                  <span>{{ movie.Year }}</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-clock" class="w-5 h-5" />
                  <span>{{ movie.Runtime }}</span>
                </div>
                <span>•</span>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-star" class="w-5 h-5 text-orange-500" />
                  <span class="text-white font-semibold">{{ movie.imdbRating }}/10</span>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-1">{{ $t('watch.genre') }}</h3>
                  <p class="text-white">{{ movie.Genre }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-1">{{ $t('watch.director') }}</h3>
                  <p class="text-white">{{ movie.Director }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-1">{{ $t('watch.cast') }}</h3>
                  <p class="text-white">{{ movie.Actors }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-1">{{ $t('watch.plot') }}</h3>
                  <p class="text-gray-300 text-lg leading-relaxed">{{ movie.Plot }}</p>
                </div>
              </div>
              
              <!-- Action Buttons - Desktop -->
              <div class="hidden md:flex flex-wrap gap-4">
                <UIButton
                  variant="primary"
                  icon="i-heroicons-film"
                  size="lg"
                  @click="searchTrailer"
                >
                  {{ $t('watch.watchTrailer') }}
                </UIButton>
                <UIButton
                  :variant="isInList ? 'primary' : 'secondary'"
                  :icon="isInList ? 'i-heroicons-check' : 'i-heroicons-plus'"
                  :loading="isTogglingList"
                  size="lg"
                  @click="toggleMovieList"
                >
                  {{ isInList ? $t('common.inMyList') : $t('watch.addToMyList') }}
                </UIButton>
                <UIButton
                  variant="secondary"
                  icon="i-heroicons-share"
                  size="lg"
                >
                  {{ $t('watch.share') }}
                </UIButton>
              </div>

              <!-- Additional Info -->
              <div class="grid grid-cols-2 gap-4 mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div>
                  <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('watch.rated') }}</p>
                  <p class="text-white font-semibold">{{ movie.Rated }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('watch.released') }}</p>
                  <p class="text-white font-semibold">{{ movie.Released }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('watch.boxOffice') }}</p>
                  <p class="text-white font-semibold">{{ movie.BoxOffice || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase mb-1">{{ $t('watch.awards') }}</p>
                  <p class="text-white font-semibold">{{ movie.Awards || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="border-t border-gray-800 pt-12">
            <h2 class="text-3xl font-bold text-white mb-8">{{ $t('watch.reviewsAndRatings') }}</h2>
            
            <!-- Review Form -->
            <div v-if="showReviewForm" class="mb-8">
              <ReviewForm 
                :content-id="videoId"
                @submit="handleReviewSubmit"
                @cancel="showReviewForm = false"
              />
            </div>

            <!-- Reviews List with Skeleton -->
            <ReviewList
              :reviews="reviews"
              :loading="reviewsLoading"
              :show-add-review="!showReviewForm"
              @add-review="showReviewForm = true"
              @like="handleLike"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
