<script setup lang="ts">
import { computed } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  ListboxLabel,
} from '@headlessui/vue'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
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
  label: undefined,
  placeholder: '請選擇...',
  error: undefined,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Listbox
      :model-value="props.modelValue"
      :disabled="props.disabled"
      @update:model-value="(val: string) => emit('update:modelValue', val)"
    >
      <ListboxLabel
        v-if="props.label"
        class="text-2xs font-medium tracking-widest uppercase text-muji-text-light"
      >
        {{ props.label }}
        <span v-if="props.required" class="text-muji-red">*</span>
      </ListboxLabel>

      <div class="relative">
        <ListboxButton
          :class="[
            'relative w-full px-3 py-2.5 pr-9 text-left',
            'bg-white text-sm rounded-sm border',
            'shadow-inner cursor-pointer',
            'transition-all duration-200',
            'focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal',
            'hover:border-muji-linen',
            'disabled:bg-muji-white disabled:text-muji-linen disabled:cursor-not-allowed',
            props.error ? 'border-muji-red' : 'border-muji-border',
          ]"
        >
          <span :class="selectedOption ? 'text-muji-text' : 'text-muji-linen'">
            {{ selectedOption?.label || props.placeholder }}
          </span>
          <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <i class="fa-solid fa-chevron-down text-xs text-muji-linen" />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-sm bg-white border border-muji-border shadow-lg focus:outline-none text-sm"
          >
            <ListboxOption
              v-for="opt in props.options"
              :key="opt.value"
              v-slot="{ active, selected }"
              :value="opt.value"
              :disabled="opt.disabled"
              as="template"
            >
              <li
                :class="[
                  'relative cursor-pointer select-none py-2.5 px-3',
                  active ? 'bg-muji-beige text-muji-text' : 'text-muji-text',
                  opt.disabled && 'opacity-40 cursor-not-allowed',
                ]"
              >
                <span :class="['block truncate', selected && 'font-medium']">
                  {{ opt.label }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-muji-charcoal"
                >
                  <i class="fa-solid fa-check text-xs" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
    <span v-if="props.error" class="text-xs text-muji-red">{{ props.error }}</span>
  </div>
</template>
