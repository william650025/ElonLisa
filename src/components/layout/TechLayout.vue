<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import type { MenuItem } from './AppSidebar.vue'

const router = useRouter()

const menuItems: MenuItem[] = [
  { label: '總覽', icon: 'fa-regular fa-grid-2', to: '/tech/dashboard', section: '主功能' },
  { label: '工作清單', icon: 'fa-regular fa-list-check', to: '/tech/worklist', section: '主功能' },
  { label: '待核發報告', icon: 'fa-regular fa-file-lines', to: '/tech/review', section: '主功能' },
  { label: '警報中心', icon: 'fa-regular fa-bell', to: '/tech/alerts', section: '系統' },
]

function handleLogout() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-muji-white">
    <AppSidebar
      role="technologist"
      :menu-items="menuItems"
      user-name="陳怡君"
      user-email="chen.yj@lisa-lab.com"
      @logout="handleLogout"
    />
    <main class="ml-60">
      <RouterView />
    </main>
  </div>
</template>
