import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TestItem } from '@/types'
import { testItemService } from '@/mock/services/test-item.service'

export const useTestItemStore = defineStore('testItem', () => {
  const testItems = ref<TestItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const categoryFilter = ref<string>('all')

  const categories = computed(() => {
    const cats = new Set(testItems.value.map((t) => t.category))
    return ['all', ...Array.from(cats)]
  })

  const filteredTestItems = computed(() => {
    let result = testItems.value.filter((t) => t.isActive)

    if (categoryFilter.value !== 'all') {
      result = result.filter((t) => t.category === categoryFilter.value)
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q)
      )
    }

    return result
  })

  async function fetchTestItems() {
    loading.value = true
    error.value = null
    try {
      testItems.value = await testItemService.getAll()
    } catch (e: any) {
      error.value = e.message || '載入檢驗項目失敗'
    } finally {
      loading.value = false
    }
  }

  function getTestItemById(id: string): TestItem | undefined {
    return testItems.value.find((t) => t.id === id)
  }

  function getTestItemsByIds(ids: string[]): TestItem[] {
    return testItems.value.filter((t) => ids.includes(t.id))
  }

  return {
    testItems,
    loading,
    error,
    searchQuery,
    categoryFilter,
    categories,
    filteredTestItems,
    fetchTestItems,
    getTestItemById,
    getTestItemsByIds,
  }
})
