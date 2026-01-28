<template>
  <UDashboardNavbar>
    <template #left>
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-semibold text-primary">{{ $t('nav.dashboard') }}</h1>
        <NuxtLink 
          :to="localePath('/browse')" 
          class="text-white hover:text-primary transition-colors font-medium"
          active-class="text-primary"
        >
          {{ $t('nav.browse') }}
        </NuxtLink>
        <NuxtLink 
          :to="localePath('/movie-list')" 
          class="text-white hover:text-primary transition-colors font-medium"
          active-class="text-primary"
        >
          {{ $t('nav.myList') }}
        </NuxtLink>
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-4">
        <!-- Language Switcher -->
        <SharedLanguageSwitcher />

        <UIButton
          variant="ghost"
          icon="i-heroicons-bell"
          aria-label="Notifications"
        />
        
        <UDropdownMenu
          :items="userMenuItems"
          :content="{ align: 'end' }"
          :ui="{ content: 'w-48' }"
        >
          <UIButton
            variant="ghost"
            trailing-icon="i-heroicons-chevron-down"
          >
            <div class="flex items-center gap-2">
              <UAvatar
                :alt="user?.email || 'User'"
                size="sm"
              />
              <span class="hidden md:block">{{ user?.email || 'User' }}</span>
            </div>
          </UIButton>
        </UDropdownMenu>
      </div>
    </template>
  </UDashboardNavbar>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { user, logout } = useAuthentication()
const localePath = useLocalePath()

interface UserMenuItem {
  label: string;
  icon?: string;
  to?: string;
  type?: 'label';
  disabled?: boolean;
  onSelect?: () => void;
}

const userMenuItems: UserMenuItem[][] = [
  [{
    label: user.value?.email || t('common.user'),
    type: 'label',
    disabled: true
  }],
  [{
    label: t('nav.profile'),
    icon: 'i-heroicons-user',
    to: localePath('/profile')
  }],
  [{
    label: t('nav.signOut'),
    icon: 'i-heroicons-arrow-left-on-rectangle',
    onSelect: () => logout()
  }]
]
</script>
