<script setup lang="ts">
const emit = defineEmits<{
  search: [query: string]
}>()

const { t } = useI18n()
const searchQuery = ref('')
const debounceTimeout = ref<NodeJS.Timeout>()

const handleSearch = () => {
  // Clear previous timeout
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }

  // Set new timeout
  debounceTimeout.value = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}

// Cleanup on unmount
onUnmounted(() => {
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
})
</script>

<template>
  <div class="relative md:w-64 lg:w-80">
    <div class="relative">
      <UIcon
        name="i-heroicons-magnifying-glass"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
      />
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="t('admin.users.search.placeholder')"
        class="w-full pl-10 pr-10 py-2 bg-surface border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
        @input="handleSearch"
      >
      <button
        v-if="searchQuery"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        @click="clearSearch"
      >
        <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
