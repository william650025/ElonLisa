<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { UserRole } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const roles = [
  {
    key: 'admin' as UserRole,
    icon: 'fa-regular fa-user-tie',
    title: '行政人員',
    subtitle: 'Admin Staff',
    route: '/admin/dashboard',
  },
  {
    key: 'technologist' as UserRole,
    icon: 'fa-regular fa-microscope',
    title: '醫檢師',
    subtitle: 'Medical Technologist',
    route: '/tech/dashboard',
  },
  {
    key: 'client' as UserRole,
    icon: 'fa-regular fa-building',
    title: '客戶',
    subtitle: 'Client',
    route: '/client/dashboard',
  },
]

function selectRole(role: typeof roles[0]) {
  authStore.selectRole(role.key)
  router.push(role.route)
}
</script>

<template>
  <div class="min-h-screen bg-muji-white flex flex-col items-center justify-center px-4">
    <!-- 留白 -->
    <div class="mb-12 text-center">
      <h1 class="text-2xl font-light text-muji-text tracking-[0.15em] uppercase">LISA</h1>
      <p class="text-xs text-muji-text-light tracking-wide mt-1">Laboratory Information System</p>
      <div class="w-16 h-px bg-muji-border mx-auto mt-4"></div>
    </div>

    <p class="text-sm text-muji-text-light mb-10">請選擇您的身份</p>

    <!-- Role Cards -->
    <div class="flex flex-wrap justify-center gap-6">
      <button
        v-for="role in roles"
        :key="role.key"
        class="w-44 h-56 flex flex-col items-center justify-center gap-4
               bg-muji-cream border border-muji-border rounded-sm
               transition-all duration-200 ease-in-out
               hover:border-muji-linen hover:-translate-y-0.5 hover:shadow-sm
               active:scale-[0.98]
               focus:outline-none focus:ring-2 focus:ring-muji-charcoal focus:ring-offset-2 focus:ring-offset-muji-white"
        @click="selectRole(role)"
      >
        <i :class="[role.icon, 'text-2xl text-muji-charcoal']"></i>
        <div class="text-center">
          <p class="text-base font-light text-muji-text tracking-wide">{{ role.title }}</p>
          <p class="text-xs text-muji-text-light mt-0.5">{{ role.subtitle }}</p>
        </div>
      </button>
    </div>

    <!-- Footer -->
    <p class="mt-16 text-xs text-muji-linen">LISA MVP Demo v1.0</p>
  </div>
</template>
