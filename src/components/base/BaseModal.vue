<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue'

interface Props {
  show: boolean
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  maxWidth: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const maxWidthClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}
</script>

<template>
  <TransitionRoot :show="props.show" as="template">
    <Dialog class="relative z-50" @close="emit('close')">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-200"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-150"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-muji-text/40 backdrop-blur-[2px]" />
      </TransitionChild>

      <!-- Panel -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-200"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-150"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              :class="[
                'w-full bg-white rounded-sm border border-muji-border shadow-lg',
                maxWidthClass[props.maxWidth],
              ]"
            >
              <!-- Header -->
              <div
                v-if="props.title || $slots.header"
                class="flex items-center justify-between px-6 py-4 border-b border-muji-border"
              >
                <slot name="header">
                  <DialogTitle class="text-base font-normal text-muji-text tracking-tight">
                    {{ props.title }}
                  </DialogTitle>
                </slot>
                <button
                  class="text-muji-linen hover:text-muji-charcoal transition-colors duration-150 p-1"
                  @click="emit('close')"
                >
                  <i class="fa-solid fa-xmark text-base" />
                </button>
              </div>

              <!-- Body -->
              <div class="px-6 py-5">
                <slot />
              </div>

              <!-- Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end gap-3 px-6 py-4 border-t border-muji-border"
              >
                <slot name="footer" />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
