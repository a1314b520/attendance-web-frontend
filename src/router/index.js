import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: '/leave-balance',
    children: [
      {
        path: 'leave-balance',
        name: 'LeaveBalance',
        component: () => import('../views/LeaveBalance.vue'),
        meta: { title: '放假状态', icon: 'Calendar' }
      },
      {
        path: 'applications',
        name: 'Applications',
        component: () => import('../views/Applications.vue'),
        meta: { title: '申请情况', icon: 'Document' }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: '个人信息', icon: 'User' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：未登录跳转登录页
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const needAuth = !to.matched.some((r) => ['Login', 'Register'].includes(r.name))
  if (needAuth && !userStore.token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    if ((to.name === 'Login' || to.name === 'Register') && userStore.token) {
      next('/')
    } else {
      next()
    }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 考勤系统` : '考勤系统'
})

export default router
