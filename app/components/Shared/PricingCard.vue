<script setup lang="ts">
interface Feature {
  text: string
  icon?: string
}

interface Props {
  title: string
  subtitle: string
  price: number
  period?: string
  features: readonly (string | Feature)[]
  buttonText?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  buttonTo?: string
  featured?: boolean
  featuredLabel?: string
  scale?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  period: '/month',
  buttonText: 'Select Plan',
  buttonVariant: 'outline',
  buttonTo: '/login',
  featured: false,
  featuredLabel: 'Most Popular',
  scale: false
})

// Normalize features to always have icon property
const normalizedFeatures = computed(() => {
  return props.features.map(feature => {
    if (typeof feature === 'string') {
      return { text: feature, icon: 'i-heroicons-check-circle' }
    }
    return { icon: 'i-heroicons-check-circle', ...feature }
  })
})

// Card classes based on props
const cardClasses = computed(() => {
  const base = 'rounded-lg p-8 transition-all duration-300 relative'
  const border = props.featured 
    ? 'border-2 border-orange-500 bg-linear-to-b from-orange-500/10 to-black' 
    : 'border border-gray-800 bg-black hover:border-orange-500/50'
  const scaleClass = props.scale ? 'transform md:scale-105' : ''
  
  return `${base} ${border} ${scaleClass}`
})
</script>

<template>
  <article :class="cardClasses">
    <!-- Featured Badge -->
    <div 
      v-if="featured" 
      class="absolute -top-4 left-1/2 transform -translate-x-1/2"
    >
      <span class="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
        {{ featuredLabel }}
      </span>
    </div>

    <!-- Header -->
    <h3 class="text-2xl font-bold text-white mb-2">{{ title }}</h3>
    <p class="text-gray-400 mb-6">{{ subtitle }}</p>

    <!-- Price -->
    <div class="mb-6">
      <span class="text-4xl font-bold text-white">${{ price.toFixed(2) }}</span>
      <span class="text-gray-400">{{ period }}</span>
    </div>

    <!-- Features List -->
    <ul class="space-y-4 mb-8">
      <li 
        v-for="(feature, index) in normalizedFeatures" 
        :key="index"
        class="flex items-start gap-3"
      >
        <UIcon 
          :name="feature.icon" 
          class="w-6 h-6 text-orange-500 shrink-0 mt-0.5" 
        />
        <span class="text-gray-300">{{ feature.text }}</span>
      </li>
    </ul>

    <!-- CTA Button -->
    <UIButton 
      :to="buttonTo" 
      variant="outline" 
      block 
      size="lg"
    >
      {{ buttonText }}
    </UIButton>
  </article>
</template>
