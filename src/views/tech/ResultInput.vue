<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/order'
import { usePatientStore } from '@/stores/patient'
import { useTestItemStore } from '@/stores/testItem'
import { useResultStore } from '@/stores/result'
import { useNotificationStore } from '@/stores/notification'
import type { TestItem, AbnormalFlag } from '@/types'

const props = defineProps<{ id: string }>()

const router = useRouter()
const orderStore = useOrderStore()
const patientStore = usePatientStore()
const testItemStore = useTestItemStore()
const resultStore = useResultStore()
const notify = useNotificationStore()

const isSaving = ref(false)
const analystNotes = ref('')
const showCriticalAlert = ref(false)
const criticalAlertMessage = ref('')

// 結果輸入值
interface ResultEntry {
  testItemId: string
  value: string
  numericValue: number | null
  flag: AbnormalFlag
}
const resultEntries = ref<ResultEntry[]>([])

const order = computed(() => orderStore.currentOrder)
const patient = computed(() =>
  order.value ? patientStore.getPatientById(order.value.patientId) : null
)
const testItems = computed(() =>
  order.value ? testItemStore.getTestItemsByIds(order.value.testItemIds) : []
)

function initResultEntries() {
  resultEntries.value = testItems.value.map((item) => ({
    testItemId: item.id,
    value: '',
    numericValue: null,
    flag: null,
  }))
}

function checkValue(entry: ResultEntry, item: TestItem) {
  const val = parseFloat(entry.value)
  if (isNaN(val)) {
    entry.numericValue = null
    entry.flag = null
    return
  }
  entry.numericValue = val

  if (item.referenceMin !== undefined && item.referenceMax !== undefined) {
    const critLow = item.referenceMin * 0.5
    const critHigh = item.referenceMax * 1.5

    if (val <= critLow || val >= critHigh) {
      entry.flag = 'A'
      showCriticalAlert.value = true
      criticalAlertMessage.value = `${item.name}: ${val} ${item.unit || ''} 為危急值（Critical），已觸發緊急通知。`
    } else if (val < item.referenceMin) {
      entry.flag = 'L'
    } else if (val > item.referenceMax) {
      entry.flag = 'H'
    } else {
      entry.flag = null
    }
  }
}

function getFlagLabel(flag: AbnormalFlag): string {
  if (flag === 'H') return '▲ High'
  if (flag === 'L') return '▼ Low'
  if (flag === 'A') return '!! CRIT'
  return '● Normal'
}

function getFlagClass(flag: AbnormalFlag): string {
  if (flag === 'H') return 'text-warning'
  if (flag === 'L') return 'text-warning'
  if (flag === 'A') return 'text-muji-red font-medium'
  return 'text-success'
}

function getInputBorderClass(flag: AbnormalFlag): string {
  if (flag === 'A') return 'border-muji-red focus:border-muji-red focus:ring-muji-red'
  if (flag === 'H' || flag === 'L') return 'border-warning focus:border-warning focus:ring-warning'
  return 'border-muji-border focus:border-muji-charcoal focus:ring-muji-charcoal'
}

function getReferenceRange(item: TestItem): string {
  if (item.referenceText) return item.referenceText
  if (item.referenceMin !== undefined && item.referenceMax !== undefined) {
    return `${item.referenceMin} – ${item.referenceMax}`
  }
  return '—'
}

async function saveResults() {
  if (!order.value) return
  isSaving.value = true
  try {
    const results = resultEntries.value
      .filter((e) => e.value !== '')
      .map((e) => ({
        orderId: order.value!.id,
        testItemId: e.testItemId,
        patientId: order.value!.patientId,
        value: e.value,
        numericValue: e.numericValue ?? undefined,
        flag: e.flag,
        isVerified: false,
      }))

    await resultStore.saveResults(results)
    await orderStore.updateOrderStatus(order.value.id, 'testing')
    notify.success('檢驗結果已儲存。')
    router.push({ name: 'Worklist' })
  } catch {
    notify.error('資料儲存失敗，請重試。')
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    orderStore.fetchOrderById(props.id),
    patientStore.fetchPatients(),
    testItemStore.fetchTestItems(),
  ])
  initResultEntries()
})

watch(testItems, () => {
  if (testItems.value.length > 0 && resultEntries.value.length === 0) {
    initResultEntries()
  }
})
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div>
      <button
        class="text-sm text-muji-text-light hover:text-muji-text transition-colors mb-2 inline-flex items-center gap-1"
        @click="router.push({ name: 'Worklist' })"
      >
        <i class="fa-regular fa-arrow-left text-xs"></i>
        返回工作清單
      </button>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">
        輸入檢驗值 — {{ order?.orderNumber || '' }}
      </h1>
    </div>

    <!-- Loading -->
    <div v-if="orderStore.loading" class="text-center py-16">
      <i class="fa-regular fa-spinner fa-spin text-muji-linen text-lg"></i>
      <p class="text-sm text-muji-text-light mt-2">資料正在載入中...</p>
    </div>

    <template v-else-if="order">
      <!-- Patient & Order Info -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm px-6 py-4">
        <div class="flex items-center gap-6 text-sm">
          <span class="text-muji-text-light">病患：<span class="text-muji-text font-medium">{{ patient?.name || '-' }}</span></span>
          <span class="text-muji-text-light">ID：{{ patient?.medicalRecordNumber || '-' }}</span>
          <span class="text-muji-text-light">項目數：{{ testItems.length }}</span>
          <span v-if="order.isUrgent" class="inline-flex items-center gap-1 text-muji-red text-xs font-medium">
            <i class="fa-regular fa-flag text-[10px]"></i>
            STAT
          </span>
        </div>
      </div>

      <!-- Critical Alert -->
      <div
        v-if="showCriticalAlert"
        class="flex items-start gap-3 p-4 rounded-sm bg-[#FDF1F1] border border-muji-red/30"
      >
        <i class="fa-regular fa-circle-exclamation text-muji-red mt-0.5 flex-shrink-0 text-base"></i>
        <div class="flex-1">
          <p class="text-sm font-medium text-muji-red mb-0.5 tracking-wide">危急值警報</p>
          <p class="text-sm text-muji-red/80 leading-relaxed">{{ criticalAlertMessage }}</p>
        </div>
        <button
          class="text-muji-red/40 hover:text-muji-red flex-shrink-0"
          @click="showCriticalAlert = false"
        >
          <i class="fa-regular fa-xmark text-sm"></i>
        </button>
      </div>

      <!-- Results Table -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-muji-white border-b border-muji-border">
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">檢驗項目</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light w-40">結果</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">單位</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">參考範圍</th>
              <th class="px-6 py-3 text-left text-2xs font-medium tracking-widest uppercase text-muji-text-light">狀態</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-muji-border">
            <tr
              v-for="(entry, index) in resultEntries"
              :key="entry.testItemId"
              :class="entry.flag === 'A' ? 'bg-[#FDF1F1]/30' : ''"
            >
              <td class="px-6 py-4">
                <p class="text-muji-text font-medium">{{ testItems[index]?.name || '' }}</p>
                <p class="text-xs text-muji-text-light mt-0.5">{{ testItems[index]?.code || '' }}</p>
              </td>
              <td class="px-6 py-4">
                <input
                  v-model="entry.value"
                  type="text"
                  placeholder="輸入值"
                  :class="[
                    'w-full px-3 py-2 text-sm rounded-sm border transition-all duration-200 focus:outline-none focus:ring-1',
                    getInputBorderClass(entry.flag)
                  ]"
                  @input="checkValue(entry, testItems[index])"
                />
              </td>
              <td class="px-6 py-4 text-muji-text-light">{{ testItems[index]?.unit || '—' }}</td>
              <td class="px-6 py-4 text-muji-text-light">{{ getReferenceRange(testItems[index]) }}</td>
              <td class="px-6 py-4">
                <span v-if="entry.value" :class="['text-xs font-medium', getFlagClass(entry.flag)]">
                  {{ getFlagLabel(entry.flag) }}
                </span>
                <span v-else class="text-xs text-muji-linen">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notes -->
      <div class="bg-white rounded-sm border border-muji-border shadow-sm p-6 space-y-2">
        <label class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
          檢驗備註（選填）
        </label>
        <textarea
          v-model="analystNotes"
          rows="3"
          placeholder="填寫備註..."
          class="w-full px-3 py-2.5
                 bg-white text-muji-text text-sm
                 border border-muji-border rounded-sm
                 placeholder:text-muji-linen resize-none
                 transition-all duration-200
                 focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-3">
        <button
          class="px-5 py-2.5 text-sm text-muji-charcoal border border-muji-border rounded-sm
                 hover:bg-muji-cream transition-colors duration-150"
          @click="router.push({ name: 'Worklist' })"
        >
          儲存草稿
        </button>
        <button
          :disabled="isSaving"
          class="inline-flex items-center gap-2 px-5 py-2.5
                 bg-muji-charcoal text-muji-white
                 text-sm font-medium tracking-wide
                 rounded-sm border border-muji-charcoal
                 transition-all duration-200
                 hover:bg-muji-text hover:border-muji-text
                 active:scale-[0.98]
                 disabled:opacity-40 disabled:cursor-not-allowed"
          @click="saveResults"
        >
          <i class="fa-regular fa-circle-check text-xs"></i>
          {{ isSaving ? '送出中...' : '送審' }}
        </button>
      </div>
    </template>
  </div>
</template>
