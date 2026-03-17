<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

export interface TabItem {
  key: string
  label: string
  icon?: string
}

interface Props {
  tabs: TabItem[]
  defaultIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  defaultIndex: 0,
})

const emit = defineEmits<{
  change: [index: number]
}>()
</script>

<template>
  <TabGroup :default-index="props.defaultIndex" @change="(i: number) => emit('change', i)">
    <TabList class="flex gap-1 border-b border-muji-border">
      <Tab
        v-for="tab in props.tabs"
        :key="tab.key"
        v-slot="{ selected }"
        as="template"
      >
        <button
          :class="[
            'flex items-center gap-2 px-4 py-2.5 text-sm transition-colors duration-150',
            'border-b-2 -mb-px focus:outline-none',
            selected
              ? 'border-muji-charcoal text-muji-text font-medium'
              : 'border-transparent text-muji-text-light hover:text-muji-text hover:border-muji-border',
          ]"
        >
          <i v-if="tab.icon" :class="[tab.icon, 'text-xs']" />
          {{ tab.label }}
        </button>
      </Tab>
    </TabList>
    <TabPanels class="mt-4">
      <TabPanel v-for="tab in props.tabs" :key="tab.key">
        <slot :name="tab.key" />
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>
