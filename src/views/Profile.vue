<template>
  <div class="glass-card">
    <div class="page-head">
      <h3>个人信息</h3>
      <el-button icon="Refresh" circle @click="load" />
    </div>

    <el-descriptions :column="2" border v-if="user">
      <el-descriptions-item label="工号">{{ user.empNo }}</el-descriptions-item>
      <el-descriptions-item label="姓名">{{ user.empName }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ user.gender === 2 ? '女' : '男' }}</el-descriptions-item>
      <el-descriptions-item label="部门">{{ user.deptName || '未分配' }}</el-descriptions-item>
      <el-descriptions-item label="职位">{{ user.position || '-' }}</el-descriptions-item>
      <el-descriptions-item label="角色">
        <el-tag v-for="r in user.roles" :key="r" size="small" style="margin-right: 6px">{{ r }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="手机号">{{ user.phone || '-' }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ user.email || '-' }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getUserInfo } from '@/api'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const user = ref(userStore.user)

const load = async () => {
  const data = await getUserInfo()
  user.value = data
  userStore.setUser(data)
}
</script>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
</style>
