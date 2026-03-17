<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

interface Props {
  align?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'left',
})
</script>

<template>
  <Popover class="relative">
    <PopoverButton
      class="flex items-center gap-1.5 text-sm text-muji-text hover:text-muji-charcoal transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-muji-charcoal rounded-sm px-2 py-1"
    >
      <slot name="trigger" />
    </PopoverButton>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        :class="[
          'absolute z-30 mt-2 w-72 rounded-sm bg-white border border-muji-border shadow-lg p-4',
          props.align === 'right' ? 'right-0' : 'left-0',
        ]"
      >
        <slot />
      </PopoverPanel>
    </transition>
  </Popover>
</template>
