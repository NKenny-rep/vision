<script setup lang="ts">
const routes = useAppRoutes()

interface Props {
  title?: string
  titleHighlight?: string
  subtitle?: string
  ctaText?: string
  buttonText?: string
  emailPlaceholder?: string
  showScrollIndicator?: boolean
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Unlimited movies, TV shows,',
  titleHighlight: 'more',
  subtitle: 'Watch anywhere. Cancel anytime.',
  ctaText: 'Ready to watch? Enter your email to create or restart your membership.',
  buttonText: 'Get Started',
  emailPlaceholder: 'Email address',
  showScrollIndicator: true
})
</script>

<template>
  <section 
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    aria-labelledby="hero-heading"
  >
    <!-- Background Image - Optimized with scale for overflow effect -->
    <NuxtImg
      src="/images/landing1.jpg"
      alt="VideoVision streaming background"
      class="absolute inset-0 w-full h-full object-cover"
      width="1920"
      height="1080"
      quality="85"
      provider="ipx"
    />
    
    <!-- Gradient Overlay - Stronger fade at top to blend with navbar -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/70"/>
    <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40"/>

    <!-- Content -->
    <div class="relative z-20 container mx-auto px-4 py-32 text-center">
      <h1 
        id="hero-heading" 
        class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in"
      >
        {{ title }}<br >
        and <span class="text-primary">{{ titleHighlight }}</span>
      </h1>
      
      <p class="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
        {{ subtitle }}
      </p>
      
      <p class="text-lg text-gray-400 mb-8">
        {{ ctaText }}
      </p>

      <!-- Email Signup Form -->
      <div class="max-w-2xl mx-auto">
        <UIButton 
          :to="routes.auth.login()"
          variant="primary"
          size="xl"
          trailing-icon="i-heroicons-chevron-right"
        >
          {{ buttonText }}
        </UIButton>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div 
      v-if="showScrollIndicator"
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <UIcon name="i-heroicons-chevron-down" class="w-8 h-8 text-primary" />
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>
