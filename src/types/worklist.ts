import type { SpecimenType } from './order'

/** 醫檢師工作清單項目 */
export interface WorklistItem {
  /** 工作清單項目 ID */
  id: string
  /** 所屬醫令 ID */
  orderId: string
  /** 醫令編號 */
  orderNumber: string
  /** 檢驗項目 ID */
  testItemId: string
  /** 檢驗項目名稱 */
  testItemName: string
  /** 檢驗項目代碼 */
  testItemCode: string
  /** 病患 ID */
  patientId: string
  /** 病患姓名 */
  patientName: string
  /** 病歷號碼 */
  medicalRecordNumber: string
  /** 檢體類型 */
  specimenType: SpecimenType
  /** 是否急件 */
  isUrgent: boolean
  /** 處理狀態 */
  status: 'pending' | 'in-progress' | 'completed'
  /** 採樣時間（ISO 8601） */
  collectedAt: string
  /** 指派給哪位醫檢師 */
  assignedTo?: string
  /** 對應的檢驗結果 ID */
  resultId?: string
  /** 優先排序值（數字越小越優先） */
  priority: number
}
