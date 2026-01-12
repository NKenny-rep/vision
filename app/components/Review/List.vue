<script setup lang="ts">
import type { Review } from '~/types'

/**
 * ReviewList Component
 * Container for multiple reviews with filtering and sorting
 */

interface Props {
  reviews: Review[]
  loading?: boolean
  showFilters?: boolean
  showAddReview?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showFilters: true,
  showAddReview: true
})

const emit = defineEmits<{
  like: [reviewId: string | number]
  reply: [reviewId: string | number]
  report: [reviewId: string | number]
  addReview: []
}>()

const sortBy = ref<'recent' | 'rating' | 'helpful' | 'oldest'>('recent')

const sortedReviews = computed(() => sortReviews(props.reviews, sortBy.value))

const averageRating = computed(() => {
  if (props.reviews.length === 0) return 0
  const sum = props.reviews.reduce((acc, review) => acc + review.rating, 0)
  return sum / props.reviews.length
})

const ratingDistribution = computed(() => {
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  props.reviews.forEach(review => {
    const rating = Math.floor(review.rating) as 1 | 2 | 3 | 4 | 5
    dist[rating]++
  })
  return dist
})
</script>

<template>
  <div class="space-y-6">
    <!-- Loading Skeleton -->
    <ReviewListSkeleton v-if="loading" :count="3" />
    
    <!-- Reviews Content -->
    <template v-else>
    <!-- Summary Section -->
    <div class="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Average Rating -->
        <div class="flex flex-col items-center md:items-start gap-4">
          <div class="text-center md:text-left">
            <div class="text-5xl font-bold text-white">{{ averageRating.toFixed(1) }}</div>
            <UIStarRating
              :model-value="averageRating"
              :readonly="true"
              size="lg"
              :show-label="false"
              class="mt-2"
            />
            <p class="text-gray-400 mt-2">Based on {{ reviews.length }} reviews</p>
          </div>
        </div>

        <!-- Rating Distribution -->
        <div class="space-y-2">
          <div 
            v-for="star in [5, 4, 3, 2, 1]" 
            :key="star"
            class="flex items-center gap-3"
          >
            <span class="text-sm text-gray-400 w-12">{{ star }} star</span>
            <div class="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-orange-500 transition-all duration-300"
                :style="{ 
                  width: `${reviews.length > 0 ? (ratingDistribution[star as 1|2|3|4|5] / reviews.length) * 100 : 0}%` 
                }"
              />
            </div>
            <span class="text-sm text-gray-400 w-8 text-right">
              {{ ratingDistribution[star as 1|2|3|4|5] }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-between gap-4 flex-wrap">
      <div v-if="showFilters" class="flex items-center gap-3">
        <span class="text-sm text-gray-400">Sort by:</span>
        <USelectMenu
          v-model="sortBy"
          :options="[
            { label: 'Most Recent', value: 'recent' },
            { label: 'Highest Rating', value: 'rating' },
            { label: 'Most Helpful', value: 'helpful' }
          ]"
          option-attribute="label"
          value-attribute="value"
          class="w-40"
        />
      </div>

      <UIButton
        v-if="showAddReview"
        variant="primary"
        icon="i-heroicons-pencil-square"
        @click="emit('addReview')"
      >
        Write a Review
      </UIButton>
    </div>

    <!-- Reviews List -->
    <div v-if="loading" class="space-y-4">
      <USkeleton v-for="i in 3" :key="i" class="h-32" />
    </div>

    <div v-else-if="sortedReviews.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">No reviews yet</h3>
      <p class="text-gray-400 mb-6">Be the first to share your thoughts!</p>
      <UIButton
        v-if="showAddReview"
        variant="primary"
        @click="emit('addReview')"
      >
        Write the First Review
      </UIButton>
    </div>

    <div v-else class="space-y-4">
      <ReviewCard
        v-for="review in sortedReviews"
        :key="review.id"
        :review="review"
        @like="emit('like', $event)"
        @reply="emit('reply', $event)"
        @report="emit('report', $event)"
      />
    </div>
    </template>
  </div>
</template>
