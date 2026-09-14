<template>
  <div class="auth-page">
    <div class="glass-card auth-card">
      <h2 class="auth-title">考勤系统 · 登录</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="工号" prop="empNo">
          <el-input v-model="form.empNo" placeholder="请输入工号" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="full-btn" :loading="loading" @click="handleLogin">
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-footer">
        还没有账号？
        <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api'
import { useUserStore } from '@/store'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  empNo: '',
  password: ''
})

const rules = {
  empNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    const data = await login({ ...form })
    userStore.setLogin(data.token, data.user)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/')
  } catch (e) {
    // 错误提示已由拦截器统一处理
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  /* 透明背景，透出 body 的深色光斑与玻璃效果 */
  background: transparent;
}
.auth-card {
  width: 420px;
  max-width: 92vw;
  padding: 40px 36px 28px;
  color: #fff;
}
.auth-card :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.92) !important;
}
.auth-title {
  text-align: center;
  margin-bottom: 28px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
}
.full-btn {
  width: 100%;
}
.auth-footer {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}
.auth-footer .el-link {
  color: #ffd86b;
  font-weight: 600;
}
</style>
