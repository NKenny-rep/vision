<script setup lang="ts">
import type { CreateReviewDTO } from '~/types'

interface Props {
  contentId?: string
  initialRating?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: Pick<CreateReviewDTO, 'rating' | 'comment'>]
  cancel: []
}>()

const rating = ref(props.initialRating || 0)
const comment = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => {
  return rating.value > 0 && comment.value.trim().length >= 10
})

const handleSubmit = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  
  emit('submit', {
    rating: rating.value,
    comment: comment.value.trim()
  })

  // Reset form
  rating.value = 0
  comment.value = ''
  isSubmitting.value = false
}
</script>

<template>
  <UCard class="bg-gray-900 border border-gray-800">
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-semibold text-white mb-4">Write a Review</h3>
        <p class="text-gray-400 text-sm">Share your thoughts about this content</p>
      </div>

      <UForm class="space-y-4" @submit="handleSubmit">
        <!-- Rating Input -->
        <UFormGroup label="Your Rating" required>
          <div class="flex items-center gap-4">
            <UIStarRating
              v-model="rating"
              :readonly="false"
              size="lg"
              :show-label="true"
            />
          </div>
          <template #help>
            <span v-if="rating === 0" class="text-gray-500">Click to rate</span>
            <span v-else class="text-orange-500">{{ rating }} stars selected</span>
          </template>
        </UFormGroup>

        <!-- Comment Input -->
        <UFormGroup label="Your Review" required>
          <UTextarea
            v-model="comment"
            placeholder="Tell us what you think... (minimum 10 characters)"
            :rows="5"
            :maxlength="1000"
            autoresize
          />
          <template #help>
            <div class="flex justify-between text-sm">
              <span :class="comment.length >= 10 ? 'text-green-500' : 'text-gray-500'">
                {{ comment.length >= 10 ? '✓' : '✗' }} Minimum 10 characters
              </span>
              <span class="text-gray-500">{{ comment.length }} / 1000</span>
            </div>
          </template>
        </UFormGroup>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <UIButton
            type="submit"
            variant="primary"
            :disabled="!isValid || isSubmitting"
            :loading="isSubmitting"
          >
            Submit Review
          </UIButton>
          <UIButton
            type="button"
            variant="secondary"
            :disabled="isSubmitting"
            @click="emit('cancel')"
          >
            Cancel
          </UIButton>
        </div>
      </UForm>
    </div>
  </UCard>
</template>
