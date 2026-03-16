# LISA — 資料模型定義

> TypeScript 介面定義，供 Mock Data 與未來 API 對接使用

---

## 共用型別

```typescript
/** 醫令狀態 */
type OrderStatus = 'pending' | 'collected' | 'testing' | 'completed' | 'cancelled'

/** 報告狀態 */
type ReportStatus = 'draft' | 'reviewed' | 'final'

/** 系統角色 */
type UserRole = 'admin' | 'technologist' | 'client'

/** 檢驗結果異常標記 */
type AbnormalFlag = 'H' | 'L' | 'A' | null
// H = 偏高 (High), L = 偏低 (Low), A = 異常 (Abnormal), null = 正常

/** 性別 */
type Gender = 'M' | 'F' | 'O'
// M = 男, F = 女, O = 其他

/** 檢體類型 */
type SpecimenType = 'blood' | 'urine' | 'stool' | 'swab' | 'other'

/** 檢驗結果值型別 */
type ResultValueType = 'numeric' | 'text' | 'boolean'
```

---

## Patient（病患）

```typescript
/** 病患基本資料 */
interface Patient {
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

  /** 所屬客戶/機構 ID（關聯到哪個 Client） */
  clientId?: string

  /** 建立時間（ISO 8601） */
  createdAt: string

  /** 最後更新時間（ISO 8601） */
  updatedAt: string
}
```

---

## Order（醫令）

```typescript
/** 檢驗醫令 */
interface Order {
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

  /** 採樣資訊（採樣完成後填入） */
  specimen?: SpecimenInfo

  /** 開單人員 ID */
  createdBy: string

  /** 最後更新時間（ISO 8601） */
  updatedAt: string
}

/** 採樣資訊 */
interface SpecimenInfo {
  /** 檢體類型 */
  type: SpecimenType

  /** 採樣時間（ISO 8601） */
  collectedAt: string

  /** 採樣人員姓名 */
  collectedBy: string

  /** 檢體條碼（預留欄位） */
  barcode?: string
}
```

---

## TestItem（檢驗項目）

```typescript
/** 檢驗項目定義（目錄資料） */
interface TestItem {
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

  /** 參考範圍下限（numeric 型別使用） */
  referenceMin?: number

  /** 參考範圍上限（numeric 型別使用） */
  referenceMax?: number

  /** 參考範圍文字說明（如 "Negative", "< 40"） */
  referenceText?: string

  /** 報告所需天數（預估） */
  turnaroundDays: number

  /** 是否啟用 */
  isActive: boolean
}
```

---

## TestResult（檢驗結果）

```typescript
/** 單項檢驗結果 */
interface TestResult {
  /** 結果唯一識別碼 */
  id: string

  /** 所屬醫令 ID */
  orderId: string

  /** 檢驗項目 ID */
  testItemId: string

  /** 病患 ID（冗餘欄位，方便查詢） */
  patientId: string

  /** 檢驗結果值（數字轉為字串儲存，統一處理） */
  value: string

  /** 數值型結果（方便比對參考範圍） */
  numericValue?: number

  /** 異常標記 */
  flag: AbnormalFlag

  /** 單位（從 TestItem 帶入，方便顯示） */
  unit?: string

  /** 參考範圍（從 TestItem 帶入，方便顯示） */
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
```

---

## Report（報告）

```typescript
/** 檢驗報告 */
interface Report {
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

  /** 簽核人員 ID（最終核發） */
  approvedBy?: string

  /** 簽核時間（ISO 8601） */
  approvedAt?: string

  /** 退回原因（被退回時填入） */
  rejectionReason?: string

  /** 最後更新時間（ISO 8601） */
  updatedAt: string
}
```

---

## User（系統使用者）

```typescript
/** 系統使用者 */
interface User {
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
```

---

## WorklistItem（工作清單項目）

```typescript
/** 醫檢師工作清單項目（衍生自 Order + TestItem） */
interface WorklistItem {
  /** 工作清單項目 ID */
  id: string

  /** 所屬醫令 ID */
  orderId: string

  /** 醫令編號（方便顯示） */
  orderNumber: string

  /** 檢驗項目 ID */
  testItemId: string

  /** 檢驗項目名稱（方便顯示） */
  testItemName: string

  /** 檢驗項目代碼（方便顯示） */
  testItemCode: string

  /** 病患 ID */
  patientId: string

  /** 病患姓名（方便顯示） */
  patientName: string

  /** 病歷號碼（方便顯示） */
  medicalRecordNumber: string

  /** 檢體類型 */
  specimenType: SpecimenType

  /** 是否急件 */
  isUrgent: boolean

  /** 處理狀態 */
  status: 'pending' | 'in-progress' | 'completed'

  /** 採樣時間（ISO 8601） */
  collectedAt: string

  /** 指派給哪位醫檢師（User ID） */
  assignedTo?: string

  /** 對應的檢驗結果 ID（完成後填入） */
  resultId?: string

  /** 優先排序值（數字越小越優先） */
  priority: number
}
```

---

## 介面關聯圖

```
User (admin)
  │
  └──creates──▶ Order ──references──▶ Patient
                  │
                  ├──contains──▶ TestItem[] (from catalog)
                  │
                  └──produces──▶ TestResult[]
                                    │
                                    └──included in──▶ Report
                                                       │
                                                       └──viewed by──▶ User (client)

User (technologist)
  │
  ├──works on──▶ WorklistItem ──derived from──▶ Order + TestItem
  │
  ├──enters──▶ TestResult
  │
  └──reviews/approves──▶ Report
```

---

## Mock Data 建議數量

| 模型 | 建議筆數 | 說明 |
|------|----------|------|
| User | 6–8 | 每個角色 2–3 位 |
| Patient | 15–20 | 含不同性別、年齡分佈 |
| TestItem | 20–30 | 涵蓋血液學、生化學、免疫學等分類 |
| Order | 25–35 | 各狀態都要有，含急件 |
| TestResult | 80–120 | 每筆醫令含 3–5 項結果 |
| Report | 15–20 | 各狀態都要有 |
| WorklistItem | 20–30 | 含 pending / in-progress / completed |

---

## 備註

1. 所有 `id` 欄位在 mock 中使用 UUID v4 格式（如 `550e8400-e29b-41d4-a716-446655440000`）
2. 所有時間欄位統一使用 ISO 8601 格式
3. `WorklistItem` 為衍生模型，實際由 Order + TestItem 組合而成，mock 中預先展開以簡化前端邏輯
4. `TestResult` 中的 `flag` 應由前端根據 `numericValue` 與 `TestItem` 的 `referenceMin` / `referenceMax` 自動計算
5. 介面設計已預留未來擴充欄位（如 `barcode`、`clientId`），MVP 階段可選填
