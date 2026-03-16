import type { RouteRecordRaw } from 'vue-router'

const clientRoutes: RouteRecordRaw = {
  path: '/client',
  component: () => import('@/components/layout/ClientLayout.vue'),
  meta: { role: 'client' },
  redirect: '/client/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'ClientDashboard',
      component: () => import('@/views/client/ClientDashboard.vue'),
      meta: { title: '儀表板' },
    },
    {
      path: 'reports',
      name: 'ReportList',
      component: () => import('@/views/client/ReportList.vue'),
      meta: { title: '報告列表' },
    },
    {
      path: 'reports/:id',
      name: 'ReportDetail',
      component: () => import('@/views/client/ReportDetail.vue'),
      meta: { title: '報告詳情' },
      props: true,
    },
  ],
}

export default clientRoutes
