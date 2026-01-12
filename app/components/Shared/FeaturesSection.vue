<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  description: string
}

interface Props {
  features?: readonly Feature[]
  showHeading?: boolean
  headingText?: string
}

const props = withDefaults(defineProps<Props>(), {
  features: () => [
    {
      icon: 'i-heroicons-tv',
      title: 'Enjoy on your TV',
      description: 'Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.'
    },
    {
      icon: 'i-heroicons-arrow-down-tray',
      title: 'Download your shows',
      description: 'Save your favorites easily and always have something to watch offline.'
    },
    {
      icon: 'i-heroicons-device-phone-mobile',
      title: 'Watch everywhere',
      description: 'Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.'
    }
  ],
  showHeading: false,
  headingText: 'Features'
})
</script>

<template>
  <section class="py-20 bg-linear-to-b from-black to-gray-900" aria-labelledby="features-heading">
    <div class="container mx-auto px-4">
      <h2 
        v-if="showHeading" 
        id="features-heading" 
        class="text-4xl md:text-5xl font-bold text-white text-center mb-12"
      >
        {{ headingText }}
      </h2>
      <h2 v-else id="features-heading" class="sr-only">Features</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SharedFeatureCard
          v-for="(feature, index) in features"
          :key="index"
          :icon="feature.icon"
          :title="feature.title"
          :description="feature.description"
        />
      </div>
    </div>
  </section>
</template>
