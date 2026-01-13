/**
 * Example Component demonstrating i18n usage
 * This shows various ways to use translations in components
 * Following Nuxt conventions and SOLID principles
 */
<script setup lang="ts">
import { formatDate, formatCurrency } from '~/utils/i18nHelpers';

const { t, locale } = useI18n();

// Example data
const movie = ref({
  title: 'Inception',
  releaseDate: new Date('2010-07-16'),
  price: 19.99,
  rating: 8.8,
  reviews: 1250
});

// Computed translations with locale reactivity
const formattedDate = computed(() => 
  formatDate(movie.value.releaseDate, locale.value)
);

const formattedPrice = computed(() => 
  formatCurrency(movie.value.price, locale.value, 'USD')
);

// Dynamic translation with parameters
const reviewsText = computed(() => 
  t('validation.minLength', { 
    field: t('reviews.title'), 
    min: movie.value.reviews 
  })
);
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- Basic translation -->
    <h1 class="text-2xl font-bold">
      {{ t('movies.title') }}
    </h1>

    <!-- Movie card example -->
    <UCard>
      <template #header>
        <h2>{{ movie.title }}</h2>
      </template>

      <div class="space-y-2">
        <!-- Translation with formatted date -->
        <p>
          <strong>{{ t('movies.releaseDate') }}:</strong>
          {{ formattedDate }}
        </p>

        <!-- Translation with formatted currency -->
        <p>
          <strong>{{ t('landing.pricing.plans.basic.price') }}:</strong>
          {{ formattedPrice }}
        </p>

        <!-- Translation with number -->
        <p>
          <strong>{{ t('movies.rating') }}:</strong>
          {{ movie.rating }}/10
        </p>

        <!-- Dynamic translation with parameters -->
        <p class="text-sm text-gray-500">
          {{ reviewsText }}
        </p>
      </div>

      <template #footer>
        <div class="flex gap-2">
          <!-- Buttons with translations -->
          <UButton :label="t('movies.play')" color="primary" />
          <UButton :label="t('movies.addToList')" variant="outline" />
          <UButton :label="t('movies.moreInfo')" variant="ghost" />
        </div>
      </template>
    </UCard>

    <!-- Language switcher -->
    <div class="flex items-center gap-2">
      <span>{{ t('userPanel.language') }}:</span>
      <SharedLanguageSwitcher />
    </div>

    <!-- Conditional rendering based on locale -->
    <UAlert 
      v-if="locale === 'es'"
      color="orange"
      :title="t('common.info')"
      description="Estás viendo el contenido en español"
    />
  </div>
</template>
