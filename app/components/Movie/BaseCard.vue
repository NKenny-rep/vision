<script setup lang="ts">
import { getPosterUrl, MOVIE_PLACEHOLDER_URL } from '~/utils/image'

interface MovieData {
  id: string;
  title: string;
  poster?: string;
  year?: string;
  type?: string;
}

interface Props {
  movie: MovieData;
  size?: 'sm' | 'md' | 'lg';
}

const _props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const localePath = useLocalePath()

const sizeClasses = {
  sm: 'h-48',
  md: 'h-60',
  lg: 'h-72'
}

// Use a reactive poster source that can be updated on error
const posterSrc = ref(getPosterUrl(_props.movie.poster))
const imageLoaded = ref(false)
const imageError = ref(false)

const handleImageError = () => {
  console.log('Image load error for:', _props.movie.title)
  imageError.value = true
  posterSrc.value = MOVIE_PLACEHOLDER_URL
}

const handleImageLoad = () => {
  imageLoaded.value = true
}
</script>

<template>
  <div class="group relative">
    <NuxtLink
      :to="localePath(`/watch/${movie.id}`)"
      class="block relative rounded-md overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10"
    >
      <NuxtImg
        :src="posterSrc"
        :alt="movie.title"
        class="w-full object-cover transition-opacity duration-300"
        :class="[sizeClasses[size], { 'opacity-0': !imageLoaded && !imageError }]"
        loading="lazy"
        width="300"
        height="450"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      
      <div class="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-3 space-y-1">
          <h4 class="text-white font-semibold text-sm line-clamp-2">
            {{ movie.title }}
          </h4>
          <div class="flex items-center gap-2 text-xs text-gray-400">
            <span v-if="movie.year">{{ movie.year }}</span>
            <span v-if="movie.type" class="capitalize">{{ movie.type }}</span>
          </div>
        </div>
        
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-12 h-12 rounded-full bg-orange-500/90 flex items-center justify-center">
            <UIcon name="i-heroicons-play-solid" class="w-6 h-6 text-white ml-0.5" />
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Action Button Slot -->
    <div class="absolute top-2 right-2 z-10">
      <slot name="action-button"/>
    </div>
  </div>
</template>
