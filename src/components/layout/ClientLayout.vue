<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import type { MenuItem } from './AppSidebar.vue'

const router = useRouter()

const menuItems: MenuItem[] = [
  { label: '總覽', icon: 'fa-regular fa-grid-2', to: '/client/dashboard', section: '主功能' },
  { label: '報告查詢', icon: 'fa-regular fa-file-lines', to: '/client/reports', section: '主功能' },
]

function handleLogout() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-muji-white">
    <AppSidebar
      role="client"
      :menu-items="menuItems"
      user-name="張明德醫師"
      user-email="chang.md@hospital.com"
      @logout="handleLogout"
    />
    <main class="ml-60">
      <RouterView />
    </main>
  </div>
</template>
