import type { Report } from '@/types'
import { mockReports } from '@/mock/data/reports'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const reports: Report[] = [...mockReports]

export const reportService = {
  async getAll(): Promise<Report[]> {
    await delay()
    return [...reports].map((r) => ({ ...r }))
  },

  async getById(id: string): Promise<Report> {
    await delay()
    const report = reports.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    return { ...report }
  },

  async approve(id: string, reviewerId: string): Promise<Report> {
    await delay(200)
    const report = reports.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    const now = new Date().toISOString()
    report.status = 'final'
    report.reviewedBy = reviewerId
    report.reviewedAt = now
    report.approvedBy = reviewerId
    report.approvedAt = now
    report.updatedAt = now
    return { ...report }
  },

  async reject(id: string, reason: string): Promise<Report> {
    await delay(200)
    const report = reports.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    report.rejectionReason = reason
    report.updatedAt = new Date().toISOString()
    return { ...report }
  },
}
