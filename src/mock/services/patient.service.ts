import type { Patient } from '@/types'
import { mockPatients } from '@/mock/data/patients'
import { delay } from '@/mock/helpers/delay'
import { generateId } from '@/mock/helpers/id-generator'

let patients = [...mockPatients]

export const patientService = {
  async getAll(): Promise<Patient[]> {
    await delay(300)
    return [...patients]
  },

  async getById(id: string): Promise<Patient | undefined> {
    await delay(200)
    return patients.find((p) => p.id === id)
  },

  async search(query: string): Promise<Patient[]> {
    await delay(300)
    const q = query.toLowerCase()
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.medicalRecordNumber.toLowerCase().includes(q) ||
        p.nationalId.toLowerCase().includes(q)
    )
  },

  async create(data: Partial<Patient>): Promise<Patient> {
    await delay(400)
    const now = new Date().toISOString()
    const patient: Patient = {
      id: generateId(),
      medicalRecordNumber: `MRN-${Date.now()}`,
      name: data.name ?? '',
      gender: data.gender ?? 'O',
      birthDate: data.birthDate ?? '',
      nationalId: data.nationalId ?? '',
      phone: data.phone ?? '',
      email: data.email,
      address: data.address,
      clientId: data.clientId,
      createdAt: now,
      updatedAt: now,
    }
    patients.push(patient)
    return patient
  },

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    await delay(300)
    const index = patients.findIndex((p) => p.id === id)
    if (index === -1) throw new Error(`Patient ${id} not found`)
    patients[index] = { ...patients[index], ...data, updatedAt: new Date().toISOString() }
    return patients[index]
  },

  async delete(id: string): Promise<void> {
    await delay(200)
    patients = patients.filter((p) => p.id !== id)
  },
}
