<script setup lang="ts">
interface Props {
  show: boolean
  title?: string
  maxWidth?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 'md',
})

const emit = defineEmits<{
  close: []
}>()

const maxWidthClass: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
}

function onBackdropClick() {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.show"
        class="fixed inset-0 bg-muji-text/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        @click.self="onBackdropClick"
      >
        <div
          :class="[
            'w-full bg-white rounded-sm border border-muji-border',
            'shadow-lg animate-slide-up',
            maxWidthClass[props.maxWidth],
          ]"
        >
          <!-- Header -->
          <div
            v-if="props.title || $slots.header"
            class="flex items-center justify-between px-6 py-4 border-b border-muji-border"
          >
            <slot name="header">
              <h3 class="text-base font-normal text-muji-text tracking-tight">
                {{ props.title }}
              </h3>
            </slot>
            <button
              class="text-muji-linen hover:text-muji-charcoal transition-colors duration-150 p-1"
              @click="emit('close')"
            >
              <i class="fa-regular fa-xmark text-base" />
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
