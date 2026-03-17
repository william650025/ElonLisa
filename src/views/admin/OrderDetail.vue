<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePatientStore } from '@/stores/patient'
import { useTestItemStore } from '@/stores/testItem'
import type { OrderStatus } from '@/types'

const props = defineProps<{ id: string }>()

const router = useRouter()
const orderStore = useOrderStore()
const patientStore = usePatientStore()
const testItemStore = useTestItemStore()

const order = computed(() => orderStore.currentOrder)
const patient = computed(() =>
  order.value ? patientStore.getPatientById(order.value.patientId) : null
)
const testItems = computed(() =>
  order.value ? testItemStore.getTestItemsByIds(order.value.testItemIds) : []
)

const statusSteps = [
  { key: 'pending', label: '待處理' },
  { key: 'collected', label: '已採檢' },
  { key: 'testing', label: '檢驗中' },
  { key: 'completed', label: '已完成' },
]

const currentStatusIndex = computed(() => {
  if (!order.value) return 0
  return statusSteps.findIndex((s) => s.key === order.value!.status)
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-TW')
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

onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrderById(props.id),
    patientStore.fetchPatients(),
    testItemStore.fetchTestItems(),
  ])
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div>
      <button
        class="text-sm text-muji-text-light hover:text-muji-text transition-colors mb-2 inline-flex items-center gap-1"
        @click="router.push({ name: 'OrderList' })"
      >
        <i class="fa-regular fa-arrow-left text-xs"></i>
        返回醫令清單
      </button>
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-light text-muji-text tracking-tight">
          醫令詳情
        </h1>
        <span v-if="order" class="text-sm text-muji-text-light">{{ order.orderNumber }}</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="text-center py-16">
      <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
      <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
    </div>

    <template v-else-if="order">
      <!-- 狀態進度 -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <h2 class="text-sm font-medium text-muji-text-light tracking-widest uppercase mb-6">醫令進度</h2>
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          <template v-for="(step, index) in statusSteps" :key="step.key">
            <div class="flex flex-col items-center gap-2">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                  index <= currentStatusIndex
                    ? 'bg-muji-charcoal border-muji-charcoal text-muji-white'
                    : 'bg-white border-muji-border text-muji-text-light'
                ]"
              >
                <i v-if="index < currentStatusIndex" class="fa-regular fa-check text-sm"></i>
                <span v-else class="text-xs">{{ index + 1 }}</span>
              </div>
              <span :class="['text-xs', index <= currentStatusIndex ? 'text-muji-text font-medium' : 'text-muji-text-light']">
                {{ step.label }}
              </span>
            </div>
            <div
              v-if="index < statusSteps.length - 1"
              :class="['flex-1 h-px mx-4', index < currentStatusIndex ? 'bg-muji-charcoal' : 'bg-muji-border']"
            ></div>
          </template>
        </div>
      </div>

      <!-- 醫令資訊 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 病患資訊 -->
        <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-4">
          <h2 class="text-lg font-light text-muji-text tracking-tight">病患資訊</h2>
          <div class="space-y-3">
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">姓名</span>
              <span class="text-sm text-muji-text font-medium">{{ patient?.name || '-' }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">病歷號</span>
              <span class="text-sm text-muji-text">{{ patient?.medicalRecordNumber || '-' }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">性別</span>
              <span class="text-sm text-muji-text">{{ patient?.gender === 'M' ? '男' : patient?.gender === 'F' ? '女' : '其他' }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">出生日期</span>
              <span class="text-sm text-muji-text">{{ patient?.birthDate || '-' }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">電話</span>
              <span class="text-sm text-muji-text">{{ patient?.phone || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- 醫令資訊 -->
        <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-4">
          <h2 class="text-lg font-light text-muji-text tracking-tight">醫令資訊</h2>
          <div class="space-y-3">
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">狀態</span>
              <span class="text-sm text-muji-text font-medium">{{ getStatusLabel(order.status) }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">優先順序</span>
              <span :class="['text-sm', order.isUrgent ? 'text-muji-red font-medium' : 'text-muji-text']">
                {{ order.isUrgent ? '緊急' : '一般' }}
              </span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">開單醫師</span>
              <span class="text-sm text-muji-text">{{ order.physicianName }}</span>
            </div>
            <div class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">開單時間</span>
              <span class="text-sm text-muji-text">{{ formatDate(order.orderedAt) }}</span>
            </div>
            <div v-if="order.clinicalNotes" class="flex">
              <span class="w-24 text-sm text-muji-text-light flex-shrink-0">備註</span>
              <span class="text-sm text-muji-text">{{ order.clinicalNotes }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 檢驗項目 -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-muji-border">
          <h2 class="text-lg font-light text-muji-text tracking-tight">檢驗項目</h2>
        </div>
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muji-white border-b border-muji-border">
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">代碼</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">名稱</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">分類</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">檢體類型</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-muji-border">
            <tr v-for="item in testItems" :key="item.id" class="hover:bg-muji-white transition-colors">
              <td class="px-6 py-3.5 text-muji-text font-medium">{{ item.code }}</td>
              <td class="px-6 py-3.5 text-muji-text">{{ item.name }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ item.category }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ item.specimenType }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
