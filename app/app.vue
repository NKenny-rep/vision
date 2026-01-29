<script setup lang="ts">
const { locale, t } = useI18n();

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
