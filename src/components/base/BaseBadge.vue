<script setup lang="ts">
interface Props {
  variant?: 'success' | 'warning' | 'info' | 'neutral' | 'critical'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
})

const variantClasses: Record<string, string> = {
  success: 'bg-success-bg text-success border-success/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  info: 'bg-info-bg text-info border-info/20',
  neutral: 'bg-muji-white text-muji-text-light border-muji-border',
  critical: 'bg-critical-bg text-critical border-critical/20',
}

const dotIcon: Record<string, string> = {
  success: 'fa-solid fa-circle',
  warning: 'fa-solid fa-circle',
  info: 'fa-solid fa-circle',
  neutral: 'fa-solid fa-circle',
  critical: 'fa-regular fa-triangle-exclamation',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 px-2.5 py-0.5',
      'rounded-sm text-2xs font-medium tracking-wide border',
      variantClasses[props.variant],
    ]"
  >
    <i :class="[dotIcon[props.variant], props.variant === 'critical' ? 'text-[10px]' : 'text-[6px]']" />
    <slot />
  </span>
</template>
