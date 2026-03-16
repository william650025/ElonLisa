# LISA 專案文案與內容規劃

## 1. LISA 品牌語調 (Tone of Voice)
- **核心原則**：簡潔、專業、信賴、以使用者為中心、禪意極簡。
- **態度**：
    - **專業 (Professional)**：用語精確，傳達醫療系統的嚴謹性。
    - **清晰 (Clear)**：避免歧義和冗餘，資訊直觀易懂。
    - **簡潔 (Concise)**：Muji 風格，去除不必要的裝飾性文字，直達核心。
    - **友善 (Approachable)**：儘管專業，但語氣溫和，讓使用者感到安心。
    - **信賴 (Trustworthy)**：透過精準的表達，建立系統的可靠性。
- **執行方式**：
    - 使用繁體中文，必要時保留國際通用或無合適譯名的英文專業術語。
    - 動詞直接明確，減少形容詞和副詞的使用。
    - 語氣保持一致，無論是提示、錯誤或成功訊息。
    - 尤其在空狀態時，提供溫和的引導，而非生硬的空白。

## 2. 三大角色介面 UI 文案規劃

### 2.1 行政人員介面 (Administrator Interface)

#### 導航 (Navigation)
- **首頁** (Home)
- **醫令管理** (Order Management)
- **檢驗項目** (Test Items)
- **病患管理** (Patient Management)
- **用戶管理** (User Management)
- **設定** (Settings)
- **登出** (Logout)

#### 按鈕 (Buttons)
- **新增醫令** (New Order)
- **編輯病患** (Edit Patient)
- **儲存** (Save)
- **取消** (Cancel)
- **查詢** (Search)
- **重設** (Reset)
- **送出** (Submit)
- **列印** (Print)
- **匯出** (Export)

#### 表頭 (Table Headers)
- **病患姓名** (Patient Name)
- **病患 ID** (Patient ID)
- **性別** (Gender)
- **出生日期** (Date of Birth)
- **聯絡電話** (Contact Phone)
- **醫令編號** (Order No.)
- **開單日期** (Order Date)
- **檢驗項目** (Test Item)
- **狀態** (Status)
- **操作** (Actions)

#### 標籤 (Labels)
- **姓名** (Name)
- **身分證字號** (ID Number)
- **地址** (Address)
- **電子郵件** (Email)
- **醫令名稱** (Order Name)
- **檢驗費** (Test Fee)

### 2.2 醫檢師介面 (Lab Technician Interface)

#### 導航 (Navigation)
- **我的工作** (My Work)
- **檢體處理** (Specimen Processing)
- **檢驗報告** (Test Reports)
- **儀器管理** (Instrument Management)
- **登出** (Logout)

#### 按鈕 (Buttons)
- **輸入結果** (Enter Results)
- **標記異常** (Mark Abnormal)
- **核發報告** (Issue Report)
- **儲存草稿** (Save Draft)
- **送審** (Submit for Review)
- **退回** (Reject)
- **查詢** (Search)
- **詳情** (Details)

#### 表頭 (Table Headers)
- **檢體編號** (Specimen ID)
- **病患姓名** (Patient Name)
- **檢驗項目** (Test Item)
- **結果** (Result)
- **參考範圍** (Reference Range)
- **單位** (Unit)
- **狀態** (Status)
- **報告日期** (Report Date)
- **檢驗人員** (Technician)
- **審核人員** (Reviewer)

#### 標籤 (Labels)
- **檢體類型** (Specimen Type)
- **採集日期** (Collection Date)
- **檢驗值** (Test Value)
- **異常標記** (Abnormal Flag)
- **備註** (Remarks)

### 2.3 客戶介面 (Client Interface)

#### 導航 (Navigation)
- **我的報告** (My Reports)
- **報告查詢** (Report Search)
- **歷史趨勢** (Historical Trends)
- **個人設定** (Profile Settings)
- **登出** (Logout)

#### 按鈕 (Buttons)
- **查看報告** (View Report)
- **下載報告** (Download Report)
- **查詢** (Search)
- **重設** (Reset)
- **返回** (Back)
- **更新設定** (Update Settings)

#### 表頭 (Table Headers)
- **報告日期** (Report Date)
- **檢驗項目** (Test Item)
- **狀態** (Status)
- **檢驗機構** (Laboratory)
- **操作** (Actions)

#### 標籤 (Labels)
- **報告編號** (Report No.)
- **檢驗類別** (Test Category)
- **開始日期** (Start Date)
- **結束日期** (End Date)

## 3. 系統提示訊息、確認對話框、空狀態文案

### 3.1 提示訊息 (System Messages)

- **成功訊息 (Success)**
    - "儲存成功。" (Saved successfully.)
    - "醫令已新增。" (Order added.)
    - "報告已核發。" (Report issued.)
    - "設定已更新。" (Settings updated.)
- **錯誤訊息 (Error)**
    - "資料儲存失敗，請重試。" (Data save failed, please try again.)
    - "輸入的資料無效，請檢查。" (Invalid input, please check.)
    - "網路連線中斷，請檢查您的網路。" (Network disconnected, please check your network.)
    - "您沒有權限執行此操作。" (You do not have permission to perform this action.)
- **警告訊息 (Warning)**
    - "部分資料未填寫，請確認是否繼續？" (Some fields are incomplete, confirm to proceed?)
    - "此操作不可逆，請謹慎操作。" (This operation is irreversible, please proceed with caution.)
- **資訊訊息 (Info)**
    - "資料正在載入中..." (Data loading...)
    - "請耐心等候，系統正在處理您的請求。" (Please wait, your request is being processed.)

### 3.2 確認對話框 (Confirmation Dialogues)

- **刪除確認**
    - **標題**: "確認刪除？" (Confirm Deletion?)
    - **內容**: "您確定要刪除此筆資料嗎？此操作無法復原。" (Are you sure you want to delete this record? This action cannot be undone.)
    - **按鈕**: "刪除" (Delete), "取消" (Cancel)
- **儲存前確認**
    - **標題**: "未儲存的變更" (Unsaved Changes)
    - **內容**: "您有未儲存的變更。要放棄變更並離開嗎？" (You have unsaved changes. Discard changes and leave?)
    - **按鈕**: "放棄" (Discard), "取消" (Cancel)
- **報告核發確認**
    - **標題**: "確認核發報告？" (Confirm Report Issuance?)
    - **內容**: "報告核發後將無法修改。請確認所有資訊皆正確無誤。" (Report cannot be modified after issuance. Please confirm all information is correct.)
    - **按鈕**: "核發" (Issue), "取消" (Cancel)

### 3.3 空狀態文案 (Empty State Copy)

- **通用 (General)**
    - "目前沒有資料。" (No data available.)
    - "尚無相關紀錄。" (No relevant records yet.)
- **列表類 (Lists)**
    - "沒有待處理的醫令。" (No pending orders.)
    - "沒有檢驗結果等待輸入。" (No test results awaiting entry.)
    - "沒有可顯示的報告。" (No reports to display.)
- **搜尋結果 (Search Results)**
    - "沒有找到符合您條件的資料。" (No data found matching your criteria.)
    - "請嘗試其他關鍵字或調整篩選條件。" (Please try other keywords or adjust filters.)
- **引導 (Guidance)**
    - "點擊 '新增醫令' 開始建立新的醫令。" (Click 'New Order' to start creating a new order.)
    - "輸入檢驗值後，點擊 '儲存' 或 '核發報告'。" (After entering test values, click 'Save' or 'Issue Report'.)

## 4. Dashboard 上的 Section 標題和描述

### 行政人員 Dashboard
- **標題**："待處理醫令概覽" (Pending Orders Overview)
    - **描述**："快速查看所有尚未處理的醫令，掌握最新進度。" (Quickly view all pending orders to stay on top of the latest progress.)
- **標題**："近期病患活動" (Recent Patient Activity)
    - **描述**："顯示近期新增或更新的病患資訊，方便管理。" (Displays recently added or updated patient information for easy management.)
- **標題**："系統訊息與通知" (System Messages & Notifications)
    - **描述**："重要系統通知與最新消息，確保資訊不遺漏。" (Important system notifications and latest news to ensure no information is missed.)

### 醫檢師 Dashboard
- **標題**："我的待辦檢驗清單" (My Pending Tests List)
    - **描述**："您今日需要處理的所有檢驗項目清單，按優先順序排序。" (A prioritized list of all test items you need to process today.)
- **標題**："即將逾期檢體" (Upcoming Expiring Specimens)
    - **描述**："提醒您注意即將超出保存期限的檢體，確保及時處理。" (Reminds you of specimens nearing their expiration date to ensure timely processing.)
- **標題**："報告審核概況" (Report Review Status)
    - **描述**："查看等待審核或已核發的報告狀態，高效管理。" (View the status of reports awaiting review or already issued for efficient management.)

### 客戶 Dashboard
- **標題**："我的最新檢驗報告" (My Latest Test Reports)
    - **描述**："最近一次的檢驗結果，一目瞭然。" (Your most recent test results at a glance.)
- **標題**："歷史報告快速連結" (Quick Links to Historical Reports)
    - **描述**："方便快速回顧過去的檢驗報告。" (Convenient access to past test reports.)
- **標題**："健康趨勢分析 (待開發)" (Health Trend Analysis (Coming Soon))
    - **描述**："追蹤您的健康數據長期變化，提供個人化分析報告。" (Track your long-term health data changes, providing personalized analytical reports.)

## 5. Landing/Login 頁面的歡迎文案

### Landing Page (假設有獨立 Landing Page)
- **標題**："LISA：您的智慧實驗室資訊系統" (LISA: Your Smart Laboratory Information System)
- **副標題**："簡化流程，提升效率，專注於科學的精確與人性的關懷。" (Streamline processes, enhance efficiency, focus on scientific precision and human care.)
- **按鈕**: "登入" (Login), "了解更多" (Learn More)
- **描述區塊**：
    - "**無縫整合**：從醫令開單到報告核發，一站式管理。" (Seamless Integration: From order entry to report issuance, all-in-one management.)
    - "**資料安全**：嚴格的數據加密與權限控管，保障隱私。" (Data Security: Strict data encryption and access control to protect privacy.)
    - "**直觀易用**：Muji 風格設計，讓複雜操作變得簡單。" (Intuitive and User-Friendly: Muji-style design makes complex operations simple.)

### Login Page
- **標題**："歡迎使用 LISA" (Welcome to LISA)
- **副標題**："請登入您的帳戶，開始實驗室管理。" (Please log in to your account to begin laboratory management.)
- **表單標籤**：
    - **使用者帳號** (Username)
    - **密碼** (Password)
- **按鈕**："登入" (Login)
- **連結**："忘記密碼？" (Forgot Password?)
- **提示**："本系統僅供授權使用者登入。" (This system is for authorized users only.)
