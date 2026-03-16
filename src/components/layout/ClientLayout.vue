<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const notifyStore = useNotificationStore()

const navItems = [
  { path: '/client/dashboard', icon: 'fa-regular fa-grid-2', label: '儀表板' },
  { path: '/client/reports', icon: 'fa-regular fa-file-lines', label: '我的報告' },
]

const currentPath = computed(() => route.path)

function isActive(path: string): boolean {
  return currentPath.value.startsWith(path)
}

function logout() {
  authStore.logout()
  router.push({ name: 'RoleSelector' })
}
</script>

<template>
  <div class="min-h-screen bg-muji-white flex">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-60
                  bg-muji-white border-r border-muji-border
                  flex flex-col shadow-xs z-30">
      <div class="px-6 py-5 border-b border-muji-border">
        <span class="text-base font-light text-muji-text tracking-[0.15em] uppercase">LISA</span>
        <p class="text-2xs text-muji-text-light tracking-wide mt-0.5">Laboratory Info. Sys.</p>
      </div>

      <nav class="flex-1 px-3 py-4 overflow-y-auto">
        <div class="px-3 mb-2">
          <span class="text-[10px] font-medium tracking-[0.12em] uppercase text-muji-linen">報告查詢</span>
        </div>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 mb-0.5 text-sm rounded-sm border-l-2 transition-all duration-150',
            isActive(item.path)
              ? 'text-muji-text font-medium bg-muji-cream border-muji-charcoal'
              : 'text-muji-text-light hover:text-muji-text hover:bg-muji-cream/60 border-transparent'
          ]"
        >
          <i :class="[item.icon, 'text-sm w-4 text-center']"></i>
          {{ item.label }}
        </router-link>
      </nav>

      <div class="px-4 py-4 border-t border-muji-border">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-sm bg-muji-cream flex items-center justify-center">
            <i class="fa-regular fa-user text-xs text-muji-text-light"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-muji-text truncate">{{ authStore.currentUser?.displayName }}</p>
            <p class="text-2xs text-muji-text-light truncate">{{ authStore.roleDisplayName }}</p>
          </div>
          <button @click="logout" class="text-muji-linen hover:text-muji-charcoal transition-colors p-1">
            <i class="fa-regular fa-arrow-right-from-bracket text-xs"></i>
          </button>
        </div>
      </div>
    </aside>

    <div class="ml-60 flex-1 flex flex-col min-h-screen">
      <header class="h-14 bg-white border-b border-muji-border flex items-center px-6 gap-4 shadow-xs sticky top-0 z-20">
        <div class="flex-1">
          <h1 class="text-lg font-light text-muji-text tracking-tight">{{ (route.meta.title as string) || '客戶入口' }}</h1>
        </div>
        <span class="text-xs text-muji-text-light">{{ new Date().toLocaleDateString('zh-TW') }}</span>
      </header>

      <main class="flex-1 bg-muji-white">
        <router-view />
      </main>
    </div>

    <!-- Toasts -->
    <div class="fixed bottom-6 right-6 z-50 space-y-2">
      <div
        v-for="toast in notifyStore.toasts"
        :key="toast.id"
        :class="[
          'flex items-start gap-3 px-4 py-3 rounded-sm bg-white border shadow-sm max-w-xs animate-slide-up',
          toast.type === 'success' ? 'border-l-4 border-l-success border-muji-border' :
          toast.type === 'warning' ? 'border-l-4 border-l-warning border-muji-border' :
          toast.type === 'error' ? 'border-l-4 border-l-muji-charcoal border-muji-border' :
          'border-l-4 border-l-muji-red border-muji-red/20 bg-[#FDF1F1]'
        ]"
      >
        <p class="text-sm text-muji-text flex-1">{{ toast.message }}</p>
        <button @click="notifyStore.removeToast(toast.id)" class="text-muji-linen hover:text-muji-text flex-shrink-0">
          <i class="fa-regular fa-xmark text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
