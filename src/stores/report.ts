import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Report, ReportStatus } from '@/types'
import { reportService } from '@/mock/services/report.service'

export const useReportStore = defineStore('report', () => {
  const reports = ref<Report[]>([])
  const currentReport = ref<Report | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

  const filteredReports = computed(() => {
    if (!searchQuery.value) return reports.value
    const q = searchQuery.value.toLowerCase()
    return reports.value.filter(
      (r) =>
        r.reportNumber.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q)
    )
  })

  const pendingReviews = computed(() =>
    reports.value.filter((r) => r.status === 'draft')
  )

  async function fetchReports() {
    loading.value = true
    error.value = null
    try {
      reports.value = await reportService.getAll()
    } catch (e: any) {
      error.value = e.message || '載入報告失敗'
    } finally {
      loading.value = false
    }
  }

  async function fetchReportById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentReport.value = await reportService.getById(id)
    } catch (e: any) {
      error.value = e.message || '載入報告失敗'
    } finally {
      loading.value = false
    }
  }

  async function approveReport(id: string, reviewerId: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await reportService.approve(id, reviewerId)
      const index = reports.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        reports.value[index] = updated
      }
      if (currentReport.value?.id === id) {
        currentReport.value = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.message || '核發報告失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function rejectReport(id: string, reason: string) {
    loading.value = true
    error.value = null
    try {
      const updated = await reportService.reject(id, reason)
      const index = reports.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        reports.value[index] = updated
      }
      if (currentReport.value?.id === id) {
        currentReport.value = updated
      }
      return updated
    } catch (e: any) {
      error.value = e.message || '退回報告失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getReportById(id: string): Report | undefined {
    return reports.value.find((r) => r.id === id)
  }

  return {
    reports,
    currentReport,
    loading,
    error,
    searchQuery,
    filteredReports,
    pendingReviews,
    fetchReports,
    fetchReportById,
    approveReport,
    rejectReport,
    getReportById,
  }
})
