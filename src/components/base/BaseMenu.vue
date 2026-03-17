<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

export interface MenuAction {
  key: string
  label: string
  icon?: string
  danger?: boolean
  disabled?: boolean
}

interface Props {
  actions: MenuAction[]
  align?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  align: 'right',
})

const emit = defineEmits<{
  select: [key: string]
}>()
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
    <MenuButton
      class="flex items-center justify-center w-8 h-8 rounded-sm text-muji-text-light hover:text-muji-text hover:bg-muji-beige transition-colors duration-150"
    >
      <slot name="trigger">
        <i class="fa-regular fa-ellipsis-vertical text-sm" />
      </slot>
    </MenuButton>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        :class="[
          'absolute z-30 mt-1 w-48 rounded-sm bg-white border border-muji-border shadow-lg focus:outline-none',
          props.align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
        ]"
      >
        <div class="py-1">
          <MenuItem
            v-for="action in props.actions"
            :key="action.key"
            v-slot="{ active }"
            :disabled="action.disabled"
          >
            <button
              :class="[
                'flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left',
                active && !action.danger && 'bg-muji-beige',
                active && action.danger && 'bg-critical-bg',
                action.danger ? 'text-critical' : 'text-muji-text',
                action.disabled && 'opacity-40 cursor-not-allowed',
              ]"
              @click="emit('select', action.key)"
            >
              <i v-if="action.icon" :class="[action.icon, 'text-xs w-4 text-center']" />
              {{ action.label }}
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
