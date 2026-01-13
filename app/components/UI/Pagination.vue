<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  totalResults?: number
  pageSize?: number
  showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  totalResults: 0,
  pageSize: 10,
  showInfo: true
})

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const startItem = computed(() => ((props.currentPage - 1) * props.pageSize) + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalResults))
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 bg-gray-900 rounded-lg border border-gray-800">
    <p v-if="showInfo && totalResults > 0" class="text-sm text-gray-400">
      <span class="font-medium text-white">{{ startItem }}</span>
      -
      <span class="font-medium text-white">{{ endItem }}</span>
      of
      <span class="font-medium text-white">{{ totalResults }}</span>
    </p>
    <div v-else />
    
    <div class="flex gap-2">
      <UIButton
        variant="outline"
        size="sm"
        icon="i-heroicons-chevron-left"
        :disabled="currentPage === 1"
        @click="emit('page-change', currentPage - 1)"
      />
      <UIButton
        variant="outline"
        size="sm"
        icon="i-heroicons-chevron-right"
        :disabled="currentPage === totalPages"
        @click="emit('page-change', currentPage + 1)"
      />
    </div>
  </div>
</template>
