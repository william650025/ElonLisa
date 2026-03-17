<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/report'
import { usePatientStore } from '@/stores/patient'
import { useResultStore } from '@/stores/result'
import { useTestItemStore } from '@/stores/testItem'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import type { AbnormalFlag } from '@/types'

const props = defineProps<{ id: string }>()

const router = useRouter()
const reportStore = useReportStore()
const patientStore = usePatientStore()
const resultStore = useResultStore()
const testItemStore = useTestItemStore()
const authStore = useAuthStore()
const notify = useNotificationStore()

const showApproveModal = ref(false)
const isProcessing = ref(false)

const report = computed(() => reportStore.currentReport)
const patient = computed(() =>
  report.value ? patientStore.getPatientById(report.value.patientId) : null
)

function getTestItemName(testItemId: string): string {
  const item = testItemStore.getTestItemById(testItemId)
  return item ? item.name : testItemId
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

async function approveReport() {
  if (!report.value || !authStore.currentUser) return
  isProcessing.value = true
  try {
    await reportStore.approveReport(report.value.id, authStore.currentUser.id)
    showApproveModal.value = false
    notify.success('報告已核發。')
    router.push({ name: 'ReviewList' })
  } catch {
    notify.error('核發報告失敗，請重試。')
  } finally {
    isProcessing.value = false
  }
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
    <div>
      <button
        class="text-sm text-muji-text-light hover:text-muji-text transition-colors mb-2 inline-flex items-center gap-1"
        @click="router.push({ name: 'ReviewList' })"
      >
        <i class="fa-solid fa-arrow-left text-xs"></i>
        返回待核發清單
      </button>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">
        報告審核 — {{ report?.reportNumber || '' }}
      </h1>
    </div>

    <!-- Loading -->
    <div v-if="reportStore.loading" class="text-center py-16">
      <i class="fa-solid fa-spinner fa-spin text-muji-linen text-lg"></i>
      <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
    </div>

    <template v-else-if="report">
      <!-- Report Card -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-4">
        <div class="text-center border-b border-muji-border pb-4">
          <h2 class="text-lg font-light text-muji-text tracking-tight">LISA Laboratory Report</h2>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="text-muji-text-light">Patient:</span> <span class="text-muji-text font-medium ml-2">{{ patient?.name || '-' }}</span></div>
          <div><span class="text-muji-text-light">ID:</span> <span class="text-muji-text ml-2">{{ patient?.medicalRecordNumber || '-' }}</span></div>
          <div><span class="text-muji-text-light">DOB:</span> <span class="text-muji-text ml-2">{{ patient?.birthDate || '-' }}</span></div>
          <div><span class="text-muji-text-light">Sex:</span> <span class="text-muji-text ml-2">{{ patient?.gender === 'M' ? 'Male' : patient?.gender === 'F' ? 'Female' : 'Other' }}</span></div>
          <div><span class="text-muji-text-light">Report Date:</span> <span class="text-muji-text ml-2">{{ formatDate(report.createdAt) }}</span></div>
          <div><span class="text-muji-text-light">Status:</span> <span class="text-muji-text ml-2">{{ report.status === 'draft' ? '待審核' : report.status === 'reviewed' ? '已審核' : '已核發' }}</span></div>
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
              <td class="px-6 py-3.5 text-muji-text font-medium">{{ getTestItemName(result.testItemId) }}</td>
              <td class="px-6 py-3.5 text-muji-text">{{ result.value }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ getTestItemUnit(result.testItemId) }}</td>
              <td class="px-6 py-3.5 text-muji-text-light">{{ getReferenceRange(result.testItemId) }}</td>
              <td class="px-6 py-3.5">
                <span :class="['text-xs', getFlagClass(result.flag)]">{{ getFlagLabel(result.flag) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-4">
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5
                 bg-transparent text-muji-charcoal
                 text-sm font-medium tracking-wide
                 rounded-sm border border-muji-border
                 transition-all duration-200
                 hover:bg-muji-cream hover:border-muji-linen
                 active:scale-[0.98]"
          @click="router.push({ name: 'ReviewList' })"
        >
          <i class="fa-solid fa-rotate-left text-xs"></i>
          退回重新輸入
        </button>
        <button
          :disabled="report.status !== 'draft'"
          class="inline-flex items-center gap-2 px-5 py-2.5
                 bg-muji-charcoal text-muji-white
                 text-sm font-medium tracking-wide
                 rounded-sm border border-muji-charcoal
                 transition-all duration-200
                 hover:bg-muji-text hover:border-muji-text
                 active:scale-[0.98]
                 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="showApproveModal = true"
        >
          <i class="fa-solid fa-circle-check text-xs"></i>
          核發報告
        </button>
      </div>
    </template>

    <!-- Approve Modal -->
    <Teleport to="body">
      <div
        v-if="showApproveModal"
        class="fixed inset-0 bg-muji-text/40 backdrop-blur-[2px] z-50
               flex items-center justify-center p-4"
      >
        <div class="w-full max-w-md bg-white rounded-sm border border-muji-border shadow-lg">
          <div class="flex items-center justify-between px-6 py-4 border-b border-muji-border">
            <h3 class="text-base font-normal text-muji-text tracking-tight">確認核發報告？</h3>
            <button class="text-muji-linen hover:text-muji-charcoal transition-colors p-1" @click="showApproveModal = false">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm text-muji-text-light leading-relaxed">
              報告核發後將無法修改。請確認所有資訊皆正確無誤。
            </p>
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-muji-border">
            <button
              class="px-4 py-2 text-sm text-muji-charcoal border border-muji-border rounded-sm
                     hover:bg-muji-cream transition-colors duration-150"
              @click="showApproveModal = false"
            >
              取消
            </button>
            <button
              :disabled="isProcessing"
              class="px-4 py-2 text-sm text-muji-white bg-muji-charcoal rounded-sm
                     hover:bg-muji-text transition-colors duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed"
              @click="approveReport"
            >
              {{ isProcessing ? '核發中...' : '確認核發' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
