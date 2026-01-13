<script setup lang="ts">
/**
 * UserMenu Component (Molecule)
 * User dropdown menu with avatar and account actions
 * Atomic Design: Molecule composed of UIButton + UAvatar + UDropdownMenu atoms
 */

import { NAV_LINKS } from '~/constants'

const { t } = useI18n();
const localePath = useLocalePath();
const { user, logout } = useAuthentication()

const handleLogout = async () => {
  await logout()
}

const userMenuItems = computed(() => [
  {
    label: user.value?.email || t('nav.profile'),
    icon: 'i-heroicons-user-circle',
    disabled: true,
  },
  {
    label: t('nav.profile'),
    icon: 'i-heroicons-user',
    to: localePath('/profile'),
  },
  {
    label: t('nav.myList'),
    icon: 'i-heroicons-bookmark',
    to: localePath('/movie-list'),
  },
  {
    label: t(NAV_LINKS.LOGOUT.labelKey),
    icon: NAV_LINKS.LOGOUT.icon,
    onClick: handleLogout,
  },
])
</script>

<template>
  <UDropdownMenu
    :items="userMenuItems"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8
    }"
    :ui="{
      content: 'w-56'
    }"
  >
    <UIButton
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down"
      size="lg"
    >
      <div class="flex items-center gap-2">
        <UAvatar :alt="user?.email || 'User'" size="sm" />
        <span class="hidden lg:block text-white">{{ user?.email?.split('@')[0] }}</span>
      </div>
    </UIButton>
  </UDropdownMenu>
</template>
