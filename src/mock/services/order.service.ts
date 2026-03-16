import type { Order, OrderStatus } from '@/types'
import { mockOrders } from '@/mock/data/orders'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

let orderCounter = mockOrders.length

const orders: Order[] = [...mockOrders]

export const orderService = {
  async getAll(): Promise<Order[]> {
    await delay()
    return [...orders]
  },

  async getById(id: string): Promise<Order> {
    await delay()
    const order = orders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    return { ...order }
  },

  async create(data: Partial<Order>): Promise<Order> {
    await delay(200)
    orderCounter++
    const now = new Date().toISOString()
    const newOrder: Order = {
      id: `ord-${String(orderCounter).padStart(3, '0')}`,
      orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orderCounter).padStart(3, '0')}`,
      patientId: data.patientId || '',
      physicianName: data.physicianName || '',
      testItemIds: data.testItemIds || [],
      status: 'pending',
      clinicalNotes: data.clinicalNotes,
      isUrgent: data.isUrgent || false,
      orderedAt: now,
      createdBy: data.createdBy || 'u-001',
      updatedAt: now,
    }
    orders.unshift(newOrder)
    return { ...newOrder }
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await delay()
    const order = orders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    order.status = status
    order.updatedAt = new Date().toISOString()
    return { ...order }
  },
}
