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

const { t } = useI18n()
const rating = ref(props.initialRating || 0)
const comment = ref('')
const isSubmitting = ref(false)

const isValid = computed(() => rating.value > 0 && comment.value.trim().length >= 10)

const handleSubmit = async () => {
  if (!isValid.value) return

  isSubmitting.value = true
  
  emit('submit', {
    rating: rating.value,
    comment: comment.value.trim()
  })

  rating.value = 0
  comment.value = ''
  isSubmitting.value = false
}
</script>

<template>
  <UCard class="bg-gray-900 border border-gray-800">
    <div class="space-y-6">
      <div>
        <h3 class="text-xl font-semibold text-white mb-4">{{ t('reviews.writeReview') }}</h3>
        <p class="text-gray-400 text-sm">{{ t('reviews.shareYourThoughts') }}</p>
      </div>

      <UForm class="space-y-4" @submit="handleSubmit">
        <UFormField :label="t('reviews.yourRating')" required>
          <div class="flex items-center gap-4">
            <UIStarRating
              v-model="rating"
              :readonly="false"
              size="lg"
              :show-label="true"
            />
          </div>
          <template #help>
            <span v-if="rating === 0" class="text-gray-500">{{ t('reviews.clickToRate') }}</span>
            <span v-else class="text-orange-500">{{ t('reviews.starsSelected', { count: rating }) }}</span>
          </template>
        </UFormField>

        <UFormField :label="t('reviews.yourReview')" required>
          <UTextarea
            v-model="comment"
            :placeholder="t('reviews.tellUsWhatYouThink')"
            :rows="5"
            :maxlength="1000"
            autoresize
          />
          <template #help>
            <div class="flex justify-between text-sm">
              <span :class="comment.length >= 10 ? 'text-green-500' : 'text-gray-500'">
                {{ comment.length >= 10 ? '✓' : '✗' }} {{ t('reviews.minimumCharacters') }}
              </span>
              <span class="text-gray-500">{{ comment.length }} / 1000</span>
            </div>
          </template>
        </UFormField>

        <div class="flex gap-3 pt-4">
          <UIButton
            type="submit"
            variant="primary"
            :disabled="!isValid || isSubmitting"
            :loading="isSubmitting"
          >
            {{ t('reviews.submitReview') }}
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
