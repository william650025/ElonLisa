import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Order, OrderStatus } from '@/types'
import { orderService } from '@/mock/services/order.service'

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const statusFilter = ref<OrderStatus | 'all'>('all')
  const searchQuery = ref('')

  const filteredOrders = computed(() => {
    let result = orders.value

    if (statusFilter.value !== 'all') {
      result = result.filter((o) => o.status === statusFilter.value)
    }

    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.patientId.toLowerCase().includes(q) ||
          o.physicianName.toLowerCase().includes(q)
      )
    }

    return result
  })

  const orderStats = computed(() => {
    const total = orders.value.length
    const pending = orders.value.filter((o) => o.status === 'pending').length
    const completed = orders.value.filter((o) => o.status === 'completed').length
    const critical = orders.value.filter((o) => o.isUrgent && o.status === 'pending').length
    return { total, pending, completed, critical }
  })

  async function fetchOrders() {
    loading.value = true
    error.value = null
    try {
      orders.value = await orderService.getAll()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '載入醫令失敗'
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id: string) {
    loading.value = true
    error.value = null
    try {
      currentOrder.value = await orderService.getById(id)
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '載入醫令失敗'
    } finally {
      loading.value = false
    }
  }

  async function createOrder(data: Partial<Order>) {
    loading.value = true
    error.value = null
    try {
      const newOrder = await orderService.create(data)
      orders.value.unshift(newOrder)
      return newOrder
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '建立醫令失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(id: string, status: OrderStatus) {
    loading.value = true
    error.value = null
    try {
      const updated = await orderService.updateStatus(id, status)
      const index = orders.value.findIndex((o) => o.id === id)
      if (index !== -1) {
        orders.value[index] = updated
      }
      if (currentOrder.value?.id === id) {
        currentOrder.value = updated
      }
      return updated
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '更新醫令狀態失敗'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getOrderById(id: string): Order | undefined {
    return orders.value.find((o) => o.id === id)
  }

  return {
    orders,
    currentOrder,
    loading,
    error,
    statusFilter,
    searchQuery,
    filteredOrders,
    orderStats,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    getOrderById,
  }
})
