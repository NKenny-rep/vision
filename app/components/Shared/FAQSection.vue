<script setup lang="ts">
const { t } = useI18n()

interface FAQItem {
  label: string
  content: string
}

interface Props {
  heading?: string
  items?: FAQItem[]
  showCta?: boolean
  ctaText?: string
  emailPlaceholder?: string
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  showCta: true
})

const displayHeading = computed(() => props.heading || t('landing.faq.heading'))
const displayCtaText = computed(() => props.ctaText || 'Ready to watch? Enter your email to create or restart your membership.')
const displayEmailPlaceholder = computed(() => props.emailPlaceholder || 'Email address')
const displayButtonText = computed(() => props.buttonText || 'Get Started')

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
  <section class="py-20 bg-black" aria-labelledby="faq-heading">
    <div class="container mx-auto px-4 max-w-4xl">
      <h2 id="faq-heading" class="text-4xl md:text-5xl font-bold text-white text-center mb-12">
        {{ displayHeading }}
      </h2>

      <UAccordion 
        :items="items"
        class="space-y-4"
      >
        <template #content="{ item }">
          <p class="text-gray-400 text-lg pb-3.5">{{ item.content }}</p>
        </template>
      </UAccordion>

      <!-- CTA after FAQ -->
      <div v-if="showCta" class="text-center mt-16">
        <p class="text-lg text-gray-400 mb-6">
          {{ displayCtaText }}
        </p>
        <form 
          class="flex flex-col md:flex-row gap-4 justify-center items-center max-w-2xl mx-auto" 
          @submit.prevent="handleSignup"
        >
          <div class="w-full md:flex-1">
            <UInput
              v-model="email"
              type="email"
              :placeholder="displayEmailPlaceholder"
              size="xl"
              required
              class="w-full rounded-md"
              :ui="{ 
                base: 'bg-white/10 border-gray-600 text-white placeholder-gray-400 px-4 py-4'
              }"
            />
          </div>
          <UIButton 
            type="submit"
            variant="primary"
            size="xl"
            trailing-icon="i-heroicons-chevron-right"
          >
            {{ displayButtonText }}
          </UIButton>
        </form>
      </div>
    </div>
  </section>
</template>
