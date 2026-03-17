<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useReportStore } from '@/stores/report'
import { usePatientStore } from '@/stores/patient'
import type { ReportStatus } from '@/types'

const reportStore = useReportStore()
const patientStore = usePatientStore()

const statusFilter = ref<ReportStatus | ''>('')

const statusOptions: { value: ReportStatus | ''; label: string }[] = [
  { value: '', label: '全部狀態' },
  { value: 'draft', label: '草稿' },
  { value: 'reviewed', label: '已審核' },
  { value: 'final', label: '已核發' },
]

const filteredReports = computed(() => {
  let result = reportStore.filteredReports
  if (statusFilter.value) {
    result = result.filter((r) => r.status === statusFilter.value)
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const statusCounts = computed(() => {
  const counts = { all: reportStore.reports.length, draft: 0, reviewed: 0, final: 0 }
  for (const r of reportStore.reports) {
    if (r.status in counts) {
      counts[r.status as keyof typeof counts]++
    }
  }
  return counts
})

function getPatientName(patientId: string): string {
  const p = patientStore.getPatientById(patientId)
  return p ? p.name : patientId
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: '草稿',
    reviewed: '已審核',
    final: '已核發',
  }
  return map[status] || status
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    draft: 'bg-muji-white text-muji-text-light border-muji-border',
    reviewed: 'bg-info-bg text-info border-info/20',
    final: 'bg-success-bg text-success border-success/20',
  }
  return map[status] || ''
}

onMounted(async () => {
  await Promise.all([
    reportStore.fetchReports(),
    patientStore.fetchPatients(),
  ])
})
</script>

<template>
  <div class="p-8 space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">報告管理</h1>
      <p class="text-sm text-muji-text-light mt-1">管理所有檢驗報告的審核與發放。</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white rounded-sm border border-muji-border shadow-sm px-5 py-4">
        <p class="text-2xs text-muji-text-light uppercase tracking-widest">全部報告</p>
        <p class="text-2xl font-light text-muji-text mt-1">{{ statusCounts.all }}</p>
      </div>
      <div class="bg-white rounded-sm border border-muji-border shadow-sm px-5 py-4">
        <p class="text-2xs text-muji-text-light uppercase tracking-widest">草稿</p>
        <p class="text-2xl font-light text-muji-text mt-1">{{ statusCounts.draft }}</p>
      </div>
      <div class="bg-white rounded-sm border border-muji-border shadow-sm px-5 py-4">
        <p class="text-2xs text-muji-text-light uppercase tracking-widest">已審核</p>
        <p class="text-2xl font-light text-muji-text mt-1">{{ statusCounts.reviewed }}</p>
      </div>
      <div class="bg-white rounded-sm border border-muji-border shadow-sm px-5 py-4">
        <p class="text-2xs text-muji-text-light uppercase tracking-widest">已核發</p>
        <p class="text-2xl font-light text-muji-text mt-1">{{ statusCounts.final }}</p>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="fa-regular fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen"></i>
        <input
          v-model="reportStore.searchQuery"
          type="text"
          placeholder="搜尋報告編號 / 病患 ID..."
          class="w-full pl-9 pr-3 py-2.5
                 bg-white text-muji-text text-sm
                 border border-muji-border rounded-sm
                 placeholder:text-muji-linen
                 transition-all duration-200
                 focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
        />
      </div>
      <select
        v-model="statusFilter"
        class="px-3 py-2.5 bg-white text-muji-text text-sm
               border border-muji-border rounded-sm
               focus:outline-none focus:border-muji-charcoal"
      >
        <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm overflow-hidden">
      <div v-if="reportStore.loading" class="px-6 py-12 text-center">
        <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
        <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
      </div>

      <table v-else-if="filteredReports.length > 0" class="w-full text-sm">
        <thead>
          <tr class="bg-muji-white border-b border-muji-border">
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">日期</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">報告編號</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">病患</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">狀態</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">審核人</th>
            <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">更新時間</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-muji-border">
          <tr
            v-for="report in filteredReports"
            :key="report.id"
            class="hover:bg-muji-white transition-colors duration-150"
          >
            <td class="px-6 py-3.5 text-muji-text">{{ formatDate(report.createdAt) }}</td>
            <td class="px-6 py-3.5 text-muji-text font-normal font-mono text-xs">{{ report.reportNumber }}</td>
            <td class="px-6 py-3.5 text-muji-text">{{ getPatientName(report.patientId) }}</td>
            <td class="px-6 py-3.5">
              <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide border', getStatusClass(report.status)]">
                <i class="fa-solid fa-circle text-[6px]"></i>
                {{ getStatusLabel(report.status) }}
              </span>
            </td>
            <td class="px-6 py-3.5 text-muji-text-light text-xs">{{ report.reviewedBy || '—' }}</td>
            <td class="px-6 py-3.5 text-muji-text-light text-xs">{{ formatDate(report.updatedAt) }}</td>
          </tr>
        </tbody>
      </table>

      <div v-else class="px-6 py-12 text-center">
        <i class="fa-regular fa-file-lines text-muji-linen text-2xl block mb-3"></i>
        <p class="text-sm text-muji-text-light">沒有可顯示的報告。</p>
        <p class="text-xs text-muji-linen mt-1">請嘗試其他關鍵字或調整篩選條件。</p>
      </div>
    </div>
  </div>
</template>
