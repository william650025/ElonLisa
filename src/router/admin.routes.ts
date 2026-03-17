import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  component: () => import('@/components/layout/AdminLayout.vue'),
  meta: { role: 'admin' },
  redirect: '/admin/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'AdminDashboard',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { title: '儀表板' },
    },
    {
      path: 'orders',
      name: 'OrderList',
      component: () => import('@/views/admin/OrderList.vue'),
      meta: { title: '醫令管理' },
    },
    {
      path: 'orders/create',
      name: 'OrderCreate',
      component: () => import('@/views/admin/OrderCreate.vue'),
      meta: { title: '開立醫令' },
    },
    {
      path: 'orders/:id',
      name: 'OrderDetail',
      component: () => import('@/views/admin/OrderDetail.vue'),
      meta: { title: '醫令詳情' },
      props: true,
    },
    {
      path: 'patients',
      name: 'PatientList',
      component: () => import('@/views/admin/PatientList.vue'),
      meta: { title: '病患管理' },
    },
    {
      path: 'patients/:id',
      name: 'PatientDetail',
      component: () => import('@/views/admin/PatientDetail.vue'),
      meta: { title: '病患詳情' },
      props: true,
    },
    {
      path: 'reports',
      name: 'AdminReportList',
      component: () => import('@/views/admin/AdminReportList.vue'),
      meta: { title: '報告管理' },
    },
    {
      path: 'settings',
      name: 'Settings',
      component: () => import('@/views/admin/Settings.vue'),
      meta: { title: '系統設定' },
    },
  ],
}

export default adminRoutes
