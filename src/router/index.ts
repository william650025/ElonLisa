import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/admin',
  },
  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { role: 'admin' },
  },
  // Tech routes
  {
    path: '/tech',
    name: 'TechDashboard',
    component: () => import('@/views/tech/TechDashboard.vue'),
    meta: { role: 'tech' },
  },
  // Client routes
  {
    path: '/client',
    name: 'ClientDashboard',
    component: () => import('@/views/client/ClientDashboard.vue'),
    meta: { role: 'client' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
