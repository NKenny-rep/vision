<script setup lang="ts">
import { NAV_LINKS } from '~/constants'

const routes = useAppRoutes()

interface Props {
  isLoggedIn: boolean
  isAdmin: boolean
  hideAuthButtons?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideAuthButtons: false
})
// Ensure stable value during hydration

const shouldShowAuthButtons = computed(() => !props.hideAuthButtons)
</script>

<template>
  <nav class="container mx-auto px-4 py-6 flex items-center justify-between" role="navigation" aria-label="Main navigation">
    <div class="flex items-center gap-8">
      <NuxtLink 
        :to="isLoggedIn ? routes.user.browse() : routes.public.home()" 
        class="text-orange-500 font-bold text-2xl md:text-3xl hover:text-orange-400 transition-colors" 
        :aria-label="$t('common.appName')"
      >
        <span class="text-orange-500">Video</span><span class="text-white">Vision</span>
      </NuxtLink>

      <!-- Navigation Links (when logged in) -->
      <div v-if="isLoggedIn" class="hidden md:flex items-center gap-6">
        <NuxtLink 
          v-for="link in NAV_LINKS.AUTHENTICATED"
          :key="link.path"
          :to="$localePath(link.path)" 
          class="text-white hover:text-orange-500 transition-colors font-medium"
          active-class="text-orange-500"
        >
          {{ $t(link.labelKey) }}
        </NuxtLink>
      </div>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center gap-4">
      <!-- Language Switcher -->
      <SharedLanguageSwitcher />

      <!-- TEMPORARILY COMMENTED FOR DEBUGGING HYDRATION -->
      <!-- Search -->
      <SharedSearchBar v-if="isLoggedIn && shouldShowAuthButtons" />

      <!-- Auth Buttons (mutually exclusive) -->
      <!-- Not logged in -->
      <template v-if="!isLoggedIn && shouldShowAuthButtons">
        <UIButton 
          v-for="(button, index) in NAV_LINKS.GUEST"
          :key="index"
          :to="routes.auth.login()" 
          :variant="button.variant"
          :size="button.size"
          :aria-label="$t(button.ariaLabelKey)"
        >
          {{ $t(button.labelKey) }}
        </UIButton>
      </template>

      <!-- Logged in -->
      <template v-else-if="isLoggedIn && shouldShowAuthButtons">
        <ClientOnly>
          <UIButton 
            v-if="isAdmin"
            :to="routes.admin.dashboard()" 
            variant="primary"
            size="lg"
            :icon="NAV_LINKS.ADMIN.icon"
          >
            {{ $t(NAV_LINKS.ADMIN.labelKey) }}
          </UIButton>
        </ClientOnly>

        <SharedUserMenu />
      </template>
    </div>
  </nav>
</template>
