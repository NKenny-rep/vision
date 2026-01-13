<template>
  <UDashboardSidebar>
    <template #header>
      <div class="flex items-center gap-2 px-4 py-3">
        <span class="text-orange-500 font-bold text-xl">Video</span>
        <span class="text-white font-bold text-xl">Vision</span>
      </div>
    </template>

    <div class="flex flex-col gap-1 px-2 py-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        active-class="bg-orange-500/10 text-orange-500"
      >
        <UIcon :name="link.icon" class="w-5 h-5" />
        <span>{{ t(link.label) }}</span>
      </NuxtLink>
    </div>

    <template #footer>
      <div class="p-4">
        <UIButton
          variant="soft"
          block
          icon="i-heroicons-arrow-left-on-rectangle"
          @click="handleLogout"
        >
          {{ t('nav.signOut') }}
        </UIButton>
      </div>
    </template>
  </UDashboardSidebar>
</template>

<script setup lang="ts">
const { t } = useI18n()
const routes = useAppRoutes()
const { logout } = useAuthentication()
const { user } = useUserSession()

// Dynamic links based on user role
const links = computed(() => {
  const userLinks = [
    {
      label: 'nav.userPanel',
      icon: 'i-heroicons-home',
      to: '/user-panel',
    },
    {
      label: 'nav.browse',
      icon: 'i-heroicons-film',
      to: routes.user.browse(),
    },
    {
      label: 'nav.myList',
      icon: 'i-heroicons-bookmark',
      to: routes.user.myList(),
    },
    {
      label: 'nav.profile',
      icon: 'i-heroicons-user-circle',
      to: routes.user.profile(),
    },
  ]

  const adminLinks = [
    {
      label: 'nav.admin',
      icon: 'i-heroicons-cog-6-tooth',
      to: routes.admin.dashboard(),
    },
  ]

  // Show admin links if user is admin
  if (user.value?.roleId === 2) { // Assuming 2 is admin role
    return [...adminLinks, ...userLinks]
  }

  return userLinks
})

const handleLogout = async () => {
  await logout()
}
</script>
