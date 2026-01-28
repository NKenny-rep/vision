<script setup lang="ts">
/**
 * UI Button Component (Atom)
 * Wraps UButton with common VideoVision styles and behaviors
 */

interface Props {
  // Visual variants
  variant?: 'primary' | 'secondary' | 'ghost' | 'soft' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  
  // Actions
  to?: string
  href?: string
  
  // State
  loading?: boolean
  disabled?: boolean
  block?: boolean
  
  // Icons
  icon?: string
  leadingIcon?: string
  trailingIcon?: string
  
  // Appearance
  label?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Map variants to UButton color/variant
const buttonConfig = computed(() => {
  const configs = {
    primary: {
      color: 'orange' as const,
      variant: undefined,
      class: 'bg-primary hover:bg-primary-600 text-white font-semibold'
    },
    secondary: {
      color: 'neutral' as const,
      variant: 'soft' as const,
      class: 'text-white'
    },
    ghost: {
      color: 'neutral' as const,
      variant: 'ghost' as const,
      class: 'text-white hover:text-primary'
    },
    soft: {
      color: 'orange' as const,
      variant: 'soft' as const,
      class: 'font-semibold'
    },
    outline: {
      color: 'neutral' as const,
      variant: 'outline' as const,
      class: 'text-white border-gray-700 hover:border-orange-500'
    }
  }
  
  return configs[props.variant]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <UButton
    :to="to"
    :href="href"
    :color="buttonConfig.color"
    :variant="buttonConfig.variant"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    :block="block"
    :icon="icon || leadingIcon"
    :trailing-icon="trailingIcon"
    :aria-label="ariaLabel"
    :class="buttonConfig.class"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
  </UButton>
</template>
