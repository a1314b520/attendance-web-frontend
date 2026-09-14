<template>
  <div class="glass-card">
    <div class="page-head">
      <h3>放假状态 / 假期余额</h3>
      <el-button icon="Refresh" circle @click="load" />
    </div>

    <el-row :gutter="16" class="summary-row">
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-num">{{ totalDays }}</div>
          <div class="stat-label">可用总天数</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-num">{{ usedDays }}</div>
          <div class="stat-label">已用天数</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-num remain">{{ remainDays }}</div>
          <div class="stat-label">剩余天数</div>
        </div>
      </el-col>
    </el-row>

    <el-table :data="list" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="empName" label="员工" width="120" />
      <el-table-column prop="leaveType" label="假期类型" width="160" />
      <el-table-column prop="totalDays" label="总天数（天）" width="140" align="center" />
      <el-table-column prop="usedDays" label="已用（天）" width="140" align="center" />
      <el-table-column prop="remainDays" label="剩余（天）" align="center">
        <template #default="{ row }">
          <el-tag :type="row.remainDays > 0 ? 'success' : 'danger'">
            {{ row.remainDays }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && list.length === 0" description="暂无假期余额数据" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getLeaveBalance } from '@/api'

const list = ref([])
const loading = ref(false)

const totalDays = computed(() => list.value.reduce((s, i) => s + (i.totalDays || 0), 0))
const usedDays = computed(() => list.value.reduce((s, i) => s + (i.usedDays || 0), 0))
const remainDays = computed(() => list.value.reduce((s, i) => s + (i.remainDays || 0), 0))

const load = async () => {
  loading.value = true
  try {
    list.value = (await getLeaveBalance()) || []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.page-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.summary-row {
  margin-bottom: 20px;
}
.stat-card {
  text-align: center;
  padding: 20px 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.stat-num {
  font-size: 34px;
  font-weight: 700;
  color: #409eff;
}
.stat-num.remain {
  color: #67c23a;
}
.stat-label {
  margin-top: 6px;
  color: #606266;
  font-size: 14px;
}
</style>
