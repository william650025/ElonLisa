<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref('tests')

const sections = [
  { key: 'tests', label: '檢驗項目管理', iconClass: 'fa-solid fa-flask-vial' },
  { key: 'users', label: '使用者管理', iconClass: 'fa-solid fa-users' },
  { key: 'system', label: '系統參數', iconClass: 'fa-solid fa-sliders' },
]

// Mock data
const testItems = ref([
  { code: 'GLU', name: '血糖', unit: 'mmol/L', active: true },
  { code: 'HbA1c', name: '糖化血色素', unit: '%', active: true },
  { code: 'ALT', name: '丙胺酸轉胺酶', unit: 'U/L', active: true },
  { code: 'CRE', name: '肌酐', unit: 'mg/dL', active: false },
])

const users = ref([
  { name: '王醫檢師', role: '醫檢師', email: 'wang@lab.com', active: true },
  { name: '李主任', role: '管理員', email: 'lee@lab.com', active: true },
  { name: '陳護理師', role: '護理師', email: 'chen@lab.com', active: true },
])

const systemParams = ref([
  { key: 'report_auto_release', label: '報告自動發放', value: '停用', desc: '檢驗結果正常時自動發放報告' },
  { key: 'qc_frequency', label: 'QC 執行頻率', value: '每 8 小時', desc: '品管檢測執行間隔' },
  { key: 'session_timeout', label: '閒置逾時', value: '30 分鐘', desc: '使用者無操作自動登出時間' },
  { key: 'data_retention', label: '資料保留期限', value: '7 年', desc: '檢驗報告保留年限' },
])
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">系統設定</h1>
      <p class="text-sm text-muji-text-light mt-1">管理檢驗項目、使用者與系統參數。</p>
    </div>

    <div class="flex gap-8">
      <!-- Sidebar Nav -->
      <nav class="w-48 shrink-0 space-y-1">
        <button
          v-for="s in sections"
          :key="s.key"
          :class="[
            'w-full text-left px-4 py-2.5 text-sm rounded-sm transition-colors',
            activeSection === s.key
              ? 'bg-muji-bg text-muji-text font-medium'
              : 'text-muji-text-light hover:bg-muji-bg/50',
          ]"
          @click="activeSection = s.key"
        >
          <i :class="[s.iconClass, 'mr-2 text-xs w-4 text-center']"></i>{{ s.label }}
        </button>
      </nav>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <!-- 檢驗項目管理 -->
        <div v-if="activeSection === 'tests'" class="border border-muji-border rounded-sm bg-muji-white">
          <div class="px-5 py-4 border-b border-muji-border flex items-center justify-between">
            <h2 class="text-sm font-medium text-muji-text">檢驗項目</h2>
            <button class="text-xs px-3 py-1.5 border border-muji-border rounded-sm text-muji-text hover:bg-muji-bg transition-colors">
              + 新增項目
            </button>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-muji-border text-left text-xs text-muji-text-light uppercase tracking-wide">
                <th class="px-5 py-3">代碼</th>
                <th class="px-5 py-3">名稱</th>
                <th class="px-5 py-3">單位</th>
                <th class="px-5 py-3">狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in testItems"
                :key="item.code"
                class="border-b border-muji-border last:border-b-0"
              >
                <td class="px-5 py-3 font-mono text-xs text-muji-text">{{ item.code }}</td>
                <td class="px-5 py-3 text-muji-text">{{ item.name }}</td>
                <td class="px-5 py-3 text-muji-text-light">{{ item.unit }}</td>
                <td class="px-5 py-3">
                  <span
                    :class="item.active ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-100'"
                    class="inline-block px-2 py-0.5 rounded text-xs"
                  >
                    {{ item.active ? '啟用' : '停用' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 使用者管理 -->
        <div v-if="activeSection === 'users'" class="border border-muji-border rounded-sm bg-muji-white">
          <div class="px-5 py-4 border-b border-muji-border flex items-center justify-between">
            <h2 class="text-sm font-medium text-muji-text">使用者</h2>
            <button class="text-xs px-3 py-1.5 border border-muji-border rounded-sm text-muji-text hover:bg-muji-bg transition-colors">
              + 新增使用者
            </button>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-muji-border text-left text-xs text-muji-text-light uppercase tracking-wide">
                <th class="px-5 py-3">姓名</th>
                <th class="px-5 py-3">角色</th>
                <th class="px-5 py-3">Email</th>
                <th class="px-5 py-3">狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.email"
                class="border-b border-muji-border last:border-b-0"
              >
                <td class="px-5 py-3 text-muji-text">{{ user.name }}</td>
                <td class="px-5 py-3 text-muji-text-light">{{ user.role }}</td>
                <td class="px-5 py-3 text-muji-text-light font-mono text-xs">{{ user.email }}</td>
                <td class="px-5 py-3">
                  <span class="text-green-700 bg-green-50 inline-block px-2 py-0.5 rounded text-xs">
                    {{ user.active ? '啟用' : '停用' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 系統參數 -->
        <div v-if="activeSection === 'system'" class="border border-muji-border rounded-sm bg-muji-white">
          <div class="px-5 py-4 border-b border-muji-border">
            <h2 class="text-sm font-medium text-muji-text">系統參數</h2>
          </div>
          <div class="divide-y divide-muji-border">
            <div
              v-for="param in systemParams"
              :key="param.key"
              class="px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p class="text-sm text-muji-text">{{ param.label }}</p>
                <p class="text-xs text-muji-text-light mt-0.5">{{ param.desc }}</p>
              </div>
              <span class="text-sm text-muji-text font-mono bg-muji-bg px-3 py-1 rounded-sm">
                {{ param.value }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
