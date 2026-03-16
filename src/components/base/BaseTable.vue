<script setup lang="ts">
export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface Props {
  columns: TableColumn[]
  data: Record<string, unknown>[]
  hoverable?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: true,
  striped: false,
})

defineEmits<{
  'row-click': [row: Record<string, unknown>, index: number]
}>()

const alignClass = (align?: string) => {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-sm border border-muji-border">
    <table class="w-full text-sm">
      <thead>
        <tr class="bg-muji-white border-b border-muji-border">
          <th
            v-for="col in props.columns"
            :key="col.key"
            :class="[
              'px-4 py-3 text-2xs font-medium tracking-widest uppercase text-muji-text-light',
              alignClass(col.align),
            ]"
            :style="col.width ? { width: col.width } : undefined"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-muji-border">
        <tr
          v-for="(row, index) in props.data"
          :key="index"
          :class="[
            'transition-colors duration-150',
            props.hoverable && 'hover:bg-muji-white cursor-pointer',
            props.striped && index % 2 === 1 && 'bg-muji-white/30',
          ]"
          @click="$emit('row-click', row, index)"
        >
          <td
            v-for="col in props.columns"
            :key="col.key"
            :class="['px-4 py-3.5 text-muji-text font-normal', alignClass(col.align)]"
          >
            <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="index">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="props.data.length === 0">
          <td :colspan="props.columns.length" class="px-4 py-12 text-center text-muji-text-light">
            <slot name="empty">
              <span>暫無資料</span>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
