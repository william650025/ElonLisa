import type { TestResult } from '@/types'
import { mockResults } from '@/mock/data/results'
import { delay } from '@/mock/helpers/delay'
import { generateId } from '@/mock/helpers/id-generator'

let results = [...mockResults]

export const resultService = {
  async getAll(): Promise<TestResult[]> {
    await delay(300)
    return [...results]
  },

  async getById(id: string): Promise<TestResult | undefined> {
    await delay(200)
    return results.find((r) => r.id === id)
  },

  async getByOrder(orderId: string): Promise<TestResult[]> {
    await delay(250)
    return results.filter((r) => r.orderId === orderId)
  },

  async getByPatient(patientId: string): Promise<TestResult[]> {
    await delay(250)
    return results.filter((r) => r.patientId === patientId)
  },

  async create(data: Partial<TestResult>): Promise<TestResult> {
    await delay(400)
    const result: TestResult = {
      id: generateId(),
      orderId: data.orderId ?? '',
      testItemId: data.testItemId ?? '',
      patientId: data.patientId ?? '',
      value: data.value ?? '',
      numericValue: data.numericValue,
      flag: data.flag ?? null,
      unit: data.unit,
      referenceRange: data.referenceRange,
      comment: data.comment,
      performedBy: data.performedBy,
      performedAt: data.performedAt ?? new Date().toISOString(),
      isVerified: false,
    }
    results.push(result)
    return result
  },

  async update(id: string, data: Partial<TestResult>): Promise<TestResult> {
    await delay(300)
    const index = results.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Result ${id} not found`)
    results[index] = { ...results[index], ...data }
    return results[index]
  },

  async verify(id: string, verifiedBy: string): Promise<TestResult> {
    return this.update(id, {
      isVerified: true,
      verifiedBy,
      verifiedAt: new Date().toISOString(),
    })
  },
}
