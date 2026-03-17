# 🧪 LISA — Laboratory Information System

> 實驗室資訊管理系統 MVP Demo  
> Muji Style 日式極簡設計 · 純前端 Mock Data 展示

## 📋 簡介

LISA 是一套現代化的實驗室資訊管理系統（LIS）前端展示原型，涵蓋實驗室檢驗流程的完整工作流：**醫令開立 → 採樣登記 → 檢驗作業 → 報告核發 → 報告查閱**。

系統提供三種角色介面：
- 🏥 **行政人員 (Admin)** — 醫令管理、病患管理、報告管理、系統設定
- 🔬 **醫檢師 (Technologist)** — 工作清單、檢驗值輸入、報告審核、品質管控
- 📊 **客戶 (Client)** — 報告查閱、報告搜尋、歷史趨勢

## 🛠 技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| Vue 3 | 3.5 | 前端框架（Composition API + `<script setup>`） |
| TypeScript | 5.9 | 型別安全 |
| Vite | 8.0 | 建構工具 |
| Tailwind CSS | 3.4 | 樣式框架 |
| Pinia | 3.0 | 狀態管理 |
| Vue Router | 4.6 | 路由（含角色守衛） |
| Chart.js + vue-chartjs | 4.5 / 5.3 | 趨勢圖表 |
| Font Awesome | 7.2 | 圖示 |
| Day.js | 1.11 | 日期處理 |

## 🚀 快速開始

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 🐳 Docker 部署

```bash
# 建置映像
docker build -t lisa .

# 啟動容器
docker run -p 8080:80 lisa
```

開啟 http://localhost:8080 即可使用。

## 📁 專案結構

```
src/
├── types/              # TypeScript 型別定義
├── router/             # Vue Router（含角色路由守衛）
├── stores/             # Pinia 狀態管理（7 個 Store）
├── mock/               # Mock 資料層
│   ├── data/           #   靜態假資料（病患、醫令、報告...）
│   └── services/       #   模擬 API 服務
├── composables/        # Vue 3 Composables
├── components/
│   ├── base/           #   基礎元件（Button, Card, Table...）
│   ├── composite/      #   組合元件（Modal, Alert, Empty...）
│   └── layout/         #   佈局元件（Sidebar, Navbar, Shell）
├── views/
│   ├── admin/          #   行政人員頁面（8 頁）
│   ├── tech/           #   醫檢師頁面（7 頁）
│   └── client/         #   客戶頁面（3 頁）
└── styles/             # 全域樣式 + Design Tokens
```

## 🎨 設計風格

採用 **Muji Style 日式有機極簡主義**：
- **色彩**：Cloud Dancer White (#F5F0EB) + Warm Stone (#E8E0D8) + Soft Charcoal (#4A4A4A)
- **字體**：Noto Sans TC（繁中） + Inter（英數）
- **圓角**：8px（卡片）、6px（按鈕）、4px（輸入框）
- **間距**：8px 基準網格

## 📊 Mock 資料

| 資料類型 | 數量 | 說明 |
|----------|------|------|
| 病患 | 12+ | 含完整個人資料與病歷號 |
| 檢驗項目 | 27 | CBC、BMP、肝功能、腎功能等 |
| 醫令 | 16+ | 各種狀態（pending → completed） |
| 檢驗結果 | 22+ | 含異常值標記 |
| 報告 | 7+ | draft → reviewed → final |

## 🔒 角色權限

系統使用 Vue Router 全域守衛實作角色隔離：
- `/admin/*` — 僅行政人員可存取
- `/tech/*` — 僅醫檢師可存取
- `/client/*` — 僅客戶可存取
- `/` — 角色選擇頁（公開）

## 📄 文件

詳細文件位於 `docs/` 目錄：
- `requirements-analysis.md` — 完整需求分析
- `architecture.md` — 前端架構設計
- `data-models.md` — 資料模型定義
- `sprint-plan.md` — Sprint 計畫
- `content-plan.md` — UI 文案規劃
- `market-analysis.md` — 市場分析
- `directory-structure.md` — 目錄結構

## 📝 License

MIT
