import request from './request'

/**
 * 后端接口封装
 */

// 认证
export const register = (data) => request.post('/auth/register', data)
export const login = (data) => request.post('/auth/login', data)

// 用户
export const getUserInfo = () => request.get('/user/info')

// 放假状态 / 假期余额
export const getLeaveBalance = () => request.get('/leave-balance/my')

// 四类申请记录（可按 status 筛选：PENDING/APPROVED/REJECTED）
export const getLeaves = (status = '') =>
  request.get('/leave/my', { params: { status } })
export const getTrips = (status = '') =>
  request.get('/trip/my', { params: { status } })
export const getOvertimes = (status = '') =>
  request.get('/overtime/my', { params: { status } })
export const getMakeups = (status = '') =>
  request.get('/makeup/my', { params: { status } })

// 申请情况汇总
export const getApplySummary = () => request.get('/apply/summary')
