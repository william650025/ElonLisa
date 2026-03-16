/** 醫令狀態 */
export type OrderStatus = 'pending' | 'collected' | 'testing' | 'completed' | 'cancelled'

/** 報告狀態 */
export type ReportStatus = 'draft' | 'reviewed' | 'final'

/** 系統角色 */
export type UserRole = 'admin' | 'technologist' | 'client'

/** 檢驗結果異常標記 */
export type AbnormalFlag = 'H' | 'L' | 'A' | null

/** 性別 */
export type Gender = 'M' | 'F' | 'O'

/** 檢體類型 */
export type SpecimenType = 'blood' | 'urine' | 'stool' | 'swab' | 'other'

/** 檢驗結果值型別 */
export type ResultValueType = 'numeric' | 'text' | 'boolean'

/** 病患基本資料 */
export interface Patient {
  id: string
  medicalRecordNumber: string
  name: string
  gender: Gender
  birthDate: string
  nationalId: string
  phone: string
  email?: string
  address?: string
  clientId?: string
  createdAt: string
  updatedAt: string
}

/** 採樣資訊 */
export interface SpecimenInfo {
  type: SpecimenType
  collectedAt: string
  collectedBy: string
  barcode?: string
}

/** 檢驗醫令 */
export interface Order {
  id: string
  orderNumber: string
  patientId: string
  physicianName: string
  testItemIds: string[]
  status: OrderStatus
  clinicalNotes?: string
  isUrgent: boolean
  orderedAt: string
  specimen?: SpecimenInfo
  createdBy: string
  updatedAt: string
}

/** 檢驗項目定義 */
export interface TestItem {
  id: string
  code: string
  name: string
  category: string
  specimenType: SpecimenType
  resultValueType: ResultValueType
  unit?: string
  referenceMin?: number
  referenceMax?: number
  referenceText?: string
  turnaroundDays: number
  isActive: boolean
}

/** 單項檢驗結果 */
export interface TestResult {
  id: string
  orderId: string
  testItemId: string
  patientId: string
  value: string
  numericValue?: number
  flag: AbnormalFlag
  unit?: string
  referenceRange?: string
  comment?: string
  performedBy?: string
  performedAt?: string
  isVerified: boolean
  verifiedBy?: string
  verifiedAt?: string
}

/** 檢驗報告 */
export interface Report {
  id: string
  reportNumber: string
  orderId: string
  patientId: string
  status: ReportStatus
  resultIds: string[]
  summary?: string
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string
  updatedAt: string
}

/** 系統使用者 */
export interface User {
  id: string
  username: string
  displayName: string
  role: UserRole
  email: string
  department?: string
  title?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

/** 醫檢師工作清單項目 */
export interface WorklistItem {
  id: string
  orderId: string
  orderNumber: string
  testItemId: string
  testItemName: string
  testItemCode: string
  patientId: string
  patientName: string
  medicalRecordNumber: string
  specimenType: SpecimenType
  isUrgent: boolean
  status: 'pending' | 'in-progress' | 'completed'
  collectedAt: string
  assignedTo?: string
  resultId?: string
  priority: number
}
