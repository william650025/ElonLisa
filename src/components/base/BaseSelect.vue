<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue?: string
  label?: string
  options: SelectOption[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '請選擇...',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement
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
    <div class="relative">
      <select
        :value="props.modelValue"
        :disabled="props.disabled"
        :class="[
          'w-full px-3 py-2.5 pr-9',
          'bg-white text-muji-text text-sm',
          'border rounded-sm',
          'appearance-none cursor-pointer',
          'shadow-inner',
          'transition-all duration-200',
          'focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal',
          'hover:border-muji-linen',
          props.error ? 'border-muji-red' : 'border-muji-border',
        ]"
        @change="onChange"
      >
        <option value="" disabled>{{ props.placeholder }}</option>
        <option v-for="opt in props.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <i
        class="fa-regular fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen pointer-events-none"
      />
    </div>
    <span v-if="props.error" class="text-xs text-muji-red">{{ props.error }}</span>
  </div>
</template>
