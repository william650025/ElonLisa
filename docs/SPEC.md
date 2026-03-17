# 🧪 LISA — 開發規格書

> Laboratory Information System — Development Specification  
> 版本：1.0 | 日期：2026-03-17

---

## 1. 專案概述

### 1.1 產品定位
LISA 是一套面向醫療實驗室的資訊管理系統前端 MVP Demo，以 Muji Style 日式極簡設計呈現完整的檢驗工作流程。

### 1.2 核心目標
- 展示 LIS 系統的三大角色（行政人員 / 醫檢師 / 客戶）完整工作流
- 使用 Mock Data 模擬真實 API 回應，可獨立運行展示
- 採用現代前端技術棧，為後續 API 整合做準備

### 1.3 不在範圍
- 後端 API 整合
- 使用者認證授權（僅 UI 層角色切換）
- 多語系、列印功能
- HIPAA / 個資法合規實作

---

## 2. 角色與功能

### 2.1 行政人員 (Administrative Staff)

| 功能 | 路由 | 說明 |
|------|------|------|
| 儀表板 | `/admin/dashboard` | 醫令統計總覽（今日、本週、各狀態數量） |
| 醫令清單 | `/admin/orders` | 搜尋、篩選、排序醫令列表 |
| 開立醫令 | `/admin/orders/create` | 選擇病患 → 選擇檢驗項目 → 填寫臨床資訊 → 送出 |
| 醫令詳情 | `/admin/orders/:id` | 查看醫令完整資訊、狀態歷程 |
| 病患列表 | `/admin/patients` | 病患搜尋與管理 |
| 病患詳情 | `/admin/patients/:id` | 病患基本資料與歷史醫令 |
| 報告管理 | `/admin/reports` | 管理端報告列表 |
| 系統設定 | `/admin/settings` | 系統偏好設定 |

### 2.2 醫檢師 (Medical Technologist)

| 功能 | 路由 | 說明 |
|------|------|------|
| 儀表板 | `/tech/dashboard` | 待處理工作統計（待檢驗、待審核數量） |
| 工作清單 | `/tech/worklist` | 待檢驗醫令清單，可接單 |
| 結果輸入 | `/tech/worklist/:orderId` | 逐項輸入檢驗數值，系統自動標記異常值 |
| 待審核清單 | `/tech/review` | 待核發報告列表 |
| 報告審核 | `/tech/review/:reportId` | 審核結果 → 簽核 → 核發報告 |
| 報告詳情 | `/tech/reports/:id` | 檢視已核發報告 |
| 品質管控 | `/tech/qc` | QC Dashboard |

### 2.3 客戶 (Client)

| 功能 | 路由 | 說明 |
|------|------|------|
| 儀表板 | `/client/dashboard` | 最新報告摘要 |
| 報告列表 | `/client/reports` | 搜尋與瀏覽已核發報告 |
| 報告詳情 | `/client/reports/:id` | 報告完整內容 + 歷史趨勢圖表 |

---

## 3. 核心業務流程

### 3.1 醫令生命週期

```
pending → collected → testing → completed
   │                              │
   └── cancelled                  └── reported (報告已核發)
```

| 狀態 | 說明 | 觸發角色 |
|------|------|---------|
| `pending` | 醫令已建立，等待採樣 | 行政人員 |
| `collected` | 檢體已採集 | 行政人員 |
| `testing` | 檢驗進行中 | 醫檢師 |
| `completed` | 檢驗完成，結果已輸入 | 醫檢師 |
| `reported` | 報告已核發 | 醫檢師 |
| `cancelled` | 醫令已取消 | 行政人員 |

### 3.2 報告核發流程

```
draft → reviewed → final
```

| 狀態 | 說明 |
|------|------|
| `draft` | 檢驗結果已輸入，待審核 |
| `reviewed` | 已審核，待簽核 |
| `final` | 已核發，客戶可查閱 |

### 3.3 異常值判定

系統根據檢驗項目的參考範圍自動標記：
- 🔴 **Critical High/Low** — 超出危急值
- 🟡 **High/Low** — 超出參考範圍
- 🟢 **Normal** — 在參考範圍內

---

## 4. 資料模型

### 4.1 病患 (Patient)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | string | 唯一識別碼 |
| medicalRecordNumber | string | 病歷號 |
| name | string | 姓名 |
| gender | 'male' \| 'female' | 性別 |
| birthDate | string | 出生日期 |
| idNumber | string | 身分證字號 |
| phone | string | 電話 |
| address | string | 地址 |
| bloodType | string | 血型 |

### 4.2 醫令 (Order)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | string | 唯一識別碼 |
| orderNumber | string | 醫令編號（ORD-YYYYMMDD-XXX） |
| patientId | string | 關聯病患 |
| status | OrderStatus | 醫令狀態 |
| priority | 'routine' \| 'urgent' \| 'stat' | 優先順序 |
| testItems | TestItem[] | 檢驗項目 |
| clinicalInfo | string | 臨床資訊 |
| orderingPhysician | string | 開單醫師 |
| createdAt | string | 建立時間 |

### 4.3 檢驗結果 (Result)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | string | 唯一識別碼 |
| orderId | string | 關聯醫令 |
| testItemId | string | 關聯檢驗項目 |
| value | number \| string | 檢驗數值 |
| unit | string | 單位 |
| referenceRange | string | 參考範圍 |
| flag | 'normal' \| 'high' \| 'low' \| 'critical_high' \| 'critical_low' | 異常標記 |
| performedBy | string | 執行醫檢師 |
| performedAt | string | 執行時間 |

### 4.4 報告 (Report)

| 欄位 | 型別 | 說明 |
|------|------|------|
| id | string | 唯一識別碼 |
| orderId | string | 關聯醫令 |
| patientId | string | 關聯病患 |
| status | 'draft' \| 'reviewed' \| 'final' | 報告狀態 |
| results | Result[] | 檢驗結果 |
| reviewedBy | string | 審核人 |
| approvedBy | string | 簽核人 |
| finalizedAt | string | 核發時間 |

---

## 5. 技術架構

### 5.1 技術棧

| 層級 | 技術 | 說明 |
|------|------|------|
| Framework | Vue 3 (Composition API) | SFC + `<script setup>` |
| Language | TypeScript 5.9 | 嚴格模式 |
| Build | Vite 8.0 | 快速 HMR |
| Style | Tailwind CSS 3.4 | Utility-first |
| State | Pinia 3.0 | 7 個 Store |
| Router | Vue Router 4.6 | 角色守衛 |
| Chart | Chart.js + vue-chartjs | 趨勢圖表 |
| Icons | Font Awesome 7.2 | 圖示系統 |
| Date | Day.js | 日期處理 |

### 5.2 狀態管理（Pinia Stores）

| Store | 職責 |
|-------|------|
| auth | 角色身份管理 |
| patient | 病患資料 CRUD |
| order | 醫令管理 |
| testItem | 檢驗項目主檔 |
| result | 檢驗結果 |
| report | 報告管理 |
| notification | 全域通知 |

### 5.3 路由守衛

```
beforeEach → 檢查 localStorage 中的角色
  → 有角色且路由匹配 → 允許進入
  → 有角色但路由不匹配 → 導向該角色首頁
  → 無角色且非公開路由 → 導向角色選擇頁
```

---

## 6. 設計規範

### 6.1 色彩系統（Muji Style）

| 色彩 | 色碼 | 用途 |
|------|------|------|
| Cloud Dancer | #F5F0EB | 背景 |
| Warm Stone | #E8E0D8 | 卡片背景 |
| Soft Charcoal | #4A4A4A | 主文字 |
| MUJI Red | #C23B22 | 僅限 Critical 警示 |
| Warm Sage | #8B9D83 | 成功 / 正常 |
| Golden Wheat | #C4A35A | 警告 |
| Sky Blue | #6B9AC4 | 連結 / 強調 |

### 6.2 排版

| 元素 | 字體 | 大小 |
|------|------|------|
| 標題 H1 | Noto Sans TC Bold | 24px |
| 標題 H2 | Noto Sans TC Medium | 20px |
| 內文 | Noto Sans TC Regular | 14px |
| 標籤 | Noto Sans TC Medium | 12px |
| 數據 | Inter Medium | 14-16px |

### 6.3 元件規範

| 元素 | 圓角 | 陰影 |
|------|------|------|
| 卡片 | 8px | 0 1px 3px rgba(0,0,0,0.08) |
| 按鈕 | 6px | none |
| 輸入框 | 4px | none (border only) |
| Modal | 12px | 0 4px 24px rgba(0,0,0,0.12) |

---

## 7. Mock 資料規格

### 7.1 資料量

| 類型 | 數量 | 說明 |
|------|------|------|
| 病患 | 12+ | 不同性別、年齡、血型 |
| 檢驗項目 | 27 | CBC (8)、BMP (7)、肝功能 (6)、腎功能 (6) |
| 醫令 | 16+ | 覆蓋所有狀態 |
| 檢驗結果 | 22+ | 含正常/異常/危急值 |
| 報告 | 7+ | draft / reviewed / final |

### 7.2 模擬延遲

所有 Mock Service 加入 200-500ms 隨機延遲，模擬真實 API 體驗。

---

## 8. 部署架構

### 8.1 Docker 部署

```
┌─────────────────────────────┐
│  Docker Container           │
│  ┌───────────────────────┐  │
│  │   Nginx (Port 80)     │  │
│  │   ├── index.html      │  │
│  │   ├── assets/         │  │
│  │   └── SPA fallback    │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### 8.2 建置流程

```
npm ci → vue-tsc → vite build → dist/
```

Multi-stage Docker build：
1. **Stage 1 (Builder)**: Node 22 Alpine — 安裝依賴 + 建置
2. **Stage 2 (Production)**: Nginx Alpine — 僅包含靜態檔案

### 8.3 Nginx 配置
- Vue Router history mode fallback (`try_files`)
- 靜態資源快取 1 年 (`Cache-Control: public, immutable`)
- Gzip 壓縮
- 安全 Headers（X-Frame-Options, X-Content-Type-Options, X-XSS-Protection）

---

## 9. CI/CD

### 9.1 GitHub Actions Pipeline

```
Push to main/dev → Lint → Type Check → Build
```

| 步驟 | 指令 | 說明 |
|------|------|------|
| Lint | `npm run lint` | ESLint + Vue + TypeScript 規則 |
| Type Check | `vue-tsc -b --noEmit` | TypeScript 嚴格檢查 |
| Build | `npm run build` | Vite 生產建置 |

---

## 10. 未來擴展方向

| 方向 | 說明 | 優先順序 |
|------|------|---------|
| API 整合 | 將 Mock Service 替換為真實 API | P0 |
| 認證授權 | JWT / OAuth2 + 角色權限控制 | P0 |
| 國際化 | i18n 多語系支援 | P1 |
| 列印 | 報告 PDF 匯出 | P1 |
| 即時通知 | WebSocket 推播 | P2 |
| 行動裝置 | PWA / 響應式優化 | P2 |
| 合規 | HIPAA / 個資法稽核記錄 | P2 |
