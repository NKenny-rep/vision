<script setup lang="ts">
import type { OMDBSearchItem } from '~/types'
import { getPosterUrl } from '~/utils/image'

interface Props {
  movies: OMDBSearchItem[]
  loading?: boolean
  totalResults?: number
  currentPage?: number
  pageSize?: number
  showPagination?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  totalResults: 0,
  currentPage: 1,
  pageSize: 10,
  showPagination: true,
  compact: false
})

const emit = defineEmits<{
  'page-change': [page: number]
  'view-details': [imdbID: string]
}>()

const totalPages = computed(() => Math.ceil(props.totalResults / props.pageSize))
const shouldShowPagination = computed(() => props.showPagination && props.totalResults > props.pageSize)

const getMovie = (row: unknown): OMDBSearchItem => row as OMDBSearchItem

const handleImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = 'https://placehold.co/100x150/1a1a1a/orange?text=No+Image'
}

const columns = computed(() => {
  const allColumns = [
    { 
      key: 'Poster', 
      label: 'Poster',
      sortable: false 
    },
    { 
      key: 'Title', 
      label: 'Title',
      sortable: true 
    }
  ]
  
  if (!props.compact) {
    allColumns.push({ 
      key: 'Type', 
      label: 'Type',
      sortable: true 
    })
  }
  
  allColumns.push({ 
    key: 'Year', 
    label: 'Year',
    sortable: true 
  })
  
  if (!props.compact) {
    allColumns.push({ 
      key: 'imdbID', 
      label: 'IMDb',
      sortable: false 
    })
  }
  
  allColumns.push({ 
    key: 'actions', 
    label: 'Actions',
    sortable: false 
  })
  
  return allColumns
})
</script>

<template>
  <div class="space-y-4">
    <!-- @vue-ignore -->
    <UTable
      :rows="movies"
      :columns="columns"
      :loading="loading"
      :empty-state="{ 
        icon: 'i-heroicons-film', 
        label: 'No movies found' 
      }"
      :ui="{
        base: 'bg-gray-900',
        divide: 'divide-surface',
        thead: 'bg-surface border-b border-gray-700',
        tbody: 'divide-y divide-surface',
        tr: 'hover:bg-surface/50 transition-colors',
        th: {
          base: 'text-left text-xs font-medium text-gray-400 uppercase',
          padding: 'px-4 py-3'
        },
        td: {
          base: 'text-sm text-gray-300',
          padding: 'px-4 py-3'
        }
      }"
    >
      <template #Poster-data="{ row }">
        <img 
          :src="getPosterUrl(getMovie(row).Poster)" 
          :alt="getMovie(row).Title"
          class="w-12 h-16 object-cover rounded"
          loading="lazy"
          @error="handleImageError"
        >
      </template>

      <template #Title-data="{ row }">
        <p class="text-sm font-medium text-white line-clamp-2">{{ getMovie(row).Title }}</p>
      </template>

      <template #Type-data="{ row }">
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full capitalize"
          :class="{
            'bg-primary/20 text-primary-400': getMovie(row).Type === 'movie',
            'bg-blue-500/20 text-blue-400': getMovie(row).Type === 'series',
            'bg-purple-500/20 text-purple-400': getMovie(row).Type === 'episode'
          }"
        >
          {{ getMovie(row).Type }}
        </span>
      </template>

      <template #imdbID-data="{ row }">
        <span class="font-mono text-gray-400">{{ getMovie(row).imdbID }}</span>
      </template>

      <template #actions-data="{ row }">
        <div class="text-right">
          <UIButton variant="ghost" size="sm" @click="emit('view-details', getMovie(row).imdbID)">
            View
          </UIButton>
        </div>
      </template>
    </UTable>

    <UIPagination
      v-if="shouldShowPagination"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-results="totalResults"
      :page-size="pageSize"
      @page-change="emit('page-change', $event)"
    />
  </div>
</template>