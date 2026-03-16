<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import type { MenuItem } from './AppSidebar.vue'

const router = useRouter()

const menuItems: MenuItem[] = [
  { label: '總覽', icon: 'fa-regular fa-grid-2', to: '/admin/dashboard', section: '主功能' },
  { label: '醫令管理', icon: 'fa-regular fa-file-lines', to: '/admin/orders', section: '主功能' },
  { label: '病患管理', icon: 'fa-regular fa-address-book', to: '/admin/patients', section: '主功能' },
]

function handleLogout() {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-muji-white">
    <AppSidebar
      role="admin"
      :menu-items="menuItems"
      user-name="王美華"
      user-email="wang.mh@lisa-lab.com"
      @logout="handleLogout"
    />
    <main class="ml-60">
      <RouterView />
    </main>
  </div>
</template>
