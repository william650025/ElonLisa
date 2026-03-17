<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePatientStore } from '@/stores/patient'

const router = useRouter()
const orderStore = useOrderStore()
const patientStore = usePatientStore()

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

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
}

function goToCreateOrder() {
  router.push({ name: 'OrderCreate' })
}

function goToOrders() {
  router.push({ name: 'OrderList' })
}

function goToOrderDetail(id: string) {
  router.push({ name: 'OrderDetail', params: { id } })
}
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- 頁面標題 -->
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">待處理醫令概覽</h1>
      <p class="text-sm text-muji-text-light mt-1">快速查看所有尚未處理的醫令，掌握最新進度。</p>
    </div>

    <!-- 統計卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Orders -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
            總醫令數
          </span>
          <i class="fa-regular fa-folder-open text-muji-linen text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-text tracking-tight leading-none mb-2">
          {{ orderStore.orderStats.total }}
        </div>
        <span class="text-xs text-muji-text-light">今日所有醫令</span>
      </div>

      <!-- Pending -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
            待處理
          </span>
          <i class="fa-regular fa-clock text-muji-linen text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-text tracking-tight leading-none mb-2">
          {{ orderStore.orderStats.pending }}
        </div>
        <span class="text-xs text-muji-text-light">等候處理中</span>
      </div>

      <!-- Critical -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
            緊急件
          </span>
          <i class="fa-regular fa-triangle-exclamation text-muji-red text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-red tracking-tight leading-none mb-2">
          {{ orderStore.orderStats.critical }}
        </div>
        <span class="text-xs text-muji-text-light">需立即處理</span>
      </div>
    </div>

    <!-- 最近醫令列表 -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-muji-border">
        <h2 class="text-lg font-light text-muji-text tracking-tight">近期醫令</h2>
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5
                 bg-muji-charcoal text-muji-white
                 text-sm font-medium tracking-wide
                 rounded-sm border border-muji-charcoal
                 transition-all duration-200 ease-in-out
                 hover:bg-muji-text hover:border-muji-text
                 active:scale-[0.98]"
          @click="goToCreateOrder"
        >
          <i class="fa-regular fa-plus text-xs"></i>
          新增醫令
        </button>
      </div>

      <!-- Loading -->
      <div v-if="orderStore.loading" class="px-6 py-12 text-center">
        <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
        <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
      </div>

      <!-- 表格 -->
      <div v-else-if="orderStore.orders.length > 0" class="overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muji-white border-b border-muji-border">
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">醫令編號</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">病患</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">狀態</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">時間</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-muji-border">
            <tr
              v-for="order in orderStore.orders.slice(0, 5)"
              :key="order.id"
              class="transition-colors duration-150 hover:bg-muji-white cursor-pointer"
              @click="goToOrderDetail(order.id)"
            >
              <td class="px-6 py-3.5 text-muji-text font-normal">{{ order.orderNumber }}</td>
              <td class="px-6 py-3.5 text-muji-text">{{ getPatientName(order.patientId) }}</td>
              <td class="px-6 py-3.5">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide border',
                    order.status === 'pending' ? 'bg-warning-bg text-warning border-warning/20' :
                    order.status === 'completed' ? 'bg-success-bg text-success border-success/20' :
                    order.status === 'cancelled' ? 'bg-muji-white text-muji-text-light border-muji-border' :
                    'bg-info-bg text-info border-info/20'
                  ]"
                >
                  <i class="fa-solid fa-circle text-[6px]"></i>
                  {{ order.status === 'pending' ? '待處理' : order.status === 'completed' ? '已完成' : order.status === 'cancelled' ? '已取消' : '處理中' }}
                </span>
              </td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ formatTime(order.orderedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 空狀態 -->
      <div v-else class="px-6 py-12 text-center">
        <i class="fa-regular fa-folder-open text-muji-linen text-2xl mb-3"></i>
        <p class="text-sm text-muji-text-light">沒有待處理的醫令。</p>
        <p class="text-xs text-muji-linen mt-1">點擊「新增醫令」開始建立新的醫令。</p>
      </div>

      <!-- 查看全部 -->
      <div v-if="orderStore.orders.length > 5" class="px-6 py-4 border-t border-muji-border text-right">
        <button
          class="text-sm text-muji-text-light hover:text-muji-text transition-colors duration-150"
          @click="goToOrders"
        >
          查看全部醫令 <i class="fa-regular fa-arrow-right text-xs ml-1"></i>
        </button>
      </div>
    </div>
  </div>
</template>
