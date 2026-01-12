<script setup lang="ts">
const localePath = useLocalePath();

definePageMeta({
  layout: 'dashboard-layout',
  middleware: ['auth', 'admin']
});

// Mock data - replace with real API call
const videos = ref([
  { id: 1, title: 'The Matrix', status: 'published', views: 1234 },
  { id: 2, title: 'Inception', status: 'draft', views: 0 },
  { id: 3, title: 'Interstellar', status: 'published', views: 5678 },
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">{{ $t('admin.videos.title') }}</h1>
        <p class="text-gray-400 mt-2">{{ $t('admin.videos.subtitle') }}</p>
      </div>
      <UIButton
        :to="localePath('/videos/create')"
        variant="primary"
        icon="i-heroicons-plus"
      >
        {{ $t('admin.videos.addVideo') }}
      </UIButton>
    </div>

    <!-- Videos Table -->
    <UCard>
      <UTable :rows="videos" :columns="[
        { key: 'id', label: $t('admin.videos.id') },
        { key: 'title', label: $t('admin.videos.title') },
        { key: 'status', label: $t('admin.videos.status') },
        { key: 'views', label: $t('admin.videos.views') },
        { key: 'actions', label: $t('admin.videos.actions') }
      ]">
        <template #status-data="{ row }">
          <UBadge 
            :color="row.status === 'published' ? 'green' : 'gray'"
            variant="soft"
          >
            {{ row.status === 'published' ? $t('admin.videos.published') : $t('admin.videos.draft') }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UIButton
              :to="localePath(`/videos/${row.id}`)"
              variant="ghost"
              icon="i-heroicons-eye"
              size="sm"
            />
            <UIButton
              :to="localePath(`/videos/${row.id}/edit`)"
              variant="soft"
              icon="i-heroicons-pencil"
              size="sm"
            />
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
