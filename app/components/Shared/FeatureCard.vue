<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <article class="text-center p-8 rounded-lg bg-black/50 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 hover:transform hover:scale-105">
    <div class="flex justify-center mb-6">
      <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
        <UIcon :name="icon" class="w-10 h-10 text-primary" />
      </div>
    </div>
    <h3 class="text-2xl font-bold text-white mb-4">{{ title }}</h3>
    <p class="text-gray-400">
      {{ description }}
    </p>
  </article>
</template>
