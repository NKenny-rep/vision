<script setup lang="ts">
const localePath = useLocalePath();

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'admin']
});

const { showSuccess } = useToastNotification()

const form = reactive({
  title: '',
  description: '',
  videoUrl: '',
  thumbnailUrl: '',
  category: '',
  tags: ''
})

const handleSubmit = async () => {
  // TODO: Implement API call
  showSuccess('Video created successfully')
  navigateTo(localePath('/videos'))
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-white">{{ $t('admin.videos.createVideo') }}</h1>
      <p class="text-gray-400 mt-2">{{ $t('admin.videos.createVideoSubtitle') }}</p>
    </div>

    <UCard>
      <UForm :state="form" @submit="handleSubmit" class="space-y-4">
        <UFormGroup :label="$t('admin.videos.videoTitle')" :required="true">
          <UInput v-model="form.title" :placeholder="$t('admin.videos.enterTitle')" />
        </UFormGroup>

        <UFormGroup :label="$t('admin.videos.description')">
          <UTextarea v-model="form.description" :placeholder="$t('admin.videos.enterDescription')" />
        </UFormGroup>

        <UFormGroup :label="$t('admin.videos.videoUrl')" :required="true">
          <UInput v-model="form.videoUrl" :placeholder="$t('admin.videos.enterVideoUrl')" />
        </UFormGroup>

        <UFormGroup :label="$t('admin.videos.thumbnailUrl')">
          <UInput v-model="form.thumbnailUrl" :placeholder="$t('admin.videos.enterThumbnailUrl')" />
        </UFormGroup>

        <UFormGroup :label="$t('admin.videos.category')">
          <UInput v-model="form.category" :placeholder="$t('admin.videos.enterCategory')" />
        </UFormGroup>

        <UFormGroup :label="$t('admin.videos.tags')">
          <UInput v-model="form.tags" :placeholder="$t('admin.videos.enterTags')" />
        </UFormGroup>

        <div class="flex gap-3">
          <UIButton type="submit" variant="primary">
            {{ $t('admin.videos.createButton') }}
          </UIButton>
          <UIButton :to="localePath('/videos')" variant="secondary">
            {{ $t('admin.videos.cancel') }}
          </UIButton>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
