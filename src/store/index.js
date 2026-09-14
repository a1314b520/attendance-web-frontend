import { defineStore } from 'pinia'

/**
 * 用户态：token 与用户信息，持久化到 localStorage
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('att_token') || '',
    user: JSON.parse(localStorage.getItem('att_user') || 'null')
  }),
  getters: {
    isLogin: (state) => !!state.token,
    empName: (state) => state.user?.empName || '',
    empNo: (state) => state.user?.empNo || ''
  },
  actions: {
    setLogin(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('att_token', token)
      localStorage.setItem('att_user', JSON.stringify(user))
    },
    setUser(user) {
      this.user = user
      localStorage.setItem('att_user', JSON.stringify(user))
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('att_token')
      localStorage.removeItem('att_user')
    }
  }
})
