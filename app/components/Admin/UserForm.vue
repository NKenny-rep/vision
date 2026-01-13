<script setup lang="ts">
import type { UserFormData } from '~/types'
import { createUserValidator, type ValidationErrors } from '~/utils/validators/userValidator'

interface Props {
  initialData?: Partial<UserFormData>
  isEdit?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  loading: false,
})

const emit = defineEmits<{
  submit: [data: UserFormData]
  cancel: []
}>()

const { t } = useI18n()
const validator = createUserValidator(t)

// Initialize form with default or provided data
const formData = ref<UserFormData>({
  name: props.initialData?.name || '',
  email: props.initialData?.email || '',
  password: '',
  phone: props.initialData?.phone || null,
  avatar: props.initialData?.avatar || null,
  roleId: props.initialData?.roleId || 1,
})

const errors = ref<ValidationErrors>({})

// Form field configuration pattern
const formFields = computed(() => [
  {
    key: 'name',
    type: 'text' as const,
    label: t('admin.users.form.name'),
    placeholder: t('admin.users.form.namePlaceholder'),
    required: true,
  },
  {
    key: 'email',
    type: 'email' as const,
    label: t('admin.users.form.email'),
    placeholder: t('admin.users.form.emailPlaceholder'),
    required: true,
  },
  {
    key: 'password',
    type: 'password' as const,
    label: t('admin.users.form.password'),
    placeholder: t('admin.users.form.passwordPlaceholder'),
    required: !props.isEdit,
    hint: props.isEdit ? t('admin.users.form.passwordOptional') : undefined,
  },
  {
    key: 'phone',
    type: 'tel' as const,
    label: t('admin.users.form.phone'),
    placeholder: t('admin.users.form.phonePlaceholder'),
    required: false,
  },
  {
    key: 'avatar',
    type: 'url' as const,
    label: t('admin.users.form.avatar'),
    placeholder: t('admin.users.form.avatarPlaceholder'),
    required: false,
  },
])

const roleOptions = computed(() => [
  { value: 1, label: t('admin.users.roles.user') },
  { value: 2, label: t('admin.users.roles.admin') },
])

const validateForm = (): boolean => {
  errors.value = validator.validate(formData.value, props.isEdit)
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return

  const dataToSubmit = { ...formData.value }
  // Don't send password if it's empty in edit mode
  if (props.isEdit && !dataToSubmit.password) {
    delete dataToSubmit.password
  }
  emit('submit', dataToSubmit)
}

const handleCancel = () => {
  emit('cancel')
}

// Use Vue's useId() for SSR-safe unique ID generation
const roleSelectId = useId()
</script>

<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <!-- Dynamic Form Fields -->
    <UIFormField
      v-for="field in formFields"
      :key="field.key"
      v-model="formData[field.key]"
      :label="field.label"
      :type="field.type"
      :placeholder="field.placeholder"
      :error="errors[field.key as keyof ValidationErrors]"
      :required="field.required"
      :disabled="loading"
    >
      <template v-if="field.hint" #hint>
        <span class="text-sm text-gray-400">({{ field.hint }})</span>
      </template>
    </UIFormField>

    <!-- Role Selection -->
    <div>
      <label :for="roleSelectId" class="block text-sm font-medium text-gray-200 mb-2">
        {{ t('admin.users.form.role') }} <span class="text-red-500">*</span>
      </label>
      <select
        :id="roleSelectId"
        v-model="formData.roleId"
        :disabled="loading"
        class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      >
        <option v-for="role in roleOptions" :key="role.value" :value="role.value">
          {{ role.label }}
        </option>
      </select>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 justify-end pt-4">
      <UIButton
        type="button"
        variant="ghost"
        :disabled="loading"
        @click="handleCancel"
      >
        {{ t('common.cancel') }}
      </UIButton>
      <UIButton
        type="submit"
        variant="primary"
        :disabled="loading"
      >
        <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
        {{ isEdit ? t('common.update') : t('common.create') }}
      </UIButton>
    </div>
  </form>
</template>
