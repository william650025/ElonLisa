<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/report'
import { usePatientStore } from '@/stores/patient'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const reportStore = useReportStore()
const patientStore = usePatientStore()
const authStore = useAuthStore()

const publishedReports = computed(() =>
  reportStore.reports.filter((r) => r.status === 'final')
)

const pendingReportCount = computed(() =>
  reportStore.reports.filter((r) => r.status === 'reviewed').length
)

const latestReports = computed(() =>
  [...publishedReports.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
)

function getPatientName(patientId: string): string {
  const p = patientStore.getPatientById(patientId)
  return p ? p.name : patientId
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

onMounted(async () => {
  await Promise.all([
    reportStore.fetchReports(),
    patientStore.fetchPatients(),
  ])
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">
        {{ authStore.currentUser?.displayName || '您' }}，歡迎回來。
      </h1>
      <p class="text-sm text-muji-text-light mt-1">最近一次的檢驗結果，一目瞭然。</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">已完成報告</span>
          <i class="fa-regular fa-file-lines text-muji-linen text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-text tracking-tight leading-none mb-2">
          {{ publishedReports.length }}
        </div>
        <button
          class="text-xs text-muji-text-light hover:text-muji-text transition-colors"
          @click="router.push({ name: 'ReportList' })"
        >
          查看所有報告 <i class="fa-regular fa-arrow-right text-[10px] ml-0.5"></i>
        </button>
      </div>

      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">待查看報告</span>
          <i class="fa-regular fa-clock text-muji-linen text-base"></i>
        </div>
        <div class="text-[28px] font-light text-muji-text tracking-tight leading-none mb-2">
          {{ pendingReportCount }}
        </div>
        <span class="text-xs text-muji-text-light">等候查看中</span>
      </div>
    </div>

    <!-- Latest Reports -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm">
      <div class="flex items-center justify-between px-6 py-4 border-b border-muji-border">
        <h2 class="text-lg font-light text-muji-text tracking-tight">我的最新檢驗報告</h2>
        <button
          class="text-sm text-muji-text-light hover:text-muji-text transition-colors"
          @click="router.push({ name: 'ReportList' })"
        >
          查看全部 <i class="fa-regular fa-arrow-right text-xs ml-1"></i>
        </button>
      </div>

      <div v-if="reportStore.loading" class="px-6 py-12 text-center">
        <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
        <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
      </div>

      <div v-else-if="latestReports.length > 0" class="divide-y divide-muji-border">
        <div
          v-for="report in latestReports"
          :key="report.id"
          class="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-muji-white transition-colors duration-150"
          @click="router.push({ name: 'ReportDetail', params: { id: report.id } })"
        >
          <div>
            <p class="text-sm text-muji-text font-medium">{{ report.reportNumber }}</p>
            <p class="text-xs text-muji-text-light mt-0.5">{{ getPatientName(report.patientId) }} · {{ formatDate(report.createdAt) }}</p>
          </div>
          <button class="text-xs text-muji-text-light hover:text-muji-text transition-colors">
            查看 <i class="fa-regular fa-arrow-right text-[10px] ml-0.5"></i>
          </button>
        </div>
      </div>

      <div v-else class="px-6 py-12 text-center">
        <i class="fa-regular fa-file-lines text-muji-linen text-2xl block mb-3"></i>
        <p class="text-sm text-muji-text-light">尚無相關紀錄。</p>
      </div>
    </div>
  </div>
</template>
