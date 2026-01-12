<script setup lang="ts">
import { AVATAR_STYLES } from '~/constants'

interface Props {
  currentAvatar: string
  userName: string
}

interface Emits {
  (e: 'update:avatar', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showPicker = ref(false)
const selectedStyle = ref<typeof AVATAR_STYLES[number]>('avataaars')
const avatarSeed = ref('')

const generateAvatarUrl = (style: string, seed: string) => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
}

// Extract style and seed from current avatar URL
const extractAvatarInfo = (url: string) => {
  const match = url.match(/api\.dicebear\.com\/7\.x\/([^/]+)\/svg\?seed=([^&]+)/)
  if (match) {
    return { style: match[1], seed: match[2] }
  }
  return null
}

const selectAvatar = (style: string) => {
  const newUrl = generateAvatarUrl(style, avatarSeed.value)
  emit('update:avatar', newUrl)
  selectedStyle.value = style as typeof AVATAR_STYLES[number]
  showPicker.value = false
}

const randomizeAvatar = () => {
  const newSeed = 'user' + Date.now() + Math.random()
  avatarSeed.value = newSeed
  const newUrl = generateAvatarUrl(selectedStyle.value, newSeed)
  emit('update:avatar', newUrl)
}

// Initialize seed from current avatar or username
watch(() => props.currentAvatar, (newAvatar) => {
  if (newAvatar) {
    const avatarInfo = extractAvatarInfo(newAvatar)
    if (avatarInfo && avatarInfo.seed) {
      avatarSeed.value = decodeURIComponent(avatarInfo.seed)
      selectedStyle.value = avatarInfo.style as typeof AVATAR_STYLES[number]
    } else {
      avatarSeed.value = props.userName
    }
  } else {
    avatarSeed.value = props.userName
  }
}, { immediate: true })
</script>

<template>
  <div>
    <div class="flex gap-4">
      <input
        :value="currentAvatar"
        @input="emit('update:avatar', ($event.target as HTMLInputElement).value)"
        type="url"
        placeholder="https://example.com/avatar.jpg"
        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
      />
      <button
        type="button"
        @click="showPicker = !showPicker"
        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        {{ showPicker ? 'Close' : 'Choose Avatar' }}
      </button>
    </div>

    <!-- Avatar Picker -->
    <div v-if="showPicker" class="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
      <h3 class="font-semibold mb-4">Choose Avatar Style</h3>
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div
          v-for="style in AVATAR_STYLES"
          :key="style"
          @click="selectedStyle = style"
          :class="[
            'cursor-pointer p-2 rounded-lg border-2 transition',
            selectedStyle === style
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          ]"
        >
          <NuxtImg
            :src="generateAvatarUrl(style, avatarSeed)"
            :alt="style"
            class="w-full aspect-square rounded-lg mb-2"
          />
          <p class="text-xs text-center capitalize">{{ style.replace('-', ' ') }}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button
          type="button"
          @click="selectAvatar(selectedStyle)"
          class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Use This Avatar
        </button>
        <button
          type="button"
          @click="randomizeAvatar"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          🎲 Randomize
        </button>
      </div>
    </div>
  </div>
</template>
