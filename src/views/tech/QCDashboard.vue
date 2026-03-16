<script setup lang="ts">
import { ref } from 'vue'

const qcStats = ref([
  { label: '今日通過率', value: '97.8%', sub: '較昨日 +0.3%' },
  { label: '待覆核', value: '4', sub: '2 項超時' },
  { label: '已完成 QC', value: '128', sub: '今日累計' },
  { label: '異常件數', value: '3', sub: '需人工確認' },
])

const qcRecords = ref([
  { id: 'QC-001', item: 'GLU（血糖）', level: 'Level 1', result: '5.2 mmol/L', range: '4.8–5.6', status: 'pass', time: '08:15' },
  { id: 'QC-002', item: 'HbA1c', level: 'Level 2', result: '6.8%', range: '6.5–7.2', status: 'pass', time: '08:22' },
  { id: 'QC-003', item: 'ALT', level: 'Level 1', result: '52 U/L', range: '35–48', status: 'fail', time: '08:30' },
  { id: 'QC-004', item: 'Creatinine', level: 'Level 2', result: '1.1 mg/dL', range: '0.9–1.3', status: 'pass', time: '08:45' },
  { id: 'QC-005', item: 'WBC', level: 'Level 1', result: '7.2 x10³/μL', range: '6.8–7.8', status: 'pass', time: '09:01' },
  { id: 'QC-006', item: 'CRP', level: 'Level 1', result: '12.5 mg/L', range: '8.0–11.0', status: 'review', time: '09:15' },
])

function getStatusLabel(status: string): string {
  const map: Record<string, string> = { pass: '通過', fail: '失敗', review: '待覆核' }
  return map[status] || status
}

function getStatusClass(status: string): string {
  const map: Record<string, string> = {
    pass: 'text-green-700 bg-green-50',
    fail: 'text-red-700 bg-red-50',
    review: 'text-amber-700 bg-amber-50',
  }
  return map[status] || ''
}
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-light text-muji-text tracking-tight">品質控制</h1>
      <p class="text-sm text-muji-text-light mt-1">QC 總覽與記錄管理。</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in qcStats"
        :key="stat.label"
        class="border border-muji-border rounded-sm p-5 bg-muji-white"
      >
        <p class="text-xs text-muji-text-light tracking-wide uppercase">{{ stat.label }}</p>
        <p class="text-2xl font-light text-muji-text mt-1">{{ stat.value }}</p>
        <p class="text-xs text-muji-text-light mt-2">{{ stat.sub }}</p>
      </div>
    </div>

    <!-- QC Records Table -->
    <div class="border border-muji-border rounded-sm bg-muji-white overflow-hidden">
      <div class="px-5 py-4 border-b border-muji-border">
        <h2 class="text-sm font-medium text-muji-text">今日 QC 記錄</h2>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-muji-border text-left text-xs text-muji-text-light uppercase tracking-wide">
            <th class="px-5 py-3">編號</th>
            <th class="px-5 py-3">檢驗項目</th>
            <th class="px-5 py-3">品管級別</th>
            <th class="px-5 py-3">結果</th>
            <th class="px-5 py-3">允收範圍</th>
            <th class="px-5 py-3">狀態</th>
            <th class="px-5 py-3">時間</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="record in qcRecords"
            :key="record.id"
            class="border-b border-muji-border last:border-b-0 hover:bg-muji-bg/50 transition-colors"
          >
            <td class="px-5 py-3 text-muji-text-light">{{ record.id }}</td>
            <td class="px-5 py-3 text-muji-text">{{ record.item }}</td>
            <td class="px-5 py-3 text-muji-text-light">{{ record.level }}</td>
            <td class="px-5 py-3 text-muji-text font-mono text-xs">{{ record.result }}</td>
            <td class="px-5 py-3 text-muji-text-light font-mono text-xs">{{ record.range }}</td>
            <td class="px-5 py-3">
              <span
                :class="getStatusClass(record.status)"
                class="inline-block px-2 py-0.5 rounded text-xs"
              >
                {{ getStatusLabel(record.status) }}
              </span>
            </td>
            <td class="px-5 py-3 text-muji-text-light">{{ record.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
