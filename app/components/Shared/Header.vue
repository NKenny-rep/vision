<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled ? 'bg-black shadow-lg' : ''"
    :style="!isScrolled ? 'background: linear-gradient(to bottom, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 0) 100%)' : ''"
  >
    <!-- Desktop Navbar -->
    <SharedNavbar :is-logged-in="isLoggedIn" :is-admin="isAdmin" />

    <!-- Mobile Menu Button -->
    <div class="md:hidden absolute right-4 top-6">
      <UIButton 
        variant="ghost" 
        icon="i-heroicons-bars-3"
        size="lg"
        @click="isMenuOpen = !isMenuOpen"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle mobile menu"
        class="text-white"
      />
    </div>

    <!-- Mobile Navigation Menu -->
    <SharedMobileMenu 
      :is-open="isMenuOpen"
      :is-logged-in="isLoggedIn"
      :is-admin="isAdmin"
      @logout="handleLogout"
    />
  </header>
</template>

<script setup lang="ts">
/**
 * Header Component (Organism)
 * Sticky header wrapper with navbar and mobile menu
 * Atomic Design: Organism composed of Navbar and MobileMenu molecules
 */

const { isLoggedIn, isAdmin, logout } = useAuthentication()
const isMenuOpen = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const handleLogout = async () => {
  await logout()
  isMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
