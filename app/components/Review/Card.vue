<script setup lang="ts">
import type { Review } from '~/types'

/**
 * ReviewCard Component
 * Displays a user review/comment with rating
 * Composition: Uses StarRating component
 */

interface Props {
  review: Review
  showActions?: boolean
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  readonly: true
})

const emit = defineEmits<{
  like: [reviewId: string | number]
  reply: [reviewId: string | number]
  report: [reviewId: string | number]
  edit: [reviewId: string | number]
  delete: [reviewId: string | number]
}>()

const formattedDate = computed(() => formatRelativeTime(props.review.createdAt))

const handleLike = () => emit('like', props.review.id)
const handleReply = () => emit('reply', props.review.id)
const handleReport = () => emit('report', props.review.id)
</script>

<template>
  <UCard class="bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors">
    <div class="space-y-4">
      <!-- Header: User info + Rating -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-3 flex-1">
          <UAvatar
            :src="review.userAvatar"
            :alt="review.userName"
            size="md"
          />
          <div class="flex-1 min-w-0">
            <h4 class="text-white font-semibold truncate">{{ review.userName }}</h4>
            <p class="text-sm text-gray-400">{{ formattedDate }}</p>
          </div>
        </div>
        
        <UIStarRating
          :model-value="review.rating"
          :readonly="true"
          size="sm"
          :show-label="false"
        />
      </div>

      <!-- Comment Text -->
      <div class="prose prose-invert max-w-none">
        <p class="text-gray-300 leading-relaxed">{{ review.comment }}</p>
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="flex items-center gap-4 pt-2 border-t border-gray-800">
        <UIButton
          variant="ghost"
          size="sm"
          :icon="review.isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'"
          @click="handleLike"
          :class="review.isLiked ? 'text-red-500' : ''"
        >
          {{ review.likes || 0 }}
        </UIButton>
        
        <UIButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-chat-bubble-left"
          @click="handleReply"
        >
          Reply
        </UIButton>

        <div class="ml-auto">
          <UDropdownMenu
            :items="[
              [{ label: 'Report', icon: 'i-heroicons-flag', click: handleReport }]
            ]"
          >
            <UIButton
              variant="ghost"
              size="sm"
              icon="i-heroicons-ellipsis-vertical"
              :aria-label="'More actions'"
            />
          </UDropdownMenu>
        </div>
      </div>
    </div>
  </UCard>
</template>
