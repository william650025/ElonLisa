<script setup lang="ts">
interface Props {
  variant?: 'info' | 'success' | 'warning' | 'critical'
  title?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  title: undefined,
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const variantStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  info: {
    bg: 'bg-info-bg',
    border: 'border-info/20',
    text: 'text-info',
    icon: 'fa-solid fa-circle-info',
  },
  success: {
    bg: 'bg-success-bg',
    border: 'border-success/20',
    text: 'text-success',
    icon: 'fa-solid fa-circle-check',
  },
  warning: {
    bg: 'bg-warning-bg',
    border: 'border-warning/20',
    text: 'text-warning',
    icon: 'fa-solid fa-triangle-exclamation',
  },
  critical: {
    bg: 'bg-critical-bg',
    border: 'border-critical/30',
    text: 'text-critical',
    icon: 'fa-solid fa-circle-exclamation',
  },
}
</script>

<template>
  <div
    :class="[
      'flex items-start gap-3 p-4 rounded-sm border',
      variantStyles[props.variant].bg,
      variantStyles[props.variant].border,
      props.variant === 'critical' && 'shadow-[0_0_0_3px_rgba(197,61,67,0.08)]',
    ]"
  >
    <i
      :class="[
        variantStyles[props.variant].icon,
        variantStyles[props.variant].text,
        'mt-0.5 flex-shrink-0',
        props.variant === 'critical' ? 'text-base' : 'text-sm',
      ]"
    />
    <div class="flex-1 min-w-0">
      <p
        v-if="props.title"
        :class="['text-sm font-medium mb-0.5', variantStyles[props.variant].text]"
      >
        {{ props.title }}
      </p>
      <div :class="['text-sm leading-relaxed', `${variantStyles[props.variant].text}/80`]">
        <slot />
      </div>
      <div v-if="$slots.actions" class="mt-3 flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <button
      v-if="props.dismissible"
      :class="[`${variantStyles[props.variant].text}/50`, `hover:${variantStyles[props.variant].text}`, 'flex-shrink-0']"
      @click="emit('dismiss')"
    >
      <i class="fa-solid fa-xmark text-sm" />
    </button>
  </div>
</template>
