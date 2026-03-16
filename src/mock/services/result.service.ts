import type { TestResult } from '@/types'
import { mockResults } from '@/mock/data/results'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

let resultCounter = mockResults.length

const results: TestResult[] = [...mockResults]

export const resultService = {
  async getByOrderId(orderId: string): Promise<TestResult[]> {
    await delay()
    return results.filter((r) => r.orderId === orderId).map((r) => ({ ...r }))
  },

  async getByPatientId(patientId: string): Promise<TestResult[]> {
    await delay()
    return results.filter((r) => r.patientId === patientId).map((r) => ({ ...r }))
  },

  async save(result: Partial<TestResult>): Promise<TestResult> {
    await delay(200)
    resultCounter++
    const now = new Date().toISOString()
    const saved: TestResult = {
      id: result.id || `res-${String(resultCounter).padStart(3, '0')}`,
      orderId: result.orderId || '',
      testItemId: result.testItemId || '',
      patientId: result.patientId || '',
      value: result.value || '',
      numericValue: result.numericValue,
      flag: result.flag ?? null,
      unit: result.unit,
      referenceRange: result.referenceRange,
      comment: result.comment,
      performedBy: result.performedBy || 'u-003',
      performedAt: now,
      isVerified: result.isVerified || false,
    }
    results.push(saved)
    return { ...saved }
  },

  async saveAll(resultsData: Partial<TestResult>[]): Promise<TestResult[]> {
    await delay(300)
    const saved: TestResult[] = []
    const now = new Date().toISOString()
    for (const result of resultsData) {
      resultCounter++
      const r: TestResult = {
        id: result.id || `res-${String(resultCounter).padStart(3, '0')}`,
        orderId: result.orderId || '',
        testItemId: result.testItemId || '',
        patientId: result.patientId || '',
        value: result.value || '',
        numericValue: result.numericValue,
        flag: result.flag ?? null,
        unit: result.unit,
        referenceRange: result.referenceRange,
        performedBy: 'u-003',
        performedAt: now,
        isVerified: false,
      }
      results.push(r)
      saved.push({ ...r })
    }
    return saved
  },
}
