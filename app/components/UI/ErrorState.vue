<script setup lang="ts">
interface Props {  
  title?: string
  message?: string
  showReload?: boolean
  reloadText?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  message: '',
  showReload: true,
  reloadText: '',
  icon: 'i-heroicons-exclamation-triangle'
})

const emit = defineEmits<{
  reload: []
}>()

const { t } = useI18n()

const displayTitle = computed(() => props.title || t('errors.loadFailed'))
const displayMessage = computed(() => props.message || t('errors.tryAgain'))
const displayReloadText = computed(() => props.reloadText || t('common.reload'))

const handleReload = () => {
  emit('reload')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="mb-6 text-red-500">
      <UIcon :name="icon" class="w-16 h-16" />
    </div>

    <h3 class="text-xl font-semibold text-white mb-2">
      {{ displayTitle }}
    </h3>

    <p class="text-muted max-w-md mb-8">
      {{ displayMessage }}
    </p>

    <UButton 
      v-if="showReload"
      icon="i-heroicons-arrow-path"
      size="lg"
      color="primary"
      variant="solid"
      @click="handleReload"
    >
      {{ displayReloadText }}
    </UButton>
  </div>
</template>
