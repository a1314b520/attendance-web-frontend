<template>
  <div class="glass-card">
    <div class="page-head">
      <h3>申请情况</h3>
      <el-button icon="Refresh" circle @click="loadAll" />
    </div>

    <el-row :gutter="16" class="summary-row">
      <el-col :span="6">
        <div class="stat">
          <div class="num">{{ summary.leaveTotal ?? 0 }}</div>
          <div class="lab">请假</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat">
          <div class="num">{{ summary.tripTotal ?? 0 }}</div>
          <div class="lab">出差</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat">
          <div class="num">{{ summary.overtimeTotal ?? 0 }}</div>
          <div class="lab">加班</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat">
          <div class="num">{{ summary.makeupTotal ?? 0 }}</div>
          <div class="lab">补卡</div>
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" @tab-change="onTabChange">
      <el-tab-pane label="请假" name="leave">
        <el-select
          v-model="leaveStatus"
          placeholder="按状态筛选"
          clearable
          style="width: 200px; margin-bottom: 12px"
          @change="loadLeaves"
        >
          <el-option label="待审批" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已驳回" value="REJECTED" />
        </el-select>
        <el-table :data="leaves" v-loading="loading" stripe>
          <el-table-column prop="leaveType" label="请假类型" width="120" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="days" label="天数" width="90" align="center" />
          <el-table-column prop="reason" label="事由" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="110" align="center">
            <template #default="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="出差" name="trip">
        <el-select
          v-model="tripStatus"
          placeholder="按状态筛选"
          clearable
          style="width: 200px; margin-bottom: 12px"
          @change="loadTrips"
        >
          <el-option label="待审批" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已驳回" value="REJECTED" />
        </el-select>
        <el-table :data="trips" v-loading="loading" stripe>
          <el-table-column prop="destination" label="目的地" width="140" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="days" label="天数" width="90" align="center" />
          <el-table-column prop="reason" label="事由" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="110" align="center">
            <template #default="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="加班" name="overtime">
        <el-select
          v-model="overtimeStatus"
          placeholder="按状态筛选"
          clearable
          style="width: 200px; margin-bottom: 12px"
          @change="loadOvertimes"
        >
          <el-option label="待审批" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已驳回" value="REJECTED" />
        </el-select>
        <el-table :data="overtimes" v-loading="loading" stripe>
          <el-table-column prop="overtimeDate" label="加班日期" width="120" />
          <el-table-column prop="startTime" label="开始时间" />
          <el-table-column prop="endTime" label="结束时间" />
          <el-table-column prop="hours" label="时长(小时)" width="110" align="center" />
          <el-table-column prop="overtimeType" label="类型" width="100" />
          <el-table-column prop="reason" label="事由" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="110" align="center">
            <template #default="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="补卡" name="makeup">
        <el-select
          v-model="makeupStatus"
          placeholder="按状态筛选"
          clearable
          style="width: 200px; margin-bottom: 12px"
          @change="loadMakeups"
        >
          <el-option label="待审批" value="PENDING" />
          <el-option label="已通过" value="APPROVED" />
          <el-option label="已驳回" value="REJECTED" />
        </el-select>
        <el-table :data="makeups" v-loading="loading" stripe>
          <el-table-column prop="attDate" label="补卡日期" width="120" />
          <el-table-column prop="cardType" label="卡类型" width="100" />
          <el-table-column prop="originalTime" label="原打卡时间" />
          <el-table-column prop="cardTime" label="补卡时间" />
          <el-table-column prop="reason" label="事由" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" width="110" align="center">
            <template #default="{ row }">
              <StatusTag :status="row.status" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { defineComponent, h, onMounted, reactive, ref } from 'vue'
import { ElTag } from 'element-plus'
import { getApplySummary, getLeaves, getTrips, getOvertimes, getMakeups } from '@/api'

const activeTab = ref('leave')
const loading = ref(false)
const summary = reactive({})

const leaveStatus = ref('')
const tripStatus = ref('')
const overtimeStatus = ref('')
const makeupStatus = ref('')

const leaves = ref([])
const trips = ref([])
const overtimes = ref([])
const makeups = ref([])

// 状态标签组件
const StatusTag = defineComponent({
  props: { status: String },
  setup(props) {
    const map = {
      PENDING: { text: '待审批', type: 'warning' },
      APPROVED: { text: '已通过', type: 'success' },
      REJECTED: { text: '已驳回', type: 'danger' }
    }
    const item = map[props.status] || { text: props.status || '未知', type: 'info' }
    return () => h(ElTag, { type: item.type, size: 'small' }, () => item.text)
  }
})

const loadSummary = async () => {
  const data = await getApplySummary()
  Object.assign(summary, data || {})
}

const loadLeaves = async () => {
  loading.value = true
  try {
    leaves.value = (await getLeaves(leaveStatus.value)) || []
  } finally {
    loading.value = false
  }
}
const loadTrips = async () => {
  loading.value = true
  try {
    trips.value = (await getTrips(tripStatus.value)) || []
  } finally {
    loading.value = false
  }
}
const loadOvertimes = async () => {
  loading.value = true
  try {
    overtimes.value = (await getOvertimes(overtimeStatus.value)) || []
  } finally {
    loading.value = false
  }
}
const loadMakeups = async () => {
  loading.value = true
  try {
    makeups.value = (await getMakeups(makeupStatus.value)) || []
  } finally {
    loading.value = false
  }
}

const onTabChange = (name) => {
  if (name === 'leave' && leaves.value.length === 0 && !loading.value) loadLeaves()
  if (name === 'trip' && trips.value.length === 0 && !loading.value) loadTrips()
  if (name === 'overtime' && overtimes.value.length === 0 && !loading.value) loadOvertimes()
  if (name === 'makeup' && makeups.value.length === 0 && !loading.value) loadMakeups()
}

const loadAll = () => {
  loadSummary()
  loadLeaves()
  loadTrips()
  loadOvertimes()
  loadMakeups()
}

onMounted(loadAll)
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
.stat {
  text-align: center;
  padding: 18px 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.num {
  font-size: 30px;
  font-weight: 700;
  color: #409eff;
}
.lab {
  margin-top: 4px;
  color: #606266;
  font-size: 14px;
}
</style>
