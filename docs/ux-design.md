# LISA — UX Design Document
> Laboratory Information System · MVP Demo
> Author: Luna (UX Architect) · Version 1.0 · 2026-03-16

---

## 0. Design Philosophy

### Muji Style — 日式有機極簡主義

> "不多不少，剛剛好" — 無印良品設計哲學

LISA 的介面以「自然蒸餾美學」為核心：移除一切非必要元素，讓資訊自然浮現。
如同日本和紙的觸感——溫暖、靜謐、有呼吸感。

### Design Tokens

```
色彩系統
─────────────────────────────────────────────
背景層
  --color-bg-base:        #F8F5F0   ← Cloud Dancer White（主背景，帶霧面亞麻感）
  --color-bg-surface:     #F3EFE8   ← 卡片 / 面板表面
  --color-bg-subtle:      #EDE8DF   ← 懸停 / 選中狀態

文字層
  --color-text-primary:   #2C2C2C   ← Soft Charcoal Grey（主文字）
  --color-text-secondary: #7A7268   ← Natural Linen Grey（輔助文字）
  --color-text-disabled:  #B8B0A4   ← 停用文字

線條層
  --color-border:         #DDD8CF   ← 細微水平分隔線
  --color-border-strong:  #C4BDB3   ← 強調邊框

緊急系統（極度克制）
  --color-critical:       #C0392B   ← MUJI Red（僅限 Critical Alert）
  --color-critical-bg:    #FAF0EE   ← Critical 淡底色

狀態色（柔和版本）
  --color-status-pending: #8B7355   ← 待處理（溫暖棕）
  --color-status-active:  #4A7C6F   ← 進行中（鼠尾草綠）
  --color-status-done:    #6B8E6B   ← 完成（苔蘚綠）

─────────────────────────────────────────────
字型系統
  --font-family:   'Helvetica Neue', 'Hiragino Sans', 'Noto Sans TC', sans-serif
  --letter-spacing: 0.04em          ← 寬鬆字距
  --line-height:    1.75             ← 寬鬆行距
  --font-size-xs:   11px
  --font-size-sm:   13px
  --font-size-base: 15px
  --font-size-lg:   18px
  --font-size-xl:   22px
  --font-size-2xl:  28px

─────────────────────────────────────────────
間距系統（8px 基礎網格）
  --space-1: 4px   --space-2: 8px   --space-3: 12px
  --space-4: 16px  --space-6: 24px  --space-8: 32px
  --space-12: 48px --space-16: 64px

─────────────────────────────────────────────
圖示系統
  FontAwesome 細線條（fa-light / fa-regular）
  尺寸：14px（表格）/ 16px（一般）/ 20px（導航）
  絕對禁止使用 emoji
```

---

## 1. 全域架構

### 1.1 應用程式結構

```
LISA Application
├── 角色選擇頁（Role Selector）           ← 入口，Demo 模式
│
├── [行政人員介面] Admin Portal
│   ├── /admin/dashboard                  ← 首頁
│   ├── /admin/orders/new                 ← 醫令開單
│   └── /admin/orders                     ← 醫令清單
│
├── [醫檢師介面] Technologist Portal
│   ├── /lab/dashboard                    ← 首頁
│   ├── /lab/worklist                     ← 工作清單
│   ├── /lab/worklist/:id/input           ← 檢驗值輸入
│   ├── /lab/worklist/:id/report          ← 報告核發
│   └── /lab/alerts                       ← Critical Alert Center
│
└── [客戶介面] Client Portal
    ├── /client/reports                   ← 報告列表
    ├── /client/reports/:id               ← 報告詳情
    └── /client/reports/:id/trend         ← 歷史趨勢
```

### 1.2 全域導航結構

#### Sidebar（280px 固定寬度）

```
┌─────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░  │  ← 頂部留白 32px
│   LISA                  │  ← Logo，Charcoal，14px letter-spacing
│   Laboratory Info. Sys. │  ← 副標，Linen Grey，11px
│  ─────────────────────  │  ← 細線分隔
│                         │  ← 留白 24px
│   [fa-gauge]  Dashboard │  ← 導航項目
│   [fa-flask]  Worklist  │
│   [fa-bell]   Alerts    │  ← 紅點badge（有未處理時）
│   [fa-file]   Reports   │
│                         │
│  ─────────────────────  │  ← 底部分隔
│   [fa-user]  Username   │  ← 使用者資訊
│   [fa-right] Sign Out   │
└─────────────────────────┘

激活狀態：左側 2px 炭灰豎線 + 背景 --color-bg-subtle
懸停狀態：背景 --color-bg-subtle，過渡 150ms ease
```

#### Top Header（56px 高度）

```
┌──────────────────────────────────────────────────────────┐
│ [麵包屑導航]                          [日期時間]  [通知]  │
│  Dashboard › Worklist                 2026-03-16   [fa-bell] │
└──────────────────────────────────────────────────────────┘

底部：1px solid --color-border
```

### 1.3 頁面轉場規則

```
轉場動效設計原則：自然、輕盈、無干擾

頁面切換：
  - 同層級頁面：fade（opacity 0→1，200ms ease-in-out）
  - 深入詳情頁：slide-right（translateX 20px→0 + opacity，250ms ease-out）
  - 返回上層：slide-left（translateX 0→-20px + opacity，200ms ease-in）

模態框 / 抽屜：
  - 開啟：fade-up（translateY 8px→0 + opacity，200ms ease-out）
  - 關閉：fade（opacity 1→0，150ms ease-in）

數值更新（表格/卡片）：
  - 數字變化：flip（垂直翻轉，300ms）
  - 狀態標籤：cross-fade（200ms）

Critical Alert 進場：
  - slide-in-right + 輕微 shake（提醒注意，僅一次）
```

---

## 2. 角色選擇頁（Role Selector）

### 2.1 User Flow

```
應用啟動
  └─→ 角色選擇頁
        ├─→ 點擊「行政人員」→ /admin/dashboard
        ├─→ 點擊「醫檢師」  → /lab/dashboard
        └─→ 點擊「客戶」    → /client/reports
```

### 2.2 Wireframe

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                          （留白 80px）                        ║
║                                                              ║
║                         LISA                                 ║
║               Laboratory Information System                  ║
║                                                              ║
║                   ─────────────────────                      ║
║                                                              ║
║              請選擇您的身份 / Select Role                     ║
║                                                              ║
║                          （留白 48px）                        ║
║                                                              ║
║    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ║
║    │              │  │              │  │              │    ║
║    │  [fa-user-   │  │  [fa-        │  │  [fa-        │    ║
║    │   tie]       │  │  microscope] │  │   building]  │    ║
║    │              │  │              │  │              │    ║
║    │  行政人員     │  │   醫檢師      │  │    客戶       │    ║
║    │  Admin       │  │  Medical     │  │   Client     │    ║
║    │  Staff       │  │  Technologist│  │              │    ║
║    │              │  │              │  │              │    ║
║    └──────────────┘  └──────────────┘  └──────────────┘    ║
║                                                              ║
║                          （留白 80px）                        ║
║                                                              ║
║                     LISA MVP Demo v1.0                       ║
╚══════════════════════════════════════════════════════════════╝

卡片規格：
- 尺寸：180px × 220px
- 背景：--color-bg-surface
- 邊框：1px solid --color-border
- 懸停：邊框色加深 + 輕微上移 translateY(-2px)
- 圖示：24px，Charcoal Grey
- 文字：16px，寬字距
```

---

## 3. 行政人員介面（Admin Portal）

### 3.1 完整 User Flow

```
/admin/dashboard（行政 Dashboard）
  │
  ├─→ 點擊「New Order」按鈕
  │     └─→ /admin/orders/new（醫令開單 Step 1：選擇病患）
  │           └─→ 搜尋 / 選擇病患
  │                 └─→ Step 2：選擇檢驗項目
  │                       └─→ 勾選一或多個項目
  │                             └─→ Step 3：填寫附加資訊
  │                                   └─→ 填寫備注、緊急程度
  │                                         └─→ Step 4：確認送出
  │                                               ├─→ 送出成功 → Toast 通知 → 返回 Dashboard
  │                                               └─→ 送出失敗 → 錯誤提示 → 留在確認頁
  │
  ├─→ 點擊「View All Orders」
  │     └─→ /admin/orders（醫令清單）
  │           ├─→ 搜尋 / 篩選
  │           ├─→ 點擊單筆醫令 → 展開詳情（Inline Expand 或 Side Drawer）
  │           └─→ 點擊「New Order」→ /admin/orders/new
  │
  └─→ Dashboard 直接查看今日統計數字（唯讀）
```

### 3.2 Admin Dashboard Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ SIDEBAR (280px)   │  MAIN CONTENT AREA                         │
│                   │                                             │
│  LISA             │  ┌─ Header ─────────────────────────────┐  │
│  ─────────────    │  │ Dashboard          2026-03-16  [bell] │  │
│                   │  └──────────────────────────────────────┘  │
│  [gauge] Dashboard│                                             │
│  [file]  Orders   │  Today's Test Status Overview               │
│                   │  ─────────────────────────────────────────  │
│                   │                                             │
│                   │  ┌─────────────┐ ┌─────────────┐ ┌───────┐ │
│                   │  │             │ │             │ │       │ │
│                   │  │  Total      │ │  Pending    │ │Critical│ │
│                   │  │            │ │             │ │       │ │
│                   │  │    128      │ │     34      │ │   7   │ │
│                   │  │            │ │             │ │       │ │
│                   │  │ Tests Today │ │  Awaiting   │ │  MUJI │ │
│                   │  │            │ │  Processing │ │  Red  │ │
│                   │  └─────────────┘ └─────────────┘ └───────┘ │
│                   │                                             │
│                   │  ─────────────────────────────────────────  │
│                   │                                             │
│                   │  Recent Orders            [+ New Order]    │
│                   │  ─────────────────────────────────────────  │
│                   │  Sample ID   Patient    Test    Status Time │
│                   │  ─────────────────────────────────────────  │
│                   │  LIS-2026031  陳○○   CBC     Pending 09:12 │
│                   │  LIS-2026030  林○○   LFT     Active  08:55 │
│                   │  LIS-2026029  黃○○   UA      Done    08:30 │
│                   │  ─────────────────────────────────────────  │
│                   │                         [View All Orders →] │
│  ─────────────    │                                             │
│  [user]  Admin    │                                             │
└───────────────────┴─────────────────────────────────────────────┘

計數卡片規格：
- 3欄均等，間距 24px
- Critical 卡片：數字顏色 --color-critical，其餘 --color-text-primary
- 數字：36px，font-weight 300（輕量感）
- 標籤：12px，--color-text-secondary
```

### 3.3 醫令開單頁 Wireframe（4步驟 Wizard）

```
步驟指示器（Header 下方）
─────────────────────────────────────────────────────────
  ①  選擇病患   ──  ②  選擇項目   ──  ③  填寫資訊  ──  ④  確認送出
  ●────────────────○────────────────○───────────────○
  已完成          待完成

─── STEP 1：選擇病患 ─────────────────────────────────────

  Search Patient
  ┌────────────────────────────────────────┐
  │ [fa-search]  搜尋病患姓名 / ID...       │
  └────────────────────────────────────────┘

  Recent Patients
  ────────────────────────────────────────────────────────
  [fa-user]  陳○○   ID: P-10042   1985-06-12   Male
  [fa-user]  林○○   ID: P-10041   1972-03-28   Female
  [fa-user]  黃○○   ID: P-10039   1990-11-05   Male
  ────────────────────────────────────────────────────────

  選中後：卡片高亮 + 左側炭灰豎線標記
                              [Next: Select Tests →]

─── STEP 2：選擇檢驗項目 ──────────────────────────────────

  Selected Patient: 陳○○  ID: P-10042  [change]
  ─────────────────────────────────────────────────────

  Search Tests
  ┌────────────────────────────────────────┐
  │ [fa-search]  搜尋檢驗項目...            │
  └────────────────────────────────────────┘

  Category Filters:  [All]  [血液]  [生化]  [微生物]  [尿液]

  ────────────────────────────────────────────────────────
  □  CBC          Complete Blood Count         血液    15 min
  □  LFT          Liver Function Test          生化    30 min
  ☑  UA           Urinalysis                  尿液    20 min
  □  HbA1c        Glycated Hemoglobin          生化    60 min
  ────────────────────────────────────────────────────────

  Selected (1): UA                    [← Back]  [Next →]

─── STEP 3：填寫附加資訊 ──────────────────────────────────

  Urgency Level
  ○ Routine   ● Urgent   ○ STAT (Critical)

  Clinical Notes  (optional)
  ┌────────────────────────────────────────┐
  │                                        │
  │  （文字輸入區，最多 500 字）             │
  │                                        │
  └────────────────────────────────────────┘
  0 / 500

  Requested By
  ┌────────────────────────────────────────┐
  │  Dr. _____________________________     │
  └────────────────────────────────────────┘
                           [← Back]  [Review Order →]

─── STEP 4：確認送出 ───────────────────────────────────────

  Order Summary
  ─────────────────────────────────────────────
  Patient          陳○○  (P-10042)
  Tests            UA - Urinalysis
  Urgency          Urgent
  Requested By     Dr. Wang
  Clinical Notes   —
  ─────────────────────────────────────────────

  ┌─────────────────────────────────────┐
  │          Submit Order               │  ← 炭灰底色按鈕
  └─────────────────────────────────────┘
  [← Back to Edit]
```

### 3.4 醫令清單頁 Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│ Orders                                          [+ New Order]    │
│ ────────────────────────────────────────────────────────────     │
│                                                                  │
│  ┌─────────────────────────┐  [Status ▾]  [Date ▾]  [Search]   │
│  │ [fa-search]  搜尋...     │                                    │
│  └─────────────────────────┘                                    │
│                                                                  │
│  Status Tabs:  [All 128]  [Pending 34]  [Active 87]  [Done 7]   │
│  ──────────────────────────────────────────────────────────     │
│                                                                  │
│  Sample ID      Patient    Test  Urgency  Status    Time   [⋯]  │
│  ──────────────────────────────────────────────────────────     │
│  LIS-2026-031   陳○○      UA    Urgent   ● Pending  09:12       │
│  LIS-2026-030   林○○      LFT   Routine  ● Active   08:55       │
│  LIS-2026-029   黃○○      CBC   STAT     ● Critical 08:30  [!]  │
│  LIS-2026-028   吳○○      HbA1c Routine  ● Done     07:45       │
│  ──────────────────────────────────────────────────────────     │
│                                                                  │
│  展開詳情（點擊列展開）:                                          │
│  ╔══════════════════════════════════════════════════════════╗   │
│  ║  LIS-2026-031 · 陳○○                                    ║   │
│  ║  UA - Urinalysis · Urgent · Dr. Wang                    ║   │
│  ║  Submitted: 2026-03-16 09:12  Status: Pending           ║   │
│  ╚══════════════════════════════════════════════════════════╝   │
│                                                                  │
│  Showing 1–20 of 128             [← Prev]  1  2  3  [Next →]   │
└──────────────────────────────────────────────────────────────────┘

狀態標籤色彩：
  ● Pending  → --color-status-pending（溫暖棕）
  ● Active   → --color-status-active（鼠尾草綠）
  ● Done     → --color-status-done（苔蘚綠）
  ● Critical → --color-critical（MUJI Red）

STAT 緊急標記：列背景色 --color-critical-bg，右側 [!] icon
```

---

## 4. 醫檢師介面（Lab / Technologist Portal）

### 4.1 完整 User Flow

```
/lab/dashboard（醫檢師 Dashboard）
  │
  ├─→ 點擊 Worklist 項目 / 「View Worklist」
  │     └─→ /lab/worklist（工作清單）
  │           └─→ 點擊一筆待處理項目
  │                 └─→ /lab/worklist/:id/input（檢驗值輸入）
  │                       ├─→ 輸入數值
  │                       │     ├─→ 系統自動比對參考範圍
  │                       │     ├─→ 異常值 → 自動標記 + 提示
  │                       │     └─→ Critical 值 → MUJI Red 警示
  │                       └─→ 「Submit Values」
  │                             └─→ /lab/worklist/:id/report（報告核發）
  │                                   ├─→ 審核報告內容
  │                                   ├─→ 「Approve & Sign」→ 確認 Modal
  │                                   │     └─→ 確認 → 報告核發完成 → 返回 Worklist
  │                                   └─→ 「Request Revision」→ 備注 → 退回
  │
  └─→ 點擊「Alert Center」/ Critical 通知
        └─→ /lab/alerts（Critical Alert Center）
              └─→ 查看 Critical 值列表
                    └─→ 點擊單筆 → 查看詳情 → 「Acknowledge」確認已處理
```

### 4.2 Lab Dashboard Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│ SIDEBAR          │  MAIN CONTENT AREA                              │
│                  │                                                  │
│  LISA            │  ┌─ Header ──────────────────────────────────┐  │
│  ──────────      │  │ Dashboard              2026-03-16  [bell] │  │
│                  │  └───────────────────────────────────────────┘  │
│  [gauge] Dashboard│                                                 │
│  [list]  Worklist │  Good Morning, Dr. Chen.                       │
│  [bell]  Alerts ● │  ─────────────────────────────────────────     │
│  [file]  Reports  │                                                 │
│                  │  ┌──────────────────┐  ┌──────────────────────┐ │
│                  │  │  Active Worklist  │  │  Critical Alerts     │ │
│                  │  │                  │  │  ██████████████████  │ │
│                  │  │       23         │  │                      │ │
│                  │  │  Pending Tests   │  │         3            │ │
│                  │  │                  │  │  Unresolved Alerts   │ │
│                  │  │  [View Worklist →]│  │  [Go to Alerts →]   │ │
│                  │  └──────────────────┘  └──────────────────────┘ │
│                  │                                                  │
│                  │  Critical 卡片：邊框色 --color-critical，         │
│                  │  數字色 --color-critical，背景 --color-critical-bg │
│                  │                                                  │
│                  │  ─────────────────────────────────────────     │
│                  │  Today's Priority Queue                         │
│                  │  ─────────────────────────────────────────     │
│                  │  [!] LIS-029  黃○○  CBC   STAT    Critical    │
│                  │      LIS-031  陳○○  UA    Urgent   Pending     │
│                  │      LIS-030  林○○  LFT   Routine  Active      │
│                  │  ─────────────────────────────────────────     │
│                  │                       [View All Worklist →]     │
└──────────────────┴──────────────────────────────────────────────────┘
```

### 4.3 工作清單（Worklist）Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ Worklist                                    Pending: 23  Critical: 3 │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                      │
│  ┌──────────────────────────┐  [Priority ▾]  [Status ▾]  [Search]  │
│  │ [fa-search]  搜尋...      │                                       │
│  └──────────────────────────┘                                       │
│                                                                      │
│  View:  [All]  [Pending]  [In Progress]  [Completed]                │
│  ────────────────────────────────────────────────────────────────   │
│                                                                      │
│  Sample ID    Patient Name  Test Name        Status      Action     │
│  ────────────────────────────────────────────────────────────────   │
│  LIS-2026-029  黃○○        CBC - Complete    ● Pending   [Process] │
│  ⚑             黄○○                         Blood Count            │
│                             Priority: STAT                           │
│  ────────────────────────────────────────────────────────────────   │
│  LIS-2026-031  陳○○        UA - Urinalysis  ● Pending   [Process] │
│                             Priority: Urgent                         │
│  ────────────────────────────────────────────────────────────────   │
│  LIS-2026-030  林○○        LFT - Liver Fn.  ● Active    [Continue]│
│                             Priority: Routine                        │
│  ────────────────────────────────────────────────────────────────   │
│  LIS-2026-028  吳○○        HbA1c            ● Completed [View]    │
│                             Priority: Routine                        │
│  ────────────────────────────────────────────────────────────────   │
│                                                                      │
│  STAT 列：背景 --color-critical-bg，左側 2px --color-critical 邊線  │
│  [fa-flag] 旗幟圖示標記緊急                                          │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.4 檢驗值輸入頁 Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ [← Worklist]  Enter Results — LIS-2026-029                          │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                      │
│  Patient: 黃○○  (P-10039)  ·  Test: CBC  ·  Priority: STAT         │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Test Parameter      Result       Unit      Ref. Range    Status    │
│  ─────────────────────────────────────────────────────────────────  │
│  WBC (White Blood                                                    │
│  Cell Count)       ┌──────┐      10³/μL     4.0 – 11.0   ● Normal  │
│                    │ 8.5  │                                          │
│                    └──────┘                                          │
│  ─────────────────────────────────────────────────────────────────  │
│  RBC (Red Blood                                                      │
│  Cell Count)       ┌──────┐      10⁶/μL     4.5 – 5.5    ▲ Low    │
│                    │ 3.2  │ ← 低於參考值，輸入框邊框變色 + 小標記       │
│                    └──────┘                                          │
│  ─────────────────────────────────────────────────────────────────  │
│  Hemoglobin        ┌──────┐      g/dL        13 – 17      !! CRIT  │
│                    │ 6.5  │ ← CRITICAL 值，框體 MUJI Red，背景淡紅   │
│                    └──────┘                                          │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚠ Critical Value Detected                                   │   │
│  │ Hemoglobin: 6.5 g/dL is below critical threshold (7.0)      │   │
│  │ This will trigger an immediate Critical Alert notification.  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  （Critical 提示框：MUJI Red 左邊線，背景 --color-critical-bg）       │
│                                                                      │
│  Analyst Notes  (optional)                                           │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                                                          │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                      │
│  [Save Draft]                          [Submit for Review →]        │
└──────────────────────────────────────────────────────────────────────┘

異常值標記規則：
  ● Normal   → --color-status-done（綠）
  ▲ High     → --color-status-pending（棕），▲ 圖示
  ▼ Low      → --color-status-pending（棕），▼ 圖示
  !! Critical → --color-critical（MUJI Red），!! 標記
  輸入框 border-color 對應異常級別
```

### 4.5 報告核發頁 Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ [← Worklist]  Report Review — LIS-2026-029                          │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           LISA Laboratory Report                            │   │
│  │  ─────────────────────────────────────────────────────────  │   │
│  │  Patient: 黃○○            ID: P-10039                      │   │
│  │  DOB: 1990-11-05           Sex: Male                        │   │
│  │  Test: CBC                 Date: 2026-03-16                 │   │
│  │  Ordered by: Dr. Wang      Sample: Venous Blood             │   │
│  │  ─────────────────────────────────────────────────────────  │   │
│  │  Parameter     Result    Unit     Reference    Flag         │   │
│  │  ─────────────────────────────────────────────────────────  │   │
│  │  WBC           8.5       10³/μL   4.0-11.0     —           │   │
│  │  RBC           3.2  ▼    10⁶/μL   4.5-5.5      LOW         │   │
│  │  Hemoglobin    6.5  !!   g/dL     13-17        CRITICAL     │   │
│  │  ─────────────────────────────────────────────────────────  │   │
│  │  Analyst: Dr. Chen         Reviewed: —                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  Review Decision                                                     │
│                                                                      │
│  ┌───────────────────────────┐   ┌───────────────────────────┐     │
│  │  [fa-check]               │   │  [fa-rotate-left]          │     │
│  │  Approve & Sign           │   │  Request Revision          │     │
│  │  核發此報告               │   │  退回重新輸入               │     │
│  └───────────────────────────┘   └───────────────────────────┘     │
│                                                                      │
│  Approve 按鈕：炭灰底，白字；Revision 按鈕：白底，炭灰框              │
│                                                                      │
│  點擊「Approve & Sign」→ 確認 Modal:                                 │
│  ╔══════════════════════════════════════╗                           │
│  ║  Confirm Report Approval             ║                           │
│  ║                                      ║                           │
│  ║  You are about to sign and release   ║                           │
│  ║  this report. This action cannot     ║                           │
│  ║  be undone.                          ║                           │
│  ║                                      ║                           │
│  ║  [Cancel]          [Confirm & Sign]  ║                           │
│  ╚══════════════════════════════════════╝                           │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.6 Critical Alert Center Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ Critical Alert Center                      Unresolved: 3             │
│ ─────────────────────────────────────────────────────────────────   │
│  （頁面頂部：2px MUJI Red 上邊線，微紅色背景提示這是高警戒區域）        │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ⚠ CRITICAL VALUE ALERT                          2026-03-16  │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  Patient:  黃○○  (P-10039)                                  │  │
│  │  Sample:   LIS-2026-029                                      │  │
│  │  Value:    Hemoglobin = 6.5 g/dL  (Critical Low < 7.0)      │  │
│  │  Time:     09:30                                             │  │
│  │  Status:   UNRESOLVED                                        │  │
│  │  ─────────────────────────────────────────────────────────   │  │
│  │  [View Full Report]              [Acknowledge Alert]         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  （卡片：左側 4px MUJI Red 邊線，淡紅背景，陰影輕微）                  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  ⚠ CRITICAL VALUE ALERT                          2026-03-16  │  │
│  │  Patient: 陳○○ (P-10042) · Potassium = 6.8 mEq/L (High)   │  │
│  │  Status: UNRESOLVED                           [Acknowledge]  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Resolved Alerts (Today)                                            │
│  ─────────────────────────────────────────────────────────────────  │
│  LIS-2026-025  林○○   Na = 122 mEq/L   Ack. 08:15  by Dr. Chen   │
│  ─────────────────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 5. 客戶介面（Client Portal）

### 5.1 完整 User Flow

```
/client/reports（報告列表）
  │
  ├─→ 搜尋 / 篩選報告
  │     └─→ 結果更新（即時過濾，無需翻頁）
  │
  └─→ 點擊單筆報告
        └─→ /client/reports/:id（報告詳情）
              ├─→ 查看各項檢驗數值、參考範圍、異常標記
              ├─→ 點擊「View Trend」/ 個別數值旁趨勢按鈕
              │     └─→ /client/reports/:id/trend（歷史趨勢）
              │           ├─→ 選擇時間範圍（3個月 / 6個月 / 1年）
              │           ├─→ 切換檢驗項目
              │           └─→ [← Back to Report]
              └─→ [← Back to List]
```

### 5.2 報告列表頁 Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR          │  My Reports                                       │
│                  │  ─────────────────────────────────────────────   │
│  LISA            │                                                   │
│  ──────────      │  ┌────────────────────────────────────────────┐  │
│                  │  │ [fa-search]  搜尋報告 / 檢驗項目...          │  │
│  [file] Reports  │  └────────────────────────────────────────────┘  │
│                  │                                                   │
│                  │  Filter:  [All]  [2026]  [2025]  [Abnormal]      │
│                  │                                                   │
│                  │  ─────────────────────────────────────────────   │
│                  │  Date         Test Name           Status         │
│                  │  ─────────────────────────────────────────────   │
│                  │  2026-03-16   CBC · Complete        ▲ Abnormal   │
│                  │               Blood Count           [View →]     │
│                  │  ─────────────────────────────────────────────   │
│                  │  2026-02-28   LFT · Liver            ● Normal    │
│                  │               Function Test          [View →]    │
│                  │  ─────────────────────────────────────────────   │
│                  │  2026-01-15   HbA1c · Glycated       ▲ Abnormal  │
│                  │               Hemoglobin             [View →]    │
│                  │  ─────────────────────────────────────────────   │
│                  │                                                   │
│                  │  Abnormal 標記：--color-status-pending（棕色▲）    │
│  ──────────      │  Normal 標記：--color-status-done（綠色●）         │
│  [user] 客戶名   │                                                   │
└──────────────────┴───────────────────────────────────────────────────┘
```

### 5.3 報告詳情頁 Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ [← My Reports]  CBC Report · 2026-03-16             [fa-download]   │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           Laboratory Report                                 │   │
│  │  Patient: 黃○○        Test Date: 2026-03-16                │   │
│  │  Test: CBC - Complete Blood Count                           │   │
│  │  Ordered by: Dr. Wang                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Parameter      Result    Unit      Reference     Flag   Trend      │
│  ─────────────────────────────────────────────────────────────────  │
│  WBC            8.5       10³/μL    4.0 – 11.0    —      [~]       │
│  RBC            3.2  ▼    10⁶/μL    4.5 – 5.5     LOW    [~]       │
│  Hemoglobin     6.5  !!   g/dL      13 – 17       CRIT   [~]       │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  圖示說明（頁面底部）：                                               │
│  ▼ 低於參考範圍  ▲ 高於參考範圍  !! 危急值（需立即聯繫醫師）          │
│  [~] 查看歷史趨勢                                                    │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚠ Important Notice                                          │   │
│  │ Some values are outside normal range. Please consult your   │   │
│  │ physician for interpretation.                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  （提示框：左側炭灰邊線，非紅色，這是普通提醒非緊急）                   │
│                                                                      │
│                        [View Historical Trends →]                   │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.4 歷史趨勢頁 Wireframe

```
┌──────────────────────────────────────────────────────────────────────┐
│ [← CBC Report]  Historical Trends                                   │
│ ─────────────────────────────────────────────────────────────────   │
│                                                                      │
│  Parameter:  [Hemoglobin ▾]     Period:  [3M]  [6M]  [1Y]         │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Hemoglobin (g/dL)                                                  │
│                                                                      │
│  17.0 ┤ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (Upper Reference: 17.0) ─ ─ ─    │
│       │                                                              │
│  13.0 ┤ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ (Lower Reference: 13.0) ─ ─ ─    │
│       │    ●──────●                                                 │
│  10.0 ┤         ╲                                                   │
│       │            ●                                                 │
│   7.0 ┤ ─ ─ ─ ─ ─ ─(Critical Low: 7.0) ─ ─ ─ ─ ─ ─ ─ ─ ─ ─    │
│       │                ╲                                             │
│   6.5 ┤                  ●  ← 今日值（MUJI Red 點）                  │
│       └────────────────────────────────────────────────────        │
│       2025-12       2026-01     2026-02      2026-03               │
│                                                                      │
│  圖表規格：                                                           │
│  - 折線：炭灰色，2px stroke                                           │
│  - 參考範圍帶：淡米色填充（--color-bg-subtle）                        │
│  - Critical 閾值線：虛線，--color-critical                           │
│  - Critical 數值點：--color-critical（MUJI Red）                     │
│  - Normal 數值點：--color-status-done（綠）                          │
│  - 異常數值點：--color-status-pending（棕）                          │
│  - 無多餘網格線，極簡座標軸                                           │
│                                                                      │
│  ─────────────────────────────────────────────────────────────────  │
│  Data Points                                                        │
│  2026-03-16   6.5 g/dL   !! CRITICAL                               │
│  2026-02-28   8.2 g/dL   ▼ Low                                     │
│  2026-01-15   11.5 g/dL  ▼ Low                                     │
│  2025-12-10   13.8 g/dL  ─ Normal                                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 6. 表單驗證與錯誤處理 UX 規則

### 6.1 驗證觸發時機

```
觸發規則（按優先順序）：

1. On Blur（失焦時）
   - 使用者離開輸入欄位後立即驗證
   - 適用：必填欄位、格式驗證（日期、數字格式）

2. On Input（即時）
   - 僅用於：字數限制（實時顯示剩餘字數）
   - 禁止用於：錯誤提示（避免過早打斷使用者）

3. On Submit（送出時）
   - 全表單最終驗證
   - 所有未填必填欄位一次顯示

4. 例外：檢驗值輸入
   - 輸入後立即比對參考範圍（提供即時反饋，非錯誤，是輔助資訊）
```

### 6.2 錯誤顯示規則

```
錯誤訊息設計原則：
  - 出現位置：輸入框正下方，left-aligned
  - 顏色：--color-status-pending（溫暖棕），非刺眼紅色
  - 字體：12px，Linen Grey
  - 圖示：[fa-circle-exclamation] 細線版本
  - 輸入框：border-color 變為 --color-border-strong（加深，非紅色）
  - Critical/系統錯誤：才使用 --color-critical

錯誤訊息寫作原則：
  - 告訴使用者「需要什麼」，不說「你做錯了」
  - ✓ "Patient name is required."
  - ✗ "Invalid input."
  - ✓ "Please enter a value between 0 and 999."
  - ✗ "Error: out of range."

欄位狀態視覺：
  □ 未填（初始）  → 預設灰色邊框
  ✎ 填寫中       → 邊框加深 + focus ring（柔和陰影）
  ✓ 通過驗證     → 正常邊框（不顯示綠勾，避免視覺過多）
  ✗ 驗證失敗     → 邊框加深 + 錯誤訊息
  ⚠ 異常值（檢驗）→ 對應顏色邊框 + inline 標記
```

### 6.3 Toast 通知系統

```
Toast 通知規格：
  位置：右下角，距邊 24px
  寬度：320px
  持續時間：4秒自動消失
  動效：slide-up + fade in，消失時 fade out

Toast 類型：
  ✓ Success  → 背景 --color-bg-surface，左側 4px 苔蘚綠邊線
                "Order submitted successfully."
  
  ! Warning  → 背景 --color-bg-surface，左側 4px 溫暖棕邊線
                "Some values are outside reference range."
  
  ✗ Error    → 背景 --color-bg-surface，左側 4px 炭灰邊線
                "Failed to submit. Please try again."
  
  !! Critical→ 背景 --color-critical-bg，左側 4px MUJI Red 邊線
                "Critical value detected. Alert sent."
                （不自動消失，需手動關閉）
```

### 6.4 空狀態（Empty State）設計

```
空狀態設計原則：
  - 居中顯示，大量留白
  - 圖示：32px FontAwesome，--color-text-disabled
  - 主文：16px，--color-text-secondary
  - 副文：13px，--color-text-disabled
  - 若有操作引導：淡色輪廓按鈕

範例：
  ┌────────────────────────────────────┐
  │                                    │
  │          [fa-flask]                │
  │                                    │
  │       No orders found              │
  │    Try adjusting your filters      │
  │    or create a new order.          │
  │                                    │
  │       [+ New Order]                │
  │                                    │
  └────────────────────────────────────┘
```

### 6.5 載入狀態設計

```
載入指示設計（Muji 風格）：
  - 禁止使用旋轉圓圈（視覺嘈雜）
  - 使用：細線水平進度條（頁面頂部，高度 2px）
  - 顏色：--color-text-secondary（柔和灰）
  - 表格 Skeleton：灰白色佔位條（shimmer 動效，極輕微）
  - 按鈕載入：文字替換為 "..." + 停用狀態，不加 spinner
```

---

## 7. 無障礙與響應式規則

### 7.1 無障礙（Accessibility）

```
基本要求：
  - 所有互動元素可 Tab 導航
  - Focus outline：2px offset，--color-text-secondary（柔和但可見）
  - 圖示必須有 aria-label 或 title
  - 顏色不作為唯一資訊傳達手段（Critical 值有 !! 文字標記）
  - 表格有 scope="col" 列標題
  - 模態框使用 role="dialog"，focus trap 到 modal 內
```

### 7.2 響應式斷點

```
MVP 版本主要針對桌面端（1280px+）
─────────────────────────────────────────
Desktop (≥ 1280px):   Sidebar 固定展開
Tablet  (768–1279px): Sidebar 可折疊（icon only）
Mobile  (< 768px):    Sidebar 變為底部 Tab Bar（簡化版）
```

---

## 8. 頁面清單總覽

| 路由 | 頁面名稱 | 角色 | 優先級 |
|------|---------|------|--------|
| `/` | Role Selector | All | P0 |
| `/admin/dashboard` | Admin Dashboard | Admin | P0 |
| `/admin/orders/new` | New Order Wizard | Admin | P0 |
| `/admin/orders` | Order List | Admin | P0 |
| `/lab/dashboard` | Lab Dashboard | MT | P0 |
| `/lab/worklist` | Worklist | MT | P0 |
| `/lab/worklist/:id/input` | Result Entry | MT | P0 |
| `/lab/worklist/:id/report` | Report Review | MT | P0 |
| `/lab/alerts` | Critical Alert Center | MT | P0 |
| `/client/reports` | Report List | Client | P0 |
| `/client/reports/:id` | Report Detail | Client | P0 |
| `/client/reports/:id/trend` | Historical Trend | Client | P1 |

---

*LISA UX Design Document — Luna (UX Architect)*
*Reviewed for Muji Style compliance: Cloud Dancer White base, Soft Charcoal Grey accents, MUJI Red reserved for critical-only.*
