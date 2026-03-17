<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  icon: undefined,
  disabled: false,
  loading: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses: Record<string, string> = {
  primary:
    'bg-muji-charcoal text-muji-white border-muji-charcoal hover:bg-muji-text hover:border-muji-text focus:ring-muji-charcoal',
  secondary:
    'bg-transparent text-muji-charcoal border-muji-border hover:bg-muji-cream hover:border-muji-linen focus:ring-muji-charcoal',
  danger:
    'bg-muji-red text-white border-muji-red hover:bg-[#A8353A] hover:border-[#A8353A] focus:ring-muji-red',
  ghost:
    'bg-transparent text-muji-text-light border-transparent hover:text-muji-charcoal hover:bg-muji-cream focus:ring-muji-border',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
}
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2',
      'font-medium tracking-wide',
      'rounded-sm border',
      'transition-all duration-200 ease-in-out',
      'active:scale-[0.98]',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-muji-white',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
    :disabled="props.disabled || props.loading"
    @click="$emit('click', $event)"
  >
    <i v-if="props.loading" class="fa-regular fa-spinner fa-spin text-xs" />
    <i v-else-if="props.icon" :class="[props.icon, 'text-xs']" />
    <slot />
  </button>
</template>
