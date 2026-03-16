<script setup lang="ts">
interface Props {
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  hoverable: false,
})

const paddingClasses: Record<string, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-sm border border-muji-border',
      'shadow-sm transition-shadow duration-200',
      paddingClasses[props.padding],
      props.hoverable && 'hover:shadow-md cursor-pointer',
    ]"
  >
    <slot />
  </div>
</template>
