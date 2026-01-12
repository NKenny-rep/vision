/**
 * Language Switcher Component
 * Dropdown language selector with flag icons
 */
<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
const { locale, locales, setLocale } = useI18n()

const languageIcons: Record<string, string> = {
  en: 'i-circle-flags-us',
  es: 'i-circle-flags-ar'
}

const languageItems = computed(() => 
  (locales.value as LocaleObject[]).map(loc => ({
    label: loc.name,
    icon: languageIcons[loc.code] || 'i-heroicons-language',
    onSelect: () => setLocale(loc.code),
    class: locale.value === loc.code ? 'text-orange-500' : ''
  }))
)

const currentLanguage = computed(() => 
  (locales.value as LocaleObject[]).find(loc => loc.code === locale.value)
)
</script>

<template>
  <UDropdownMenu
    :items="languageItems"
    :content="{ align: 'end' }"
    :ui="{ content: 'w-40' }"
  >
    <UButton
      variant="ghost"
      color="neutral"
      :icon="languageIcons[locale] || 'i-heroicons-language'"
      trailing-icon="i-heroicons-chevron-down"
    >
      {{ currentLanguage?.name }}
    </UButton>
  </UDropdownMenu>
</template>
