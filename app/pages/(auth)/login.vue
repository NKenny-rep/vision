<script setup lang="ts">
import * as z from 'zod';

definePageMeta({
  layout: 'login-layout',
  middleware: 'not-auth',
});

const { t } = useI18n();
const localePath = useLocalePath();
const { showError, showSuccess } = useToastNotification();
const route = useRoute();

const cookieLoginEmail = useCookie<string|null>('login_email', {
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 30, // 1 month
});

const { login } = useAuthentication();

const redirectPath = computed(() => {
  const redirect = route.query.redirect as string | undefined;
  // Validate redirect path to prevent open redirects
  if (redirect && redirect.startsWith('/')) {
    return redirect;
  }
  return '/'; // Default redirect
});

const isPosting = ref(false);

const formData = reactive({
  email: cookieLoginEmail.value || '',
  password: '',
  remember: Boolean(cookieLoginEmail.value),
});

async function onSubmit() {
  const { email, password, remember } = formData;
  isPosting.value = true;

  if (remember) {
    cookieLoginEmail.value = email;
  } else {
    cookieLoginEmail.value = null;
  }

  const isSuccessful = await login(email, password, redirectPath.value);

  if (!isSuccessful) {
    showError(t('auth.login.invalidCredentials'));
    isPosting.value = false;
    return;
  }
  
  // Success toast (navigation happens in composable)
  showSuccess(t('common.success'), t('common.welcome'));
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-md mx-auto space-y-8">
      <!-- Page Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">
          {{ t('auth.login.title') }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">{{ t('auth.login.emailPlaceholder') }}</p>
      </div>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <!-- Login Form -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                {{ t('auth.login.email') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                :placeholder="t('auth.login.emailPlaceholder')"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
              >
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                {{ t('auth.login.password') }} <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.password"
                type="password"
                required
                :placeholder="t('auth.login.passwordPlaceholder')"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary"
              >
            </div>

            <div class="flex items-center">
              <input
                id="remember"
                v-model="formData.remember"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              >
              <label for="remember" class="ml-2 block text-sm">
                {{ t('auth.login.rememberMe') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div class="flex flex-col gap-4">
            <button
              type="submit"
              :disabled="isPosting"
              class="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <UIcon v-if="!isPosting" name="i-heroicons-arrow-right-on-rectangle-20-solid" />
              <span v-if="isPosting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              {{ isPosting ? t('common.pleaseWait') : t('auth.login.signInButton') }}
            </button>

            <NuxtLink
              :to="localePath('/register')"
              class="text-center text-primary hover:underline"
            >
              {{ t('auth.login.noAccount') }} {{ t('auth.login.signUpLink') }}
            </NuxtLink>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
