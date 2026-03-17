<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'fa-solid fa-inbox',
  title: '暫無資料',
  description: '',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4">
    <i :class="[icon, 'text-[32px] text-muji-linen mb-4']" />
    <p class="text-base text-muji-text-light font-normal mb-1">{{ title }}</p>
    <p v-if="description" class="text-sm text-muji-linen mb-4">{{ description }}</p>
    <slot />
  </div>
</template>
