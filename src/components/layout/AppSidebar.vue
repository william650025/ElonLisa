<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { UserRole } from '@/types'

export interface MenuItem {
  label: string
  icon: string
  to: string
  section?: string
}

interface Props {
  role: UserRole
  menuItems: MenuItem[]
  userName?: string
  userEmail?: string
}

const props = withDefaults(defineProps<Props>(), {
  userName: '使用者',
  userEmail: 'user@lisa-lab.com',
})

defineEmits<{
  logout: []
}>()

const route = useRoute()

const roleLabels: Record<UserRole, string> = {
  admin: '行政人員',
  technologist: '醫檢師',
  client: '客戶',
}

function isActive(to: string): boolean {
  return route.path.startsWith(to)
}

function groupedMenuItems() {
  const groups: { section: string; items: MenuItem[] }[] = []
  let currentSection = ''
  for (const item of props.menuItems) {
    const section = item.section ?? ''
    if (section !== currentSection) {
      currentSection = section
      groups.push({ section, items: [] })
    }
    groups[groups.length - 1].items.push(item)
  }
  return groups
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full w-60 bg-muji-white border-r border-muji-border flex flex-col shadow-[1px_0_8px_rgba(60,60,60,0.04)] z-50"
  >
    <!-- Logo -->
    <div class="px-6 py-5 border-b border-muji-border">
      <span class="text-base font-light text-muji-text tracking-[0.15em] uppercase">LISA</span>
      <p class="text-2xs text-muji-text-light tracking-wide mt-0.5">{{ roleLabels[props.role] }}</p>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <template v-for="(group, gi) in groupedMenuItems()" :key="gi">
        <div v-if="gi > 0" class="my-3 border-t border-muji-border" />
        <div v-if="group.section" class="px-3 mb-2">
          <span class="text-[10px] font-medium tracking-[0.12em] uppercase text-muji-linen">
            {{ group.section }}
          </span>
        </div>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-sm border-l-2 transition-all duration-150',
            isActive(item.to)
              ? 'text-sm text-muji-text font-medium bg-muji-cream border-muji-charcoal'
              : 'text-sm text-muji-text-light hover:text-muji-text hover:bg-muji-cream/60 border-transparent',
          ]"
        >
          <i :class="[item.icon, 'text-sm w-4 text-center']" />
          {{ item.label }}
        </RouterLink>
      </template>
    </nav>

    <!-- User Profile -->
    <div class="px-4 py-4 border-t border-muji-border">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-sm bg-muji-cream flex items-center justify-center">
          <i class="fa-regular fa-user text-xs text-muji-text-light" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-muji-text truncate">{{ props.userName }}</p>
          <p class="text-2xs text-muji-text-light truncate">{{ props.userEmail }}</p>
        </div>
        <button
          class="text-muji-linen hover:text-muji-charcoal transition-colors p-1"
          @click="$emit('logout')"
        >
          <i class="fa-regular fa-arrow-right-from-bracket text-xs" />
        </button>
      </div>
    </div>
  </aside>
</template>
