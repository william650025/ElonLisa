<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/report'
import { usePatientStore } from '@/stores/patient'

const router = useRouter()
const reportStore = useReportStore()
const patientStore = usePatientStore()

const dateFilter = ref('')

const filteredReports = computed(() => {
  let result = reportStore.filteredReports
  if (dateFilter.value) {
    result = result.filter((r) => r.createdAt.startsWith(dateFilter.value))
  }
  return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
    draft: '草稿', reviewed: '已審核', final: '已核發',
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
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">我的報告</h1>
      <p class="text-sm text-muji-text-light mt-1">方便快速回顧過去的檢驗報告。</p>
    </div>

    <!-- Search & Date Filter -->
    <div class="flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <i class="fa-regular fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen"></i>
        <input
          v-model="reportStore.searchQuery"
          type="text"
          placeholder="搜尋報告 / 檢驗項目..."
          class="w-full pl-9 pr-3 py-2.5
                 bg-white text-muji-text text-sm
                 border border-muji-border rounded-sm
                 placeholder:text-muji-linen
                 transition-all duration-200
                 focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
        />
      </div>
      <input
        v-model="dateFilter"
        type="month"
        class="px-3 py-2.5 bg-white text-muji-text text-sm
               border border-muji-border rounded-sm
               focus:outline-none focus:border-muji-charcoal"
      />
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
            <th class="px-6 py-3 text-right text-2xs font-medium tracking-widest uppercase text-muji-text-light">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-muji-border">
          <tr
            v-for="report in filteredReports"
            :key="report.id"
            @click="router.push({ name: 'ReportDetail', params: { id: report.id } })"
            class="hover:bg-muji-white transition-colors duration-150 cursor-pointer"
          >
            <td class="px-6 py-3.5 text-muji-text">{{ formatDate(report.createdAt) }}</td>
            <td class="px-6 py-3.5 text-muji-text font-normal">{{ report.reportNumber }}</td>
            <td class="px-6 py-3.5 text-muji-text">{{ getPatientName(report.patientId) }}</td>
            <td class="px-6 py-3.5">
              <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide border', getStatusClass(report.status)]">
                <i class="fa-solid fa-circle text-[6px]"></i>
                {{ getStatusLabel(report.status) }}
              </span>
            </td>
            <td class="px-6 py-3.5 text-right">
              <button class="text-xs text-muji-text-light hover:text-muji-text transition-colors">
                查看 <i class="fa-regular fa-arrow-right text-[10px] ml-0.5"></i>
              </button>
            </td>
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
