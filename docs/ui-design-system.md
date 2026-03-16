# LISA UI Design System
**Muji Style — 日式有機極簡主義、禪意介面**

> Version: 1.0.0 | Author: Aria (UI Designer) | Date: 2026-03-16

---

## 設計哲學

LISA 的 UI 設計語言源自無印良品（MUJI）美學——**去除多餘、回歸本質**。
介面如同優質的日本紙張：米白色的底、炭灰的文字、極少的裝飾，讓資料與功能自然呼吸。
每一個元素都有存在的意義，沒有噪音，只有清晰的訊號。

---

## 1. 色彩系統 Design Tokens

### 1.1 核心色票

| Token 名稱 | Hex 值 | 用途說明 |
|-----------|--------|---------|
| `muji-white` | `#F5F0EB` | 主要背景色、卡片底色 |
| `muji-cream` | `#EDE8E1` | 次要背景、Hover 狀態、交替行 |
| `muji-charcoal` | `#3C3C3C` | 主要文字、標題、強調元素 |
| `muji-linen` | `#B8B0A8` | 次要文字、disabled 狀態、分隔線 |
| `muji-border` | `#D8D2CA` | 邊框、分隔線、Input 外框 |
| `muji-text` | `#2C2C2C` | 內文主要文字（深）|
| `muji-text-light` | `#7A7A7A` | 說明文字、placeholder、caption |
| `muji-red` | `#C53D43` | ⚠️ 僅用於 Critical Alert，嚴格限制 |

### 1.2 功能色

| Token 名稱 | Hex 值 | 用途說明 |
|-----------|--------|---------|
| `muji-success` | `#5A8A6A` | 成功狀態、正常運作（沉穩的自然綠）|
| `muji-success-bg` | `#EDF3EF` | Success 背景底色 |
| `muji-warning` | `#B8860B` | 警告狀態、需要注意（暗金黃）|
| `muji-warning-bg` | `#FBF6E9` | Warning 背景底色 |
| `muji-info` | `#4A6FA5` | 資訊提示、一般通知（霧藍）|
| `muji-info-bg` | `#EBF0F8` | Info 背景底色 |

### 1.3 設計原則
- **背景層次**：muji-white（最底層）→ muji-cream（第二層）→ white `#FFFFFF`（卡片最高層）
- **文字對比**：muji-charcoal / muji-text 在所有背景上 WCAG AA 合規
- **muji-red 使用原則**：每個頁面最多出現 1 次，絕不用於裝飾性目的

---

## 2. 字體排版系統

```
font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
```

### 2.1 字型比例表

| 層級 | Size | Weight | Line-Height | Letter-Spacing | 用途 |
|------|------|--------|-------------|----------------|------|
| `h1` | `28px` (1.75rem) | `300` (Light) | `1.3` | `-0.02em` | 頁面主標題 |
| `h2` | `22px` (1.375rem) | `300` (Light) | `1.35` | `-0.015em` | 區塊標題 |
| `h3` | `18px` (1.125rem) | `400` (Regular) | `1.4` | `-0.01em` | 卡片標題、Section 標題 |
| `h4` | `16px` (1rem) | `400` (Regular) | `1.45` | `-0.005em` | 子標題 |
| `h5` | `14px` (0.875rem) | `500` (Medium) | `1.5` | `0` | 小標題、Table Header |
| `h6` | `12px` (0.75rem) | `500` (Medium) | `1.5` | `0.02em` | 微標題 |
| `body` | `14px` (0.875rem) | `400` (Regular) | `1.6` | `0` | 主要內文 |
| `body-sm` | `13px` (0.8125rem) | `400` (Regular) | `1.6` | `0` | 次要內文 |
| `caption` | `12px` (0.75rem) | `400` (Regular) | `1.5` | `0.01em` | 圖說、輔助說明 |
| `label` | `11px` (0.6875rem) | `500` (Medium) | `1.4` | `0.06em` | 表單標籤、Badge 文字（全大寫）|

### 2.2 排版原則
- **細體優先**：標題使用 Weight 300，讓文字輕盈不沉重
- **無 Bold**：避免使用 700+ weight，以 500 作為最強調的字重
- **字距微調**：大尺寸字使用負字距，小尺寸使用正字距，提升可讀性

---

## 3. 間距系統（4px Grid）

| Token | 值 | px 換算 | 使用情境 |
|-------|----|---------|---------|
| `space-0` | `0` | `0px` | 無間距 |
| `space-1` | `0.25rem` | `4px` | 最小間距、圖示與文字間距 |
| `space-2` | `0.5rem` | `8px` | 按鈕內 padding 小、Badge padding |
| `space-3` | `0.75rem` | `12px` | 按鈕內 padding、Input padding |
| `space-4` | `1rem` | `16px` | 基礎間距、卡片內 padding |
| `space-5` | `1.25rem` | `20px` | 元件間距 |
| `space-6` | `1.5rem` | `24px` | 區塊間距 |
| `space-8` | `2rem` | `32px` | 大區塊間距、Section spacing |
| `space-10` | `2.5rem` | `40px` | 頁面 Section 分隔 |
| `space-12` | `3rem` | `48px` | 大標題上方空間 |
| `space-16` | `4rem` | `64px` | 頁面 Hero 區塊 |
| `space-20` | `5rem` | `80px` | 超大留白 |

---

## 4. 陰影系統（自然光影）

MUJI 風格的陰影模擬柔和的自然漫射光，避免強烈的人工感陰影。

| Token | CSS 值 | 用途 |
|-------|--------|------|
| `shadow-xs` | `0 1px 2px rgba(60, 60, 60, 0.04)` | 最細微提升感（Input focus ring 外） |
| `shadow-sm` | `0 1px 3px rgba(60, 60, 60, 0.06), 0 1px 2px rgba(60, 60, 60, 0.04)` | 卡片靜止狀態 |
| `shadow-md` | `0 4px 6px rgba(60, 60, 60, 0.05), 0 2px 4px rgba(60, 60, 60, 0.04)` | 卡片 Hover、Dropdown |
| `shadow-lg` | `0 10px 15px rgba(60, 60, 60, 0.06), 0 4px 6px rgba(60, 60, 60, 0.04)` | Modal、Sidebar 分離陰影 |
| `shadow-inner` | `inset 0 1px 3px rgba(60, 60, 60, 0.06)` | Input 內凹感 |

**原則**：陰影使用 `muji-charcoal (#3C3C3C)` 而非純黑，讓陰影帶有溫度。

---

## 5. 元件 Tailwind CSS 樣式

### 5.1 Button

#### Primary Button
```html
<button class="inline-flex items-center gap-2 px-5 py-2.5 
               bg-[#3C3C3C] text-[#F5F0EB] 
               text-sm font-medium tracking-wide
               rounded-sm border border-[#3C3C3C]
               transition-all duration-200 ease-in-out
               hover:bg-[#2C2C2C] hover:border-[#2C2C2C]
               active:scale-[0.98]
               focus:outline-none focus:ring-2 focus:ring-[#3C3C3C] focus:ring-offset-2 focus:ring-offset-[#F5F0EB]
               disabled:opacity-40 disabled:cursor-not-allowed">
  <i class="fa-regular fa-circle-check text-xs"></i>
  確認
</button>
```

#### Secondary Button
```html
<button class="inline-flex items-center gap-2 px-5 py-2.5 
               bg-transparent text-[#3C3C3C] 
               text-sm font-medium tracking-wide
               rounded-sm border border-[#D8D2CA]
               transition-all duration-200 ease-in-out
               hover:bg-[#EDE8E1] hover:border-[#B8B0A8]
               active:scale-[0.98]
               focus:outline-none focus:ring-2 focus:ring-[#3C3C3C] focus:ring-offset-2
               disabled:opacity-40 disabled:cursor-not-allowed">
  取消
</button>
```

#### Danger Button（謹慎使用）
```html
<button class="inline-flex items-center gap-2 px-5 py-2.5 
               bg-[#C53D43] text-white 
               text-sm font-medium tracking-wide
               rounded-sm border border-[#C53D43]
               transition-all duration-200 ease-in-out
               hover:bg-[#A8353A] hover:border-[#A8353A]
               active:scale-[0.98]
               focus:outline-none focus:ring-2 focus:ring-[#C53D43] focus:ring-offset-2
               disabled:opacity-40 disabled:cursor-not-allowed">
  <i class="fa-regular fa-trash-can text-xs"></i>
  刪除
</button>
```

#### Ghost Button
```html
<button class="inline-flex items-center gap-2 px-5 py-2.5 
               bg-transparent text-[#7A7A7A] 
               text-sm font-medium tracking-wide
               rounded-sm border border-transparent
               transition-all duration-200 ease-in-out
               hover:text-[#3C3C3C] hover:bg-[#EDE8E1]
               active:scale-[0.98]
               focus:outline-none focus:ring-2 focus:ring-[#D8D2CA] focus:ring-offset-2
               disabled:opacity-40 disabled:cursor-not-allowed">
  更多
</button>
```

---

### 5.2 Card / Stat Card

#### 基礎 Card
```html
<div class="bg-white rounded-sm border border-[#D8D2CA] 
            shadow-[0_1px_3px_rgba(60,60,60,0.06)]
            p-6 transition-shadow duration-200
            hover:shadow-[0_4px_6px_rgba(60,60,60,0.05)]">
  <h3 class="text-[#2C2C2C] text-lg font-normal tracking-tight mb-1">標題</h3>
  <p class="text-[#7A7A7A] text-sm leading-relaxed">說明內容</p>
</div>
```

#### Stat Card（數據卡片）
```html
<div class="bg-white rounded-sm border border-[#D8D2CA]
            shadow-[0_1px_3px_rgba(60,60,60,0.06)]
            p-6">
  <!-- 頂部：標籤 + 圖示 -->
  <div class="flex items-center justify-between mb-4">
    <span class="text-[11px] font-medium tracking-widest uppercase text-[#7A7A7A]">
      總案件數
    </span>
    <i class="fa-regular fa-folder-open text-[#B8B0A8] text-base"></i>
  </div>
  <!-- 主要數值 -->
  <div class="text-[28px] font-light text-[#2C2C2C] tracking-tight leading-none mb-2">
    1,248
  </div>
  <!-- 趨勢指示 -->
  <div class="flex items-center gap-1.5 text-xs text-[#5A8A6A]">
    <i class="fa-regular fa-arrow-trend-up text-xs"></i>
    <span>較上月 +12.4%</span>
  </div>
</div>
```

---

### 5.3 Table（細微水平分隔線）

```html
<div class="w-full overflow-hidden rounded-sm border border-[#D8D2CA]">
  <table class="w-full text-sm">
    <!-- Header -->
    <thead>
      <tr class="bg-[#F5F0EB] border-b border-[#D8D2CA]">
        <th class="px-4 py-3 text-left text-[11px] font-medium tracking-widest uppercase text-[#7A7A7A]">
          案件編號
        </th>
        <th class="px-4 py-3 text-left text-[11px] font-medium tracking-widest uppercase text-[#7A7A7A]">
          狀態
        </th>
        <th class="px-4 py-3 text-right text-[11px] font-medium tracking-widest uppercase text-[#7A7A7A]">
          操作
        </th>
      </tr>
    </thead>
    <!-- Body -->
    <tbody class="bg-white divide-y divide-[#D8D2CA]">
      <tr class="transition-colors duration-150 hover:bg-[#F5F0EB]">
        <td class="px-4 py-3.5 text-[#2C2C2C] font-normal">LISA-2024-001</td>
        <td class="px-4 py-3.5">
          <!-- Badge 嵌入此處 -->
          <span class="badge-success">進行中</span>
        </td>
        <td class="px-4 py-3.5 text-right">
          <button class="ghost-btn text-xs">查看</button>
        </td>
      </tr>
      <!-- 交替行（可選）：奇數行 bg-white，偶數行 bg-[#F5F0EB]/30 -->
    </tbody>
  </table>
</div>
```

---

### 5.4 Form Input

#### Text Input
```html
<div class="flex flex-col gap-1.5">
  <label class="text-[11px] font-medium tracking-widest uppercase text-[#7A7A7A]">
    案件名稱
  </label>
  <input 
    type="text"
    placeholder="請輸入..."
    class="w-full px-3 py-2.5 
           bg-white text-[#2C2C2C] text-sm
           border border-[#D8D2CA] rounded-sm
           placeholder:text-[#B8B0A8]
           shadow-[inset_0_1px_3px_rgba(60,60,60,0.06)]
           transition-all duration-200
           focus:outline-none focus:border-[#3C3C3C] focus:ring-1 focus:ring-[#3C3C3C]
           hover:border-[#B8B0A8]
           disabled:bg-[#F5F0EB] disabled:text-[#B8B0A8] disabled:cursor-not-allowed"
  />
  <span class="text-[12px] text-[#7A7A7A]">輔助說明文字</span>
</div>
```

#### Select Input
```html
<div class="flex flex-col gap-1.5">
  <label class="text-[11px] font-medium tracking-widest uppercase text-[#7A7A7A]">
    分類
  </label>
  <div class="relative">
    <select 
      class="w-full px-3 py-2.5 pr-9
             bg-white text-[#2C2C2C] text-sm
             border border-[#D8D2CA] rounded-sm
             appearance-none cursor-pointer
             shadow-[inset_0_1px_3px_rgba(60,60,60,0.06)]
             transition-all duration-200
             focus:outline-none focus:border-[#3C3C3C] focus:ring-1 focus:ring-[#3C3C3C]
             hover:border-[#B8B0A8]">
      <option value="">請選擇...</option>
      <option value="A">選項 A</option>
    </select>
    <i class="fa-regular fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 
              text-xs text-[#B8B0A8] pointer-events-none"></i>
  </div>
</div>
```

---

### 5.5 Badge / Tag（狀態標籤）

```html
<!-- 成功 / 正常 -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 
             rounded-sm text-[11px] font-medium tracking-wide
             bg-[#EDF3EF] text-[#5A8A6A] border border-[#5A8A6A]/20">
  <i class="fa-solid fa-circle text-[6px]"></i>
  正常
</span>

<!-- 警告 -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 
             rounded-sm text-[11px] font-medium tracking-wide
             bg-[#FBF6E9] text-[#B8860B] border border-[#B8860B]/20">
  <i class="fa-solid fa-circle text-[6px]"></i>
  待確認
</span>

<!-- 資訊 -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 
             rounded-sm text-[11px] font-medium tracking-wide
             bg-[#EBF0F8] text-[#4A6FA5] border border-[#4A6FA5]/20">
  <i class="fa-solid fa-circle text-[6px]"></i>
  審核中
</span>

<!-- 停用 / 關閉 -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 
             rounded-sm text-[11px] font-medium tracking-wide
             bg-[#F5F0EB] text-[#7A7A7A] border border-[#D8D2CA]">
  <i class="fa-solid fa-circle text-[6px]"></i>
  已關閉
</span>

<!-- Critical（嚴格限制使用） -->
<span class="inline-flex items-center gap-1 px-2.5 py-0.5 
             rounded-sm text-[11px] font-medium tracking-wide
             bg-[#FDF1F1] text-[#C53D43] border border-[#C53D43]/20">
  <i class="fa-regular fa-triangle-exclamation text-[10px]"></i>
  緊急
</span>
```

---

### 5.6 Modal / Dialog

```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-[#2C2C2C]/40 backdrop-blur-[2px] z-50
            flex items-center justify-center p-4
            animate-[fadeIn_0.15s_ease-out]">
  
  <!-- Dialog -->
  <div class="w-full max-w-md bg-white rounded-sm border border-[#D8D2CA]
              shadow-[0_20px_40px_rgba(60,60,60,0.12)]
              animate-[slideUp_0.2s_ease-out]">
    
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-[#D8D2CA]">
      <h3 class="text-base font-normal text-[#2C2C2C] tracking-tight">對話框標題</h3>
      <button class="text-[#B8B0A8] hover:text-[#3C3C3C] transition-colors duration-150 p-1">
        <i class="fa-regular fa-xmark text-base"></i>
      </button>
    </div>
    
    <!-- Body -->
    <div class="px-6 py-5">
      <p class="text-sm text-[#7A7A7A] leading-relaxed">
        說明內容放置於此。保持簡潔，每個對話框只傳達一個核心訊息。
      </p>
    </div>
    
    <!-- Footer -->
    <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#D8D2CA]">
      <!-- Secondary -->
      <button class="px-4 py-2 text-sm text-[#3C3C3C] border border-[#D8D2CA] rounded-sm
                     hover:bg-[#EDE8E1] transition-colors duration-150">
        取消
      </button>
      <!-- Primary -->
      <button class="px-4 py-2 text-sm text-[#F5F0EB] bg-[#3C3C3C] rounded-sm
                     hover:bg-[#2C2C2C] transition-colors duration-150">
        確認
      </button>
    </div>
  </div>
</div>
```

---

### 5.7 Alert

#### 一般 Alert（Info / Warning / Success）
```html
<!-- Info Alert -->
<div class="flex items-start gap-3 p-4 rounded-sm
            bg-[#EBF0F8] border border-[#4A6FA5]/20">
  <i class="fa-regular fa-circle-info text-[#4A6FA5] mt-0.5 flex-shrink-0"></i>
  <div>
    <p class="text-sm font-medium text-[#4A6FA5] mb-0.5">資訊提示</p>
    <p class="text-sm text-[#4A6FA5]/80 leading-relaxed">這是一條一般性的資訊提示。</p>
  </div>
  <button class="ml-auto text-[#4A6FA5]/50 hover:text-[#4A6FA5] flex-shrink-0">
    <i class="fa-regular fa-xmark text-sm"></i>
  </button>
</div>

<!-- Success Alert -->
<div class="flex items-start gap-3 p-4 rounded-sm
            bg-[#EDF3EF] border border-[#5A8A6A]/20">
  <i class="fa-regular fa-circle-check text-[#5A8A6A] mt-0.5 flex-shrink-0"></i>
  <div>
    <p class="text-sm font-medium text-[#5A8A6A] mb-0.5">操作成功</p>
    <p class="text-sm text-[#5A8A6A]/80 leading-relaxed">您的操作已成功完成。</p>
  </div>
</div>

<!-- Warning Alert -->
<div class="flex items-start gap-3 p-4 rounded-sm
            bg-[#FBF6E9] border border-[#B8860B]/20">
  <i class="fa-regular fa-triangle-exclamation text-[#B8860B] mt-0.5 flex-shrink-0"></i>
  <div>
    <p class="text-sm font-medium text-[#B8860B] mb-0.5">請注意</p>
    <p class="text-sm text-[#B8860B]/80 leading-relaxed">此操作需要您的特別注意。</p>
  </div>
</div>
```

#### Critical Alert（MUJI Red — 嚴格限制）
```html
<!-- Critical Alert：全頁面最多出現 1 個 -->
<div class="flex items-start gap-3 p-4 rounded-sm
            bg-[#FDF1F1] border border-[#C53D43]/30
            shadow-[0_0_0_3px_rgba(197,61,67,0.08)]">
  <i class="fa-regular fa-circle-exclamation text-[#C53D43] mt-0.5 flex-shrink-0 text-base"></i>
  <div>
    <p class="text-sm font-medium text-[#C53D43] mb-0.5 tracking-wide">緊急警報</p>
    <p class="text-sm text-[#C53D43]/80 leading-relaxed">
      系統偵測到異常狀況，請立即確認並採取行動。
    </p>
    <div class="mt-3 flex items-center gap-2">
      <button class="px-3 py-1.5 text-xs font-medium text-white bg-[#C53D43] rounded-sm
                     hover:bg-[#A8353A] transition-colors duration-150">
        立即處理
      </button>
      <button class="px-3 py-1.5 text-xs font-medium text-[#C53D43] border border-[#C53D43]/30 rounded-sm
                     hover:bg-[#C53D43]/5 transition-colors duration-150">
        稍後提醒
      </button>
    </div>
  </div>
  <button class="ml-auto text-[#C53D43]/40 hover:text-[#C53D43] flex-shrink-0">
    <i class="fa-regular fa-xmark text-sm"></i>
  </button>
</div>
```

---

### 5.8 Sidebar Navigation

```html
<aside class="fixed left-0 top-0 h-full w-60 
              bg-[#F5F0EB] border-r border-[#D8D2CA]
              flex flex-col
              shadow-[1px_0_8px_rgba(60,60,60,0.04)]">
  
  <!-- Logo / Brand -->
  <div class="px-6 py-5 border-b border-[#D8D2CA]">
    <span class="text-base font-light text-[#2C2C2C] tracking-[0.15em] uppercase">LISA</span>
    <p class="text-[11px] text-[#7A7A7A] tracking-wide mt-0.5">法律智能系統</p>
  </div>
  
  <!-- Navigation -->
  <nav class="flex-1 px-3 py-4 overflow-y-auto">
    
    <!-- Nav Section Label -->
    <div class="px-3 mb-2">
      <span class="text-[10px] font-medium tracking-[0.12em] uppercase text-[#B8B0A8]">主功能</span>
    </div>
    
    <!-- Nav Item: Active -->
    <a href="#" class="flex items-center gap-3 px-3 py-2.5 mb-0.5
                       text-sm text-[#2C2C2C] font-medium
                       bg-[#EDE8E1] rounded-sm border-l-2 border-[#3C3C3C]
                       transition-all duration-150">
      <i class="fa-regular fa-grid-2 text-sm text-[#3C3C3C] w-4 text-center"></i>
      總覽
    </a>
    
    <!-- Nav Item: Default -->
    <a href="#" class="flex items-center gap-3 px-3 py-2.5 mb-0.5
                       text-sm text-[#7A7A7A]
                       hover:text-[#2C2C2C] hover:bg-[#EDE8E1]/60
                       rounded-sm border-l-2 border-transparent
                       transition-all duration-150">
      <i class="fa-regular fa-folder-open text-sm w-4 text-center"></i>
      案件管理
    </a>
    
    <a href="#" class="flex items-center gap-3 px-3 py-2.5 mb-0.5
                       text-sm text-[#7A7A7A]
                       hover:text-[#2C2C2C] hover:bg-[#EDE8E1]/60
                       rounded-sm border-l-2 border-transparent
                       transition-all duration-150">
      <i class="fa-regular fa-calendar-days text-sm w-4 text-center"></i>
      排程
    </a>
    
    <a href="#" class="flex items-center gap-3 px-3 py-2.5 mb-0.5
                       text-sm text-[#7A7A7A]
                       hover:text-[#2C2C2C] hover:bg-[#EDE8E1]/60
                       rounded-sm border-l-2 border-transparent
                       transition-all duration-150">
      <i class="fa-regular fa-file-lines text-sm w-4 text-center"></i>
      文件庫
    </a>
    
    <!-- Section Divider -->
    <div class="my-3 border-t border-[#D8D2CA]"></div>
    <div class="px-3 mb-2">
      <span class="text-[10px] font-medium tracking-[0.12em] uppercase text-[#B8B0A8]">系統</span>
    </div>
    
    <a href="#" class="flex items-center gap-3 px-3 py-2.5 mb-0.5
                       text-sm text-[#7A7A7A]
                       hover:text-[#2C2C2C] hover:bg-[#EDE8E1]/60
                       rounded-sm border-l-2 border-transparent
                       transition-all duration-150">
      <i class="fa-regular fa-gear text-sm w-4 text-center"></i>
      設定
    </a>
  </nav>
  
  <!-- User Profile（底部） -->
  <div class="px-4 py-4 border-t border-[#D8D2CA]">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-sm bg-[#EDE8E1] flex items-center justify-center">
        <i class="fa-regular fa-user text-xs text-[#7A7A7A]"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-xs font-medium text-[#2C2C2C] truncate">使用者名稱</p>
        <p class="text-[11px] text-[#7A7A7A] truncate">user@lisa.com</p>
      </div>
      <button class="text-[#B8B0A8] hover:text-[#3C3C3C] transition-colors p-1">
        <i class="fa-regular fa-arrow-right-from-bracket text-xs"></i>
      </button>
    </div>
  </div>
</aside>
```

---

### 5.9 Header

```html
<header class="h-14 bg-white border-b border-[#D8D2CA]
               flex items-center px-6 gap-4
               shadow-[0_1px_3px_rgba(60,60,60,0.04)]
               sticky top-0 z-40">
  
  <!-- 頁面標題 -->
  <div class="flex-1">
    <h1 class="text-lg font-light text-[#2C2C2C] tracking-tight">案件管理</h1>
    <!-- Breadcrumb（可選） -->
    <div class="flex items-center gap-1.5 text-[11px] text-[#7A7A7A]">
      <span>首頁</span>
      <i class="fa-regular fa-chevron-right text-[9px]"></i>
      <span class="text-[#3C3C3C]">案件管理</span>
    </div>
  </div>
  
  <!-- 右側操作區 -->
  <div class="flex items-center gap-2">
    
    <!-- 搜尋 -->
    <div class="relative">
      <i class="fa-regular fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 
                text-xs text-[#B8B0A8]"></i>
      <input 
        type="text" 
        placeholder="搜尋..."
        class="w-52 pl-8 pr-3 py-1.5 text-sm
               bg-[#F5F0EB] text-[#2C2C2C]
               border border-transparent rounded-sm
               placeholder:text-[#B8B0A8]
               focus:outline-none focus:border-[#D8D2CA] focus:bg-white
               transition-all duration-200"
      />
    </div>
    
    <!-- 通知 -->
    <button class="relative w-9 h-9 flex items-center justify-center
                   text-[#7A7A7A] hover:text-[#2C2C2C]
                   hover:bg-[#F5F0EB] rounded-sm
                   transition-all duration-150">
      <i class="fa-regular fa-bell text-sm"></i>
      <!-- Badge -->
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C53D43] rounded-full"></span>
    </button>
    
    <!-- 頭像 -->
    <button class="w-8 h-8 rounded-sm bg-[#EDE8E1] 
                   flex items-center justify-center
                   hover:bg-[#D8D2CA] transition-colors duration-150">
      <i class="fa-regular fa-user text-xs text-[#7A7A7A]"></i>
    </button>
  </div>
</header>
```

---

## 6. FontAwesome 圖示建議（細線條 `fa-regular`）

**重要**：全系統優先使用 `fa-regular`（細線條），避免使用 `fa-solid`（除了 Badge 內的小圓點）。

### 6.1 導航圖示

| 功能 | FontAwesome Class | 說明 |
|------|------------------|------|
| 總覽 / Dashboard | `fa-regular fa-grid-2` | 四方格排列 |
| 案件管理 | `fa-regular fa-folder-open` | 開啟的資料夾 |
| 文件 / 檔案 | `fa-regular fa-file-lines` | 有文字的文件 |
| 日曆 / 排程 | `fa-regular fa-calendar-days` | 日曆帶日期 |
| 報告 | `fa-regular fa-chart-line` | 折線圖 |
| 聯絡人 | `fa-regular fa-address-book` | 通訊錄 |
| 設定 | `fa-regular fa-gear` | 齒輪 |
| 首頁 | `fa-regular fa-house` | 房子 |
| 回到上一頁 | `fa-regular fa-arrow-left` | 左箭頭 |

### 6.2 操作圖示

| 功能 | FontAwesome Class | 說明 |
|------|------------------|------|
| 新增 / 建立 | `fa-regular fa-plus` | 加號 |
| 編輯 | `fa-regular fa-pen-to-square` | 筆 + 方塊 |
| 刪除 | `fa-regular fa-trash-can` | 垃圾桶（謹慎使用）|
| 儲存 | `fa-regular fa-floppy-disk` | 磁碟 |
| 搜尋 | `fa-regular fa-magnifying-glass` | 放大鏡 |
| 篩選 | `fa-regular fa-filter` | 漏斗 |
| 排序 | `fa-regular fa-arrow-up-arrow-down` | 雙向箭頭 |
| 下載 | `fa-regular fa-download` | 下載箭頭 |
| 上傳 | `fa-regular fa-upload` | 上傳箭頭 |
| 分享 / 匯出 | `fa-regular fa-arrow-up-from-bracket` | 匯出箭頭 |
| 複製 | `fa-regular fa-copy` | 兩個方塊 |
| 關閉 / 取消 | `fa-regular fa-xmark` | X 號 |
| 確認 | `fa-regular fa-check` | 勾號 |
| 更多選項 | `fa-regular fa-ellipsis` | 水平三點 |
| 展開 / 收合 | `fa-regular fa-chevron-down` / `fa-chevron-up` | 角括號 |
| 通知 | `fa-regular fa-bell` | 鈴鐺 |
| 登出 | `fa-regular fa-arrow-right-from-bracket` | 登出 |

### 6.3 狀態圖示

| 狀態 | FontAwesome Class | 顏色 |
|------|------------------|------|
| 成功 / 完成 | `fa-regular fa-circle-check` | `#5A8A6A` |
| 錯誤 / 失敗 | `fa-regular fa-circle-xmark` | `#C53D43` |
| 警告 | `fa-regular fa-triangle-exclamation` | `#B8860B` |
| 資訊 | `fa-regular fa-circle-info` | `#4A6FA5` |
| 載入中 | `fa-regular fa-spinner fa-spin` | `#B8B0A8` |
| 待處理 | `fa-regular fa-clock` | `#B8860B` |
| 封存 | `fa-regular fa-box-archive` | `#B8B0A8` |
| 鎖定 | `fa-regular fa-lock` | `#7A7A7A` |
| 使用者 | `fa-regular fa-user` | `#7A7A7A` |
| 趨勢上升 | `fa-regular fa-arrow-trend-up` | `#5A8A6A` |
| 趨勢下降 | `fa-regular fa-arrow-trend-down` | `#C53D43` |

---

## 7. Tailwind Config 擴展建議

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{html,js,vue,tsx}'],
  theme: {
    extend: {
      
      // ── 色彩系統 ──────────────────────────────────────
      colors: {
        muji: {
          white:        '#F5F0EB',
          cream:        '#EDE8E1',
          charcoal:     '#3C3C3C',
          linen:        '#B8B0A8',
          border:       '#D8D2CA',
          text:         '#2C2C2C',
          'text-light': '#7A7A7A',
          red:          '#C53D43',
        },
        // 功能色
        success: {
          DEFAULT: '#5A8A6A',
          bg:      '#EDF3EF',
        },
        warning: {
          DEFAULT: '#B8860B',
          bg:      '#FBF6E9',
        },
        info: {
          DEFAULT: '#4A6FA5',
          bg:      '#EBF0F8',
        },
      },
      
      // ── 字體 ──────────────────────────────────────────
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }], // 11px label
        xs:    ['0.75rem',   { lineHeight: '1.5', letterSpacing: '0.01em' }], // 12px caption
        sm:    ['0.875rem',  { lineHeight: '1.6', letterSpacing: '0' }],      // 14px body
        base:  ['1rem',      { lineHeight: '1.45', letterSpacing: '-0.005em' }], // 16px h4
        lg:    ['1.125rem',  { lineHeight: '1.4', letterSpacing: '-0.01em' }],   // 18px h3
        xl:    ['1.375rem',  { lineHeight: '1.35', letterSpacing: '-0.015em' }], // 22px h2
        '2xl': ['1.75rem',   { lineHeight: '1.3', letterSpacing: '-0.02em' }],   // 28px h1
      },
      
      fontWeight: {
        light:   '300',
        normal:  '400',
        medium:  '500',
      },
      
      // ── 間距（4px Grid）──────────────────────────────
      spacing: {
        // 已有標準 Tailwind spacing，此處補充命名別名
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
        '13':  '3.25rem',   // 52px
        '15':  '3.75rem',   // 60px
        '18':  '4.5rem',    // 72px
      },
      
      // ── 邊框圓角（極小，保持方正感）──────────────────
      borderRadius: {
        sm:   '2px',  // 主要用 rounded-sm
        DEFAULT: '3px',
        md:   '4px',
      },
      
      // ── 陰影系統 ──────────────────────────────────────
      boxShadow: {
        xs:    '0 1px 2px rgba(60, 60, 60, 0.04)',
        sm:    '0 1px 3px rgba(60, 60, 60, 0.06), 0 1px 2px rgba(60, 60, 60, 0.04)',
        DEFAULT: '0 4px 6px rgba(60, 60, 60, 0.05), 0 2px 4px rgba(60, 60, 60, 0.04)',
        md:    '0 4px 6px rgba(60, 60, 60, 0.05), 0 2px 4px rgba(60, 60, 60, 0.04)',
        lg:    '0 10px 15px rgba(60, 60, 60, 0.06), 0 4px 6px rgba(60, 60, 60, 0.04)',
        inner: 'inset 0 1px 3px rgba(60, 60, 60, 0.06)',
        none:  'none',
      },
      
      // ── 過渡動畫 ──────────────────────────────────────
      transitionDuration: {
        DEFAULT: '150ms',
        200: '200ms',
      },
      
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // ── Keyframes（Modal 進場動畫）────────────────────
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      
      animation: {
        'fade-in':   'fadeIn 0.15s ease-out',
        'slide-up':  'slideUp 0.2s ease-out',
        'slide-down':'slideDown 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
```

---

## 8. 全域 CSS 基礎樣式

```css
/* globals.css */

/* ── 全域重置與基礎設定 ────────────────────────── */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: #2C2C2C;
  background-color: #F5F0EB;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Scrollbar（細緻風格）────────────────────────── */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #D8D2CA;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #B8B0A8;
}

/* ── 選取色 ────────────────────────────────────── */
::selection {
  background-color: #3C3C3C;
  color: #F5F0EB;
}

/* ── Focus Ring 全域設定 ───────────────────────── */
:focus-visible {
  outline: 2px solid #3C3C3C;
  outline-offset: 2px;
}
```

---

## 9. 設計規範補充

### 9.1 間距使用原則
- **頁面 padding**：`px-8 py-6`（桌面）/ `px-4 py-4`（手機）
- **卡片內 padding**：`p-6`（大）/ `p-4`（小）
- **元件間距**：`gap-4`（同組）/ `gap-6`（不同群組）

### 9.2 動態行為原則
- **Hover**：背景微變（cream），無強烈視覺突變
- **Active/Click**：`scale-[0.98]` 輕微縮放，提供觸覺回饋
- **Transition**：150ms–200ms，`ease-in-out`，不超過 300ms
- **Loading**：使用 `fa-spinner fa-spin`，顏色 muji-linen

### 9.3 響應式斷點
```
sm:  640px  — 小螢幕調整
md:  768px  — 平板，Sidebar 切換為抽屜
lg:  1024px — 桌面，完整 Sidebar 顯示
xl:  1280px — 寬螢幕，最大內容寬度 1200px
```

### 9.4 圖片與媒體
- 使用 `rounded-sm`（2px）或 `rounded-none`，避免大圓角
- 圖片容器加 `overflow-hidden` 確保圓角生效
- Avatar 使用 `rounded-sm`，非圓形

### 9.5 禁止事項
- ❌ 不使用漸層（gradient）
- ❌ 不使用強烈陰影（box-shadow blur > 20px）
- ❌ 不使用大圓角（rounded-lg 以上）
- ❌ 不使用鮮豔色彩（除功能色外）
- ❌ muji-red 不作裝飾用途
- ❌ 不在同一頁面放置超過 1 個 Critical Alert

---

*LISA UI Design System v1.0 — Aria (UI Designer)*
*設計靈感：無印良品的「空白之美」—— 留白本身就是設計。*
