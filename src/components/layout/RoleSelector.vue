<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const roles = [
  {
    key: 'admin',
    label: '行政人員',
    sublabel: 'Admin Staff',
    icon: 'fa-regular fa-user-tie',
    description: '醫令開單、病患管理',
    to: '/admin/dashboard',
  },
  {
    key: 'tech',
    label: '醫檢師',
    sublabel: 'Medical Technologist',
    icon: 'fa-regular fa-microscope',
    description: '檢驗值輸入、報告核發',
    to: '/tech/dashboard',
  },
  {
    key: 'client',
    label: '客戶',
    sublabel: 'Client',
    icon: 'fa-regular fa-building',
    description: '報告查看、歷史趨勢',
    to: '/client/dashboard',
  },
]

function selectRole(to: string) {
  router.push(to)
}
</script>

<template>
  <div class="min-h-screen bg-muji-white flex flex-col items-center justify-center px-4">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-2xl font-light text-muji-text tracking-[0.15em] uppercase mb-2">LISA</h1>
      <div class="w-12 h-px bg-muji-border mx-auto mb-3" />
      <p class="text-sm text-muji-text-light tracking-wide">Laboratory Information System</p>
    </div>

    <!-- Subtitle -->
    <p class="text-sm text-muji-text-light mb-10 tracking-wide">請選擇您的身份</p>

    <!-- Role Cards -->
    <div class="flex gap-6">
      <button
        v-for="role in roles"
        :key="role.key"
        class="group w-[180px] bg-white rounded-sm border border-muji-border shadow-sm p-6 text-center transition-all duration-200 hover:border-muji-linen hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-muji-charcoal focus:ring-offset-2 focus:ring-offset-muji-white"
        @click="selectRole(role.to)"
      >
        <i
          :class="[role.icon, 'text-2xl text-muji-charcoal mb-4 block group-hover:text-muji-text transition-colors']"
        />
        <p class="text-base font-normal text-muji-text mb-0.5 tracking-wide">{{ role.label }}</p>
        <p class="text-2xs text-muji-text-light tracking-wide mb-3">{{ role.sublabel }}</p>
        <p class="text-xs text-muji-linen leading-relaxed">{{ role.description }}</p>
      </button>
    </div>

    <!-- Footer -->
    <p class="mt-16 text-2xs text-muji-linen tracking-wide">LISA MVP Demo v1.0</p>
  </div>
</template>
