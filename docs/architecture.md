# LISA 前端架構設計文件

> Laboratory Information System — Frontend Architecture  
> 版本：1.0 | 日期：2026-03-16 | 作者：Marcus（Backend Architect）

---

## 1. 專案概述

| 項目 | 說明 |
|------|------|
| 專案名稱 | LISA（Laboratory Information System） |
| 類型 | 純前端 Demo（MVP） |
| 技術棧 | Vue 3 (Composition API) + Tailwind CSS |
| 建構工具 | Vite |
| 資料層 | Mock Data（JSON / JS 模組，模擬 API） |
| 目標 | 展示 LIS 三大角色流程的可互動原型 |

### 1.1 三大角色與功能模組

| 角色 | 英文代碼 | 功能 |
|------|---------|------|
| 行政人員 | `admin` | 醫令開單、選擇檢驗項目、病患管理、醫令清單 |
| 醫檢師 | `technologist` | 檢驗值輸入、異常值標記、報告核發、工作清單 |
| 客戶/醫師 | `client` | 報告查看、報告搜尋、詳細報告、歷史趨勢圖表 |

---

## 2. 路由架構（Vue Router）

### 2.1 路由結構

```
/                           → 角色選擇頁（RoleSelector）
/admin                      → 行政人員 Layout
  /admin/dashboard          → 儀表板（醫令統計總覽）
  /admin/orders             → 醫令清單
  /admin/orders/create      → 開立醫令
  /admin/orders/:id         → 醫令詳情
  /admin/patients           → 病患列表
  /admin/patients/:id       → 病患詳情

/tech                       → 醫檢師 Layout
  /tech/dashboard           → 儀表板（待處理工作統計）
  /tech/worklist            → 工作清單（待檢驗醫令）
  /tech/worklist/:orderId   → 輸入檢驗值
  /tech/review              → 待核發報告清單
  /tech/review/:reportId    → 報告核發詳情

/client                     → 客戶 Layout
  /client/dashboard         → 儀表板（最新報告摘要）
  /client/reports           → 報告列表（含搜尋）
  /client/reports/:id       → 報告詳情
  /client/reports/:id/trend → 歷史趨勢圖表
```

### 2.2 路由設計原則

- **角色隔離**：每個角色使用獨立的 Layout 元件，包含各自的 sidebar 與 navbar
- **巢狀路由**：使用 `<router-view>` 巢狀，Layout 層負責共用框架
- **Lazy Loading**：所有 view 元件使用 `() => import(...)` 動態載入
- **路由守衛**：透過 `beforeEach` 守衛確認角色身份（Demo 中以 localStorage 模擬）
- **重導向**：`/admin` → `/admin/dashboard`，其他角色同理

### 2.3 路由檔案組織

```
src/router/
  index.ts              # 主路由設定 + 全域守衛
  admin.routes.ts       # 行政人員路由
  tech.routes.ts        # 醫檢師路由
  client.routes.ts      # 客戶路由
```

---

## 3. 狀態管理（Pinia Stores）

### 3.1 Store 規劃

| Store | 檔案 | 職責 |
|-------|------|------|
| `useAuthStore` | `auth.ts` | 當前角色身份、切換角色 |
| `usePatientStore` | `patient.ts` | 病患資料 CRUD、搜尋 |
| `useOrderStore` | `order.ts` | 醫令 CRUD、狀態流轉 |
| `useTestItemStore` | `testItem.ts` | 檢驗項目主檔（唯讀參考） |
| `useResultStore` | `result.ts` | 檢驗結果輸入、異常標記 |
| `useReportStore` | `report.ts` | 報告核發、查詢、歷史 |
| `useNotificationStore` | `notification.ts` | 全域通知 / Toast 訊息 |
| `useUIStore` | `ui.ts` | Sidebar 狀態、Modal 控制、載入狀態 |

### 3.2 Store 設計原則

- 使用 **Setup Store** 語法（`defineStore('name', () => { ... })`）
- Store 呼叫 Mock Service 取得資料，不直接操作 mock data
- 提供 `loading` / `error` 狀態供元件使用
- 列表型資料提供 computed getters 做篩選 / 排序

### 3.3 資料流

```
View / Component
  → 呼叫 Store Action（如 store.fetchOrders()）
    → Store 呼叫 Mock Service（如 orderService.getAll()）
      → Mock Service 從 mock data 讀取、模擬延遲
        → 回傳資料，Store 更新 state
          → View 透過 reactive state 自動更新
```

### 3.4 醫令狀態流轉

```
DRAFT → SUBMITTED → IN_PROGRESS → RESULTED → REVIEWED → PUBLISHED
  ↑                                              ↓
  └──── REJECTED（退回修改）←─────────────────────┘
```

| 狀態 | 說明 | 操作角色 |
|------|------|---------|
| `DRAFT` | 草稿 | Admin |
| `SUBMITTED` | 已送出 | Admin |
| `IN_PROGRESS` | 檢驗中 | Technologist |
| `RESULTED` | 已輸入結果 | Technologist |
| `REVIEWED` | 已覆核 | Technologist |
| `PUBLISHED` | 已核發報告 | Technologist |
| `REJECTED` | 退回 | Technologist |

---

## 4. Mock Data 服務層

### 4.1 架構分層

```
src/mock/
  data/                     # 靜態 mock 資料
    patients.ts             # 病患資料
    test-items.ts           # 檢驗項目主檔
    orders.ts               # 醫令資料
    results.ts              # 檢驗結果
    reports.ts              # 報告資料
  services/                 # 模擬 API 服務
    patient.service.ts
    order.service.ts
    test-item.service.ts
    result.service.ts
    report.service.ts
  helpers/
    delay.ts                # 模擬網路延遲（50-300ms）
    id-generator.ts         # 產生唯一 ID
    faker.ts                # 輔助產生隨機資料
  index.ts                  # 統一匯出
```

### 4.2 Mock Service 設計

每個 service 遵循統一的 CRUD 介面：

```typescript
// 範例：order.service.ts
export const orderService = {
  getAll(filters?: OrderFilter): Promise<Order[]>,
  getById(id: string): Promise<Order>,
  create(data: CreateOrderDTO): Promise<Order>,
  update(id: string, data: UpdateOrderDTO): Promise<Order>,
  delete(id: string): Promise<void>,
  // 業務方法
  submit(id: string): Promise<Order>,
  getByPatient(patientId: string): Promise<Order[]>,
}
```

### 4.3 設計原則

- 所有方法回傳 `Promise`，模擬非同步行為
- 使用 `delay()` 模擬 50-300ms 網路延遲
- 資料存於記憶體（module-level 變數），重新整理即重置
- 提供足夠的初始資料（至少 10 筆病患、20 筆醫令、各種狀態）
- 模擬錯誤場景：可選 `MOCK_ERROR_RATE` 環境變數

### 4.4 核心資料型別

```typescript
// types/patient.ts
interface Patient {
  id: string
  medicalRecordNumber: string   // 病歷號
  name: string
  gender: 'M' | 'F'
  birthDate: string             // ISO date
  idNumber: string              // 身分證字號
  phone: string
  bloodType?: string
}

// types/order.ts
interface Order {
  id: string
  patientId: string
  status: OrderStatus
  testItems: OrderTestItem[]    // 選擇的檢驗項目
  orderedBy: string             // 開單人員
  orderedAt: string             // 開單時間
  notes?: string
}

// types/test-item.ts
interface TestItem {
  id: string
  code: string                  // 檢驗代碼（如 CBC、BMP）
  name: string                  // 檢驗名稱
  category: string              // 分類（血液、生化、尿液...）
  unit: string                  // 單位
  referenceRange: {
    min: number
    max: number
  }
  specimen: string              // 檢體類型
}

// types/result.ts
interface TestResult {
  id: string
  orderId: string
  testItemId: string
  value: number | string
  isAbnormal: boolean
  abnormalFlag?: 'H' | 'L' | 'C'  // High / Low / Critical
  testedBy: string
  testedAt: string
}

// types/report.ts
interface Report {
  id: string
  orderId: string
  patientId: string
  status: 'DRAFT' | 'REVIEWED' | 'PUBLISHED'
  results: TestResult[]
  reviewedBy?: string
  reviewedAt?: string
  publishedAt?: string
}
```

---

## 5. 共用元件架構

### 5.1 元件分類

| 分類 | 前綴 | 範例 | 說明 |
|------|------|------|------|
| Base UI | `Base` | `BaseButton`, `BaseInput` | 最基礎的 UI 原子元件 |
| Composite | `App` | `AppTable`, `AppModal` | 組合型元件，含業務邏輯框架 |
| Layout | `Layout` | `LayoutSidebar`, `LayoutNavbar` | 版面佈局元件 |
| Domain | 無前綴 | `PatientSelector`, `OrderStatusBadge` | 業務領域元件 |

### 5.2 共用元件清單

```
src/components/
  base/
    BaseButton.vue          # 按鈕（primary/secondary/danger/ghost）
    BaseInput.vue           # 輸入框（text/number/date）
    BaseSelect.vue          # 下拉選單
    BaseCheckbox.vue        # 核取方塊
    BaseBadge.vue           # 狀態標籤
    BaseIcon.vue            # Icon 包裝（使用 heroicons）
    BaseSpinner.vue         # 載入動畫
  composite/
    AppTable.vue            # 資料表格（排序、分頁、篩選）
    AppModal.vue            # 彈窗（確認 / 表單）
    AppCard.vue             # 卡片容器
    AppAlert.vue            # 警告 / 通知訊息
    AppPagination.vue       # 分頁控制
    AppSearchBar.vue        # 搜尋列
    AppEmptyState.vue       # 空狀態提示
    AppConfirmDialog.vue    # 確認對話框
    AppToast.vue            # Toast 通知
    AppDropdown.vue         # 下拉選單（action menu）
  layout/
    LayoutShell.vue         # 主框架（sidebar + content）
    LayoutSidebar.vue       # 側邊欄
    LayoutNavbar.vue        # 頂部導覽列
    LayoutBreadcrumb.vue    # 麵包屑導覽
    LayoutPageHeader.vue    # 頁面標題區
  domain/
    PatientSelector.vue     # 病患選擇器（搜尋 + 選取）
    PatientInfoCard.vue     # 病患資訊卡
    OrderStatusBadge.vue    # 醫令狀態標籤
    TestItemPicker.vue      # 檢驗項目選擇器
    ResultValueInput.vue    # 檢驗值輸入（含異常標記）
    AbnormalFlag.vue        # 異常值標記
    TrendChart.vue          # 歷史趨勢圖表
    ReportViewer.vue        # 報告檢視器
```

### 5.3 元件設計原則

- **Props Down, Events Up**：資料透過 props 傳入，事件透過 emit 通知
- **Slot 擴展**：複合型元件提供 named slots 供自訂內容
- **TypeScript Props**：使用 `defineProps<T>()` 定義型別
- **無狀態優先**：Base 元件不持有業務狀態
- **Tailwind 類別**：支援透過 `class` prop 覆蓋樣式

---

## 6. Composables（可組合函式）

### 6.1 Composable 清單

```
src/composables/
  useSearch.ts              # 搜尋 + debounce 邏輯
  usePagination.ts          # 分頁計算邏輯
  useSort.ts                # 排序邏輯
  useForm.ts                # 表單狀態 + 驗證
  useConfirm.ts             # 確認對話框控制
  useToast.ts               # Toast 通知
  useLoading.ts             # 載入狀態管理
  useLocalStorage.ts        # localStorage 封裝（或用 VueUse）
  useOrderWorkflow.ts       # 醫令流程狀態機
  useAbnormalCheck.ts       # 檢驗值異常判定邏輯
```

### 6.2 設計原則

- 每個 composable 只做一件事
- 回傳 reactive 參照 + 方法
- 可獨立測試

---

## 7. 第三方套件建議

### 7.1 必要套件

| 套件 | 用途 | 說明 |
|------|------|------|
| `vue-router@4` | 路由 | SPA 路由管理 |
| `pinia` | 狀態管理 | 輕量 store |
| `tailwindcss@3` | CSS 框架 | Utility-first CSS |
| `@heroicons/vue` | 圖示 | Tailwind 風格 SVG 圖示 |
| `chart.js` + `vue-chartjs` | 圖表 | 歷史趨勢折線圖 |

### 7.2 推薦套件

| 套件 | 用途 | 說明 |
|------|------|------|
| `@vueuse/core` | 工具函式 | 常用 composable 集合（useStorage, useDebounceFn 等） |
| `dayjs` | 日期處理 | 輕量日期格式化 / 計算 |
| `vee-validate` + `zod` | 表單驗證 | 型別安全的表單驗證方案 |
| `@tanstack/vue-table` | 進階表格 | 如需複雜表格功能（排序、篩選、分組） |

### 7.3 開發工具

| 套件 | 用途 |
|------|------|
| `typescript` | 型別安全 |
| `eslint` + `@antfu/eslint-config` | 程式碼品質 |
| `prettier` | 格式化 |
| `unplugin-auto-import` | 自動匯入 Vue/Router/Pinia API |
| `unplugin-vue-components` | 自動註冊元件 |

---

## 8. 程式碼規範與命名慣例

### 8.1 檔案命名

| 類型 | 慣例 | 範例 |
|------|------|------|
| Vue 元件 | PascalCase | `BaseButton.vue`, `PatientSelector.vue` |
| Composable | camelCase（use 前綴） | `useSearch.ts`, `usePagination.ts` |
| Store | camelCase（use 前綴） | `useOrderStore` → `order.ts` |
| Service | kebab-case + `.service` | `order.service.ts` |
| Type 定義 | kebab-case + `.types` | `order.types.ts` |
| Mock 資料 | kebab-case | `test-items.ts`, `orders.ts` |
| 路由 | kebab-case + `.routes` | `admin.routes.ts` |
| 工具函式 | kebab-case | `id-generator.ts` |

### 8.2 程式碼風格

- **Vue SFC 區塊順序**：`<script setup>` → `<template>` → `<style>`
- **Script Setup**：統一使用 `<script setup lang="ts">`
- **Import 順序**：vue → vue-router → pinia → 第三方 → 內部模組
- **CSS**：優先使用 Tailwind 類別，僅在必要時使用 `<style scoped>`

### 8.3 Vue 元件規範

```vue
<script setup lang="ts">
// 1. Import
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/order'

// 2. Props & Emits
const props = defineProps<{
  orderId: string
  editable?: boolean
}>()

const emit = defineEmits<{
  save: [data: Order]
  cancel: []
}>()

// 3. Store / Composable
const orderStore = useOrderStore()

// 4. Reactive State
const isLoading = ref(false)

// 5. Computed
const orderStatus = computed(() => orderStore.getById(props.orderId)?.status)

// 6. Methods
function handleSave() { ... }

// 7. Lifecycle
onMounted(() => { ... })
</script>

<template>
  <!-- 模板 -->
</template>
```

### 8.4 TypeScript 規範

- 統一使用 `interface`（優先於 `type`，除非需要 union type）
- 所有 props 和 emits 使用泛型型別定義
- API 回傳型別定義在 `types/` 目錄
- Enum 使用 `as const` 物件替代

```typescript
// ✅ 推薦
export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  IN_PROGRESS: 'IN_PROGRESS',
} as const

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS]

// ❌ 避免
enum OrderStatus { ... }
```

### 8.5 路徑別名

```typescript
// vite.config.ts → resolve.alias
{
  '@': '/src',
  '@components': '/src/components',
  '@views': '/src/views',
  '@stores': '/src/stores',
  '@composables': '/src/composables',
  '@mock': '/src/mock',
  '@types': '/src/types',
}
```

---

## 9. 建構與環境設定

### 9.1 環境變數

```env
# .env.development
VITE_APP_TITLE=LISA - Laboratory Information System
VITE_MOCK_DELAY=150        # Mock API 延遲（ms）
VITE_MOCK_ERROR_RATE=0     # Mock 錯誤率（0-100）
```

### 9.2 Vite 設定重點

- 路徑別名（`@` → `src/`）
- 自動匯入（unplugin-auto-import + unplugin-vue-components）
- Tailwind CSS PostCSS 設定

---

## 10. 關鍵設計決策摘要

| 決策 | 選擇 | 理由 |
|------|------|------|
| 建構工具 | Vite | Vue 3 官方推薦，開發快速 |
| 狀態管理 | Pinia (Setup Store) | 輕量、TypeScript 友好 |
| CSS | Tailwind CSS | 快速開發、一致性 |
| 圖表 | Chart.js + vue-chartjs | 輕量、文件齊全、趨勢圖夠用 |
| 圖示 | Heroicons | 與 Tailwind 生態整合 |
| 表單驗證 | vee-validate + zod | 型別安全、宣告式驗證 |
| 日期 | dayjs | 輕量、API 類似 moment |
| Mock 層 | 自建 Service 模式 | 未來可無縫替換為真實 API |
