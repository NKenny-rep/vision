<script setup lang="ts">
/**
 * StarRating Component
 * A reusable star rating component that can be:
 * - Read-only (display rating)
 * - Interactive (allow user to select rating)
 */

interface Props {
  modelValue?: number
  maxStars?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  readonly?: boolean
  showLabel?: boolean
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  maxStars: 5,
  size: 'md',
  readonly: false,
  showLabel: true,
  color: 'orange'
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoveredStar = ref<number | null>(null)

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

const handleStarClick = (star: number) => {
  if (!props.readonly) {
    emit('update:modelValue', star)
  }
}

const handleStarHover = (star: number | null) => {
  if (!props.readonly) {
    hoveredStar.value = star
  }
}

const isStarFilled = (star: number): boolean => {
  const displayRating = hoveredStar.value ?? props.modelValue
  return star <= displayRating
}

const isStarHalf = (star: number): boolean => {
  const displayRating = hoveredStar.value ?? props.modelValue
  return star - 0.5 === displayRating
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div 
      class="flex items-center gap-1"
      @mouseleave="handleStarHover(null)"
      :class="{ 'cursor-pointer': !readonly }"
    >
      <button
        v-for="star in maxStars"
        :key="star"
        type="button"
        :disabled="readonly"
        @click="handleStarClick(star)"
        @mouseenter="handleStarHover(star)"
        class="transition-transform hover:scale-110 disabled:cursor-default"
        :aria-label="`Rate ${star} stars`"
      >
        <UIcon
          :name="isStarFilled(star) ? 'i-heroicons-star-solid' : 'i-heroicons-star'"
          :class="[
            sizeClasses[size],
            isStarFilled(star) ? `text-${color}-500` : 'text-gray-600'
          ]"
        />
      </button>
    </div>

    <span 
      v-if="showLabel && modelValue > 0" 
      class="text-sm font-medium"
      :class="readonly ? 'text-gray-400' : 'text-white'"
    >
      {{ modelValue.toFixed(1) }} / {{ maxStars }}
    </span>
  </div>
</template>
