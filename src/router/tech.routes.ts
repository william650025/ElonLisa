import type { RouteRecordRaw } from 'vue-router'

const techRoutes: RouteRecordRaw = {
  path: '/tech',
  component: () => import('@/components/layout/TechLayout.vue'),
  meta: { role: 'technologist' },
  redirect: '/tech/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'TechDashboard',
      component: () => import('@/views/tech/TechDashboard.vue'),
      meta: { title: '儀表板' },
    },
    {
      path: 'worklist',
      name: 'Worklist',
      component: () => import('@/views/tech/Worklist.vue'),
      meta: { title: '工作清單' },
    },
    {
      path: 'worklist/:id',
      name: 'ResultInput',
      component: () => import('@/views/tech/ResultInput.vue'),
      meta: { title: '輸入檢驗值' },
      props: true,
    },
    {
      path: 'review',
      name: 'ReviewList',
      component: () => import('@/views/tech/ReviewList.vue'),
      meta: { title: '待核發報告' },
    },
    {
      path: 'review/:id',
      name: 'ReviewDetail',
      component: () => import('@/views/tech/ReviewDetail.vue'),
      meta: { title: '報告審核' },
      props: true,
    },
    {
      path: 'reports/:id',
      name: 'TechReportDetail',
      component: () => import('@/views/tech/TechReportDetail.vue'),
      meta: { title: '報告詳情' },
      props: true,
    },
    {
      path: 'qc',
      name: 'QCDashboard',
      component: () => import('@/views/tech/QCDashboard.vue'),
      meta: { title: '品質控制' },
    },
  ],
}

export default techRoutes
