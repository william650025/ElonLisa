<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

interface Props {
  modelValue: boolean
  label?: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: undefined,
  description: undefined,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <SwitchGroup as="div" class="flex items-center justify-between gap-4">
    <div v-if="props.label || props.description">
      <SwitchLabel class="text-sm text-muji-text cursor-pointer" passive>
        {{ props.label }}
      </SwitchLabel>
      <p v-if="props.description" class="text-xs text-muji-text-light mt-0.5">
        {{ props.description }}
      </p>
    </div>
    <Switch
      :model-value="props.modelValue"
      :disabled="props.disabled"
      :class="[
        props.modelValue ? 'bg-muji-charcoal' : 'bg-muji-border',
        props.disabled && 'opacity-50 cursor-not-allowed',
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full',
        'border-2 border-transparent transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-muji-charcoal focus-visible:ring-offset-2',
      ]"
      @update:model-value="(val: boolean) => emit('update:modelValue', val)"
    >
      <span
        :class="[
          props.modelValue ? 'translate-x-4' : 'translate-x-0',
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm',
          'ring-0 transition duration-200 ease-in-out',
        ]"
      />
    </Switch>
  </SwitchGroup>
</template>
