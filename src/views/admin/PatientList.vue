<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePatientStore } from '@/stores/patient'

const router = useRouter()
const patientStore = usePatientStore()

const patients = computed(() => patientStore.filteredPatients)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

function getGenderLabel(gender: string): string {
  const map: Record<string, string> = { male: '男', female: '女', other: '其他' }
  return map[gender] || gender
}

function goToDetail(id: string) {
  router.push({ name: 'PatientDetail', params: { id } })
}

onMounted(async () => {
  await patientStore.fetchPatients()
})
</script>

<template>
  <div class="p-8 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-light text-muji-text tracking-tight">病患管理</h1>
        <p class="text-sm text-muji-text-light mt-1">查看與管理病患資料。</p>
      </div>
    </div>

    <!-- Search -->
    <div>
      <input
        v-model="patientStore.searchQuery"
        type="text"
        placeholder="搜尋姓名、病歷號或身份證號..."
        class="w-full max-w-md px-4 py-2.5 text-sm border border-muji-border rounded-sm
               bg-muji-white text-muji-text placeholder-muji-text-light/60
               focus:outline-none focus:border-muji-charcoal transition-colors"
      />
    </div>

    <!-- Table -->
    <div class="border border-muji-border rounded-sm bg-muji-white overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-muji-border text-left text-xs text-muji-text-light uppercase tracking-wide">
            <th class="px-5 py-3">病歷號</th>
            <th class="px-5 py-3">姓名</th>
            <th class="px-5 py-3">性別</th>
            <th class="px-5 py-3">生日</th>
            <th class="px-5 py-3">電話</th>
            <th class="px-5 py-3">建檔日期</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="patient in patients"
            :key="patient.id"
            @click="goToDetail(patient.id)"
            class="border-b border-muji-border last:border-b-0 hover:bg-muji-bg/50 transition-colors cursor-pointer"
          >
            <td class="px-5 py-3 font-mono text-xs text-muji-text">{{ patient.medicalRecordNumber }}</td>
            <td class="px-5 py-3 text-muji-text">{{ patient.name }}</td>
            <td class="px-5 py-3 text-muji-text-light">{{ getGenderLabel(patient.gender) }}</td>
            <td class="px-5 py-3 text-muji-text-light">{{ formatDate(patient.birthDate) }}</td>
            <td class="px-5 py-3 text-muji-text-light">{{ patient.phone }}</td>
            <td class="px-5 py-3 text-muji-text-light">{{ formatDate(patient.createdAt) }}</td>
          </tr>
          <tr v-if="patients.length === 0">
            <td colspan="6" class="px-5 py-12 text-center text-muji-text-light">
              暫無病患資料
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
