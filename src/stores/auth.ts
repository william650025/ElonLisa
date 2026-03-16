import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserRole, User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const currentRole = ref<UserRole | null>(
    (localStorage.getItem('lisa-role') as UserRole) || null
  )
  const currentUser = ref<User | null>(null)

  const isAuthenticated = computed(() => !!currentRole.value)

  const roleDisplayName = computed(() => {
    const map: Record<UserRole, string> = {
      admin: '行政人員',
      technologist: '醫檢師',
      client: '客戶',
    }
    return currentRole.value ? map[currentRole.value] : ''
  })

  function selectRole(role: UserRole) {
    currentRole.value = role
    localStorage.setItem('lisa-role', role)

    // 模擬使用者資料
    const mockUsers: Record<UserRole, User> = {
      admin: {
        id: 'U001',
        username: 'admin',
        displayName: '王小明',
        role: 'admin',
        email: 'admin@lisa.com',
        department: '行政部',
        title: '行政主管',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
      technologist: {
        id: 'U002',
        username: 'tech',
        displayName: '陳醫檢師',
        role: 'technologist',
        email: 'tech@lisa.com',
        department: '檢驗科',
        title: '資深醫檢師',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
      client: {
        id: 'U003',
        username: 'client',
        displayName: '林醫師',
        role: 'client',
        email: 'client@lisa.com',
        department: '內科',
        title: '主治醫師',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
      },
    }

    currentUser.value = mockUsers[role]
  }

  function logout() {
    currentRole.value = null
    currentUser.value = null
    localStorage.removeItem('lisa-role')
  }

  // 自動還原已選擇的角色
  if (currentRole.value) {
    selectRole(currentRole.value)
  }

  return {
    currentRole,
    currentUser,
    isAuthenticated,
    roleDisplayName,
    selectRole,
    logout,
  }
})
