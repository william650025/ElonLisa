import type { TestResult } from '@/types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

let resultCounter = 20

const mockResults: TestResult[] = [
  { id: 'R001', orderId: 'O004', testItemId: 'T006', patientId: 'P004', value: '6.2', numericValue: 6.2, flag: 'H', unit: '%', referenceRange: '4.0 – 5.6', isVerified: true, performedBy: 'U002', performedAt: '2026-03-16T09:30:00Z', verifiedBy: 'U002', verifiedAt: '2026-03-16T10:00:00Z' },
  { id: 'R002', orderId: 'O005', testItemId: 'T001', patientId: 'P005', value: '7.5', numericValue: 7.5, flag: null, unit: '10³/µL', referenceRange: '4.0 – 11.0', isVerified: true, performedBy: 'U002', performedAt: '2026-03-15T16:00:00Z', verifiedBy: 'U002', verifiedAt: '2026-03-15T17:00:00Z' },
  { id: 'R003', orderId: 'O005', testItemId: 'T004', patientId: 'P005', value: '28', numericValue: 28, flag: null, unit: 'U/L', referenceRange: '5 – 40', isVerified: true, performedBy: 'U002', performedAt: '2026-03-15T16:00:00Z', verifiedBy: 'U002', verifiedAt: '2026-03-15T17:00:00Z' },
  { id: 'R004', orderId: 'O009', testItemId: 'T004', patientId: 'P009', value: '45', numericValue: 45, flag: 'H', unit: 'U/L', referenceRange: '5 – 40', isVerified: true, performedBy: 'U002', performedAt: '2026-03-13T14:00:00Z', verifiedBy: 'U002', verifiedAt: '2026-03-13T15:00:00Z' },
  { id: 'R005', orderId: 'O009', testItemId: 'T005', patientId: 'P009', value: '38', numericValue: 38, flag: null, unit: 'U/L', referenceRange: '5 – 40', isVerified: true, performedBy: 'U002', performedAt: '2026-03-13T14:00:00Z', verifiedBy: 'U002', verifiedAt: '2026-03-13T15:00:00Z' },
  { id: 'R006', orderId: 'O009', testItemId: 'T006', patientId: 'P009', value: '5.4', numericValue: 5.4, flag: null, unit: '%', referenceRange: '4.0 – 5.6', isVerified: true, performedBy: 'U002', performedAt: '2026-03-13T14:00:00Z', verifiedBy: 'U002', verifiedAt: '2026-03-13T15:00:00Z' },
]

export const resultService = {
  async getByOrderId(orderId: string): Promise<TestResult[]> {
    await delay()
    return mockResults.filter((r) => r.orderId === orderId).map((r) => ({ ...r }))
  },

  async getByPatientId(patientId: string): Promise<TestResult[]> {
    await delay()
    return mockResults.filter((r) => r.patientId === patientId).map((r) => ({ ...r }))
  },

  async save(result: Partial<TestResult>): Promise<TestResult> {
    await delay(200)
    resultCounter++
    const now = new Date().toISOString()
    const saved: TestResult = {
      id: result.id || `R${String(resultCounter).padStart(3, '0')}`,
      orderId: result.orderId || '',
      testItemId: result.testItemId || '',
      patientId: result.patientId || '',
      value: result.value || '',
      numericValue: result.numericValue,
      flag: result.flag ?? null,
      unit: result.unit,
      referenceRange: result.referenceRange,
      comment: result.comment,
      performedBy: result.performedBy || 'U002',
      performedAt: now,
      isVerified: result.isVerified || false,
    }
    mockResults.push(saved)
    return { ...saved }
  },

  async saveAll(results: Partial<TestResult>[]): Promise<TestResult[]> {
    await delay(300)
    const saved: TestResult[] = []
    const now = new Date().toISOString()
    for (const result of results) {
      resultCounter++
      const r: TestResult = {
        id: result.id || `R${String(resultCounter).padStart(3, '0')}`,
        orderId: result.orderId || '',
        testItemId: result.testItemId || '',
        patientId: result.patientId || '',
        value: result.value || '',
        numericValue: result.numericValue,
        flag: result.flag ?? null,
        unit: result.unit,
        referenceRange: result.referenceRange,
        performedBy: 'U002',
        performedAt: now,
        isVerified: false,
      }
      mockResults.push(r)
      saved.push({ ...r })
    }
    return saved
  },
}
