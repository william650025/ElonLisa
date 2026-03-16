# LISA — 需求分析文件

> Laboratory Information System — 純前端 MVP Demo
> 技術棧：Vue 3 + Tailwind CSS | Mock Data

---

## 1. 核心業務流程

LISA 的核心流程為「醫令 → 採樣 → 檢驗 → 報告」四階段：

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  開立醫令 │───▶│  採樣登記 │───▶│  檢驗作業 │───▶│  報告產出 │
│ (行政人員) │    │ (行政人員) │    │  (醫檢師)  │    │  (醫檢師)  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                                   │
                                                   ▼
                                             ┌─────────┐
                                             │  報告查閱 │
                                             │  (客戶)   │
                                             └─────────┘
```

### 1.1 開立醫令（Order Creation）
- 行政人員選擇或建立病患資料
- 選擇檢驗項目（可複選）
- 填寫臨床資訊、醫師資訊
- 系統產生唯一醫令編號，狀態設為 `pending`

### 1.2 採樣登記（Specimen Collection）
- 行政人員確認採樣完成
- 記錄採樣時間、檢體類型、採樣人員
- 醫令狀態更新為 `collected`

### 1.3 檢驗作業（Testing）
- 醫檢師在工作清單（Worklist）中接收待檢項目
- 逐項輸入檢驗數值
- 系統自動標記異常值（超出參考範圍）
- 醫令狀態更新為 `testing` → `completed`

### 1.4 報告產出（Reporting）
- 醫檢師審核檢驗結果
- 報告經簽核流程後核發
- 報告狀態：`draft` → `reviewed` → `final`
- 客戶可查閱已核發的報告

---

## 2. 角色 Use Cases

### 2.1 行政人員（Administrative Staff）

| UC 編號 | Use Case | 說明 |
|---------|----------|------|
| UC-A01 | 開立檢驗醫令 | 選擇病患、選擇檢驗項目、填寫臨床資訊，產生醫令 |
| UC-A02 | 管理病患資料 | 新增 / 搜尋 / 編輯病患基本資料 |
| UC-A03 | 醫令清單管理 | 查看所有醫令、依狀態篩選、取消未採樣的醫令 |
| UC-A04 | 登記採樣完成 | 記錄採樣資訊，推進醫令至下一階段 |
| UC-A05 | 搜尋檢驗項目 | 依名稱或分類搜尋可用的檢驗項目 |

**UC-A01 細節流程：**
1. 輸入或搜尋病患 → 選擇病患
2. 從檢驗項目目錄中勾選所需項目
3. 填寫醫師姓名、臨床備註
4. 確認送出 → 系統產生醫令

### 2.2 醫檢師（Medical Technologist）

| UC 編號 | Use Case | 說明 |
|---------|----------|------|
| UC-T01 | 查看工作清單 | 查看待處理的檢驗項目，依優先順序排列 |
| UC-T02 | 輸入檢驗結果 | 逐項輸入數值，系統自動判斷是否異常 |
| UC-T03 | 標記異常值 | 手動加註異常說明或備註 |
| UC-T04 | 審核報告 | 檢視報告內容，確認數值正確性 |
| UC-T05 | 簽核報告 | 最終簽核，報告狀態變為 final |
| UC-T06 | 退回報告 | 發現問題時退回修改 |

**UC-T02 細節流程：**
1. 從 Worklist 選擇待檢項目
2. 輸入檢驗數值（數字或文字型結果）
3. 系統比對參考範圍，自動標記 H（偏高）/ L（偏低）/ A（異常）
4. 醫檢師可加註備註
5. 儲存結果

### 2.3 客戶（Client）

| UC 編號 | Use Case | 說明 |
|---------|----------|------|
| UC-C01 | 查看報告列表 | 依日期、狀態瀏覽已核發的檢驗報告 |
| UC-C02 | 搜尋報告 | 依病患姓名、報告編號、日期區間搜尋 |
| UC-C03 | 查看報告詳情 | 檢視完整檢驗結果，含參考範圍與異常標記 |
| UC-C04 | 查看歷史趨勢 | 同一檢驗項目的歷次數值趨勢圖表 |
| UC-C05 | 下載/列印報告 | 將報告匯出為可列印格式（MVP 可簡化） |

---

## 3. 頁面規劃

### 3.1 共用頁面
- **登入頁** — 選擇角色登入（MVP 用 mock 帳號即可）
- **Dashboard** — 依角色顯示不同的摘要資訊

### 3.2 行政人員頁面
| 頁面 | 路由 | 功能 |
|------|------|------|
| 開立醫令 | `/admin/orders/new` | 病患選擇 + 檢驗項目選擇 + 送出 |
| 醫令清單 | `/admin/orders` | 列表 + 篩選 + 狀態管理 |
| 病患管理 | `/admin/patients` | 病患 CRUD |
| 採樣登記 | `/admin/orders/:id/collect` | 記錄採樣資訊 |

### 3.3 醫檢師頁面
| 頁面 | 路由 | 功能 |
|------|------|------|
| 工作清單 | `/lab/worklist` | 待檢項目列表 |
| 輸入結果 | `/lab/worklist/:id/result` | 輸入檢驗數值 |
| 報告審核 | `/lab/reports` | 報告列表 + 審核/簽核 |
| 報告詳情 | `/lab/reports/:id` | 報告內容 + 簽核操作 |

### 3.4 客戶頁面
| 頁面 | 路由 | 功能 |
|------|------|------|
| 報告列表 | `/client/reports` | 已核發報告瀏覽 + 搜尋 |
| 報告詳情 | `/client/reports/:id` | 完整結果 + 異常標記 |
| 歷史趨勢 | `/client/reports/:id/trend` | 趨勢圖表 |

---

## 4. 技術方案

### 4.1 技術棧

| 類別 | 選擇 | 說明 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | `<script setup>` 語法 |
| 狀態管理 | Pinia | 官方推薦，取代 Vuex |
| 路由 | Vue Router 4 | 搭配 Navigation Guards 做角色權限 |
| 樣式 | Tailwind CSS 3 | Utility-first，快速建構 UI |
| 建構工具 | Vite | 開發體驗佳，HMR 快速 |
| 語言 | TypeScript | 型別安全，搭配介面定義 |
| 圖表 | Chart.js + vue-chartjs | 歷史趨勢圖表 |
| 表格 | 自行封裝或 TanStack Table | 醫令清單、工作清單 |
| 圖示 | Heroicons / Lucide | 搭配 Tailwind 使用 |

### 4.2 專案結構建議

```
src/
├── assets/              # 靜態資源
├── components/          # 共用元件
│   ├── ui/              # 基礎 UI 元件（Button, Input, Modal...）
│   ├── layout/          # Layout 元件（Sidebar, Header...）
│   └── common/          # 業務共用元件（PatientSelector, StatusBadge...）
├── composables/         # 可複用邏輯（useAuth, useOrders...）
├── mock/                # Mock 資料
│   ├── patients.ts
│   ├── orders.ts
│   ├── test-items.ts
│   ├── results.ts
│   ├── reports.ts
│   └── users.ts
├── router/              # 路由設定
│   └── index.ts
├── stores/              # Pinia Stores
│   ├── auth.ts
│   ├── orders.ts
│   ├── worklist.ts
│   └── reports.ts
├── types/               # TypeScript 型別定義
│   └── index.ts
├── views/               # 頁面元件
│   ├── admin/           # 行政人員頁面
│   ├── lab/             # 醫檢師頁面
│   ├── client/          # 客戶頁面
│   └── auth/            # 登入頁面
├── App.vue
└── main.ts
```

### 4.3 Mock Data 策略

- 所有 mock data 集中放在 `src/mock/` 目錄
- 使用 TypeScript 定義介面，確保型別一致
- Pinia Store 模擬 CRUD 操作（讀寫 reactive state）
- 可選：加入 `setTimeout` 模擬 API 延遲，增加真實感
- 資料量建議：10–20 筆病患、20–30 筆醫令、50+ 筆檢驗結果

### 4.4 角色權限控制

```typescript
// 簡易角色路由守衛
const roleRouteMap: Record<UserRole, string[]> = {
  admin: ['/admin'],
  technologist: ['/lab'],
  client: ['/client'],
}

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const allowed = roleRouteMap[authStore.role]
  if (allowed.some(prefix => to.path.startsWith(prefix))) {
    next()
  } else {
    next('/unauthorized')
  }
})
```

---

## 5. 技術風險與注意事項

### 5.1 風險評估

| 風險 | 等級 | 緩解措施 |
|------|------|----------|
| Mock data 與真實 API 結構不一致 | 中 | 先定義嚴謹的 TypeScript 介面，未來對接時以介面為準 |
| 狀態管理複雜度隨流程增加 | 低 | 善用 Pinia，按功能模組拆分 Store |
| 報告簽核流程邏輯複雜 | 中 | MVP 簡化為兩步（reviewed → final），不做多層簽核 |
| 歷史趨勢圖表效能 | 低 | Mock 資料量小，不影響效能；未來大量資料需做分頁 |
| Tailwind 類名過長影響可讀性 | 低 | 善用 `@apply` 抽取常用組合，封裝 UI 元件 |

### 5.2 注意事項

1. **介面先行**：所有 mock data 必須符合 `data-models.md` 定義的 TypeScript 介面
2. **ID 策略**：Mock 使用 UUID 或遞增數字 ID，預留未來切換為後端生成的 ID
3. **日期處理**：統一使用 ISO 8601 格式（`YYYY-MM-DDTHH:mm:ssZ`），前端顯示時再格式化
4. **異常值邏輯**：檢驗結果需與 TestItem 的參考範圍比對，自動計算 flag
5. **響應式設計**：優先支援桌面版，但 Tailwind 的 RWD 斷點預留行動裝置適配空間
6. **可存取性（A11y）**：表單元件需有 label、按鈕需有明確文字，為未來合規預做準備
7. **國際化預留**：文字集中管理（可先用常數檔），未來可接 vue-i18n

---

## 6. MVP 範圍界定

### 包含（In Scope）
- ✅ 三個角色的登入切換
- ✅ 完整的醫令→採樣→檢驗→報告流程
- ✅ 工作清單（Worklist）
- ✅ 異常值自動標記
- ✅ 報告審核/簽核（兩步流程）
- ✅ 報告列表搜尋與詳情
- ✅ 歷史趨勢圖表
- ✅ Mock data 驅動

### 不包含（Out of Scope）
- ❌ 真實後端 API
- ❌ 使用者註冊 / 密碼驗證
- ❌ 多層簽核流程
- ❌ 檢體條碼掃描
- ❌ 儀器介接（LIS-Instrument Interface）
- ❌ PDF 報告匯出
- ❌ 通知系統（Email / SMS）
- ❌ 稽核日誌（Audit Trail）
