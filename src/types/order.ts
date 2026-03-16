/** 醫令狀態 */
export type OrderStatus = 'pending' | 'collected' | 'testing' | 'completed' | 'cancelled'

/** 檢體類型 */
export type SpecimenType = 'blood' | 'urine' | 'stool' | 'swab' | 'other'

/** 採樣資訊 */
export interface SpecimenInfo {
  /** 檢體類型 */
  type: SpecimenType
  /** 採樣時間（ISO 8601） */
  collectedAt: string
  /** 採樣人員姓名 */
  collectedBy: string
  /** 檢體條碼 */
  barcode?: string
}

/** 檢驗醫令 */
export interface Order {
  /** 醫令唯一識別碼 */
  id: string
  /** 醫令編號（顯示用，如 ORD-20260316-001） */
  orderNumber: string
  /** 病患 ID */
  patientId: string
  /** 開單醫師姓名 */
  physicianName: string
  /** 所選檢驗項目 ID 清單 */
  testItemIds: string[]
  /** 醫令狀態 */
  status: OrderStatus
  /** 臨床備註 / 診斷資訊 */
  clinicalNotes?: string
  /** 優先順序（true = 急件） */
  isUrgent: boolean
  /** 開單時間（ISO 8601） */
  orderedAt: string
  /** 採樣資訊 */
  specimen?: SpecimenInfo
  /** 開單人員 ID */
  createdBy: string
  /** 最後更新時間（ISO 8601） */
  updatedAt: string
}
