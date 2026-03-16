/** 報告狀態 */
export type ReportStatus = 'draft' | 'reviewed' | 'final'

/** 檢驗報告 */
export interface Report {
  /** 報告唯一識別碼 */
  id: string
  /** 報告編號（顯示用，如 RPT-20260316-001） */
  reportNumber: string
  /** 所屬醫令 ID */
  orderId: string
  /** 病患 ID */
  patientId: string
  /** 報告狀態 */
  status: ReportStatus
  /** 包含的檢驗結果 ID 清單 */
  resultIds: string[]
  /** 報告摘要 / 結論 */
  summary?: string
  /** 報告建立時間（ISO 8601） */
  createdAt: string
  /** 審核人員 ID */
  reviewedBy?: string
  /** 審核時間（ISO 8601） */
  reviewedAt?: string
  /** 簽核人員 ID */
  approvedBy?: string
  /** 簽核時間（ISO 8601） */
  approvedAt?: string
  /** 退回原因 */
  rejectionReason?: string
  /** 最後更新時間（ISO 8601） */
  updatedAt: string
}
