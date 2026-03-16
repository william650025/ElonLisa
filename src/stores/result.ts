import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TestResult, AbnormalFlag } from '@/types'
import { resultService } from '@/mock/services/result.service'

export const useResultStore = defineStore('result', () => {
  const results = ref<TestResult[]>([])
  const currentResults = ref<TestResult[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchResultsByOrderId(orderId: string) {
    loading.value = true
    error.value = null
    try {
      currentResults.value = await resultService.getByOrderId(orderId)
    } catch (e: any) {
      error.value = e.message || '載入檢驗結果失敗'
    } finally {
      loading.value = false
    }
  }

  async function saveResult(result: Partial<TestResult>) {
    loading.value = true
    error.value = null
    try {
      const saved = await resultService.save(result)
      const index = currentResults.value.findIndex((r) => r.id === saved.id)
      if (index !== -1) {
        currentResults.value[index] = saved
      } else {
        currentResults.value.push(saved)
      }
      return saved
    } catch (e: any) {
      error.value = e.message || '儲存檢驗結果失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function saveResults(resultsData: Partial<TestResult>[]) {
    loading.value = true
    error.value = null
    try {
      const saved = await resultService.saveAll(resultsData)
      currentResults.value = saved
      return saved
    } catch (e: any) {
      error.value = e.message || '儲存檢驗結果失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  function checkAbnormal(
    value: number,
    referenceMin?: number,
    referenceMax?: number
  ): AbnormalFlag {
    if (referenceMin === undefined || referenceMax === undefined) return null
    const criticalLow = referenceMin * 0.5
    const criticalHigh = referenceMax * 1.5
    if (value <= criticalLow || value >= criticalHigh) return 'A'
    if (value < referenceMin) return 'L'
    if (value > referenceMax) return 'H'
    return null
  }

  async function fetchResultsByPatientId(patientId: string) {
    loading.value = true
    error.value = null
    try {
      results.value = await resultService.getByPatientId(patientId)
    } catch (e: any) {
      error.value = e.message || '載入檢驗結果失敗'
    } finally {
      loading.value = false
    }
  }

  return {
    results,
    currentResults,
    loading,
    error,
    fetchResultsByOrderId,
    saveResult,
    saveResults,
    checkAbnormal,
    fetchResultsByPatientId,
  }
})
