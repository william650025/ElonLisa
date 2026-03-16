import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'RoleSelector',
    component: () => import('@/components/layout/RoleSelector.vue'),
  },

  // Admin routes
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/admin/dashboard',
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { role: 'admin' },
      },
      {
        path: 'patients',
        name: 'AdminPatients',
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { role: 'admin' },
      },
    ],
  },

  // Tech routes
  {
    path: '/tech',
    component: () => import('@/components/layout/TechLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/tech/dashboard',
      },
      {
        path: 'dashboard',
        name: 'TechDashboard',
        component: () => import('@/views/tech/TechDashboard.vue'),
        meta: { role: 'technologist' },
      },
      {
        path: 'worklist',
        name: 'TechWorklist',
        component: () => import('@/views/tech/TechDashboard.vue'),
        meta: { role: 'technologist' },
      },
      {
        path: 'review',
        name: 'TechReview',
        component: () => import('@/views/tech/TechDashboard.vue'),
        meta: { role: 'technologist' },
      },
      {
        path: 'alerts',
        name: 'TechAlerts',
        component: () => import('@/views/tech/TechDashboard.vue'),
        meta: { role: 'technologist' },
      },
    ],
  },

  // Client routes
  {
    path: '/client',
    component: () => import('@/components/layout/ClientLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/client/dashboard',
      },
      {
        path: 'dashboard',
        name: 'ClientDashboard',
        component: () => import('@/views/client/ClientDashboard.vue'),
        meta: { role: 'client' },
      },
      {
        path: 'reports',
        name: 'ClientReports',
        component: () => import('@/views/client/ClientDashboard.vue'),
        meta: { role: 'client' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
