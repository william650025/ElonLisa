<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '@/stores/patient'
import { useTestItemStore } from '@/stores/testItem'
import { useOrderStore } from '@/stores/order'
import { useNotificationStore } from '@/stores/notification'
import type { Patient } from '@/types'

const router = useRouter()
const patientStore = usePatientStore()
const testItemStore = useTestItemStore()
const orderStore = useOrderStore()
const notify = useNotificationStore()

const currentStep = ref(1)
const totalSteps = 4

// Step 1: Patient
const selectedPatient = ref<Patient | null>(null)
const patientSearch = ref('')

// Step 2: Test Items
const selectedTestItemIds = ref<string[]>([])

// Step 3: Additional Info
const isUrgent = ref(false)
const clinicalNotes = ref('')
const physicianName = ref('')

// Step 4: Submit
const isSubmitting = ref(false)
const showConfirmModal = ref(false)

const filteredPatients = computed(() => {
  if (!patientSearch.value) return patientStore.patients
  const q = patientSearch.value.toLowerCase()
  return patientStore.patients.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.medicalRecordNumber.toLowerCase().includes(q)
  )
})

const selectedTestItems = computed(() =>
  testItemStore.testItems.filter((t) => selectedTestItemIds.value.includes(t.id))
)

const canGoNext = computed(() => {
  switch (currentStep.value) {
    case 1: return !!selectedPatient.value
    case 2: return selectedTestItemIds.value.length > 0
    case 3: return !!physicianName.value
    case 4: return true
    default: return false
  }
})

const steps = [
  { num: 1, label: '選擇病患' },
  { num: 2, label: '選擇項目' },
  { num: 3, label: '填寫資訊' },
  { num: 4, label: '確認送出' },
]

onMounted(async () => {
  await Promise.all([
    patientStore.fetchPatients(),
    testItemStore.fetchTestItems(),
  ])
})

function selectPatient(patient: Patient) {
  selectedPatient.value = patient
}

function toggleTestItem(id: string) {
  const index = selectedTestItemIds.value.indexOf(id)
  if (index === -1) {
    selectedTestItemIds.value.push(id)
  } else {
    selectedTestItemIds.value.splice(index, 1)
  }
}

function nextStep() {
  if (canGoNext.value && currentStep.value < totalSteps) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function openConfirm() {
  showConfirmModal.value = true
}

async function submitOrder() {
  if (!selectedPatient.value) return
  isSubmitting.value = true
  try {
    await orderStore.createOrder({
      patientId: selectedPatient.value.id,
      testItemIds: selectedTestItemIds.value,
      isUrgent: isUrgent.value,
      clinicalNotes: clinicalNotes.value,
      physicianName: physicianName.value,
      status: 'pending',
    })
    showConfirmModal.value = false
    notify.success('醫令已新增。')
    router.push({ name: 'AdminDashboard' })
  } catch {
    notify.error('資料儲存失敗，請重試。')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- 頁面標題 -->
    <div>
      <button
        class="text-sm text-muji-text-light hover:text-muji-text transition-colors mb-2 inline-flex items-center gap-1"
        @click="router.push({ name: 'OrderList' })"
      >
        <i class="fa-solid fa-arrow-left text-xs"></i>
        返回醫令清單
      </button>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">開立醫令</h1>
    </div>

    <!-- 步驟指示器 -->
    <div class="flex items-center justify-center gap-0">
      <template v-for="(step, index) in steps" :key="step.num">
        <div class="flex items-center gap-2">
          <div
            :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm border transition-all duration-200',
              currentStep >= step.num
                ? 'bg-muji-charcoal text-muji-white border-muji-charcoal'
                : 'bg-white text-muji-text-light border-muji-border'
            ]"
          >
            {{ step.num }}
          </div>
          <span
            :class="[
              'text-sm transition-colors',
              currentStep >= step.num ? 'text-muji-text font-medium' : 'text-muji-text-light'
            ]"
          >{{ step.label }}</span>
        </div>
        <div
          v-if="index < steps.length - 1"
          :class="[
            'w-16 h-px mx-3',
            currentStep > step.num ? 'bg-muji-charcoal' : 'bg-muji-border'
          ]"
        ></div>
      </template>
    </div>

    <!-- Step Content -->
    <div class="bg-white rounded-sm border border-muji-border shadow-sm p-8">
      <!-- Step 1: 選擇病患 -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-light text-muji-text tracking-tight">選擇病患</h2>

        <div class="relative max-w-md">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen"></i>
          <input
            v-model="patientSearch"
            type="text"
            placeholder="搜尋病患姓名 / ID..."
            class="w-full pl-9 pr-3 py-2.5
                   bg-white text-muji-text text-sm
                   border border-muji-border rounded-sm
                   placeholder:text-muji-linen
                   transition-all duration-200
                   focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
          />
        </div>

        <div class="space-y-2">
          <div
            v-for="patient in filteredPatients"
            :key="patient.id"
            :class="[
              'flex items-center gap-4 p-4 rounded-sm border cursor-pointer transition-all duration-150',
              selectedPatient?.id === patient.id
                ? 'border-muji-charcoal bg-muji-cream border-l-4'
                : 'border-muji-border hover:bg-muji-white border-l-4 border-l-transparent'
            ]"
            @click="selectPatient(patient)"
          >
            <div class="w-10 h-10 rounded-sm bg-muji-cream flex items-center justify-center flex-shrink-0">
              <i class="fa-regular fa-user text-sm text-muji-text-light"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-muji-text">{{ patient.name }}</p>
              <p class="text-xs text-muji-text-light">
                {{ patient.medicalRecordNumber }} · {{ patient.gender === 'M' ? '男' : patient.gender === 'F' ? '女' : '其他' }} · {{ patient.birthDate }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="filteredPatients.length === 0" class="text-center py-8">
          <i class="fa-regular fa-user text-muji-linen text-xl mb-2"></i>
          <p class="text-sm text-muji-text-light">沒有找到符合您條件的資料。</p>
        </div>
      </div>

      <!-- Step 2: 選擇檢驗項目 -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-light text-muji-text tracking-tight">選擇檢驗項目</h2>
          <div class="text-sm text-muji-text-light">
            已選病患：<span class="text-muji-text font-medium">{{ selectedPatient?.name }}</span>
            <button class="ml-2 text-xs text-muji-text-light hover:text-muji-text" @click="currentStep = 1">[變更]</button>
          </div>
        </div>

        <div class="relative max-w-md">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muji-linen"></i>
          <input
            v-model="testItemStore.searchQuery"
            type="text"
            placeholder="搜尋檢驗項目..."
            class="w-full pl-9 pr-3 py-2.5
                   bg-white text-muji-text text-sm
                   border border-muji-border rounded-sm
                   placeholder:text-muji-linen
                   transition-all duration-200
                   focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
          />
        </div>

        <!-- Category Filter -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="cat in testItemStore.categories"
            :key="cat"
            :class="[
              'px-3 py-1.5 text-xs rounded-sm border transition-colors duration-150',
              testItemStore.categoryFilter === cat
                ? 'bg-muji-charcoal text-muji-white border-muji-charcoal'
                : 'bg-white text-muji-text-light border-muji-border hover:border-muji-linen'
            ]"
            @click="testItemStore.categoryFilter = cat"
          >
            {{ cat === 'all' ? '全部' : cat }}
          </button>
        </div>

        <!-- Test Items List -->
        <div class="divide-y divide-muji-border border border-muji-border rounded-sm">
          <label
            v-for="item in testItemStore.filteredTestItems"
            :key="item.id"
            class="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-muji-white transition-colors duration-150"
          >
            <input
              type="checkbox"
              :checked="selectedTestItemIds.includes(item.id)"
              class="w-4 h-4 rounded-sm border-muji-border text-muji-charcoal focus:ring-muji-charcoal"
              @change="toggleTestItem(item.id)"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-muji-text">
                <span class="font-medium">{{ item.code }}</span>
                <span class="ml-2">{{ item.name }}</span>
              </p>
            </div>
            <span class="text-xs text-muji-text-light px-2 py-0.5 bg-muji-white rounded-sm">{{ item.category }}</span>
          </label>
        </div>

        <div v-if="selectedTestItemIds.length > 0" class="text-sm text-muji-text-light">
          已選擇 {{ selectedTestItemIds.length }} 項檢驗
        </div>
      </div>

      <!-- Step 3: 填寫附加資訊 -->
      <div v-if="currentStep === 3" class="space-y-6 max-w-lg">
        <h2 class="text-xl font-light text-muji-text tracking-tight">填寫附加資訊</h2>

        <!-- Urgency -->
        <div class="space-y-2">
          <label class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
            優先順序
          </label>
          <div class="flex items-center gap-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="isUrgent" type="radio" :value="false" class="text-muji-charcoal focus:ring-muji-charcoal" />
              <span class="text-sm text-muji-text">一般</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="isUrgent" type="radio" :value="true" class="text-muji-charcoal focus:ring-muji-charcoal" />
              <span class="text-sm text-muji-text">緊急</span>
            </label>
          </div>
        </div>

        <!-- Physician Name -->
        <div class="space-y-1.5">
          <label class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
            開單醫師 *
          </label>
          <input
            v-model="physicianName"
            type="text"
            placeholder="請輸入醫師姓名..."
            class="w-full px-3 py-2.5
                   bg-white text-muji-text text-sm
                   border border-muji-border rounded-sm
                   placeholder:text-muji-linen
                   transition-all duration-200
                   focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
          />
        </div>

        <!-- Clinical Notes -->
        <div class="space-y-1.5">
          <label class="text-2xs font-medium tracking-widest uppercase text-muji-text-light">
            臨床備註（選填）
          </label>
          <textarea
            v-model="clinicalNotes"
            rows="4"
            maxlength="500"
            placeholder="填寫臨床備註..."
            class="w-full px-3 py-2.5
                   bg-white text-muji-text text-sm
                   border border-muji-border rounded-sm
                   placeholder:text-muji-linen resize-none
                   transition-all duration-200
                   focus:outline-none focus:border-muji-charcoal focus:ring-1 focus:ring-muji-charcoal"
          ></textarea>
          <p class="text-xs text-muji-text-light text-right">{{ clinicalNotes.length }} / 500</p>
        </div>
      </div>

      <!-- Step 4: 確認送出 -->
      <div v-if="currentStep === 4" class="space-y-6">
        <h2 class="text-xl font-light text-muji-text tracking-tight">確認醫令資訊</h2>

        <div class="divide-y divide-muji-border border border-muji-border rounded-sm">
          <div class="flex px-4 py-3">
            <span class="w-32 text-sm text-muji-text-light flex-shrink-0">病患</span>
            <span class="text-sm text-muji-text font-medium">{{ selectedPatient?.name }} ({{ selectedPatient?.medicalRecordNumber }})</span>
          </div>
          <div class="flex px-4 py-3">
            <span class="w-32 text-sm text-muji-text-light flex-shrink-0">檢驗項目</span>
            <div class="text-sm text-muji-text">
              <p v-for="item in selectedTestItems" :key="item.id">{{ item.code }} — {{ item.name }}</p>
            </div>
          </div>
          <div class="flex px-4 py-3">
            <span class="w-32 text-sm text-muji-text-light flex-shrink-0">優先順序</span>
            <span :class="['text-sm', isUrgent ? 'text-muji-red font-medium' : 'text-muji-text']">
              {{ isUrgent ? '緊急' : '一般' }}
            </span>
          </div>
          <div class="flex px-4 py-3">
            <span class="w-32 text-sm text-muji-text-light flex-shrink-0">開單醫師</span>
            <span class="text-sm text-muji-text">{{ physicianName }}</span>
          </div>
          <div v-if="clinicalNotes" class="flex px-4 py-3">
            <span class="w-32 text-sm text-muji-text-light flex-shrink-0">臨床備註</span>
            <span class="text-sm text-muji-text">{{ clinicalNotes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between">
      <button
        v-if="currentStep > 1"
        class="inline-flex items-center gap-2 px-5 py-2.5
               bg-transparent text-muji-charcoal
               text-sm font-medium tracking-wide
               rounded-sm border border-muji-border
               transition-all duration-200
               hover:bg-muji-cream hover:border-muji-linen
               active:scale-[0.98]"
        @click="prevStep"
      >
        <i class="fa-solid fa-arrow-left text-xs"></i>
        上一步
      </button>
      <div v-else></div>

      <button
        v-if="currentStep < totalSteps"
        :disabled="!canGoNext"
        class="inline-flex items-center gap-2 px-5 py-2.5
               bg-muji-charcoal text-muji-white
               text-sm font-medium tracking-wide
               rounded-sm border border-muji-charcoal
               transition-all duration-200
               hover:bg-muji-text hover:border-muji-text
               active:scale-[0.98]
               disabled:opacity-40 disabled:cursor-not-allowed"
        @click="nextStep"
      >
        下一步
        <i class="fa-solid fa-arrow-right text-xs"></i>
      </button>

      <button
        v-if="currentStep === totalSteps"
        class="inline-flex items-center gap-2 px-5 py-2.5
               bg-muji-charcoal text-muji-white
               text-sm font-medium tracking-wide
               rounded-sm border border-muji-charcoal
               transition-all duration-200
               hover:bg-muji-text hover:border-muji-text
               active:scale-[0.98]"
        @click="openConfirm"
      >
        <i class="fa-solid fa-circle-check text-xs"></i>
        送出醫令
      </button>
    </div>

    <!-- Confirm Modal -->
    <Teleport to="body">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-muji-text/40 backdrop-blur-[2px] z-50
               flex items-center justify-center p-4"
      >
        <div class="w-full max-w-md bg-white rounded-sm border border-muji-border shadow-lg">
          <div class="flex items-center justify-between px-6 py-4 border-b border-muji-border">
            <h3 class="text-base font-normal text-muji-text tracking-tight">確認送出醫令</h3>
            <button class="text-muji-linen hover:text-muji-charcoal transition-colors p-1" @click="showConfirmModal = false">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>
          <div class="px-6 py-5">
            <p class="text-sm text-muji-text-light leading-relaxed">
              您即將送出此醫令，請確認所有資訊皆正確無誤。
            </p>
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-muji-border">
            <button
              class="px-4 py-2 text-sm text-muji-charcoal border border-muji-border rounded-sm
                     hover:bg-muji-cream transition-colors duration-150"
              @click="showConfirmModal = false"
            >
              取消
            </button>
            <button
              :disabled="isSubmitting"
              class="px-4 py-2 text-sm text-muji-white bg-muji-charcoal rounded-sm
                     hover:bg-muji-text transition-colors duration-150
                     disabled:opacity-40 disabled:cursor-not-allowed"
              @click="submitOrder"
            >
              {{ isSubmitting ? '送出中...' : '確認送出' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
