<script setup lang="ts">
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

const displayRating = computed(() => hoveredStar.value ?? props.modelValue)
const isStarFilled = (star: number): boolean => star <= displayRating.value
</script>

<template>
  <div class="flex items-center gap-2">
    <div 
      class="flex items-center gap-1"
      :class="{ 'cursor-pointer': !readonly }"
      @mouseleave="handleStarHover(null)"
    >
      <button
        v-for="star in maxStars"
        :key="star"
        type="button"
        :disabled="readonly"
        class="transition-transform hover:scale-110 disabled:cursor-default"
        :aria-label="`Rate ${star} stars`"
        @click="handleStarClick(star)"
        @mouseenter="handleStarHover(star)"
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
