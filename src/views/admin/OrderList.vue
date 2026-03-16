<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePatientStore } from '@/stores/patient'
import type { OrderStatus } from '@/types'

const router = useRouter()
const orderStore = useOrderStore()
const patientStore = usePatientStore()

const statusTabs: { label: string; value: OrderStatus | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '待處理', value: 'pending' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
]

onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrders(),
    patientStore.fetchPatients(),
  ])
})

function getPatientName(patientId: string): string {
  const patient = patientStore.getPatientById(patientId)
  return patient ? patient.name : patientId
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

function getStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: '待處理',
    collected: '已採檢',
    testing: '檢驗中',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function getStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: 'bg-warning-bg text-warning border-warning/20',
    collected: 'bg-info-bg text-info border-info/20',
    testing: 'bg-info-bg text-info border-info/20',
    completed: 'bg-success-bg text-success border-success/20',
    cancelled: 'bg-muji-white text-muji-text-light border-muji-border',
  }
  return map[status] || ''
}

function goToCreateOrder() {
  router.push({ name: 'OrderCreate' })
}

function goToOrderDetail(id: string) {
  router.push({ name: 'OrderDetail', params: { id } })
}
</script>

<template>
  <div class="p-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-light text-muji-text tracking-tight">醫令管理</h1>
        <p class="text-sm text-muji-text-light mt-1">管理所有檢驗醫令。</p>
      </div>
      <button
        @click="goToCreateOrder"
        class="inline-flex items-center gap-2 px-5 py-2.5
               bg-muji-charcoal text-muji-white
               text-sm font-medium tracking-wide
               rounded-sm border border-muji-charcoal
               transition-all duration-200 ease-in-out
               hover:bg-muji-text hover:border-muji-text
               active:scale-[0.98]"
      >
        <i class="fa-regular fa-plus text-xs"></i>
        新增醫令
      </button>
    </div>

    <!-- 搜尋與篩選 -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="fa-regular fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen"></i>
        <input
          v-model="orderStore.searchQuery"
          type="text"
          placeholder="搜尋醫令編號、病患..."
          class="w-full pl-9 pr-3 py-2.5
                 bg-white text-muji-text text-sm
                 border border-muji-border rounded-sm
                 placeholder:text-muji-linen
                 transition-all duration-200
                 focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal
                 hover:border-muji-linen"
        />
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex items-center gap-1 border-b border-muji-border">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        @click="orderStore.statusFilter = tab.value"
        :class="[
          'px-4 py-2.5 text-sm transition-colors duration-150 border-b-2 -mb-px',
          orderStore.statusFilter === tab.value
            ? 'text-muji-text border-muji-charcoal font-medium'
            : 'text-muji-text-light border-transparent hover:text-muji-text hover:border-muji-linen'
        ]"
      >
        {{ tab.label }}
        <span
          v-if="tab.value === 'all'"
          class="ml-1.5 text-2xs text-muji-text-light"
        >{{ orderStore.orders.length }}</span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm overflow-hidden">
      <!-- Loading -->
      <div v-if="orderStore.loading" class="px-6 py-12 text-center">
        <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
        <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
      </div>

      <!-- Table Content -->
      <table v-else-if="orderStore.filteredOrders.length > 0" class="w-full text-sm">
        <thead>
          <tr class="bg-muji-white border-b border-muji-border">
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">醫令編號</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">病患姓名</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">優先順序</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">狀態</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">開單日期</th>
            <th class="px-6 py-3 text-right text-2xs font-medium tracking-widest uppercase text-muji-text-light">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-muji-border">
          <tr
            v-for="order in orderStore.filteredOrders"
            :key="order.id"
            @click="goToOrderDetail(order.id)"
            :class="[
              'transition-colors duration-150 cursor-pointer',
              order.isUrgent && order.status === 'pending' ? 'bg-[#FDF1F1]/30' : 'hover:bg-muji-white'
            ]"
          >
            <td class="px-6 py-3.5 text-muji-text font-normal">{{ order.orderNumber }}</td>
            <td class="px-6 py-3.5 text-muji-text">{{ getPatientName(order.patientId) }}</td>
            <td class="px-6 py-3.5">
              <span
                v-if="order.isUrgent"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide bg-[#FDF1F1] text-muji-red border border-muji-red/20"
              >
                <i class="fa-regular fa-triangle-exclamation text-[10px]"></i>
                緊急
              </span>
              <span v-else class="text-sm text-muji-text-light">一般</span>
            </td>
            <td class="px-6 py-3.5">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide border',
                  getStatusClass(order.status)
                ]"
              >
                <i class="fa-solid fa-circle text-[6px]"></i>
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-3.5 text-muji-text-light">{{ formatDate(order.orderedAt) }}</td>
            <td class="px-6 py-3.5 text-right">
              <button class="text-xs text-muji-text-light hover:text-muji-text transition-colors">
                查看 <i class="fa-regular fa-arrow-right text-[10px] ml-0.5"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty -->
      <div v-else class="px-6 py-12 text-center">
        <i class="fa-regular fa-folder-open text-muji-linen text-2xl block mb-3"></i>
        <p class="text-sm text-muji-text-light">沒有找到符合您條件的資料。</p>
        <p class="text-xs text-muji-linen mt-1">請嘗試其他關鍵字或調整篩選條件。</p>
      </div>
    </div>
  </div>
</template>
