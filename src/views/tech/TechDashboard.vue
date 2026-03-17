<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { useReportStore } from '@/stores/report'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const orderStore = useOrderStore()
const reportStore = useReportStore()
const authStore = useAuthStore()

const pendingCount = computed(() =>
  orderStore.orders.filter((o) => o.status === 'pending' || o.status === 'collected').length
)
const inProgressCount = computed(() =>
  orderStore.orders.filter((o) => o.status === 'testing').length
)
const criticalCount = computed(() =>
  orderStore.orders.filter((o) => o.isUrgent && (o.status === 'pending' || o.status === 'collected')).length
)

const priorityQueue = computed(() => {
  return [...orderStore.orders]
    .filter((o) => o.status !== 'completed' && o.status !== 'cancelled')
    .sort((a, b) => {
      if (a.isUrgent && !b.isUrgent) return -1
      if (!a.isUrgent && b.isUrgent) return 1
      return new Date(a.orderedAt).getTime() - new Date(b.orderedAt).getTime()
    })
    .slice(0, 5)
})

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '待處理', collected: '已採檢', testing: '檢驗中',
    completed: '已完成', cancelled: '已取消',
  }
  return map[status] || status
}

onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrders(),
    reportStore.fetchReports(),
  ])
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- 問候 -->
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">
        {{ authStore.currentUser?.displayName || '醫檢師' }}，您好。
      </h1>
      <p class="text-sm text-muji-text-light mt-1">您今日需要處理的所有檢驗項目清單，按優先順序排序。</p>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Active Worklist -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">待處理</span>
          <i class="fa-regular fa-clock text-muji-linen text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-text tracking-tight leading-none mb-2">{{ pendingCount }}</div>
        <button
          class="text-xs text-muji-text-light hover:text-muji-text transition-colors"
          @click="router.push({ name: 'Worklist' })"
        >
          查看工作清單 <i class="fa-solid fa-arrow-right text-[10px] ml-0.5"></i>
        </button>
      </div>

      <!-- In Progress -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">進行中</span>
          <i class="fa-solid fa-flask text-muji-linen text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-text tracking-tight leading-none mb-2">{{ inProgressCount }}</div>
        <span class="text-xs text-muji-text-light">正在檢驗中</span>
      </div>

      <!-- Critical Alerts -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6"
           :class="criticalCount > 0 ? 'border-muji-red/30' : ''">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">緊急警示</span>
          <i class="fa-solid fa-triangle-exclamation text-muji-red text-base"></i>
        </div>
        <div :class="['text-[28px] font-light tracking-tight leading-none mb-2', criticalCount > 0 ? 'text-muji-red' : 'text-muji-text']">
          {{ criticalCount }}
        </div>
        <span class="text-xs text-muji-text-light">未解決警報</span>
      </div>
    </div>

    <!-- Priority Queue -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-muji-border">
        <h2 class="text-lg font-light text-muji-text tracking-tight">今日優先處理</h2>
        <button
          class="text-sm text-muji-text-light hover:text-muji-text transition-colors"
          @click="router.push({ name: 'Worklist' })"
        >
          查看全部 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
        </button>
      </div>

      <div v-if="orderStore.loading" class="px-6 py-12 text-center">
        <i class="fa-solid fa-spinner fa-spin text-muji-linen text-lg"></i>
        <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
      </div>

      <div v-else-if="priorityQueue.length > 0" class="divide-y divide-muji-border">
        <div
          v-for="order in priorityQueue"
          :key="order.id"
          :class="[
            'flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors duration-150',
            order.isUrgent ? 'bg-[#FDF1F1]/30 hover:bg-[#FDF1F1]/60' : 'hover:bg-muji-white'
          ]"
          @click="router.push({ name: 'ResultInput', params: { id: order.id } })"
        >
          <div v-if="order.isUrgent" class="flex-shrink-0">
            <i class="fa-solid fa-flag text-muji-red text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-muji-text font-medium">{{ order.orderNumber }}</p>
            <p class="text-xs text-muji-text-light mt-0.5">
              {{ order.isUrgent ? 'STAT' : '一般' }} · {{ getStatusLabel(order.status) }}
            </p>
          </div>
          <span class="text-xs text-muji-text-light">{{ formatTime(order.orderedAt) }}</span>
          <button class="text-xs text-muji-text-light hover:text-muji-text transition-colors px-3 py-1 border border-muji-border rounded-sm">
            處理
          </button>
        </div>
      </div>

      <div v-else class="px-6 py-12 text-center">
        <i class="fa-solid fa-circle-check text-success text-xl mb-2"></i>
        <p class="text-sm text-muji-text-light">沒有待處理的檢驗。</p>
      </div>
    </div>

    <!-- 待審核報告 -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-muji-border">
        <h2 class="text-lg font-light text-muji-text tracking-tight">報告審核概況</h2>
        <button
          class="text-sm text-muji-text-light hover:text-muji-text transition-colors"
          @click="router.push({ name: 'ReviewList' })"
        >
          查看全部 <i class="fa-solid fa-arrow-right text-xs ml-1"></i>
        </button>
      </div>
      <div class="px-6 py-4">
        <p class="text-sm text-muji-text-light">
          <span class="text-lg font-light text-muji-text mr-2">{{ reportStore.pendingReviews.length }}</span>
          份報告等待審核
        </p>
      </div>
    </div>
  </div>
</template>
