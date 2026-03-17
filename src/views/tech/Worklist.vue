<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePatientStore } from '@/stores/patient'
import type { OrderStatus } from '@/types'

const router = useRouter()
const orderStore = useOrderStore()
const patientStore = usePatientStore()

const searchQuery = ref('')
const statusFilter = ref<string>('all')
const sortBy = ref<'priority' | 'time'>('priority')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待處理', value: 'pending' },
  { label: '進行中', value: 'testing' },
  { label: '已完成', value: 'completed' },
]

const worklistOrders = computed(() => {
  let result = [...orderStore.orders]

  // Status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((o) => o.status === statusFilter.value)
  }

  // Search
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((o) => {
      const patient = patientStore.getPatientById(o.patientId)
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        (patient && patient.name.toLowerCase().includes(q))
      )
    })
  }

  // Sort
  result.sort((a, b) => {
    if (sortBy.value === 'priority') {
      if (a.isUrgent && !b.isUrgent) return -1
      if (!a.isUrgent && b.isUrgent) return 1
    }
    return new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime()
  })

  return result
})

const pendingCount = computed(() => orderStore.orders.filter((o) => o.status === 'pending' || o.status === 'collected').length)
const criticalCount = computed(() => orderStore.orders.filter((o) => o.isUrgent && o.status !== 'completed' && o.status !== 'cancelled').length)

function getPatientName(patientId: string): string {
  const p = patientStore.getPatientById(patientId)
  return p ? p.name : patientId
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
}

function getStatusLabel(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    pending: '待處理', collected: '已採檢', testing: '檢驗中',
    completed: '已完成', cancelled: '已取消',
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

function getActionLabel(status: OrderStatus): string {
  if (status === 'pending' || status === 'collected') return '處理'
  if (status === 'testing') return '繼續'
  return '查看'
}

function goToResultInput(orderId: string) {
  router.push({ name: 'ResultInput', params: { id: orderId } })
}

onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrders(),
    patientStore.fetchPatients(),
  ])
})
</script>

<template>
  <div class="p-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-light text-muji-text tracking-tight">工作清單</h1>
        <p class="text-sm text-muji-text-light mt-1">管理您的檢驗工作項目。</p>
      </div>
      <div class="flex items-center gap-4 text-sm text-muji-text-light">
        <span>待處理：<span class="text-muji-text font-medium">{{ pendingCount }}</span></span>
        <span :class="criticalCount > 0 ? 'text-muji-red' : ''">
          緊急：<span class="font-medium">{{ criticalCount }}</span>
        </span>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="fa-regular fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜尋..."
          class="w-full pl-9 pr-3 py-2.5
                 bg-white text-muji-text text-sm
                 border border-muji-border rounded-sm
                 placeholder:text-muji-linen
                 transition-all duration-200
                 focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
        />
      </div>
      <select
        v-model="sortBy"
        class="px-3 py-2.5 bg-white text-muji-text text-sm
               border border-muji-border rounded-sm
               focus:outline-none focus:border-muji-charcoal"
      >
        <option value="priority">依優先順序</option>
        <option value="time">依時間</option>
      </select>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 border-b border-muji-border">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="[
          'px-4 py-2.5 text-sm transition-colors duration-150 border-b-2 -mb-px',
          statusFilter === tab.value
            ? 'text-muji-text border-muji-charcoal font-medium'
            : 'text-muji-text-light border-transparent hover:text-muji-text'
        ]"
        @click="statusFilter = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm overflow-hidden">
      <div v-if="orderStore.loading" class="px-6 py-12 text-center">
        <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
        <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
      </div>

      <table v-else-if="worklistOrders.length > 0" class="w-full text-sm">
        <thead>
          <tr class="bg-muji-white border-b border-muji-border">
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">檢體編號</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">病患姓名</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">優先順序</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">狀態</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">時間</th>
            <th class="px-6 py-3 text-right text-2xs font-medium tracking-widest uppercase text-muji-text-light">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-muji-border">
          <tr
            v-for="order in worklistOrders"
            :key="order.id"
            :class="[
              'transition-colors duration-150 cursor-pointer',
              order.isUrgent && order.status !== 'completed' ? 'bg-[#FDF1F1]/30 border-l-2 border-l-muji-red' : 'hover:bg-muji-white border-l-2 border-l-transparent'
            ]"
            @click="goToResultInput(order.id)"
          >
            <td class="px-6 py-3.5 text-muji-text font-normal">{{ order.orderNumber }}</td>
            <td class="px-6 py-3.5 text-muji-text">{{ getPatientName(order.patientId) }}</td>
            <td class="px-6 py-3.5">
              <span v-if="order.isUrgent" class="inline-flex items-center gap-1 text-muji-red text-xs font-medium">
                <i class="fa-regular fa-flag text-[10px]"></i>
                STAT
              </span>
              <span v-else class="text-muji-text-light text-xs">Routine</span>
            </td>
            <td class="px-6 py-3.5">
              <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide border', getStatusClass(order.status)]">
                <i class="fa-solid fa-circle text-[6px]"></i>
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-6 py-3.5 text-muji-text-light">{{ formatTime(order.orderedAt) }}</td>
            <td class="px-6 py-3.5 text-right">
              <button class="px-3 py-1 text-xs border border-muji-border rounded-sm text-muji-text-light hover:text-muji-text hover:border-muji-linen transition-colors">
                {{ getActionLabel(order.status) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="px-6 py-12 text-center">
        <i class="fa-regular fa-flask text-muji-linen text-2xl block mb-3"></i>
        <p class="text-sm text-muji-text-light">沒有檢驗結果等待輸入。</p>
      </div>
    </div>
  </div>
</template>
