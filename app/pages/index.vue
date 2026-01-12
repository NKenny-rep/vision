<template>
  <div>
    <!-- Hero Section -->
    <SharedLandingHero
      :title="$t('landing.hero.title')"
      :title-highlight="$t('landing.hero.titleHighlight')"
      :subtitle="$t('landing.hero.subtitle')"
      :cta-text="$t('landing.hero.ctaText')"
      :button-text="$t('landing.hero.buttonText')"
      :email-placeholder="$t('landing.hero.emailPlaceholder')"
      @signup="handleSignup"
    />

    <!-- Features Section -->
    <SharedFeaturesSection />

    <!-- Pricing Section -->
    <SharedPricingSection />

    <!-- FAQ Section -->
    <SharedFAQSection
      @signup="handleSignup"
    />
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

definePageMeta({
  layout: 'default',
  middleware: 'not-auth'
})

const handleSignup = (email: string) => {
  navigateTo(localePath(`/login?email=${encodeURIComponent(email)}`))
}
</script>
