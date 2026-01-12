<script setup lang="ts">
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

const _props = withDefaults(defineProps<Props>(), {
  heading: 'Choose the plan that\'s right for you',
  subheading: 'Upgrade, downgrade, or cancel anytime.',
  plans: () => [
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
        'Download capability'
      ],
      featured: true,
      buttonVariant: 'primary',
      scale: true
    },
    {
      title: 'Premium',
      subtitle: 'Best quality',
      price: 19.99,
      features: [
        '4K + HDR Resolution',
        'Watch on 4 devices',
        'Unlimited movies & TV shows',
        'Download capability',
        'Spatial audio'
      ]
    }
  ]
})
</script>

<template>
  <section class="py-20 bg-gray-900" aria-labelledby="pricing-heading">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 id="pricing-heading" class="text-4xl md:text-5xl font-bold text-white mb-4">
          {{ heading.split('you')[0] }}<span class="text-orange-500">you</span>
        </h2>
        <p class="text-xl text-gray-400">
          {{ subheading }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <SharedPricingCard
          v-for="(plan, index) in plans"
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
