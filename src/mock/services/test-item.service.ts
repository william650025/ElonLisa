import type { TestItem } from '@/types'

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms))

const mockTestItems: TestItem[] = [
  { id: 'T001', code: 'WBC', name: 'White Blood Cell Count', category: '血液學', specimenType: 'blood', resultValueType: 'numeric', unit: '10³/µL', referenceMin: 4.0, referenceMax: 11.0, turnaroundDays: 1, isActive: true },
  { id: 'T002', code: 'RBC', name: 'Red Blood Cell Count', category: '血液學', specimenType: 'blood', resultValueType: 'numeric', unit: '10⁶/µL', referenceMin: 4.5, referenceMax: 5.5, turnaroundDays: 1, isActive: true },
  { id: 'T003', code: 'HGB', name: 'Hemoglobin', category: '血液學', specimenType: 'blood', resultValueType: 'numeric', unit: 'g/dL', referenceMin: 13.0, referenceMax: 17.0, turnaroundDays: 1, isActive: true },
  { id: 'T004', code: 'GOT', name: 'Glutamic Oxaloacetic Transaminase', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'U/L', referenceMin: 5, referenceMax: 40, turnaroundDays: 1, isActive: true },
  { id: 'T005', code: 'GPT', name: 'Glutamic Pyruvic Transaminase', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'U/L', referenceMin: 5, referenceMax: 40, turnaroundDays: 1, isActive: true },
  { id: 'T006', code: 'HbA1c', name: 'Glycated Hemoglobin', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: '%', referenceMin: 4.0, referenceMax: 5.6, turnaroundDays: 2, isActive: true },
  { id: 'T007', code: 'UA', name: 'Urinalysis', category: '尿液', specimenType: 'urine', resultValueType: 'text', referenceText: 'Negative', turnaroundDays: 1, isActive: true },
  { id: 'T008', code: 'BUN', name: 'Blood Urea Nitrogen', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mg/dL', referenceMin: 7, referenceMax: 20, turnaroundDays: 1, isActive: true },
  { id: 'T009', code: 'CRE', name: 'Creatinine', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mg/dL', referenceMin: 0.6, referenceMax: 1.2, turnaroundDays: 1, isActive: true },
  { id: 'T010', code: 'GLU', name: 'Glucose (Fasting)', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mg/dL', referenceMin: 70, referenceMax: 100, turnaroundDays: 1, isActive: true },
  { id: 'T011', code: 'TC', name: 'Total Cholesterol', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mg/dL', referenceMin: 0, referenceMax: 200, turnaroundDays: 1, isActive: true },
  { id: 'T012', code: 'PLT', name: 'Platelet Count', category: '血液學', specimenType: 'blood', resultValueType: 'numeric', unit: '10³/µL', referenceMin: 150, referenceMax: 400, turnaroundDays: 1, isActive: true },
  { id: 'T013', code: 'K', name: 'Potassium', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mEq/L', referenceMin: 3.5, referenceMax: 5.0, turnaroundDays: 1, isActive: true },
  { id: 'T014', code: 'Na', name: 'Sodium', category: '生化學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mEq/L', referenceMin: 136, referenceMax: 145, turnaroundDays: 1, isActive: true },
  { id: 'T015', code: 'CRP', name: 'C-Reactive Protein', category: '免疫學', specimenType: 'blood', resultValueType: 'numeric', unit: 'mg/L', referenceMin: 0, referenceMax: 10, turnaroundDays: 1, isActive: true },
]

export const testItemService = {
  async getAll(): Promise<TestItem[]> {
    await delay()
    return [...mockTestItems]
  },

  async getById(id: string): Promise<TestItem> {
    await delay()
    const item = mockTestItems.find((t) => t.id === id)
    if (!item) throw new Error('Test item not found')
    return { ...item }
  },
}
