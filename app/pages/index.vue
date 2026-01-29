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
const { t } = useI18n();

definePageMeta({
  layout: 'default',
  middleware: 'not-auth'
})

// Enhanced SEO Meta Tags
useSeoMeta({
  title: t('meta.title') || 'VideoVision - Stream Unlimited Movies & TV Shows',
  description: t('meta.description') || 'Watch anywhere. Cancel anytime. Join VideoVision today and enjoy unlimited streaming of movies and TV shows.',
  ogTitle: 'VideoVision - Your Ultimate Streaming Platform',
  ogDescription: 'Stream thousands of movies and TV shows. Start your free trial today!',
  ogImage: '/images/og-image.jpg',
  ogType: 'website',
  ogUrl: 'https://videovision.com',
  twitterCard: 'summary_large_image',
  twitterSite: '@videovision',
  twitterTitle: 'VideoVision - Stream Unlimited Entertainment',
  twitterDescription: 'Watch anywhere. Cancel anytime. Start streaming today!',
  twitterImage: '/images/twitter-card.jpg',
})

const handleSignup = (email: string) => {
  navigateTo(localePath(`/login?email=${encodeURIComponent(email)}`))
}
</script>
