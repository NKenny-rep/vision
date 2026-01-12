<script setup lang="ts">
import * as z from 'zod';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

definePageMeta({
  layout: 'login-layout',
  middleware: 'not-auth',
});

const { t } = useI18n();
const localePath = useLocalePath();
const toast = useToast();
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
const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: t('auth.login.email'),
    placeholder: t('auth.login.emailPlaceholder'),
    required: true,
    defaultValue: cookieLoginEmail.value || '',
  },
  {
    name: 'password',
    label: t('auth.login.password'),
    type: 'password',
    placeholder: t('auth.login.passwordPlaceholder'),
    required: true,
  },
  {
    name: 'remember',
    label: t('auth.login.rememberMe'),
    type: 'checkbox',
    defaultValue: Boolean(cookieLoginEmail.value),
  },
];

const providers = [
  {
    label: t('auth.providers.google'),
    icon: 'i-simple-icons-google',
    onClick: () => {
      toast.add({ title: t('auth.providers.google'), description: t('auth.providers.continueWith', { provider: 'Google' }) });
    },
  },
  {
    label: t('auth.providers.github'),
    icon: 'i-simple-icons-github',
    onClick: () => {
      toast.add({ title: t('auth.providers.github'), description: t('auth.providers.continueWith', { provider: 'GitHub' }) });
    },
  },
];

const schema = z.object({
  email: z.email(t('auth.login.emailInvalid')),
  password: z
    .string(t('auth.login.passwordRequired'))
    .min(8, t('auth.login.passwordMinLength')),
  remember: z.boolean().optional(),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { email, password, remember } = payload.data;
  isPosting.value = true;

  if (remember) {
    cookieLoginEmail.value = email;
  } else {
    cookieLoginEmail.value = null;
  }

  //el login devuelve booleano no vale la pena try catch
  const isSuccessful = await login(email, password, redirectPath.value);

  if ( !isSuccessful) {
    toast.add({
      title: t('common.error'),
      description: t('auth.login.invalidCredentials'),
    });
    isPosting.value = false;
    return;
  }
  
  // Success toast (navigation happens in composable)
  toast.add({
    title: t('common.welcome'),
    description: t('common.success'),
    color: 'orange'
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-2xl lg:max-w-4xl">
      <UAuthForm
        :schema="schema"
        :title="$t('auth.login.title')"
        :description="$t('auth.login.emailPlaceholder')"
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        :loading="isPosting"
        :disabled="isPosting"
        @submit="onSubmit"
        :ui="{
          leadingIcon: 'text-5xl',
          root: 'w-full',
        }"
      />
    </UPageCard>

    <UIButton
      variant="ghost"
      :label="$t('auth.login.noAccount') + ' ' + $t('auth.login.signUpLink')"
      :to="localePath('/register')"
    />
  </div>
</template>
