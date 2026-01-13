<template>
  <div class="min-h-screen bg-black">
    <main 
      class="transition-all duration-300"
      :class="isScrolled ? '' : 'pt-24'"
    >
        <SharedHeader :hide-auth-buttons="true" />
        <slot />
    </main>
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
