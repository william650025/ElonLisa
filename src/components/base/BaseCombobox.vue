<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  ComboboxLabel,
} from '@headlessui/vue'

export interface ComboboxItem {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string
  label?: string
  options: ComboboxItem[]
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜尋...',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const query = ref('')

const filtered = computed(() => {
  if (!query.value) return props.options
  const q = query.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

const selectedOption = computed(() =>
  props.options.find((o) => o.value === props.modelValue)
)
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <Combobox
      :model-value="props.modelValue"
      :disabled="props.disabled"
      @update:model-value="(val: string) => emit('update:modelValue', val)"
    >
      <ComboboxLabel
        v-if="props.label"
        class="text-2xs font-medium tracking-widest uppercase text-muji-text-light"
      >
        {{ props.label }}
        <span v-if="props.required" class="text-muji-red">*</span>
      </ComboboxLabel>

      <div class="relative">
        <ComboboxInput
          :class="[
            'w-full px-3 py-2.5 pr-9',
            'bg-white text-muji-text text-sm',
            'border rounded-sm',
            'placeholder:text-muji-linen',
            'shadow-inner',
            'transition-all duration-200',
            'focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal',
            props.error ? 'border-muji-red' : 'border-muji-border',
          ]"
          :display-value="() => selectedOption?.label || ''"
          :placeholder="props.placeholder"
          @change="query = $event.target.value"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-3">
          <i class="fa-regular fa-chevron-down text-xs text-muji-linen" />
        </ComboboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ComboboxOptions
            class="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-sm bg-white border border-muji-border shadow-lg focus:outline-none text-sm"
          >
            <div
              v-if="filtered.length === 0"
              class="px-3 py-2.5 text-muji-text-light"
            >
              查無結果
            </div>
            <ComboboxOption
              v-for="opt in filtered"
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
                  <i class="fa-regular fa-check text-xs" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </transition>
      </div>
    </Combobox>
    <span v-if="props.error" class="text-xs text-muji-red">{{ props.error }}</span>
  </div>
</template>
