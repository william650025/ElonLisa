<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  icon?: string
  trend?: string
  trendDirection?: 'up' | 'down' | 'neutral'
  critical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: undefined,
  trend: undefined,
  trendDirection: 'neutral',
  critical: false,
})

const trendColor: Record<string, string> = {
  up: 'text-success',
  down: 'text-muji-red',
  neutral: 'text-muji-text-light',
}

const trendIcon: Record<string, string> = {
  up: 'fa-solid fa-arrow-trend-up',
  down: 'fa-solid fa-arrow-trend-down',
  neutral: 'fa-solid fa-minus',
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-sm border shadow-sm p-6',
      props.critical ? 'border-muji-red/30' : 'border-muji-border',
    ]"
  >
    <div class="flex items-center justify-between mb-4">
      <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
        {{ props.label }}
      </span>
      <i
        v-if="props.icon"
        :class="[props.icon, 'text-base', props.critical ? 'text-muji-red' : 'text-muji-linen']"
      />
    </div>
    <div
      :class="[
        'text-[28px] font-light tracking-tight leading-none mb-2',
        props.critical ? 'text-muji-red' : 'text-muji-text',
      ]"
    >
      {{ props.value }}
    </div>
    <div v-if="props.trend" :class="['flex items-center gap-1.5 text-xs', trendColor[props.trendDirection]]">
      <i :class="[trendIcon[props.trendDirection], 'text-xs']" />
      <span>{{ props.trend }}</span>
    </div>
  </div>
</template>
