/**
 * i18n Configuration
 * Centralized configuration for vue-i18n
 * Following SOLID principles - Single Responsibility
 */

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {},
  // Use string interpolation for dynamic values
  // Example: $t('validation.required', { field: 'Email' })
  missingWarn: false,
  fallbackWarn: false,
}))
