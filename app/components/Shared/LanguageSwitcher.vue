/**
 * Language Switcher Component
 * Dropdown language selector with flag icons
 */
<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
const { locale, locales, setLocale } = useI18n()

// Cookie to persist language preference
const languageCookie = useCookie('user_language', {
  maxAge: 60 * 60 * 24 * 365, // 1 year
  sameSite: 'lax'
})

const languageIcons: Record<string, string> = {
  en: 'i-circle-flags-us',
  es: 'i-circle-flags-ar'
}

// Initialize language from cookie on mount
onMounted(() => {
  if (languageCookie.value && languageCookie.value !== locale.value) {
    setLocale(languageCookie.value as 'en' | 'es')
  }
})

const switchLanguage = async (code: string) => {
  await setLocale(code as 'en' | 'es')
  languageCookie.value = code
}

const languageItems = computed(() => 
  (locales.value as LocaleObject[]).map(loc => ({
    label: loc.name,
    icon: languageIcons[loc.code] || 'i-heroicons-language',
    onSelect: () => switchLanguage(loc.code),
    class: locale.value === loc.code ? 'text-primary' : ''
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
