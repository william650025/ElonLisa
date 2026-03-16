# Code Review Report

**審查者**: Daniel（Code Reviewer）
**審查日期**: 2026-03-16
**專案**: LISA — Laboratory Information System
**技術棧**: Vue 3 + TypeScript + Tailwind CSS + Pinia + Vue Router
**審查範圍**: `src/` 目錄下所有 `.vue` 和 `.ts` 檔案

---

## 總評

- **整體評分：7.5 / 10**
- **結論：❌ NEEDS CHANGES**

專案整體架構清晰、命名一致、Muji Style 設計語言貫徹良好。TypeScript 型別定義完整度高，Vue 3 Composition API 使用方式符合最佳實踐。主要問題集中在：**路由定義存在兩套不一致的版本**、**Mock 資料層存在冗餘**、**Stores 中大量使用 `catch (e: any)`**、以及**Layout 元件存在嚴重重複代碼**。以下依模組逐一說明。

---

## 嚴重問題（必須修復）

### 🔴 S1：路由定義存在兩套衝突版本

**位置**: `src/router/index.ts` vs `src/router/admin.routes.ts` / `tech.routes.ts` / `client.routes.ts`

`router/index.ts` 自行定義了所有路由，**但完全沒有 import 同目錄下的 `admin.routes.ts`、`tech.routes.ts`、`client.routes.ts`**。這代表：

1. 模組化路由檔案（`*.routes.ts`）**完全沒有被使用**，是死代碼
2. `router/index.ts` 中多個子路由指向錯誤的元件（例如 `/admin/orders` 和 `/admin/patients` 都指向 `AdminDashboard.vue` 而非 `OrderList.vue`）
3. `*.routes.ts` 中定義了 `OrderCreate`、`OrderDetail`、`ResultInput`、`ReviewDetail`、`ReportList`、`ReportDetail` 等頁面路由，但 `router/index.ts` 完全缺少這些

**影響**: 功能頁面無法透過路由正確存取，`router.push({ name: 'OrderCreate' })` 等呼叫將 throw `NavigationFailure`。

**修復方案**:
```typescript
// router/index.ts — 應改為：
import adminRoutes from './admin.routes'
import techRoutes from './tech.routes'
import clientRoutes from './client.routes'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'RoleSelector', component: () => import('@/components/layout/RoleSelector.vue') },
  adminRoutes,
  techRoutes,
  clientRoutes,
]
```

---

### 🔴 S2：Mock 資料層存在兩套不一致的資料

**位置**: `src/mock/data/*.ts` vs `src/mock/services/*.ts`

`mock/data/` 下的資料檔（如 `orders.ts` 有 16 筆 `ord-001` ~ `ord-016`）與 `mock/services/` 下的 service 檔案各自維護了一份獨立的 mock 資料（如 `order.service.ts` 有 10 筆 `O001` ~ `O010`，ID 命名規則也不同）。

- `mock/data/` 的資料被 `mock/index.ts` 匯出但**沒有被任何 Store 使用**
- 所有 Store 呼叫的都是 `mock/services/*.ts` 中的 service
- 兩份資料的 ID 系統不同（`ord-001` vs `O001`、`p-001` vs `P001`）
- 跨資料參照會失效（例如 `mock/data/orders.ts` 中 `patientId: 'p-001'` 對不上 `patient.service.ts` 的 `'P001'`）

**影響**: `mock/data/` 是完全無效的死代碼，但會給開發者造成混淆。

**修復方案**: 統一為一份資料來源。建議保留 `mock/data/` 作為 single source of truth，讓 `mock/services/` import 使用之，或直接移除 `mock/data/` 並僅保留 service 內的資料。

---

### 🔴 S3：路由守衛缺失 — 無角色驗證

**位置**: `src/router/index.ts`

路由 meta 中定義了 `role`，但 **router 沒有配置任何 `beforeEach` 守衛** 來驗證角色：

- 任何未選擇角色的使用者可直接存取 `/admin/*`、`/tech/*`、`/client/*`
- 行政人員可直接存取 `/tech/*` 等不屬於其角色的路由
- 缺少 `isAuthenticated` 守衛導向 RoleSelector

**修復方案**:
```typescript
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiredRole = to.meta.role as UserRole | undefined
  
  if (requiredRole && authStore.currentRole !== requiredRole) {
    next({ name: 'RoleSelector' })
  } else {
    next()
  }
})
```

---

### 🔴 S4：Stores 中大量使用 `catch (e: any)` — TypeScript 反模式

**位置**: 所有 Store 檔案（`order.ts`、`patient.ts`、`report.ts`、`result.ts`、`testItem.ts`）

共 **15 處** 使用 `catch (e: any)`，這違反了 TypeScript `strict` 模式下的型別安全原則。

**修復方案**:
```typescript
// 改為：
} catch (e: unknown) {
  error.value = e instanceof Error ? e.message : '未知錯誤'
}
```

---

## 建議改善（可選）

### 🟡 M1：Layout 元件存在大量重複代碼

**位置**: `AdminLayout.vue`、`TechLayout.vue`、`ClientLayout.vue`

三個 Layout 元件結構幾乎完全相同（sidebar + header + toast），只差在 `navItems`、section label、以及 header 預設 title。已有 `AppSidebar.vue` 和 `AppHeader.vue` 可重用，但**都沒有被任何 Layout 使用**。

**建議**: 將三個 Layout 合併為一個 `DashboardLayout.vue`，透過 props 傳入 `role`、`navItems`、`sectionLabel`，內部使用 `AppSidebar.vue`。

---

### 🟡 M2：`types/index.ts` 是所有 types 的全量複製品

**位置**: `src/types/index.ts`

`types/index.ts` 包含了 `order.ts`、`patient.ts`、`report.ts`、`test.ts`、`user.ts`、`worklist.ts` 的所有型別定義的完整副本，而非 re-export。這導致**型別定義存在兩份**。

**建議**: 改為 barrel re-export：
```typescript
export * from './order'
export * from './patient'
export * from './report'
export * from './test'
export * from './user'
export * from './worklist'
```

---

### 🟡 M3：`BaseTable.vue` 的 `data` prop 使用 `Record<string, unknown>[]`

**位置**: `src/components/base/BaseTable.vue`

`data` prop 的型別是 `Record<string, unknown>[]`，這降低了使用端的型別安全性。考慮改用泛型或更窄的型別定義。對於通用表格元件，這是可接受的折衷，但 emit 的 `row-click` 事件也傳遞 `Record<string, unknown>`，下游需要 type assertion。

---

### 🟡 M4：View 層 inline 了大量 Tailwind class 而非使用 Base 元件

**位置**: 所有 View 檔案

已經建立了 `BaseButton`、`BaseBadge`、`BaseCard`、`BaseStatCard`、`BaseTable`、`BaseInput`、`BaseAlert` 等元件，但**幾乎所有 View 都沒有使用它們**，而是直接 inline 相同的 Tailwind class。例如：

- `AdminDashboard.vue` 的「新增醫令」按鈕 inline 了完整的 button class，而非使用 `<BaseButton>`
- 統計卡片全部 inline，而非使用 `<BaseStatCard>`
- 表格全部 inline，而非使用 `<BaseTable>`

**影響**: 不影響功能，但造成大量重複代碼，且一旦設計規範變更需逐一修改。

---

### 🟡 M5：Modal 邏輯重複 — 應使用 `BaseModal`

**位置**: `OrderCreate.vue`、`ReviewDetail.vue`

兩個 View 各自 inline 了完整的 Teleport + Modal 結構，而非使用已有的 `BaseModal.vue` 元件。

---

### 🟡 M6：`notification.ts` 的 toastId 使用模組層級 `let` 變數

**位置**: `src/stores/notification.ts`

`let toastId = 0` 在模組頂層，這在 SSR 或 HMR 情境下可能產生意料之外的行為。建議將計數器移入 store 內部或使用 `Date.now()` / `crypto.randomUUID()`。

---

### 🟡 M7：`result.service.ts` 和 `order.service.ts` 使用模組層級 mutable counter

**位置**: `src/mock/services/result.service.ts`、`src/mock/services/order.service.ts`

`let resultCounter = 20` 和 `let orderCounter = 10` 在模組頂層。雖為 mock 層，但在 HMR 重載時不會重置，可能導致 ID 衝突。

---

### 🟡 M8：`ResultInput.vue` 中 `checkValue` 的 Critical 判定僅保留最後一個

**位置**: `src/views/tech/ResultInput.vue` 第 78-84 行

當多個項目觸發 Critical 值時，`criticalAlertMessage` 會被最後一個覆蓋，只顯示一條警告。應改為陣列收集所有 Critical 項目。

---

### 🟡 M9：`ReportDetail.vue` 趨勢資料為假數據

**位置**: `src/views/client/ReportDetail.vue`

`trendData` computed 以當前值乘以固定比例生成假數據。作為 MVP 可接受，但建議加上明顯註解標記為 placeholder。

---

### 🟡 M10：缺少 Error Boundary 處理

所有 View 中 `onMounted` 的 async 操作僅在 Store 內部 catch，View 層沒有統一的 error fallback UI。建議建立 `ErrorBoundary` 元件。

---

## 各模組評審

### Types（型別定義）

**評分**: ⭐⭐⭐⭐ (4/5)

**優點**:
- 所有 interface 都有完整的 JSDoc 中文註解（在獨立檔案中）
- 善用 union type literal（`OrderStatus`、`ReportStatus`、`AbnormalFlag`）
- 無 `any` 型別
- 日期統一使用 ISO 8601 string，一致性好

**問題**:
- `types/index.ts` 是全量複製而非 re-export（M2）
- `AbnormalFlag` 允許 `null` 作為 union member（`'H' | 'L' | 'A' | null`），建議改為 `AbnormalFlag | null` 分開定義或 `type AbnormalFlag = 'H' | 'L' | 'A'` 搭配 optional

---

### Mock Data（模擬資料層）

**評分**: ⭐⭐⭐ (3/5)

**優點**:
- Service 層設計模擬了真實 API 行為（delay、Promise、error throwing）
- `delay()` helper 統一管理延遲
- `generateId()` 提供 UUID v4 格式

**問題**:
- **兩套不一致的 mock 資料**（S2，嚴重）
- `mock/data/` 與 `mock/services/` 的 ID 命名不一致（`ord-001` vs `O001`）
- `mock/index.ts` 匯出的 data 無人使用
- `reportService.reject()` 沒有更新 `status`，只設了 `rejectionReason`
- `resultService.saveAll()` 沒有帶入 `comment` 欄位

---

### Components（元件庫）

**評分**: ⭐⭐⭐⭐ (4/5)

**優點**:
- Base 元件設計完整（Button、Badge、Card、Table、Modal、Input、Select、Alert、StatCard、Empty）
- Props 使用 TypeScript interface + `withDefaults`，符合 Vue 3 最佳實踐
- Emits 使用 type-safe `defineEmits` 語法
- Tailwind class 組合完美遵循 Muji Style：
  - 圓角使用 `rounded-sm`（2px）
  - 色系統一使用自定義 muji tokens
  - 字重控制在 light(300) / normal(400) / medium(500)
  - 動畫克制（150-200ms ease-out）

**問題**:
- `BaseAlert.vue` dismiss button 的 hover class 使用 template literal，Tailwind 無法靜態掃描（`` `hover:${variantStyles[props.variant].text}` ``）— **這會導致 hover 樣式失效**
- `AppSidebar.vue` 和 `AppHeader.vue` 已建立但**未被任何 Layout 使用**（M1）
- `BaseButton.vue` 的 `@click` 使用 `$emit('click', $event)` 在 `<script setup>` 中應改用 `emit('click', $event)` 或直接在 template 中使用（目前能運作但不一致）

---

### Stores（Pinia 狀態管理）

**評分**: ⭐⭐⭐⭐ (4/5)

**優點**:
- 全部使用 Composition API（`setup` store）風格，一致性佳
- 每個 store 都有 `loading`、`error` 狀態管理
- `filteredXxx` computed 設計合理
- `auth.ts` 的 auto-restore 邏輯（初始化時自動 `selectRole`）設計良好
- `result.ts` 的 `checkAbnormal()` 純函式設計好

**問題**:
- **15 處 `catch (e: any)`**（S4，嚴重）
- 缺少 `worklistStore` — `WorklistItem` type 已定義但沒有對應的 Store
- `auth.ts` 直接操作 `localStorage`，建議抽為 composable 或 utility
- 多個 Store 的 `fetchXxx` 方法若連續快速呼叫會產生競態條件（後一次呼叫可能覆蓋前一次的結果），建議加 abort 機制或 debounce

---

### Views（視圖頁面）

**評分**: ⭐⭐⭐ (3.5/5)

**優點**:
- 頁面結構清晰，每個 View 職責單一
- `OrderCreate.vue` 的多步驟表單 UX 設計良好（Step 1-4 + confirmation modal）
- `ResultInput.vue` 的即時異常值檢測與 Critical Alert 設計出色
- `ReviewDetail.vue` 的報告審核流程完整
- `ReportDetail.vue` 的趨勢圖功能（雖為假數據）展示了良好的 UX 前瞻性
- 所有頁面都有 loading、empty、error 三態處理

**問題**:
- **大量 inline Tailwind class，未使用已有的 Base 元件**（M4、M5）
- 重複的 helper function（`getPatientName`、`formatDate`、`getStatusLabel`、`getStatusClass`）散佈在多個 View 中，應抽為共用 composable：
  - `AdminDashboard.vue` 和 `OrderList.vue` 各有一份 `getPatientName`
  - `OrderList.vue`、`Worklist.vue` 各有 `getStatusLabel` 和 `getStatusClass`
  - `ReviewDetail.vue` 和 `ReportDetail.vue` 各有 `getFlagLabel`、`getFlagClass`、`getReferenceRange`
- `OrderCreate.vue` 的 step 2 直接修改 `testItemStore.searchQuery` 和 `testItemStore.categoryFilter`，這是 store 全域狀態的副作用，離開頁面後搜尋條件不會重置
- `ResultInput.vue` 透過 index 對應 `resultEntries` 和 `testItems`（`testItems[index]`），如果陣列長度不匹配會出錯

---

### Router（路由架構）

**評分**: ⭐⭐ (2/5)

**優點**:
- 模組化路由檔案（`*.routes.ts`）設計理念正確
- 所有頁面使用 lazy loading（`() => import(...)`)
- 正確使用 `props: true` 傳遞 route params
- `meta.role` 和 `meta.title` 的 meta 設計合理

**問題**:
- **`router/index.ts` 未使用模組化路由檔案**（S1，嚴重）
- **缺少 route guard**（S3，嚴重）
- 缺少 404 catch-all 路由
- 子路由 `name` 在 `router/index.ts` 和 `*.routes.ts` 之間不一致（如 `'AdminOrders'` vs `'OrderList'`）
- `admin.routes.ts` 缺少 `patients` 路由（雖然目前沒有病患管理頁面）

---

## Tailwind CSS & Muji Style 合規性

**評分**: ⭐⭐⭐⭐⭐ (5/5)

Muji Style 設計語言的實現非常出色：

| 設計規範 | 實際實現 | 合規 |
|---------|---------|------|
| 極簡圓角 (2-4px) | `rounded-sm` = 2px | ✅ |
| 大地色系 | `muji-charcoal`, `muji-cream`, `muji-linen` | ✅ |
| 輕量字重 | `font-light` (300) 標題 + `font-normal` (400) 內文 | ✅ |
| 克制的陰影 | `shadow-xs`, `shadow-sm` | ✅ |
| 充足留白 | `p-6`, `p-8`, `space-y-8` | ✅ |
| 微妙動畫 | `duration-150`, `duration-200`, `ease-in-out` | ✅ |
| 寧靜配色 | 成功綠 `#5A8A6A`、警告金 `#B8860B`、危急紅 `#C53D43` | ✅ |
| UPPERCASE tracking labels | `text-2xs tracking-widest uppercase` | ✅ |
| 邊框色統一 | `border-muji-border` (#D8D2CA) | ✅ |

`tailwind.config.js` 的自定義 token 設計精準，`main.css` 的全域設定（scrollbar、selection、focus ring）細緻到位。

---

## 程式碼一致性

| 項目 | 評審 |
|------|------|
| 命名慣例 | ✅ 檔案名 kebab-case (`order.service.ts`)，元件 PascalCase (`BaseButton.vue`)，變數 camelCase |
| 檔案組織 | ✅ 模組化清晰：`types/`、`mock/`、`stores/`、`components/base/`、`components/layout/`、`views/` |
| Import 順序 | ⚠️ 大致一致（vue → vue-router → stores → types），但無 auto-sort 配置 |
| Script setup | ✅ 100% 使用 `<script setup lang="ts">` |
| Template 風格 | ✅ 統一使用 `:class` binding 搭配陣列條件式 |

---

## 潛在 Bug

| Bug | 位置 | 嚴重度 |
|-----|------|--------|
| `BaseAlert.vue` 動態 hover class 被 Tailwind purge | `components/base/BaseAlert.vue` | 🟡 中 |
| `ResultInput.vue` array index 對應不安全 | `views/tech/ResultInput.vue` | 🟡 中 |
| `OrderCreate.vue` step 2 汙染全域 store 狀態 | `views/admin/OrderCreate.vue` | 🟡 低 |
| `reportService.reject()` 未更新 status | `mock/services/report.service.ts` | 🟡 低 |
| `ResultInput.vue` Critical Alert 被覆蓋 | `views/tech/ResultInput.vue` | 🟡 中 |
| 無 404 路由 — 未定義路徑顯示空白 | `router/index.ts` | 🟡 低 |

---

## 結論

❌ **NEEDS CHANGES**

### 必須修復（阻擋合併）
1. **S1**: 修正 `router/index.ts`，import 並使用模組化路由檔案
2. **S2**: 統一 mock 資料層，移除冗餘的 `mock/data/` 或 `mock/services/` 內嵌資料
3. **S3**: 新增 router `beforeEach` 守衛，驗證角色權限
4. **S4**: 將所有 `catch (e: any)` 改為 `catch (e: unknown)` 並做型別檢查

### 強烈建議（下一個 Sprint）
5. **M1**: 將三個 Layout 統一為一個，使用 `AppSidebar` + `AppHeader`
6. **M2**: `types/index.ts` 改為 barrel re-export
7. **M4/M5**: View 層改用 Base 元件，減少 inline 重複
8. 抽出共用 composable（`useFormatters`、`useStatusHelpers`）

修復 S1-S4 後，程式碼即可達到合併標準。整體架構設計優良，Muji Style 實現令人印象深刻。
