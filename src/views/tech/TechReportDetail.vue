<script setup lang="ts">
import { computed, onMounted } from 'vue'
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

const report = computed(() => reportStore.currentReport)
const patient = computed(() =>
  report.value ? patientStore.getPatientById(report.value.patientId) : null
)

const abnormalCount = computed(() =>
  resultStore.currentResults.filter((r) => r.flag !== null).length
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

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-TW')
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
          @click="router.push({ name: 'ReviewList' })"
        >
          <i class="fa-regular fa-arrow-left text-xs"></i>
          返回報告審核
        </button>
        <h1 class="text-2xl font-light text-muji-text tracking-tight">
          報告詳情 · {{ report ? report.reportNumber : '' }}
        </h1>
      </div>
      <div class="flex items-center gap-2">
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
      <!-- Report Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Patient Info -->
        <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-4">
          <h2 class="text-sm font-medium text-muji-text flex items-center gap-2">
            <i class="fa-regular fa-user text-xs text-muji-text-light"></i>
            病患資訊
          </h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">姓名</span>
              <span class="text-muji-text font-medium">{{ patient?.name || '—' }}</span>
            </div>
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">出生日期</span>
              <span class="text-muji-text">{{ patient?.birthDate || '—' }}</span>
            </div>
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">性別</span>
              <span class="text-muji-text">{{ patient?.gender === 'M' ? '男' : patient?.gender === 'F' ? '女' : '—' }}</span>
            </div>
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">病歷號</span>
              <span class="text-muji-text font-mono text-xs">{{ patient?.medicalRecordNumber || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Report Meta -->
        <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-4">
          <h2 class="text-sm font-medium text-muji-text flex items-center gap-2">
            <i class="fa-regular fa-file-lines text-xs text-muji-text-light"></i>
            報告資訊
          </h2>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">報告編號</span>
              <span class="text-muji-text font-mono text-xs">{{ report.reportNumber }}</span>
            </div>
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">狀態</span>
              <span :class="['inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-2xs font-medium tracking-wide border', getStatusClass(report.status)]">
                <i class="fa-solid fa-circle text-[6px]"></i>
                {{ getStatusLabel(report.status) }}
              </span>
            </div>
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">建立時間</span>
              <span class="text-muji-text">{{ formatDateTime(report.createdAt) }}</span>
            </div>
            <div>
              <span class="text-muji-text-light block text-xs mb-0.5">更新時間</span>
              <span class="text-muji-text">{{ formatDateTime(report.updatedAt) }}</span>
            </div>
            <div v-if="report.reviewedBy">
              <span class="text-muji-text-light block text-xs mb-0.5">審核人</span>
              <span class="text-muji-text">{{ report.reviewedBy }}</span>
            </div>
            <div v-if="report.reviewedAt">
              <span class="text-muji-text-light block text-xs mb-0.5">審核時間</span>
              <span class="text-muji-text">{{ formatDateTime(report.reviewedAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2 text-sm text-muji-text-light">
          <i class="fa-regular fa-vial text-xs"></i>
          共 {{ resultStore.currentResults.length }} 項檢驗
        </div>
        <div v-if="abnormalCount > 0" class="flex items-center gap-2 text-sm text-warning">
          <i class="fa-regular fa-triangle-exclamation text-xs"></i>
          {{ abnormalCount }} 項異常
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
                <p class="text-xs text-muji-text-light font-mono">{{ getTestItemCode(result.testItemId) }}</p>
              </td>
              <td class="px-6 py-3.5 text-muji-text font-medium">{{ result.value }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ getTestItemUnit(result.testItemId) }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ getReferenceRange(result.testItemId) }}</td>
              <td class="px-6 py-3.5">
                <span :class="['text-xs', getFlagClass(result.flag)]">{{ getFlagLabel(result.flag) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Rejection Reason -->
      <div
        v-if="report.rejectionReason"
        class="flex items-start gap-3 p-4 rounded-sm bg-[#FDF1F1] border border-muji-red/20"
      >
        <i class="fa-regular fa-circle-exclamation text-muji-red mt-0.5 flex-shrink-0"></i>
        <div>
          <p class="text-sm font-medium text-muji-text mb-0.5">退回原因</p>
          <p class="text-sm text-muji-text-light leading-relaxed">{{ report.rejectionReason }}</p>
        </div>
      </div>

      <!-- Summary -->
      <div
        v-if="report.summary"
        class="bg-white rounded-sm border border-muji-border shadow-sm p-6"
      >
        <h2 class="text-sm font-medium text-muji-text mb-3 flex items-center gap-2">
          <i class="fa-regular fa-clipboard text-xs text-muji-text-light"></i>
          報告摘要
        </h2>
        <p class="text-sm text-muji-text-light leading-relaxed">{{ report.summary }}</p>
      </div>

      <!-- Legend -->
      <div class="text-xs text-muji-text-light flex items-center gap-4">
        <span>▼ 低於參考範圍</span>
        <span>▲ 高於參考範圍</span>
        <span class="text-muji-red">!! 危急值</span>
      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="text-center py-16">
      <i class="fa-regular fa-file-circle-question text-muji-linen text-2xl block mb-3"></i>
      <p class="text-sm text-muji-text-light">找不到指定的報告。</p>
    </div>
  </div>
</template>
