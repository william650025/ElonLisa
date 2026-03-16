import type { Patient } from '@/types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const mockPatients: Patient[] = [
  { id: 'P001', medicalRecordNumber: 'MRN-10042', name: '陳大明', gender: 'M', birthDate: '1985-06-12', nationalId: 'A123456789', phone: '0912-345-678', email: 'chen@example.com', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
  { id: 'P002', medicalRecordNumber: 'MRN-10041', name: '林美玲', gender: 'F', birthDate: '1972-03-28', nationalId: 'B234567890', phone: '0923-456-789', email: 'lin@example.com', createdAt: '2025-01-02T00:00:00Z', updatedAt: '2025-01-02T00:00:00Z' },
  { id: 'P003', medicalRecordNumber: 'MRN-10039', name: '黃志偉', gender: 'M', birthDate: '1990-11-05', nationalId: 'C345678901', phone: '0934-567-890', createdAt: '2025-01-03T00:00:00Z', updatedAt: '2025-01-03T00:00:00Z' },
  { id: 'P004', medicalRecordNumber: 'MRN-10038', name: '吳淑芬', gender: 'F', birthDate: '1968-07-20', nationalId: 'D456789012', phone: '0945-678-901', createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z' },
  { id: 'P005', medicalRecordNumber: 'MRN-10037', name: '張家豪', gender: 'M', birthDate: '1995-01-15', nationalId: 'E567890123', phone: '0956-789-012', createdAt: '2025-02-15T00:00:00Z', updatedAt: '2025-02-15T00:00:00Z' },
  { id: 'P006', medicalRecordNumber: 'MRN-10036', name: '王雅婷', gender: 'F', birthDate: '1988-09-30', nationalId: 'F678901234', phone: '0967-890-123', createdAt: '2025-03-01T00:00:00Z', updatedAt: '2025-03-01T00:00:00Z' },
  { id: 'P007', medicalRecordNumber: 'MRN-10035', name: '李建國', gender: 'M', birthDate: '1960-12-08', nationalId: 'G789012345', phone: '0978-901-234', createdAt: '2025-03-10T00:00:00Z', updatedAt: '2025-03-10T00:00:00Z' },
  { id: 'P008', medicalRecordNumber: 'MRN-10034', name: '劉曉雯', gender: 'F', birthDate: '1978-04-22', nationalId: 'H890123456', phone: '0989-012-345', createdAt: '2025-04-01T00:00:00Z', updatedAt: '2025-04-01T00:00:00Z' },
  { id: 'P009', medicalRecordNumber: 'MRN-10033', name: '蔡明宏', gender: 'M', birthDate: '1982-08-14', nationalId: 'I901234567', phone: '0910-123-456', createdAt: '2025-05-01T00:00:00Z', updatedAt: '2025-05-01T00:00:00Z' },
  { id: 'P010', medicalRecordNumber: 'MRN-10032', name: '許芳瑜', gender: 'F', birthDate: '1992-02-18', nationalId: 'J012345678', phone: '0921-234-567', createdAt: '2025-06-01T00:00:00Z', updatedAt: '2025-06-01T00:00:00Z' },
]

export const patientService = {
  async getAll(): Promise<Patient[]> {
    await delay()
    return [...mockPatients]
  },

  async getById(id: string): Promise<Patient> {
    await delay()
    const patient = mockPatients.find((p) => p.id === id)
    if (!patient) throw new Error('Patient not found')
    return { ...patient }
  },

  async search(query: string): Promise<Patient[]> {
    await delay()
    const q = query.toLowerCase()
    return mockPatients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.medicalRecordNumber.toLowerCase().includes(q)
    )
  },
}
