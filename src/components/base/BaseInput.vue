<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: undefined,
  placeholder: undefined,
  type: 'text',
  error: undefined,
  hint: undefined,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="props.label"
      class="text-2xs font-medium tracking-widest uppercase text-muji-text-light"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-muji-red">*</span>
    </label>
    <input
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="[
        'w-full px-3 py-2.5',
        'bg-white text-muji-text text-sm',
        'border rounded-sm',
        'placeholder:text-muji-linen',
        'shadow-inner',
        'transition-all duration-200',
        'focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal',
        'hover:border-muji-linen',
        'disabled:bg-muji-white disabled:text-muji-linen disabled:cursor-not-allowed',
        props.error ? 'border-muji-red' : 'border-muji-border',
      ]"
      @input="onInput"
    />
    <span v-if="props.error" class="text-xs text-muji-red">{{ props.error }}</span>
    <span v-else-if="props.hint" class="text-xs text-muji-text-light">{{ props.hint }}</span>
  </div>
</template>
