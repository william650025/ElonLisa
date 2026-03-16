import type { Order, OrderStatus } from '@/types'
import { mockOrders } from '@/mock/data/orders'
import { delay } from '@/mock/helpers/delay'
import { generateId } from '@/mock/helpers/id-generator'

let orders = [...mockOrders]

export const orderService = {
  async getAll(): Promise<Order[]> {
    await delay(300)
    return [...orders]
  },

  async getById(id: string): Promise<Order | undefined> {
    await delay(200)
    return orders.find((o) => o.id === id)
  },

  async getByPatient(patientId: string): Promise<Order[]> {
    await delay(250)
    return orders.filter((o) => o.patientId === patientId)
  },

  async getByStatus(status: OrderStatus): Promise<Order[]> {
    await delay(250)
    return orders.filter((o) => o.status === status)
  },

  async create(data: Partial<Order>): Promise<Order> {
    await delay(400)
    const now = new Date().toISOString()
    const count = orders.length + 1
    const order: Order = {
      id: generateId(),
      orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(count).padStart(3, '0')}`,
      patientId: data.patientId ?? '',
      physicianName: data.physicianName ?? '',
      testItemIds: data.testItemIds ?? [],
      status: 'pending',
      clinicalNotes: data.clinicalNotes,
      isUrgent: data.isUrgent ?? false,
      orderedAt: now,
      createdBy: data.createdBy ?? '',
      updatedAt: now,
    }
    orders.push(order)
    return order
  },

  async update(id: string, data: Partial<Order>): Promise<Order> {
    await delay(300)
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error(`Order ${id} not found`)
    orders[index] = { ...orders[index], ...data, updatedAt: new Date().toISOString() }
    return orders[index]
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.update(id, { status })
  },

  async delete(id: string): Promise<void> {
    await delay(200)
    orders = orders.filter((o) => o.id !== id)
  },
}
