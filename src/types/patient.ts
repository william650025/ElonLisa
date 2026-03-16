/** 性別 */
export type Gender = 'M' | 'F' | 'O'

/** 病患基本資料 */
export interface Patient {
  /** 病患唯一識別碼 */
  id: string
  /** 病歷號碼 */
  medicalRecordNumber: string
  /** 姓名 */
  name: string
  /** 性別 */
  gender: Gender
  /** 出生日期（ISO 8601） */
  birthDate: string
  /** 身分證字號或護照號碼 */
  nationalId: string
  /** 聯絡電話 */
  phone: string
  /** 電子郵件 */
  email?: string
  /** 聯絡地址 */
  address?: string
  /** 所屬客戶/機構 ID */
  clientId?: string
  /** 建立時間（ISO 8601） */
  createdAt: string
  /** 最後更新時間（ISO 8601） */
  updatedAt: string
}
