<script setup lang="ts">
interface Props {
  title?: string
  breadcrumbs?: { label: string; to?: string }[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
})

defineEmits<{
  search: [query: string]
}>()
</script>

<template>
  <header
    class="h-14 bg-white border-b border-muji-border flex items-center px-6 gap-4 shadow-xs sticky top-0 z-40"
  >
    <!-- Page Title & Breadcrumb -->
    <div class="flex-1">
      <h1 v-if="props.title" class="text-lg font-light text-muji-text tracking-tight">
        {{ props.title }}
      </h1>
      <div
        v-if="props.breadcrumbs && props.breadcrumbs.length > 0"
        class="flex items-center gap-1.5 text-2xs text-muji-text-light"
      >
        <template v-for="(crumb, i) in props.breadcrumbs" :key="i">
          <RouterLink
            v-if="crumb.to && i < props.breadcrumbs.length - 1"
            :to="crumb.to"
            class="hover:text-muji-charcoal transition-colors"
          >
            {{ crumb.label }}
          </RouterLink>
          <span v-else :class="i === props.breadcrumbs.length - 1 ? 'text-muji-charcoal' : ''">
            {{ crumb.label }}
          </span>
          <i v-if="i < props.breadcrumbs.length - 1" class="fa-regular fa-chevron-right text-[9px]" />
        </template>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2">
      <slot name="actions" />

      <!-- Notification -->
      <button
        class="relative w-9 h-9 flex items-center justify-center text-muji-text-light hover:text-muji-text hover:bg-muji-white rounded-sm transition-all duration-150"
      >
        <i class="fa-regular fa-bell text-sm" />
      </button>
    </div>
  </header>
</template>
