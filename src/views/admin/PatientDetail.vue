<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePatientStore } from '@/stores/patient'
import { useOrderStore } from '@/stores/order'

const route = useRoute()
const router = useRouter()
const patientStore = usePatientStore()
const orderStore = useOrderStore()

const patientId = computed(() => route.params.id as string)
const patient = computed(() => patientStore.currentPatient)

const patientOrders = computed(() =>
  orderStore.orders
    .filter((o) => o.patientId === patientId.value)
    .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
)

function getGenderLabel(gender: string): string {
  const map: Record<string, string> = { male: '男', female: '女', other: '其他' }
  return map[gender] || gender
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '待處理', collected: '已採檢', testing: '檢驗中',
    completed: '已完成', cancelled: '已取消',
  }
  return map[status] || status
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    pending: 'text-amber-700 bg-amber-50',
    collected: 'text-blue-700 bg-blue-50',
    testing: 'text-blue-700 bg-blue-50',
    completed: 'text-green-700 bg-green-50',
    cancelled: 'text-gray-500 bg-gray-100',
  }
  return map[status] || ''
}

function goBack() {
  router.push({ name: 'PatientList' })
}

onMounted(async () => {
  await Promise.all([
    patientStore.fetchPatientById(patientId.value),
    orderStore.fetchOrders(),
  ])
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Back -->
    <button
      class="text-sm text-muji-text-light hover:text-muji-text transition-colors"
      @click="goBack"
    >
      ← 返回病患列表
    </button>

    <template v-if="patient">
      <!-- Patient Info -->
      <div>
        <h1 class="text-2xl font-light text-muji-text tracking-tight">{{ patient.name }}</h1>
        <p class="text-sm text-muji-text-light mt-1">病歷號 {{ patient.medicalRecordNumber }}</p>
      </div>

      <div class="border border-muji-border rounded-sm bg-muji-white">
        <div class="px-5 py-4 border-b border-muji-border">
          <h2 class="text-sm font-medium text-muji-text">基本資料</h2>
        </div>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-px bg-muji-border">
          <div class="bg-muji-white px-5 py-4">
            <p class="text-xs text-muji-text-light">性別</p>
            <p class="text-sm text-muji-text mt-1">{{ getGenderLabel(patient.gender) }}</p>
          </div>
          <div class="bg-muji-white px-5 py-4">
            <p class="text-xs text-muji-text-light">生日</p>
            <p class="text-sm text-muji-text mt-1">{{ formatDate(patient.birthDate) }}</p>
          </div>
          <div class="bg-muji-white px-5 py-4">
            <p class="text-xs text-muji-text-light">身份證號</p>
            <p class="text-sm text-muji-text mt-1 font-mono text-xs">{{ patient.nationalId }}</p>
          </div>
          <div class="bg-muji-white px-5 py-4">
            <p class="text-xs text-muji-text-light">電話</p>
            <p class="text-sm text-muji-text mt-1">{{ patient.phone }}</p>
          </div>
          <div class="bg-muji-white px-5 py-4">
            <p class="text-xs text-muji-text-light">Email</p>
            <p class="text-sm text-muji-text mt-1">{{ patient.email || '—' }}</p>
          </div>
          <div class="bg-muji-white px-5 py-4">
            <p class="text-xs text-muji-text-light">地址</p>
            <p class="text-sm text-muji-text mt-1">{{ patient.address || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Orders History -->
      <div class="border border-muji-border rounded-sm bg-muji-white overflow-hidden">
        <div class="px-5 py-4 border-b border-muji-border">
          <h2 class="text-sm font-medium text-muji-text">歷史檢驗紀錄</h2>
        </div>
        <table v-if="patientOrders.length > 0" class="w-full text-sm">
          <thead>
            <tr class="border-b border-muji-border text-left text-xs text-muji-text-light uppercase tracking-wide">
              <th class="px-5 py-3">日期</th>
              <th class="px-5 py-3">醫令編號</th>
              <th class="px-5 py-3">狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in patientOrders"
              :key="order.id"
              class="border-b border-muji-border last:border-b-0"
            >
              <td class="px-5 py-3 text-muji-text-light">{{ formatDate(order.orderedAt) }}</td>
              <td class="px-5 py-3 text-muji-text font-mono text-xs">{{ order.id }}</td>
              <td class="px-5 py-3">
                <span
                  :class="getStatusClass(order.status)"
                  class="inline-block px-2 py-0.5 rounded text-xs"
                >
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="px-5 py-12 text-center text-muji-text-light">
          尚無檢驗紀錄
        </div>
      </div>
    </template>

    <!-- Loading -->
    <div v-else class="text-center text-muji-text-light py-12">
      載入中...
    </div>
  </div>
</template>
