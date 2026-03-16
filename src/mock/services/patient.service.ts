import type { Patient } from '@/types'
import { mockPatients } from '@/mock/data/patients'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const patients: Patient[] = [...mockPatients]

export const patientService = {
  async getAll(): Promise<Patient[]> {
    await delay()
    return [...patients]
  },

  async getById(id: string): Promise<Patient> {
    await delay()
    const patient = patients.find((p) => p.id === id)
    if (!patient) throw new Error('Patient not found')
    return { ...patient }
  },

  async search(query: string): Promise<Patient[]> {
    await delay()
    const q = query.toLowerCase()
    return patients.filter(
      (p) => p.name.toLowerCase().includes(q) || p.medicalRecordNumber.toLowerCase().includes(q)
    )
  },
}
