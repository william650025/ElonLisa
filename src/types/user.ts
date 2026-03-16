/** 系統角色 */
export type UserRole = 'admin' | 'technologist' | 'client'

/** 系統使用者 */
export interface User {
  /** 使用者唯一識別碼 */
  id: string
  /** 登入帳號 */
  username: string
  /** 顯示名稱 */
  displayName: string
  /** 系統角色 */
  role: UserRole
  /** 電子郵件 */
  email: string
  /** 所屬部門 / 機構名稱 */
  department?: string
  /** 職稱 */
  title?: string
  /** 帳號是否啟用 */
  isActive: boolean
  /** 最後登入時間（ISO 8601） */
  lastLoginAt?: string
  /** 建立時間（ISO 8601） */
  createdAt: string
}
