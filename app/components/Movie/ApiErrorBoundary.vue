<script setup lang="ts">
/**
 * ApiErrorBoundary Component
 * 
 * Centralized error boundary for OMDB API errors
 * Automatically displays error state when API limit is reached
 * Follows Single Responsibility Principle - only handles API error display
 */

interface Props {
  onReload?: () => void
}

const props = defineProps<Props>()

const { t } = useI18n()
const { apiLimitError, apiLimitMessage, clearApiError } = useMovies()

const handleReload = () => {
  clearApiError()
  if (props.onReload) {
    props.onReload()
  }
}
</script>

<template>
  <div>
    <!-- Show error state when API limit is reached -->
    <UIErrorState 
      v-if="apiLimitError" 
      :title="t('errors.apiLimitReached')"
      :message="apiLimitMessage || t('errors.apiLimitMessage')"
      @reload="handleReload"
    />
    
    <!-- Render slot content when no API error -->
    <slot v-else />
  </div>
</template>
