<script setup lang="ts">
// Setup i18n head meta tags
const { locale, t } = useI18n();

// Update HTML lang attribute dynamically
useHead({
  htmlAttrs: {
    lang: locale
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - ${t('common.appName')}` : t('meta.title');
  }
});
</script>

<template>
   <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
