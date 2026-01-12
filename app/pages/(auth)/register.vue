<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

definePageMeta({
  layout: 'login-layout',
  middleware: 'not-auth',
})

// Use registration form composable
const { formData, isSubmitting, submit, initializeFromCookie } = useRegistrationForm()

// Initialize email from cookie on mount
onMounted(() => {
  initializeFromCookie()
})

const onSubmit = async () => {
  await submit()
}
</script>

<template>
  <UContainer class="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4">
    <div class="w-full max-w-5xl">
      <div class="text-center mb-8 sm:mb-12">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent mb-3">
          {{ t('auth.register.title') }}
        </h1>
        <p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">{{ t('auth.register.subtitle') }}</p>
      </div>

      <form class="space-y-6 sm:space-y-8" @submit.prevent="onSubmit">
        <!-- Personal Information -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle-20-solid" class="text-primary text-xl" />
              <h3 class="text-xl sm:text-2xl font-bold">{{ t('auth.register.personalInfo') }}</h3>
            </div>
          </template>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <UFormField :label="t('auth.register.name')" required class="sm:col-span-2">
              <UInput
                v-model="formData.name"
                type="text"
                :placeholder="t('auth.register.namePlaceholder')"
                size="xl"
                icon="i-heroicons-user"
              />
            </UFormField>

            <UFormField :label="t('auth.register.email')" required class="sm:col-span-2">
              <UInput
                v-model="formData.email"
                type="email"
                :placeholder="t('auth.register.emailPlaceholder')"
                size="xl"
                icon="i-heroicons-envelope"
              />
            </UFormField>

            <UFormField :label="t('common.phone')" class="sm:col-span-2">
              <UInput
                v-model="formData.phone"
                type="tel"
                placeholder="+1-555-0000"
                size="xl"
                icon="i-heroicons-phone"
              />
            </UFormField>

            <UFormField :label="t('auth.register.password')" required>
              <UInput
                v-model="formData.password"
                type="password"
                :placeholder="t('auth.register.passwordPlaceholder')"
                size="xl"
                icon="i-heroicons-lock-closed"
              />
            </UFormField>

            <UFormField :label="t('auth.register.confirmPassword')" required>
              <UInput
                v-model="formData.confirmPassword"
                type="password"
                :placeholder="t('auth.register.confirmPasswordPlaceholder')"
                size="xl"
                icon="i-heroicons-lock-closed"
              />
            </UFormField>

            <UFormField :label="t('common.avatar')" class="sm:col-span-2">
              <ProfileAvatarPicker
                :current-avatar="formData.avatar"
                :user-name="formData.name || 'user'"
                @update:avatar="formData.avatar = $event"
              />
            </UFormField>
          </div>
        </UCard>

        <!-- Plan Selection -->
        <UCard class="overflow-visible">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-credit-card-20-solid" class="text-primary text-xl" />
              <h3 class="text-xl sm:text-2xl font-bold">{{ t('auth.register.choosePlan') }}</h3>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {{ t('auth.register.choosePlanDescription') || 'Select the plan that works best for you' }}
            </p>
          </template>

          <AuthPlanSelector v-model="formData.planId" />
        </UCard>

        <!-- Submit Button -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <NuxtLink
            :to="localePath('/login')"
            class="text-primary hover:underline text-sm sm:text-base order-2 sm:order-1"
          >
            {{ t('auth.register.haveAccount') }}
          </NuxtLink>

          <UButton
            type="submit"
            size="xl"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            class="w-full sm:w-auto order-1 sm:order-2 min-w-50"
          >
            <span class="flex items-center gap-2">
              <UIcon v-if="!isSubmitting" name="i-heroicons-user-plus-20-solid" />
              {{ t('auth.register.submit') }}
            </span>
          </UButton>
        </div>
      </form>
    </div>
  </UContainer>
</template>
