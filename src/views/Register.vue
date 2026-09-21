<template>
  <div class="auth-page">
    <div class="glass-card auth-card">
      <h2 class="auth-title">考勤系统 · 注册</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        size="large"
        @keyup.enter="handleRegister"
      >
        <el-form-item label="工号" prop="empNo">
          <el-input v-model="form.empNo" placeholder="请输入工号（唯一）" clearable />
        </el-form-item>
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="form.empName" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="至少 6 位" show-password clearable />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" placeholder="再次输入密码" show-password clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="full-btn" :loading="loading" @click="handleRegister">
            注 册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-footer">
        已有账号？
        <el-link type="primary" @click="$router.push('/login')">去登录</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  empNo: '',
  empName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const validateConfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  empNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  empName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度需在 6-32 位之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirm, trigger: 'blur' }
  ]
}

const handleRegister = async () => {
  await formRef.value.validate()
  loading.value = true
  try {
    const { confirmPassword, ...payload } = form
    await register(payload)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } catch (e) {
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
  width: 460px;
  max-width: 92vw;
  padding: 36px 36px 24px;
  color: #fff;
}
.auth-card :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.92) !important;
}
.auth-title {
  text-align: center;
  margin-bottom: 24px;
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
