<script setup lang="ts">
const { t } = useI18n()

interface PricingPlan {
  title: string
  subtitle: string
  price: number
  features: readonly string[]
  featured?: boolean
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  buttonText?: string
  scale?: boolean
}

interface Props {
  heading?: string
  subheading?: string
  plans?: readonly PricingPlan[]
}

const props = defineProps<Props>()

const displayHeading = computed(() => props.heading || t('landing.pricing.heading'))
const displaySubheading = computed(() => props.subheading || t('landing.pricing.subheading'))

// Default plans with hardcoded English text as fallback
const defaultPlans = [
  {
    title: 'Basic',
    subtitle: 'Good quality',
    price: 9.99,
    features: [
      '720p Resolution',
      'Watch on 1 device',
      'Unlimited movies & TV shows'
    ]
  },
  {
    title: 'Standard',
    subtitle: 'Great quality',
    price: 14.99,
    features: [
      '1080p Resolution',
      'Watch on 2 devices',
      'Unlimited movies & TV shows',
      'Download on 2 devices'
    ],
    featured: true,
    buttonVariant: 'primary' as const,
    scale: true
  },
  {
    title: 'Premium',
    subtitle: 'Best quality',
    price: 19.99,
    features: [
      '4K + HDR',
      'Watch on 4 devices',
      'Unlimited movies & TV shows',
      'Download on 4 devices'
    ]
  }
] as const

const displayPlans = computed(() => props.plans || defaultPlans)
</script>

<template>
  <section class="py-20 bg-gray-900" aria-labelledby="pricing-heading">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 id="pricing-heading" class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ displayHeading }}
        </h2>
        <p class="text-xl text-gray-400">
          {{ displaySubheading }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <SharedPricingCard
          v-for="(plan, index) in displayPlans"
          :key="index"
          :title="plan.title"
          :subtitle="plan.subtitle"
          :price="plan.price"
          :features="plan.features"
          :featured="plan.featured"
          :button-variant="plan.buttonVariant || 'outline'"
          :button-text="plan.buttonText"
          :scale="plan.scale"
        />
      </div>
    </div>
  </section>
</template>
