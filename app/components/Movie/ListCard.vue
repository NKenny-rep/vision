<script setup lang="ts">
import type { MovieListItem } from '~/composables/useMovieList'
import MovieBaseCard from './BaseCard.vue'

interface Props {
  item: MovieListItem
  size?: 'sm' | 'md' | 'lg'
}

interface Emits {
  (e: 'remove', omdbId: string): void
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<Emits>()
const { t } = useI18n()

const movieData = computed(() => ({
  id: props.item.omdbId,
  title: props.item.title,
  poster: props.item.poster,
  year: props.item.year,
  type: props.item.type,
}))

const handleRemove = () => {
  emit('remove', props.item.omdbId)
}
</script>

<template>
  <MovieBaseCard :movie="movieData" :size="size">
    <template #action-button>
      <button
        @click.stop="handleRemove"
        class="w-8 h-8 rounded-full bg-red-600/80 hover:bg-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        :title="t('userPanel.movieList.removeButton')"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5 text-white" />
      </button>
    </template>
  </MovieBaseCard>
</template>