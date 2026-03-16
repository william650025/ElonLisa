import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Patient } from '@/types'
import { patientService } from '@/mock/services/patient.service'

export const usePatientStore = defineStore('patient', () => {
  const patients = ref<Patient[]>([])
  const currentPatient = ref<Patient | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredPatients = computed(() => {
    if (!searchQuery.value) return patients.value
    const q = searchQuery.value.toLowerCase()
    return patients.value.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.medicalRecordNumber.toLowerCase().includes(q) ||
        p.nationalId.toLowerCase().includes(q)
    )
  })

  async function fetchPatients() {
    loading.value = true
    error.value = null
    try {
      patients.value = await patientService.getAll()
    } catch (e: any) {
      error.value = e.message || '載入病患資料失敗'
    } finally {
      loading.value = false
    }
  }

  async function fetchPatientById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentPatient.value = await patientService.getById(id)
    } catch (e: any) {
      error.value = e.message || '載入病患資料失敗'
    } finally {
      loading.value = false
    }
  }

  function getPatientById(id: string): Patient | undefined {
    return patients.value.find((p) => p.id === id)
  }

  return {
    patients,
    currentPatient,
    loading,
    error,
    searchQuery,
    filteredPatients,
    fetchPatients,
    fetchPatientById,
    getPatientById,
  }
})
