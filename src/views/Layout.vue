<template>
  <el-container class="layout">
    <el-header class="header glass-header">
      <div class="logo">考勤系统</div>
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <span class="user-trigger">
            <el-icon><User /></el-icon>
            {{ userStore.empName }}（{{ userStore.empNo }}）
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside glass-panel">
        <el-menu
          :default-active="$route.path"
          router
          class="glass-menu"
        >
          <el-menu-item index="/leave-balance">
            <el-icon><Calendar /></el-icon>
            <span>放假状态</span>
          </el-menu-item>
          <el-menu-item index="/applications">
            <el-icon><Document /></el-icon>
            <span>申请情况</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, ArrowDown, Calendar, Document } from '@element-plus/icons-vue'
import { useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()

const handleCommand = (cmd) => {
  if (cmd === 'logout') {
    userStore.logout()
    router.push('/login')
  } else if (cmd === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.logo {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #2c3e50;
}
.user-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #2c3e50;
}
.aside {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.glass-menu {
  border-right: none;
  background: transparent !important;
}
.glass-menu .el-menu-item {
  color: #2c3e50;
}
.glass-menu .el-menu-item.is-active {
  background: rgba(255, 255, 255, 0.5) !important;
}
.main {
  overflow: auto;
  padding: 20px;
}
</style>
