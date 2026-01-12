<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">{{ $t('nav.myList') }}</h1>
      
      <div v-if="!isLoggedIn" class="text-center py-12">
        <p class="text-xl mb-4">{{ $t('auth.login.title') }}</p>
        <UIButton :to="localePath('/login')" variant="primary" size="lg">
          {{ $t('nav.signIn') }}
        </UIButton>
      </div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <p class="col-span-full text-gray-400 text-center py-12">
          {{ $t('movies.noMoviesFound') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { isLoggedIn } = useAuthentication()

definePageMeta({
  layout: 'default'
})
</script>
