import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import adminRoutes from './admin.routes'
import techRoutes from './tech.routes'
import clientRoutes from './client.routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'RoleSelector',
    component: () => import('@/components/layout/RoleSelector.vue'),
  },
  adminRoutes,
  techRoutes,
  clientRoutes,
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  const role = localStorage.getItem('lisa-role')
  if (to.meta.role && to.meta.role !== role) {
    // 未選擇角色 → 導向角色選擇頁
    if (!role) return next('/')
    // 角色不符 → 導向自己的 dashboard
    return next(`/${role}/dashboard`)
  }
  next()
})

export default router
