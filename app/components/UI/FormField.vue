<script setup lang="ts">
interface Props {
  modelValue: string | null | undefined
  label: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'url'
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue || '',
  set: (value) => emit('update:modelValue', value),
})

// Use Vue's useId() for SSR-safe unique ID generation
const uniqueId = useId()
</script>

<template>
  <div>
    <label :for="uniqueId" class="block text-sm font-medium text-gray-200 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="uniqueId"
      v-model="inputValue"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      class="w-full px-4 py-2 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      :class="error ? 'border-red-500' : 'border-gray-700'"
    />
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>
