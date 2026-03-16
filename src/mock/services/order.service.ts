import type { Order, OrderStatus } from '@/types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

let orderCounter = 10

const mockOrders: Order[] = [
  { id: 'O001', orderNumber: 'ORD-20260316-001', patientId: 'P001', physicianName: 'Dr. Wang', testItemIds: ['T001', 'T002', 'T003'], status: 'pending', isUrgent: false, orderedAt: '2026-03-16T09:12:00Z', createdBy: 'U001', updatedAt: '2026-03-16T09:12:00Z' },
  { id: 'O002', orderNumber: 'ORD-20260316-002', patientId: 'P002', physicianName: 'Dr. Chen', testItemIds: ['T004', 'T005'], status: 'testing', isUrgent: false, orderedAt: '2026-03-16T08:55:00Z', createdBy: 'U001', updatedAt: '2026-03-16T08:55:00Z' },
  { id: 'O003', orderNumber: 'ORD-20260316-003', patientId: 'P003', physicianName: 'Dr. Wang', testItemIds: ['T001', 'T002'], status: 'pending', isUrgent: true, orderedAt: '2026-03-16T08:30:00Z', createdBy: 'U001', updatedAt: '2026-03-16T08:30:00Z', clinicalNotes: '懷疑貧血，請優先處理' },
  { id: 'O004', orderNumber: 'ORD-20260316-004', patientId: 'P004', physicianName: 'Dr. Lin', testItemIds: ['T006'], status: 'completed', isUrgent: false, orderedAt: '2026-03-16T07:45:00Z', createdBy: 'U001', updatedAt: '2026-03-16T10:00:00Z' },
  { id: 'O005', orderNumber: 'ORD-20260315-001', patientId: 'P005', physicianName: 'Dr. Wang', testItemIds: ['T001', 'T004'], status: 'completed', isUrgent: false, orderedAt: '2026-03-15T14:20:00Z', createdBy: 'U001', updatedAt: '2026-03-15T18:00:00Z' },
  { id: 'O006', orderNumber: 'ORD-20260315-002', patientId: 'P006', physicianName: 'Dr. Chen', testItemIds: ['T007', 'T008'], status: 'pending', isUrgent: true, orderedAt: '2026-03-15T10:30:00Z', createdBy: 'U001', updatedAt: '2026-03-15T10:30:00Z' },
  { id: 'O007', orderNumber: 'ORD-20260314-001', patientId: 'P007', physicianName: 'Dr. Lin', testItemIds: ['T002', 'T003', 'T005'], status: 'testing', isUrgent: false, orderedAt: '2026-03-14T11:00:00Z', createdBy: 'U001', updatedAt: '2026-03-14T14:00:00Z' },
  { id: 'O008', orderNumber: 'ORD-20260314-002', patientId: 'P008', physicianName: 'Dr. Wang', testItemIds: ['T001'], status: 'cancelled', isUrgent: false, orderedAt: '2026-03-14T09:00:00Z', createdBy: 'U001', updatedAt: '2026-03-14T09:30:00Z' },
  { id: 'O009', orderNumber: 'ORD-20260313-001', patientId: 'P009', physicianName: 'Dr. Chen', testItemIds: ['T004', 'T005', 'T006'], status: 'completed', isUrgent: false, orderedAt: '2026-03-13T08:00:00Z', createdBy: 'U001', updatedAt: '2026-03-13T16:00:00Z' },
  { id: 'O010', orderNumber: 'ORD-20260313-002', patientId: 'P010', physicianName: 'Dr. Lin', testItemIds: ['T007'], status: 'pending', isUrgent: false, orderedAt: '2026-03-13T15:30:00Z', createdBy: 'U001', updatedAt: '2026-03-13T15:30:00Z' },
]

export const orderService = {
  async getAll(): Promise<Order[]> {
    await delay()
    return [...mockOrders]
  },

  async getById(id: string): Promise<Order> {
    await delay()
    const order = mockOrders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    return { ...order }
  },

  async create(data: Partial<Order>): Promise<Order> {
    await delay(200)
    orderCounter++
    const now = new Date().toISOString()
    const newOrder: Order = {
      id: `O${String(orderCounter).padStart(3, '0')}`,
      orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orderCounter).padStart(3, '0')}`,
      patientId: data.patientId || '',
      physicianName: data.physicianName || '',
      testItemIds: data.testItemIds || [],
      status: 'pending',
      clinicalNotes: data.clinicalNotes,
      isUrgent: data.isUrgent || false,
      orderedAt: now,
      createdBy: data.createdBy || 'U001',
      updatedAt: now,
    }
    mockOrders.unshift(newOrder)
    return { ...newOrder }
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await delay()
    const order = mockOrders.find((o) => o.id === id)
    if (!order) throw new Error('Order not found')
    order.status = status
    order.updatedAt = new Date().toISOString()
    return { ...order }
  },
}
