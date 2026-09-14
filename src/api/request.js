import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/store'

/**
 * axios 封装：统一 baseURL、JWT 请求头、响应拦截
 */
const request = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截：附加 token
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
})

// 响应拦截：解包 Result
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 非标准 Result 结构直接放行
    if (res && typeof res.code !== 'undefined') {
      if (res.code === 0) {
        return res.data
      }
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      ElMessage.error('登录已过期，请重新登录')
      router.push('/login')
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
