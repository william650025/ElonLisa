import type { TestItem } from '@/types'
import { mockTestItems } from '@/mock/data/test-items'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const testItems: TestItem[] = [...mockTestItems]

export const testItemService = {
  async getAll(): Promise<TestItem[]> {
    await delay()
    return [...testItems]
  },

  async getById(id: string): Promise<TestItem> {
    await delay()
    const item = testItems.find((t) => t.id === id)
    if (!item) throw new Error('Test item not found')
    return { ...item }
  },
}
