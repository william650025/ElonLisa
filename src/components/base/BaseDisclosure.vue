<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'

interface Props {
  title: string
  defaultOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false,
})
</script>

<template>
  <Disclosure v-slot="{ open }" :default-open="props.defaultOpen">
    <DisclosureButton
      class="flex w-full items-center justify-between rounded-sm bg-muji-beige px-4 py-3 text-left text-sm text-muji-text hover:bg-muji-stone/30 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-muji-charcoal"
    >
      <span class="font-medium">{{ props.title }}</span>
      <i
        :class="[
          'fa-regular fa-chevron-down text-xs text-muji-text-light transition-transform duration-200',
          open && 'rotate-180',
        ]"
      />
    </DisclosureButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <DisclosurePanel class="px-4 py-3 text-sm text-muji-text">
        <slot />
      </DisclosurePanel>
    </transition>
  </Disclosure>
</template>
