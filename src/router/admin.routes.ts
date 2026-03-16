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
  ],
}

export default adminRoutes
