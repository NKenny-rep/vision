<script setup lang="ts">
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

const email = ref('')

const emit = defineEmits<{
  signup: [email: string]
}>()

const handleSignup = () => {
  if (email.value) {
    emit('signup', email.value)
  }
}
</script>

<template>
  <section 
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
    aria-labelledby="hero-heading"
  >
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-linear-to-b from-black via-black/90 to-black"/>
    
    <!-- Animated Background Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgb(249, 115, 22) 1px, transparent 0); background-size: 40px 40px;"/>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-32 text-center">
      <h1 
        id="hero-heading" 
        class="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in"
      >
        {{ title }}<br >
        and <span class="text-orange-500">{{ titleHighlight }}</span>
      </h1>
      
      <p class="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
        {{ subtitle }}
      </p>
      
      <p class="text-lg text-gray-400 mb-8">
        {{ ctaText }}
      </p>

      <!-- Email Signup Form -->
      <div class="max-w-2xl mx-auto">
        <form 
          class="flex flex-col md:flex-row gap-4 justify-center items-center" 
          role="search"
          aria-label="Sign up for VideoVision"
          @submit.prevent="handleSignup"
        >

          <UIButton 
            type="submit"
            variant="primary"
            size="xl"
            trailing-icon="i-heroicons-chevron-right"
          >
            {{ buttonText }}
          </UIButton>
        </form>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div 
      v-if="showScrollIndicator"
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
    >
      <UIcon name="i-heroicons-chevron-down" class="w-8 h-8 text-orange-500" />
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
