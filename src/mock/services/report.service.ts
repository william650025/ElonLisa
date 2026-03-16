import type { Report, ReportStatus } from '@/types'
import { mockReports } from '@/mock/data/reports'
import { delay } from '@/mock/helpers/delay'
import { generateId } from '@/mock/helpers/id-generator'

let reports = [...mockReports]

export const reportService = {
  async getAll(): Promise<Report[]> {
    await delay(300)
    return [...reports]
  },

  async getById(id: string): Promise<Report | undefined> {
    await delay(200)
    return reports.find((r) => r.id === id)
  },

  async getByPatient(patientId: string): Promise<Report[]> {
    await delay(250)
    return reports.filter((r) => r.patientId === patientId)
  },

  async getByOrder(orderId: string): Promise<Report | undefined> {
    await delay(200)
    return reports.find((r) => r.orderId === orderId)
  },

  async getByStatus(status: ReportStatus): Promise<Report[]> {
    await delay(250)
    return reports.filter((r) => r.status === status)
  },

  async create(data: Partial<Report>): Promise<Report> {
    await delay(400)
    const now = new Date().toISOString()
    const count = reports.length + 1
    const report: Report = {
      id: generateId(),
      reportNumber: `RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(count).padStart(3, '0')}`,
      orderId: data.orderId ?? '',
      patientId: data.patientId ?? '',
      status: 'draft',
      resultIds: data.resultIds ?? [],
      summary: data.summary,
      createdAt: now,
      updatedAt: now,
    }
    reports.push(report)
    return report
  },

  async update(id: string, data: Partial<Report>): Promise<Report> {
    await delay(300)
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) throw new Error(`Report ${id} not found`)
    reports[index] = { ...reports[index], ...data, updatedAt: new Date().toISOString() }
    return reports[index]
  },

  async review(id: string, reviewedBy: string): Promise<Report> {
    return this.update(id, {
      status: 'reviewed',
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    })
  },

  async approve(id: string, approvedBy: string): Promise<Report> {
    return this.update(id, {
      status: 'final',
      approvedBy,
      approvedAt: new Date().toISOString(),
    })
  },

  async reject(id: string, reason: string): Promise<Report> {
    return this.update(id, {
      status: 'draft',
      rejectionReason: reason,
    })
  },
}
