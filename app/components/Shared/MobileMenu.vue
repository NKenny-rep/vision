<script setup lang="ts">
import { NAV_LINKS } from '~/constants'

const routes = useAppRoutes()
const { locale, locales, setLocale } = useI18n()

const isLanguageExpanded = ref(false);

const currentLanguage = computed(() => 
  (locales.value as Array<{ code: string; name: string }>).find(l => l.code === locale.value)
);

const availableLocales = computed(() => 
  (locales.value as Array<{ code: string; name: string }>).filter(l => l.code !== locale.value)
);

const languageIcons: Record<string, string> = {
  en: 'i-circle-flags-us',
  es: 'i-circle-flags-ar'
};

interface Props {
  isOpen: boolean
  isLoggedIn: boolean
  isAdmin: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  logout: []
}>()

const handleLogout = () => {
  emit('logout')
}

const switchLanguage = async (code: string) => {
  await setLocale(code as 'en' | 'es')
}

const toggleLanguage = () => {
  isLanguageExpanded.value = !isLanguageExpanded.value;
}
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0 translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-1"
  >
    <div 
      v-if="isOpen" 
      class="md:hidden bg-black/95 backdrop-blur-sm border-t border-orange-500/20"
      role="menu"
    >
      <div class="container mx-auto px-4 py-4 flex flex-col gap-3">
        <!-- Language Accordion -->
        <div class="border border-gray-700 rounded-lg overflow-hidden">
          <!-- Accordion Header -->
          <button
            class="w-full px-4 py-3 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 transition-colors"
            @click="toggleLanguage"
          >
            <div class="flex items-center gap-2">
              <UIcon :name="languageIcons[locale]" class="w-5 h-5" />
              <span class="text-sm font-medium">{{ currentLanguage?.name }}</span>
            </div>
            <UIcon 
              name="i-heroicons-chevron-down" 
              class="w-5 h-5 transition-transform duration-200"
              :class="{ 'rotate-180': isLanguageExpanded }"
            />
          </button>
          
          <!-- Accordion Content -->
          <div v-show="isLanguageExpanded" class="overflow-hidden border-t border-gray-700">
            <div class="p-2 space-y-1">
              <button
                v-for="lang in availableLocales"
                :key="lang.code"
                class="w-full px-3 py-2 flex items-center gap-2 rounded hover:bg-gray-800 transition-colors text-left"
                @click="switchLanguage(lang.code)"
              >
                <UIcon :name="languageIcons[lang.code]" class="w-5 h-5" />
                <span class="text-sm">{{ lang.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Not logged in -->
        <template v-if="!isLoggedIn">
          <UIButton 
            v-for="(button, index) in NAV_LINKS.GUEST"
            :key="index"
            :to="routes.auth.login()" 
            :variant="button.variant"
            :size="button.size"
            block
            role="menuitem"
            :aria-label="$t(button.ariaLabelKey)"
          >
            {{ $t(button.labelKey) }}
          </UIButton>
        </template>

        <!-- Logged in -->
        <template v-else>
          <UIButton 
            v-for="link in NAV_LINKS.AUTHENTICATED"
            :key="link.path"
            :to="link.path" 
            variant="ghost"
            size="lg"
            block
          >
            {{ $t(link.labelKey) }}
          </UIButton>
          
          <UIButton 
            v-if="isAdmin"
            :to="routes.admin.dashboard()" 
            variant="soft"
            size="lg"
            block
            :icon="NAV_LINKS.ADMIN.icon"
          >
            {{ $t(NAV_LINKS.ADMIN.labelKey) }}
          </UIButton>
          
          <UIButton 
            :variant="NAV_LINKS.LOGOUT.variant"
            :size="NAV_LINKS.LOGOUT.size"
            :icon="NAV_LINKS.LOGOUT.icon"
            block
            @click="handleLogout"
          >
            {{ $t(NAV_LINKS.LOGOUT.labelKey) }}
          </UIButton>
        </template>
      </div>
    </div>
  </Transition>
</template>
