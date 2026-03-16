import type { SpecimenType } from './order'

/** 檢驗結果值型別 */
export type ResultValueType = 'numeric' | 'text' | 'boolean'

/** 檢驗結果異常標記 */
export type AbnormalFlag = 'H' | 'L' | 'A' | null

/** 檢驗項目定義（目錄資料） */
export interface TestItem {
  /** 項目唯一識別碼 */
  id: string
  /** 項目代碼（如 CBC, GOT, GPT） */
  code: string
  /** 項目名稱 */
  name: string
  /** 項目分類（如 血液學、生化學、免疫學） */
  category: string
  /** 所需檢體類型 */
  specimenType: SpecimenType
  /** 結果值型別 */
  resultValueType: ResultValueType
  /** 單位（如 mg/dL, x10³/µL） */
  unit?: string
  /** 參考範圍下限 */
  referenceMin?: number
  /** 參考範圍上限 */
  referenceMax?: number
  /** 參考範圍文字說明 */
  referenceText?: string
  /** 報告所需天數（預估） */
  turnaroundDays: number
  /** 是否啟用 */
  isActive: boolean
}

/** 單項檢驗結果 */
export interface TestResult {
  /** 結果唯一識別碼 */
  id: string
  /** 所屬醫令 ID */
  orderId: string
  /** 檢驗項目 ID */
  testItemId: string
  /** 病患 ID */
  patientId: string
  /** 檢驗結果值 */
  value: string
  /** 數值型結果 */
  numericValue?: number
  /** 異常標記 */
  flag: AbnormalFlag
  /** 單位 */
  unit?: string
  /** 參考範圍 */
  referenceRange?: string
  /** 結果備註 */
  comment?: string
  /** 執行檢驗的醫檢師 ID */
  performedBy?: string
  /** 檢驗執行時間（ISO 8601） */
  performedAt?: string
  /** 結果是否已確認 */
  isVerified: boolean
  /** 確認人員 ID */
  verifiedBy?: string
  /** 確認時間（ISO 8601） */
  verifiedAt?: string
}
