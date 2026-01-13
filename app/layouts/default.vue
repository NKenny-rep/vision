<template>
  <div class="min-h-screen bg-black">
    <!-- Header -->
    <SharedHeader />

    <!-- Main Content -->
    <main 
      class="transition-all duration-300"
      :class="isScrolled ? '' : 'pt-24'"
    >
      <slot />
    </main>

    <!-- Footer -->
    <SharedFooter />
  </div>
</template>

<script setup lang="ts">
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
