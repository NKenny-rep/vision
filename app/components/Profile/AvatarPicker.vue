<script setup lang="ts">
import { AVATAR_STYLES } from '~/constants'

interface Props {
  currentAvatar: string
  userName: string
  compact?: boolean
}

interface Emits {
  (e: 'update:avatar', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})
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
    <div :class="compact ? 'flex gap-2' : 'flex gap-4'">
      <input
        :value="currentAvatar"
        type="url"
        placeholder="https://example.com/avatar.jpg"
        :class="[
          'flex-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary',
          compact ? 'px-2 py-1.5 text-sm' : 'px-4 py-2'
        ]"
        @input="emit('update:avatar', ($event.target as HTMLInputElement).value)"
      >
      <button
        type="button"
        :class="[
          'border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap',
          compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2'
        ]"
        @click="showPicker = !showPicker"
      >
        {{ showPicker ? 'Close' : (compact ? 'Choose' : 'Choose Avatar') }}
      </button>
    </div>

    <!-- Avatar Picker -->
    <div
v-if="showPicker" :class="[
      'mt-3 border border-gray-300 dark:border-gray-600 rounded-lg',
      compact ? 'p-2' : 'p-4'
    ]">
      <h3 :class="compact ? 'text-sm font-semibold mb-2' : 'font-semibold mb-4'">Choose Avatar Style</h3>
      <div
:class="[
        'grid mb-3',
        compact ? 'grid-cols-3 gap-2' : 'grid-cols-4 gap-4 mb-4'
      ]">
        <div
          v-for="style in AVATAR_STYLES"
          :key="style"
          :class="[
            'cursor-pointer rounded-lg border-2 transition',
            compact ? 'p-1' : 'p-2',
            selectedStyle === style
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
          ]"
          @click="selectedStyle = style"
        >
          <NuxtImg
            :src="generateAvatarUrl(style, avatarSeed)"
            :alt="style"
            :class="compact ? 'w-full aspect-square rounded mb-1' : 'w-full aspect-square rounded-lg mb-2'"
          />
          <p :class="compact ? 'text-[10px] text-center capitalize' : 'text-xs text-center capitalize'">{{ style.replace('-', ' ') }}</p>
        </div>
      </div>
      <div :class="compact ? 'flex gap-1.5' : 'flex gap-2'">
        <button
          type="button"
          :class="[
            'w-full bg-primary text-white rounded-lg hover:bg-primary-dark',
            compact ? 'px-2 py-1.5 text-xs' : 'px-4 py-2'
          ]"
          @click="selectAvatar(selectedStyle)"
        >
          Use This Avatar
        </button>
      </div>
    </div>
  </div>
</template>
