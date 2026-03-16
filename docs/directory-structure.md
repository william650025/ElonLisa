# LISA 專案目錄結構

> 此文件定義 LISA 前端專案的完整目錄結構

---

## 完整目錄樹

```
LISA/
├── docs/                               # 📄 專案文件
│   ├── architecture.md                 #   架構設計文件
│   └── directory-structure.md          #   目錄結構（本文件）
│
├── public/                             # 📂 靜態資源（不經 Vite 處理）
│   └── favicon.ico
│
├── src/
│   ├── App.vue                         # 根元件
│   ├── main.ts                         # 進入點
│   ├── style.css                       # 全域樣式（Tailwind directives）
│   │
│   ├── types/                          # 📐 TypeScript 型別定義
│   │   ├── patient.types.ts            #   病患
│   │   ├── order.types.ts              #   醫令
│   │   ├── test-item.types.ts          #   檢驗項目
│   │   ├── result.types.ts             #   檢驗結果
│   │   ├── report.types.ts             #   報告
│   │   └── common.types.ts             #   共用型別（Pagination、Filter 等）
│   │
│   ├── router/                         # 🧭 路由設定
│   │   ├── index.ts                    #   主路由 + 全域守衛
│   │   ├── admin.routes.ts             #   行政人員路由
│   │   ├── tech.routes.ts              #   醫檢師路由
│   │   └── client.routes.ts            #   客戶路由
│   │
│   ├── stores/                         # 🗄️ Pinia 狀態管理
│   │   ├── auth.ts                     #   角色身份
│   │   ├── patient.ts                  #   病患資料
│   │   ├── order.ts                    #   醫令
│   │   ├── testItem.ts                 #   檢驗項目主檔
│   │   ├── result.ts                   #   檢驗結果
│   │   ├── report.ts                   #   報告
│   │   ├── notification.ts             #   全域通知
│   │   └── ui.ts                       #   UI 狀態
│   │
│   ├── mock/                           # 🎭 Mock 資料層
│   │   ├── index.ts                    #   統一匯出
│   │   ├── data/                       #   靜態假資料
│   │   │   ├── patients.ts             #     病患（10+ 筆）
│   │   │   ├── test-items.ts           #     檢驗項目主檔
│   │   │   ├── orders.ts              #     醫令（20+ 筆，各種狀態）
│   │   │   ├── results.ts             #     檢驗結果
│   │   │   └── reports.ts             #     報告
│   │   ├── services/                   #   模擬 API 服務
│   │   │   ├── patient.service.ts
│   │   │   ├── order.service.ts
│   │   │   ├── test-item.service.ts
│   │   │   ├── result.service.ts
│   │   │   └── report.service.ts
│   │   └── helpers/                    #   輔助工具
│   │       ├── delay.ts                #     模擬延遲
│   │       ├── id-generator.ts         #     產生唯一 ID
│   │       └── faker.ts                #     隨機資料產生
│   │
│   ├── composables/                    # 🔧 可組合函式
│   │   ├── useSearch.ts                #   搜尋 + debounce
│   │   ├── usePagination.ts            #   分頁邏輯
│   │   ├── useSort.ts                  #   排序邏輯
│   │   ├── useForm.ts                  #   表單狀態 + 驗證
│   │   ├── useConfirm.ts              #   確認對話框
│   │   ├── useToast.ts                #   Toast 通知
│   │   ├── useLoading.ts              #   載入狀態
│   │   ├── useOrderWorkflow.ts        #   醫令流程狀態機
│   │   └── useAbnormalCheck.ts        #   異常值判定
│   │
│   ├── components/                     # 🧩 共用元件
│   │   ├── base/                       #   ── 基礎 UI 元件 ──
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseCheckbox.vue
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseIcon.vue
│   │   │   └── BaseSpinner.vue
│   │   │
│   │   ├── composite/                  #   ── 組合型元件 ──
│   │   │   ├── AppTable.vue
│   │   │   ├── AppModal.vue
│   │   │   ├── AppCard.vue
│   │   │   ├── AppAlert.vue
│   │   │   ├── AppPagination.vue
│   │   │   ├── AppSearchBar.vue
│   │   │   ├── AppEmptyState.vue
│   │   │   ├── AppConfirmDialog.vue
│   │   │   ├── AppToast.vue
│   │   │   └── AppDropdown.vue
│   │   │
│   │   ├── layout/                     #   ── 佈局元件 ──
│   │   │   ├── LayoutShell.vue         #     主框架
│   │   │   ├── LayoutSidebar.vue       #     側邊欄
│   │   │   ├── LayoutNavbar.vue        #     頂部導覽
│   │   │   ├── LayoutBreadcrumb.vue    #     麵包屑
│   │   │   └── LayoutPageHeader.vue    #     頁面標題區
│   │   │
│   │   └── domain/                     #   ── 業務領域元件 ──
│   │       ├── PatientSelector.vue     #     病患搜尋選擇器
│   │       ├── PatientInfoCard.vue     #     病患資訊卡
│   │       ├── OrderStatusBadge.vue    #     醫令狀態標籤
│   │       ├── TestItemPicker.vue      #     檢驗項目選擇器
│   │       ├── ResultValueInput.vue    #     檢驗值輸入
│   │       ├── AbnormalFlag.vue        #     異常值標記
│   │       ├── TrendChart.vue          #     歷史趨勢圖
│   │       └── ReportViewer.vue        #     報告檢視器
│   │
│   └── views/                          # 📱 頁面元件
│       ├── RoleSelector.vue            #   角色選擇首頁
│       │
│       ├── admin/                      #   ── 行政人員頁面 ──
│       │   ├── AdminLayout.vue         #     Layout 框架
│       │   ├── AdminDashboard.vue      #     儀表板
│       │   ├── OrderList.vue           #     醫令清單
│       │   ├── OrderCreate.vue         #     開立醫令
│       │   ├── OrderDetail.vue         #     醫令詳情
│       │   ├── PatientList.vue         #     病患列表
│       │   └── PatientDetail.vue       #     病患詳情
│       │
│       ├── tech/                       #   ── 醫檢師頁面 ──
│       │   ├── TechLayout.vue          #     Layout 框架
│       │   ├── TechDashboard.vue       #     儀表板
│       │   ├── Worklist.vue            #     工作清單
│       │   ├── ResultEntry.vue         #     輸入檢驗值
│       │   ├── ReviewList.vue          #     待核發清單
│       │   └── ReviewDetail.vue        #     報告核發
│       │
│       └── client/                     #   ── 客戶頁面 ──
│           ├── ClientLayout.vue        #     Layout 框架
│           ├── ClientDashboard.vue     #     儀表板
│           ├── ReportList.vue          #     報告列表
│           ├── ReportDetail.vue        #     報告詳情
│           └── ReportTrend.vue         #     歷史趨勢
│
├── .env.development                    # 開發環境變數
├── .eslintrc.cjs                       # ESLint 設定
├── .prettierrc                         # Prettier 設定
├── index.html                          # HTML 進入點
├── package.json                        # 套件依賴
├── postcss.config.js                   # PostCSS 設定（Tailwind）
├── tailwind.config.js                  # Tailwind 設定
├── tsconfig.json                       # TypeScript 設定
├── tsconfig.app.json                   # App TS 設定
├── tsconfig.node.json                  # Node TS 設定
└── vite.config.ts                      # Vite 建構設定
```

---

## 目錄職責說明

| 目錄 | 職責 | 命名慣例 |
|------|------|---------|
| `src/types/` | TypeScript 介面與型別 | `kebab-case.types.ts` |
| `src/router/` | Vue Router 路由定義 | `kebab-case.routes.ts` |
| `src/stores/` | Pinia Store | `camelCase.ts` |
| `src/mock/data/` | 靜態 mock 資料 | `kebab-case.ts` |
| `src/mock/services/` | 模擬 API 服務 | `kebab-case.service.ts` |
| `src/mock/helpers/` | Mock 層工具 | `kebab-case.ts` |
| `src/composables/` | 可組合函式 | `useCamelCase.ts` |
| `src/components/base/` | 基礎 UI 原子元件 | `BasePascalCase.vue` |
| `src/components/composite/` | 組合型元件 | `AppPascalCase.vue` |
| `src/components/layout/` | 佈局元件 | `LayoutPascalCase.vue` |
| `src/components/domain/` | 業務領域元件 | `PascalCase.vue` |
| `src/views/` | 頁面元件 | `PascalCase.vue` |
| `src/views/{role}/` | 角色專屬頁面 | `PascalCase.vue` |

---

## 未來擴展預留

若後續需要擴展，可新增以下目錄：

```
src/
  ├── plugins/              # Vue 插件（如 i18n）
  ├── directives/           # 自訂指令
  ├── utils/                # 通用工具函式
  ├── constants/            # 常數定義
  └── assets/               # 靜態資源（圖片、字型）
      ├── images/
      └── fonts/
```
