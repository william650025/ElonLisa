# LISA 專案安全性審計報告

**審計者：** Kurt（Security Auditor）  
**審計日期：** 2026-03-16  
**專案版本：** MVP Demo v1.0  
**專案路徑：** `/Users/clawder/MyClawProjects/LISA/`  
**技術棧：** Vue 3 + TypeScript + Vite + Tailwind CSS + Pinia + Vue Router  

---

## 執行摘要

LISA 是一個純前端 MVP Demo，用於展示實驗室資訊系統（LIS）的功能流程。由於目前為 Demo 階段（無真實後端、無資料庫），整體風險可控，但有數項問題若未在正式化前修正，將於生產環境中造成嚴重安全漏洞。

**風險概覽：**

| 等級 | 數量 |
|------|------|
| 🔴 Critical | 1 |
| 🟠 High | 2 |
| 🟡 Medium | 3 |
| 🔵 Low | 2 |
| ℹ️ Info | 3 |

---

## 詳細發現

---

### 🔴 CRITICAL-001：路由守衛完全缺失（未授權存取）

**檔案：** `src/router/index.ts`、`src/router/admin.routes.ts`、`src/router/tech.routes.ts`、`src/router/client.routes.ts`

**描述：**  
路由中雖然定義了 `meta: { role: 'admin' | 'technologist' | 'client' }`，但整個應用完全沒有實作 `router.beforeEach()` 導航守衛。這意味著：

- 任何未選擇角色的使用者可以直接在網址列輸入 `/admin/orders`、`/tech/worklist` 等路徑，無需任何驗證即可進入
- 一個選擇「client」角色的使用者，可以直接存取 `/admin` 或 `/tech` 的所有頁面
- 角色隔離完全依賴 UI 按鈕，而非程式邏輯

**重現步驟：**
1. 開啟應用
2. 不選擇任何角色，直接在網址列輸入 `http://localhost:5173/admin/orders`
3. 即可直接進入管理頁面

**建議修復：**

在 `src/router/index.ts` 加入全域導航守衛：

```typescript
import { useAuthStore } from '@/stores/auth'

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiredRole = to.meta.role as string | undefined

  // 未登入且存取需要角色的頁面 → 導回首頁
  if (requiredRole && !authStore.isAuthenticated) {
    return next({ name: 'RoleSelector' })
  }

  // 角色不符 → 導回自己的首頁
  if (requiredRole && authStore.currentRole !== requiredRole) {
    return next({ name: 'RoleSelector' })
  }

  next()
})
```

---

### 🟠 HIGH-001：Mock Data 包含結構性真實 PII 格式（台灣身分證字號）

**檔案：** `src/mock/data/patients.ts`、`src/mock/services/patient.service.ts`

**描述：**  
Mock 病患資料包含符合真實格式的敏感個人識別資訊：

- **身分證字號**（nationalId）：`A123456789`、`B234567890`... 格式完全符合台灣身分證規則
- **真實格式手機號碼**：`0912-345-678`、`0923-456-789`
- **真實格式地址**：台北市大安區忠孝東路四段100號
- **真實格式姓名**：雖為虛構，但符合真實中文姓名格式

雖然目前為 Demo 資料，但：
1. 這些資料會被打包進 JavaScript bundle 中，任何使用者可透過瀏覽器開發者工具或 `npm run build` 的輸出文件直接讀取
2. 若未來誤將真實資料填入 mock，或在測試環境中使用真實資料，將造成 PII 洩露
3. 在 Demo 展示過程中，若截圖或螢幕分享，可能被誤認為真實病患資料

**建議修復：**

1. 身分證字號使用明顯的假資料格式，例如 `MOCK-001`、`TEST-002`，或用 `X` 前置字母（非有效身分證格式）
2. 手機號碼使用測試專用號碼段（如 `0900-000-001`）
3. 在 mock 資料頂部加入清晰的免責聲明：

```typescript
/**
 * ⚠️ MOCK DATA - 純供 Demo 展示使用
 * 所有資料均為虛構，不代表任何真實個人
 * 正式環境絕對不得使用此資料
 */
```

---

### 🟠 HIGH-002：角色驗證邏輯儲存於可篡改的 localStorage

**檔案：** `src/stores/auth.ts`

**描述：**  
當前實作將角色資訊直接儲存於 `localStorage`：

```typescript
localStorage.setItem('lisa-role', role)
```

並在應用啟動時直接從 localStorage 還原：

```typescript
const currentRole = ref<UserRole | null>(
  (localStorage.getItem('lisa-role') as UserRole) || null
)
```

這意味著：
- 使用者可在瀏覽器 Console 輸入 `localStorage.setItem('lisa-role', 'admin')` 後重新整理，即可獲得 admin 角色
- 完全沒有 server-side 驗證或 token 機制

**建議（正式化時必須解決）：**
1. 採用 JWT + HTTPS + HttpOnly Cookie 作為驗證機制
2. 所有角色/權限驗證必須在後端進行，前端只作 UI 顯示層的判斷
3. 即使 localStorage 角色被篡改，後端 API 的鑑權中間件必須獨立驗證

---

### 🟡 MEDIUM-001：無 Content Security Policy（CSP）設定

**描述：**  
應用目前沒有設定 Content Security Policy。CSP 是防禦 XSS 攻擊的重要防線，能限制腳本來源、禁止 inline script 執行等。

雖然目前未發現 `v-html` 使用（Vue 3 預設會對輸出進行 HTML 編碼，XSS 風險低），但無 CSP 仍是安全最佳實踐的缺失。

**建議修復：**

在 `index.html` 加入 CSP Meta 標籤（開發環境參考）：

```html
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; 
           script-src 'self'; 
           style-src 'self' 'unsafe-inline'; 
           img-src 'self' data:; 
           font-src 'self';">
```

**注意：** 正式環境 CSP 應透過 HTTP Response Header 設定（由後端或 CDN/Nginx 配置），而非 meta 標籤。

---

### 🟡 MEDIUM-002：無輸入驗證與資料清理機制

**檔案：** `src/views/admin/OrderCreate.vue`、`src/components/base/BaseInput.vue`、`src/components/base/BaseSelect.vue`

**描述：**  
目前表單元件沒有統一的輸入驗證框架。雖然 Vue 3 預設對模板表達式進行 HTML 编碼，但缺乏：

- 前端表單驗證（如身分證格式驗證、電話格式驗證）
- 輸入長度限制
- 特殊字元過濾

在醫療系統中，不正確的輸入可能導致資料品質問題，並在對接後端時造成 SQL Injection 風險（若後端未正確處理）。

**建議修復：**
1. 引入 [VeeValidate](https://vee-validate.logaretm.com/) 或 [Zod](https://zod.dev/) 進行表單驗證
2. 為 `BaseInput` 加入 `maxlength` 屬性
3. 建立統一的驗證規則庫（`src/utils/validators.ts`）：

```typescript
export const validators = {
  nationalId: (v: string) => /^[A-Z][12]\d{8}$/.test(v) || '請輸入有效身分證字號',
  phone: (v: string) => /^09\d{2}-?\d{3}-?\d{3}$/.test(v) || '請輸入有效手機號碼',
  required: (v: string) => !!v.trim() || '此欄位為必填',
}
```

---

### 🟡 MEDIUM-003：Vite Build 未設定 Source Map 策略

**檔案：** `vite.config.ts`

**描述：**  
目前 `vite.config.ts` 未明確設定 `build.sourcemap`。Vite 預設在 Production Build 時不生成 source map（確認 `dist/assets/` 目錄中無 `.map` 檔案，這是正確行為）。

但此設定是隱性的，若未來修改 Vite 版本或配置，可能意外開啟 source map，將完整原始碼暴露給使用者。

**建議修復：**

明確在 `vite.config.ts` 中宣告：

```typescript
export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: false, // 正式環境絕對不開啟
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

---

### 🔵 LOW-001：缺少 `.gitignore` 對 `.env` 的保護

**描述：**  
目前專案沒有 `.env` 文件，但也沒有明確的 `.gitignore` 確認 `.env` 類檔案不會被誤提交。若未來加入 API Keys 或後端連線字串，可能誤提交至 Git repository。

**建議修復：**

確認 `.gitignore` 包含以下條目：

```
.env
.env.local
.env.*.local
.env.production
```

---

### 🔵 LOW-002：依賴版本使用 `^`（寬鬆鎖版）

**檔案：** `package.json`

**描述：**  
所有依賴均使用 `^` 版本前綴（允許自動升級 Minor 版本），包括生產依賴：

```json
"vue": "^3.5.30",
"pinia": "^3.0.4",
"vue-router": "^4.6.4"
```

雖然 `package-lock.json` 會鎖定實際安裝版本，但在 `npm install` 後若 lock 文件被刪除，可能安裝到含安全漏洞的新版本。

**建議修復：**
1. 定期執行 `npm audit` 並訂閱各依賴的安全公告
2. 在 CI/CD 中加入 `npm audit --audit-level=high` 檢查
3. 考慮將核心依賴固定版本（移除 `^`）或採用 `npm ci` 確保 lock 文件被使用

---

### ℹ️ INFO-001：npm audit 結果乾淨

**描述：**  
執行 `npm audit` 結果為 **0 vulnerabilities**，目前所有已知 CVE 依賴漏洞均不存在。

✅ **無需處理**，建議定期（每週/每月）重新執行以監控新發現的漏洞。

---

### ℹ️ INFO-002：未使用 `v-html`（XSS 風險低）

**描述：**  
全專案未發現任何 `v-html` 指令的使用，且無 `innerHTML` 直接操作。Vue 3 的模板系統預設對所有資料綁定進行 HTML 編碼，XSS 攻擊面極小。

✅ **無需處理**，繼續保持此最佳實踐。

---

### ℹ️ INFO-003：Console.log 已清理

**描述：**  
原始碼中未發現殘留的 `console.log`、`console.error`、`console.debug` 等除錯輸出，避免在生產環境洩露內部狀態資訊。

✅ **無需處理**，建議在 `vite.config.ts` 的 `build.terserOptions` 中加入自動移除 console 設定（可選）：

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true,
    },
  },
}
```

---

## 醫療系統特殊合規建議

### 台灣個資法（個人資料保護法）

正式系統上線前，必須落實以下措施：

| 要求 | 說明 | 優先級 |
|------|------|--------|
| 蒐集目的明確 | 向病患說明資料蒐集目的、使用方式、第三方分享對象 | 🔴 必要 |
| 最小化蒐集 | 僅蒐集業務必要的欄位，移除不必要的 `nationalId` 強制欄位 | 🔴 必要 |
| 資料存取日誌 | 所有病患資料的查詢、修改、刪除必須有稽核日誌 | 🟠 重要 |
| 資料保留期限 | 制定並實作資料自動銷毀政策 | 🟡 建議 |
| 資料外洩通報 | 建立資料外洩事件應變程序（72小時通報義務） | 🔴 必要 |

### HIPAA 技術保障措施（若服務美國市場）

| 控制項 | 技術實作 |
|--------|----------|
| 存取控制 | MFA（多因素驗證）+ RBAC（角色型存取控制） |
| 資料傳輸加密 | HTTPS/TLS 1.2+ |
| 靜態資料加密 | 資料庫加密（AES-256） |
| 自動登出 | Session timeout（建議 15 分鐘閒置） |
| 稽核控制 | 所有 PHI 存取的不可否認日誌 |

---

## 正式化轉型安全建議路線圖

### Phase 1：基礎安全強化（MVP Demo → Beta）

- [ ] **實作路由守衛**（Critical-001，修復時間：1 天）
- [ ] **替換 Mock PII 資料**（High-001，修復時間：半天）
- [ ] **明確關閉 source map**（Medium-003，修復時間：30 分鐘）
- [ ] **確認 .gitignore 設定**（Low-001，修復時間：10 分鐘）

### Phase 2：後端整合前（Beta → Production）

- [ ] 設計並實作 JWT 認證系統，廢棄 localStorage 角色儲存（High-002）
- [ ] 後端實作 RBAC 中間件，所有 API 端點進行 server-side 授權驗證
- [ ] 導入輸入驗證框架（Medium-002）
- [ ] 配置 Nginx/CDN 的 CSP、HSTS、X-Frame-Options 等安全標頭（Medium-001）
- [ ] 建立稽核日誌系統（PHI 存取記錄）

### Phase 3：合規準備（Production → Certified）

- [ ] 個資法合規審查（隱私聲明、同意書流程）
- [ ] 滲透測試（由第三方進行）
- [ ] 建立資安事件應變程序（CSIRT）
- [ ] 定期安全培訓

---

## 總結

| 項目 | 狀態 |
|------|------|
| npm 依賴漏洞 | ✅ 乾淨（0 vulnerabilities） |
| XSS 風險（v-html） | ✅ 無使用 |
| Build Source Map | ✅ 正式版未生成 |
| 環境變數管理 | ✅ 無機密資訊 |
| 路由權限守衛 | ❌ **完全缺失** |
| 角色驗證機制 | ❌ localStorage 可篡改 |
| Mock PII 資料 | ⚠️ 包含真實格式 PII |
| CSP 設定 | ⚠️ 未設定 |
| 輸入驗證 | ⚠️ 缺乏統一機制 |

**整體風險評估：** 🟡 中等風險（Demo 環境可接受，**正式化前必須解決 Critical 和 High 項目**）

---

*報告由 Kurt（Security Auditor）產出，審計基準日：2026-03-16*
