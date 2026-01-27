<script setup lang="ts">
import type { OMDBMovie } from '~/types'
import MovieBaseCard from './BaseCard.vue'

interface Props {
  movie: OMDBMovie
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const { loggedIn } = useUserSession()
const movieList = useMovieList()

const movieData = computed(() => ({
  id: props.movie.imdbID,
  title: props.movie.Title,
  poster: props.movie.Poster,
  year: props.movie.Year,
  type: props.movie.Type,
}))

// Check if movie is in user's list
const isInList = ref(false)
const isLoading = ref(false)

const checkListStatus = async () => {
  if (!loggedIn.value) return
  isInList.value = await movieList.isInList(props.movie.imdbID)
}

// Check on mount
onMounted(() => {
  checkListStatus()
})

// Watch for login status changes
watch(loggedIn, () => {
  checkListStatus()
})

const toggleList = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    await movieList.toggleInList(props.movie.imdbID, {
      movieTitle: props.movie.Title,
      moviePoster: props.movie.Poster,
      movieYear: props.movie.Year,
      movieType: props.movie.Type,
    })
    
    isInList.value = !isInList.value
  } catch (error) {
    console.error('Failed to toggle movie list:', error)
    // Maybe show a toast notification
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <MovieBaseCard :movie="movieData" :size="size">
    <template #action-button>
      <button
        v-if="loggedIn"
        :disabled="isLoading"
        class="w-8 h-8 rounded-full bg-black/80 hover:bg-orange-500 flex-center transition-all"
        :class="{ 'opacity-50 cursor-not-allowed': isLoading, 'ring-2 ring-orange-500': isInList }"
        :title="isInList ? 'Remove from My List' : 'Add to My List'"
        @click.stop.prevent="toggleList"
      >
        <UIcon
          :name="isInList ? 'i-heroicons-check' : 'i-heroicons-plus'"
          class="w-5 h-5 text-white"
        />
      </button>
    </template>
  </MovieBaseCard>
</template>