<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/report'
import { usePatientStore } from '@/stores/patient'
import { useResultStore } from '@/stores/result'
import { useTestItemStore } from '@/stores/testItem'
import type { AbnormalFlag } from '@/types'

const props = defineProps<{ id: string }>()

const router = useRouter()
const reportStore = useReportStore()
const patientStore = usePatientStore()
const resultStore = useResultStore()
const testItemStore = useTestItemStore()

const showTrendChart = ref(false)
const selectedTrendItem = ref<string>('')

const report = computed(() => reportStore.currentReport)
const patient = computed(() =>
  report.value ? patientStore.getPatientById(report.value.patientId) : null
)

const hasAnyAbnormal = computed(() =>
  resultStore.currentResults.some((r) => r.flag !== null)
)

function getTestItemName(testItemId: string): string {
  const item = testItemStore.getTestItemById(testItemId)
  return item ? item.name : testItemId
}

function getTestItemCode(testItemId: string): string {
  const item = testItemStore.getTestItemById(testItemId)
  return item?.code || ''
}

function getTestItemUnit(testItemId: string): string {
  const item = testItemStore.getTestItemById(testItemId)
  return item?.unit || '—'
}

function getReferenceRange(testItemId: string): string {
  const item = testItemStore.getTestItemById(testItemId)
  if (!item) return '—'
  if (item.referenceText) return item.referenceText
  if (item.referenceMin !== undefined && item.referenceMax !== undefined) {
    return `${item.referenceMin} – ${item.referenceMax}`
  }
  return '—'
}

function getFlagLabel(flag: AbnormalFlag): string {
  if (flag === 'H') return '▲ HIGH'
  if (flag === 'L') return '▼ LOW'
  if (flag === 'A') return '!! CRITICAL'
  return '—'
}

function getFlagClass(flag: AbnormalFlag): string {
  if (flag === 'H') return 'text-warning font-medium'
  if (flag === 'L') return 'text-warning font-medium'
  if (flag === 'A') return 'text-muji-red font-medium'
  return 'text-muji-text-light'
}

function getRowClass(flag: AbnormalFlag): string {
  if (flag === 'A') return 'bg-[#FDF1F1]/30'
  if (flag === 'H' || flag === 'L') return 'bg-warning-bg/30'
  return ''
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

function toggleTrend(testItemId: string) {
  if (selectedTrendItem.value === testItemId) {
    showTrendChart.value = false
    selectedTrendItem.value = ''
  } else {
    selectedTrendItem.value = testItemId
    showTrendChart.value = true
  }
}

// 模擬歷史趨勢數據
const trendData = computed(() => {
  if (!selectedTrendItem.value) return []
  const currentResult = resultStore.currentResults.find(
    (r) => r.testItemId === selectedTrendItem.value
  )
  const currentVal = currentResult?.numericValue || parseFloat(currentResult?.value || '0')
  
  return [
    { date: '2025-12-10', value: currentVal * 1.1 },
    { date: '2026-01-15', value: currentVal * 0.95 },
    { date: '2026-02-28', value: currentVal * 1.05 },
    { date: '2026-03-16', value: currentVal },
  ]
})

onMounted(async () => {
  await Promise.all([
    reportStore.fetchReportById(props.id),
    patientStore.fetchPatients(),
    testItemStore.fetchTestItems(),
  ])
  if (report.value) {
    await resultStore.fetchResultsByOrderId(report.value.orderId)
  }
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <button
          class="text-sm text-muji-text-light hover:text-muji-text transition-colors mb-2 inline-flex items-center gap-1"
          @click="router.push({ name: 'ReportList' })"
        >
          <i class="fa-regular fa-arrow-left text-xs"></i>
          返回報告列表
        </button>
        <h1 class="text-2xl font-light text-muji-text tracking-tight">
          檢驗報告 · {{ report ? formatDate(report.createdAt) : '' }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="inline-flex items-center gap-2 px-4 py-2
                 text-sm text-muji-charcoal border border-muji-border rounded-sm
                 hover:bg-muji-cream transition-colors duration-150"
        >
          <i class="fa-regular fa-download text-xs"></i>
          下載報告
        </button>
        <button
          class="inline-flex items-center gap-2 px-4 py-2
                 text-sm text-muji-charcoal border border-muji-border rounded-sm
                 hover:bg-muji-cream transition-colors duration-150"
        >
          <i class="fa-regular fa-print text-xs"></i>
          列印
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="reportStore.loading" class="text-center py-16">
      <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
      <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
    </div>

    <template v-else-if="report">
      <!-- Patient Info Header -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6">
        <div class="text-center border-b border-muji-border pb-4 mb-4">
          <h2 class="text-lg font-light text-muji-text tracking-tight">Laboratory Report</h2>
          <p class="text-xs text-muji-text-light mt-1">{{ report.reportNumber }}</p>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-muji-text-light block text-xs mb-0.5">Patient</span>
            <span class="text-muji-text font-medium">{{ patient?.name || '-' }}</span>
          </div>
          <div>
            <span class="text-muji-text-light block text-xs mb-0.5">DOB</span>
            <span class="text-muji-text">{{ patient?.birthDate || '-' }}</span>
          </div>
          <div>
            <span class="text-muji-text-light block text-xs mb-0.5">Test Date</span>
            <span class="text-muji-text">{{ formatDate(report.createdAt) }}</span>
          </div>
          <div>
            <span class="text-muji-text-light block text-xs mb-0.5">Status</span>
            <span :class="['font-medium', report.status === 'final' ? 'text-success' : 'text-muji-text']">
              {{ report.status === 'final' ? '已核發' : report.status === 'reviewed' ? '已審核' : '草稿' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muji-white border-b border-muji-border">
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">檢驗項目</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">結果</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">單位</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">參考範圍</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">異常標記</th>
              <th class="px-6 py-3 text-center text-2xs font-medium tracking-widest uppercase text-muji-text-light">趨勢</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-muji-border">
            <tr
              v-for="result in resultStore.currentResults"
              :key="result.id"
              :class="getRowClass(result.flag)"
            >
              <td class="px-6 py-3.5">
                <p class="text-muji-text font-medium">{{ getTestItemName(result.testItemId) }}</p>
                <p class="text-xs text-muji-text-light">{{ getTestItemCode(result.testItemId) }}</p>
              </td>
              <td class="px-6 py-3.5 text-muji-text font-medium">{{ result.value }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ getTestItemUnit(result.testItemId) }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ getReferenceRange(result.testItemId) }}</td>
              <td class="px-6 py-3.5">
                <span :class="['text-xs', getFlagClass(result.flag)]">{{ getFlagLabel(result.flag) }}</span>
              </td>
              <td class="px-6 py-3.5 text-center">
                <button
                  :class="[
                    'text-xs transition-colors',
                    selectedTrendItem === result.testItemId ? 'text-muji-text' : 'text-muji-text-light hover:text-muji-text'
                  ]"
                  @click.stop="toggleTrend(result.testItemId)"
                >
                  <i class="fa-regular fa-chart-line"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legend -->
      <div class="text-xs text-muji-text-light flex items-center gap-4">
        <span>▼ 低於參考範圍</span>
        <span>▲ 高於參考範圍</span>
        <span class="text-muji-red">!! 危急值（需立即聯繫醫師）</span>
        <span><i class="fa-regular fa-chart-line text-[10px]"></i> 查看歷史趨勢</span>
      </div>

      <!-- Trend Chart (Simplified) -->
      <div v-if="showTrendChart && selectedTrendItem" class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-light text-muji-text tracking-tight">
            歷史趨勢 — {{ getTestItemName(selectedTrendItem) }}
          </h2>
          <button
            class="text-muji-text-light hover:text-muji-text transition-colors"
            @click="showTrendChart = false"
          >
            <i class="fa-regular fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Simple trend visualization (no Chart.js dependency) -->
        <div class="border border-muji-border rounded-sm p-6">
          <div class="space-y-3">
            <div
              v-for="point in trendData"
              :key="point.date"
              class="flex items-center gap-4"
            >
              <span class="text-xs text-muji-text-light w-24">{{ point.date }}</span>
              <div class="flex-1 h-6 bg-muji-white rounded-sm relative overflow-hidden">
                <div
                  class="h-full bg-muji-charcoal/20 rounded-sm transition-all duration-500"
                  :style="{ width: `${Math.min((point.value / (Math.max(...trendData.map(d => d.value)) * 1.2)) * 100, 100)}%` }"
                ></div>
              </div>
              <span class="text-sm text-muji-text font-medium w-16 text-right">{{ point.value.toFixed(1) }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-muji-border">
            <p class="text-xs text-muji-text-light">
              參考範圍：{{ getReferenceRange(selectedTrendItem) }} {{ getTestItemUnit(selectedTrendItem) }}
            </p>
          </div>
        </div>

        <!-- Data Points Table -->
        <div class="border border-muji-border rounded-sm overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-muji-white border-b border-muji-border">
                <th class="px-4 py-2 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">日期</th>
                <th class="px-4 py-2 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">數值</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-muji-border">
              <tr v-for="point in [...trendData].reverse()" :key="point.date">
                <td class="px-4 py-2 text-muji-text-light">{{ point.date }}</td>
                <td class="px-4 py-2 text-muji-text font-medium">{{ point.value.toFixed(1) }} {{ getTestItemUnit(selectedTrendItem) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Abnormal Notice -->
      <div
        v-if="hasAnyAbnormal"
        class="flex items-start gap-3 p-4 rounded-sm bg-muji-white border border-muji-border"
      >
        <i class="fa-regular fa-circle-info text-muji-charcoal mt-0.5 flex-shrink-0"></i>
        <div>
          <p class="text-sm font-medium text-muji-text mb-0.5">注意事項</p>
          <p class="text-sm text-muji-text-light leading-relaxed">
            部分數值超出正常範圍。請諮詢您的主治醫師進行專業判讀。
          </p>
        </div>
      </div>
    </template>
  </div>
</template>
