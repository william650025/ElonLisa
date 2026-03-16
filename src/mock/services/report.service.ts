import type { Report } from '@/types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const mockReports: Report[] = [
  { id: 'RPT001', reportNumber: 'RPT-20260316-001', orderId: 'O004', patientId: 'P004', status: 'final', resultIds: ['R001'], createdAt: '2026-03-16T10:00:00Z', reviewedBy: 'U002', reviewedAt: '2026-03-16T10:30:00Z', approvedBy: 'U002', approvedAt: '2026-03-16T10:30:00Z', updatedAt: '2026-03-16T10:30:00Z' },
  { id: 'RPT002', reportNumber: 'RPT-20260315-001', orderId: 'O005', patientId: 'P005', status: 'final', resultIds: ['R002', 'R003'], createdAt: '2026-03-15T17:00:00Z', reviewedBy: 'U002', reviewedAt: '2026-03-15T17:30:00Z', approvedBy: 'U002', approvedAt: '2026-03-15T17:30:00Z', updatedAt: '2026-03-15T17:30:00Z' },
  { id: 'RPT003', reportNumber: 'RPT-20260313-001', orderId: 'O009', patientId: 'P009', status: 'draft', resultIds: ['R004', 'R005', 'R006'], createdAt: '2026-03-13T15:00:00Z', updatedAt: '2026-03-13T15:00:00Z' },
  { id: 'RPT004', reportNumber: 'RPT-20260312-001', orderId: 'O002', patientId: 'P002', status: 'draft', resultIds: [], createdAt: '2026-03-12T14:00:00Z', updatedAt: '2026-03-12T14:00:00Z' },
  { id: 'RPT005', reportNumber: 'RPT-20260311-001', orderId: 'O007', patientId: 'P007', status: 'reviewed', resultIds: [], createdAt: '2026-03-11T16:00:00Z', reviewedBy: 'U002', reviewedAt: '2026-03-11T17:00:00Z', updatedAt: '2026-03-11T17:00:00Z' },
]

export const reportService = {
  async getAll(): Promise<Report[]> {
    await delay()
    return [...mockReports].map((r) => ({ ...r }))
  },

  async getById(id: string): Promise<Report> {
    await delay()
    const report = mockReports.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    return { ...report }
  },

  async approve(id: string, reviewerId: string): Promise<Report> {
    await delay(200)
    const report = mockReports.find((r) => r.id === id)
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
    const report = mockReports.find((r) => r.id === id)
    if (!report) throw new Error('Report not found')
    report.rejectionReason = reason
    report.updatedAt = new Date().toISOString()
    return { ...report }
  },
}
